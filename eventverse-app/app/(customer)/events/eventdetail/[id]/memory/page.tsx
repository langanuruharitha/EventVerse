'use client';
import { useToast } from '@/components/ui/Toast';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Camera, Upload, Grid, List, Sparkles, Download, Share2, Plus } from 'lucide-react';

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
  const toast = useToast();
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [organizing, setOrganizing] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  useEffect(() => { fetchAlbums(); }, [eventId]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/memory/albums?eventId=${eventId}`);
      const data = await response.json();
      if (response.ok) setAlbums(data.albums || []);
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
        toast('Created ${data.albumsCreated} smart albums with ${data.totalPhotos} photos!', 'success');
        fetchAlbums();
      } else {
        toast(data.error || 'Failed to organize photos', 'error');
      }
    } catch (error) {
      toast('Failed to organize photos', 'error');
    } finally {
      setOrganizing(false);
    }
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) { toast('Please enter an album name', 'warning'); return; }
    try {
      const response = await fetch('/api/memory/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId, albumName: newAlbumName, description: '',
          privacySetting: 'private', allowGuestUpload: false,
          allowDownload: true, allowComments: true
        })
      });
      const data = await response.json();
      if (response.ok) {
        setAlbums([data.album, ...albums]);
        setNewAlbumName('');
        setShowCreateAlbum(false);
      } else {
        toast(data.error || 'Failed to create album', 'error');
      }
    } catch (error) {
      toast('Failed to create album', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">📷</div>
          <p className="text-xs text-[#1F1E1B]/50 italic font-sans">Loading Memory Vault...</p>
        </div>
      </div>
    );
  }

  const totalPhotos = albums.reduce((sum, a) => sum + a.photo_count, 0);
  const totalVideos = albums.reduce((sum, a) => sum + a.video_count, 0);
  const smartAlbums = albums.filter(a => a.is_smart_album).length;

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
              >
                ← Back
              </button>
              <div className="w-px h-5 bg-[#DDD0BB]" />
              <div>
                <h1 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#8A1C2C]" /> Memory Vault
                </h1>
                <p className="text-[10px] text-[#1F1E1B]/40 italic font-sans">AI-powered photo organization & sharing</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View mode */}
              <div className="flex bg-[#FAF6F0] border border-[#DDD0BB] rounded p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white shadow border border-[#DDD0BB]' : ''}`}
                >
                  <Grid className="w-4 h-4 text-[#1F1E1B]/60" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-white shadow border border-[#DDD0BB]' : ''}`}
                >
                  <List className="w-4 h-4 text-[#1F1E1B]/60" />
                </button>
              </div>

              <label className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DDD0BB] text-xs font-semibold text-[#1F1E1B]/70 rounded hover:bg-[#FAF6F0] cursor-pointer font-sans transition">
                <Upload className="w-3.5 h-3.5" /> Upload
                <input type="file" multiple accept="image/*,video/*" className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      toast('Selected ${files.length} file(s). Photo upload requires Supabase Storage setup.', 'warning');
                    }
                  }} />
              </label>

              <button
                onClick={handleOrganizePhotos}
                disabled={organizing}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DDD0BB] text-xs font-semibold text-[#1F1E1B]/70 rounded hover:bg-[#FAF6F0] disabled:opacity-50 font-sans transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> {organizing ? 'Organising...' : 'AI Organise'}
              </button>

              <button
                onClick={() => setShowCreateAlbum(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-semibold rounded hover:shadow transition font-sans"
              >
                <Plus className="w-3.5 h-3.5" /> New Album
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Albums', value: albums.length },
            { label: 'Photos', value: totalPhotos },
            { label: 'Videos', value: totalVideos },
            { label: 'Smart Albums', value: smartAlbums },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-[#DDD0BB] rounded p-4 text-center shadow-sm">
              <div className="text-[10px] text-[#1F1E1B]/50 uppercase tracking-wider font-sans mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-[#8A1C2C] font-sans">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {albums.length === 0 ? (
          <div className="bg-white border border-dashed border-[#DDD0BB] rounded p-12 text-center shadow-sm">
            <Camera className="w-12 h-12 text-[#DDD0BB] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#2C1810] mb-2">No Albums Yet</h3>
            <p className="text-xs text-[#1F1E1B]/50 italic mb-6">Create your first album or upload photos to begin</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-semibold rounded hover:shadow font-sans transition"
              >
                Create Album
              </button>
              <button className="px-5 py-2 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] font-sans transition">
                Upload Photos
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-5' : 'space-y-4'}>
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Cover */}
                <div className="aspect-video bg-[#EDE0CC] relative">
                  {album.cover_image_url ? (
                    <img src={album.cover_image_url} alt={album.album_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Camera className="w-10 h-10 text-[#DDD0BB]" />
                    </div>
                  )}
                  {album.is_smart_album && (
                    <div className="absolute top-2 right-2 bg-[#8A1C2C] text-[#FAF0E0] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 font-sans">
                      <Sparkles className="w-2.5 h-2.5" /> Smart
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-sm text-[#2C1810] mb-0.5">{album.album_name}</h3>
                  {album.description && (
                    <p className="text-[11px] text-[#1F1E1B]/50 italic mb-2 line-clamp-2">{album.description}</p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-[#1F1E1B]/40 font-sans mb-3">
                    <span>{album.photo_count} photos</span>
                    <span>{new Date(album.created_at).toLocaleDateString('en-IN')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 border-t border-[#FAF6F0] pt-3">
                    <button
                      onClick={() => toast(`Viewing album: "${album.album_name}"`, 'info')}
                      className="flex-1 text-[11px] font-semibold py-1.5 border border-[#DDD0BB] rounded text-[#7A6652] hover:bg-[#FAF6F0] transition font-sans"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/memory/shared/${album.id}`;
                        navigator.clipboard.writeText(shareUrl);
                        toast(`Share link copied: ${shareUrl}`, 'success');
                      }}
                      className="p-1.5 border border-[#DDD0BB] rounded hover:bg-[#FAF6F0] transition"
                      title="Share album"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#7A6652]" />
                    </button>
                    <button
                      onClick={() => toast(`Downloading ${album.photo_count} photos from "${album.album_name}"...`, 'info')}
                      className="p-1.5 border border-[#DDD0BB] rounded hover:bg-[#FAF6F0] transition"
                      title="Download album"
                    >
                      <Download className="w-3.5 h-3.5 text-[#7A6652]" />
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#DDD0BB] rounded shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-base font-bold text-[#2C1810] mb-4">Create New Album</h2>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#1F1E1B]/70 uppercase tracking-wider font-sans mb-2">
                Album Name
              </label>
              <input
                type="text"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="e.g., Wedding Ceremony, Reception..."
                className="w-full px-3 py-2 text-sm border border-[#DDD0BB] rounded focus:outline-none focus:border-[#8A1C2C] bg-[#FAF6F0] font-sans"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAlbum()}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowCreateAlbum(false); setNewAlbumName(''); }}
                className="flex-1 px-4 py-2 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] font-sans transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlbum}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-semibold rounded hover:shadow font-sans transition"
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
