'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function DebugPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('products')
        .select('name, primary_image_url, category_id, event_types')
        .limit(10);

      if (error) {
        console.error('Error:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Product Debug Page</h1>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="font-bold">Check if primary_image_url is present:</p>
        <p>If you see URLs below, database is correct. If NULL/empty, run FINAL-EXACT-IMAGES.sql again.</p>
      </div>

      <div className="space-y-4">
        {products.map((product, idx) => (
          <div key={idx} className="bg-white border rounded-lg p-4 shadow">
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Image URL:</span>
                <div className="mt-1 p-2 bg-gray-100 rounded break-all">
                  {product.primary_image_url || <span className="text-red-500">❌ NULL/EMPTY</span>}
                </div>
              </div>
              
              <div>
                <span className="font-semibold">Event Types:</span>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {product.event_types?.join(', ') || 'None'}
                </div>
              </div>
            </div>

            {product.primary_image_url && (
              <div className="mt-4">
                <span className="font-semibold">Image Preview:</span>
                <img 
                  src={product.primary_image_url} 
                  alt={product.name}
                  className="mt-2 w-64 h-64 object-cover rounded border"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-100 rounded">
        <h2 className="font-bold mb-2">✅ If you see image URLs above:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Database has correct images</li>
          <li>Clear .next folder: <code className="bg-white px-2 py-1 rounded">rm -rf .next</code></li>
          <li>Restart dev server: <code className="bg-white px-2 py-1 rounded">npm run dev</code></li>
          <li>Hard refresh browser: <code className="bg-white px-2 py-1 rounded">Ctrl + Shift + R</code></li>
        </ol>

        <h2 className="font-bold mt-4 mb-2">❌ If you see NULL/EMPTY:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>SQL didn't run properly</li>
          <li>Go to Supabase SQL Editor</li>
          <li>Run FINAL-EXACT-IMAGES.sql again</li>
          <li>Refresh this debug page</li>
        </ol>
      </div>
    </div>
  );
}
