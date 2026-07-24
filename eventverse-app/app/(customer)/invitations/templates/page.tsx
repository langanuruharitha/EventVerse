'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Download, ArrowLeft, Plus, Eye, CheckCircle2, Image as ImageIcon, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { downloadImage } from '@/lib/utils/download-helper';

interface RealCardTemplate {
  id: string;
  title: string;
  category: 'wedding' | 'birthday' | 'anniversary' | 'corporate' | 'traditional' | 'party';
  style: string;
  description: string;
  imageUrl: string;
  themeColor: string;
  badge: string;
  sampleEventName: string;
  sampleHost: string;
  sampleVenue: string;
}

const TWENTY_REAL_CARDS: RealCardTemplate[] = [
  {
    id: 'card-1',
    title: 'Royal Heritage Vivah Mandap',
    category: 'wedding',
    style: 'Traditional Royal',
    description: 'Exquisite maroon & gold wedding invitation with authentic Rajasthani mandap filigree and royal emblems.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    themeColor: '#8A1C2C',
    badge: '👑 Royal Wedding',
    sampleEventName: 'Royal Vivah Ceremony',
    sampleHost: 'Rathore & Sharma Family',
    sampleVenue: 'The Palace Gardens, Jaipur'
  },
  {
    id: 'card-2',
    title: 'Golden Glitz 25th Milestone Birthday',
    category: 'birthday',
    style: 'Modern Luxury',
    description: 'Midnight navy and sparkling gold foil design created for milestone birthday celebrations.',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    themeColor: '#0F172A',
    badge: '🎂 Milestone Birthday',
    sampleEventName: "Ananya's 25th Birthday Bash",
    sampleHost: 'Ananya & Friends',
    sampleVenue: 'Skyline Lounge, Mumbai'
  },
  {
    id: 'card-3',
    title: 'Starry Night Executive Gala',
    category: 'corporate',
    style: 'Cosmic Elegance',
    description: 'Sophisticated dark cosmic template with silver starbursts for high-profile galas & awards.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    themeColor: '#1E1B4B',
    badge: '🏢 Corporate Gala',
    sampleEventName: 'Annual Tech Innovation Summit 2026',
    sampleHost: 'EventVerse Global Corp',
    sampleVenue: 'Grand Ballroom, Bengaluru'
  },
  {
    id: 'card-4',
    title: 'Emerald Luxury Floral Anniversary',
    category: 'anniversary',
    style: 'Botanical Gold',
    description: 'Rich emerald green canvas accented with gold leafing and romantic floral illustrations.',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    themeColor: '#064E3B',
    badge: '💐 Silver Anniversary',
    sampleEventName: '25th Wedding Anniversary Soirée',
    sampleHost: 'Vikram & Sunita Kapoor',
    sampleVenue: 'Leela Palace, Delhi'
  },
  {
    id: 'card-5',
    title: 'Rajasthani Peacock Mehndi & Sangeet',
    category: 'traditional',
    style: 'Ethnic Fusion',
    description: 'Vibrant saffron orange design adorned with peacock crests, dholak, and henna jaali borders.',
    imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
    themeColor: '#C2410C',
    badge: '🤏 Mehndi & Sangeet',
    sampleEventName: 'Mehendi & Sangeet Night',
    sampleHost: 'Rohan & Priya',
    sampleVenue: 'Heritage Courtyard, Udaipur'
  },
  {
    id: 'card-6',
    title: 'Velvet Rose Engagement Ring Ceremony',
    category: 'wedding',
    style: 'Romantic Velvet',
    description: 'Deep crimson velvet tone with gold interlocked wedding ring emblems and soft rose petals.',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    themeColor: '#881337',
    badge: '💍 Ring Ceremony',
    sampleEventName: 'Ring Ceremony & Cocktail',
    sampleHost: 'Mehta & Verma Family',
    sampleVenue: 'Taj Mahal Palace, Mumbai'
  },
  {
    id: 'card-7',
    title: 'Pastel Blossom Baby Shower',
    category: 'party',
    style: 'Soft Pastel',
    description: 'Dreamy pastel pink & lavender card decorated with watercolor floral wreaths and cute motifs.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    themeColor: '#BE185D',
    badge: '👶 Baby Shower',
    sampleEventName: 'Aarav Baby Shower Celebration',
    sampleHost: 'Sneha & Rohit',
    sampleVenue: 'Orchid Banquet, Pune'
  },
  {
    id: 'card-8',
    title: 'Sacred Griha Pravesh Housewarming',
    category: 'traditional',
    style: 'Vedic Gold',
    description: 'Warm gold & terracotta theme featuring traditional kalash, diya lights, and auspicious greetings.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    themeColor: '#B45309',
    badge: '🪔 Housewarming',
    sampleEventName: 'Griha Pravesh Puja & Dinner',
    sampleHost: 'Gupta Family',
    sampleVenue: 'Villa 42, Palm Meadows, Hyderabad'
  },
  {
    id: 'card-9',
    title: 'Grand Imperial Reception Soirée',
    category: 'wedding',
    style: 'Royal Imperial',
    description: 'Regal purple backdrop with embossed gold foil details for grand evening receptions.',
    imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
    themeColor: '#581C87',
    badge: '✨ Grand Reception',
    sampleEventName: 'Wedding Reception Gala',
    sampleHost: 'Dr. & Mrs. Malhotra',
    sampleVenue: 'ITC Maurya, New Delhi'
  },
  {
    id: 'card-10',
    title: 'Vintage Gold Foil Cocktail Evening',
    category: 'party',
    style: 'Vintage Chic',
    description: 'Dark champagne and black marble texture with geometric Art Deco golden frames.',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    themeColor: '#171717',
    badge: '🍸 Cocktail Night',
    sampleEventName: 'Pre-Wedding Cocktail & Dance',
    sampleHost: 'Karan & Natasha',
    sampleVenue: 'The Roof, Oberoi, Gurugram'
  },
  {
    id: 'card-11',
    title: 'Celestial Galaxy Sweet 16 Birthday',
    category: 'birthday',
    style: 'Cosmic Shimmer',
    description: 'Stunning starry galaxy invitation with glittering constellation accents and neon gold fonts.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    themeColor: '#312E81',
    badge: '🌟 Sweet 16 / Debut',
    sampleEventName: "Riya's Sweet 16 Extravaganza",
    sampleHost: 'Riya & Family',
    sampleVenue: 'Starlight Pavilion, Chennai'
  },
  {
    id: 'card-12',
    title: 'Crimson Silk Royal Shaadi',
    category: 'wedding',
    style: 'Classic Red & Gold',
    description: 'Deep crimson silk texture with traditional golden shlokas and ornate wedding arch details.',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    themeColor: '#991B1B',
    badge: '💍 Traditional Shaadi',
    sampleEventName: 'Subh Vivah Ceremony',
    sampleHost: 'Deshmukh & Kulkarni Family',
    sampleVenue: 'Royal Lawns, Pune'
  },
  {
    id: 'card-13',
    title: 'Golden Diya Festive Grand Celebration',
    category: 'traditional',
    style: 'Festive Radiant',
    description: 'Radiant amber gold template filled with illuminated diyas and marigold garland borders.',
    imageUrl: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?auto=format&fit=crop&w=800&q=80',
    themeColor: '#D97706',
    badge: '🪔 Festive Celebration',
    sampleEventName: 'Grand Diwali Celebration & Dinner',
    sampleHost: 'Singhania Group',
    sampleVenue: 'JW Marriott, Kolkata'
  },
  {
    id: 'card-14',
    title: 'Boho Garden Meadow Birthday',
    category: 'birthday',
    style: 'Boho Chic',
    description: 'Earthy sage green card with rustic eucalyptus leaves, pampa grass, and minimal gold text.',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    themeColor: '#14532D',
    badge: '🌿 Garden Party',
    sampleEventName: "Kavya's 30th Outdoor Birthday",
    sampleHost: 'Kavya & Arjun',
    sampleVenue: 'Green Acres Farmhouse, Delhi'
  },
  {
    id: 'card-15',
    title: 'Modern Minimalist White Gold Summit',
    category: 'corporate',
    style: 'Minimal Platinum',
    description: 'Clean platinum white card with crisp geometric lines, metallic gold embossing, and elegant spacing.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    themeColor: '#334155',
    badge: '🏢 Corporate Summit',
    sampleEventName: 'Leadership Excellence Awards',
    sampleHost: 'Apex Global Council',
    sampleVenue: 'Taj Lands End, Mumbai'
  },
  {
    id: 'card-16',
    title: 'Silver Shimmer Silver Jubilee (25th)',
    category: 'anniversary',
    style: 'Silver Elegance',
    description: 'Sparkling silver foil and charcoal backdrop tailored for 25th anniversary milestones.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    themeColor: '#475569',
    badge: '🥈 Silver Jubilee',
    sampleEventName: '25 Years of Togetherness',
    sampleHost: 'Rajesh & Alok',
    sampleVenue: 'Ritz-Carlton, Bengaluru'
  },
  {
    id: 'card-17',
    title: 'Floral Canopy Haldi Rasam',
    category: 'traditional',
    style: 'Bright Floral',
    description: 'Sunny yellow canvas surrounded by fresh marigolds and jasmine garlands for Haldi ceremonies.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    themeColor: '#CA8A04',
    badge: '🌼 Haldi Ceremony',
    sampleEventName: 'Haldi & Phoolon Ki Holi',
    sampleHost: 'Shah & Patel Family',
    sampleVenue: 'Sunshine Resorts, Ahmedabad'
  },
  {
    id: 'card-18',
    title: 'Chic Neon Retro Dance Party',
    category: 'party',
    style: 'Vibrant Neon',
    description: 'Electric magenta and cyan neon glow design for energetic DJ nights and pre-wedding bashes.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    themeColor: '#701A75',
    badge: '🎧 DJ & Dance Night',
    sampleEventName: 'Neon Sangeet & Afterparty',
    sampleHost: 'Siddharth & Rhea',
    sampleVenue: 'Club Lounge 360, Goa'
  },
  {
    id: 'card-19',
    title: 'Royal Blue Silk Nikah Mubarak',
    category: 'wedding',
    style: 'Islamic Heritage',
    description: 'Deep sapphire blue silk background embellished with golden Islamic geometric arches and calligraphic grace.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    themeColor: '#1E3A8A',
    badge: '🌙 Nikah Mubarak',
    sampleEventName: 'Nikah & Walima Ceremony',
    sampleHost: 'Khan & Ahmed Family',
    sampleVenue: 'Grand Hyatt, Mumbai'
  },
  {
    id: 'card-20',
    title: 'Golden Lotus Upanayan Ceremony',
    category: 'traditional',
    style: 'Sacred Vedic',
    description: 'Holy saffron and gold lotus pattern crafted for Upanayan, Mungan, and auspicious family Pujas.',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    themeColor: '#C2410C',
    badge: '🕉️ Sacred Ceremony',
    sampleEventName: 'Upanayan Sanskar & Mahaprasad',
    sampleHost: 'Iyer Family',
    sampleVenue: 'Vedic Ashram Hall, Chennai'
  }
];

export default function RealCardGalleryPage() {
  const router = useRouter();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredCards = selectedCategory === 'all'
    ? TWENTY_REAL_CARDS
    : TWENTY_REAL_CARDS.filter(c => c.category === selectedCategory);

  const handleDownloadCardImage = async (card: RealCardTemplate) => {
    setDownloadingId(card.id);
    toast(`Preparing ${card.title} PNG download...`, 'info');
    try {
      const filename = `${card.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-invitation.png`;
      const success = await downloadImage(card.imageUrl, filename);
      if (success) {
        toast(`📥 ${card.title} downloaded as PNG image!`, 'success');
      } else {
        toast('Opened card image in new tab for direct download.', 'info');
      }
    } catch (e) {
      console.error('Download error:', e);
      toast('Failed to download card. Please try again.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCustomizeCard = (card: RealCardTemplate) => {
    const params = new URLSearchParams({
      type: card.category,
      eventName: card.sampleEventName,
      fromName: card.sampleHost,
      venue: card.sampleVenue,
      style: card.style.toLowerCase().includes('traditional') ? 'traditional' : 'elegant',
      themeDescription: `Create a ${card.title} invitation card matching style: ${card.style} - ${card.description}`
    });
    router.push(`/invitations/create/card?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-[#2C1810] text-[#FAF0E0] py-10 border-b border-[#C5A880]/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/invitations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:text-[#FAF0E0] uppercase tracking-wider font-sans mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Invitations Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/40 bg-[#1F0A05] text-[#C5A880] text-xs font-semibold uppercase tracking-widest font-sans mb-3">
                ⚜ 20 Premium Real Invitation Cards
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold">Exquisite Real Pre-Designed Invitation Cards</h1>
              <p className="text-sm text-[#FAF0E0]/80 italic mt-1 max-w-2xl">
                Browse 20 handcrafted, royal invitation cards across all ceremonies. Download clean PNG images instantly or customize with AI!
              </p>
            </div>
            <Link
              href="/invitations/create/card"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] font-sans font-bold text-xs uppercase tracking-wider rounded shadow-md hover:shadow-lg transition"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              Build Custom Card with AI
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All 20 Real Cards (⚜)' },
            { id: 'wedding', label: '💍 Weddings' },
            { id: 'birthday', label: '🎂 Birthdays' },
            { id: 'traditional', label: '🪔 Traditional & Pujas' },
            { id: 'anniversary', label: '💐 Anniversaries' },
            { id: 'corporate', label: '🏢 Corporate Galas' },
            { id: 'party', label: '🍸 Parties & Showers' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#8A1C2C] text-[#FAF0E0] shadow'
                  : 'bg-white border border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 20 Real Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-[#DDD0BB] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Preview Container */}
              <div>
                <div className="relative h-64 w-full bg-[#1A0306] overflow-hidden">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-[#2C1810]/90 border border-[#C5A880] text-[#FAF0E0] text-[11px] font-bold px-3 py-1 rounded-full shadow font-serif">
                    {card.badge}
                  </span>

                  {/* Overlaid Title on Image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700] font-sans">
                      {card.style}
                    </span>
                    <h3 className="text-lg font-bold font-serif line-clamp-1 text-[#FAF0E0]">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3 font-serif">
                  <p className="text-xs text-[#1F1E1B]/70 italic line-clamp-2 leading-relaxed">
                    "{card.description}"
                  </p>
                  
                  <div className="bg-[#FAF6F0] p-3 rounded-lg border border-[#DDD0BB]/60 text-[11px] font-sans space-y-1 text-[#2C1810]">
                    <div><span className="font-bold text-[#8A1C2C]">Event:</span> {card.sampleEventName}</div>
                    <div><span className="font-bold text-[#8A1C2C]">Host:</span> {card.sampleHost}</div>
                    <div className="line-clamp-1"><span className="font-bold text-[#8A1C2C]">Venue:</span> {card.sampleVenue}</div>
                  </div>
                </div>
              </div>

              {/* Card Download & Customize Buttons */}
              <div className="p-5 pt-0 space-y-2 font-sans">
                <button
                  onClick={() => handleDownloadCardImage(card)}
                  disabled={downloadingId === card.id}
                  className="w-full bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-4 h-4 text-[#FFD700]" />
                  {downloadingId === card.id ? 'Downloading PNG...' : '📥 Download Card Image (PNG)'}
                </button>
                <button
                  onClick={() => handleCustomizeCard(card)}
                  className="w-full bg-white border border-[#8A1C2C] text-[#8A1C2C] py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#FAF6F0] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Customize Details & AI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
