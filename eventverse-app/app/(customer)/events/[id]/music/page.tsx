'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Music, Play, Plus, CheckCircle2, Send, Download, Sparkles, Volume2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface Song {
  id: string;
  title: string;
  artist: string;
  category: 'Sangeet' | 'Baraat' | 'Bride Entry' | 'Reception' | 'Cocktail';
  duration: string;
  approved: boolean;
}

export default function AIMusicPlaylistPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const toast = useToast();

  const [playlist, setPlaylist] = useState<Song[]>([
    { id: 's1', title: 'Gallan Goodiyaan', artist: 'Yashita Sharma, Shankar Mahadevan', category: 'Sangeet', duration: '4:56', approved: true },
    { id: 's2', title: 'Kala Chashma', artist: 'Amar Arshi, Badshah', category: 'Baraat', duration: '3:07', approved: true },
    { id: 's3', title: 'Din Shagna Da (Acoustic)', artist: 'Jasleen Royal', category: 'Bride Entry', duration: '3:45', approved: true },
    { id: 's4', title: 'London Thumakda', artist: 'Labh Janjua, Sonu Kakkar', category: 'Sangeet', duration: '3:50', approved: false },
    { id: 's5', title: 'Kesariya (Romantic Fusion)', artist: 'Arijit Singh', category: 'Reception', duration: '4:28', approved: true }
  ]);

  const [djSent, setDjSent] = useState(false);

  const handleToggleApprove = (songId: string) => {
    setPlaylist(prev => prev.map(s => s.id === songId ? { ...s, approved: !s.approved } : s));
  };

  const handleGenerateAIPlaylist = () => {
    const aiTracks: Song[] = [
      { id: `ai-1-${Date.now()}`, title: 'Nachde Ne Saare', artist: 'Jasleen Royal, Harshdeep Kaur', category: 'Sangeet', duration: '3:30', approved: true },
      { id: `ai-2-${Date.now()}`, title: 'Sauda Khara Khara', artist: 'Diljit Dosanjh, Sukhbir', category: 'Baraat', duration: '3:40', approved: true }
    ];
    setPlaylist([...playlist, ...aiTracks]);
    toast('✨ AI generated 2 new trending ceremony tracks!', 'success');
  };

  const handleSendToDJ = () => {
    setDjSent(true);
    toast('🎵 Approved playlist exported directly to booked DJ vendor!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header Banner */}
      <div className="bg-[#2C1810] text-[#FAF0E0] py-8 border-b border-[#C5A880]/30 relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/events/eventdetail/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:text-[#FAF0E0] uppercase tracking-wider mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Event Details
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/40 bg-[#1F0A05] text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-2">
                🎵 AI Music & Song Suite
              </span>
              <h1 className="text-3xl font-bold font-serif">AI Ceremonial Playlist & DJ Sync</h1>
              <p className="text-xs text-[#FAF0E0]/80 italic mt-1 font-serif">
                Event ID #{id} • Auto-curated tracks for Sangeet, Baraat & Entry
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateAIPlaylist}
                className="px-4 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded shadow hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFD700]" /> AI Auto-Generate Tracks
              </button>
              <button
                onClick={handleSendToDJ}
                disabled={djSent}
                className="px-4 py-2.5 bg-[#2C1810] border border-[#C5A880]/50 text-[#FFD700] text-xs font-bold uppercase tracking-wider rounded shadow hover:bg-[#1F0A05] transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" /> {djSent ? 'Exported to DJ' : 'Export Playlist to DJ'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-xl border border-[#DDD0BB] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDD0BB] pb-4 font-sans">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#2C1810]">Curated Event Playlist</h3>
              <p className="text-xs text-[#1F1E1B]/70 italic">Click approve on tracks to include them in the DJ execution set.</p>
            </div>
            <span className="text-xs font-bold text-[#8A1C2C] bg-amber-50 px-3 py-1 rounded border border-amber-200">
              {playlist.filter(s => s.approved).length} Approved Songs
            </span>
          </div>

          <div className="divide-y divide-[#FAF6F0]">
            {playlist.map((song) => (
              <div key={song.id} className="py-4 flex items-center justify-between gap-4 hover:bg-[#FAF6F0]/40 px-3 rounded transition font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2C1810] text-[#FFD700] flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1F1E1B] font-serif">{song.title}</h4>
                    <p className="text-xs text-[#7A6652]">{song.artist} • {song.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2.5 py-1 rounded bg-[#FAF6F0] border border-[#DDD0BB] text-[10px] font-bold text-[#8A1C2C] uppercase tracking-wider">
                    {song.category}
                  </span>
                  <button
                    onClick={() => handleToggleApprove(song.id)}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                      song.approved
                        ? 'bg-green-100 border border-green-300 text-green-800'
                        : 'bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {song.approved ? '✓ Approved' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
