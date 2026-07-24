'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Download, ArrowLeft, Plus, Edit3, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface DigitalCardTemplate {
  id: string;
  title: string;
  category: 'wedding' | 'birthday' | 'anniversary' | 'corporate' | 'traditional' | 'party';
  badge: string;
  bgGradient: string;
  primaryColor: string;
  secondaryColor: string; // Gold metallic / accent
  textColor: string;
  subTextColor: string;
  panelBg: string;
  panelBorder: string;
  emblem: string;
  greeting: string;
  eventName: string;
  hostName: string;
  toName?: string;
  dateStr: string;
  timeStr: string;
  venueStr: string;
  messageStr: string;
}

const TWENTY_DIGITAL_CARDS: DigitalCardTemplate[] = [
  {
    id: 'card-1',
    title: 'Royal Heritage Shaadi Mandap',
    category: 'wedding',
    badge: '👑 Royal Wedding',
    bgGradient: 'linear-gradient(135deg, #2b0308 0%, #4a0810 50%, #1c0205 100%)',
    primaryColor: '#FFF5D6',
    secondaryColor: '#FFD700',
    textColor: '#FAF0E0',
    subTextColor: '#E6C687',
    panelBg: 'rgba(255, 215, 0, 0.08)',
    panelBorder: 'rgba(255, 215, 0, 0.4)',
    emblem: '⚜ ❦ ⚜',
    greeting: 'SHUBH VIVAH CEREMONY',
    eventName: 'Rohan & Priya',
    hostName: 'Rathore & Sharma Family',
    toName: 'Friends & Family',
    dateStr: 'Saturday, 15 November 2026',
    timeStr: '6:00 PM Onwards',
    venueStr: 'The Palace Gardens, Jaipur',
    messageStr: 'Together with their families, request the pleasure of your company.'
  },
  {
    id: 'card-2',
    title: 'Golden Glitz 25th Milestone Birthday',
    category: 'birthday',
    badge: '🎂 Milestone Birthday',
    bgGradient: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #090e1a 100%)',
    primaryColor: '#E0FBFC',
    secondaryColor: '#F4D06F',
    textColor: '#FFFFFF',
    subTextColor: '#C2DFE3',
    panelBg: 'rgba(244, 208, 111, 0.1)',
    panelBorder: 'rgba(244, 208, 111, 0.4)',
    emblem: '✨ 🎂 ✨',
    greeting: 'YOU ARE CORDIALLY INVITED',
    eventName: "Ananya's 25th Birthday Bash",
    hostName: 'Ananya & Friends',
    dateStr: 'Friday, 28 August 2026',
    timeStr: '8:00 PM Onwards',
    venueStr: 'Skyline Lounge, Mumbai',
    messageStr: 'Join us for an evening of music, dinner, and celebration!'
  },
  {
    id: 'card-3',
    title: 'Starry Night Executive Gala',
    category: 'corporate',
    badge: '🏢 Corporate Gala',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #020617 100%)',
    primaryColor: '#F8FAFC',
    secondaryColor: '#38BDF8',
    textColor: '#F1F5F9',
    subTextColor: '#94A3B8',
    panelBg: 'rgba(56, 189, 248, 0.08)',
    panelBorder: 'rgba(56, 189, 248, 0.3)',
    emblem: '🌐 🏢 🌐',
    greeting: 'ANNUAL GLOBAL SUMMIT',
    eventName: 'Tech Innovation Gala 2026',
    hostName: 'EventVerse Global Corp',
    dateStr: 'Thursday, 10 December 2026',
    timeStr: '7:00 PM',
    venueStr: 'Grand Ballroom, Bengaluru',
    messageStr: 'Celebrating excellence, leadership, and future technology.'
  },
  {
    id: 'card-4',
    title: 'Emerald Luxury 25th Anniversary',
    category: 'anniversary',
    badge: '💐 Silver Anniversary',
    bgGradient: 'linear-gradient(135deg, #032015 0%, #0a402b 50%, #02140d 100%)',
    primaryColor: '#E8F5E9',
    secondaryColor: '#D4AF37',
    textColor: '#F0FDF4',
    subTextColor: '#A5D6A7',
    panelBg: 'rgba(212, 175, 55, 0.1)',
    panelBorder: 'rgba(212, 175, 55, 0.4)',
    emblem: '💐 💍 💐',
    greeting: '25 YEARS OF TOGETHERNESS',
    eventName: 'Vikram & Sunita',
    hostName: 'Kapoor Family',
    dateStr: 'Sunday, 20 September 2026',
    timeStr: '7:30 PM',
    venueStr: 'Leela Palace, New Delhi',
    messageStr: 'Celebrating 25 years of love, joy, and cherished memories.'
  },
  {
    id: 'card-5',
    title: 'Rajasthani Peacock Mehndi & Sangeet',
    category: 'traditional',
    badge: '🤏 Mehndi & Sangeet',
    bgGradient: 'linear-gradient(135deg, #431407 0%, #78350f 50%, #1a0a00 100%)',
    primaryColor: '#FFF7ED',
    secondaryColor: '#FB923C',
    textColor: '#FFEDD5',
    subTextColor: '#FDBA74',
    panelBg: 'rgba(251, 146, 60, 0.1)',
    panelBorder: 'rgba(251, 146, 60, 0.4)',
    emblem: '🪔 🤏 🪔',
    greeting: 'MEHNDI & SANGEET RASAM',
    eventName: 'Priya Ka Mehendi Sangeet',
    hostName: 'Sharma Family',
    dateStr: 'Friday, 14 November 2026',
    timeStr: '5:00 PM',
    venueStr: 'Heritage Courtyard, Udaipur',
    messageStr: 'Henna dyes, rhythmic dholak tunes & joyful dances!'
  },
  {
    id: 'card-6',
    title: 'Velvet Rose Ring Ceremony',
    category: 'wedding',
    badge: '💍 Ring Ceremony',
    bgGradient: 'linear-gradient(135deg, #2b0b1e 0%, #52153b 50%, #1c0613 100%)',
    primaryColor: '#FFF0F5',
    secondaryColor: '#F9A8D4',
    textColor: '#FCE7F3',
    subTextColor: '#F472B6',
    panelBg: 'rgba(249, 168, 212, 0.1)',
    panelBorder: 'rgba(249, 168, 212, 0.4)',
    emblem: '💍 🌹 💍',
    greeting: 'ENGAGEMENT SOIRÉE',
    eventName: 'Karan & Natasha',
    hostName: 'Mehta & Verma Family',
    dateStr: 'Sunday, 4 October 2026',
    timeStr: '6:30 PM',
    venueStr: 'Taj Mahal Palace, Mumbai',
    messageStr: 'As we exchange rings and begin our lifetime journey together.'
  },
  {
    id: 'card-7',
    title: 'Pastel Blossom Baby Shower',
    category: 'party',
    badge: '👶 Baby Shower',
    bgGradient: 'linear-gradient(135deg, #4a044e 0%, #701a75 50%, #2e1065 100%)',
    primaryColor: '#FDF4FF',
    secondaryColor: '#F0ABFC',
    textColor: '#FAE8FF',
    subTextColor: '#E879F9',
    panelBg: 'rgba(240, 171, 252, 0.1)',
    panelBorder: 'rgba(240, 171, 252, 0.4)',
    emblem: '👶 🌸 👶',
    greeting: 'BABY SHOWER CELEBRATION',
    eventName: 'Aarav Is On The Way!',
    hostName: 'Sneha & Rohit',
    dateStr: 'Saturday, 12 September 2026',
    timeStr: '4:00 PM',
    venueStr: 'Orchid Banquet, Pune',
    messageStr: 'Shower us with blessings as we welcome our tiny bundle of joy.'
  },
  {
    id: 'card-8',
    title: 'Sacred Griha Pravesh Housewarming',
    category: 'traditional',
    badge: '🪔 Housewarming',
    bgGradient: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #1c0702 100%)',
    primaryColor: '#FEF3C7',
    secondaryColor: '#FBBF24',
    textColor: '#FFFBEB',
    subTextColor: '#FDE68A',
    panelBg: 'rgba(251, 191, 36, 0.1)',
    panelBorder: 'rgba(251, 191, 36, 0.4)',
    emblem: '🪔 🏡 🪔',
    greeting: 'GRIHA PRAVESH PUJA',
    eventName: 'New Home Blessing',
    hostName: 'Gupta Family',
    dateStr: 'Sunday, 18 October 2026',
    timeStr: '10:00 AM Puja & Lunch',
    venueStr: 'Villa 42, Palm Meadows, Hyderabad',
    messageStr: 'Join us to bless our new home with warmth, peace and prosperity.'
  },
  {
    id: 'card-9',
    title: 'Grand Imperial Reception Soirée',
    category: 'wedding',
    badge: '✨ Grand Reception',
    bgGradient: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #1e0136 100%)',
    primaryColor: '#FAF5FF',
    secondaryColor: '#E9D5FF',
    textColor: '#F3E8FF',
    subTextColor: '#C084FC',
    panelBg: 'rgba(233, 213, 255, 0.1)',
    panelBorder: 'rgba(233, 213, 255, 0.4)',
    emblem: '✨ ⚜ ✨',
    greeting: 'WEDDING RECEPTION',
    eventName: 'Dr. Siddharth & Dr. Rhea',
    hostName: 'Malhotra Family',
    dateStr: 'Sunday, 16 November 2026',
    timeStr: '8:00 PM Onwards',
    venueStr: 'ITC Maurya, New Delhi',
    messageStr: 'Celebrate our wedding reception with an evening of fine dining.'
  },
  {
    id: 'card-10',
    title: 'Vintage Gold Foil Cocktail Evening',
    category: 'party',
    badge: '🍸 Cocktail Night',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #050505 100%)',
    primaryColor: '#FAFAFA',
    secondaryColor: '#D4AF37',
    textColor: '#F4F4F5',
    subTextColor: '#E4E4E7',
    panelBg: 'rgba(212, 175, 55, 0.08)',
    panelBorder: 'rgba(212, 175, 55, 0.35)',
    emblem: '🍸 ✨ 🍸',
    greeting: 'COCKTAILS & DANCE',
    eventName: 'Pre-Wedding Bash',
    hostName: 'Arjun & Tanya',
    dateStr: 'Saturday, 24 October 2026',
    timeStr: '9:00 PM',
    venueStr: 'The Roof, Oberoi, Gurugram',
    messageStr: 'Cocktails flow, music plays, and memories are made!'
  },
  {
    id: 'card-11',
    title: 'Celestial Galaxy Sweet 16 Birthday',
    category: 'birthday',
    badge: '🌟 Sweet 16 / Debut',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #09072b 100%)',
    primaryColor: '#EEF2FF',
    secondaryColor: '#818CF8',
    textColor: '#E0E7FF',
    subTextColor: '#A5B4FC',
    panelBg: 'rgba(129, 140, 248, 0.1)',
    panelBorder: 'rgba(129, 140, 248, 0.4)',
    emblem: '🌟 🎂 🌟',
    greeting: 'SWEET 16 DEBUT',
    eventName: "Riya's Celestial Night",
    hostName: 'Riya & Parents',
    dateStr: 'Friday, 18 September 2026',
    timeStr: '7:00 PM',
    venueStr: 'Starlight Pavilion, Chennai',
    messageStr: 'Dance under the stars for Riya’s 16th birthday party!'
  },
  {
    id: 'card-12',
    title: 'Crimson Silk Royal Shaadi',
    category: 'wedding',
    badge: '💍 Traditional Shaadi',
    bgGradient: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #200303 100%)',
    primaryColor: '#FEF2F2',
    secondaryColor: '#FCA5A5',
    textColor: '#FEE2E2',
    subTextColor: '#F87171',
    panelBg: 'rgba(252, 165, 165, 0.1)',
    panelBorder: 'rgba(252, 165, 165, 0.4)',
    emblem: '👑 💍 👑',
    greeting: 'ROYAL WEDDING CEREMONY',
    eventName: 'Aditya & Natasha',
    hostName: 'Deshmukh & Kulkarni Family',
    dateStr: 'Sunday, 22 November 2026',
    timeStr: '11:00 AM Muhurat',
    venueStr: 'Royal Lawns, Pune',
    messageStr: 'Two souls bound by love, traditions, and eternal sacred vows.'
  },
  {
    id: 'card-13',
    title: 'Golden Diya Festive Celebration',
    category: 'traditional',
    badge: '🪔 Festive Celebration',
    bgGradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #3a1700 100%)',
    primaryColor: '#FFFBEB',
    secondaryColor: '#FBBF24',
    textColor: '#FEF3C7',
    subTextColor: '#FDE68A',
    panelBg: 'rgba(251, 191, 36, 0.12)',
    panelBorder: 'rgba(251, 191, 36, 0.4)',
    emblem: '🪔 🌺 🪔',
    greeting: 'GRAND FESTIVE GATHERING',
    eventName: 'Diwali Gala & Dinner',
    hostName: 'Singhania Group',
    dateStr: 'Saturday, 7 November 2026',
    timeStr: '7:30 PM',
    venueStr: 'JW Marriott, Kolkata',
    messageStr: 'Illuminating lives with joy, sweet delicacies and festive lights.'
  },
  {
    id: 'card-14',
    title: 'Boho Garden Meadow Birthday',
    category: 'birthday',
    badge: '🌿 Garden Party',
    bgGradient: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #021a0b 100%)',
    primaryColor: '#F0FDF4',
    secondaryColor: '#4ADE80',
    textColor: '#DCFCE7',
    subTextColor: '#86EFAC',
    panelBg: 'rgba(74, 222, 128, 0.1)',
    panelBorder: 'rgba(74, 222, 128, 0.4)',
    emblem: '🌿 🌻 🌿',
    greeting: 'GARDEN BIRTHDAY PARTY',
    eventName: "Kavya's 30th Meadow Soirée",
    hostName: 'Kavya & Friends',
    dateStr: 'Saturday, 5 September 2026',
    timeStr: '4:30 PM Sunset',
    venueStr: 'Green Acres Farmhouse, Delhi',
    messageStr: 'Rustic bohemian decor, acoustic music & garden cocktails.'
  },
  {
    id: 'card-15',
    title: 'Modern Minimalist White Gold Summit',
    category: 'corporate',
    badge: '🏢 Corporate Summit',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #334155 50%, #050b14 100%)',
    primaryColor: '#F8FAFC',
    secondaryColor: '#CBD5E1',
    textColor: '#F1F5F9',
    subTextColor: '#94A3B8',
    panelBg: 'rgba(203, 213, 225, 0.1)',
    panelBorder: 'rgba(203, 213, 225, 0.4)',
    emblem: '🏆 🏢 🏆',
    greeting: 'LEADERSHIP AWARDS',
    eventName: 'Executive Excellence 2026',
    hostName: 'Apex Global Council',
    dateStr: 'Wednesday, 18 November 2026',
    timeStr: '6:00 PM',
    venueStr: 'Taj Lands End, Mumbai',
    messageStr: 'Honouring industry pioneers and transformational leadership.'
  },
  {
    id: 'card-16',
    title: 'Silver Shimmer Silver Jubilee',
    category: 'anniversary',
    badge: '🥈 Silver Jubilee',
    bgGradient: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #0f172a 100%)',
    primaryColor: '#F8FAFC',
    secondaryColor: '#E2E8F0',
    textColor: '#F1F5F9',
    subTextColor: '#CBD5E1',
    panelBg: 'rgba(226, 232, 240, 0.1)',
    panelBorder: 'rgba(226, 232, 240, 0.4)',
    emblem: '🥈 🥂 🥈',
    greeting: 'SILVER JUBILEE ANNIVERSARY',
    eventName: 'Rajesh & Alok (25 Years)',
    hostName: 'Sharma Family',
    dateStr: 'Saturday, 12 December 2026',
    timeStr: '7:30 PM',
    venueStr: 'Ritz-Carlton, Bengaluru',
    messageStr: '25 years of partnership, unconditional love and togetherness.'
  },
  {
    id: 'card-17',
    title: 'Floral Canopy Haldi Rasam',
    category: 'traditional',
    badge: '🌼 Haldi Ceremony',
    bgGradient: 'linear-gradient(135deg, #713f12 0%, #a16207 50%, #381e05 100%)',
    primaryColor: '#FEFCE8',
    secondaryColor: '#FACC15',
    textColor: '#FEF08A',
    subTextColor: '#FDE047',
    panelBg: 'rgba(250, 204, 21, 0.12)',
    panelBorder: 'rgba(250, 204, 21, 0.4)',
    emblem: '🌼 🪔 🌼',
    greeting: 'HALDI & PHOOLON KI HOLI',
    eventName: 'Pooja Ka Haldi Rasam',
    hostName: 'Shah Family',
    dateStr: 'Saturday, 14 November 2026',
    timeStr: '10:30 AM',
    venueStr: 'Sunshine Resorts, Ahmedabad',
    messageStr: 'A day of turmeric paste, marigold petals, music and laughter!'
  },
  {
    id: 'card-18',
    title: 'Chic Neon Retro DJ Party',
    category: 'party',
    badge: '🎧 DJ & Dance Night',
    bgGradient: 'linear-gradient(135deg, #4c1d95 0%, #701a75 50%, #1e0638 100%)',
    primaryColor: '#FAF5FF',
    secondaryColor: '#22D3EE',
    textColor: '#F3E8FF',
    subTextColor: '#F0ABFC',
    panelBg: 'rgba(34, 211, 238, 0.1)',
    panelBorder: 'rgba(34, 211, 238, 0.4)',
    emblem: '🎧 ⚡ 🎧',
    greeting: 'NEON DANCE NIGHT',
    eventName: 'Sangeet Afterparty',
    hostName: 'Rhea & Friends',
    dateStr: 'Friday, 27 November 2026',
    timeStr: '10:00 PM Till Dawn',
    venueStr: 'Club Lounge 360, Goa',
    messageStr: 'Glow sticks, neon lights, and non-stop beats by DJ Electro!'
  },
  {
    id: 'card-19',
    title: 'Royal Blue Silk Nikah Mubarak',
    category: 'wedding',
    badge: '🌙 Nikah Mubarak',
    bgGradient: 'linear-gradient(135deg, #172554 0%, #1e3a8a 50%, #0a1128 100%)',
    primaryColor: '#EFF6FF',
    secondaryColor: '#FBBF24',
    textColor: '#DBEAFE',
    subTextColor: '#93C5FD',
    panelBg: 'rgba(251, 191, 36, 0.1)',
    panelBorder: 'rgba(251, 191, 36, 0.4)',
    emblem: '🌙 ⚜ 🌙',
    greeting: 'NIKAH MUBARAK CEREMONY',
    eventName: 'Tariq & Ayesha',
    hostName: 'Khan & Ahmed Family',
    dateStr: 'Sunday, 6 December 2026',
    timeStr: '1:00 PM Walima Feast',
    venueStr: 'Grand Hyatt, Mumbai',
    messageStr: 'May Allah bless this sacred union with peace, love and joy.'
  },
  {
    id: 'card-20',
    title: 'Golden Lotus Upanayan Ceremony',
    category: 'traditional',
    badge: '🕉️ Sacred Ceremony',
    bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #3b1204 100%)',
    primaryColor: '#FFF7ED',
    secondaryColor: '#F97316',
    textColor: '#FFEDD5',
    subTextColor: '#FDBA74',
    panelBg: 'rgba(249, 115, 22, 0.1)',
    panelBorder: 'rgba(249, 115, 22, 0.4)',
    emblem: '🕉️ 🪔 🕉️',
    greeting: 'UPANAYAN SANSKAR',
    eventName: 'Aditya Iyer',
    hostName: 'Iyer Family',
    dateStr: 'Sunday, 8 November 2026',
    timeStr: '8:30 AM Sacred Puja',
    venueStr: 'Vedic Ashram Hall, Chennai',
    messageStr: 'Sacred thread ceremony followed by traditional Mahaprasad.'
  }
];

export default function TwentyRealDigitalCardsPage() {
  const router = useRouter();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredCards = selectedCategory === 'all'
    ? TWENTY_DIGITAL_CARDS
    : TWENTY_DIGITAL_CARDS.filter(c => c.category === selectedCategory);

  const handleDownloadCardImage = async (card: DigitalCardTemplate) => {
    setDownloadingId(card.id);
    toast(`Generating high-resolution PNG image for ${card.title}...`, 'info');
    try {
      const cardEl = document.getElementById(`digital-card-${card.id}`);
      if (!cardEl) {
        throw new Error('Card element not found');
      }
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      const filename = `${card.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-invitation.png`;
      link.download = filename;
      link.click();
      toast(`📥 ${card.title} downloaded as PNG image!`, 'success');
    } catch (e) {
      console.error('Download error:', e);
      toast('Failed to convert card to image. Please try again.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCustomizeCard = (card: DigitalCardTemplate) => {
    const params = new URLSearchParams({
      type: card.category,
      eventName: card.eventName,
      fromName: card.hostName,
      venue: card.venueStr,
      time: card.timeStr,
      message: card.messageStr,
      style: 'traditional',
      themeDescription: `Create a ${card.title} invitation card`
    });
    router.push(`/invitations/create/card?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header Banner */}
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
                ⚜ 20 Real Rendered Pre-Designed Digital Cards
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold">Handcrafted Pre-Designed Invitation Cards</h1>
              <p className="text-sm text-[#FAF0E0]/80 italic mt-1 max-w-2xl">
                Real HTML/CSS digital invitation cards rendered live. Click to download crisp PNG card images or edit details directly with AI!
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
        {/* Category Filter Pills */}
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

        {/* 20 Real Digital Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#DDD0BB] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Actual Live Rendered 5:7 Digital Invitation Card Component */}
              <div className="p-4 bg-[#FAF6F0] border-b border-[#DDD0BB]">
                <div
                  id={`digital-card-${card.id}`}
                  style={{
                    background: card.bgGradient,
                    color: card.textColor,
                    aspectRatio: '5/7',
                  }}
                  className="w-full rounded-xl p-6 relative flex flex-col justify-between text-center overflow-hidden shadow-2xl border-2 border-double"
                >
                  {/* Metallic Gold Double Border Frame */}
                  <div
                    style={{ borderColor: card.secondaryColor }}
                    className="absolute inset-2 border-2 border-double rounded-lg pointer-events-none opacity-80"
                  />
                  <div
                    style={{ borderColor: `${card.secondaryColor}66` }}
                    className="absolute inset-3 border rounded pointer-events-none opacity-60"
                  />

                  {/* Corner Ornaments */}
                  <div style={{ color: card.secondaryColor }} className="absolute top-3 left-3 text-xs font-serif opacity-80">❦</div>
                  <div style={{ color: card.secondaryColor }} className="absolute top-3 right-3 text-xs font-serif opacity-80">❦</div>
                  <div style={{ color: card.secondaryColor }} className="absolute bottom-3 left-3 text-xs font-serif opacity-80">❦</div>
                  <div style={{ color: card.secondaryColor }} className="absolute bottom-3 right-3 text-xs font-serif opacity-80">❦</div>

                  {/* Top Emblem & Header */}
                  <div className="relative z-10 space-y-1 mt-2">
                    <div style={{ color: card.secondaryColor }} className="text-xl font-serif tracking-widest">
                      {card.emblem}
                    </div>
                    <div style={{ color: card.secondaryColor }} className="text-[10px] font-bold tracking-widest uppercase font-serif">
                      {card.greeting}
                    </div>
                    <h3
                      style={{ color: card.primaryColor }}
                      className="text-xl font-extrabold font-serif tracking-wide uppercase line-clamp-1 leading-snug drop-shadow"
                    >
                      {card.eventName}
                    </h3>
                    <div style={{ color: card.subTextColor }} className="text-xs italic font-serif">
                      Hosted by {card.hostName}
                    </div>
                  </div>

                  {/* Center Details Box */}
                  <div
                    style={{
                      backgroundColor: card.panelBg,
                      borderColor: card.panelBorder
                    }}
                    className="relative z-10 p-3 rounded-lg border my-2 backdrop-blur-sm text-[11px] font-sans space-y-1 shadow-inner"
                  >
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <span style={{ color: card.secondaryColor }} className="block text-[9px] font-bold uppercase tracking-wider">
                          🗓 Date &amp; Time
                        </span>
                        <div style={{ color: card.textColor }} className="font-semibold leading-tight text-[10px] line-clamp-2">
                          {card.dateStr}<br/>{card.timeStr}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: card.secondaryColor }} className="block text-[9px] font-bold uppercase tracking-wider">
                          📍 Venue
                        </span>
                        <div style={{ color: card.textColor }} className="font-semibold leading-tight text-[10px] line-clamp-2">
                          {card.venueStr}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Quote & RSVP */}
                  <div className="relative z-10 space-y-2 mb-1">
                    <p style={{ color: card.subTextColor }} className="text-[11px] italic font-serif line-clamp-2 leading-relaxed px-2">
                      "{card.messageStr}"
                    </p>
                    <div
                      style={{
                        borderColor: card.secondaryColor,
                        color: card.secondaryColor,
                        backgroundColor: `${card.secondaryColor}15`
                      }}
                      className="inline-block px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest font-serif"
                    >
                      RSVP via EventVerse
                    </div>
                  </div>
                </div>
              </div>

              {/* Information & Action Footer */}
              <div className="p-5 space-y-3 font-serif">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider bg-[#8A1C2C]/10 text-[#8A1C2C] px-2.5 py-1 rounded font-sans">
                    {card.badge}
                  </span>
                  <span className="text-xs text-[#1F1E1B]/60 italic">
                    Digital Card #{card.id.split('-')[1]}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-base font-serif">{card.title}</h4>

                {/* Actions */}
                <div className="space-y-2 pt-2 font-sans">
                  <button
                    onClick={() => handleDownloadCardImage(card)}
                    disabled={downloadingId === card.id}
                    className="w-full bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {downloadingId === card.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-[#FFD700]" />}
                    {downloadingId === card.id ? 'Generating PNG...' : '📥 Download Card Image (PNG)'}
                  </button>
                  <button
                    onClick={() => handleCustomizeCard(card)}
                    className="w-full bg-white border border-[#8A1C2C] text-[#8A1C2C] py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#FAF6F0] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    Customize &amp; Edit Details
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
