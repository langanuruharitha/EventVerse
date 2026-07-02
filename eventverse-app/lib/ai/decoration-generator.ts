// lib/ai/decoration-generator.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Types
export interface DecorationInput {
  eventType: string;
  theme?: string;
  venueType: string;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  budget: number;
  guestCount: number;
  style: 'modern' | 'traditional' | 'vintage' | 'rustic' | 'luxury' | 'minimalist';
  preferences?: {
    preferredFlowers?: string[];
    avoidColors?: string[];
    diyFriendly?: boolean;
    sustainableOptions?: boolean;
  };
}

export interface DecorationTheme {
  name: string;
  description: string;
  styleCategory: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    highlight?: string;
  };
  keyElements: string[];
  materials: string[];
  textures: string[];
  lighting: string[];
  floralSuggestions: string[];
}

export interface AreaDecorationPlan {
  areaName: string;
  description: string;
  keyElements: string[];
  items: DecorationItem[];
  estimatedCost: number;
  setupTime: number;
  priority: number;
}

export interface DecorationItem {
  category: string;
  itemName: string;
  description: string;
  quantity: number;
  estimatedCost: number;
  sourcingType: 'purchase' | 'rental' | 'diy';
  diyInstructions?: string;
  materialsNeeded?: string[];
  difficultyLevel?: string;
  timeRequired?: number;
}

export interface MoodBoardElements {
  colorSwatches: string[];
  textureReferences: string[];
  inspirationKeywords: string[];
  visualStyle: string;
}

export interface DecorationPlan {
  theme: DecorationTheme;
  areas: {
    entrance: AreaDecorationPlan;
    stage: AreaDecorationPlan;
    dining: AreaDecorationPlan;
    ceiling: AreaDecorationPlan;
    walls: AreaDecorationPlan;
  };
  itemChecklist: DecorationItem[];
  moodBoard: MoodBoardElements;
  costBreakdown: {
    entrance: number;
    stage: number;
    dining: number;
    ceiling: number;
    walls: number;
    total: number;
  };
  timeline: {
    setupStartTime: string;
    totalSetupHours: number;
    criticalPath: string[];
  };
  alternatives: {
    budgetFriendly: string[];
    premium: string[];
  };
}

// AI Decoration Generator Class
export class AIDecorationGenerator {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateDecorationPlan(input: DecorationInput): Promise<DecorationPlan> {
    try {
      // 1. Generate theme and color scheme
      const themePrompt = this.buildThemePrompt(input);
      const themeResponse = await this.model.generateContent(themePrompt);
      const theme = this.parseThemeResponse(await themeResponse.response.text());

      // 2. Create area-specific decoration plans
      const areas = await this.generateAreaPlans(input, theme);

      // 3. Generate detailed item checklist
      const itemChecklist = this.generateItemChecklist(areas);

      // 4. Create mood board elements
      const moodBoard = this.generateMoodBoard(theme, input.colors);

      // 5. Calculate cost breakdown
      const costBreakdown = this.calculateCosts(areas);

      // 6. Generate setup timeline
      const timeline = this.generateTimeline(areas);

      // 7. Create alternatives
      const alternatives = this.generateAlternatives(input, theme);

      return {
        theme,
        areas,
        itemChecklist,
        moodBoard,
        costBreakdown,
        timeline,
        alternatives,
      };
    } catch (error) {
      console.error('Error generating decoration plan:', error);
      throw new Error('Failed to generate decoration plan');
    }
  }

  private buildThemePrompt(input: DecorationInput): string {
    return `
You are an expert Indian event decorator. Create a detailed decoration plan for:

Event Type: ${input.eventType}
Theme: ${input.theme || 'Suggest appropriate theme'}
Venue: ${input.venueType}
Style: ${input.style}
Budget: ₹${input.budget.toLocaleString('en-IN')}
Guest Count: ${input.guestCount}
Primary Color: ${input.colors.primary}
Secondary Color: ${input.colors.secondary || 'complementary to primary'}

Generate a comprehensive decoration theme with:
1. Theme name and detailed description
2. Complete color palette (5-6 colors with hex codes)
3. Key design elements (minimum 5)
4. Suggested materials and textures (minimum 5)
5. Lighting recommendations (ambient, accent, decorative)
6. Floral suggestions (specific Indian flowers)

Focus on:
- Indian market availability
- Cultural preferences
- Budget-appropriate suggestions
- Seasonal considerations
- DIY-friendly options

Return ONLY valid JSON in this exact format:
{
  "name": "Theme Name",
  "description": "Detailed description",
  "styleCategory": "${input.style}",
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "highlight": "#hex"
  },
  "keyElements": ["element1", "element2", "element3", "element4", "element5"],
  "materials": ["material1", "material2", "material3", "material4", "material5"],
  "textures": ["texture1", "texture2", "texture3"],
  "lighting": ["lighting1", "lighting2", "lighting3"],
  "floralSuggestions": ["flower1", "flower2", "flower3"]
}
    `.trim();
  }

  private parseThemeResponse(responseText: string): DecorationTheme {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as DecorationTheme;
    } catch (error) {
      console.error('Error parsing theme response:', error);
      // Return fallback theme
      return this.getFallbackTheme();
    }
  }


  private async generateAreaPlans(
    input: DecorationInput,
    theme: DecorationTheme
  ): Promise<DecorationPlan['areas']> {
    const budgetAllocation = {
      entrance: 0.15, // 15%
      stage: 0.30,    // 30%
      dining: 0.25,   // 25%
      ceiling: 0.15,  // 15%
      walls: 0.15,    // 15%
    };

    const areas: any = {};

    for (const [areaName, percentage] of Object.entries(budgetAllocation)) {
      const areaBudget = input.budget * percentage;
      const areaPrompt = `
Create specific decoration plan for ${areaName} area:

Theme: ${theme.name}
Style: ${input.style}
Venue: ${input.venueType}
Budget: ₹${areaBudget.toLocaleString('en-IN')}
Guest Count: ${input.guestCount}
Colors: ${theme.colorPalette.primary}, ${theme.colorPalette.secondary}

Provide decoration plan with:
1. Area description and purpose
2. Key decorative elements (5-7 items)
3. Specific items with quantities and costs
4. Setup time estimate
5. Priority level (1-5)

Return ONLY valid JSON:
{
  "areaName": "${areaName}",
  "description": "Description",
  "keyElements": ["element1", "element2"],
  "items": [
    {
      "category": "${areaName}",
      "itemName": "Item name",
      "description": "Item description",
      "quantity": 5,
      "estimatedCost": 5000,
      "sourcingType": "purchase",
      "difficultyLevel": "medium"
    }
  ],
  "estimatedCost": ${areaBudget},
  "setupTime": 2,
  "priority": 3
}
      `.trim();

      try {
        const response = await this.model.generateContent(areaPrompt);
        const text = await response.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          areas[areaName] = JSON.parse(jsonMatch[0]);
        } else {
          areas[areaName] = this.getFallbackAreaPlan(areaName, areaBudget);
        }
      } catch (error) {
        console.error(`Error generating ${areaName} plan:`, error);
        areas[areaName] = this.getFallbackAreaPlan(areaName, areaBudget);
      }
    }

    return areas;
  }

  private generateItemChecklist(areas: DecorationPlan['areas']): DecorationItem[] {
    const items: DecorationItem[] = [];
    
    Object.values(areas).forEach(area => {
      if (area && area.items) {
        items.push(...area.items);
      }
    });

    return items;
  }

  private generateMoodBoard(
    theme: DecorationTheme,
    colors: DecorationInput['colors']
  ): MoodBoardElements {
    return {
      colorSwatches: [
        theme.colorPalette.primary,
        theme.colorPalette.secondary,
        theme.colorPalette.accent,
        theme.colorPalette.highlight || colors.accent || '#FFFFFF',
      ],
      textureReferences: theme.textures,
      inspirationKeywords: theme.keyElements.slice(0, 5),
      visualStyle: theme.styleCategory,
    };
  }

  private calculateCosts(areas: DecorationPlan['areas']): DecorationPlan['costBreakdown'] {
    return {
      entrance: areas.entrance?.estimatedCost || 0,
      stage: areas.stage?.estimatedCost || 0,
      dining: areas.dining?.estimatedCost || 0,
      ceiling: areas.ceiling?.estimatedCost || 0,
      walls: areas.walls?.estimatedCost || 0,
      total: Object.values(areas).reduce((sum, area) => sum + (area?.estimatedCost || 0), 0),
    };
  }


  private generateTimeline(areas: DecorationPlan['areas']): DecorationPlan['timeline'] {
    const totalSetupHours = Object.values(areas).reduce(
      (sum, area) => sum + (area?.setupTime || 0),
      0
    );

    const criticalPath = Object.entries(areas)
      .filter(([_, area]) => area && area.priority <= 2)
      .map(([name]) => name);

    return {
      setupStartTime: '08:00 AM',
      totalSetupHours,
      criticalPath,
    };
  }

  private generateAlternatives(
    input: DecorationInput,
    theme: DecorationTheme
  ): DecorationPlan['alternatives'] {
    const budgetFriendly = [
      'Use DIY paper decorations instead of fresh flowers',
      'Opt for LED string lights instead of designer fixtures',
      'Create balloon arrangements instead of floral centerpieces',
      'Use fabric draping instead of elaborate wall panels',
      'Digital invitation displays instead of printed signage',
    ];

    const premium = [
      'Add custom projection mapping on walls',
      'Include fresh exotic flower arrangements',
      'Install designer chandeliers and lighting',
      'Add luxury fabric draping with embroidery',
      'Include live plants and vertical gardens',
    ];

    return {
      budgetFriendly: budgetFriendly.slice(0, 3),
      premium: premium.slice(0, 3),
    };
  }

  private getFallbackTheme(): DecorationTheme {
    return {
      name: 'Classic Elegance',
      description: 'A timeless decoration theme with elegant touches',
      styleCategory: 'modern',
      colorPalette: {
        primary: '#6366f1',
        secondary: '#f59e0b',
        accent: '#FFFFFF',
        highlight: '#10b981',
      },
      keyElements: ['Floral arrangements', 'Elegant draping', 'Ambient lighting', 'Centerpieces', 'Entrance arch'],
      materials: ['Silk fabric', 'Fresh flowers', 'LED lights', 'Wooden elements', 'Glass vases'],
      textures: ['Smooth silk', 'Natural wood', 'Glass'],
      lighting: ['Warm ambient', 'Accent spotlights', 'String lights'],
      floralSuggestions: ['Roses', 'Marigolds', 'Orchids'],
    };
  }


  private getFallbackAreaPlan(areaName: string, budget: number): AreaDecorationPlan {
    return {
      areaName,
      description: `Decoration plan for ${areaName} area`,
      keyElements: ['Basic decoration', 'Color coordination', 'Lighting'],
      items: [
        {
          category: areaName,
          itemName: `${areaName.charAt(0).toUpperCase() + areaName.slice(1)} decoration set`,
          description: 'Standard decoration package',
          quantity: 1,
          estimatedCost: budget * 0.8,
          sourcingType: 'rental',
          difficultyLevel: 'medium',
        },
      ],
      estimatedCost: budget,
      setupTime: 2,
      priority: 3,
    };
  }
}

// Export a singleton instance
export const decorationGenerator = new AIDecorationGenerator();

// Helper function for quick generation
export async function generateDecorationPlan(input: DecorationInput): Promise<DecorationPlan> {
  return decorationGenerator.generateDecorationPlan(input);
}
