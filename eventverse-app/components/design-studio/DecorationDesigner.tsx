// components/design-studio/DecorationDesigner.tsx
'use client';

import { useState } from 'react';
import { Upload, Sparkles, Loader2, Download, Image as ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { downloadImage, downloadSpecSheet } from '@/lib/utils/download-helper';

const CURATED_DECORATIONS = [
  {
    id: 'dec-1',
    theme: 'Royal Marigold & Crimson Mandap',
    style: 'traditional',
    occasion: 'wedding',
    colors: 'Gold, Marigold Yellow, Crimson Red',
    wallDecor: 'Fresh marigold drapes, Brass temple bells, Lotus floral ceiling hanging',
    specificItems: 'Carved Wooden Mandap Pillars, Brass Diya Stands, Red Velvet Bolsters, Flower Carpet',
    traditional: true,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'A regal Indian wedding mandap with traditional marigold garlands and rich brass accents.'
  },
  {
    id: 'dec-2',
    theme: 'Boho Eucalyptus & Fairy Light Arch',
    style: 'rustic',
    occasion: 'engagement',
    colors: 'Sage Green, Cream White, Warm Amber Gold',
    wallDecor: 'Macramé hanging drapes, Dried pampas grass, Fairy light curtain backdrop',
    specificItems: 'Wooden Hexagon Entrance Arch, Vintage Lanterns, Rustic Wood Slices, Pillar Candles',
    traditional: false,
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    description: 'Earthy & romantic boho aesthetic perfect for outdoor engagements and intimate receptions.'
  },
  {
    id: 'dec-3',
    theme: 'Pastel Blossom & Silk Drapes Backdrop',
    style: 'contemporary',
    occasion: 'birthday',
    colors: 'Blush Pink, Lavender, Ivory White',
    wallDecor: 'Organic pastel balloon arch, Hydrangea wall backdrop, Personalized neon title sign',
    specificItems: 'Plinth pedestals, Crystal bead strands, Silk fabric swag, LED spotlighting',
    traditional: false,
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    description: 'Dreamy floral & pastel arrangement featuring elegant backdrop panels and custom lighting.'
  },
  {
    id: 'dec-4',
    theme: 'Celestial Midnight & Gold Canopy',
    style: 'luxury',
    occasion: 'corporate',
    colors: 'Deep Royal Blue, Midnight Navy, Metallic Gold',
    wallDecor: 'Starlight ceiling canopy, Mirror acrylic backdrop, Golden geometric panels',
    specificItems: 'Crystal chandeliers, Gold rimmed glass centerpieces, Velvet stage lounge, Pin spotlights',
    traditional: false,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-luxurious evening gala arrangement with dramatic starlight canopy and gold trimmings.'
  }
];

export default function DecorationDesigner() {
  const toast = useToast();
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    theme: '',
    style: 'modern',
    occasion: 'wedding',
    colors: '',
    wallDecor: '',
    specificItems: '',
    traditional: false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setUploadedImages([...uploadedImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleGenerate = async () => {
    setGenerating(true);
    const payload = {
      ...formData,
      theme: formData.theme.trim() || 'Royal Celebration',
      referenceImages: uploadedImages,
    };
    
    try {
      const response = await fetch('/api/design-studio/generate-decoration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const result = await response.json();
      setGeneratedImage(result.imageUrl);
      toast('✨ Decoration design generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating design:', error);
      toast('Failed to generate design. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadImage = async (url: string, title: string) => {
    setDownloading(true);
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-decoration.png`;
    const success = await downloadImage(url, filename);
    if (success) {
      toast('🎨 Decoration image downloaded!', 'success');
    } else {
      toast('Opened image in new tab for direct download.', 'info');
    }
    setDownloading(false);
  };

  const handleDownloadSpec = (title: string, details: Record<string, any>) => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-spec-blueprint.txt`;
    downloadSpecSheet(title, 'Decoration', details, filename);
    toast('📄 Decoration Spec Blueprint downloaded!', 'success');
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
            Decoration Requirements
          </h2>

          <form className="space-y-6">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => {
                  setFormData({ ...formData, theme: e.target.value });
                  if (errors.theme) setErrors({});
                }}
                placeholder="e.g., Royal Rajasthani, Modern Minimalist"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.theme ? 'border-red-500 ring-2 ring-red-200 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.theme && <p className="text-xs text-red-600 mt-1 font-sans">⚠️ Theme Name is required</p>}
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <select
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="modern">Modern</option>
                <option value="traditional">Traditional</option>
                <option value="contemporary">Contemporary</option>
                <option value="vintage">Vintage</option>
                <option value="rustic">Rustic</option>
                <option value="luxury">Luxury</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occasion
              </label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="engagement">Engagement</option>
                <option value="festival">Festival</option>
                <option value="corporate">Corporate Event</option>
                <option value="baby-shower">Baby Shower</option>
              </select>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Preferences
              </label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="e.g., Gold and Maroon, Pastel Pink"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Wall Decor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wall Decoration Ideas
              </label>
              <input
                type="text"
                value={formData.wallDecor}
                onChange={(e) => setFormData({ ...formData, wallDecor: e.target.value })}
                placeholder="e.g., Floral wall, Balloon arch, Drapes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Specific Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Decoration Items
              </label>
              <textarea
                value={formData.specificItems}
                onChange={(e) => setFormData({ ...formData, specificItems: e.target.value })}
                placeholder="e.g., Chandeliers, String lights, Centerpieces, Entrance arch"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Traditional Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="traditional"
                checked={formData.traditional}
                onChange={(e) => setFormData({ ...formData, traditional: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="traditional" className="ml-2 text-sm text-gray-700">
                Include traditional/cultural elements
              </label>
            </div>

            {/* Image Upload (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Click to upload reference images</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB (Optional)</p>
                </label>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Reference ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Generating Design...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Decoration Design
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ImageIcon className="w-6 h-6 text-purple-600 mr-3" />
              Generated Design
            </h2>

            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200 overflow-hidden relative">
              {generating ? (
                <div className="text-center p-6">
                  <Loader2 className="animate-spin w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">AI is creating your decoration design...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full group">
                  <img
                    src={generatedImage}
                    alt="Generated decoration"
                    className="w-full h-full object-cover rounded-xl"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error('Decoration image failed to load:', generatedImage);
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('&retry=')) {
                        target.src = generatedImage + '&retry=' + Date.now();
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end justify-center p-4">
                    <div className="flex gap-2 w-full max-w-xs">
                      <button
                        onClick={() => handleDownloadImage(generatedImage, formData.theme || 'decoration')}
                        disabled={downloading}
                        className="flex-1 bg-white text-purple-900 py-2 px-3 rounded font-bold text-xs uppercase tracking-wider shadow hover:bg-purple-50 transition flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        Image
                      </button>
                      <button
                        onClick={() => handleDownloadSpec(formData.theme || 'Decoration Design', formData)}
                        className="flex-1 bg-purple-900 text-white py-2 px-3 rounded font-bold text-xs uppercase tracking-wider shadow hover:bg-purple-800 transition flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        Blueprint
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 p-6">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-purple-300" />
                  <p className="font-semibold text-gray-600">Your AI decoration render will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Fill the form and click generate, or choose from popular templates below.</p>
                </div>
              )}
            </div>

            {/* Persistent Download Action Bar when Image is Available */}
            {generatedImage && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
                <p className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-purple-700" /> Download Design Options:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownloadImage(generatedImage, formData.theme || 'decoration')}
                    disabled={downloading}
                    className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  >
                    {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download Image (PNG)
                  </button>
                  <button
                    onClick={() => handleDownloadSpec(formData.theme || 'Decoration Design', formData)}
                    className="w-full bg-white text-purple-700 border border-purple-300 py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-purple-100 transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-purple-600" />
                    Download Spec Sheet (TXT)
                  </button>
                </div>
              </div>
            )}
          </div>

          {generatedImage && (
            <div className="mt-6 space-y-3">
              <button
                onClick={handleGenerate}
                className="w-full bg-purple-100 text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
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

      {/* Curated Inspiration & Ready-to-Download Gallery */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🌺</span> Curated Decoration Designs
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Explore pre-designed themes with instant high-res image and vendor spec sheet downloads.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full mt-3 sm:mt-0 w-fit">
            Ready to Download
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_DECORATIONS.map((item) => (
            <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full">
                  <img
                    src={item.imageUrl}
                    alt={item.theme}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {item.style}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-gray-900 text-base">{item.theme}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="text-[11px] text-gray-500 pt-1">
                    <span className="font-semibold text-gray-700">Colors:</span> {item.colors}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => setFormData({
                    theme: item.theme,
                    style: item.style,
                    occasion: item.occasion,
                    colors: item.colors,
                    wallDecor: item.wallDecor,
                    specificItems: item.specificItems,
                    traditional: item.traditional,
                  })}
                  className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 py-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider transition"
                >
                  Use & Customize
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadImage(item.imageUrl, item.theme)}
                    className="w-full bg-white border border-purple-300 text-purple-800 hover:bg-purple-50 py-2 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Image
                  </button>
                  <button
                    onClick={() => handleDownloadSpec(item.theme, {
                      theme: item.theme,
                      style: item.style,
                      occasion: item.occasion,
                      colors: item.colors,
                      wallDecor: item.wallDecor,
                      specificItems: item.specificItems,
                      traditional: item.traditional,
                    })}
                    className="w-full bg-purple-900 text-white hover:bg-purple-800 py-2 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> Spec Sheet
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

