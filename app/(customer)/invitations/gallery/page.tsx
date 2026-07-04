'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function RedirectContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/invitations/create/card');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-6xl mb-4">✨</div>
        <p className="text-xl text-gray-600">Taking you to Custom Card Creator...</p>
      </div>
    </div>
  );
}

export default function InvitationGalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">✨</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}
