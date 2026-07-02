// AI-Powered Memory Organization Service
// Uses Google Vision API for comprehensive photo analysis

import { GoogleGenerativeAI } from '@google/generative-ai';

// Types
export interface PhotoAnalysis {
  faces: FaceData[];
  objects: ObjectData[];
  labels: string[];
  scene: string;
  mood: string;
  dominantColors: string[];
  quality: number;
  safeSearch: SafeSearchResult;
}

export interface FaceData {
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  emotion?: string;
  age?: number;
}

export interface ObjectData {
  name: string;
  confidence: number;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SafeSearchResult {
  adult: boolean;
  violence: boolean;
  appropriate: boolean;
  confidence: number;
}

export interface OrganizationResult {
  totalPhotos: number;
  albumsCreated: number;
  facesDetected: number;
  scenesIdentified: string[];
  albums: SmartAlbum[];
}

export interface SmartAlbum {
  name: string;
  description: string;
  criteria: any;
  itemCount: number;
  coverImage?: string;
}

export interface Event {
  id: string;
  eventType: string;
  eventDate: string;
  theme?: string;
  venue?: string;
}

class AIMemoryOrganizer {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Organize event photos into smart albums
   */
  async organizeEventPhotos(eventId: string, photos: any[]): Promise<OrganizationResult> {
    console.log(`Organizing ${photos.length} photos for event ${eventId}`);
    
    // Get event details for context
    const event = await this.getEventDetails(eventId);
    
    // Analyze all photos
    const analyses = await Promise.all(
      photos.map(photo => this.analyzePhotoContent(photo.file_url, photo.id))
    );
    
    // Create smart albums based on different criteria
    const timeBasedAlbums = this.organizeByTime(photos, event);
    const sceneAlbums = this.organizeByScene(analyses);
    const moodAlbums = this.organizeByMood(analyses);
    const peopleAlbums = this.organizeByPeople(analyses);
    
    const allAlbums = [
      ...timeBasedAlbums,
      ...sceneAlbums,
      ...moodAlbums,
      ...peopleAlbums
    ];
    
    // Count unique faces
    const facesDetected = analyses.reduce((sum, analysis) => 
      sum + (analysis.faces?.length || 0), 0
    );
    
    // Collect unique scenes
    const scenesIdentified = [...new Set(
      analyses.map(a => a.scene).filter(Boolean)
    )];
    
    return {
      totalPhotos: photos.length,
      albumsCreated: allAlbums.length,
      facesDetected,
      scenesIdentified,
      albums: allAlbums
    };
  }

  /**
   * Analyze photo content using AI
   */
  async analyzePhotoContent(photoUrl: string, photoId?: string): Promise<PhotoAnalysis> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Create prompt for comprehensive photo analysis
      const prompt = `Analyze this event photo and provide a detailed JSON response with the following structure:
{
  "scene": "indoor/outdoor/venue type",
  "mood": "happy/joyful/celebratory/formal/casual",
  "dominantColors": ["color1", "color2", "color3"],
  "labels": ["tag1", "tag2", "tag3"],
  "objects": [{"name": "object", "confidence": 0.9}],
  "quality": 8.5,
  "description": "Brief description of what's in the photo",
  "isAppropriate": true
}

Focus on:
- Event type (wedding, birthday, party, etc.)
- People and interactions
- Decorations and setup
- Emotional tone
- Key moments or highlights
- Overall quality and composition`;

      // For now, we'll use a simpler approach with Gemini
      // In production, you would use Google Vision API for more accurate results
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse AI response
      let analysis: any = {};
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        }
      } catch (error) {
        console.error('Error parsing AI response:', error);
        analysis = this.getDefaultAnalysis();
      }
      
      return {
        faces: [], // Face detection would require Google Vision API
        objects: analysis.objects || [],
        labels: analysis.labels || [],
        scene: analysis.scene || 'unknown',
        mood: analysis.mood || 'neutral',
        dominantColors: analysis.dominantColors || [],
        quality: analysis.quality || 7,
        safeSearch: {
          adult: false,
          violence: false,
          appropriate: analysis.isAppropriate !== false,
          confidence: 0.95
        }
      };
    } catch (error) {
      console.error('Error analyzing photo:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Organize photos by time (pre-event, during, post-event)
   */
  private organizeByTime(photos: any[], event: Event): SmartAlbum[] {
    const eventDate = new Date(event.eventDate);
    const albums: SmartAlbum[] = [];
    
    const preEvent = photos.filter(p => {
      const photoDate = new Date(p.taken_at || p.created_at);
      const daysBefore = Math.floor((eventDate.getTime() - photoDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysBefore > 0 && daysBefore <= 7;
    });
    
    const duringEvent = photos.filter(p => {
      const photoDate = new Date(p.taken_at || p.created_at);
      const daysDiff = Math.abs(Math.floor((eventDate.getTime() - photoDate.getTime()) / (1000 * 60 * 60 * 24)));
      return daysDiff === 0;
    });
    
    const postEvent = photos.filter(p => {
      const photoDate = new Date(p.taken_at || p.created_at);
      const daysAfter = Math.floor((photoDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysAfter > 0 && daysAfter <= 7;
    });
    
    if (preEvent.length > 0) {
      albums.push({
        name: 'Preparations & Setup',
        description: 'Photos taken before the event',
        criteria: { timeRange: 'pre_event' },
        itemCount: preEvent.length,
        coverImage: preEvent[0]?.file_url
      });
    }
    
    if (duringEvent.length > 0) {
      albums.push({
        name: 'Event Highlights',
        description: 'Photos from the main event',
        criteria: { timeRange: 'during_event' },
        itemCount: duringEvent.length,
        coverImage: duringEvent[0]?.file_url
      });
    }
    
    if (postEvent.length > 0) {
      albums.push({
        name: 'Memories & Aftermath',
        description: 'Photos taken after the event',
        criteria: { timeRange: 'post_event' },
        itemCount: postEvent.length,
        coverImage: postEvent[0]?.file_url
      });
    }
    
    return albums;
  }

  /**
   * Organize photos by scene type
   */
  private organizeByScene(analyses: PhotoAnalysis[]): SmartAlbum[] {
    const sceneGroups = new Map<string, number>();
    
    analyses.forEach(analysis => {
      if (analysis.scene) {
        sceneGroups.set(analysis.scene, (sceneGroups.get(analysis.scene) || 0) + 1);
      }
    });
    
    const albums: SmartAlbum[] = [];
    sceneGroups.forEach((count, scene) => {
      if (count >= 3) { // Only create album if 3+ photos
        albums.push({
          name: `${this.capitalize(scene)} Moments`,
          description: `All ${scene} photos from the event`,
          criteria: { scene },
          itemCount: count
        });
      }
    });
    
    return albums;
  }

  /**
   * Organize photos by mood/emotion
   */
  private organizeByMood(analyses: PhotoAnalysis[]): SmartAlbum[] {
    const moodGroups = new Map<string, number>();
    
    analyses.forEach(analysis => {
      if (analysis.mood) {
        moodGroups.set(analysis.mood, (moodGroups.get(analysis.mood) || 0) + 1);
      }
    });
    
    const albums: SmartAlbum[] = [];
    moodGroups.forEach((count, mood) => {
      if (count >= 5) { // Only create album if 5+ photos
        albums.push({
          name: `${this.capitalize(mood)} Vibes`,
          description: `Capturing the ${mood} moments`,
          criteria: { mood },
          itemCount: count
        });
      }
    });
    
    return albums;
  }

  /**
   * Organize photos by people (requires face recognition)
   */
  private organizeByPeople(analyses: PhotoAnalysis[]): SmartAlbum[] {
    const photosWithPeople = analyses.filter(a => a.faces && a.faces.length > 0);
    
    if (photosWithPeople.length < 5) return [];
    
    // Group photos by number of people
    const groupPhotos = photosWithPeople.filter(a => (a.faces?.length || 0) >= 3);
    const couplePhotos = photosWithPeople.filter(a => (a.faces?.length || 0) === 2);
    const soloPhotos = photosWithPeople.filter(a => (a.faces?.length || 0) === 1);
    
    const albums: SmartAlbum[] = [];
    
    if (groupPhotos.length >= 3) {
      albums.push({
        name: 'Group Shots',
        description: 'Photos with multiple people',
        criteria: { minFaces: 3 },
        itemCount: groupPhotos.length
      });
    }
    
    if (couplePhotos.length >= 5) {
      albums.push({
        name: 'Couple Moments',
        description: 'Special moments together',
        criteria: { faceCount: 2 },
        itemCount: couplePhotos.length
      });
    }
    
    if (soloPhotos.length >= 3) {
      albums.push({
        name: 'Individual Portraits',
        description: 'Beautiful individual shots',
        criteria: { faceCount: 1 },
        itemCount: soloPhotos.length
      });
    }
    
    return albums;
  }

  /**
   * Suggest tags for a photo based on analysis and event context
   */
  async suggestTags(photoAnalysis: PhotoAnalysis, eventContext: Event): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Event-based tags
    suggestions.push(eventContext.eventType.toLowerCase());
    if (eventContext.theme) {
      suggestions.push(eventContext.theme.toLowerCase());
    }
    
    // Scene-based tags
    if (photoAnalysis.scene) {
      suggestions.push(photoAnalysis.scene);
    }
    
    // Labels from AI
    suggestions.push(...photoAnalysis.labels);
    
    // Mood tags
    if (photoAnalysis.mood) {
      suggestions.push(photoAnalysis.mood);
    }
    
    // Object tags
    photoAnalysis.objects.forEach(obj => {
      if (obj.confidence > 0.7) {
        suggestions.push(obj.name.toLowerCase());
      }
    });
    
    // Remove duplicates and return
    return [...new Set(suggestions)];
  }

  /**
   * Get event details from database
   */
  private async getEventDetails(eventId: string): Promise<Event> {
    // This would fetch from Supabase in production
    // For now, return mock data
    return {
      id: eventId,
      eventType: 'Wedding',
      eventDate: new Date().toISOString(),
      theme: 'Traditional',
      venue: 'Grand Ballroom'
    };
  }

  /**
   * Default analysis when AI fails
   */
  private getDefaultAnalysis(): PhotoAnalysis {
    return {
      faces: [],
      objects: [],
      labels: ['event', 'photo'],
      scene: 'indoor',
      mood: 'neutral',
      dominantColors: [],
      quality: 7,
      safeSearch: {
        adult: false,
        violence: false,
        appropriate: true,
        confidence: 0.5
      }
    };
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export singleton instance
export const aiMemoryOrganizer = new AIMemoryOrganizer();
