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

    const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    let htmlContent = '';

    if (key) {
      try {
        console.log('Generating custom theme card with Gemini...');
        htmlContent = await generateCardWithGemini({
          eventType,
          eventName,
          fromName,
          toName,
          formattedDate,
          time,
          venue,
          message,
          style: style || 'elegant',
          includeRSVP: !!includeRSVP,
          themeDescription: themeDescription || '',
          key
        });
      } catch (err) {
        console.error('Gemini card generation failed, using fallback:', err);
      }
    }

    // Fallback if Gemini key is missing or failed
    if (!htmlContent) {
      console.log('Using local fallback card generator...');
      htmlContent = buildFallbackCard({
        eventType,
        eventName,
        fromName,
        toName,
        formattedDate,
        time,
        venue,
        message,
        style: style || 'elegant',
        includeRSVP: !!includeRSVP,
        themeDescription: themeDescription || ''
      });
    }

    return NextResponse.json({ success: true, htmlContent });

  } catch (error) {
    console.error('Error generating invitation card:', error);
    return NextResponse.json({ error: 'Failed to generate invitation card' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// Gemini AI Card Generator (Generates entire HTML/CSS)
// ─────────────────────────────────────────────
async function generateCardWithGemini(data: {
  eventType: string;
  eventName: string;
  fromName: string;
  toName?: string;
  formattedDate: string;
  time: string;
  venue: string;
  message?: string;
  style: string;
  includeRSVP: boolean;
  themeDescription: string;
  key: string;
}): Promise<string> {
  const prompt = `You are a world-class invitation card designer and professional front-end developer.
Your task is to design a complete, premium, self-contained HTML invitation card based on these details:
- Event Type: ${data.eventType}
- Event Name: ${data.eventName}
- Host Name: ${data.fromName}
${data.toName ? `- Guest Name: ${data.toName}` : ''}
- Date: ${data.formattedDate}
- Time: ${data.time}
- Venue: ${data.venue}
- Style Preference: ${data.style}
- USER'S EXACT THEME REQUEST: "${data.themeDescription}"
${data.message ? `- Additional Message: ${data.message}` : ''}
- Include RSVP Section: ${data.includeRSVP ? 'Yes' : 'No'}

CRITICAL INSTRUCTION - THEME COMPLIANCE IS MANDATORY:
You must strictly follow the USER'S EXACT THEME REQUEST ("${data.themeDescription}"). 
- If they ask for "ocean theme", you MUST use ocean blues, water-like gradients, and include pure CSS/SVG elements like waves, seashells, or bubbles.
- If they ask for "balloon falling theme", you MUST create beautiful CSS-animated balloons falling from the top of the card.
- If they ask for "floral theme", you MUST include elegant CSS/SVG flowers, vines, or petals.
- Do NOT output a generic card. The entire card's background, colors, borders, and decorative SVG elements must perfectly embody the requested theme.

DESIGN REQUIREMENTS:
1. Background & Colors: Use stunning, premium CSS gradients or patterns that perfectly match the requested theme.
2. Fonts: Load premium Google Fonts (e.g. Cinzel, Great Vibes, Outfit, Cormorant Garamond, Playfair Display) that fit the style.
3. Decorations & Animations: You MUST write custom CSS and inline SVGs to decorate the card according to the theme. Include smooth, elegant CSS animations (like falling balloons, floating petals, pulsing stars, gently swaying flowers, floating bubbles) if it fits the theme. DO NOT use generic placeholders or external images.
4. Layout: The card must be centered, responsive, with a premium look (box-shadows, rounded corners, glassmorphism if applicable).
5. Content: Write unique, creative, poetic invitation greetings and messages matching the theme.

Output ONLY the raw HTML code of the invitation card. Start directly with <!DOCTYPE html> and end with </html>. Do not include markdown block syntax like \`\`\`html.`;

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${data.key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 8192
        }
      })
    }
  );

  if (!resp.ok) throw new Error(`Gemini error: ${resp.status}`);
  const json = await resp.json();
  let raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // Clean markdown block wrappers if present
  raw = raw.trim();
  if (raw.startsWith('```html')) {
    raw = raw.substring(7);
  } else if (raw.startsWith('```')) {
    raw = raw.substring(3);
  }
  if (raw.endsWith('```')) {
    raw = raw.substring(0, raw.length - 3);
  }
  raw = raw.trim();

  if (raw.startsWith('<!DOCTYPE') || raw.includes('<html')) {
    return raw;
  }
  
  throw new Error('Response did not contain valid HTML');
}

// ─────────────────────────────────────────────
// Fallback card builder (if Gemini key is missing or fails)
// ─────────────────────────────────────────────
function buildFallbackCard(data: {
  eventType: string; eventName: string; fromName: string; toName?: string;
  formattedDate: string; time: string; venue: string; message?: string;
  style: string; includeRSVP: boolean; themeDescription: string;
}): string {
  const desc = (data.themeDescription || '').toLowerCase();
  
  // 1. Determine theme color/design flags
  const isSpace = desc.includes('space') || desc.includes('sky') || desc.includes('night') || desc.includes('galaxy') || desc.includes('dark');
  const isPink = desc.includes('pink') || desc.includes('rose') || desc.includes('peach');
  const isBrown = desc.includes('brown');
  const isTraditional = desc.includes('traditional') || desc.includes('gold') || desc.includes('wedding') || desc.includes('marigold');
  const hasBalloons = desc.includes('balloon') || desc.includes('balloons');
  const hasRosePetals = desc.includes('rose petal') || desc.includes('rose petals') || desc.includes('petal') || desc.includes('petals');

  // 2. Select fonts based on style
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
    : "'Lato', sans-serif";

  // 3. Build Dynamic CSS Customizations
  let bodyBg = 'radial-gradient(circle, #f3e8ff 0%, #e9d5ff 100%)';
  let cardBg = '#ffffff';
  let textColor = '#1e1b4b';
  let subTextColor = '#6b7280';
  let primaryColor = '#7c3aed';
  let secondaryColor = '#a855f7';
  let panelBg = '#faf5ff';
  let panelBorder = '#f3e8ff';
  let frameBorder = 'rgba(168, 85, 247, 0.3)';
  let headerGradient = 'linear-gradient(135deg, #7c3aed, #ec4899)';

  if (isSpace) {
    bodyBg = 'radial-gradient(circle at center, #0b0f19 0%, #030712 100%)';
    cardBg = 'rgba(17, 24, 39, 0.85)';
    textColor = '#f8fafc';
    subTextColor = '#94a3b8';
    primaryColor = '#38bdf8';
    secondaryColor = '#c084fc';
    panelBg = 'rgba(31, 41, 55, 0.5)';
    panelBorder = 'rgba(255, 255, 255, 0.1)';
    frameBorder = 'rgba(56, 189, 248, 0.3)';
    headerGradient = 'linear-gradient(135deg, #0284c7, #7c3aed)';
  } else if (isPink && isBrown) {
    bodyBg = 'linear-gradient(135deg, #dfc2b3 0%, #fce7f3 100%)';
    cardBg = '#ffffff';
    textColor = '#4a2c1f';
    subTextColor = '#7c5e53';
    primaryColor = '#b45309';
    secondaryColor = '#ec4899';
    panelBg = '#fdf2f8';
    panelBorder = '#fbcfe8';
    frameBorder = 'rgba(236, 72, 153, 0.3)';
    headerGradient = 'linear-gradient(135deg, #b45309, #ec4899)';
  } else if (isPink) {
    bodyBg = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
    cardBg = '#ffffff';
    textColor = '#be185d';
    subTextColor = '#86198f';
    primaryColor = '#be185d';
    secondaryColor = '#ec4899';
    panelBg = '#fdf2f8';
    panelBorder = '#fce7f3';
    frameBorder = 'rgba(236, 72, 153, 0.3)';
    headerGradient = 'linear-gradient(135deg, #be185d, #ec4899)';
  } else if (isTraditional || isBrown) {
    bodyBg = 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)';
    cardBg = '#ffffff';
    textColor = '#78350f';
    subTextColor = '#b45309';
    primaryColor = '#b45309';
    secondaryColor = '#d97706';
    panelBg = '#fffbeb';
    panelBorder = '#fde68a';
    frameBorder = 'rgba(217, 119, 6, 0.3)';
    headerGradient = 'linear-gradient(135deg, #b45309, #d97706)';
  }

  // 4. Generate Decorative SVG/CSS elements
  let decorativeOverlay = '';

  if (isSpace) {
    // Starry stars overlay
    decorativeOverlay += `
      <div style="position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden">
        <div style="position:absolute;top:10%;left:20%;width:3px;height:3px;background:white;border-radius:50%;box-shadow:0 0 10px white;animation:pulse 2s infinite"></div>
        <div style="position:absolute;top:30%;right:15%;width:2px;height:2px;background:white;border-radius:50%;animation:pulse 3s infinite"></div>
        <div style="position:absolute;bottom:20%;left:10%;width:3px;height:3px;background:white;border-radius:50%;box-shadow:0 0 8px white;animation:pulse 1.5s infinite"></div>
        <div style="position:absolute;bottom:40%;right:25%;width:2px;height:2px;background:white;border-radius:50%;animation:pulse 2.5s infinite"></div>
        <svg style="position:absolute;top:5%;right:8%;opacity:0.5" width="24" height="24" viewBox="0 0 24 24"><path fill="#fef08a" d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>
        <svg style="position:absolute;bottom:8%;left:25%;opacity:0.3" width="16" height="16" viewBox="0 0 24 24"><path fill="#fef08a" d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>
      </div>`;
  }

  if (hasBalloons) {
    decorativeOverlay += `
      <svg style="position:absolute;top:12px;left:12px;z-index:2;pointer-events:none" width="80" height="110" viewBox="0 0 90 130">
        <ellipse cx="25" cy="35" rx="13" ry="17" fill="#ef4444" opacity="0.85"/>
        <line x1="25" y1="52" x2="30" y2="90" stroke="#9ca3af" stroke-width="1"/>
        <ellipse cx="48" cy="25" rx="12" ry="16" fill="#f59e0b" opacity="0.85"/>
        <line x1="48" y1="41" x2="45" y2="90" stroke="#9ca3af" stroke-width="1"/>
        <ellipse cx="68" cy="38" rx="11" ry="15" fill="${primaryColor}" opacity="0.8"/>
        <line x1="68" y1="53" x2="55" y2="90" stroke="#9ca3af" stroke-width="1"/>
      </svg>
      <svg style="position:absolute;top:12px;right:12px;z-index:2;pointer-events:none" width="80" height="110" viewBox="0 0 90 130">
        <ellipse cx="25" cy="38" rx="12" ry="16" fill="#10b981" opacity="0.85"/>
        <line x1="25" y1="54" x2="35" y2="90" stroke="#9ca3af" stroke-width="1"/>
        <ellipse cx="48" cy="25" rx="13" ry="17" fill="#ec4899" opacity="0.85"/>
        <line x1="48" y1="42" x2="48" y2="90" stroke="#9ca3af" stroke-width="1"/>
        <ellipse cx="68" cy="35" rx="11" ry="15" fill="#3b82f6" opacity="0.8"/>
        <line x1="68" y1="50" x2="55" y2="90" stroke="#9ca3af" stroke-width="1"/>
      </svg>`;
  }

  if (hasRosePetals) {
    decorativeOverlay += `
      <div style="position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden">
        <!-- Pink rose petals scattered -->
        <svg style="position:absolute;top:15%;left:15%;transform:rotate(25deg);opacity:0.7" width="22" height="22" viewBox="0 0 100 100"><path d="M50 0 C20 30 20 60 50 100 C80 60 80 30 50 0 Z" fill="#ec4899"/></svg>
        <svg style="position:absolute;top:8%;right:28%;transform:rotate(-15deg);opacity:0.6" width="18" height="18" viewBox="0 0 100 100"><path d="M50 0 C20 30 20 60 50 100 C80 60 80 30 50 0 Z" fill="#f43f5e"/></svg>
        <svg style="position:absolute;bottom:12%;right:12%;transform:rotate(40deg);opacity:0.75" width="20" height="20" viewBox="0 0 100 100"><path d="M50 0 C20 30 20 60 50 100 C80 60 80 30 50 0 Z" fill="#db2777"/></svg>
        <svg style="position:absolute;bottom:25%;left:8%;transform:rotate(-45deg);opacity:0.5" width="24" height="24" viewBox="0 0 100 100"><path d="M50 0 C20 30 20 60 50 100 C80 60 80 30 50 0 Z" fill="#ec4899"/></svg>
      </div>`;
  }

  const e = (s: string) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="${fontUrl}" rel="stylesheet">
<style>
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: ${bodyFont};
    background: ${bodyBg};
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px;
    transition: background 0.3s ease;
  }
  .wrapper { max-width: 640px; width: 100%; }
  .card {
    position: relative;
    background: ${cardBg};
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 24px 80px rgba(0,0,0,0.25);
    overflow: hidden;
    color: ${textColor};
    ${isSpace ? 'backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15);' : ''}
  }
  .header-strip {
    height: 10px;
    background: ${headerGradient};
  }
  .frame {
    position: absolute;
    top: 20px; left: 20px; right: 20px; bottom: 20px;
    border: 1px solid ${frameBorder};
    border-radius: 14px;
    pointer-events: none;
    z-index: 2;
  }
  .content { position: relative; z-index: 4; padding: 50px 45px; }
  .greeting {
    font-family: ${fontFamily};
    font-size: 13px;
    color: ${secondaryColor};
    text-align: center;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 15px;
    font-weight: 600;
  }
  .event-name {
    font-family: ${fontFamily};
    font-size: 38px;
    font-weight: 700;
    color: ${primaryColor};
    text-align: center;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .host {
    font-size: 15px;
    color: ${subTextColor};
    text-align: center;
    font-style: italic;
    margin-bottom: 10px;
  }
  .divider {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; margin: 24px 0;
  }
  .divider-line { flex: 1; height: 1px; background: ${frameBorder}; }
  .details-panel {
    background: ${panelBg};
    border: 1px solid ${panelBorder};
    border-radius: 14px;
    padding: 22px;
    margin: 20px 0;
  }
  .details-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  }
  .detail-label {
    font-family: ${fontFamily};
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${primaryColor};
    margin-bottom: 6px;
    display: block;
    font-weight: 600;
  }
  .detail-value {
    font-size: 14px;
    color: ${textColor};
    line-height: 1.4;
  }
  .message {
    font-size: 14px;
    color: ${subTextColor};
    text-align: center;
    font-style: italic;
    margin-top: 15px;
    line-height: 1.6;
  }
  .rsvp {
    background: ${panelBg};
    border: 1.5px solid ${frameBorder};
    border-radius: 30px;
    padding: 10px 20px;
    text-align: center;
    margin: 20px auto 0;
    max-width: 250px;
  }
  .rsvp-label {
    font-size: 11px;
    letter-spacing: 2px;
    font-weight: 700;
    color: ${primaryColor};
  }
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header-strip"></div>
    <div class="frame"></div>
    ${decorativeOverlay}
    <div class="content">
      <div class="greeting">You are cordially invited</div>
      <div class="event-name">${e(data.eventName)}</div>
      <div class="host">Hosted by ${e(data.fromName)}</div>
      ${data.toName ? `<div class="host">Honouring ${e(data.toName)}</div>` : ''}
      
      <div class="divider">
        <div class="divider-line"></div>
      </div>

      <div class="details-panel">
        <div class="details-grid">
          <div>
            <span class="detail-label">Date &amp; Time</span>
            <div class="detail-value">${e(data.formattedDate)} at ${e(data.time)}</div>
          </div>
          <div>
            <span class="detail-label">Venue</span>
            <div class="detail-value">${e(data.venue)}</div>
          </div>
        </div>
      </div>

      ${data.message ? `<div class="message">"${e(data.message)}"</div>` : ''}

      ${data.includeRSVP ? `
      <div class="rsvp">
        <div class="rsvp-label">RSVP via EventVerse</div>
      </div>` : ''}
    </div>
  </div>
</div>
</body>
</html>`;
}
