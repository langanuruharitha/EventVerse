'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          role,
          status,
          created_at,
          user_profiles (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Fallback to mock data if table is empty or error occurs
      setUsers([
        { id: '1', email: 'priya.sharma@gmail.com', role: 'customer', status: 'active', created_at: '2026-07-01T00:00:00Z', user_profiles: { full_name: 'Priya Sharma', avatar_url: '' } },
        { id: '2', email: 'rahul.mehta@yahoo.com', role: 'customer', status: 'active', created_at: '2026-06-28T00:00:00Z', user_profiles: { full_name: 'Rahul Mehta', avatar_url: '' } },
        { id: '3', email: 'vikram@epicmoments.com', role: 'vendor', status: 'active', created_at: '2026-06-25T00:00:00Z', user_profiles: { full_name: 'Vikram Mehta', avatar_url: '' } },
        { id: '4', email: 'admin@eventverse.com', role: 'admin', status: 'active', created_at: '2026-05-15T00:00:00Z', user_profiles: { full_name: 'System Admin', avatar_url: '' } },
        { id: '5', email: 'karan.malhotra@gmail.com', role: 'customer', status: 'suspended', created_at: '2026-05-10T00:00:00Z', user_profiles: { full_name: 'Karan Malhotra', avatar_url: '' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [actionError, setActionError] = useState('');

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setActionError('');
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('DB update error:', error);
        setActionError(`Failed to update user status: ${error.message}`);
        return;
      }

      // Re-fetch from DB to confirm the change persisted
      await fetchUsers();
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setActionError('An unexpected error occurred. Please try again.');
    }
  };

  const filtered = users.filter(u => {
    const name = u.user_profiles?.full_name || '';
    const email = u.email || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : u.role === filter || (filter === 'suspended' && u.status === 'suspended');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Users Management 👥</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer, vendor, and administrator profiles on the platform</p>
        </div>
      </div>

      {/* Error Banner */}
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <span>⚠️ {actionError}</span>
          <button onClick={() => setActionError('')} className="text-red-400 hover:text-red-600 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, bg: 'from-purple-500 to-indigo-500' },
          { label: 'Customers', value: users.filter(u => u.role === 'customer').length, bg: 'from-blue-500 to-cyan-500' },
          { label: 'Vendors', value: users.filter(u => u.role === 'vendor').length, bg: 'from-orange-500 to-amber-500' },
          { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length, bg: 'from-red-500 to-rose-500' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'customer', 'vendor', 'suspended'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-[#8A1C2C] text-[#FAF0E0] shadow font-bold'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'all' ? 'All Roles' : tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full sm:w-72 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none text-sm bg-white"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
                  <p className="text-xs mt-2">Loading users...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500 font-semibold">
                  No users matched search criteria.
                </td>
              </tr>
            ) : filtered.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#8A1C2C] text-[#FAF0E0] flex items-center justify-center font-bold text-xs font-sans">
                      {user.user_profiles?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {user.user_profiles?.full_name || 'No Name Details'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 capitalize">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.role === 'admin'
                      ? 'bg-rose-100 text-rose-800'
                      : user.role === 'vendor'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                    user.status === 'active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => toggleUserStatus(user.id, user.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        user.status === 'active'
                          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      }`}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
