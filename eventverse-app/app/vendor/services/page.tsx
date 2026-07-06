'use client';

import { useState, useEffect } from 'react';

const serviceCategories = [
  'Photography', 'Videography', 'Decoration', 'Catering', 'Venue',
  'Mehendi', 'Music Band', 'DJ Services', 'Cake Services', 'Makeup',
  'Return Gifts', 'Rental Services', 'Event Planning',
];

const mockServices = [
  {
    id: 1, name: 'Wedding Photography Package', category: 'Photography',
    price: 45000, unit: 'per event', status: 'active',
    description: 'Full-day wedding photography with 2 photographers, 500+ edited photos.',
    bookings: 18,
  },
  {
    id: 2, name: 'Pre-Wedding Shoot', category: 'Photography',
    price: 15000, unit: 'per shoot', status: 'active',
    description: 'Half-day outdoor pre-wedding shoot with editing.',
    bookings: 12,
  },
  {
    id: 3, name: 'Birthday Photography', category: 'Photography',
    price: 8000, unit: 'per event', status: 'inactive',
    description: 'Birthday event photography with same-day delivery.',
    bookings: 5,
  },
];

const STORAGE_KEY = 'vendor_services';

export default function VendorServicesPage() {
  const [services, setServices] = useState(() => {
    if (typeof window === 'undefined') return mockServices;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : mockServices;
    } catch {
      return mockServices;
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [form, setForm] = useState({
    name: '', category: 'Photography', price: '', unit: 'per event', description: '', status: 'active',
  });

  // Persist services to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const openAdd = () => {
    setEditService(null);
    setForm({ name: '', category: 'Photography', price: '', unit: 'per event', description: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (svc: any) => {
    setEditService(svc);
    setForm({ name: svc.name, category: svc.category, price: String(svc.price), unit: svc.unit, description: svc.description, status: svc.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editService) {
      setServices(services.map(s => s.id === editService.id
        ? { ...s, ...form, price: Number(form.price) }
        : s));
    } else {
      setServices([...services, { id: Date.now(), ...form, price: Number(form.price), bookings: 0 }]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const deleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services 🛍️</h1>
          <p className="text-gray-500 mt-1">Manage the services you offer to customers</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-200 hover:shadow-xl"
        >
          <span className="text-lg">➕</span>
          Add Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Services</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{services.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Services</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{services.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{services.reduce((a, s) => a + s.bookings, 0)}</p>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map(svc => (
          <div key={svc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{svc.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${svc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {svc.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{svc.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-orange-600 font-medium">
                    🏷️ {svc.category}
                  </span>
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    💰 ₹{svc.price.toLocaleString('en-IN')} <span className="text-gray-400 font-normal">/ {svc.unit}</span>
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 font-medium">
                    📅 {svc.bookings} bookings
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleStatus(svc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${svc.status === 'active' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                >
                  {svc.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => openEdit(svc)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteService(svc.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editService ? '✏️ Edit Service' : '➕ Add New Service'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Wedding Photography Package"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                  >
                    {serviceCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pricing Unit</label>
                  <select
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                  >
                    <option>per event</option>
                    <option>per day</option>
                    <option>per hour</option>
                    <option>per person</option>
                    <option>per package</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what's included in this service..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                {editService ? 'Save Changes' : 'Add Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
