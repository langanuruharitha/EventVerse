'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Upload, Mail, MessageCircle, CheckCircle } from 'lucide-react';

interface SendInvitationModalProps {
  guest: {
    id: string;
    guest_name: string;
    email: string | null;
    phone: string | null;
  };
  eventName: string;
  onClose: () => void;
  onSent: () => void;
}

export default function SendInvitationModal({
  guest,
  eventName,
  onClose,
  onSent
}: SendInvitationModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [sendVia, setSendVia] = useState<'both' | 'email' | 'whatsapp'>('both');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [senderName, setSenderName] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for image/video
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    setSending(true);

    try {
      const messageBody = `Hi ${guest.guest_name},\n\nYou are invited to ${eventName}!\n\nFrom,\n${senderName || 'Your Host'}`;
      const subject = `Invitation to ${eventName}`;

      if (sendVia === 'both' || sendVia === 'email') {
        if (guest.email) {
          const mailtoLink = `mailto:${guest.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;
          window.open(mailtoLink, '_blank');
        }
      }

      if (sendVia === 'both' || sendVia === 'whatsapp') {
        if (guest.phone) {
          // Remove any non-numeric characters from phone
          const cleanPhone = guest.phone.replace(/\D/g, '');
          const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;
          window.open(waLink, '_blank');
        }
      }

      // Update database to mark invitation as sent
      const response = await fetch(`/api/guests/${guest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitation_sent: true })
      });

      if (!response.ok) throw new Error('Failed to update');

      setSent(true);
      
      // Auto close after showing success
      setTimeout(() => {
        onSent();
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Send Invitation</h2>
            <p className="text-sm text-purple-100">To: {guest.guest_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {sent ? (
          /* Success State */
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Invitation Sent!</h3>
            <p className="text-gray-600">
              {sendVia === 'both' && 'Invitation sent via Email & WhatsApp'}
              {sendVia === 'email' && 'Invitation sent via Email'}
              {sendVia === 'whatsapp' && 'Invitation sent via WhatsApp'}
            </p>
            <p className="text-sm text-green-600 mt-4">✓ Marked as sent in guest list</p>
          </div>
        ) : (
          /* Form State */
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Event Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900">
                <span className="font-semibold">Event:</span> {eventName}
              </p>
              <p className="text-sm text-purple-900 mt-1">
                <span className="font-semibold">Guest:</span> {guest.guest_name}
              </p>
            </div>

            {/* Sender Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender Name (From)
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe, The Smith Family"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Upload Invitation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Invitation Card/Video *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                {filePreview ? (
                  <div className="space-y-4">
                    {selectedFile?.type.startsWith('image/') ? (
                      <img src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    ) : (
                      <video src={filePreview} className="max-h-48 mx-auto rounded-lg" controls />
                    )}
                    <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, MP4, or PDF (Max 10MB)</p>
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Send Via Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send Via
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSendVia('both')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    sendVia === 'both'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Both</p>
                  <p className="text-xs text-gray-600">Email & WhatsApp</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSendVia('email')}
                  disabled={!guest.email}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    sendVia === 'email'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  } ${!guest.email ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Mail className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="font-semibold text-gray-900">Email Only</p>
                  <p className="text-xs text-gray-600">
                    {guest.email || 'No email'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSendVia('whatsapp')}
                  disabled={!guest.phone}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    sendVia === 'whatsapp'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  } ${!guest.phone ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <MessageCircle className="w-5 h-5 text-green-600 mb-2" />
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-xs text-gray-600">
                    {guest.phone || 'No phone'}
                  </p>
                </button>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">ℹ️ Note:</span> Clicking send will open your default Email client or WhatsApp with a pre-filled invitation message. The guest will then be marked as "Sent" in your list.
              </p>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        {!sent && (
          <div className="border-t px-6 py-4 flex gap-4 flex-shrink-0">
            <Button
              onClick={handleSend}
              disabled={!selectedFile || sending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3"
            >
              {sending ? (
                <>
                  <div className="animate-spin mr-2">⏳</div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-8"
              disabled={sending}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
