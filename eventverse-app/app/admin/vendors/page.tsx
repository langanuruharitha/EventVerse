'use client';

import { useState } from 'react';

const mockVendors = [
  { id: 1, name: 'Epic Moments Photography', category: 'Photography', owner: 'Vikram Mehta', email: 'vikram@epicmoments.com', status: 'verified', doc: 'Aadhaar_Pan_Card.pdf', rating: 4.8 },
  { id: 2, name: 'Golden Catering Services', category: 'Catering', owner: 'Ramesh Patel', email: 'ramesh@goldencatering.com', status: 'pending', doc: 'FSSAI_License.pdf', rating: 0.0 },
  { id: 3, name: 'DJ Rhythm Beats', category: 'DJ Services', owner: 'Arjun Das', email: 'arjun@djrhythm.com', status: 'pending', doc: 'Shop_Establishment_Act.pdf', rating: 0.0 },
  { id: 4, name: 'Dream Decorators', category: 'Decoration', owner: 'Nisha Singhal', email: 'nisha@dreamdecors.com', status: 'verified', doc: 'GST_Certificate.pdf', rating: 4.5 },
  { id: 5, name: 'Royal Palace Venue', category: 'Venue', owner: 'Sanjay Dutt', email: 'sanjay@royalpalace.com', status: 'suspended', doc: 'Property_Tax_Receipt.pdf', rating: 3.2 },
];

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState(mockVendors);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const handleStatusChange = (id: number, newStatus: string) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
    if (selectedVendor?.id === id) {
      setSelectedVendor({ ...selectedVendor, status: newStatus });
    }
  };

  const filtered = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.owner.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : v.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendors Moderation 🏪</h1>
        <p className="text-gray-500 mt-1">Manage vendor verification status, credentials, and access</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {['all', 'pending', 'verified', 'suspended'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by business name or owner..."
          className="w-full sm:w-72 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none text-sm bg-white"
        />
      </div>

      <div className={`grid gap-6 ${selectedVendor ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Vendors List */}
        <div className={selectedVendor ? 'lg:col-span-2 space-y-3' : 'space-y-3'}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Business / Owner</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filtered.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{vendor.name}</div>
                      <div className="text-xs text-gray-500">By {vendor.owner} ({vendor.email})</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{vendor.category}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-semibold text-gray-700">⭐ {vendor.rating > 0 ? vendor.rating : 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                        vendor.status === 'verified'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : vendor.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendor Detail & Verification Action Panel */}
        {selectedVendor && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5 h-fit">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-gray-900">Verification Profile</h2>
              <button onClick={() => setSelectedVendor(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Business Name</p>
                <p className="font-bold text-gray-900 mt-1">{selectedVendor.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Category</p>
                <p className="font-semibold text-gray-800 mt-1">{selectedVendor.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Owner Name</p>
                  <p className="font-semibold mt-1">{selectedVendor.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                  <p className="font-semibold mt-1 truncate">{selectedVendor.email}</p>
                </div>
              </div>

              {/* Uploaded Credential Document */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-semibold mb-1.5">Submitted Identification Document</p>
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                  <span className="font-semibold truncate text-gray-700">📄 {selectedVendor.doc}</span>
                  <button className="text-rose-600 hover:underline font-bold flex-shrink-0 ml-2">Download File</button>
                </div>
              </div>

              {/* Current Status Display */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Current Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                  selectedVendor.status === 'verified' ? 'bg-green-100 text-green-700' : selectedVendor.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedVendor.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                {selectedVendor.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedVendor.id, 'verified')}
                      className="w-full py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
                    >
                      ✅ Approve & Verify
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedVendor.id, 'suspended')}
                      className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                    >
                      ❌ Reject Credentials
                    </button>
                  </>
                )}
                {selectedVendor.status === 'verified' && (
                  <button
                    onClick={() => handleStatusChange(selectedVendor.id, 'suspended')}
                    className="w-full py-2.5 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors"
                  >
                    🚫 Suspend Account
                  </button>
                )}
                {selectedVendor.status === 'suspended' && (
                  <button
                    onClick={() => handleStatusChange(selectedVendor.id, 'verified')}
                    className="w-full py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
                  >
                    ✔️ Reactivate Account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
