'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Video, Download, Upload, Sparkles } from 'lucide-react';

function CreateVideoInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1); // 1: Choose, 2: Customize, 3: Generate
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    eventType: 'birthday',
    eventName: '',
    fromName: '',
    toName: '',
    date: '',
    time: '',
    venue: '',
    message: '',
    photos: [] as File[],
    themeDescription: ''
  });

  useEffect(() => {
    // Check if coming from template selection
    const templateId = searchParams.get('templateId');
    const type = searchParams.get('type');
    
    if (type) {
      setFormData(prev => ({ ...prev, eventType: type }));
    }
    
    if (templateId) {
      // Skip step 1 and go directly to step 2 with template
      loadTemplate(templateId);
      setStep(2);
    } else if (step === 1) {
      fetchTemplates();
    }
  }, [step, formData.eventType, searchParams]);

  const loadTemplate = async (templateId: string) => {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from('invitation_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (data) {
      setSelectedTemplate(data);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    const supabase = createBrowserClient();
    
    const { data, error } = await supabase
      .from('invitation_templates')
      .select('*')
      .eq('category', formData.eventType)
      .order('rating_average', { ascending: false })
      .limit(12);
    
    if (error) {
      console.error('Error fetching templates:', error);
    }
    
    setTemplates(data || []);
    setLoading(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({
        ...formData,
        photos: files
      });
    }
  };

  const generateVideo = async () => {
    if (!formData.eventName || !formData.fromName || !formData.date || !formData.time || !formData.venue) {
      alert('Please fill all required fields: Event Name, Host Name, Date, Time and Venue');
      return;
    }

    setGenerating(true);
    
    try {
      // Always generate a custom canvas-based video with the custom AI background theme!
      const videoBlob = await createVideoFromPhotos(formData.photos, formData);
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideo(videoUrl);
      setStep(3);

      // Save metadata to database asynchronously
      try {
        await fetch('/api/invitations/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            templateId: selectedTemplate?.id
          })
        });
      } catch (dbErr) {
        console.warn('Failed to save invitation meta to db:', dbErr);
      }
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to generate video invitation. Falling back to default preview.');
      await generateVideoViaAPI();
    } finally {
      setGenerating(false);
    }
  };

  const generateVideoViaAPI = async () => {
    const response = await fetch('/api/invitations/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        templateId: selectedTemplate?.id
      })
    });

    const data = await response.json();

    if (data.success && data.videoUrl) {
      setGeneratedVideo(data.videoUrl);
      setStep(3);
    } else {
      throw new Error(data.error || 'API video generation failed');
    }
  };

  // Pure canvas video generator — no CORS, no external images, instant + reliable
  const createVideoFromPhotos = async (photos: File[], data: typeof formData): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d')!;

        // ── 1. PICK THEME PALETTE based on user's themeDescription keywords ──
        const th = (data.themeDescription || '').toLowerCase();
        
        let palette = {
          bg1: '#0f0c29', bg2: '#302b63', bg3: '#24243e', // deep cosmic default
          accent: '#f59e0b', accent2: '#f472b6',
          particle: '#ffffff', text: '#ffffff', sub: '#fde68a'
        };

        // Priority: specific visual elements beat generic style words
        if (th.includes('balloon') || th.includes('confetti') || th.includes('festival') || th.includes('cake') || th.includes('birthday') || th.includes('candy')) {
          // Warm colorful festival/birthday palette
          palette = { bg1: '#1a0030', bg2: '#4c0070', bg3: '#0d0020', accent: '#facc15', accent2: '#f472b6', particle: '#fde68a', text: '#ffffff', sub: '#fde68a' };
        } else if (th.includes('rose') || th.includes('floral') || th.includes('flower') || th.includes('petal') || th.includes('garden')) {
          palette = { bg1: '#2d0a1f', bg2: '#7b1450', bg3: '#3d1535', accent: '#f9a8d4', accent2: '#fbcfe8', particle: '#fce7f3', text: '#fff1f2', sub: '#f9a8d4' };
        } else if (th.includes('wedding') || th.includes('mandap') || th.includes('gold') || th.includes('royal') || th.includes('arch') || th.includes('ring')) {
          palette = { bg1: '#1a0a00', bg2: '#7c3504', bg3: '#3d1f00', accent: '#fbbf24', accent2: '#fde68a', particle: '#fef3c7', text: '#fffbeb', sub: '#fcd34d' };
        } else if (th.includes('star') || th.includes('night') || th.includes('sky') || th.includes('space') || th.includes('cosmic') || th.includes('galaxy')) {
          palette = { bg1: '#020817', bg2: '#0f172a', bg3: '#1e1b4b', accent: '#818cf8', accent2: '#a5b4fc', particle: '#e0e7ff', text: '#ffffff', sub: '#c7d2fe' };
        } else if (th.includes('neon') || th.includes('disco') || th.includes('retro') || th.includes('dance') || th.includes('vibrant')) {
          palette = { bg1: '#09001a', bg2: '#1a003d', bg3: '#0d0026', accent: '#f0abfc', accent2: '#22d3ee', particle: '#f0abfc', text: '#ffffff', sub: '#86efac' };
        } else if (th.includes('green') || th.includes('forest') || th.includes('nature') || th.includes('leaf') || th.includes('botanical')) {
          palette = { bg1: '#052e16', bg2: '#14532d', bg3: '#064e3b', accent: '#4ade80', accent2: '#86efac', particle: '#d1fae5', text: '#f0fdf4', sub: '#6ee7b7' };
        } else if (th.includes('ocean') || th.includes('sea') || th.includes('beach') || th.includes('wave') || th.includes('aqua') || th.includes('blue')) {
          palette = { bg1: '#030712', bg2: '#0c4a6e', bg3: '#0369a1', accent: '#38bdf8', accent2: '#7dd3fc', particle: '#bae6fd', text: '#f0f9ff', sub: '#93c5fd' };
        } else if (th.includes('mehndi') || th.includes('henna') || th.includes('diya') || th.includes('indian') || th.includes('traditional') || th.includes('ethnic')) {
          palette = { bg1: '#1a0a00', bg2: '#78350f', bg3: '#431407', accent: '#fb923c', accent2: '#fbbf24', particle: '#fed7aa', text: '#fff7ed', sub: '#fdba74' };
        } else if (th.includes('sweet') || th.includes('pastel') || th.includes('cute')) {
          palette = { bg1: '#1e1b2e', bg2: '#4a1d4f', bg3: '#2e1555', accent: '#f472b6', accent2: '#c084fc', particle: '#fce7f3', text: '#fdf4ff', sub: '#f0abfc' };
        } else if (th.includes('minimal') || th.includes('white') || th.includes('clean') || th.includes('modern')) {
          palette = { bg1: '#1f2937', bg2: '#374151', bg3: '#111827', accent: '#e5e7eb', accent2: '#d1d5db', particle: '#f9fafb', text: '#ffffff', sub: '#d1d5db' };
        }

        // ── 2. Detect theme type from keywords (specific visual elements take priority) ──
        type ThemeType = 'birthday' | 'wedding' | 'floral' | 'space' | 'neon' | 'mehndi' | 'nature' | 'ocean' | 'default';
        const getTheme = (): ThemeType => {
          // Specific visual elements first — balloon/cake/festival beats traditional
          if (th.includes('balloon') || th.includes('cake') || th.includes('birthday') || th.includes('festival') || th.includes('confetti') || th.includes('candy')) return 'birthday';
          if (th.includes('star') || th.includes('space') || th.includes('galaxy') || th.includes('cosmic') || th.includes('night') || th.includes('sky')) return 'space';
          if (th.includes('rose') || th.includes('floral') || th.includes('flower') || th.includes('petal') || th.includes('garden') || th.includes('botanical')) return 'floral';
          if (th.includes('wedding') || th.includes('mandap') || th.includes('arch') || th.includes('ring')) return 'wedding';
          if (th.includes('neon') || th.includes('disco') || th.includes('retro') || th.includes('dance') || th.includes('vibrant')) return 'neon';
          if (th.includes('mehndi') || th.includes('henna') || th.includes('diya') || th.includes('indian') || th.includes('traditional') || th.includes('ethnic')) return 'mehndi';
          if (th.includes('green') || th.includes('nature') || th.includes('forest') || th.includes('leaf') || th.includes('tree')) return 'nature';
          if (th.includes('ocean') || th.includes('sea') || th.includes('beach') || th.includes('wave') || th.includes('aqua') || th.includes('blue')) return 'ocean';
          return 'default';
        };
        const themeType = getTheme();

        // ── 3. Pre-generate stable element positions ──
        const rng = (seed: number) => { const x = Math.sin(seed) * 10000; return x - Math.floor(x); };

        // Balloons for birthday
        const balloons = Array.from({ length: 9 }, (_, i) => ({
          x: 100 + rng(i * 7) * 1080, baseY: 80 + rng(i * 13) * 300,
          r: 28 + rng(i * 5) * 18,
          color: ['#f472b6','#fb923c','#facc15','#4ade80','#60a5fa','#c084fc','#f87171','#34d399','#38bdf8'][i % 9],
          phase: rng(i * 3) * Math.PI * 2
        }));
        // Confetti for birthday
        const confetti = Array.from({ length: 50 }, (_, i) => ({
          x: rng(i * 11) * 1280, y: rng(i * 17) * 720, vy: 0.8 + rng(i * 23) * 1.5,
          w: 6 + rng(i * 3) * 8, h: 3 + rng(i * 7) * 5,
          angle: rng(i * 19) * Math.PI * 2, spin: (rng(i * 31) - 0.5) * 0.06,
          color: ['#f472b6','#fb923c','#facc15','#4ade80','#60a5fa','#c084fc'][i % 6]
        }));
        // Stars for space
        const stars = Array.from({ length: 120 }, (_, i) => ({
          x: rng(i * 7) * 1280, y: rng(i * 11) * 720,
          r: 0.5 + rng(i * 13) * 2.5, phase: rng(i * 3) * Math.PI * 2
        }));
        // Petals for floral
        const petals = Array.from({ length: 12 }, (_, i) => ({
          cx: 80 + rng(i * 9) * 1120, cy: 60 + rng(i * 13) * 600,
          size: 18 + rng(i * 5) * 22, phase: rng(i) * Math.PI * 2
        }));
        // Falling petals (animated)
        const fallingPetals = Array.from({ length: 20 }, (_, i) => ({
          x: rng(i * 3) * 1280, y: rng(i * 7) * 720, vy: 0.5 + rng(i * 11) * 1.2,
          vx: (rng(i * 17) - 0.5) * 0.8, size: 8 + rng(i * 5) * 10,
          angle: rng(i * 19) * Math.PI * 2, color: ['#f9a8d4','#fda4af','#fbcfe8','#fce7f3','#f472b6'][i % 5]
        }));
        // Rings/diamonds for wedding
        const weddingOrbs = Array.from({ length: 8 }, (_, i) => ({
          x: 100 + rng(i * 17) * 1080, y: 60 + rng(i * 11) * 600, phase: rng(i) * Math.PI * 2
        }));
        // Diya positions for mehndi
        const diyas = Array.from({ length: 6 }, (_, i) => ({
          x: 120 + rng(i * 13) * 1040, y: 100 + rng(i * 7) * 520, phase: rng(i) * Math.PI * 2
        }));
        // Leaves for nature
        const leaves = Array.from({ length: 16 }, (_, i) => ({
          x: rng(i * 9) * 1280, y: rng(i * 5) * 720, vy: 0.4 + rng(i * 13) * 0.8,
          angle: rng(i * 17) * Math.PI * 2, size: 10 + rng(i * 3) * 16,
          color: ['#4ade80','#86efac','#6ee7b7','#a7f3d0','#34d399'][i % 5]
        }));
        // Bubbles for ocean
        const bubbles = Array.from({ length: 25 }, (_, i) => ({
          x: rng(i * 7) * 1280, y: 720 - rng(i * 11) * 720, vy: -0.5 - rng(i * 3) * 1,
          r: 4 + rng(i * 5) * 18, alpha: 0.3 + rng(i * 13) * 0.5
        }));

        // ── 4. Load user photos if present ──
        const userImages = await Promise.all(
          photos.map(photo => new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image();
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = URL.createObjectURL(photo);
          }))
        ).catch(() => [] as HTMLImageElement[]);

        // ── 5. Setup MediaRecorder ──
        const stream = canvas.captureStream(30);
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
        }
        const mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3000000 });
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        mediaRecorder.start(100);

        // ── 6. Define slides ──
        const slideDuration = 4000;
        const slides: { type: string; title: string; body?: string; image?: HTMLImageElement }[] = [
          { type: 'intro',    title: data.eventName || 'Event Invitation' },
          { type: 'hosts',    title: 'Cordially Hosted By', body: data.fromName },
          { type: 'datetime', title: 'Join Us On', body: `${data.date}  ·  ${data.time}` },
          { type: 'venue',    title: '📍 Venue', body: data.venue }
        ];
        if (data.message) slides.push({ type: 'message', title: 'A Note For You', body: data.message });
        userImages.forEach((img, i) => slides.push({ type: 'photo', title: `${data.eventName}`, body: `Photo ${i + 1}`, image: img }));
        slides.push({ type: 'outro', title: '❤️ We Look Forward to Seeing You!' });

        const totalDuration = slides.length * slideDuration;
        const startTime = Date.now();
        let animId: number;
        let frameCount = 0;

        // ── 7. drawBackground: theme-specific visual elements ──
        const drawBackground = (t: number) => {
          // Base gradient
          const grad = ctx.createLinearGradient(0, 0, 1280, 720);
          grad.addColorStop(0, palette.bg1);
          grad.addColorStop(0.5, palette.bg2);
          grad.addColorStop(1, palette.bg3);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1280, 720);

          ctx.save();

          if (themeType === 'birthday') {
            // 🎈 Draw floating balloons
            balloons.forEach((b) => {
              const floatY = b.baseY + Math.sin(t * 1.2 + b.phase) * 25;
              // Balloon
              ctx.beginPath();
              ctx.ellipse(b.x, floatY, b.r, b.r * 1.25, 0, 0, Math.PI * 2);
              ctx.fillStyle = b.color;
              ctx.globalAlpha = 0.85;
              ctx.fill();
              // Shine
              ctx.beginPath();
              ctx.ellipse(b.x - b.r * 0.3, floatY - b.r * 0.4, b.r * 0.25, b.r * 0.35, -0.5, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255,255,255,0.45)';
              ctx.fill();
              // String
              ctx.beginPath();
              ctx.moveTo(b.x, floatY + b.r * 1.25);
              ctx.bezierCurveTo(b.x + 8, floatY + b.r * 2, b.x - 8, floatY + b.r * 3, b.x, floatY + b.r * 4);
              ctx.strokeStyle = 'rgba(255,255,255,0.5)';
              ctx.lineWidth = 1.5;
              ctx.globalAlpha = 0.6;
              ctx.stroke();
            });
            // 🎊 Falling confetti
            confetti.forEach((c) => {
              c.y += c.vy;
              c.angle += c.spin;
              if (c.y > 740) c.y = -10;
              ctx.save();
              ctx.translate(c.x, c.y);
              ctx.rotate(c.angle);
              ctx.fillStyle = c.color;
              ctx.globalAlpha = 0.8;
              ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
              ctx.restore();
            });
            // ✨ Sparkles
            for (let i = 0; i < 8; i++) {
              const sx = 150 + rng(i * 31 + frameCount * 0.01) * 980;
              const sy = 100 + rng(i * 41 + frameCount * 0.01) * 520;
              const sparkAlpha = (Math.sin(t * 4 + i * 1.3) + 1) / 2;
              ctx.strokeStyle = '#facc15';
              ctx.lineWidth = 1.5;
              ctx.globalAlpha = sparkAlpha * 0.9;
              ctx.beginPath(); ctx.moveTo(sx - 8, sy); ctx.lineTo(sx + 8, sy); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(sx, sy - 8); ctx.lineTo(sx, sy + 8); ctx.stroke();
            }

          } else if (themeType === 'space') {
            // 🌟 Draw twinkling stars
            stars.forEach((s) => {
              const twinkle = (Math.sin(t * 3 + s.phase) + 1) / 2;
              ctx.beginPath();
              ctx.arc(s.x, s.y, s.r * (0.4 + twinkle * 0.6), 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = 0.3 + twinkle * 0.7;
              ctx.fill();
            });
            // Shooting star
            const shootX = ((t * 100) % 1600) - 100;
            const shootY = 80 + ((t * 100) % 1600) * 0.2;
            const tailLen = 80;
            const shootGrad = ctx.createLinearGradient(shootX - tailLen, shootY + tailLen * 0.2, shootX, shootY);
            shootGrad.addColorStop(0, 'rgba(255,255,255,0)');
            shootGrad.addColorStop(1, 'rgba(255,255,255,0.9)');
            ctx.beginPath(); ctx.moveTo(shootX - tailLen, shootY + tailLen * 0.2); ctx.lineTo(shootX, shootY);
            ctx.strokeStyle = shootGrad; ctx.lineWidth = 2; ctx.globalAlpha = 0.8; ctx.stroke();
            // Moon glow
            const moonGrad = ctx.createRadialGradient(1100, 100, 10, 1100, 100, 80);
            moonGrad.addColorStop(0, 'rgba(200,210,255,0.3)');
            moonGrad.addColorStop(1, 'rgba(200,210,255,0)');
            ctx.fillStyle = moonGrad; ctx.globalAlpha = 1;
            ctx.beginPath(); ctx.arc(1100, 100, 80, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(1100, 100, 40, 0, Math.PI * 2);
            ctx.fillStyle = '#c7d2fe'; ctx.globalAlpha = 0.25; ctx.fill();

          } else if (themeType === 'floral') {
            // 🌸 Draw flower clusters
            petals.forEach((f, fi) => {
              const rot = t * 0.4 + f.phase;
              for (let p = 0; p < 5; p++) {
                const angle = (p / 5) * Math.PI * 2 + rot;
                const px = f.cx + Math.cos(angle) * f.size;
                const py = f.cy + Math.sin(angle) * f.size;
                ctx.beginPath();
                ctx.ellipse(px, py, f.size * 0.45, f.size * 0.28, angle, 0, Math.PI * 2);
                ctx.fillStyle = fi % 2 === 0 ? '#f9a8d4' : '#fda4af';
                ctx.globalAlpha = 0.65;
                ctx.fill();
              }
              ctx.beginPath();
              ctx.arc(f.cx, f.cy, f.size * 0.25, 0, Math.PI * 2);
              ctx.fillStyle = '#fbbf24'; ctx.globalAlpha = 0.9; ctx.fill();
            });
            // Falling petals
            fallingPetals.forEach((fp) => {
              fp.y += fp.vy; fp.x += fp.vx; fp.angle += 0.02;
              if (fp.y > 740) fp.y = -20;
              ctx.save(); ctx.translate(fp.x, fp.y); ctx.rotate(fp.angle);
              ctx.beginPath();
              ctx.ellipse(0, 0, fp.size, fp.size * 0.5, 0, 0, Math.PI * 2);
              ctx.fillStyle = fp.color; ctx.globalAlpha = 0.7; ctx.fill();
              ctx.restore();
            });

          } else if (themeType === 'wedding') {
            // 💍 Golden ring ornaments + floating lights
            weddingOrbs.forEach((o, i) => {
              const pulse = (Math.sin(t * 2 + o.phase) + 1) / 2;
              // Glow
              const glowR = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, 40 + pulse * 20);
              glowR.addColorStop(0, 'rgba(251,191,36,0.4)');
              glowR.addColorStop(1, 'rgba(251,191,36,0)');
              ctx.fillStyle = glowR; ctx.globalAlpha = 1;
              ctx.beginPath(); ctx.arc(o.x, o.y, 60, 0, Math.PI * 2); ctx.fill();
              // Ring
              ctx.beginPath();
              ctx.arc(o.x, o.y, 18 + i * 2, 0, Math.PI * 2);
              ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.globalAlpha = 0.6 + pulse * 0.4;
              ctx.stroke();
              // Diamond sparkle
              ctx.save(); ctx.translate(o.x, o.y - 28); ctx.rotate(t + o.phase);
              ctx.fillStyle = '#fde68a'; ctx.globalAlpha = 0.8;
              ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo(5,0); ctx.lineTo(0,8); ctx.lineTo(-5,0); ctx.closePath(); ctx.fill();
              ctx.restore();
            });
            // Golden rain particles
            stars.slice(0, 60).forEach((s, i) => {
              const y = (s.y + t * 40) % 720;
              ctx.fillStyle = '#fbbf24'; ctx.globalAlpha = 0.3 + rng(i * 7) * 0.4;
              ctx.fillRect(s.x, y, 1.5, 4 + rng(i * 3) * 6);
            });

          } else if (themeType === 'neon') {
            // 💡 Neon beams and geometric shapes
            const neonColors = ['#f0abfc', '#22d3ee', '#86efac', '#fbbf24', '#f472b6'];
            for (let i = 0; i < 6; i++) {
              const x1 = (i * 200 + t * 30) % 1280;
              const beamGrad = ctx.createLinearGradient(x1, 0, x1 + 60, 720);
              beamGrad.addColorStop(0, neonColors[i % neonColors.length] + '00');
              beamGrad.addColorStop(0.5, neonColors[i % neonColors.length] + '33');
              beamGrad.addColorStop(1, neonColors[i % neonColors.length] + '00');
              ctx.fillStyle = beamGrad; ctx.globalAlpha = 0.8;
              ctx.fillRect(x1, 0, 60, 720);
            }
            // Pulsing circles
            for (let i = 0; i < 5; i++) {
              const cx = 200 + i * 220; const cy = 360;
              const pulse = (Math.sin(t * 3 + i * 1.2) + 1) / 2;
              ctx.beginPath(); ctx.arc(cx, cy, 30 + pulse * 50, 0, Math.PI * 2);
              ctx.strokeStyle = neonColors[i]; ctx.lineWidth = 2;
              ctx.globalAlpha = pulse * 0.6; ctx.stroke();
            }

          } else if (themeType === 'mehndi') {
            // 🪔 Diya lamps + mandala patterns
            diyas.forEach((d) => {
              const flicker = 0.8 + Math.sin(t * 8 + d.phase) * 0.2;
              // Diya body (teardrop)
              ctx.beginPath();
              ctx.ellipse(d.x, d.y + 12, 18, 10, 0, 0, Math.PI * 2);
              ctx.fillStyle = '#b45309'; ctx.globalAlpha = 0.8; ctx.fill();
              // Flame
              const flamGrad = ctx.createRadialGradient(d.x, d.y, 2, d.x, d.y - 8, 20);
              flamGrad.addColorStop(0, '#fef08a');
              flamGrad.addColorStop(0.4, '#fb923c');
              flamGrad.addColorStop(1, 'rgba(251,146,60,0)');
              ctx.fillStyle = flamGrad; ctx.globalAlpha = flicker;
              ctx.beginPath(); ctx.ellipse(d.x, d.y - 6, 8 * flicker, 18 * flicker, 0, 0, Math.PI * 2); ctx.fill();
              // Glow
              const glowR = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, 60);
              glowR.addColorStop(0, 'rgba(251,191,36,0.3)');
              glowR.addColorStop(1, 'rgba(251,191,36,0)');
              ctx.fillStyle = glowR; ctx.globalAlpha = 1;
              ctx.beginPath(); ctx.arc(d.x, d.y, 60, 0, Math.PI * 2); ctx.fill();
            });
            // Mandala ornaments (geometric rings)
            [[640, 360], [160, 130], [1120, 590]].forEach(([mx, my], mi) => {
              const rot = t * 0.3 + mi * Math.PI / 3;
              for (let ring = 1; ring <= 4; ring++) {
                const r = ring * 25;
                ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI * 2);
                ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 1;
                ctx.globalAlpha = 0.15 * (5 - ring); ctx.stroke();
                // Spokes
                for (let sp = 0; sp < 8; sp++) {
                  const angle = (sp / 8) * Math.PI * 2 + rot;
                  ctx.beginPath();
                  ctx.moveTo(mx + Math.cos(angle) * (r - 25), my + Math.sin(angle) * (r - 25));
                  ctx.lineTo(mx + Math.cos(angle) * r, my + Math.sin(angle) * r);
                  ctx.stroke();
                }
              }
            });

          } else if (themeType === 'nature') {
            // 🌿 Falling leaves + vines
            leaves.forEach((l) => {
              l.y += l.vy; l.angle += 0.015;
              if (l.y > 740) l.y = -20;
              ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.angle);
              ctx.fillStyle = l.color; ctx.globalAlpha = 0.7;
              ctx.beginPath();
              ctx.moveTo(0, -l.size); ctx.quadraticCurveTo(l.size * 0.6, 0, 0, l.size);
              ctx.quadraticCurveTo(-l.size * 0.6, 0, 0, -l.size);
              ctx.fill();
              ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
              ctx.beginPath(); ctx.moveTo(0, -l.size); ctx.lineTo(0, l.size); ctx.stroke();
              ctx.restore();
            });
            // Background tree silhouettes
            [[80, 720], [200, 720], [1080, 720], [1200, 720]].forEach(([tx, ty], i) => {
              ctx.fillStyle = '#052e16'; ctx.globalAlpha = 0.4;
              ctx.fillRect(tx - 8, ty - 200 - i * 30, 16, 200 + i * 30);
              ctx.beginPath();
              ctx.arc(tx, ty - 200 - i * 30, 50 + i * 15, 0, Math.PI * 2);
              ctx.fill();
            });

          } else if (themeType === 'ocean') {
            // 🌊 Waves + rising bubbles
            for (let w = 0; w < 4; w++) {
              const waveY = 400 + w * 80;
              const amp = 20 - w * 3;
              ctx.beginPath(); ctx.moveTo(0, waveY);
              for (let wx = 0; wx <= 1280; wx += 8) {
                ctx.lineTo(wx, waveY + Math.sin((wx / 120) + t * 2 + w * 0.8) * amp);
              }
              ctx.lineTo(1280, 720); ctx.lineTo(0, 720); ctx.closePath();
              ctx.fillStyle = `rgba(14, 165, 233, ${0.08 + w * 0.04})`;
              ctx.globalAlpha = 1; ctx.fill();
            }
            bubbles.forEach((b) => {
              b.y += b.vy;
              if (b.y < -20) b.y = 730;
              ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
              ctx.strokeStyle = '#bae6fd'; ctx.lineWidth = 1.5;
              ctx.globalAlpha = b.alpha * 0.7; ctx.stroke();
            });

          } else {
            // ✨ Default: animated sparkles
            stars.slice(0, 80).forEach((s) => {
              const twinkle = (Math.sin(t * 2 + s.phase) + 1) / 2;
              ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
              ctx.fillStyle = palette.particle; ctx.globalAlpha = twinkle * 0.7; ctx.fill();
            });
          }

          ctx.restore();
          ctx.globalAlpha = 1;

          // Decorative double border
          ctx.strokeStyle = palette.accent;
          ctx.lineWidth = 3; ctx.globalAlpha = 0.35;
          ctx.strokeRect(20, 20, 1240, 680);
          ctx.lineWidth = 1; ctx.globalAlpha = 0.15;
          ctx.strokeRect(32, 32, 1216, 656);
          ctx.globalAlpha = 1;
        };

        // ── 7. Helper: draw text with outline ──
        const drawText = (text: string, x: number, y: number, font: string, color: string, maxWidth = 1100) => {
          ctx.font = font;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 15;
          ctx.fillStyle = color;
          ctx.fillText(text, x, y, maxWidth);
          ctx.shadowBlur = 0;
        };

        // ── 8. Main animation loop ──
        const animate = () => {
          const elapsed = Date.now() - startTime;

          if (elapsed >= totalDuration) {
            cancelAnimationFrame(animId);
            setTimeout(() => mediaRecorder.stop(), 200);
            return;
          }

          const slideIdx = Math.floor(elapsed / slideDuration);
          const slideProgress = (elapsed % slideDuration) / slideDuration;
          const slide = slides[Math.min(slideIdx, slides.length - 1)];

          // Fade alpha
          let alpha = 1;
          if (slideProgress < 0.12) alpha = slideProgress / 0.12;
          else if (slideProgress > 0.88) alpha = (1 - slideProgress) / 0.12;

          ctx.clearRect(0, 0, 1280, 720);
          frameCount++;
          drawBackground(elapsed / 1000);

          ctx.globalAlpha = alpha;

          if (slide.type === 'photo' && slide.image) {
            // Photo slide: centered with elegant border
            const imgScale = Math.min(860 / slide.image.width, 520 / slide.image.height);
            const iw = slide.image.width * imgScale;
            const ih = slide.image.height * imgScale;
            const ix = (1280 - iw) / 2;
            const iy = 100;
            // White shadow frame
            ctx.shadowColor = palette.accent;
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(ix - 8, iy - 8, iw + 16, ih + 16);
            ctx.shadowBlur = 0;
            ctx.drawImage(slide.image, ix, iy, iw, ih);
            // Caption bar
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, 640, 1280, 80);
            drawText(slide.title, 640, 680, 'bold 32px Georgia, serif', palette.accent);
          } else {
            // Text slide
            const centerY = slide.type === 'intro' ? 320 : 360;

            // Decorative horizontal rule
            ctx.strokeStyle = palette.accent;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = alpha * 0.5;
            ctx.beginPath(); ctx.moveTo(200, centerY - 80); ctx.lineTo(1080, centerY - 80); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(200, centerY + 60); ctx.lineTo(1080, centerY + 60); ctx.stroke();
            ctx.globalAlpha = alpha;

            // Title
            if (slide.type === 'intro') {
              drawText('✦  YOU ARE CORDIALLY INVITED  ✦', 640, centerY - 120, `bold 28px Georgia, serif`, palette.accent);
              drawText(slide.title, 640, centerY, `bold 72px Georgia, serif`, palette.text);
            } else if (slide.type === 'outro') {
              drawText(slide.title, 640, centerY, `bold 48px Georgia, serif`, palette.accent);
              drawText(data.eventName || '', 640, centerY + 80, `italic 32px Georgia, serif`, palette.sub);
            } else {
              drawText(slide.title, 640, centerY - 50, `bold 36px Georgia, serif`, palette.sub);
              if (slide.body) {
                const lines = slide.body.split('\n');
                lines.forEach((line, i) => {
                  drawText(line, 640, centerY + 30 + i * 70, `bold 54px Georgia, serif`, palette.text);
                });
              }
            }
          }

          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;

          animId = requestAnimationFrame(animate);
        };

        animate();

      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/invitations"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Invitations
          </Link>
          <h1 className="text-4xl font-bold mb-2">🎬 Create Video Invitation</h1>
          <p className="text-blue-100">
            {step === 1 && 'Choose a video template or create custom'}
            {step === 2 && 'Customize your video invitation'}
            {step === 3 && 'Your video invitation is ready!'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="font-semibold">Choose</span>
            </div>
            <div className="w-16 h-1 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="font-semibold">Customize</span>
            </div>
            <div className="w-16 h-1 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="font-semibold">Generate</span>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Template */}
        {step === 1 && (
          <div>
            {/* Event Type Selector */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Event Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['birthday', 'wedding', 'anniversary', 'corporate'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, eventType: type })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.eventType === type
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">
                      {type === 'birthday' && '🎂'}
                      {type === 'wedding' && '💍'}
                      {type === 'anniversary' && '💐'}
                      {type === 'corporate' && '🏢'}
                    </div>
                    <div className="font-semibold capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Video Template</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin text-4xl mb-4">⏳</div>
                  <p className="text-gray-600">Loading templates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* Custom Option */}
                  <button
                    onClick={() => {
                      setSelectedTemplate(null);
                      setStep(2);
                    }}
                    className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 hover:shadow-xl transition-all border-2 border-dashed border-blue-300"
                  >
                    <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <div className="font-bold text-gray-900">Custom Video</div>
                    <div className="text-sm text-gray-600 mt-1">AI Powered</div>
                  </button>

                  {/* Templates */}
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setStep(2);
                      }}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={template.thumbnail_url}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Video className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {template.name}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 capitalize">{template.style}</span>
                          {template.is_premium && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Customize */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Show selected template info if template was chosen */}
              {selectedTemplate && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <img
                        src={selectedTemplate.thumbnail_url}
                        alt={selectedTemplate.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{selectedTemplate.style} style</p>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Customize Your Video Invitation
              </h2>

              <div className="space-y-6">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    placeholder="e.g., Sarah's 25th Birthday"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* From Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From (Host/Sender Name) *
                  </label>
                  <input
                    type="text"
                    value={formData.fromName}
                    onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                    placeholder="e.g., John & Jane"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* To Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    To (Guest/Recipient Name)
                  </label>
                  <input
                    type="text"
                    value={formData.toName}
                    onChange={(e) => setFormData({ ...formData, toName: e.target.value })}
                    placeholder="e.g., Dear Friends & Family"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g., Join us for an evening of celebration..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Theme Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Theme & Background Decoration Style
                  </label>
                  <input
                    type="text"
                    value={formData.themeDescription}
                    onChange={(e) => setFormData({ ...formData, themeDescription: e.target.value })}
                    placeholder="e.g., Fairytale castle background, floral theme, vintage neon lights, disco party"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Photos <span className="font-normal text-gray-500">(Optional — add your own photos for a personal slideshow)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="video-photo-upload"
                    />
                    <label htmlFor="video-photo-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-gray-600">
                        Click to upload your photos (optional, max 10)
                        {formData.photos.length > 0 && (
                          <div className="font-semibold mt-2 text-green-600">
                            ✅ {formData.photos.length} photo(s) selected — personal slideshow will be created!
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Without photos, a beautiful themed video loop will be generated for your event type.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={generateVideo}
                    disabled={
                      !formData.eventName ||
                      !formData.fromName ||
                      !formData.date ||
                      !formData.time ||
                      !formData.venue ||
                      generating
                    }
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin">⏳</div>
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        {formData.photos.length > 0 ? 'Generate Slideshow Video' : 'Generate Themed Video'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generated Video */}
        {step === 3 && generatedVideo && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🎉 Your Video Invitation is Ready!
              </h2>

              {/* Generated Video Preview */}
              <div className="mb-8">
                <div className="border-4 border-blue-200 rounded-xl overflow-hidden bg-black">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23667eea'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle'%3E▶️ Click to Play%3C/text%3E%3C/svg%3E"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Edit Details
                </button>
                <a
                  href={generatedVideo}
                  download
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Video
                </a>
                <button
                  onClick={() => router.push('/invitations')}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateVideoInvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateVideoInvitationContent />
    </Suspense>
  );
}
