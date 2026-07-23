'use client';

const mockReports = [
  { month: 'Jan', volume: 280000, commission: 28000 },
  { month: 'Feb', volume: 320000, commission: 32000 },
  { month: 'Mar', volume: 450000, commission: 45000 },
  { month: 'Apr', volume: 680000, commission: 68000 },
  { month: 'May', volume: 920000, commission: 92000 },
  { month: 'Jun', volume: 1630000, commission: 163000 },
];

export default function AdminAnalyticsPage() {
  const maxVal = Math.max(...mockReports.map(r => r.volume));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics 📈</h1>
        <p className="text-gray-500 mt-1">Monitor transaction volumes, platform revenue, and growth KPIs</p>
      </div>

      {/* Revenue summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Gross Transaction Volume</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹4,280,500</p>
          <span className="text-xs text-green-600 font-semibold block mt-1">▲ 24% from last quarter</span>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Net Admin Commission (10%)</p>
          <p className="text-3xl font-bold text-[#8A1C2C] mt-2 font-sans">₹428,050</p>
          <span className="text-xs text-green-600 font-semibold block mt-1">▲ 18% from last month</span>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Average Order Value</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹28,500</p>
          <span className="text-xs text-gray-400 block mt-1">Per transaction booking</span>
        </div>
      </div>

      {/* Interactive visual SVG Chart representing Transaction Growth */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction Volume Trends (H1 2026)</h2>
        <div className="relative w-full h-64 flex items-end justify-between gap-4 pt-6">
          {mockReports.map((report) => {
            const heightPct = (report.volume / maxVal) * 100; // Scale relative to the bar container
            return (
              <div key={report.month} className="flex-1 h-full flex flex-col items-center justify-end group">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity font-semibold pointer-events-none z-10">
                  Vol: ₹{report.volume.toLocaleString('en-IN')}<br/>
                  Fee: ₹{report.commission.toLocaleString('en-IN')}
                </div>
                {/* Bar Container */}
                <div className="w-full flex-1 flex items-end relative">
                  <div
                    className="w-full bg-gradient-to-t from-[#8A1C2C] to-[#6B1522] rounded-t transition-all duration-500 hover:opacity-90 cursor-pointer shadow-sm"
                    style={{ height: `${heightPct * 0.8}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-500 mt-3">{report.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Monthly Revenue Details</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Month</th>
              <th className="px-6 py-4">Gross Booking Volume</th>
              <th className="px-6 py-4">Admin Commission Received</th>
              <th className="px-6 py-4">Payouts Transferred</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
            {mockReports.map(report => (
              <tr key={report.month} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold">{report.month} 2026</td>
                <td className="px-6 py-4">₹{report.volume.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-[#8A1C2C] font-bold font-sans">₹{report.commission.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-gray-600">₹{(report.volume - report.commission).toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">SETTLED</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
