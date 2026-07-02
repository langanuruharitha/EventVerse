'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface GuestFormProps {
  eventId: string;
  onSubmit: (guest: any) => void;
  onCancel: () => void;
}

export default function GuestForm({ 
  eventId, 
  onSubmit, 
  onCancel 
}: GuestFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    category: 'family',
    plus_ones_allowed: 0,
    dietary_restrictions: '',
    special_requirements: '',
    notes: '',
    age_group: 'adult'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          event_id: eventId,
          plus_ones_allowed: parseInt(formData.plus_ones_allowed.toString())
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add guest');
      }

      const data = await response.json();
      onSubmit(data.guest);

      // Reset form
      setFormData({
        guest_name: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        category: 'family',
        plus_ones_allowed: 0,
        dietary_restrictions: '',
        special_requirements: '',
        notes: '',
        age_group: 'adult'
      });
    } catch (error) {
      console.error('Error adding guest:', error);
      alert('Failed to add guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Add Guest</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            {/* Guest Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name *
              </label>
              <input
                type="text"
                name="guest_name"
                value={formData.guest_name}
                onChange={handleChange}
                required
                placeholder="e.g., John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="guest@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location</h3>
            
            {/* City/Village */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City / Village *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="e.g., Mumbai, Delhi, or Village Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="Complete address with landmark..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Guest Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Guest Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="family">Family</option>
                  <option value="friends">Friends</option>
                  <option value="colleagues">Colleagues</option>
                  <option value="relatives">Relatives</option>
                  <option value="neighbors">Neighbors</option>
                  <option value="vip">VIP</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <select
                  name="age_group"
                  value={formData.age_group}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="child">Child (0-12)</option>
                  <option value="teenager">Teenager (13-19)</option>
                  <option value="adult">Adult (20-59)</option>
                  <option value="senior">Senior (60+)</option>
                </select>
              </div>

              {/* Plus Ones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plus Ones Allowed
                </label>
                <input
                  type="number"
                  name="plus_ones_allowed"
                  value={formData.plus_ones_allowed}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Special Requirements</h3>
            
            {/* Dietary Restrictions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions
              </label>
              <select
                name="dietary_restrictions"
                value={formData.dietary_restrictions}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">None</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="jain">Jain (No onion/garlic)</option>
                <option value="halal">Halal</option>
                <option value="gluten-free">Gluten Free</option>
                <option value="lactose-intolerant">Lactose Intolerant</option>
                <option value="diabetic">Diabetic Friendly</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Special Requirements
              </label>
              <textarea
                name="special_requirements"
                value={formData.special_requirements}
                onChange={handleChange}
                rows={2}
                placeholder="e.g., Wheelchair access, Baby seat, Allergies, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Any other information about this guest..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              {loading ? 'Adding Guest...' : 'Add Guest'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="px-8 py-3"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
