'use client';

import { useState } from 'react';

const mockTransactions = [
  { id: 'TXN1001', customer: 'Priya Sharma', service: 'Wedding Photography', date: '2026-07-02', amount: 45000, commission: 4500, net: 40500, status: 'paid' },
  { id: 'TXN1002', customer: 'Rahul Mehta', service: 'Birthday Decoration', date: '2026-07-01', amount: 12000, commission: 1200, net: 10800, status: 'pending' },
  { id: 'TXN1003', customer: 'Vikram Patel', service: 'Wedding Photography', date: '2026-06-25', amount: 52000, commission: 5200, net: 46800, status: 'paid' },
  { id: 'TXN1004', customer: 'Meera Joshi', service: 'Birthday Decoration', date: '2026-06-18', amount: 9500, commission: 950, net: 8550, status: 'paid' },
];

const mockPayouts = [
  { id: 'PAY001', date: '2026-06-28', amount: 46800, bank: 'HDFC Bank ****1234', status: 'completed' },
  { id: 'PAY002', date: '2026-06-15', amount: 8550, bank: 'HDFC Bank ****1234', status: 'completed' },
];

export default function VendorEarningsPage() {
  const [transactions] = useState(mockTransactions);
  const [payouts, setPayouts] = useState(mockPayouts);
  const [requestAmount, setRequestAmount] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const totalEarnings = transactions.reduce((a, t) => a + t.net, 0);
  const pendingPayout = transactions.filter(t => t.status === 'pending').reduce((a, t) => a + t.net, 0);
  const paidPayout = payouts.reduce((a, p) => a + p.amount, 0);

  const handleRequestPayout = () => {
    if (!requestAmount || Number(requestAmount) <= 0) return;
    const amount = Number(requestAmount);
    setPayouts([{ id: `PAY00${payouts.length + 1}`, date: new Date().toISOString().split('T')[0], amount, bank: 'HDFC Bank ****1234', status: 'pending' }, ...payouts]);
    setShowRequestModal(false);
    setRequestAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts 💰</h1>
          <p className="text-gray-500 mt-1">Track your revenue, platform fee, and withdraw payouts</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-200"
        >
          💸 Request Payout
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-400 uppercase">Total Revenue (Net)</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalEarnings.toLocaleString('en-IN')}</p>
          <span className="text-xs font-semibold text-gray-400 block mt-1">After 10% platform commission fee</span>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-400 uppercase">Withdrawable Balance</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹{pendingPayout.toLocaleString('en-IN')}</p>
          <span className="text-xs font-semibold text-orange-500 block mt-1">Funds currently pending payout</span>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-400 uppercase">Paid Out</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{paidPayout.toLocaleString('en-IN')}</p>
          <span className="text-xs font-semibold text-green-500 block mt-1">Transferred to your bank account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-500">Earnings breakdown per booking</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer / Service</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fee (10%)</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Net Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {transactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{txn.customer}</p>
                      <p className="text-xs text-gray-500">{txn.service}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{txn.date}</td>
                    <td className="px-6 py-4 text-gray-600">₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-red-500">-₹{txn.commission.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{txn.net.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Payout History</h2>
            <p className="text-sm text-gray-500">Withdrawals to bank</p>
          </div>
          <div className="p-6 space-y-4">
            {payouts.map(pay => (
              <div key={pay.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900">₹{pay.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pay.date} • {pay.bank}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  pay.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                } capitalize`}>
                  {pay.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Payout Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">💸 Request Bank Transfer</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Bank Account</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none">
                  <option>HDFC Bank - ****1234 (Primary)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Transfer Amount (₹)</label>
                <input
                  type="number"
                  value={requestAmount}
                  onChange={e => setRequestAmount(e.target.value)}
                  placeholder={`Max ₹${pendingPayout}`}
                  max={pendingPayout}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                />
              </div>
              <p className="text-xs text-gray-500">Note: Transfers usually take 1-2 business days to settle in your bank account.</p>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPayout}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                Request Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
