'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { editableTemplatesList } from '@/lib/templates/editable-templates';

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateRef = useRef<HTMLDivElement>(null);
  
  // Get template component based on ID (must be before using templateData)
  const templateData = editableTemplatesList.find(t => t.id === params.templateId);
  const TemplateComponent = templateData?.component || editableTemplatesList[0].component;
  
  // Get event category from template
  const eventCategory = templateData?.category || 'birthday';
  
  // Set initial form data based on template category
  const getInitialFormData = () => {
    switch(eventCategory) {
      case 'corporate':
        return {
          eventName: "Annual Tech Conference 2026",
          hostName: "TechCorp Solutions",
          date: "March 15, 2026",
          time: "9:00 AM",
          venue: "Grand Convention Center, Mumbai",
          message: "Join us for a day of innovation and networking",
          age: "",
          year: "",
          brideName: "",
          groomName: "",
          coupleName: "",
          companyName: "TechCorp Solutions",
          organizer: "John Doe, Events Manager",
        };
      case 'wedding':
        return {
          eventName: "The Wedding Celebration",
          hostName: "Sarah & Michael",
          date: "June 20, 2026",
          time: "5:00 PM",
          venue: "Royal Palace Gardens, Mumbai",
          message: "Join us as we celebrate our love",
          age: "",
          year: "",
          brideName: "Sarah Johnson",
          groomName: "Michael Smith",
          coupleName: "Sarah & Michael",
          companyName: "",
          organizer: "",
        };
      case 'anniversary':
        return {
          eventName: "25th Anniversary Celebration",
          hostName: "John & Jane Smith",
          date: "August 10, 2026",
          time: "6:00 PM",
          venue: "Sunset Resort, Goa",
          message: "Celebrating 25 years of love and togetherness",
          age: "",
          year: "25",
          brideName: "",
          groomName: "",
          coupleName: "John & Jane Smith",
          companyName: "",
          organizer: "",
        };
      default: // birthday
        return {
          eventName: "Sarah's Birthday Party",
          hostName: "Sarah Johnson",
          date: "December 25, 2026",
          time: "7:00 PM",
          venue: "Royal Gardens, Mumbai",
          message: "Join us for an evening of celebration!",
          age: "25",
          year: "",
          brideName: "",
          groomName: "",
          coupleName: "",
          companyName: "",
          organizer: "",
        };
    }
  };
  
  const [formData, setFormData] = useState(getInitialFormData());
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    if (!templateRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(templateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `${formData.eventName.replace(/\s+/g, '-')}-invitation.png`;
    link.href = generatedImage;
    link.click();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/invitations/templates"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Templates
          </Link>
          <h1 className="text-3xl font-bold">Edit Your Invitation</h1>
          <p className="text-purple-100">Customize the details and generate your invitation</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Edit Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Details</h2>
            
            <div className="space-y-6">
              {/* Birthday Fields */}
              {eventCategory === 'birthday' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      value={formData.eventName}
                      onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                      placeholder="e.g., Sarah's 25th Birthday"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Host Name *
                    </label>
                    <input
                      type="text"
                      value={formData.hostName}
                      onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                      placeholder="e.g., Sarah Johnson"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g., 25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Anniversary Fields */}
              {eventCategory === 'anniversary' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Couple Names *
                    </label>
                    <input
                      type="text"
                      value={formData.hostName}
                      onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                      placeholder="e.g., John & Jane Smith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Years Together *
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g., 25, 50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Anniversary Title *
                    </label>
                    <input
                      type="text"
                      value={formData.eventName}
                      onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                      placeholder="e.g., Silver Anniversary, Golden Anniversary"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Wedding Fields */}
              {eventCategory === 'wedding' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bride's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.brideName || formData.hostName.split(' & ')[0] || ''}
                      onChange={(e) => {
                        const groom = formData.groomName || formData.hostName.split(' & ')[1] || '';
                        setFormData({ 
                          ...formData, 
                          brideName: e.target.value,
                          hostName: `${e.target.value}${groom ? ' & ' + groom : ''}`
                        });
                      }}
                      placeholder="e.g., Sarah Johnson"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Groom's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.groomName || formData.hostName.split(' & ')[1] || ''}
                      onChange={(e) => {
                        const bride = formData.brideName || formData.hostName.split(' & ')[0] || '';
                        setFormData({ 
                          ...formData, 
                          groomName: e.target.value,
                          hostName: `${bride}${e.target.value ? ' & ' + e.target.value : ''}`
                        });
                      }}
                      placeholder="e.g., Michael Smith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Wedding Title
                    </label>
                    <input
                      type="text"
                      value={formData.eventName}
                      onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                      placeholder="e.g., The Wedding Celebration"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Corporate Fields */}
              {eventCategory === 'corporate' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={formData.eventName}
                      onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                      placeholder="e.g., Annual Tech Conference 2026"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      value={formData.hostName}
                      onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                      placeholder="e.g., TechCorp Solutions"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organizer / Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      placeholder="e.g., John Doe, Events Manager"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              
              {/* Common Fields - Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Dec 25, 2026"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="7:00 PM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Venue */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g., Royal Gardens, Mumbai"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={
                    eventCategory === 'birthday' ? 'e.g., Join us for an evening of celebration!' :
                    eventCategory === 'anniversary' ? 'e.g., Please join us as we celebrate our love' :
                    eventCategory === 'wedding' ? 'e.g., Reception to follow' :
                    'e.g., Light refreshments will be served'
                  }
                />
              </div>
              
              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin">⏳</div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6" />
                    Generate Invitation
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Right: Live Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Preview</h2>
              
              <div className="flex justify-center bg-gray-100 rounded-lg p-8">
                <div ref={templateRef} style={{ transform: 'scale(0.7)', transformOrigin: 'top center' }}>
                  <TemplateComponent data={formData} />
                </div>
              </div>
            </div>
            
            {/* Generated Image */}
            {generatedImage && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Generated Invitation</h2>
                
                <div className="mb-6">
                  <img
                    src={generatedImage}
                    alt="Generated Invitation"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center justify-center gap-3 text-lg"
                >
                  <Download className="w-6 h-6" />
                  Download Invitation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
