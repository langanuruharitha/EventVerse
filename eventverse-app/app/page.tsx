'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   TRADITIONAL & OLD LUXURY HERITAGE DATA
───────────────────────────────────────────── */
const TRADITIONAL_THEMES = [
  {
    id: 'wedding',
    emoji: '❦',
    label: 'Royal Weddings',
    tagline: 'A timeless union, woven in heritage and elegance.',
    accent: '#8A1C2C', // Deep Royal Crimson
    accentBg: '#FCE7E9',
    gold: '#C5A880',
    bg: '#FAF6F0', // Soft Linen Ivory
    borderStyle: 'double',
    dividerSymbol: '⚜',
    stat1: '2,400+ Grand Manors',
    stat2: '99% Cherished Unions',
    features: [
      'Ornate Floral & Pavilions',
      'Classical Banquets & Feast Curating',
      'Royal Seating Choreography',
      'Calligraphy Invitation Suites'
    ],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'corporate',
    emoji: '⚜',
    label: 'Grand Galas',
    tagline: 'Orchestrating prestige, authority, and distinguished affairs.',
    accent: '#1B2E3C', // Deep Slate/Navy
    accentBg: '#EBF2F7',
    gold: '#A38456',
    bg: '#F5F2EB', // Warm Antique Paper
    borderStyle: 'solid',
    dividerSymbol: '✦',
    stat1: '500+ Prestigious Houses',
    stat2: 'Distinguished Gatherings',
    features: [
      'Symphonic Ambient Production',
      'Eminent Speaker Protocols',
      'VIP Sommelier & Dining',
      'Exclusive Press Relations'
    ],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'social',
    emoji: '✿',
    label: 'Classic Celebrations',
    tagline: 'Honoring legacy, milestones, and joyful reunions.',
    accent: '#4C6044', // Forest Sage
    accentBg: '#F0F5EE',
    gold: '#B59468',
    bg: '#F7F4EE', // Vintage Parchment
    borderStyle: 'dotted',
    dividerSymbol: '❀',
    stat1: '50k+ Honored Milestones',
    stat2: '4.9★ Curated Reviews',
    features: [
      'Bespoke Thematic Design',
      'Live Chamber & Orchestras',
      'Artisanal Keepsake Favors',
      'Fine Portrait Photography'
    ],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'festival',
    emoji: '❧',
    label: 'Heritage Festivals',
    tagline: 'Bringing grand legends and cultural tapestries to life.',
    accent: '#654321', // Walnut Brown
    accentBg: '#FAF0E6',
    gold: '#C5A880',
    bg: '#FBF8F2', // Soft Cotton Paper
    borderStyle: 'dashed',
    dividerSymbol: '❦',
    stat1: '300k+ Cultivated Attendees',
    stat2: '120 Historical Cities',
    features: [
      'Artisanal Crafts Pavilion',
      'Traditional Troupe Booking',
      'Historical Site Leasing',
      'Orator & Protocol Logistics'
    ],
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=900',
  },
];

const VINTAGE_PARTNERS = [
  { name: 'The Grand Conservatory', type: 'Manor Venue', rating: 4.9, img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600', desc: 'A breathtaking glass ballroom surrounded by ancient botanical oak gardens.', price: 'From $1,200/hr' },
  { name: 'L\'Elysée Banquet House', type: 'Artisanal Feast', rating: 5.0, img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=600', desc: 'Bespoke menu design with organic vintage wines and classical courses.', price: 'Custom Portfolio' },
  { name: 'Luminary Portraiture', type: 'Legacy Photo', rating: 4.8, img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=600', desc: 'Capturing candid heirlooms and editorial wedding portraiture on fine film.', price: 'From $800/day' },
  { name: 'The Royal Philharmonic Quartet', type: 'Live Chamber', rating: 4.9, img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=600', desc: 'Symphonic accompaniment tailored for luxury entries and private galas.', price: 'Custom Booking' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const current = TRADITIONAL_THEMES[activeTab];

  return (
    <div style={{ background: '#FAF6F0', color: '#1F1E1B', fontFamily: '"Georgia", serif', minHeight: '100vh', transition: 'all 0.6s ease' }}>
      
      {/* CSS Rules for fonts and custom aesthetics */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .ornate-border {
          border: 4px double #C5A880;
          padding: 8px;
          position: relative;
        }
        .vintage-btn {
          border: 1px solid #1F1E1B;
          padding: 12px 28px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600;
          color: #1F1E1B;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }
        .vintage-btn-primary {
          background: #1F1E1B;
          color: #FAF6F0;
        }
        .vintage-btn:hover {
          background: #C5A880;
          border-color: #C5A880;
          color: #1F1E1B;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(197,168,128,0.25);
        }
        .theme-card {
          border: 1px solid rgba(31,30,27,0.1);
          background: #FFF;
          transition: all 0.4s cubic-bezier(.16,1,.3,1);
        }
        .theme-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(31,30,27,0.06);
          border-color: #C5A880;
        }
        .ornate-title {
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.5px;
        }
      `}</style>

      {/* ═══════════════════════════════════════
          HEADER & NAVIGATION
      ═══════════════════════════════════════ */}
      <header style={{
        borderBottom: '1px solid rgba(31,30,27,0.08)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,246,240,0.92)',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/eventverse-logo.png" alt="EventVerse" style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontFamily: "'Inter', sans-serif" }}>
            <a href="#about" style={{ textDecoration: 'none', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, color: '#1F1E1B' }}>Our Story</a>
            <a href="#catalog" style={{ textDecoration: 'none', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, color: '#1F1E1B' }}>Catalog</a>
            <Link href="/auth/signin" style={{ textDecoration: 'none', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: '#1F1E1B' }}>Sign In</Link>
            <Link href="/auth/signup" className="vintage-btn vintage-btn-primary" style={{ padding: '8px 20px', fontSize: 11, textDecoration: 'none' }}>
              Begin Planning
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          HERO & THEME CHANGER
      ═══════════════════════════════════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
        
        {/* Left Side: Editorial Typography & Selector */}
        <div>
          {/* Ornate Frame Detail */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', border: '1px solid #C5A880', borderRadius: 4, marginBottom: 24, background: '#FFF' }}>
            <span style={{ fontSize: 12, color: '#C5A880' }}>{current.emoji}</span>
            <span style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: '#1F1E1B' }}>Legacy Planning Studio</span>
          </div>

          <h1 className="ornate-title" style={{ fontSize: 'clamp(44px, 5.5vw, 68px)', fontWeight: 700, lineHeight: 1.05, color: '#1F1E1B', marginBottom: 20 }}>
            Crafting Legends, <br />
            <span style={{ fontStyle: 'italic', color: current.accent }}>Not Just Events.</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: 'rgba(31,30,27,0.7)', marginBottom: 36, maxWidth: 500 }}>
            {current.tagline} EventVerse marries classical design sensibilities with automated coordination, securing the finest manor venues and elite culinary artisans.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
            <Link href="/auth/signup" className="vintage-btn vintage-btn-primary" style={{ textDecoration: 'none' }}>
              Create Your Heirlooms {current.emoji}
            </Link>
            <a href="#catalog" className="vintage-btn" style={{ textDecoration: 'none' }}>
              Explore Partners
            </a>
          </div>

          {/* Traditional Switcher Tabs */}
          <div>
            <p style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(31,30,27,0.5)', fontWeight: 600, marginBottom: 12 }}>Select Heritage Motif</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {TRADITIONAL_THEMES.map((theme, i) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTab(i)}
                  style={{
                    border: activeTab === i ? `2px solid ${theme.accent}` : '1px solid rgba(31,30,27,0.12)',
                    background: activeTab === i ? theme.accentBg : '#FFF',
                    color: activeTab === i ? theme.accent : '#1F1E1B',
                    padding: '8px 16px',
                    fontSize: 13,
                    fontFamily: '"Georgia", serif',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ marginRight: 6 }}>{theme.emoji}</span>
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Ornate Framed Preview Card */}
        <div style={{ position: 'relative' }}>
          <div className="ornate-border" style={{ borderColor: current.accent }}>
            
            {/* Corner Ornaments */}
            <div style={{ position: 'absolute', top: 4, left: 4, fontSize: 18, color: '#C5A880' }}>❦</div>
            <div style={{ position: 'absolute', top: 4, right: 4, fontSize: 18, color: '#C5A880' }}>❦</div>
            <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 18, color: '#C5A880' }}>❦</div>
            <div style={{ position: 'absolute', bottom: 4, right: 4, fontSize: 18, color: '#C5A880' }}>❦</div>

            {/* Inner Content */}
            <div style={{ background: '#FFF', padding: 24, border: '1px solid rgba(31,30,27,0.08)' }}>
              
              {/* Image Frame */}
              <div style={{ border: '1px solid #C5A880', padding: 4, marginBottom: 20 }}>
                <img
                  src={current.image}
                  alt={current.label}
                  style={{ width: '100%', height: 260, objectFit: 'cover' }}
                />
              </div>

              {/* Title & Divider */}
              <h3 className="ornate-title" style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#1F1E1B', marginBottom: 8 }}>
                {current.label} Manifesto
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ height: 1, width: 40, background: '#C5A880' }} />
                <span style={{ color: '#C5A880', fontSize: 14 }}>{current.dividerSymbol}</span>
                <div style={{ height: 1, width: 40, background: '#C5A880' }} />
              </div>

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {current.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                    <span style={{ color: current.accent, fontSize: 12 }}>◈</span>
                    <span style={{ color: 'rgba(31,30,27,0.8)', fontWeight: 500 }}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Quick Heritage Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(31,30,27,0.06)', textAlign: 'center' }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: current.accent }}>{current.stat1.split(' ')[0]}</p>
                  <p style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(31,30,27,0.4)', fontWeight: 600 }}>{current.stat1.split(' ').slice(1).join(' ')}</p>
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#C5A880' }}>{current.stat2.split(' ')[0]}</p>
                  <p style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(31,30,27,0.4)', fontWeight: 600 }}>{current.stat2.split(' ').slice(1).join(' ')}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OUR PHILOSOPHY / HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section id="about" style={{ background: '#FAF6F0', borderTop: '1px solid rgba(31,30,27,0.06)', borderBottom: '1px solid rgba(31,30,27,0.06)', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: 12 }}>Our Philosophy</span>
            <h2 className="ornate-title" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: '#1F1E1B', letterSpacing: '-0.5px' }}>
              The Pillars of Exceptional Occasions
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
              <div style={{ height: 1, width: 40, background: '#C5A880' }} />
              <span style={{ color: '#C5A880', fontSize: 12 }}>❦</span>
              <div style={{ height: 1, width: 40, background: '#C5A880' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { step: 'I', title: 'Legacy Conception', body: 'Conceive your celebration with our digital ledger. Our algorithms orchestrate budget guidelines, timelines, and design aesthetics aligned with historic traditions.' },
              { step: 'II', title: 'Artisanal Curation', body: 'Unlock access to handpicked houses, manors, legacy portraiture, and award-winning chefs. Filter by capacity, pedigree, and historic ratings.' },
              { step: 'III', title: 'Impeccable Conduct', body: 'Coordinate invitations, seating blueprints, custom menus, and real-time expenditures from a singular unified dashboard.' }
            ].map((pillar, i) => (
              <div key={i} style={{ border: '1px solid rgba(31,30,27,0.08)', background: '#FFF', padding: 40, borderRadius: 8, position: 'relative' }}>
                <span className="ornate-title" style={{ fontSize: 48, fontWeight: 700, color: 'rgba(197,168,128,0.25)', position: 'absolute', top: 16, right: 24 }}>{pillar.step}</span>
                <h3 className="ornate-title" style={{ fontSize: 20, fontWeight: 700, color: '#1F1E1B', marginBottom: 14 }}>{pillar.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(31,30,27,0.65)' }}>{pillar.body}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          BENTO FEATURES CATALOG
      ═══════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: '#FDFBF7' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: 12 }}>The Ledger Capabilities</span>
            <h2 className="ornate-title" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: '#1F1E1B', letterSpacing: '-0.5px' }}>
              Distinguished Planning Utilities
            </h2>
          </div>

          {/* Bento Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            
            {/* Feature 1 - Big Card */}
            <div className="theme-card" style={{ gridColumn: 'span 2', padding: 48, borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32 }}>
              <div>
                <span style={{ fontSize: 32, color: '#C5A880' }}>⚜</span>
                <h3 className="ornate-title" style={{ fontSize: 24, fontWeight: 700, color: '#1F1E1B', marginTop: 16, marginBottom: 10 }}>Heritage Planning AI</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(31,30,27,0.6)', maxWidth: 480 }}>
                  Generate complete milestone checklists, budget matrices, and curated vendor recommendations tailored to local customs and grand expectations.
                </p>
              </div>
              <div style={{ border: '1px solid rgba(197,168,128,0.3)', background: '#FAF8F5', padding: 20, borderRadius: 4, fontFamily: 'monospace', fontSize: 13, color: 'rgba(31,30,27,0.7)' }}>
                <div style={{ fontWeight: 700, color: '#C5A880', marginBottom: 8 }}>❦ LEDGER BLUEPRINT SUMMARY</div>
                <div>• Allocated Budget: $35,000 for Heritage Feast & Pavilion</div>
                <div>• Chronology: Week 1-4 | Finalize Imperial Manor & Invitations</div>
                <div>• Curated Matches: 6 Legacy Houses found in your region</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="theme-card" style={{ padding: 36, borderRadius: 8 }}>
              <span style={{ fontSize: 32 }}>💌</span>
              <h3 className="ornate-title" style={{ fontSize: 20, fontWeight: 700, color: '#1F1E1B', marginTop: 16, marginBottom: 10 }}>Smart Invitation Suite</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(31,30,27,0.6)' }}>
                Bespoke calligraphy templates, real-time RSVP registries, dietary tracking, and automatic seating charts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="theme-card" style={{ padding: 36, borderRadius: 8 }}>
              <span style={{ fontSize: 32 }}>💰</span>
              <h3 className="ornate-title" style={{ fontSize: 20, fontWeight: 700, color: '#1F1E1B', marginTop: 16, marginBottom: 10 }}>Budgetary Ledger</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(31,30,27,0.6)' }}>
                Track actual expenditures, contract deposits, milestone payments, and maintain complete economic clarity.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="theme-card" style={{ padding: 36, borderRadius: 8 }}>
              <span style={{ fontSize: 32 }}>🏛️</span>
              <h3 className="ornate-title" style={{ fontSize: 20, fontWeight: 700, color: '#1F1E1B', marginTop: 16, marginBottom: 10 }}>Manorial Archives</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(31,30,27,0.6)' }}>
                Browse centuries-old castles, elegant conservatories, and classical estates certified for distinguished hosting.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="theme-card" style={{ padding: 36, borderRadius: 8 }}>
              <span style={{ fontSize: 32 }}>🍇</span>
              <h3 className="ornate-title" style={{ fontSize: 20, fontWeight: 700, color: '#1F1E1B', marginTop: 16, marginBottom: 10 }}>Artisanal Shop</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(31,30,27,0.6)' }}>
                A curated market featuring custom ornaments, heirloom accessories, traditional decor, and tailored keepsakes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATALOG SECTION
      ═══════════════════════════════════════ */}
      <section id="catalog" style={{ padding: '100px 24px', background: '#FAF6F0', borderTop: '1px solid rgba(31,30,27,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: 12 }}>The Archives</span>
              <h2 className="ornate-title" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: '#1F1E1B', letterSpacing: '-0.5px' }}>
                Explore Curated Artisans
              </h2>
            </div>
            <Link href="/auth/signup" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: '#C5A880', textDecoration: 'none' }}>
              View All 2,000+ Partners →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {VINTAGE_PARTNERS.map((partner, i) => (
              <div key={i} className="theme-card" style={{ borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ borderBottom: '1px solid rgba(31,30,27,0.06)' }}>
                  <img src={partner.img} alt={partner.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: '#C5A880', fontWeight: 700 }}>{partner.type}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#C5A880' }}>★ {partner.rating}</span>
                  </div>
                  <h3 className="ornate-title" style={{ fontSize: 16, fontWeight: 700, color: '#1F1E1B', marginBottom: 8 }}>{partner.name}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(31,30,27,0.6)', marginBottom: 16, height: 60, overflow: 'hidden' }}>{partner.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(31,30,27,0.06)' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1F1E1B' }}>{partner.price}</span>
                    <Link href="/auth/signup" style={{ fontSize: 12, fontWeight: 600, color: '#C5A880', textDecoration: 'none' }}>Inquire →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CALL TO ACTION
      ═══════════════════════════════════════ */}
      <section style={{ padding: '120px 24px', background: '#F5F2EB', borderTop: '1px solid rgba(31,30,27,0.08)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{ fontSize: 32, color: '#C5A880', display: 'block', marginBottom: 16 }}>❦</span>
          
          <h2 className="ornate-title" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: '#1F1E1B', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 24 }}>
            Write Your Celebration <br />
            <span style={{ fontStyle: 'italic', color: '#C5A880' }}>Into History.</span>
          </h2>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(31,30,27,0.65)', maxWidth: 500, margin: '0 auto 40px' }}>
            Enter your custom guidelines and let our classical ledger curate the milestones, budgets, and artisans worthy of your legacy.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" className="vintage-btn vintage-btn-primary" style={{ textDecoration: 'none' }}>
              Create Free Event
            </Link>
            <Link href="/auth/signin" className="vintage-btn" style={{ textDecoration: 'none' }}>
              Sign In to Your Ledger
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER (Admin Link completely hidden)
      ═══════════════════════════════════════ */}
      <footer style={{ background: '#1F1E1B', color: '#FAF6F0', padding: '80px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <img src="/eventverse-logo.png" alt="EventVerse" style={{ height: 52, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(250,246,240,0.5)', maxWidth: 260 }}>
                Combining centuries of hosting traditions with the ease of modern digital coordination.
              </p>
            </div>
            {[
              { title: 'The Ledger', links: ['Manifesto', 'Archives', 'Calligraphy RSVP', 'Budget Matrix'] },
              { title: 'Chronicle', links: ['Our Story', 'Pedigree Blog', 'Archives', 'Careers'] },
              { title: 'Support', links: ['Help Center', 'Inquiries', 'Privacy Guidelines', 'Terms'] }
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C5A880', fontWeight: 700, marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(link => (
                    <li key={link}><a href="#" style={{ fontSize: 13, color: 'rgba(250,246,240,0.5)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#C5A880'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,246,240,0.5)'}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(250,246,240,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'rgba(250,246,240,0.3)' }}>© {new Date().getFullYear()} EventVerse. All rights reserved.</p>
            <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.2)' }}>Distinguished Legacy Hosting Platform</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
