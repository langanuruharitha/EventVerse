import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventType,
      eventName,
      fromName,
      toName,
      date,
      time,
      venue,
      message,
      colorScheme,
      style,
      includeRSVP,
      themeDescription
    } = body;

    if (!eventName || !fromName || !date || !time || !venue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Generate AI creative text using Gemini
    const aiText = await generateWithGemini(eventType, eventName, fromName, themeDescription, message);

    // Generate beautiful HTML card
    const htmlContent = buildBeautifulCard({
      eventType, eventName, fromName, toName,
      formattedDate, time, venue,
      aiGreeting: aiText.greeting,
      aiMessage: aiText.message,
      colorScheme: 'purple',
      style: style || 'elegant',
      includeRSVP: !!includeRSVP,
      themeDescription: themeDescription || ''
    });

    return NextResponse.json({ success: true, htmlContent });

  } catch (error) {
    console.error('Error generating invitation card:', error);
    return NextResponse.json({ error: 'Failed to generate invitation card' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// Gemini AI text generation
// ─────────────────────────────────────────────
async function generateWithGemini(eventType: string, eventName: string, fromName: string, theme: string, extra: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return fallbackText(eventType, theme);

  try {
    const prompt = `You are a creative invitation card writer. Based on these details, write beautiful invitation text:
Event: ${eventType} | Name: ${eventName} | Host: ${fromName}
Theme/Style: ${theme || 'elegant celebration'}
${extra ? `Extra context: ${extra}` : ''}

Write:
1. A short poetic greeting line (NOT "You are cordially invited" - be unique and creative)
2. A heartfelt message (2-3 sentences, evocative and warm, matching the theme)

Return ONLY valid JSON:
{"greeting": "...", "message": "..."}`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.95,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!resp.ok) throw new Error(`Gemini error: ${resp.status}`);
    const json = await resp.json();
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return { greeting: parsed.greeting || '', message: parsed.message || '' };
    }
    throw new Error('No JSON in Gemini response');
  } catch (err) {
    console.warn('Gemini failed, using fallback:', err);
    return fallbackText(eventType, theme);
  }
}

function fallbackText(eventType: string, theme: string) {
  const t = (theme || '').toLowerCase();
  const greetings: Record<string, string> = {
    birthday: t.includes('elegant') ? 'Your presence graces our celebration' : 'Come celebrate with us!',
    wedding: 'Two hearts, one beautiful journey begins',
    anniversary: 'Love grows deeper with every passing year',
    corporate: 'We warmly request your esteemed presence'
  };
  const messages: Record<string, string> = {
    birthday: t.includes('floral') || t.includes('flower')
      ? 'Among blooms and laughter, we gather to celebrate another beautiful year of life. Your presence will make this occasion bloom with joy.'
      : 'Another year, another reason to come together and celebrate. Your laughter and love make every moment unforgettable.',
    wedding: 'With hearts full of love, we begin our forever. Join us as we exchange vows and step into a beautiful new chapter together.',
    anniversary: 'Years of love, laughter, and cherished memories. Join us as we celebrate the beautiful journey that continues to inspire us.',
    corporate: 'We look forward to celebrating our shared achievements and the exciting journey ahead. Your presence will make this occasion truly memorable.'
  };
  return {
    greeting: greetings[eventType] || 'Join us in celebration',
    message: messages[eventType] || 'Your presence will make this occasion truly special and unforgettable.'
  };
}

// ─────────────────────────────────────────────
// Beautiful HTML card builder
// ─────────────────────────────────────────────
function buildBeautifulCard(data: {
  eventType: string; eventName: string; fromName: string; toName?: string;
  formattedDate: string; time: string; venue: string;
  aiGreeting: string; aiMessage: string;
  colorScheme: string; style: string; includeRSVP: boolean; themeDescription: string;
}): string {
  const colors: Record<string, { primary: string; secondary: string; light: string; bg: string; gradient: string }> = {
    purple: { primary: '#7c3aed', secondary: '#a855f7', light: '#f3e8ff', bg: '#faf5ff', gradient: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)' },
    blue:   { primary: '#1d4ed8', secondary: '#3b82f6', light: '#dbeafe', bg: '#eff6ff', gradient: 'linear-gradient(135deg, #1d4ed8, #3b82f6, #06b6d4)' },
    pink:   { primary: '#be185d', secondary: '#ec4899', light: '#fce7f3', bg: '#fdf2f8', gradient: 'linear-gradient(135deg, #be185d, #ec4899, #f97316)' },
    gold:   { primary: '#92400e', secondary: '#d97706', light: '#fde68a', bg: '#fffbeb', gradient: 'linear-gradient(135deg, #92400e, #d97706, #f59e0b)' },
    green:  { primary: '#065f46', secondary: '#10b981', light: '#d1fae5', bg: '#f0fdf4', gradient: 'linear-gradient(135deg, #065f46, #10b981, #34d399)' },
    red:    { primary: '#991b1b', secondary: '#ef4444', light: '#fee2e2', bg: '#fff5f5', gradient: 'linear-gradient(135deg, #991b1b, #ef4444, #f97316)' },
  };
  const c = colors[data.colorScheme] || colors.purple;

  // Event-type decorative header icons (using pure CSS/unicode, NO emoji)
  const headerSVG: Record<string, string> = {
    birthday: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="${c.light}" stroke="${c.secondary}" stroke-width="2"/>
      <rect x="25" y="44" width="30" height="22" rx="3" fill="${c.secondary}"/>
      <rect x="28" y="44" width="24" height="22" rx="2" fill="${c.primary}" opacity="0.8"/>
      <line x1="35" y1="44" x2="35" y2="66" stroke="${c.light}" stroke-width="1.5" opacity="0.5"/>
      <line x1="45" y1="44" x2="45" y2="66" stroke="${c.light}" stroke-width="1.5" opacity="0.5"/>
      <rect x="28" y="38" width="5" height="8" rx="1" fill="${c.primary}"/>
      <rect x="37" y="36" width="5" height="10" rx="1" fill="${c.secondary}"/>
      <rect x="46" y="38" width="5" height="8" rx="1" fill="${c.primary}"/>
      <circle cx="30" cy="36" r="2" fill="${c.gradient.includes('f59e0b') ? '#fbbf24' : '#fcd34d'}"/>
      <circle cx="39" cy="34" r="2" fill="#fbbf24"/>
      <circle cx="48" cy="36" r="2" fill="#fcd34d"/>
    </svg>`,
    wedding: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="${c.light}" stroke="${c.secondary}" stroke-width="2"/>
      <circle cx="40" cy="40" r="18" fill="none" stroke="${c.primary}" stroke-width="3"/>
      <circle cx="40" cy="40" r="12" fill="none" stroke="${c.secondary}" stroke-width="2"/>
      <circle cx="40" cy="40" r="5" fill="${c.primary}"/>
      <circle cx="40" cy="22" r="4" fill="${c.secondary}"/>
      <line x1="40" y1="26" x2="40" y2="35" stroke="${c.secondary}" stroke-width="1.5"/>
    </svg>`,
    anniversary: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="${c.light}" stroke="${c.secondary}" stroke-width="2"/>
      <path d="M40 54 C40 54 20 44 20 30 C20 22 28 18 34 22 C37 24 40 28 40 28 C40 28 43 24 46 22 C52 18 60 22 60 30 C60 44 40 54 40 54Z" fill="${c.secondary}" opacity="0.8"/>
      <path d="M40 50 C40 50 24 41 24 29 C24 23 31 20 36 24 C38 26 40 29 40 29" fill="${c.primary}" opacity="0.6"/>
    </svg>`,
    corporate: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="${c.light}" stroke="${c.secondary}" stroke-width="2"/>
      <rect x="22" y="26" width="36" height="28" rx="3" fill="${c.primary}" opacity="0.9"/>
      <rect x="25" y="29" width="30" height="4" fill="${c.light}" opacity="0.6"/>
      <rect x="25" y="37" width="20" height="3" fill="${c.light}" opacity="0.4"/>
      <rect x="25" y="43" width="25" height="3" fill="${c.light}" opacity="0.4"/>
      <rect x="25" y="49" width="15" height="3" fill="${c.light}" opacity="0.4"/>
    </svg>`
  };

  // Theme-based CSS background pattern
  const themeLC = (data.themeDescription || '').toLowerCase();
  let bgPattern = '';
  let cardBg = `background: linear-gradient(160deg, ${c.bg} 0%, white 40%, ${c.light} 100%);`;

  if (themeLC.includes('floral') || themeLC.includes('flower') || themeLC.includes('rose')) {
    bgPattern = `
      .card::after {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 120px 80px at 5% 10%, ${c.light} 0%, transparent 70%),
          radial-gradient(ellipse 100px 60px at 95% 5%, ${c.light} 0%, transparent 70%),
          radial-gradient(ellipse 80px 120px at 8% 90%, ${c.light} 0%, transparent 70%),
          radial-gradient(ellipse 100px 80px at 92% 88%, ${c.light} 0%, transparent 70%);
        pointer-events: none;
        border-radius: 20px;
      }`;
    cardBg = `background: linear-gradient(to bottom right, white, ${c.bg}, white);`;
  } else if (themeLC.includes('elegant') || themeLC.includes('luxury') || themeLC.includes('royal')) {
    bgPattern = `
      .card::after {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          45deg, transparent, transparent 60px,
          ${c.light}30 60px, ${c.light}30 62px
        );
        pointer-events: none;
        border-radius: 20px;
      }`;
  } else if (themeLC.includes('star') || themeLC.includes('night') || themeLC.includes('sparkle')) {
    bgPattern = `
      .card::after {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(2px 2px at 20% 30%, ${c.secondary}60 0%, transparent 100%),
          radial-gradient(2px 2px at 60% 15%, ${c.secondary}50 0%, transparent 100%),
          radial-gradient(2px 2px at 80% 40%, ${c.secondary}60 0%, transparent 100%),
          radial-gradient(2px 2px at 35% 70%, ${c.secondary}50 0%, transparent 100%),
          radial-gradient(2px 2px at 70% 75%, ${c.secondary}60 0%, transparent 100%),
          radial-gradient(2px 2px at 15% 80%, ${c.secondary}50 0%, transparent 100%);
        pointer-events: none;
        border-radius: 20px;
      }`;
  } else if (themeLC.includes('balloon') || themeLC.includes('party') || themeLC.includes('confetti')) {
    bgPattern = `
      .card::after {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle 60px at 10% 20%, ${c.light} 0%, transparent 80%),
          radial-gradient(circle 50px at 85% 15%, ${c.secondary}30 0%, transparent 80%),
          radial-gradient(circle 70px at 20% 75%, ${c.light} 0%, transparent 80%),
          radial-gradient(circle 55px at 80% 70%, ${c.secondary}30 0%, transparent 80%);
        pointer-events: none;
        border-radius: 20px;
      }`;
  }

  // Style-specific font
  const fontUrl = data.style === 'traditional'
    ? 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:ital,wght@0,300;0,400;1,300&display=swap'
    : data.style === 'modern'
    ? 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap'
    : 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap';

  const fontFamily = data.style === 'traditional'
    ? "'Cinzel', 'Georgia', serif"
    : data.style === 'modern'
    ? "'Outfit', 'Segoe UI', sans-serif"
    : "'Cormorant Garamond', 'Georgia', serif";

  const bodyFont = data.style === 'modern'
    ? "'Outfit', 'Segoe UI', sans-serif"
    : "'Lato', 'Georgia', serif";

  const e = (s: string) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="${fontUrl}" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: ${bodyFont};
    background: ${c.bg};
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px;
  }
  .wrapper { max-width: 640px; width: 100%; }
  .card {
    position: relative;
    ${cardBg}
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
    overflow: hidden;
  }
  ${bgPattern}

  /* Gradient header strip */
  .header-strip {
    height: 10px;
    background: ${c.gradient};
    border-radius: 20px 20px 0 0;
  }

  /* Decorative border frame */
  .frame {
    position: absolute;
    top: 20px; left: 20px; right: 20px; bottom: 20px;
    border: 1px solid ${c.secondary}50;
    border-radius: 14px;
    pointer-events: none;
    z-index: 2;
  }
  .frame::before {
    content: '';
    position: absolute;
    top: 6px; left: 6px; right: 6px; bottom: 6px;
    border: 1px dashed ${c.secondary}30;
    border-radius: 10px;
  }

  /* Corner ornaments */
  .corner {
    position: absolute;
    width: 40px; height: 40px;
    border-color: ${c.secondary};
    z-index: 3;
  }
  .corner-tl { top: 28px; left: 28px; border-top: 2px solid; border-left: 2px solid; border-radius: 6px 0 0 0; }
  .corner-tr { top: 28px; right: 28px; border-top: 2px solid; border-right: 2px solid; border-radius: 0 6px 0 0; }
  .corner-bl { bottom: 28px; left: 28px; border-bottom: 2px solid; border-left: 2px solid; border-radius: 0 0 0 6px; }
  .corner-br { bottom: 28px; right: 28px; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0 0 6px 0; }

  .content { position: relative; z-index: 4; padding: 50px 56px 50px; }

  /* Icon */
  .icon-wrap { text-align: center; margin-bottom: 24px; }

  /* Greeting */
  .greeting {
    font-family: ${fontFamily};
    font-size: 15px;
    color: ${c.primary};
    text-align: center;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: ${data.style === 'traditional' ? '600' : '400'};
    margin-bottom: 18px;
    opacity: 0.85;
  }

  /* Event name */
  .event-name {
    font-family: ${fontFamily};
    font-size: 40px;
    font-weight: 700;
    color: ${c.primary};
    text-align: center;
    line-height: 1.15;
    margin-bottom: 8px;
    letter-spacing: ${data.style === 'modern' ? '0' : '1px'};
  }

  /* Host */
  .host {
    font-family: ${bodyFont};
    font-size: 16px;
    color: #6b7280;
    text-align: center;
    font-style: italic;
    margin-bottom: 10px;
  }

  /* To name */
  .to-name {
    font-family: ${fontFamily};
    font-size: 18px;
    font-weight: 600;
    color: ${c.secondary};
    text-align: center;
    margin-bottom: 8px;
  }

  /* Ornamental divider */
  .divider {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; margin: 28px 0;
  }
  .divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, ${c.secondary}80, transparent); }
  .divider-diamond {
    width: 10px; height: 10px;
    background: ${c.secondary};
    transform: rotate(45deg);
  }
  .divider-dot { width: 5px; height: 5px; background: ${c.secondary}60; transform: rotate(45deg); }

  /* Details panel */
  .details-panel {
    background: white;
    border: 1px solid ${c.light};
    border-radius: 14px;
    padding: 24px 28px;
    margin: 20px 0;
    box-shadow: 0 2px 12px ${c.secondary}15;
  }
  .details-grid {
    display: grid; grid-template-columns: 1fr 1px 1fr; gap: 0; align-items: start;
  }
  .detail-col { padding: 0 20px; }
  .detail-col:first-child { padding-left: 0; }
  .detail-col:last-child { padding-right: 0; }
  .detail-separator { background: ${c.light}; width: 1px; }
  .detail-label {
    font-family: ${fontFamily};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: ${c.primary};
    margin-bottom: 6px;
    display: block;
  }
  .detail-value {
    font-family: ${bodyFont};
    font-size: 15px;
    color: #374151;
    font-weight: 500;
    line-height: 1.4;
  }
  .time-large {
    font-family: ${fontFamily};
    font-size: 26px;
    font-weight: 700;
    color: ${c.primary};
  }

  /* Message */
  .message {
    font-family: ${bodyFont};
    font-size: 15px;
    color: #4b5563;
    text-align: center;
    line-height: 1.85;
    font-style: italic;
    padding: 0 16px;
    margin: 8px 0;
  }

  /* RSVP */
  .rsvp {
    background: ${c.light};
    border: 1px solid ${c.secondary}50;
    border-radius: 50px;
    padding: 12px 36px;
    text-align: center;
    margin: 28px auto 0;
    max-width: 300px;
  }
  .rsvp-label {
    font-family: ${fontFamily};
    font-size: 11px;
    letter-spacing: 3px;
    font-weight: 700;
    color: ${c.primary};
    text-transform: uppercase;
  }
  .rsvp-sub {
    font-family: ${bodyFont};
    font-size: 12px;
    color: #6b7280;
    margin-top: 3px;
  }

  /* Bottom gradient strip */
  .footer-strip {
    height: 8px;
    background: ${c.gradient};
    opacity: 0.6;
    border-radius: 0 0 20px 20px;
  }
  .footer-brand {
    text-align: center;
    font-family: ${bodyFont};
    font-size: 10px;
    letter-spacing: 2px;
    color: #9ca3af;
    padding: 14px 0 20px;
    text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header-strip"></div>
    <div class="frame"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="content">
      <div class="icon-wrap">
        ${headerSVG[data.eventType] || headerSVG.birthday}
      </div>

      <div class="greeting">${e(data.aiGreeting)}</div>
      <div class="event-name">${e(data.eventName)}</div>
      <div class="host">Hosted by ${e(data.fromName)}</div>
      ${data.toName ? `<div class="to-name">Honouring ${e(data.toName)}</div>` : ''}

      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-dot"></div>
        <div class="divider-diamond"></div>
        <div class="divider-dot"></div>
        <div class="divider-line"></div>
      </div>

      <div class="details-panel">
        <div class="details-grid">
          <div class="detail-col">
            <span class="detail-label">Date &amp; Time</span>
            <div class="detail-value">${e(data.formattedDate)}</div>
            <div class="time-large" style="margin-top:8px">${e(data.time)}</div>
          </div>
          <div class="detail-separator"></div>
          <div class="detail-col">
            <span class="detail-label">Venue</span>
            <div class="detail-value">${e(data.venue)}</div>
          </div>
        </div>
      </div>

      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-dot"></div>
        <div class="divider-diamond"></div>
        <div class="divider-dot"></div>
        <div class="divider-line"></div>
      </div>

      ${data.aiMessage ? `<div class="message">"${e(data.aiMessage)}"</div>` : ''}

      ${data.includeRSVP ? `
      <div class="rsvp">
        <div class="rsvp-label">RSVP</div>
        <div class="rsvp-sub">Kindly confirm your attendance via EventVerse</div>
      </div>` : ''}
    </div>

    <div class="footer-brand">Created with EventVerse AI Studio</div>
    <div class="footer-strip"></div>
  </div>
</div>
</body>
</html>`;
}
