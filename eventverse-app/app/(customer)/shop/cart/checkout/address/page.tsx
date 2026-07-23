'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Home, Briefcase } from 'lucide-react';

interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work';
  isDefault: boolean;
}

export default function AddressPage() {
  const router = useRouter();
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'home',
    isDefault: false,
  });

  const handleInputChange = (field: keyof Address, value: any) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    localStorage.setItem('checkoutAddress', JSON.stringify(address));
    router.push('/shop/cart/checkout/payment');
  };

  const inputStyle = {
    background: '#FFFDF8',
    border: '1.5px solid #DDD0BB',
    color: '#2C1810',
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/shop/cart/checkout')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-[#FAF6F0] pb-5">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#8A1C2C]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2C1810]">Delivery Address</h2>
              <p className="text-xs text-[#1F1E1B]/60 font-sans italic">Where should we deliver your royal order?</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Address Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-2 font-sans">
                Address Type
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('addressType', 'home')}
                  className={`flex-1 p-3.5 border rounded transition font-sans flex flex-col items-center gap-1 text-xs ${
                    address.addressType === 'home'
                      ? 'border-[#8A1C2C] bg-[#8A1C2C]/5 text-[#8A1C2C] font-bold'
                      : 'border-[#DDD0BB] hover:border-[#C5A880] text-[#7A6652]'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('addressType', 'work')}
                  className={`flex-1 p-3.5 border rounded transition font-sans flex flex-col items-center gap-1 text-xs ${
                    address.addressType === 'work'
                      ? 'border-[#8A1C2C] bg-[#8A1C2C]/5 text-[#8A1C2C] font-bold'
                      : 'border-[#DDD0BB] hover:border-[#C5A880] text-[#7A6652]'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Work</span>
                </button>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1 font-sans">Full Name *</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Royal Name"
                  className="w-full px-3.5 py-2 text-xs rounded outline-none font-sans"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1 font-sans">Phone Number *</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-xs rounded outline-none font-sans"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1 font-sans">Flat, House no., Building, Apartment *</label>
              <input
                type="text"
                value={address.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="House / Flat No., Street Name"
                className="w-full px-3.5 py-2 text-xs rounded outline-none font-sans"
                style={inputStyle}
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1 font-sans">Area, Street, Sector, Village</label>
              <input
                type="text"
                value={address.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                placeholder="Landmark, Sector..."
                className="w-full px-3.5 py-2 text-xs rounded outline-none font-sans"
                style={inputStyle}
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1 font-sans">City *</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full px-3.5 py-2 text-xs rounded outline-none font-sans"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1 font-sans">State *</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                  className="w-full px-3.5 py-2 text-xs rounded outline-none font-sans"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1 font-sans">Pincode *</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="500001"
                  className="w-full px-3.5 py-2 text-xs rounded outline-none font-sans"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Default Address Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-[#1F1E1B]/70 pt-2">
              <input
                type="checkbox"
                checked={address.isDefault}
                onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                className="accent-[#8A1C2C] w-4 h-4 rounded"
              />
              <span>Save as default delivery address</span>
            </label>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#DDD0BB]">
            <button
              onClick={() => router.push('/shop/cart/checkout')}
              className="px-4 py-2 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] font-sans transition"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow-lg font-sans transition uppercase tracking-wider"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
