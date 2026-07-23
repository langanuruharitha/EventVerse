// components/design-studio/DecorationDesigner.tsx
'use client';

import { useState } from 'react';
import { Upload, Sparkles, Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { Toast, useToast } from '@/components/ui/Toast';

export default function DecorationDesigner() {
  const { toasts, addToast, removeToast } = useToast();
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

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/design-studio/generate-decoration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          referenceImages: uploadedImages,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const result = await response.json();
      setGeneratedImage(result.imageUrl);
      addToast('✨ Decoration design generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating design:', error);
      addToast('Failed to generate design. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
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
              Theme Name
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              placeholder="e.g., Royal Rajasthani, Modern Minimalist"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
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
            disabled={generating || !formData.theme}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <ImageIcon className="w-6 h-6 text-purple-600 mr-3" />
          Generated Design
        </h2>

        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
          {generating ? (
            <div className="text-center">
              <Loader2 className="animate-spin w-16 h-16 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">AI is creating your decoration design...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
            </div>
          ) : generatedImage ? (
            <div className="relative w-full h-full">
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
                onLoad={() => console.log('Decoration image loaded successfully!')}
              />
              <button
                onClick={async () => {
                  if (!generatedImage) return;
                  setDownloading(true);
                  try {
                    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(generatedImage)}`;
                    const res = await fetch(proxyUrl);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'decoration-design.png';
                    link.click();
                    URL.revokeObjectURL(url);
                    addToast('🎨 Decoration design downloaded!', 'success');
                  } catch {
                    addToast('Download failed. Please try right-clicking the image to save.', 'error');
                  } finally {
                    setDownloading(false);
                  }
                }}
                disabled={downloading}
                className="absolute bottom-4 right-4 bg-white text-[#8A1C2C] px-4 py-2 rounded font-semibold shadow-lg hover:bg-[#FAF6F0] transition-colors flex items-center gap-2 border border-[#C5A880] font-sans text-xs uppercase tracking-wider disabled:opacity-60"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? 'Downloading...' : 'Download Image'}
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-4" />
              <p>Your AI-generated decoration will appear here</p>
              <p className="text-sm mt-2">Fill the form and click generate</p>
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
    <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}
