// app/(customer)/test-images/page.tsx
'use client';

import { useState } from 'react';

export default function TestImagesPage() {
  const [testResults, setTestResults] = useState<{ url: string; loaded: boolean; error: string }[]>([]);

  const testUrls = [
    { name: 'Placeholder (Control)', url: 'https://via.placeholder.com/512/FF6B6B/FFFFFF?text=Control+Test' },
    { name: 'Unsplash', url: 'https://source.unsplash.com/512x512/?wedding,decoration' },
    { name: 'Pollinations - Turbo', url: 'https://image.pollinations.ai/prompt/beautiful%20red%20rose?width=512&height=512&model=turbo&nologo=true' },
    { name: 'Pollinations - Flux', url: 'https://image.pollinations.ai/prompt/wedding%20decoration?width=512&height=512&model=flux&nologo=true&enhance=true' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Image Loading Test Page</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-800">
            <strong>Instructions:</strong> This page tests different image sources. 
            Check which images load and which show errors. Open browser console (F12) for detailed logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testUrls.map((test, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">{test.name}</h3>
              
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative">
                <img
                  src={test.url}
                  alt={test.name}
                  className="w-full h-full object-cover rounded-lg"
                  onLoad={() => {
                    console.log(`✅ ${test.name} loaded successfully!`);
                    setTestResults(prev => [...prev, { url: test.url, loaded: true, error: '' }]);
                  }}
                  onError={(e) => {
                    const error = `Failed to load`;
                    console.error(`❌ ${test.name} failed:`, error);
                    setTestResults(prev => [...prev, { url: test.url, loaded: false, error }]);
                  }}
                  crossOrigin="anonymous"
                />
              </div>

              <div className="text-xs break-all bg-gray-50 p-3 rounded">
                <strong>URL:</strong> {test.url}
              </div>

              <div className="mt-3">
                <a
                  href={test.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  → Open in new tab
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="font-bold text-xl mb-4">📊 Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">Waiting for images to load...</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className={`p-3 rounded ${result.loaded ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={result.loaded ? 'text-green-800' : 'text-red-800'}>
                    {result.loaded ? '✅' : '❌'} {result.url.substring(0, 80)}...
                    {result.error && <span className="ml-2">({result.error})</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 What to Check:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>If "Placeholder" loads → Your browser and internet work fine</li>
            <li>If "Unsplash" loads → External images work (no firewall blocking)</li>
            <li>If "Pollinations" loads → AI generation service works</li>
            <li>If nothing loads → Check internet connection or firewall</li>
          </ul>
        </div>

        <div className="mt-8 bg-gray-800 text-gray-100 rounded-lg p-6">
          <h3 className="font-bold mb-3">🔧 Next Steps Based on Results:</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-green-400">✅ All images load:</strong>
              <p className="ml-4">Great! The issue is in the main Design Studio components. Need to fix the component code.</p>
            </div>
            <div>
              <strong className="text-yellow-400">⚠️ Only Placeholder/Unsplash load:</strong>
              <p className="ml-4">Pollinations.ai is blocked or not working. We need to use a different AI service.</p>
            </div>
            <div>
              <strong className="text-red-400">❌ No images load:</strong>
              <p className="ml-4">Browser/network issue. Check internet connection, firewall, or try a different browser.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
