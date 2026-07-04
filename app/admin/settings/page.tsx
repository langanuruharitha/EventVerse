'use client';

import { useState, useEffect } from 'react';

const ADMIN_SETTINGS_KEY = 'eventverse_admin_settings';

const getInitialSettings = () => ({
  commission: 10,
  allowRegistration: true,
  autoVerifyVendors: false,
  maxUploadSize: 10,
});

export default function AdminSettingsPage() {
  const [commission, setCommission] = useState(10);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [autoVerifyVendors, setAutoVerifyVendors] = useState(false);
  const [maxUploadSize, setMaxUploadSize] = useState(10); // MB
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Load settings from localStorage or use defaults
    const storedSettings = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setCommission(settings.commission);
      setAllowRegistration(settings.allowRegistration);
      setAutoVerifyVendors(settings.autoVerifyVendors);
      setMaxUploadSize(settings.maxUploadSize);
    } else {
      const initialSettings = getInitialSettings();
      localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(initialSettings));
    }
  }, []);

  const handleSave = () => {
    // Save settings to localStorage
    const settings = {
      commission,
      allowRegistration,
      autoVerifyVendors,
      maxUploadSize,
    };
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
    
    setSuccessMsg('Settings saved successfully! ✅');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings ⚙️</h1>
        <p className="text-gray-500 mt-1">Configure global parameters, commissions, and registration defaults</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {/* Configuration Cards */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Financial Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Platform Commission Fee (%)</label>
            <input
              type="number"
              value={commission}
              onChange={e => setCommission(Number(e.target.value))}
              placeholder="10"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Percentage deducted from gross booking values.</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 pt-4">User & Vendor Registrations</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Allow Customer Registrations</p>
              <p className="text-xs text-gray-400">Permit new customers to create accounts.</p>
            </div>
            <button
              onClick={() => setAllowRegistration(!allowRegistration)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                allowRegistration ? 'bg-rose-600' : 'bg-gray-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                allowRegistration ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Auto-Verify Vendor Accounts</p>
              <p className="text-xs text-gray-400">Verify vendors automatically on signup without reviewing docs.</p>
            </div>
            <button
              onClick={() => setAutoVerifyVendors(!autoVerifyVendors)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                autoVerifyVendors ? 'bg-rose-600' : 'bg-gray-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                autoVerifyVendors ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 pt-4">Storage & System limits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Upload File Size (MB)</label>
            <input
              type="number"
              value={maxUploadSize}
              onChange={e => setMaxUploadSize(Number(e.target.value))}
              placeholder="10"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Applies to ID proof scans and portfolio photos.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg shadow-rose-200"
          >
            Save Settings Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
