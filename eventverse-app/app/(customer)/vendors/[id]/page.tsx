'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, Star, MapPin, Phone, Mail, Globe, 
  Calendar, DollarSign, Users, Award, Clock, Shield 
} from 'lucide-react';

interface Vendor {
  id: string;
  business_name: string;
  business_description: string;
  category: string;
  subcategories: string[];
  location: string;
  city: string;
  state: string;
  contact_email: string;
  contact_phone: string;
  website_url?: string;
  logo_url?: string;
  banner_url?: string;
  rating_average: number;
  review_count: number;
  years_experience: number;
  team_size?: number;
  minimum_booking_amount?: number;
  advance_percentage?: number;
  operating_hours?: any;
  portfolio_images?: string[];
  certifications?: string[];
  services_offered?: string[];
  verified: boolean;
}

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'portfolio' | 'reviews'>('overview');

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
        <Button onClick={() => router.push('/vendors')}>Back to Vendors</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Banner */}
      {vendor.banner_url && (
        <div className="w-full h-64 bg-gray-200">
          <img
            src={vendor.banner_url}
            alt={vendor.business_name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Vendor Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-white border shadow-sm">
              {vendor.logo_url ? (
                <img
                  src={vendor.logo_url}
                  alt={vendor.business_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 text-4xl font-bold">
                  {vendor.business_name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Vendor Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">{vendor.business_name}</h1>
                  {vendor.verified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">{vendor.category}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(vendor.rating_average)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{vendor.rating_average.toFixed(1)}</span>
              <span className="text-gray-500">({vendor.review_count} reviews)</span>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{vendor.city}, {vendor.state}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-gray-400" />
                <span>{vendor.years_experience} years exp.</span>
              </div>
              {vendor.team_size && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{vendor.team_size} team members</span>
                </div>
              )}
              {vendor.minimum_booking_amount && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>Min ₹{vendor.minimum_booking_amount}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button className="gap-2">
                <Calendar className="w-4 h-4" />
                Request Booking
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex gap-6">
            {['overview', 'services', 'portfolio', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 px-2 capitalize transition ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {vendor.business_description}
                  </p>
                </Card>

                {/* Services Offered */}
                {vendor.services_offered && vendor.services_offered.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Services Offered</h2>
                    <div className="flex flex-wrap gap-2">
                      {vendor.services_offered.map((service, idx) => (
                        <Badge key={idx} variant="info">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Certifications */}
                {vendor.certifications && vendor.certifications.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Certifications</h2>
                    <ul className="space-y-2">
                      {vendor.certifications.map((cert, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Services & Packages</h2>
                <p className="text-gray-600">
                  Service packages and pricing details will be displayed here.
                </p>
              </Card>
            )}

            {activeTab === 'portfolio' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Portfolio</h2>
                {vendor.portfolio_images && vendor.portfolio_images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.portfolio_images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`Portfolio ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No portfolio images available.</p>
                )}
              </Card>
            )}

            {activeTab === 'reviews' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                <p className="text-gray-600">
                  Reviews and ratings will be displayed here.
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${vendor.contact_email}`} className="text-purple-600 hover:underline">
                    {vendor.contact_email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${vendor.contact_phone}`} className="text-purple-600 hover:underline">
                    {vendor.contact_phone}
                  </a>
                </div>
                {vendor.website_url && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a 
                      href={vendor.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span>{vendor.location}</span>
                </div>
              </div>
            </Card>

            {/* Operating Hours */}
            {vendor.operating_hours && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Operating Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mon - Fri</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sat</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sun</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Booking Info */}
            <Card className="p-6 bg-purple-50 border-purple-200">
              <h3 className="font-bold mb-3">Booking Information</h3>
              <div className="space-y-2 text-sm">
                {vendor.advance_percentage && (
                  <p>
                    <span className="text-gray-600">Advance:</span>{' '}
                    <span className="font-medium">{vendor.advance_percentage}%</span>
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-3">
                  Contact the vendor to discuss your requirements and get a customized quote.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
