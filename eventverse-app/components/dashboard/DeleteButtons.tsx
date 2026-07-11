'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';

export function DeleteSavedVendorButton({ savedId }: { savedId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to remove this vendor from your saved list?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('saved_vendors')
        .delete()
        .eq('id', savedId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error('Error deleting saved vendor:', error);
      alert('Failed to remove saved vendor. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors border border-gray-100 hover:border-red-100 focus:outline-none disabled:opacity-50"
      title="Remove from saved list"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

export function DeleteEnquiryButton({ enquiryId }: { enquiryId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('vendor_leads')
        .delete()
        .eq('id', enquiryId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors border border-gray-100 hover:border-red-100 focus:outline-none disabled:opacity-50"
      title="Delete inquiry"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
