'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Upload, Mail, CheckCircle } from 'lucide-react';

interface BulkSendInvitationModalProps {
  guests: {
    id: string;
    guest_name: string;
    email: string | null;
    phone: string | null;
    invitation_sent: boolean;
  }[];
  eventName: string;
  onClose: () => void;
  onSent: () => void;
}

export default function BulkSendInvitationModal({
  guests,
  eventName,
  onClose,
  onSent
}: BulkSendInvitationModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sent, setSent] = useState(false);
  const [senderName, setSenderName] = useState('');

  // Only target guests who have an email address and haven't been sent an invite yet
  const targetGuests = guests.filter(g => g.email && !g.invitation_sent);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4.0 * 1024 * 1024) {
        alert('The file is too large to attach to the emails (max 4.0MB). Please choose a smaller file.');
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

  const handleSendAll = async () => {
    if (targetGuests.length === 0) {
      alert("No pending guests with email addresses found.");
      return;
    }

    setSending(true);
    setTotalCount(targetGuests.length);
    setSentCount(0);

    let errorList: string[] = [];

    // Send emails one by one (or in small batches) to avoid rate limits
    for (const guest of targetGuests) {
      try {
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
           // If simulated, just break early, no need to simulate 50 times
           alert('Server says: "SIMULATED". This means your SMTP API keys are not loaded in Vercel yet! Make sure you added them to the Production environment in Vercel and redeployed.');
           setSending(false);
           return;
        }

        if (!result.success && result.errors && result.errors.length > 0) {
           errorList.push(`Failed for ${guest.guest_name}: ${result.errors.join(', ')}`);
        } else {
           setSentCount(prev => prev + 1);
        }
      } catch (error: any) {
        errorList.push(`Error for ${guest.guest_name}: ${error.message}`);
      }
    }

    setSending(false);
    setSent(true);

    if (errorList.length > 0) {
      alert(`Sent ${targetGuests.length - errorList.length} successfully. Errors:\n` + errorList.join('\n'));
    }

    // Auto close after showing success
    setTimeout(() => {
      onSent();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Bulk Send Invitations</h2>
            <p className="text-sm text-purple-100">
              Sending to {targetGuests.length} guests via Email
            </p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Invitations Sent!</h3>
            <p className="text-gray-600">
              Successfully processed emails for {sentCount} out of {totalCount} guests.
            </p>
          </div>
        ) : (
          /* Form State */
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            
            {targetGuests.length === 0 ? (
               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-yellow-800">
                 <p className="font-semibold mb-2">No eligible guests found!</p>
                 <p className="text-sm">
                   To bulk send emails, you need guests in your list who have an email address AND haven't been sent an invitation yet.
                 </p>
               </div>
            ) : (
              <>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900">
                    <span className="font-semibold">Event:</span> {eventName}
                  </p>
                  <p className="text-sm text-purple-900 mt-1">
                    <span className="font-semibold">Recipients:</span> {targetGuests.length} guests (Email only)
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
                        <p className="text-sm text-gray-500">PNG, JPG, MP4, or PDF (Max 4.0MB)</p>
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

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">ℹ️ Note:</span> Clicking send will automatically email the invitation to {targetGuests.length} guests in the background. Note: Bulk sending WhatsApp is not supported here.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer Buttons */}
        {!sent && (
          <div className="border-t px-6 py-4 flex gap-4 flex-shrink-0">
            <Button
              onClick={handleSendAll}
              disabled={!selectedFile || sending || targetGuests.length === 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3"
            >
              {sending ? (
                <>
                  <div className="animate-spin mr-2">⏳</div>
                  Sending... ({sentCount}/{totalCount})
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send {targetGuests.length} Emails
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
