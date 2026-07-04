'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If no vendors in database, show demo vendors
      if (!data || data.length === 0) {
        setVendors([
          { 
            id: 'demo-1', 
            business_name: 'Epic Moments Photography', 
            category: 'Photography', 
            owner_name: 'Vikram Mehta', 
            email: 'vikram@epicmoments.com', 
            verification_status: 'verified', 
            documents: 'Aadhaar_Pan_Card.pdf', 
            rating: 4.8,
            created_at: new Date().toISOString()
          },
          { 
            id: 'demo-2', 
            business_name: 'Golden Catering Services', 
            category: 'Catering', 
            owner_name: 'Ramesh Patel', 
            email: 'ramesh@goldencatering.com', 
            verification_status: 'pending', 
            documents: 'FSSAI_License.pdf', 
            rating: 0.0,
            created_at: new Date().toISOString()
          },
          { 
            id: 'demo-3', 
            business_name: 'DJ Rhythm Beats', 
            category: 'DJ Services', 
            owner_name: 'Arjun Das', 
            email: 'arjun@djrhythm.com', 
            verification_status: 'pending', 
            documents: 'Shop_Establishment_Act.pdf', 
            rating: 0.0,
            created_at: new Date().toISOString()
          },
          { 
            id: 'demo-4', 
            business_name: 'Dream Decorators', 
            category: 'Decoration', 
            owner_name: 'Nisha Singhal', 
            email: 'nisha@dreamdecors.com', 
            verification_status: 'verified', 
            documents: 'GST_Certificate.pdf', 
            rating: 4.5,
            created_at: new Date().toISOString()
          },
          { 
            id: 'demo-5', 
            business_name: 'Royal Palace Venue', 
            category: 'Venue', 
            owner_name: 'Sanjay Dutt', 
            email: 'sanjay@royalpalace.com', 
            verification_status: 'suspended', 
            documents: 'Property_Tax_Receipt.pdf', 
            rating: 3.2,
            created_at: new Date().toISOString()
          },
        ]);
      } else {
        setVendors(data);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      // Show demo vendors on error too
      setVendors([
        { 
          id: 'demo-1', 
          business_name: 'Epic Moments Photography', 
          category: 'Photography', 
          owner_name: 'Vikram Mehta', 
          email: 'vikram@epicmoments.com', 
          verification_status: 'verified', 
          documents: 'Aadhaar_Pan_Card.pdf', 
          rating: 4.8,
          created_at: new Date().toISOString()
        },
        { 
          id: 'demo-2', 
          business_name: 'Golden Catering Services', 
          category: 'Catering', 
          owner_name: 'Ramesh Patel', 
          email: 'ramesh@goldencatering.com', 
          verification_status: 'pending', 
          documents: 'FSSAI_License.pdf', 
          rating: 0.0,
          created_at: new Date().toISOString()
        },
        { 
          id: 'demo-3', 
          business_name: 'DJ Rhythm Beats', 
          category: 'DJ Services', 
          owner_name: 'Arjun Das', 
          email: 'arjun@djrhythm.com', 
          verification_status: 'pending', 
          documents: 'Shop_Establishment_Act.pdf', 
          rating: 0.0,
          created_at: new Date().toISOString()
        },
        { 
          id: 'demo-4', 
          business_name: 'Dream Decorators', 
          category: 'Decoration', 
          owner_name: 'Nisha Singhal', 
          email: 'nisha@dreamdecors.com', 
          verification_status: 'verified', 
          documents: 'GST_Certificate.pdf', 
          rating: 4.5,
          created_at: new Date().toISOString()
        },
        { 
          id: 'demo-5', 
          business_name: 'Royal Palace Venue', 
          category: 'Venue', 
          owner_name: 'Sanjay Dutt', 
          email: 'sanjay@royalpalace.com', 
          verification_status: 'suspended', 
          documents: 'Property_Tax_Receipt.pdf', 
          rating: 3.2,
          created_at: new Date().toISOString()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Check if it's a demo vendor (starts with 'demo-')
      const isDemoVendor = id.startsWith('demo-');
      
      if (!isDemoVendor) {
        // Real vendor - update in database
        const supabase = createBrowserClient();
        
        const { error } = await supabase
          .from('vendors')
          .update({ 
            verification_status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;
      }

      // Update local state (for both demo and real vendors)
      setVendors(vendors.map(v => v.id === id ? { ...v, verification_status: newStatus } : v));
      if (selectedVendor?.id === id) {
        setSelectedVendor({ ...selectedVendor, verification_status: newStatus });
      }

      alert(`Vendor status updated to ${newStatus}${isDemoVendor ? ' (Demo mode - changes in memory only)' : ''}`);
    } catch (err) {
      console.error('Error updating vendor status:', err);
      alert('Failed to update vendor status. Please try again.');
    }
  };

  const filtered = vendors.filter(v => {
    const matchesSearch = 
      v.business_name?.toLowerCase().includes(search.toLowerCase()) || 
      v.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : v.verification_status === filter;
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
                      <p className="text-xs mt-2">Loading vendors...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-semibold">
                      No vendors found.
                    </td>
                  </tr>
                ) : filtered.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{vendor.business_name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">By {vendor.owner_name || 'N/A'} ({vendor.email || 'N/A'})</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{vendor.category || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-semibold text-gray-700">⭐ {vendor.rating > 0 ? vendor.rating : 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                        vendor.verification_status === 'verified'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : vendor.verification_status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {vendor.verification_status || 'pending'}
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
                <p className="font-bold text-gray-900 mt-1">{selectedVendor.business_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Category</p>
                <p className="font-semibold text-gray-800 mt-1">{selectedVendor.category || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Owner Name</p>
                  <p className="font-semibold mt-1">{selectedVendor.owner_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                  <p className="font-semibold mt-1 truncate">{selectedVendor.email || 'N/A'}</p>
                </div>
              </div>

              {/* Uploaded Credential Document */}
              {selectedVendor.documents && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-semibold mb-1.5">Submitted Identification Document</p>
                  <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                    <span className="font-semibold truncate text-gray-700">📄 {selectedVendor.documents}</span>
                    <button className="text-rose-600 hover:underline font-bold flex-shrink-0 ml-2">Download File</button>
                  </div>
                </div>
              )}

              {/* Current Status Display */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Current Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                  selectedVendor.verification_status === 'verified' ? 'bg-green-100 text-green-700' : selectedVendor.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedVendor.verification_status || 'pending'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                {selectedVendor.verification_status === 'pending' && (
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
                {selectedVendor.verification_status === 'verified' && (
                  <button
                    onClick={() => handleStatusChange(selectedVendor.id, 'suspended')}
                    className="w-full py-2.5 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors"
                  >
                    🚫 Suspend Account
                  </button>
                )}
                {selectedVendor.verification_status === 'suspended' && (
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
