import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Video, FileImage, Download, Eye } from 'lucide-react';

export default async function InvitationsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's invitations
  const { data: invitations } = await supabase
    .from('custom_invitations')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Banner (Ornate Frame) */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 sm:p-10 shadow-md">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="text-center relative space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/30 bg-[#FAF6F0] text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans">
              ⚜ Heritage Invitations
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C1810]">
              Create Beautiful Invitations
            </h1>
            <p className="text-sm sm:text-base text-[#1F1E1B]/70 italic max-w-xl mx-auto">
              "AI-powered exquisite digital cards and video invites designed for every special milestone."
            </p>
          </div>
        </div>

        {/* Create New Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
            <span className="text-[#C5A880]">❦</span> Create New Invitation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Invitations */}
            <Link
              href="/invitations/create/card"
              className="group bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  🎨
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1F1E1B] mb-1 group-hover:text-[#8A1C2C] transition-colors">
                    Custom AI Cards
                  </h3>
                  <p className="text-[#1F1E1B]/60 text-xs italic">
                    Design custom royal invitation cards with AI background themes.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#FAF6F0] flex items-center justify-between text-xs font-bold text-[#8A1C2C] uppercase tracking-wider font-sans">
                <span className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Create AI Card
                </span>
                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
              </div>
            </Link>

            {/* 20 Real Cards Gallery */}
            <Link
              href="/invitations/templates"
              className="group bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  👑
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1F1E1B] mb-1 group-hover:text-[#8A1C2C] transition-colors">
                    20 Real Pre-Designed Cards
                  </h3>
                  <p className="text-[#1F1E1B]/60 text-xs italic">
                    Handcrafted royal invitation templates with instant PNG image download.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#FAF6F0] flex items-center justify-between text-xs font-bold text-[#8A1C2C] uppercase tracking-wider font-sans">
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" /> Browse 20 Real Cards
                </span>
                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
              </div>
            </Link>

            {/* Video Invitations */}
            <Link
              href="/invitations/create/video"
              className="group bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  🎬
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1F1E1B] mb-1 group-hover:text-[#8A1C2C] transition-colors">
                    Video Invitations
                  </h3>
                  <p className="text-[#1F1E1B]/60 text-xs italic">
                    Compile animated video invitations with slideshow & music.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#FAF6F0] flex items-center justify-between text-xs font-bold text-[#8A1C2C] uppercase tracking-wider font-sans">
                <span className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Create Custom Video
                </span>
                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* My Invitations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1F1E1B] flex items-center gap-3">
            <span className="text-[#C5A880]">❦</span> My Invitations
          </h2>

          {invitations && invitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-white rounded border border-[#DDD0BB] hover:border-[#C5A880] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-[#FAF6F0] border-b border-[#FAF6F0] flex items-center justify-center">
                    {invitation.card_url ? (
                      <img
                        src={invitation.card_url}
                        alt={invitation.invitation_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">{invitation.video_url ? '🎬' : '💌'}</span>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 border border-[#DDD0BB] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-[#C5A880]">
                        {invitation.invitation_type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-[#1F1E1B] text-sm line-clamp-1 mb-1">
                        {invitation.invitation_name || 'Untitled Invitation'}
                      </h3>
                      <p className="text-[10px] text-[#1F1E1B]/50 font-sans mb-4">
                        Created: {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/invitations/${invitation.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                          color: '#FAF0E0',
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                      {(invitation.card_url || invitation.video_url) && (
                        <button className="p-2 border border-[#8A1C2C] text-[#8A1C2C] rounded hover:bg-[#FAF6F0]">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded border border-[#DDD0BB] shadow-sm max-w-2xl mx-auto p-8">
              <div className="text-5xl mb-4 text-[#C5A880]">💌</div>
              <h3 className="text-xl font-bold text-[#1F1E1B] mb-2">No Invitations Yet</h3>
              <p className="text-xs text-[#1F1E1B]/60 italic mb-6">
                Create your first bespoke card or animated video invitation.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/invitations/create/card"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded"
                  style={{ background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)', color: '#FAF0E0' }}
                >
                  <FileImage className="w-4 h-4" />
                  Create Card
                </Link>
                <Link
                  href="/invitations/create/video"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded border border-[#9B7A4A] text-[#9B7A4A] hover:bg-[#FAF6F0]"
                >
                  <Video className="w-4 h-4" />
                  Create Video
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
