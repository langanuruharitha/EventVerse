// components/decoration/ThemeGallery.tsx
'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Sparkles, TrendingUp, Heart, Star } from 'lucide-react';

interface Theme {
  id: string;
  theme_name: string;
  description: string;
  style_category: string;
  color_palette: {
    primary: string;
    secondary: string;
    accent: string;
    highlight?: string;
  };
  suitable_events: string[];
  cost_range_min: number;
  cost_range_max: number;
  popularity_score: number;
  is_premium: boolean;
}

export default function ThemeGallery() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('decoration_themes')
        .select('*')
        .order('popularity_score', { ascending: false });

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = ['all', 'modern', 'traditional', 'vintage', 'rustic', 'luxury'];

  const filteredThemes = selectedStyle === 'all'
    ? themes
    : themes.filter(t => t.style_category === selectedStyle);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading themes...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Style Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        {styles.map(style => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedStyle === style
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredThemes.map(theme => (
          <div
            key={theme.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100"
          >
            {/* Color Palette Preview */}
            <div className="h-32 flex">
              <div
                className="flex-1"
                style={{ backgroundColor: theme.color_palette.primary }}
              />
              <div
                className="flex-1"
                style={{ backgroundColor: theme.color_palette.secondary }}
              />
              <div
                className="flex-1"
                style={{ backgroundColor: theme.color_palette.accent }}
              />
              {theme.color_palette.highlight && (
                <div
                  className="flex-1"
                  style={{ backgroundColor: theme.color_palette.highlight }}
                />
              )}
            </div>

            {/* Theme Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {theme.theme_name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {theme.style_category.charAt(0).toUpperCase() + theme.style_category.slice(1)}
                  </span>
                </div>
                {theme.is_premium && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="w-3 h-3 mr-1" fill="currentColor" />
                    Premium
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {theme.description}
              </p>

              {/* Suitable Events */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Perfect for:</p>
                <div className="flex flex-wrap gap-2">
                  {theme.suitable_events.map(event => (
                    <span
                      key={event}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cost Range */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Budget Range</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{(theme.cost_range_min / 1000).toFixed(0)}K - ₹{(theme.cost_range_max / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="flex items-center text-yellow-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{theme.popularity_score}% popular</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No themes found for this style.</p>
        </div>
      )}
    </div>
  );
}
