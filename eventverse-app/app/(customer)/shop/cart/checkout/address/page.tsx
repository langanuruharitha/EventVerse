'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
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
    // Validate address
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    // Save address to localStorage or state management
    localStorage.setItem('checkoutAddress', JSON.stringify(address));

    // Navigate to payment
    router.push('/shop/cart/checkout/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/shop/cart/checkout')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Delivery Address</h2>
              <p className="text-gray-600">Where should we deliver your order?</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Address Type */}
            <div>
              <Label>Address Type</Label>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleInputChange('addressType', 'home')}
                  className={`flex-1 p-4 border-2 rounded-lg transition ${
                    address.addressType === 'home'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Home className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Home</span>
                </button>
                <button
                  onClick={() => handleInputChange('addressType', 'work')}
                  className={`flex-1 p-4 border-2 rounded-lg transition ${
                    address.addressType === 'work'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Briefcase className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Work</span>
                </button>
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={address.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={address.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                value={address.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="House No., Building Name"
                required
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={address.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                placeholder="Road name, Area, Colony (Optional)"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Mumbai"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={address.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="400001"
                  required
                />
              </div>
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={address.isDefault}
                onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Save as default address
              </Label>
            </div>
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => router.push('/shop/cart/checkout')}
            >
              Back
            </Button>
            <Button onClick={handleContinue}>
              Continue to Payment
            </Button>
          </div>
        </Card>

        {/* Delivery Info */}
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Delivery Information</p>
              <ul className="space-y-1 text-blue-800">
                <li>• Standard delivery: 3-5 business days</li>
                <li>• Free delivery on orders above ₹999</li>
                <li>• Cash on delivery available</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
