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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">💌 Create Beautiful Invitations</h1>
          <p className="text-2xl mb-8 text-pink-100">
            AI-powered cards and videos for every occasion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Create New Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Create New Invitation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Invitations */}
            <Link
              href="/invitations/create/card"
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all border-2 border-transparent hover:border-pink-500"
            >
              <div className="flex items-center gap-6">
                <div className="text-6xl">🎨</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600">
                    Invitation Cards
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create beautiful digital invitation cards with AI
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileImage className="w-4 h-4" />
                      <span>Default Templates</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      <span>Custom Design</span>
                    </div>
                  </div>
                </div>
                <div className="text-pink-600 group-hover:scale-110 transition-transform">
                  →
                </div>
              </div>
            </Link>

            {/* Video Invitations */}
            <Link
              href="/invitations/create/video"
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center gap-6">
                <div className="text-6xl">🎬</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
                    Video Invitations
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Generate stunning video invitations with your photos
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>Default Videos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      <span>Custom Video</span>
                    </div>
                  </div>
                </div>
                <div className="text-purple-600 group-hover:scale-110 transition-transform">
                  →
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* My Invitations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">My Invitations</h2>
            {invitations && invitations.length > 0 && (
              <Link
                href="/invitations/gallery"
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                View All →
              </Link>
            )}
          </div>

          {invitations && invitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                    {invitation.card_url ? (
                      <img
                        src={invitation.card_url}
                        alt={invitation.invitation_name}
                        className="w-full h-full object-cover"
                      />
                    ) : invitation.video_url ? (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🎬
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        💌
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                        {invitation.invitation_type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                      {invitation.invitation_name || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/invitations/${invitation.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      {(invitation.card_url || invitation.video_url) && (
                        <button className="px-3 py-2 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">💌</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Invitations Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first invitation with AI assistance!
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/invitations/create/card"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700"
                >
                  <FileImage className="w-5 h-5" />
                  Create Card
                </Link>
                <Link
                  href="/invitations/create/video"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
                >
                  <Video className="w-5 h-5" />
                  Create Video
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Event Type Templates */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse by Event Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/invitations/templates?type=birthday"
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all border border-gray-200 hover:border-pink-500"
            >
              <div className="text-5xl mb-3">🎂</div>
              <h3 className="font-semibold text-gray-900">Birthday</h3>
              <p className="text-sm text-gray-500 mt-1">View templates</p>
            </Link>

            <Link
              href="/invitations/templates?type=wedding"
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all border border-gray-200 hover:border-pink-500"
            >
              <div className="text-5xl mb-3">💍</div>
              <h3 className="font-semibold text-gray-900">Wedding</h3>
              <p className="text-sm text-gray-500 mt-1">View templates</p>
            </Link>

            <Link
              href="/invitations/templates?type=anniversary"
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all border border-gray-200 hover:border-pink-500"
            >
              <div className="text-5xl mb-3">💐</div>
              <h3 className="font-semibold text-gray-900">Anniversary</h3>
              <p className="text-sm text-gray-500 mt-1">View templates</p>
            </Link>

            <Link
              href="/invitations/templates?type=corporate"
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all border border-gray-200 hover:border-pink-500"
            >
              <div className="text-5xl mb-3">🏢</div>
              <h3 className="font-semibold text-gray-900">Corporate</h3>
              <p className="text-sm text-gray-500 mt-1">View templates</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
