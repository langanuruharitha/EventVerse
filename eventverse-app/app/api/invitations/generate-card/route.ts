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

    const defaultDateStr = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
    
    const finalEventName = (eventName && eventName.trim()) || 'Grand Celebration';
    const finalFromName = (fromName && fromName.trim()) || 'Host';
    const finalDate = (date && date.trim()) || defaultDateStr;
    const finalTime = (time && time.trim()) || '18:00';
    const finalVenue = (venue && venue.trim()) || 'Grand Venue';

    let formattedDate = finalDate;
    try {
      formattedDate = new Date(finalDate).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) {
      formattedDate = finalDate;
    }

    const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    let themeConfig = null;
    let geminiError = null;

    if (key && themeDescription) {
      try {
        console.log('Generating custom JSON theme config with Gemini...');
        themeConfig = await generateThemeConfigWithGemini(themeDescription, key);
        console.log('Gemini theme config generated successfully:', !!themeConfig);
      } catch (err: any) {
        geminiError = err?.message || String(err);
        console.error('Gemini JSON generation failed:', geminiError);
      }
    } else {
      console.log('Skipping Gemini: key present=', !!key, ', theme present=', !!themeDescription);
    }

    console.log('Building HTML card with themeConfig:', themeConfig ? 'Custom AI Theme' : 'Fallback Theme');
    const htmlContent = buildBeautifulCard({
      eventType,
      eventName: finalEventName,
      fromName: finalFromName,
      toName,
      formattedDate,
      time: finalTime,
      venue: finalVenue,
      message,
      style: style || 'elegant',
      includeRSVP: !!includeRSVP,
      themeDescription: themeDescription || '',
      themeConfig
    });

    return NextResponse.json({
      success: true,
      htmlContent,
      aiThemeApplied: !!themeConfig,
      geminiError: geminiError || undefined
    });

  } catch (error) {
    console.error('Error generating invitation card:', error);
    return NextResponse.json({ error: 'Failed to generate invitation card' }, { status: 500 });
  }
}

async function generateThemeConfigWithGemini(themeDescription: string, key: string) {
  const prompt = `You are an expert UI designer. Generate a theme configuration for an invitation card.
CRITICAL INSTRUCTION: You must strictly follow this exact theme request: "${themeDescription}"

Return ONLY valid JSON matching this exact structure:
{
  "bodyBg": "css background value for the outer page (e.g. radial-gradient(...), linear-gradient(...), or url(...))",
  "cardBg": "css background value for the inner card (e.g. #ffffff or rgba(255,255,255,0.9))",
  "textColor": "hex color for main text",
  "subTextColor": "hex color for secondary text",
  "primaryColor": "hex color for accents and titles",
  "secondaryColor": "hex color for borders and highlights",
  "headerGradient": "css linear-gradient for the top strip of the card",
  "decorativeOverlay": "raw HTML/SVG code to be placed as an overlay (e.g. falling balloons, ocean waves, stars, floral corners). MUST use absolute positioning, pointer-events: none, and inline SVGs.",
  "cssAnimations": "any custom css @keyframes or classes needed to animate the decorativeOverlay (e.g. @keyframes float { ... })",
  "greetingText": "a short, poetic 3-4 word greeting matching the theme (NOT 'You are cordially invited')"
}`;

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048
        }
      })
    }
  );

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API error (${resp.status}): ${errText}`);
  }
  const json = await resp.json();
  let raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  try {
    return JSON.parse(raw);
  } catch(e) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw e;
  }
}

function buildBeautifulCard(data: {
  eventType: string; eventName: string; fromName: string; toName?: string;
  formattedDate: string; time: string; venue: string; message?: string;
  style: string; includeRSVP: boolean; themeDescription: string;
  themeConfig?: any;
}): string {
  const desc = (data.themeDescription || '').toLowerCase();
  const type = (data.eventType || '').toLowerCase();
  
  // High-End Royal Palette Presets
  let bodyBg = 'linear-gradient(145deg, #1f050b 0%, #3b0a0f 40%, #150206 100%)'; // Deep Royal Red & Gold
  let cardBg = 'radial-gradient(ellipse at center, rgba(59, 10, 15, 0.95) 0%, rgba(26, 3, 6, 0.98) 100%)';
  let textColor = '#FAF0E0';
  let subTextColor = '#E6C687';
  let primaryColor = '#FDF0D5';
  let secondaryColor = '#D4AF37'; // Royal Metallic Gold
  let panelBg = 'rgba(212, 175, 55, 0.08)';
  let panelBorder = 'rgba(212, 175, 55, 0.4)';
  let frameBorder = '#D4AF37';
  let headerGradient = 'linear-gradient(90deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)';

  // Theme Detection Overrides
  if (type === 'wedding' || desc.includes('wedding') || desc.includes('royal') || desc.includes('gold') || desc.includes('traditional')) {
    bodyBg = 'linear-gradient(135deg, #2b0308 0%, #4a0810 50%, #1c0205 100%)';
    secondaryColor = '#FFD700';
    primaryColor = '#FFF5D6';
  } else if (type === 'birthday' || desc.includes('balloon') || desc.includes('party') || desc.includes('gala')) {
    bodyBg = 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #090e1a 100%)'; // Midnight Navy & Gold
    cardBg = 'radial-gradient(ellipse at center, rgba(28, 37, 65, 0.95) 0%, rgba(11, 19, 43, 0.98) 100%)';
    primaryColor = '#E0FBFC';
    secondaryColor = '#F4D06F';
    subTextColor = '#C2DFE3';
  } else if (desc.includes('rose') || desc.includes('floral') || desc.includes('pink') || desc.includes('anniversary')) {
    bodyBg = 'linear-gradient(135deg, #2b0b1e 0%, #52153b 50%, #1c0613 100%)'; // Velvet Plum & Rose Gold
    primaryColor = '#FFF0F5';
    secondaryColor = '#E6B89C';
    subTextColor = '#F4C2C2';
  } else if (desc.includes('green') || desc.includes('emerald') || desc.includes('nature')) {
    bodyBg = 'linear-gradient(135deg, #032015 0%, #0a402b 50%, #02140d 100%)'; // Emerald & Gold
    primaryColor = '#E8F5E9';
    secondaryColor = '#D4AF37';
    subTextColor = '#A5D6A7';
  }

  if (data.themeConfig) {
    const ai = data.themeConfig;
    if (ai.bodyBg) bodyBg = ai.bodyBg;
    if (ai.cardBg) cardBg = ai.cardBg;
    if (ai.textColor) textColor = ai.textColor;
    if (ai.subTextColor) subTextColor = ai.subTextColor;
    if (ai.primaryColor) primaryColor = ai.primaryColor;
    if (ai.secondaryColor) secondaryColor = ai.secondaryColor;
  }

  const fontUrl = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Great+Vibes&family=Montserrat:ital,wght@0,300;0,400;0,600;1,300&display=swap';
  const headerFont = "'Cinzel', serif";
  const scriptFont = "'Great Vibes', cursive";
  const bodyFont = "'Montserrat', sans-serif";

  const e = (s: string) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="${fontUrl}" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 800px;
    height: 1120px;
    background: ${bodyBg};
    font-family: ${bodyFont};
    color: ${textColor};
    overflow: hidden;
  }
  .card-container {
    width: 800px;
    height: 1120px;
    position: relative;
    padding: 36px;
    background: ${cardBg};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
  }
  /* Outer Gold Filigree Frame */
  .outer-border {
    position: absolute;
    top: 24px; left: 24px; right: 24px; bottom: 24px;
    border: 3px double ${secondaryColor};
    border-radius: 12px;
    pointer-events: none;
    z-index: 2;
    box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.2);
  }
  .inner-border {
    position: absolute;
    top: 32px; left: 32px; right: 32px; bottom: 32px;
    border: 1px solid ${secondaryColor}66;
    border-radius: 8px;
    pointer-events: none;
    z-index: 2;
  }
  /* Corner Filigree Ornaments */
  .corner {
    position: absolute;
    width: 70px;
    height: 70px;
    z-index: 3;
    pointer-events: none;
  }
  .corner-tl { top: 16px; left: 16px; }
  .corner-tr { top: 16px; right: 16px; transform: scaleX(-1); }
  .corner-bl { bottom: 16px; left: 16px; transform: scaleY(-1); }
  .corner-br { bottom: 16px; right: 16px; transform: scale(-1); }

  .content-box {
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100%;
    padding: 40px 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }
  
  .royal-emblem {
    font-size: 32px;
    color: ${secondaryColor};
    letter-spacing: 4px;
    margin-bottom: 8px;
  }
  .greeting-tag {
    font-family: ${headerFont};
    font-size: 13px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: ${secondaryColor};
    font-weight: 700;
    margin-bottom: 12px;
  }
  .event-title {
    font-family: ${headerFont};
    font-size: 42px;
    font-weight: 900;
    color: ${primaryColor};
    letter-spacing: 1.5px;
    line-height: 1.25;
    text-shadow: 0 4px 12px rgba(0,0,0,0.8), 0 0 20px ${secondaryColor}44;
    margin: 10px 0 16px;
    text-transform: uppercase;
  }
  .host-line {
    font-family: ${scriptFont};
    font-size: 36px;
    color: ${subTextColor};
    margin-bottom: 8px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }
  .honour-line {
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${textColor};
    opacity: 0.9;
    margin-bottom: 24px;
  }

  .gold-divider {
    width: 60%;
    height: 2px;
    background: ${headerGradient};
    margin: 16px auto;
    border-radius: 2px;
    box-shadow: 0 0 10px ${secondaryColor};
  }

  .details-card {
    background: ${panelBg};
    border: 1.5px solid ${panelBorder};
    border-radius: 16px;
    padding: 28px 36px;
    width: 90%;
    margin: 20px 0;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  }
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .detail-item {
    text-align: center;
  }
  .detail-label {
    font-family: ${headerFont};
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${secondaryColor};
    font-weight: 700;
    margin-bottom: 8px;
    display: block;
  }
  .detail-val {
    font-size: 16px;
    font-weight: 600;
    color: ${textColor};
    line-height: 1.4;
  }

  .message-quote {
    font-family: ${scriptFont};
    font-size: 28px;
    color: ${subTextColor};
    line-height: 1.4;
    max-width: 85%;
    margin: 16px auto;
    text-shadow: 0 2px 6px rgba(0,0,0,0.6);
  }

  .rsvp-badge {
    border: 1px solid ${secondaryColor};
    background: rgba(212, 175, 55, 0.12);
    border-radius: 30px;
    padding: 10px 32px;
    font-family: ${headerFont};
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${secondaryColor};
    font-weight: 700;
    margin-top: 16px;
    display: inline-block;
  }
  .footer-emblem {
    font-size: 20px;
    color: ${secondaryColor};
    margin-top: 12px;
    opacity: 0.8;
  }
</style>
</head>
<body>
<div class="card-container">
  <div class="outer-border"></div>
  <div class="inner-border"></div>

  <!-- SVG Royal Corner Ornaments -->
  <svg class="corner corner-tl" viewBox="0 0 100 100" fill="none">
    <path d="M10 10 H90 V25 H35 V90 H10 Z" fill="${secondaryColor}" opacity="0.6"/>
    <circle cx="20" cy="20" r="6" fill="${secondaryColor}"/>
    <path d="M30 10 Q60 40 10 60" stroke="${secondaryColor}" stroke-width="2" fill="none"/>
  </svg>
  <svg class="corner corner-tr" viewBox="0 0 100 100" fill="none">
    <path d="M10 10 H90 V25 H35 V90 H10 Z" fill="${secondaryColor}" opacity="0.6"/>
    <circle cx="20" cy="20" r="6" fill="${secondaryColor}"/>
    <path d="M30 10 Q60 40 10 60" stroke="${secondaryColor}" stroke-width="2" fill="none"/>
  </svg>
  <svg class="corner corner-bl" viewBox="0 0 100 100" fill="none">
    <path d="M10 10 H90 V25 H35 V90 H10 Z" fill="${secondaryColor}" opacity="0.6"/>
    <circle cx="20" cy="20" r="6" fill="${secondaryColor}"/>
    <path d="M30 10 Q60 40 10 60" stroke="${secondaryColor}" stroke-width="2" fill="none"/>
  </svg>
  <svg class="corner corner-br" viewBox="0 0 100 100" fill="none">
    <path d="M10 10 H90 V25 H35 V90 H10 Z" fill="${secondaryColor}" opacity="0.6"/>
    <circle cx="20" cy="20" r="6" fill="${secondaryColor}"/>
    <path d="M30 10 Q60 40 10 60" stroke="${secondaryColor}" stroke-width="2" fill="none"/>
  </svg>

  <div class="content-box">
    <div>
      <div class="royal-emblem">⚜ ❦ ⚜</div>
      <div class="greeting-tag">Cordial Invitation</div>
      <h1 class="event-title">${e(data.eventName)}</h1>
      <div class="host-line">Hosted by ${e(data.fromName)}</div>
      ${data.toName ? `<div class="honour-line">In Honour of <strong>${e(data.toName)}</strong></div>` : ''}
    </div>

    <div style="width: 100%;">
      <div class="gold-divider"></div>
      <div class="details-card">
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">🗓 Date &amp; Time</span>
            <div class="detail-val">${e(data.formattedDate)}<br/>at ${e(data.time)}</div>
          </div>
          <div class="detail-item">
            <span class="detail-label">📍 Ceremony Venue</span>
            <div class="detail-val">${e(data.venue)}</div>
          </div>
        </div>
      </div>
      <div class="gold-divider"></div>
    </div>

    <div>
      ${data.message ? `<div class="message-quote">"${e(data.message)}"</div>` : ''}
      ${data.includeRSVP ? `<div class="rsvp-badge">RSVP via EventVerse</div>` : ''}
      <div class="footer-emblem">❦</div>
    </div>
  </div>
</div>
</body>
</html>`;
}
