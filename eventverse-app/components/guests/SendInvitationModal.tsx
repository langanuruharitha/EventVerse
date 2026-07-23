'use client';

import { useState } from 'react';
import { X, Send, Mail, MessageSquare, Paperclip, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface SendInvitationModalProps {
  guest: {
    id: string;
    guest_name: string;
    email?: string | null;
    phone?: string | null;
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
  const toast = useToast();
  const [sendVia, setSendVia] = useState<'email' | 'whatsapp'>(guest.email ? 'email' : 'whatsapp');
  const [senderName, setSenderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4.0 * 1024 * 1024) {
        toast('The file is too large to attach to the email (max 4.0MB). Please choose a smaller file.', 'warning');
        return;
      }
      setSelectedFile(file);
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
      const hostUrl = window.location.origin;
      const rsvpLink = `${hostUrl}/rsvp/${guest.id}`;
      const messageBody = `Hi ${guest.guest_name},\n\nYou are invited to *${eventName}*!\n\nFrom,\n${senderName || 'Your Host'}\n\nPlease click here to confirm your RSVP:\n${rsvpLink}`;

      if (sendVia === 'whatsapp' && guest.phone) {
        let formattedPhone = guest.phone.replace(/\D/g, '');
        if (!formattedPhone.startsWith('+') && formattedPhone.length === 10) {
          formattedPhone = '91' + formattedPhone;
        }
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageBody)}`;
        window.open(whatsappUrl, '_blank');
      }

      if (sendVia === 'email') {
        if (selectedFile && selectedFile.size > 4.0 * 1024 * 1024) {
          toast('The file is too large to attach to the email (max 4.0MB). Please choose a smaller file.', 'warning');
          setSending(false);
          return;
        }

        const formData = new FormData();
        formData.append('sendVia', 'email');
        formData.append('senderName', senderName);
        formData.append('eventName', eventName);
        if (selectedFile) {
          formData.append('file', selectedFile);
        }

        const response = await fetch(`/api/guests/${guest.id}/send-invitation`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        
        if (result.simulated) {
          toast('Server says: "SIMULATED". SMTP API keys not loaded yet.', 'info');
          setSending(false);
          return;
        }
        
        if (!result.success && result.errors && result.errors.length > 0) {
          toast(`Failed to send email: ${result.errors.join(', ')}`, 'error');
          setSending(false);
          return;
        }
      }

      setSent(true);

      setTimeout(() => {
        onSent();
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast(`Error: ${error.message}`, 'error');
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
              {sendVia === 'email' && 'Invitation sent via Email'}
              {sendVia === 'whatsapp' && 'Invitation sent via WhatsApp'}
            </p>
          </div>
        ) : (
          /* Form State */
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Send Via
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSendVia('email')}
                  disabled={!guest.email}
                  className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                    sendVia === 'email'
                      ? 'border-purple-600 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  } ${!guest.email ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Mail className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold">Email</div>
                    <div className="text-xs text-gray-500">{guest.email || 'No email provided'}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSendVia('whatsapp')}
                  disabled={!guest.phone}
                  className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                    sendVia === 'whatsapp'
                      ? 'border-green-600 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  } ${!guest.phone ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-xs text-gray-500">{guest.phone || 'No phone provided'}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Sender Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name (Host)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Rahul & Priya"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* File Attachment (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attach Design / Video Card (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="invitation-file"
                />
                <label htmlFor="invitation-file" className="cursor-pointer">
                  <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-purple-600 hover:text-purple-700">
                    Upload an Image or Video
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">PNG, JPG, MP4 (max 4.0MB)</span>
                </label>
                {selectedFile && (
                  <p className="mt-2 text-xs text-green-600 font-semibold">
                    Attached: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 font-semibold disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
