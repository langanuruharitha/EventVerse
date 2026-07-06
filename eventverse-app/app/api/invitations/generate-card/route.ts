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

    const key = process.env.GEMINI_API_KEY;

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
- Theme Description & Creative Requirements: ${data.themeDescription}
${data.message ? `- Additional Message: ${data.message}` : ''}
- Include RSVP Section: ${data.includeRSVP ? 'Yes' : 'No'}

DESIGN REQUIREMENTS:
1. Palette & Theme: Choose a premium, harmonious color palette matching the theme description (e.g. deep royal blue and gold, pastel pink floral, modern dark cyberpunk, traditional red/gold marigold). Do NOT use generic, plain white backgrounds unless explicitly requested.
2. Background: Use a stunning background matching the theme (e.g. premium CSS gradients, subtle geometric/floral patterns, or elegant textures using pure CSS).
3. Fonts: Load and use premium Google Fonts matching the theme (e.g. Playfair Display, Cinzel, Great Vibes, Cormorant Garamond, Montserrat, Outfit, Rochester). Apply beautiful letter-spacing, font-weight, and line-height.
4. Decorations: Create theme-matching decorations using pure CSS and inline SVGs (e.g. golden frames, floral ornaments, starry night particles, abstract modern shapes, or traditional Indian borders). Do NOT use generic placeholders or external image URLs that might break.
5. Layout: The card must be centered, look outstanding, responsive, and fit beautifully on mobile and desktop screens. It should feel like a premium, state-of-the-art invitation.
6. Content: Write unique, creative, poetic invitation greetings and messages matching the theme instead of basic templates.

Return ONLY a JSON object with a single key "htmlContent":
{
  "htmlContent": "<!DOCTYPE html>..."
}
`;

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${data.key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.9,
          maxOutputTokens: 8192
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
    if (parsed.htmlContent) {
      return parsed.htmlContent;
    }
  }
  throw new Error('Could not parse htmlContent from Gemini response');
}

// ─────────────────────────────────────────────
// Fallback card builder (if Gemini key is missing or fails)
// ─────────────────────────────────────────────
function buildFallbackCard(data: {
  eventType: string; eventName: string; fromName: string; toName?: string;
  formattedDate: string; time: string; venue: string; message?: string;
  style: string; includeRSVP: boolean; themeDescription: string;
}): string {
  const colors: Record<string, { primary: string; secondary: string; light: string; bg: string; gradient: string }> = {
    purple: { primary: '#7c3aed', secondary: '#a855f7', light: '#f3e8ff', bg: '#faf5ff', gradient: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)' },
    blue:   { primary: '#1d4ed8', secondary: '#3b82f6', light: '#dbeafe', bg: '#eff6ff', gradient: 'linear-gradient(135deg, #1d4ed8, #3b82f6, #06b6d4)' },
    pink:   { primary: '#be185d', secondary: '#ec4899', light: '#fce7f3', bg: '#fdf2f8', gradient: 'linear-gradient(135deg, #be185d, #ec4899, #f97316)' },
    gold:   { primary: '#92400e', secondary: '#d97706', light: '#fde68a', bg: '#fffbeb', gradient: 'linear-gradient(135deg, #92400e, #d97706, #f59e0b)' },
  };

  const c = colors.purple;

  const fontUrl = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap';
  const fontFamily = "'Cormorant Garamond', 'Georgia', serif";
  const bodyFont = "'Lato', sans-serif";

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
    background: #ffffff;
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 24px 80px rgba(0,0,0,0.15);
    overflow: hidden;
  }
  .header-strip {
    height: 10px;
    background: ${c.gradient};
  }
  .frame {
    position: absolute;
    top: 20px; left: 20px; right: 20px; bottom: 20px;
    border: 1px solid ${c.secondary}30;
    border-radius: 14px;
    pointer-events: none;
  }
  .content { position: relative; z-index: 4; padding: 50px; }
  .greeting {
    font-family: ${fontFamily};
    font-size: 14px;
    color: ${c.primary};
    text-align: center;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 15px;
  }
  .event-name {
    font-family: ${fontFamily};
    font-size: 36px;
    font-weight: 700;
    color: ${c.primary};
    text-align: center;
    margin-bottom: 8px;
  }
  .host {
    font-size: 15px;
    color: #6b7280;
    text-align: center;
    font-style: italic;
    margin-bottom: 10px;
  }
  .divider {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; margin: 24px 0;
  }
  .divider-line { flex: 1; height: 1px; background: ${c.secondary}40; }
  .details-panel {
    background: white;
    border: 1px solid ${c.light};
    border-radius: 14px;
    padding: 20px;
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
    color: ${c.primary};
    margin-bottom: 4px;
    display: block;
  }
  .detail-value {
    font-size: 14px;
    color: #374151;
  }
  .message {
    font-size: 14px;
    color: #4b5563;
    text-align: center;
    font-style: italic;
    margin-top: 15px;
  }
  .rsvp {
    background: ${c.light};
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
    color: ${c.primary};
  }
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header-strip"></div>
    <div class="frame"></div>
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
      ${data.themeDescription ? `<div class="message" style="opacity: 0.8">Theme: ${e(data.themeDescription)}</div>` : ''}

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
