'use client';

import { useState, useEffect, useRef } from 'react';

const mockProfile = {
  businessName: 'Epic Moments Photography',
  contactPerson: 'Vikram Mehta',
  email: 'vikram@epicmoments.com',
  phone: '+91 98765 43210',
  category: 'Photography',
  bio: 'Specializing in fine-art wedding photography and cinematic videography with 8+ years of experience capturing moments that last forever.',
  location: 'Mumbai, Maharashtra',
  address: '402, Sunshine Heights, Link Road, Andheri West, Mumbai - 400053',
  experience: '8 years',
  verificationStatus: 'verified',
  documentUploaded: 'Aadhaar_Pan_Card.pdf',
  portfolioImages: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=300',
  ],
};

export default function VendorProfilePage() {
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...mockProfile });
  const [saveMessage, setSaveMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vendor_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setForm(parsed);
      } catch (e) {
        console.error('Failed to parse saved profile:', e);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem('vendor_profile', JSON.stringify(form));
      setProfile({ ...form });
      setIsEditing(false);
      
      // Show success message
      setSaveMessage('✅ Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveMessage('❌ Failed to save profile');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage('❌ Image must be less than 5MB');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setSaveMessage('❌ Please upload an image file');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setUploading(true);

    // Convert to base64 and add to portfolio
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const updatedImages = [...form.portfolioImages, imageUrl];
      const updatedForm = { ...form, portfolioImages: updatedImages };
      
      setForm(updatedForm);
      localStorage.setItem('vendor_profile', JSON.stringify(updatedForm));
      setProfile(updatedForm);
      
      setUploading(false);
      setSaveMessage('✅ Image uploaded successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    };
    reader.onerror = () => {
      setUploading(false);
      setSaveMessage('❌ Failed to upload image');
      setTimeout(() => setSaveMessage(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = profile.portfolioImages.filter((_, i) => i !== index);
    const updatedProfile = { ...profile, portfolioImages: updatedImages };
    
    setProfile(updatedProfile);
    setForm(updatedProfile);
    localStorage.setItem('vendor_profile', JSON.stringify(updatedProfile));
    
    setSaveMessage('✅ Image removed');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile 🏪</h1>
          <p className="text-gray-500 mt-1">Manage your business profile details, portfolio, and credentials</p>
          {saveMessage && (
            <div className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium ${
              saveMessage.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {saveMessage}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (isEditing) handleSave();
            else {
              setForm({ ...profile });
              setIsEditing(true);
            }
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
            isEditing
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'
          }`}
        >
          <span>{isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Business Overview */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-md">
              {profile.businessName.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-gray-900 mt-4">{profile.businessName}</h2>
            <p className="text-sm text-gray-500 capitalize">{profile.category}</p>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold mt-3">
              ✅ Verified Vendor
            </span>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Experience:</span>
              <span>{profile.experience}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Location:</span>
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Detailed Profile Fields */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Business Details</h3>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Office Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">About / Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Contact Person</p>
                  <p className="font-semibold mt-1">{profile.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Phone Number</p>
                  <p className="font-semibold mt-1">{profile.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Email Address</p>
                  <p className="font-semibold mt-1">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Office Address</p>
                  <p className="font-semibold mt-1">{profile.address}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">About Our Services</p>
                <p className="leading-relaxed bg-gray-50 p-4 rounded-xl text-gray-600">{profile.bio}</p>
              </div>
            </div>
          )}

          {/* Verification Docs */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Verification Credentials</h3>
            <div className="flex items-center justify-between bg-orange-50/50 border border-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{profile.documentUploaded}</p>
                  <p className="text-xs text-gray-500">Government ID & Business License</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                APPROVED
              </span>
            </div>
          </div>

          {/* Portfolio Highlights */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Portfolio Highlights</h3>
            <div className="grid grid-cols-3 gap-3">
              {profile.portfolioImages.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group shadow-sm border border-gray-200">
                  <img src={img} alt="Portfolio Work" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <span className="text-xl">⏳</span>
                    <span className="text-xs font-semibold mt-1">Uploading...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">➕</span>
                    <span className="text-xs font-semibold mt-1">Upload Work</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Max file size: 5MB. Supported: JPG, PNG, GIF, WebP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
