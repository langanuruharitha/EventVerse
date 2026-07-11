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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
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

  if (!resp.ok) throw new Error(`Gemini error: ${resp.status}`);
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
  let decorativeOverlay = '';
  let cssAnimations = '';
  let greetingText = 'You are cordially invited';

  if (!data.themeConfig) {
    const isSpace = desc.includes('space') || desc.includes('sky') || desc.includes('night') || desc.includes('galaxy') || desc.includes('dark');
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
      decorativeOverlay = `
        <div style="position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden">
          <div style="position:absolute;top:10%;left:20%;width:3px;height:3px;background:white;border-radius:50%;box-shadow:0 0 10px white;animation:pulse 2s infinite"></div>
        </div>`;
      cssAnimations = `@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`;
    }
  }

  if (data.themeConfig) {
    const ai = data.themeConfig;
    if (ai.bodyBg) bodyBg = ai.bodyBg;
    if (ai.cardBg) cardBg = ai.cardBg;
    if (ai.textColor) textColor = ai.textColor;
    if (ai.subTextColor) subTextColor = ai.subTextColor;
    if (ai.primaryColor) primaryColor = ai.primaryColor;
    if (ai.secondaryColor) secondaryColor = ai.secondaryColor;
    if (ai.headerGradient) headerGradient = ai.headerGradient;
    if (ai.decorativeOverlay) decorativeOverlay = ai.decorativeOverlay;
    if (ai.cssAnimations) cssAnimations = ai.cssAnimations;
    if (ai.greetingText) greetingText = ai.greetingText;
    
    panelBg = 'rgba(255,255,255,0.05)';
    panelBorder = ai.secondaryColor ? ai.secondaryColor + '40' : 'rgba(0,0,0,0.1)';
    frameBorder = ai.secondaryColor ? ai.secondaryColor + '60' : 'rgba(0,0,0,0.2)';
  }

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
    background: ${bodyBg};
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px;
  }
  ${cssAnimations}
  .wrapper { max-width: 640px; width: 100%; position: relative; }
  .card {
    position: relative;
    background: ${cardBg};
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 24px 80px rgba(0,0,0,0.25);
    overflow: hidden;
    color: ${textColor};
    backdrop-filter: blur(12px);
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
  ${decorativeOverlay}
  <div class="card">
    <div class="header-strip"></div>
    <div class="frame"></div>
    <div class="content">
      <div class="greeting">${e(greetingText)}</div>
      <div class="event-name">${e(data.eventName)}</div>
      <div class="host">Hosted by ${e(data.fromName)}</div>
      ${data.toName ? `<div class="host">Honouring ${e(data.toName)}</div>` : ''}
      
      <div class="divider"><div class="divider-line"></div></div>

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
