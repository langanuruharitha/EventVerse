'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  ArrowRight, 
  ChevronRight,
  Star,
  Search,
  Zap
} from 'lucide-react';

// Preset events for the interactive AI Planner preview widget
const PRESET_EVENTS = [
  {
    icon: '💍',
    title: 'Garden Wedding',
    prompt: 'Elegant outdoor wedding under the stars for 120 guests',
    budget: '$35,000',
    allocation: [
      { category: 'Venue & Glass Pavilion', percentage: 40, amount: '$14,000', color: 'from-pink-500 to-rose-500' },
      { category: 'Floral Design & Decor', percentage: 25, amount: '$8,750', color: 'from-purple-500 to-indigo-500' },
      { category: 'Organic Fine Catering', percentage: 20, amount: '$7,000', color: 'from-blue-500 to-cyan-500' },
      { category: 'Live Music & Production', percentage: 15, amount: '$5,250', color: 'from-amber-500 to-orange-500' }
    ],
    timeline: [
      { time: 'Month 1-2', task: 'Secure Glass Pavilion venue & curating floral palette' },
      { time: 'Month 3-5', task: 'Design custom menu, finalize invitations & band' },
      { time: 'Month 6', task: 'Final seating plan, vendor walkthrough & rehearsal' }
    ],
    vendors: [
      { name: 'Aurora Botanical Gardens', rating: 4.9, price: '$$$$', type: 'Venue' },
      { name: 'Elysian Gourmet Catering', rating: 4.8, price: '$$$', type: 'Catering' }
    ]
  },
  {
    icon: '⚡',
    title: 'Cyberpunk Neon Party',
    prompt: 'Cyberpunk themed neon birthday party for 50 people with laser show',
    budget: '$8,500',
    allocation: [
      { category: 'Laser & AV Production', percentage: 35, amount: '$2,975', color: 'from-purple-500 to-pink-500' },
      { category: 'Warehouse/Club Venue', percentage: 30, amount: '$2,550', color: 'from-cyan-500 to-blue-500' },
      { category: 'Molecular Mixology & Bar', percentage: 20, amount: '$1,700', color: 'from-emerald-500 to-teal-500' },
      { category: 'Cyberpunk Decor & Actors', percentage: 15, amount: '$1,275', color: 'from-amber-500 to-orange-500' }
    ],
    timeline: [
      { time: 'Week 1-2', task: 'Book warehouse studio & secure custom laser array team' },
      { time: 'Week 3', task: 'Curate synthwave/techno DJ lineup & custom neon invitations' },
      { time: 'Week 4', task: 'Setup sound check, light sequencing & custom molecular bar' }
    ],
    vendors: [
      { name: 'Grid Warehouse Studio', rating: 4.7, price: '$$$', type: 'Venue' },
      { name: 'NeonPulse AV Production', rating: 5.0, price: '$$$$', type: 'Production' }
    ]
  },
  {
    icon: '🚀',
    title: 'Tech Product Launch',
    prompt: 'Immersive hybrid tech product launch for 300 in-person + 5k virtual',
    budget: '$75,000',
    allocation: [
      { category: 'Immersive LED Stage & Streaming', percentage: 45, amount: '$33,750', color: 'from-cyan-500 to-indigo-500' },
      { category: 'Sleek Modern Convention Center', percentage: 25, amount: '$18,750', color: 'from-purple-500 to-pink-500' },
      { category: 'High-end VIP Catering & Lounge', percentage: 15, amount: '$11,250', color: 'from-emerald-500 to-teal-500' },
      { category: 'Branding & Press Relations', percentage: 15, amount: '$11,250', color: 'from-amber-500 to-rose-500' }
    ],
    timeline: [
      { time: 'Month 1-3', task: 'Configure dynamic virtual platform & secure center stage' },
      { time: 'Month 4', task: 'Finalize press credentials, speaker rehearsals & AV setups' },
      { time: 'Month 5', task: 'Launch day live stream, networking lounge and global Q&A' }
    ],
    vendors: [
      { name: 'The Helix Innovation Center', rating: 4.9, price: '$$$$$', type: 'Venue' },
      { name: 'Matrix Stream Production', rating: 4.8, price: '$$$$', type: 'AV' }
    ]
  }
];

export default function HomePage() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<typeof PRESET_EVENTS[0] | null>(PRESET_EVENTS[0]);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for header glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerate = (index: number) => {
    setIsGenerating(true);
    setSelectedPreset(index);
    setTimeout(() => {
      setGeneratedPlan(PRESET_EVENTS[index]);
      setIsGenerating(false);
    }, 850);
  };

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    // Simulate smart matching a preset based on keywords
    setTimeout(() => {
      const lower = customPrompt.toLowerCase();
      if (lower.includes('wedding') || lower.includes('garden') || lower.includes('stars')) {
        setGeneratedPlan(PRESET_EVENTS[0]);
        setSelectedPreset(0);
      } else if (lower.includes('launch') || lower.includes('tech') || lower.includes('product') || lower.includes('conference')) {
        setGeneratedPlan(PRESET_EVENTS[2]);
        setSelectedPreset(2);
      } else {
        setGeneratedPlan(PRESET_EVENTS[1]);
        setSelectedPreset(1);
      }
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden relative">
      {/* Background Orbs & Aurora Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-gradient-to-br from-purple-800/15 via-pink-700/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-gradient-to-br from-blue-700/15 via-cyan-600/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[15%] w-[45%] h-[50%] rounded-full bg-gradient-to-tr from-rose-800/10 via-purple-700/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Floating Glassmorphic Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-slate-950/70 border-b border-white/5 backdrop-blur-xl shadow-2xl' 
          : 'py-5 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-[#0d1026] border border-white/10 rounded-xl p-2">
                  <Sparkles className="w-5 h-5 text-purple-400 group-hover:text-pink-400 transition-colors" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent tracking-tight">
                EventVerse
              </span>
            </Link>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
              <Link href="#preview" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">AI Planner</Link>
              <Link href="#explore" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Showcase</Link>
            </nav>

            {/* Auth Buttons (Admin completely removed) */}
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full" />
                <span className="relative flex items-center justify-center bg-slate-950 px-6 py-2 rounded-full text-sm font-bold text-white transition-all group-hover:bg-slate-900">
                  Plan Now <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/25 bg-purple-500/5 text-purple-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Event Management
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
              Plan the Unimaginable
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                With AI-Driven Magic
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0">
              Orchestrate weddings, festivals, corporate launchings, and private parties in record time. Discover elite venues, book top-tier vendors, and balance your budgets dynamically on one immersive canvas.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all flex items-center gap-2 group"
              >
                Create Free Event
                <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all"
              >
                Explore Features
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-white">12k+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Events Planners</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.4%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">RSVP Success</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">$14M+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Budget Managed</p>
              </div>
            </div>
          </div>

          {/* Hero Interactive Widget (AI Event Planner Preview) */}
          <div id="preview" className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-15" />
            
            <div className="relative bg-[#0d1026]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-3xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interactive AI Engine</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Prompt Input Form */}
              <form onSubmit={handleCustomGenerate} className="space-y-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe your dream event..."
                    className="w-full pl-11 pr-32 py-4 bg-slate-950/70 border border-white/10 focus:border-purple-500/50 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner animate-pulse"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-xs font-bold text-white shadow transition-all hover:scale-105"
                  >
                    Build Plan
                  </button>
                </div>

                {/* Preset Suggestions */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Or try preset:</span>
                  {PRESET_EVENTS.map((preset, idx) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => handleGenerate(idx)}
                      className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                        selectedPreset === idx 
                          ? 'border-purple-500/40 bg-purple-500/10 text-purple-300' 
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.title}</span>
                    </button>
                  ))}
                </div>
              </form>

              {/* Output Canvas */}
              <div className="mt-8 relative min-h-[220px] bg-slate-950/50 border border-white/5 rounded-2xl p-5 overflow-hidden transition-all duration-300">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070913]/90 animate-pulse">
                    <div className="relative w-12 h-12 mb-3">
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 animate-spin" />
                    </div>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest animate-pulse">Running AI Synthesis...</p>
                  </div>
                ) : generatedPlan ? (
                  <div className="space-y-5">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">AI Estimate</h4>
                        <p className="text-lg font-bold text-white mt-0.5">{generatedPlan.prompt}</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs font-extrabold text-purple-300">
                        {generatedPlan.budget}
                      </div>
                    </div>

                    {/* Progress Allocation */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Allocation</h4>
                      <div className="h-2 w-full bg-white/5 rounded-full flex overflow-hidden">
                        {generatedPlan.allocation.map((item, idx) => (
                          <div 
                            key={idx}
                            style={{ width: `${item.percentage}%` }}
                            className={`h-full bg-gradient-to-r ${item.color}`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] text-slate-400">
                        {generatedPlan.allocation.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                            <span className="truncate">{item.category} ({item.percentage}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Smart Milestone Plan</h4>
                      <div className="space-y-2 text-xs">
                        {generatedPlan.timeline.map((step, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded">
                              {step.time}
                            </span>
                            <span className="text-slate-300 font-medium leading-relaxed">{step.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-500">Choose a preset or enter a description to generate a plan preview.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="features" className="relative py-24 bg-slate-950 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-xs font-bold text-purple-500 uppercase tracking-widest">Capabilities Suite</h2>
            <p className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Everything You Need to Host Elite Events</p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Unlock a unified set of premium tools for scheduling, budgeting, mapping out seat tables, and interacting with trusted vendors.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-[#0d1026]/40 border border-white/5 hover:border-purple-500/30 rounded-2xl p-8 transition-all hover:-translate-y-1 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Event Blueprinting</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate complete timelines, custom vendor recommendations, and cost estimates tailored perfectly to your requirements in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-[#0d1026]/40 border border-white/5 hover:border-pink-500/30 rounded-2xl p-8 transition-all hover:-translate-y-1 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Curated Venues</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Find elite locations. Filter by guest size, pricing tier, and review ratings to secure the backdrop of your dreams.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-[#0d1026]/40 border border-white/5 hover:border-blue-500/30 rounded-2xl p-8 transition-all hover:-translate-y-1 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Guest Seating & RSVPs</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Send beautiful invitation templates, track confirmations instantly, and design optimized seating blueprints without stress.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-[#0d1026]/40 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-8 transition-all hover:-translate-y-1 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dynamic Budget Manager</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Keep tabs on payment milestones. Track actual costs against estimates, add receipts, and generate visual billing reports.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-[#0d1026]/40 border border-white/5 hover:border-amber-500/30 rounded-2xl p-8 transition-all hover:-translate-y-1 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Curated Event Shop</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Shop custom backdrops, party supplies, wedding favors, and curated decoration packs directly inside the platform.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-[#0d1026]/40 border border-white/5 hover:border-teal-500/30 rounded-2xl p-8 transition-all hover:-translate-y-1 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Time Orchestrator</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Align schedules. Create multi-day timelines, speaker shifts, vendor delivery schedules, and rehearsal plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Catalog Section */}
      <section id="explore" className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-xs font-bold text-pink-500 uppercase tracking-widest font-semibold">Premium Catalog</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Explore Top Venues & Vendors</p>
          </div>
          <div className="flex justify-center">
            <Link 
              href="/auth/signup" 
              className="text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
            >
              View All Partners <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Venue Card 1 */}
          <div className="bg-[#0d1026]/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-lg group">
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" 
                alt="Glass Pavilion" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Venue
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">The Grand Glass Pavilion</h3>
                <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current" /> 4.9
                </div>
              </div>
              <p className="text-xs text-slate-400">Indoor glass ballroom with stunning panorama views, perfect for luxury galas and receptions.</p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs">
                <span className="text-slate-500">Capacity: <strong className="text-slate-300">250 Guests</strong></span>
                <span className="text-purple-400 font-bold">$1,200/hr</span>
              </div>
            </div>
          </div>

          {/* Venue Card 2 */}
          <div className="bg-[#0d1026]/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-lg group">
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" 
                alt="Greenhouse Gardens" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Venue
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">Elysian Botanical Gardens</h3>
                <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current" /> 4.8
                </div>
              </div>
              <p className="text-xs text-slate-400">Beautiful open garden lawns, rose arches, and historic fountains for serene outdoor events.</p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs">
                <span className="text-slate-500">Capacity: <strong className="text-slate-300">180 Guests</strong></span>
                <span className="text-purple-400 font-bold">$850/hr</span>
              </div>
            </div>
          </div>

          {/* Vendor Card 3 */}
          <div className="bg-[#0d1026]/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-lg group">
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=800" 
                alt="Catering Platter" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Catering
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">Elysian Fine Catering</h3>
                <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current" /> 5.0
                </div>
              </div>
              <p className="text-xs text-slate-400">Gourmet organic catering offering customized tasting courses, molecular mixology, and desserts.</p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs">
                <span className="text-slate-500">Styles: <strong className="text-slate-300">French, Vegan, Fusion</strong></span>
                <span className="text-purple-400 font-bold">Custom Quotes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950/40 p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0,transparent_60%)] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Ready to Elevate Your Next Celebration?</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Create an account now to start mapping out your event layout, tracking your budgets, and receiving expert suggestions instantly.
            </p>
            <div className="pt-4">
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all inline-flex items-center gap-2 group hover:scale-105"
              >
                Launch Your First Event
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Admin link is completely invisible) */}
      <footer className="relative bg-slate-950/90 border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          
          {/* Logo & Slogan */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#0d1026] border border-white/10 rounded-lg p-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EventVerse</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Plan, organize, and orchestrate memorable celebrations with elite AI assistant tools.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="#features" className="hover:text-white transition-colors">Features Suite</Link></li>
              <li><Link href="#preview" className="hover:text-white transition-colors">AI Blueprinting</Link></li>
              <li><Link href="#explore" className="hover:text-white transition-colors">Explore Partners</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tech Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} EventVerse. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
