// components/design-studio/CakeDesigner.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon, Cake, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { downloadImage, downloadSpecSheet } from '@/lib/utils/download-helper';

const CURATED_CAKES = [
  {
    id: 'cake-1',
    cakeName: 'Royal 3-Tier Floral Fondant',
    occasion: 'wedding',
    theme: 'Royal Wedding Elegance',
    flavors: 'Red Velvet & White Chocolate Ganache',
    tiers: '3',
    shape: 'round',
    colors: 'Ivory White, Blush Pink & Edible Gold Leaf',
    decorationStyle: 'fondant',
    topperIdea: 'Cascading sugar roses and golden monogram topper',
    specialRequirements: 'Eggless, Multi-tier internal support dowels required',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'A breathtaking 3-tier wedding masterpiece adorned with hand-sculpted sugar flowers.'
  },
  {
    id: 'cake-2',
    cakeName: 'Geometric Emerald & Gold Marble',
    occasion: 'anniversary',
    theme: 'Modern Luxury',
    flavors: 'Dark Chocolate Truffle & Espresso Cream',
    tiers: '2',
    shape: 'hexagon',
    colors: 'Emerald Green, White Marble & Metallic Gold',
    decorationStyle: 'geometric',
    topperIdea: 'Acrylic geometric anniversary ring topper',
    specialRequirements: 'Gold foil embellishments and sharp sharp-edged buttercream finish',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'Contemporary hexagonal cake featuring emerald marble textures and crisp gold leaf trim.'
  },
  {
    id: 'cake-3',
    cakeName: 'Rustic Berry Semi-Naked Cake',
    occasion: 'birthday',
    theme: 'Rustic Countryside',
    flavors: 'Vanilla Bean & Wild Berry Compote',
    tiers: '2',
    shape: 'round',
    colors: 'Natural Cream, Crimson Berry & Sage Green',
    decorationStyle: 'naked',
    topperIdea: 'Fresh strawberries, blueberries & rosemary sprigs',
    specialRequirements: 'Light whipped cream icing with visible sponge layers',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    description: 'Charming semi-naked sponge layered with organic berry preserves and topped with fresh berries.'
  },
  {
    id: 'cake-4',
    cakeName: 'Crimson Crown Velvet Cake',
    occasion: 'birthday',
    theme: 'Regal Prince/Princess',
    flavors: 'Classic Red Velvet & Swiss Meringue Buttercream',
    tiers: '1',
    shape: 'heart',
    colors: 'Ruby Red, Pearl White & Bright Gold',
    decorationStyle: 'elegant',
    topperIdea: 'Miniature golden tiara topper and piped shell border',
    specialRequirements: 'Rich velvet texture with edible pearl bead border',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'A luxurious single-tier heart cake with rich red velvet sponges and a golden crown topper.'
  }
];

export default function CakeDesigner() {
  const toast = useToast();
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cakeName: '',
    occasion: 'birthday',
    theme: '',
    flavors: '',
    tiers: '1',
    shape: 'round',
    colors: '',
    decorationStyle: 'fondant',
    topperIdea: '',
    specialRequirements: '',
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleGenerate = async () => {
    setGenerating(true);
    const payload = {
      ...formData,
      cakeName: formData.cakeName.trim() || 'Celebration Cake'
    };
    
    try {
      const response = await fetch('/api/design-studio/generate-cake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const result = await response.json();
      setGeneratedImage(result.imageUrl);
      toast('🎂 Cake design generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating cake design:', error);
      toast('Failed to generate cake design. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadImage = async (url: string, title: string) => {
    setDownloading(true);
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-cake.png`;
    const success = await downloadImage(url, filename);
    if (success) {
      toast('🎂 Cake design image downloaded!', 'success');
    } else {
      toast('Opened cake image in new tab for direct download.', 'info');
    }
    setDownloading(false);
  };

  const handleDownloadSpec = (title: string, details: Record<string, any>) => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-baker-blueprint.txt`;
    downloadSpecSheet(title, 'Cake', details, filename);
    toast('📄 Baker Spec Blueprint downloaded!', 'success');
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Cake className="w-6 h-6 text-pink-600 mr-3" />
            Cake Design Requirements
          </h2>

          <form className="space-y-6">
            {/* Cake Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cake Name/Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cakeName}
                onChange={(e) => {
                  setFormData({ ...formData, cakeName: e.target.value });
                  if (errors.cakeName) setErrors({});
                }}
                placeholder="e.g., Sarah's 25th Birthday Cake"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                  errors.cakeName ? 'border-red-500 ring-2 ring-red-200 bg-red-50/20' : 'border-gray-300'
                }`}
                required
              />
              {errors.cakeName && <p className="text-xs text-red-600 mt-1 font-sans">⚠️ Cake Name is required</p>}
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occasion <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="birthday">Birthday</option>
                <option value="wedding">Wedding</option>
                <option value="anniversary">Anniversary</option>
                <option value="engagement">Engagement</option>
                <option value="baby-shower">Baby Shower</option>
                <option value="graduation">Graduation</option>
                <option value="festival">Festival</option>
                <option value="corporate">Corporate Event</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="e.g., Princess, Unicorn, Floral, Elegant"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Tiers and Shape */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tiers
                </label>
                <select
                  value={formData.tiers}
                  onChange={(e) => setFormData({ ...formData, tiers: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="1">1 Tier</option>
                  <option value="2">2 Tiers</option>
                  <option value="3">3 Tiers</option>
                  <option value="4">4 Tiers</option>
                  <option value="5">5 Tiers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shape
                </label>
                <select
                  value={formData.shape}
                  onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="rectangle">Rectangle</option>
                  <option value="heart">Heart</option>
                  <option value="hexagon">Hexagon</option>
                  <option value="custom">Custom Shape</option>
                </select>
              </div>
            </div>

            {/* Flavors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flavor Preferences
              </label>
              <input
                type="text"
                value={formData.flavors}
                onChange={(e) => setFormData({ ...formData, flavors: e.target.value })}
                placeholder="e.g., Chocolate, Vanilla, Red Velvet"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="e.g., Pink and Gold, White and Blue"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Decoration Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decoration Style
              </label>
              <select
                value={formData.decorationStyle}
                onChange={(e) => setFormData({ ...formData, decorationStyle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="fondant">Fondant</option>
                <option value="buttercream">Buttercream</option>
                <option value="naked">Naked/Semi-Naked</option>
                <option value="drip">Drip Cake</option>
                <option value="floral">Fresh Flowers</option>
                <option value="geometric">Geometric</option>
                <option value="rustic">Rustic</option>
                <option value="elegant">Elegant/Minimal</option>
              </select>
            </div>

            {/* Topper Idea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cake Topper Ideas
              </label>
              <input
                type="text"
                value={formData.topperIdea}
                onChange={(e) => setFormData({ ...formData, topperIdea: e.target.value })}
                placeholder="e.g., Crown, Numbers, Flowers, Custom Message"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                placeholder="e.g., Eggless, Sugar-free, Specific design elements"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Generating Cake Design...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Cake Design
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ImageIcon className="w-6 h-6 text-pink-600 mr-3" />
              Generated Cake Design
            </h2>

            <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center border-2 border-pink-200 overflow-hidden relative">
              {generating ? (
                <div className="text-center p-6">
                  <Loader2 className="animate-spin w-16 h-16 text-pink-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">AI is creating your cake design...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full group">
                  <img
                    src={generatedImage}
                    alt="Generated cake design"
                    className="w-full h-full object-cover rounded-xl"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error('Image failed to load:', generatedImage);
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('&retry=')) {
                        target.src = generatedImage + '&retry=' + Date.now();
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end justify-center p-4">
                    <div className="flex gap-2 w-full max-w-xs">
                      <button
                        onClick={() => handleDownloadImage(generatedImage, formData.cakeName || 'cake-design')}
                        disabled={downloading}
                        className="flex-1 bg-white text-pink-900 py-2 px-3 rounded font-bold text-xs uppercase tracking-wider shadow hover:bg-pink-50 transition flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        Image
                      </button>
                      <button
                        onClick={() => handleDownloadSpec(formData.cakeName || 'Cake Blueprint', formData)}
                        className="flex-1 bg-pink-900 text-white py-2 px-3 rounded font-bold text-xs uppercase tracking-wider shadow hover:bg-pink-800 transition flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        Blueprint
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 p-6">
                  <Cake className="w-16 h-16 mx-auto mb-4 text-pink-300" />
                  <p className="font-semibold text-gray-600">Your AI cake design will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Fill the form and click generate, or choose from ready cake designs below.</p>
                </div>
              )}
            </div>

            {/* Download Actions Bar for Cake */}
            {generatedImage && (
              <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-xl space-y-3">
                <p className="text-xs font-bold text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-pink-700" /> Download Cake Options:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownloadImage(generatedImage, formData.cakeName || 'cake-design')}
                    disabled={downloading}
                    className="w-full bg-pink-600 text-white py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-pink-700 transition flex items-center justify-center gap-2"
                  >
                    {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download Image (PNG)
                  </button>
                  <button
                    onClick={() => handleDownloadSpec(formData.cakeName || 'Cake Blueprint', formData)}
                    className="w-full bg-white text-pink-700 border border-pink-300 py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-pink-100 transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-pink-600" />
                    Download Baker Spec Sheet (TXT)
                  </button>
                </div>
              </div>
            )}
          </div>

          {generatedImage && (
            <div className="mt-6 space-y-3">
              <button
                onClick={handleGenerate}
                className="w-full bg-pink-100 text-pink-700 py-3 rounded-lg font-semibold hover:bg-pink-200 transition-colors"
              >
                🔄 Regenerate with Different Style
              </button>
              <button
                onClick={() => setGeneratedImage(null)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Create New Design
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Curated Cake Gallery & Ready Downloads */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🎂</span> Curated Cake Designs & Blueprints
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Browse artisan cake creations with instant image and baker spec sheet downloads.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-800 px-3 py-1.5 rounded-full mt-3 sm:mt-0 w-fit">
            Ready to Download
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_CAKES.map((item) => (
            <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full">
                  <img
                    src={item.imageUrl}
                    alt={item.cakeName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-pink-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {item.tiers} {parseInt(item.tiers) > 1 ? 'Tiers' : 'Tier'}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-gray-900 text-base">{item.cakeName}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="text-[11px] text-gray-500 pt-1 space-y-0.5">
                    <div><span className="font-semibold text-gray-700">Flavors:</span> {item.flavors}</div>
                    <div><span className="font-semibold text-gray-700">Style:</span> {item.decorationStyle}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => setFormData({
                    cakeName: item.cakeName,
                    occasion: item.occasion,
                    theme: item.theme,
                    flavors: item.flavors,
                    tiers: item.tiers,
                    shape: item.shape,
                    colors: item.colors,
                    decorationStyle: item.decorationStyle,
                    topperIdea: item.topperIdea,
                    specialRequirements: item.specialRequirements,
                  })}
                  className="w-full bg-pink-50 text-pink-700 hover:bg-pink-100 py-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider transition"
                >
                  Use & Customize
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadImage(item.imageUrl, item.cakeName)}
                    className="w-full bg-white border border-pink-300 text-pink-800 hover:bg-pink-50 py-2 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Image
                  </button>
                  <button
                    onClick={() => handleDownloadSpec(item.cakeName, {
                      cakeName: item.cakeName,
                      occasion: item.occasion,
                      theme: item.theme,
                      flavors: item.flavors,
                      tiers: item.tiers,
                      shape: item.shape,
                      colors: item.colors,
                      decorationStyle: item.decorationStyle,
                      topperIdea: item.topperIdea,
                      specialRequirements: item.specialRequirements,
                    })}
                    className="w-full bg-pink-900 text-white hover:bg-pink-800 py-2 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> Baker Spec
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

