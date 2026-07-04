'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Camera, Upload, Grid, List, Map, Users, Sparkles, Download, Share2, Plus } from 'lucide-react';

interface Album {
  id: string;
  album_name: string;
  description: string;
  album_type: string;
  is_smart_album: boolean;
  photo_count: number;
  video_count: number;
  cover_image_url: string;
  created_at: string;
}

export default function MemoryVaultPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [organizing, setOrganizing] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  useEffect(() => {
    fetchAlbums();
  }, [eventId]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/memory/albums?eventId=${eventId}`);
      const data = await response.json();
      
      if (response.ok) {
        setAlbums(data.albums || []);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizePhotos = async () => {
    try {
      setOrganizing(true);
      const response = await fetch('/api/memory/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`✨ Created ${data.albumsCreated} smart albums with ${data.totalPhotos} photos!`);
        fetchAlbums();
      } else {
        alert(data.error || 'Failed to organize photos');
      }
    } catch (error) {
      console.error('Error organizing photos:', error);
      alert('Failed to organize photos');
    } finally {
      setOrganizing(false);
    }
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) {
      alert('Please enter an album name');
      return;
    }

    try {
      const response = await fetch('/api/memory/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          albumName: newAlbumName,
          description: '',
          privacySetting: 'private',
          allowGuestUpload: false,
          allowDownload: true,
          allowComments: true
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAlbums([data.album, ...albums]);
        setNewAlbumName('');
        setShowCreateAlbum(false);
      } else {
        alert(data.error || 'Failed to create album');
      }
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Failed to create album');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Memory Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <Camera className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Memory Vault</h1>
                <p className="text-sm text-gray-500">
                  AI-powered photo organization & sharing
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              {/* Action Buttons */}
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      alert(`Selected ${files.length} file(s). Photo upload feature requires Supabase Storage setup. See MEMORY-VAULT-SETUP-REQUIRED.md for instructions.`);
                    }
                  }}
                />
              </label>
              
              <button
                onClick={handleOrganizePhotos}
                disabled={organizing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>{organizing ? 'Organizing...' : 'AI Organize'}</span>
              </button>
              
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>New Album</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Albums</div>
            <div className="text-2xl font-bold text-gray-900">{albums.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Photos</div>
            <div className="text-2xl font-bold text-gray-900">
              {albums.reduce((sum, a) => sum + a.photo_count, 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Videos</div>
            <div className="text-2xl font-bold text-gray-900">
              {albums.reduce((sum, a) => sum + a.video_count, 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Smart Albums</div>
            <div className="text-2xl font-bold text-gray-900">
              {albums.filter(a => a.is_smart_album).length}
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        {albums.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Albums Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first album or upload photos to get started
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Album
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Upload Photos
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}>
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Album Cover */}
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative">
                  {album.cover_image_url ? (
                    <img
                      src={album.cover_image_url}
                      alt={album.album_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {album.is_smart_album && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Smart</span>
                    </div>
                  )}
                </div>
                
                {/* Album Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {album.album_name}
                  </h3>
                  {album.description && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{album.photo_count} photos</span>
                    <span>{new Date(album.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => alert(`View feature: Album "${album.album_name}" will show all photos. Create album detail page to enable this.`)}
                      className="flex-1 text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/memory/shared/${album.id}`;
                        navigator.clipboard.writeText(shareUrl);
                        alert(`Share link copied to clipboard!\n\n${shareUrl}\n\nNote: Sharing feature requires share page implementation.`);
                      }}
                      className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                      title="Share album"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => alert(`Download feature: Would download all ${album.photo_count} photos from "${album.album_name}". Requires download API implementation.`)}
                      className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                      title="Download album"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Album Modal */}
      {showCreateAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Album</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Album Name
              </label>
              <input
                type="text"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="e.g., Wedding Ceremony, Reception, Pre-Wedding"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateAlbum(false);
                  setNewAlbumName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlbum}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Album
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
