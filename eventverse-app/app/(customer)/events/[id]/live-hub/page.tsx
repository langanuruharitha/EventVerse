'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, QrCode, Image as ImageIcon, Upload, Heart, Share2, 
  CheckCircle2, Users, Download, Sparkles, MessageCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface LivePhoto {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  timestamp: string;
  likes: number;
}

export default function LiveGuestHubPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'photos' | 'qr-checkin'>('photos');
  const [photos, setPhotos] = useState<LivePhoto[]>([
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      caption: 'The mandap decor looks absolutely royal! ✨',
      uploadedBy: 'Ananya Sharma (Guest)',
      timestamp: '10 mins ago',
      likes: 24
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      caption: 'Congratulations to the gorgeous couple! 💍',
      uploadedBy: 'Rohan Verma',
      timestamp: '25 mins ago',
      likes: 42
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      caption: 'Sangeet night dance performance! 💃',
      uploadedBy: 'Kavya & Group',
      timestamp: '1 hour ago',
      likes: 38
    }
  ]);

  const [newCaption, setNewCaption] = useState('');

  const handleLike = (photoId: string) => {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleUploadSimulated = () => {
    if (!newCaption.trim()) {
      toast('Please enter a caption for your live photo.', 'warning');
      return;
    }
    const newPic: LivePhoto = {
      id: `p-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
      caption: newCaption,
      uploadedBy: 'You (Host)',
      timestamp: 'Just now',
      likes: 1
    };
    setPhotos([newPic, ...photos]);
    setNewCaption('');
    toast('🎉 Live photo uploaded to event stream!', 'success');
  };

  const handleDownloadAll = () => {
    toast('📥 Downloading all live event photos album...', 'success');
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
                📱 Live Event Hub & QR Stream
              </span>
              <h1 className="text-3xl font-bold font-serif">Live Guest Wall & QR Check-In</h1>
              <p className="text-xs text-[#FAF0E0]/80 italic mt-1 font-serif">
                Event ID #{id} • Real-time guest photo sharing & entrance verification
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded shadow border border-[#C5A880]/40 hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FFD700]" /> Download All Photos
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#DDD0BB] bg-white rounded-t-xl overflow-hidden shadow-sm font-sans">
          {[
            { id: 'photos', label: '📸 Real-Time Live Photo Wall', icon: ImageIcon },
            { id: 'qr-checkin', label: '📱 Venue Entrance QR Check-In', icon: QrCode },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#8A1C2C] text-[#8A1C2C] bg-[#FAF6F0]'
                    : 'border-transparent text-[#7A6652] hover:text-[#8A1C2C]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Live Photo Wall */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* Upload Box */}
            <div className="bg-white rounded-xl border border-[#DDD0BB] p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-serif text-[#2C1810]">Upload Live Photo to Stream</h3>
              <div className="flex flex-col sm:flex-row gap-3 font-sans">
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Add a photo caption or wish for the couple..."
                  className="flex-1 px-4 py-2.5 border border-[#DDD0BB] bg-[#FFFDF8] rounded text-xs outline-none"
                />
                <button
                  onClick={handleUploadSimulated}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded shadow hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#FFD700]" /> Upload Photo
                </button>
              </div>
            </div>

            {/* Photo Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl border border-[#DDD0BB] overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-64 bg-[#1F1E1B] overflow-hidden">
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2 font-serif">
                    <p className="text-xs text-[#1F1E1B] italic font-semibold">"{photo.caption}"</p>
                    <div className="flex items-center justify-between text-[11px] font-sans text-[#7A6652] pt-2 border-t border-[#FAF6F0]">
                      <span>By {photo.uploadedBy} • {photo.timestamp}</span>
                      <button
                        onClick={() => handleLike(photo.id)}
                        className="flex items-center gap-1 text-[#8A1C2C] font-bold cursor-pointer hover:scale-105 transition"
                      >
                        <Heart className="w-4 h-4 fill-current" /> {photo.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: QR Code Check-In */}
        {activeTab === 'qr-checkin' && (
          <div className="bg-white rounded-b-xl border border-[#DDD0BB] p-8 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] font-sans">
                ⚜ DIGITAL VENUE ENTRANCE PASS ⚜
              </span>
              <h3 className="text-2xl font-bold font-serif text-[#2C1810]">Scan QR Code for Instant Guest Check-In</h3>
              <p className="text-xs text-[#1F1E1B]/70 font-serif italic">
                Display this QR code at the venue gate for instant check-in verification & live photo sharing access.
              </p>
            </div>

            {/* QR Code Graphic Box */}
            <div className="p-6 bg-[#1F1E1B] rounded-2xl border-4 border-double border-[#C5A880] inline-block shadow-2xl space-y-4">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=EventVerse-Guest-Pass-RoyalVivah-2026"
                alt="Event QR Code"
                className="w-52 h-52 mx-auto rounded-lg bg-white p-2"
              />
              <p className="text-xs font-bold text-[#FFD700] uppercase tracking-wider font-sans">
                Event Pass #EV-2026-N9824
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans text-xs text-left bg-[#FAF6F0] p-4 rounded-xl border border-[#DDD0BB]">
              <div>
                <span className="text-gray-500 font-bold block text-[10px] uppercase">Checked-In Guests:</span>
                <span className="text-lg font-bold text-[#8A1C2C]">184 / 200 Guests</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold block text-[10px] uppercase">Check-In Status:</span>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
                  ✓ Gate Scanner Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
