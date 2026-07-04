export default function TestEventsPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Events Route is Working!
        </h1>
        
        <p className="text-gray-700 mb-4">
          If you can see this page, your app structure is correct.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-yellow-900 mb-2">
            ⚠️ Important Next Steps:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li>Apply the database schema in Supabase</li>
            <li>Make sure you're signed in</li>
            <li>Then visit /events (not /events/test)</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Test Links:</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-blue-600 hover:underline">
                  → Home Page
                </a>
              </li>
              <li>
                <a href="/auth/signin" className="text-blue-600 hover:underline">
                  → Sign In
                </a>
              </li>
              <li>
                <a href="/events" className="text-blue-600 hover:underline">
                  → Events List (requires database schema)
                </a>
              </li>
              <li>
                <a href="/events/new" className="text-blue-600 hover:underline">
                  → Create Event (requires database schema)
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Server Status: ✅ Running
            </h3>
            <p className="text-blue-800 text-sm">
              Your Next.js dev server is running at http://localhost:3000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
