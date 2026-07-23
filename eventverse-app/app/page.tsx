'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const EVENT_TYPES = [
  {
    id: 'wedding',
    emoji: '💍',
    label: 'Weddings',
    tagline: 'Your love story, perfectly orchestrated.',
    color: '#f9a8c9',
    accent: '#fce7f3',
    bg: 'linear-gradient(135deg, #2d1b25 0%, #1a0f1a 100%)',
    stat1: '2,400+ Venues',
    stat2: '98% Couples Happy',
    features: ['Custom Floral Design', 'Catering & Bar', 'Seating Charts', 'RSVP Management'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'corporate',
    emoji: '🚀',
    label: 'Corporate',
    tagline: 'Launch. Celebrate. Inspire.',
    color: '#67e8f9',
    accent: '#ecfeff',
    bg: 'linear-gradient(135deg, #071b2a 0%, #050d1a 100%)',
    stat1: '$240M+ Managed',
    stat2: '500+ Companies',
    features: ['Hybrid Streaming', 'Speaker Mgmt', 'AV Production', 'Brand Integration'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'social',
    emoji: '🎉',
    label: 'Celebrations',
    tagline: 'Birthdays, galas, and everything in between.',
    color: '#fbbf24',
    accent: '#fef3c7',
    bg: 'linear-gradient(135deg, #1e1200 0%, #0f0900 100%)',
    stat1: '50k+ Events Done',
    stat2: '4.9★ Avg Rating',
    features: ['Theme Design', 'DJ & Live Music', 'Balloon Art', 'Photo Booths'],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'festival',
    emoji: '🎭',
    label: 'Festivals',
    tagline: 'Scale to thousands. Deliver perfection.',
    color: '#a78bfa',
    accent: '#ede9fe',
    bg: 'linear-gradient(135deg, #130d2a 0%, #0a0615 100%)',
    stat1: '300k+ Attendees',
    stat2: '120 Cities',
    features: ['Crowd Management', 'Multi-Stage Scheduling', 'Ticketing', 'Logistics'],
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=900',
  },
];

const VENDOR_SHOWCASE = [
  { name: 'Aurora Grand Ballroom', type: 'Venue', rating: 4.9, img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600', price: 'From $1,200/hr', tag: 'Most Booked' },
  { name: 'Elysian Gourmet Kitchen', type: 'Catering', rating: 5.0, img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=600', price: 'Custom Quote', tag: 'Top Rated' },
  { name: 'Luminary Photography', type: 'Photography', rating: 4.8, img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=600', price: 'From $800/day', tag: 'Award Winning' },
  { name: 'NeonPulse AV Studio', type: 'Production', rating: 4.9, img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=600', price: 'Custom Quote', tag: 'Premium' },
];

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, size: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.5 + 0.1 });
    }
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = end / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(timer); } else setCount(Math.floor(start));
      }, 16);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function HomePage() {
  const [activeType, setActiveType] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const current = EVENT_TYPES[activeType];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setImgLoaded(false); }, [activeType]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#06080f', color: '#f1f0ef', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');
        * { box-sizing: border-box; }
        .ev-btn-glow:hover { box-shadow: 0 0 24px currentColor; }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseRing { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.15); opacity:0; } }
        @keyframes floatY { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-12px); } }
        @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
        .anim-fade-up { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .anim-float { animation: floatY 6s ease-in-out infinite; }
        .shimmer-bar { background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%); background-size: 200% 100%; animation: shimmer 2s infinite; }
        .type-tab { transition: all 0.3s cubic-bezier(.22,1,.36,1); }
        .type-tab:hover { transform: translateY(-2px); }
        .vendor-card { transition: all 0.35s cubic-bezier(.22,1,.36,1); }
        .vendor-card:hover { transform: translateY(-8px) scale(1.02); }
        .feat-card { transition: all 0.3s cubic-bezier(.22,1,.36,1); border: 1px solid rgba(255,255,255,0.06); }
        .feat-card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-4px); background: rgba(255,255,255,0.05) !important; }
      `}</style>

      {/* ═══════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '12px 0' : '22px 0',
        background: scrolled ? 'rgba(6,8,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s cubic-bezier(.22,1,.36,1)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${current.color}, #7c3aed)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, transition: 'all 0.5s ease',
              boxShadow: `0 0 16px ${current.color}50`,
            }}>✦</div>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>EventVerse</span>
          </Link>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#how" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
               onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              How It Works
            </a>
            <a href="#vendors" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
               onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              Venues & Vendors
            </a>
            <Link href="/auth/signin" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
               onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}>
              Sign In
            </Link>
            <Link href="/auth/signup" style={{
              padding: '10px 22px', borderRadius: 50,
              background: `linear-gradient(135deg, ${current.color}cc, #7c3aed)`,
              color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
              transition: 'all 0.4s ease',
              boxShadow: `0 4px 20px ${current.color}40`,
            }}>
              Start Planning →
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO — EVENT TYPE SELECTOR
      ═══════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <ParticleField />

        {/* Full-bleed image bg */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <img
            src={current.image}
            alt={current.label}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: imgLoaded ? 0.18 : 0,
              transition: 'opacity 0.8s ease',
              filter: 'blur(4px) saturate(0.5)',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `${current.bg}, linear-gradient(to right, rgba(6,8,15,0.95) 0%, rgba(6,8,15,0.6) 50%, rgba(6,8,15,0.3) 100%)`,
          }} />
        </div>

        {/* Color accent orb */}
        <div style={{
          position: 'absolute', right: '-5%', top: '10%', zIndex: 1,
          width: 600, height: 600, borderRadius: '50%',
          background: `radial-gradient(circle, ${current.color}25 0%, transparent 70%)`,
          transition: 'all 0.8s ease',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-10%', bottom: '0%', zIndex: 1,
          width: 400, height: 400, borderRadius: '50%',
          background: `radial-gradient(circle, #7c3aed18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '120px 24px 80px', width: '100%' }}>
          
          {/* Badge */}
          <div key={`badge-${activeType}`} className="anim-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 50, border: `1px solid ${current.color}40`, background: `${current.color}10`, marginBottom: 28 }}>
            <span style={{ fontSize: 14 }}>{current.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: current.color, textTransform: 'uppercase' }}>AI-Powered Event Platform</span>
          </div>

          {/* Main headline */}
          <div key={`headline-${activeType}`} className="anim-fade-up" style={{ animationDelay: '0.05s' }}>
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-2px',
              color: '#fff',
              marginBottom: 16,
              maxWidth: 780,
            }}>
              Every Great Event<br />
              <span style={{ fontStyle: 'italic', color: current.color }}>{current.label === 'Weddings' ? 'Deserves Magic.' : current.label === 'Corporate' ? 'Starts Here.' : current.label === 'Celebrations' ? 'Tells a Story.' : 'Needs a Stage.'}</span>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', fontWeight: 400, maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
              {current.tagline} EventVerse connects you with elite venues, top vendors, AI planning, and seamless guest management — all in one place.
            </p>
          </div>

          {/* CTA Buttons */}
          <div key={`cta-${activeType}`} className="anim-fade-up" style={{ animationDelay: '0.1s', display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 72 }}>
            <Link href="/auth/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px', borderRadius: 14,
              background: `linear-gradient(135deg, ${current.color}, #7c3aed)`,
              color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none',
              boxShadow: `0 8px 32px ${current.color}40`,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${current.color}50`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 32px ${current.color}40`; }}>
              Plan Your {current.label === 'Weddings' ? 'Wedding' : current.label === 'Celebrations' ? 'Celebration' : current.label === 'Festivals' ? 'Festival' : 'Event'} Free
              <span style={{ fontSize: 20 }}>{current.emoji}</span>
            </Link>
            <a href="#vendors" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px', borderRadius: 14,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', fontWeight: 600, fontSize: 16, textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Explore Partners ↓
            </a>
          </div>

          {/* EVENT TYPE TABS */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {EVENT_TYPES.map((type, i) => (
              <button key={type.id} className="type-tab" onClick={() => setActiveType(i)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 50, border: 'none', cursor: 'pointer',
                background: activeType === i ? `linear-gradient(135deg, ${type.color}30, ${type.color}10)` : 'rgba(255,255,255,0.05)',
                borderWidth: 1, borderStyle: 'solid', borderColor: activeType === i ? `${type.color}60` : 'rgba(255,255,255,0.08)',
                color: activeType === i ? type.color : 'rgba(255,255,255,0.5)',
                fontWeight: activeType === i ? 700 : 500, fontSize: 14,
                boxShadow: activeType === i ? `0 4px 16px ${type.color}20` : 'none',
              }}>
                <span style={{ fontSize: 18 }}>{type.emoji}</span>
                {type.label}
              </button>
            ))}
          </div>

          {/* STATS BAR */}
          <div key={`stats-${activeType}`} className="anim-fade-up" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '8px 48px',
            marginTop: 40, paddingTop: 40,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: '"Playfair Display", serif' }}>{current.stat1.replace(/[^0-9+k$M]/g, '')}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{current.stat1.replace(/[0-9+k$M]/g, '').trim()}</p>
            </div>
            <div>
              <p style={{ fontSize: 28, fontWeight: 800, color: current.color, fontFamily: '"Playfair Display", serif' }}>{current.stat2.split(' ')[0]}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{current.stat2.split(' ').slice(1).join(' ')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — VISUAL STEPS
      ═══════════════════════════════════════ */}
      <section id="how" style={{ padding: '120px 24px', background: '#06080f', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#7c3aed', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>Simple & Powerful</span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
              From Idea to Unforgettable
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto' }}>Three steps is all it takes to create the event of a lifetime.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 56, left: '16.6%', right: '16.6%', height: 1, background: 'linear-gradient(to right, #7c3aed40, rgba(255,255,255,0.08), #7c3aed40)', zIndex: 0 }} />
            
            {[
              { step: '01', icon: '✦', title: 'Describe Your Vision', body: 'Tell us what you\'re dreaming of — a garden wedding, rooftop gala, or massive festival. Our AI starts building your plan instantly.' },
              { step: '02', icon: '🔍', title: 'Match with Elite Partners', body: 'Browse AI-curated venues and vendors perfectly matched to your style, guest count, and budget. Book securely in one click.' },
              { step: '03', icon: '🎯', title: 'Execute Flawlessly', body: 'Send RSVPs, manage seating charts, track your budget in real time, and coordinate your team — all from your EventVerse dashboard.' },
            ].map((item, i) => (
              <div key={i} className="feat-card" style={{
                position: 'relative', zIndex: 1,
                padding: 40, borderRadius: 24,
                background: 'rgba(255,255,255,0.02)',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
                  background: `rgba(124,58,237,0.12)`,
                  border: '1px solid rgba(124,58,237,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28,
                }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 12 }}>Step {item.step}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: '"Playfair Display", serif' }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES — BENTO GRID
      ═══════════════════════════════════════ */}
      <section style={{ padding: '0 24px 120px', background: '#06080f' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#f9a8c9', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>Platform Features</span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              One Platform.<br />Infinite Possibilities.
            </h2>
          </div>

          {/* Bento Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto', gap: 20 }}>
            {/* Big card — AI Planner */}
            <div className="feat-card" style={{ gridColumn: 'span 2', padding: 48, borderRadius: 28, background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,8,15,0) 100%)', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✦</div>
              <div>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 10, fontFamily: '"Playfair Display", serif' }}>AI Event Blueprinting</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 460 }}>Describe your event in plain English. Get a complete event plan: timelines, budget allocations, vendor suggestions, and milestone checklists generated in seconds.</p>
              </div>
              {/* Mock AI output */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace' }}>
                <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, marginBottom: 12, letterSpacing: '0.08em' }}>✦ AI PLAN PREVIEW</div>
                {['Venue: Aurora Grand Ballroom — 4.9★', 'Budget: $35,000 → Allocated across 4 categories', 'Milestone: Venue secured by Month 1', 'Vendors: 8 top-rated matches found'].map((line, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#10b981', fontSize: 10 }}>●</span> {line}
                  </div>
                ))}
              </div>
            </div>

            {/* RSVP card */}
            <div className="feat-card" style={{ padding: 40, borderRadius: 28, background: 'rgba(249,168,201,0.05)' }}>
              <div style={{ fontSize: 36, marginBottom: 20 }}>💌</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10, fontFamily: '"Playfair Display", serif' }}>Smart RSVP & Guest Lists</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>Beautiful digital invitations, real-time tracking, dietary preference collection, and auto-sorted seating charts.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
                {['Confirmed: 142', 'Declined: 23', 'Pending: 35'].map(tag => (
                  <span key={tag} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 50, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Budget card */}
            <div className="feat-card" style={{ padding: 40, borderRadius: 28, background: 'rgba(251,191,36,0.05)' }}>
              <div style={{ fontSize: 36, marginBottom: 20 }}>💰</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10, fontFamily: '"Playfair Display", serif' }}>Live Budget Manager</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>Track spending across all vendors in real-time. Visual breakdowns, payment milestones, and overspend alerts.</p>
              <div style={{ marginTop: 20, height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '67%', borderRadius: 99, background: 'linear-gradient(to right, #fbbf24, #f59e0b)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>$23,450 spent</span>
                <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>$35,000 total</span>
              </div>
            </div>

            {/* Vendor discovery card */}
            <div className="feat-card" style={{ padding: 40, borderRadius: 28, background: 'rgba(103,232,249,0.04)' }}>
              <div style={{ fontSize: 36, marginBottom: 20 }}>🔍</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10, fontFamily: '"Playfair Display", serif' }}>Curated Vendor Network</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>Access thousands of verified photographers, caterers, DJs, florists, and venues — filtered to match your exact event.</p>
            </div>

            {/* Timeline card (big) */}
            <div className="feat-card" style={{ gridColumn: 'span 3', padding: 48, borderRadius: 28, background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(6,8,15,0) 100%)', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto', maxWidth: 380 }}>
                <div style={{ fontSize: 36, marginBottom: 20 }}>📅</div>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 10, fontFamily: '"Playfair Display", serif' }}>Intelligent Timeline Orchestrator</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>Multi-day schedules, vendor delivery coordination, speaker slots, rehearsal runs — all auto-synced and collision-free.</p>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                {[
                  { time: 'Month 1', task: 'Venue booking confirmed & deposits paid', done: true },
                  { time: 'Month 2', task: 'Catering menu tasting & final selection', done: true },
                  { time: 'Month 3', task: 'Invitations sent via EventVerse platform', done: false },
                  { time: 'Event Day', task: 'Live coordination dashboard goes live', done: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: item.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${item.done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{item.done ? '✓' : '○'}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: item.done ? '#10b981' : 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{item.time}</div>
                      <div style={{ fontSize: 14, color: item.done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>{item.task}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VENDOR SHOWCASE
      ═══════════════════════════════════════ */}
      <section id="vendors" style={{ padding: '80px 24px 120px', background: 'linear-gradient(to bottom, #06080f, #0a0d18)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#67e8f9', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Premium Partners</span>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                Handpicked Venues<br />& Vendors
              </h2>
            </div>
            <Link href="/auth/signup" style={{ fontSize: 14, fontWeight: 600, color: '#67e8f9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              Browse All 2,000+ Partners →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {VENDOR_SHOWCASE.map((v, i) => (
              <div key={i} className="vendor-card" style={{
                borderRadius: 24, overflow: 'hidden',
                background: '#0d1117',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
              }}>
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={v.img} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,17,23,0.8) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', borderRadius: 50, background: 'rgba(13,17,23,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{v.type}</div>
                  <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 12px', borderRadius: 50, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', fontSize: 11, fontWeight: 700, color: '#fbbf24' }}>{v.tag}</div>
                </div>
                <div style={{ padding: '20px 20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{v.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <span style={{ color: '#fbbf24', fontSize: 12 }}>★</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{v.rating}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>{v.price}</p>
                  <button style={{
                    width: '100%', padding: '10px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SOCIAL PROOF — STATS SECTION
      ═══════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#0a0d18', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, textAlign: 'center' }}>
          {[
            { num: 50000, suffix: '+', label: 'Events Planned', color: '#f9a8c9' },
            { num: 12000, suffix: '+', label: 'Active Planners', color: '#67e8f9' },
            { num: 2400, suffix: '+', label: 'Verified Partners', color: '#fbbf24' },
            { num: 99, suffix: '.4%', label: 'Client Satisfaction', color: '#a78bfa' },
          ].map((stat, i) => (
            <div key={i}>
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800, color: stat.color, marginBottom: 8, letterSpacing: '-1px' }}>
                <CountUp end={stat.num} suffix={stat.suffix} />
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section style={{ padding: '120px 24px', background: '#0a0d18', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,168,201,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 50, background: 'rgba(249,168,201,0.08)', border: '1px solid rgba(249,168,201,0.2)', marginBottom: 28 }}>
            <span style={{ fontSize: 14 }}>✦</span>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#f9a8c9', textTransform: 'uppercase' }}>Start for Free Today</span>
          </div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, color: '#fff', letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 20 }}>
            Your Next Great Event<br /><span style={{ fontStyle: 'italic', color: '#f9a8c9' }}>Starts Here.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 48px' }}>
            Join 12,000+ event planners who trust EventVerse to orchestrate their most important moments. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '18px 44px', borderRadius: 14,
              background: 'linear-gradient(135deg, #f9a8c9, #7c3aed)',
              color: '#fff', fontWeight: 800, fontSize: 17, textDecoration: 'none',
              boxShadow: '0 12px 40px rgba(249,168,201,0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(249,168,201,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,168,201,0.3)'; }}>
              Create Your Free Account ✦
            </Link>
            <Link href="/auth/signin" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '18px 44px', borderRadius: 14,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 17, textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Already a member? Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer style={{ background: '#06080f', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 24px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #f9a8c9, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff' }}>✦</div>
                <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 800, color: '#fff' }}>EventVerse</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, maxWidth: 240 }}>
                The world's most beautiful event planning platform. From intimate gatherings to epic festivals.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Features', 'AI Planner', 'Vendor Network', 'RSVP Tools'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy Policy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 20 }}>{col.title}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                         onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                         onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>© {new Date().getFullYear()} EventVerse. All rights reserved.</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>Made with ✦ for event lovers worldwide</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
