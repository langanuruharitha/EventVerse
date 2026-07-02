// API Route: Generate Custom Invitation Card with AI
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

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

    // Validate required fields
    if (!eventName || !fromName || !date || !time || !venue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format date for display
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Generate AI invitation text using Gemini (with fallback)
    let invitationText = '';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Create elegant and professional invitation card text for a ${eventType} event with these details:

Event Name: ${eventName}
Hosted by: ${fromName}
${toName ? `Inviting: ${toName}` : ''}
Date: ${formattedDate}
Time: ${time}
Venue: ${venue}
${message ? `Additional Message: ${message}` : ''}
${themeDescription ? `Theme & Background Decoration Style: ${themeDescription}` : ''}

Style: ${style || 'elegant'}
Color Theme: ${colorScheme || 'gold'}
${includeRSVP ? 'Include RSVP details' : ''}

Generate a beautiful, ${style || 'elegant'} invitation text (max 5 lines). Include a warm greeting and elegant phrasing. No markdown, no asterisks. Plain text only.`;

      const result = await model.generateContent(prompt);
      invitationText = result.response.text();
    } catch (aiError) {
      console.warn('Gemini AI unavailable, using fallback text:', aiError);
      invitationText = `With great joy and warmth, we invite you to celebrate ${eventName} with us.\nYour presence will make this occasion truly special and memorable.`;
    }

    // Generate SVG invitation card
    const svgCard = generateInvitationSVG({
      eventType,
      eventName,
      fromName,
      toName,
      formattedDate,
      time,
      venue,
      message: invitationText,
      colorScheme: colorScheme || 'gold',
      style: style || 'elegant',
      includeRSVP,
      themeDescription
    });

    // Convert SVG to data URL
    const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svgCard).toString('base64')}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      invitationText
    });

  } catch (error) {
    console.error('Error generating invitation card:', error);
    return NextResponse.json(
      { error: 'Failed to generate invitation card' },
      { status: 500 }
    );
  }
}

function generateInvitationSVG(data: {
  eventType: string;
  eventName: string;
  fromName: string;
  toName?: string;
  formattedDate: string;
  time: string;
  venue: string;
  message: string;
  colorScheme: string;
  style: string;
  includeRSVP?: boolean;
  themeDescription?: string;
}): string {
  const {
    eventType,
    eventName,
    fromName,
    toName,
    formattedDate,
    time,
    venue,
    message,
    colorScheme,
    includeRSVP,
    themeDescription
  } = data;

  // Premium color schemes
  const colors: Record<string, { primary: string; secondary: string; accent: string; text: string; bg: string; light: string }> = {
    purple: { primary: '#6d28d9', secondary: '#c084fc', accent: '#f5f3ff', text: '#4c1d95', bg: '#faf5ff', light: '#ede9fe' },
    blue:   { primary: '#1d4ed8', secondary: '#60a5fa', accent: '#eff6ff', text: '#1e3a8a', bg: '#f0f9ff', light: '#dbeafe' },
    pink:   { primary: '#be185d', secondary: '#f472b6', accent: '#fdf2f8', text: '#831843', bg: '#fff1f2', light: '#fce7f3' },
    gold:   { primary: '#92400e', secondary: '#d97706', accent: '#fef3c7', text: '#78350f', bg: '#fffbeb', light: '#fde68a' },
    green:  { primary: '#065f46', secondary: '#34d399', accent: '#ecfdf5', text: '#064e3b', bg: '#f0fdf4', light: '#d1fae5' },
    red:    { primary: '#991b1b', secondary: '#f87171', accent: '#fef2f2', text: '#7f1d1d', bg: '#fff5f5', light: '#fee2e2' }
  };

  const color = colors[colorScheme] || colors.gold;

  // Event icons
  const icons: Record<string, string> = {
    birthday: '🎂',
    wedding: '💍',
    anniversary: '💐',
    corporate: '🏢'
  };
  const icon = icons[eventType] || '🎉';

  // Trim and clean AI message lines
  const messageLines = message
    .replace(/[*#_~`]/g, '')
    .replace(/\n\n+/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .slice(0, 6);

  // Wrap venue if long
  const venueParts = venue.split(',');
  const venueMain = (venueParts[0] || venue).trim();
  const venueSub = (venueParts.slice(1).join(',') || '').trim();
  const venueSubLines = wrapText(venueSub, 26);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="1200" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&amp;family=Great+Vibes&amp;family=Montserrat:wght@300;400;500;600&amp;display=swap');
    </style>

    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" />
      <stop offset="45%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color.accent};stop-opacity:1" />
    </linearGradient>

    <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color.secondary};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${color.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color.secondary};stop-opacity:1" />
    </linearGradient>

    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${color.primary}" flood-opacity="0.12"/>
    </filter>

    <filter id="textGlow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="1200" fill="url(#bgGradient)"/>

  <!-- Outer Elegant Border -->
  <rect x="20" y="20" width="760" height="1160" fill="none" stroke="${color.secondary}" stroke-width="1" rx="20" opacity="0.5"/>
  <rect x="32" y="32" width="736" height="1136" fill="none" stroke="url(#borderGradient)" stroke-width="2.5" rx="16" filter="url(#cardShadow)"/>
  <rect x="44" y="44" width="712" height="1112" fill="none" stroke="${color.light}" stroke-width="1" rx="12" stroke-dasharray="6,5"/>

  <!-- TOP ORNAMENT: Diamond + lines -->
  <line x1="100" y1="110" x2="330" y2="110" stroke="${color.secondary}" stroke-width="1.2" opacity="0.7"/>
  <polygon points="400,90 410,110 400,130 390,110" fill="${color.primary}" opacity="0.85"/>
  <line x1="470" y1="110" x2="700" y2="110" stroke="${color.secondary}" stroke-width="1.2" opacity="0.7"/>

  <!-- Corner Filigrees TL -->
  <path d="M 44 44 Q 80 44 80 80" stroke="${color.secondary}" stroke-width="1.5" fill="none"/>
  <path d="M 44 60 Q 68 60 68 84" stroke="${color.light}" stroke-width="1" fill="none"/>
  <circle cx="56" cy="56" r="3" fill="${color.secondary}" opacity="0.7"/>

  <!-- Corner Filigrees TR -->
  <path d="M 756 44 Q 720 44 720 80" stroke="${color.secondary}" stroke-width="1.5" fill="none"/>
  <path d="M 756 60 Q 732 60 732 84" stroke="${color.light}" stroke-width="1" fill="none"/>
  <circle cx="744" cy="56" r="3" fill="${color.secondary}" opacity="0.7"/>

  <!-- Corner Filigrees BL -->
  <path d="M 44 1156 Q 80 1156 80 1120" stroke="${color.secondary}" stroke-width="1.5" fill="none"/>
  <path d="M 44 1140 Q 68 1140 68 1116" stroke="${color.light}" stroke-width="1" fill="none"/>
  <circle cx="56" cy="1144" r="3" fill="${color.secondary}" opacity="0.7"/>

  <!-- Corner Filigrees BR -->
  <path d="M 756 1156 Q 720 1156 720 1120" stroke="${color.secondary}" stroke-width="1.5" fill="none"/>
  <path d="M 756 1140 Q 732 1140 732 1116" stroke="${color.light}" stroke-width="1" fill="none"/>
  <circle cx="744" cy="1144" r="3" fill="${color.secondary}" opacity="0.7"/>

  <!-- Event Icon -->
  <text x="400" y="185" font-size="56" text-anchor="middle">${icon}</text>

  <!-- "You Are Invited" in Great Vibes -->
  <text x="400" y="265"
    font-family="'Great Vibes', 'Palatino Linotype', cursive"
    font-size="70" fill="${color.primary}"
    text-anchor="middle" opacity="0.95">You are Invited</text>

  <!-- "To Celebrate" label -->
  <text x="400" y="310"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="13" font-weight="600"
    letter-spacing="5" fill="${color.text}"
    text-anchor="middle" text-transform="uppercase" opacity="0.7">TO CELEBRATE</text>

  <!-- Event Name -->
  <text x="400" y="365"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="34" font-weight="700"
    letter-spacing="2" fill="${color.text}"
    text-anchor="middle">${escapeXml(eventName)}</text>

  ${themeDescription ? `
  <!-- Theme style subtext -->
  <text x="400" y="398"
    font-family="'Montserrat', Arial, sans-serif"
    font-size="12" font-weight="500" letter-spacing="1.5"
    fill="${color.secondary}" text-anchor="middle">THEME: ${escapeXml(themeDescription).toUpperCase()}</text>
  ` : ''}

  <!-- Gold divider with diamond -->
  <line x1="160" y1="420" x2="360" y2="420" stroke="${color.secondary}" stroke-width="1.5"/>
  <polygon points="400,412 408,420 400,428 392,420" fill="${color.secondary}"/>
  <line x1="440" y1="420" x2="640" y2="420" stroke="${color.secondary}" stroke-width="1.5"/>

  <!-- Hosted By -->
  <text x="400" y="455"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="12" letter-spacing="4"
    fill="${color.text}" text-anchor="middle" opacity="0.6">CORDIALLY HOSTED BY</text>

  <text x="400" y="498"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="26" font-weight="700"
    fill="${color.primary}" text-anchor="middle">${escapeXml(fromName)}</text>

  ${toName ? `
  <text x="400" y="536"
    font-family="'Montserrat', Arial, sans-serif"
    font-size="14" font-style="italic"
    fill="#6b7280" text-anchor="middle">Especially honouring</text>
  <text x="400" y="568"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="20" font-weight="600"
    fill="${color.text}" text-anchor="middle">${escapeXml(toName)}</text>
  ` : ''}

  <!-- ===== DETAILS CARD ===== -->
  <rect x="90" y="${toName ? 598 : 554}" width="620" height="230"
    fill="white" stroke="${color.secondary}" stroke-width="1.5"
    rx="14" filter="url(#cardShadow)"/>
  <rect x="97" y="${toName ? 605 : 561}" width="606" height="216"
    fill="none" stroke="${color.light}" stroke-width="1" rx="10"/>

  <!-- Vertical divider -->
  <line x1="400" y1="${toName ? 618 : 574}" x2="400" y2="${toName ? 812 : 768}"
    stroke="${color.accent}" stroke-width="1.5"/>

  <!-- LEFT: Date & Time -->
  <text x="245" y="${toName ? 648 : 604}"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="12" letter-spacing="3"
    fill="${color.primary}" text-anchor="middle" font-weight="600">DATE &amp; TIME</text>

  <text x="245" y="${toName ? 690 : 646}"
    font-family="'Montserrat', Arial, sans-serif"
    font-size="15" font-weight="600"
    fill="${color.text}" text-anchor="middle">${escapeXml(formattedDate)}</text>

  <text x="245" y="${toName ? 724 : 680}"
    font-family="'Montserrat', Arial, sans-serif"
    font-size="13" fill="#6b7280" text-anchor="middle">at</text>

  <text x="245" y="${toName ? 760 : 716}"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="22" font-weight="700"
    fill="${color.primary}" text-anchor="middle">${escapeXml(time)}</text>

  <!-- RIGHT: Venue -->
  <text x="555" y="${toName ? 648 : 604}"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="12" letter-spacing="3"
    fill="${color.primary}" text-anchor="middle" font-weight="600">THE VENUE</text>

  <text x="555" y="${toName ? 690 : 646}"
    font-family="'Montserrat', Arial, sans-serif"
    font-size="15" font-weight="600"
    fill="${color.text}" text-anchor="middle">${escapeXml(venueMain)}</text>

  ${venueSubLines.map((line, i) => `
  <text x="555" y="${(toName ? 718 : 674) + i * 22}"
    font-family="'Montserrat', Arial, sans-serif"
    font-size="13" fill="#6b7280" text-anchor="middle">${escapeXml(line)}</text>
  `).join('')}

  <!-- ===== MESSAGE SECTION ===== -->
  <line x1="150" y1="${toName ? 860 : 816}" x2="650" y2="${toName ? 860 : 816}"
    stroke="${color.light}" stroke-width="1" stroke-dasharray="4,4"/>

  ${messageLines.map((line, i) => `
  <text x="400" y="${(toName ? 892 : 848) + i * 28}"
    font-family="'Montserrat', Arial, sans-serif"
    font-size="14" font-weight="300" font-style="italic"
    fill="#4b5563" text-anchor="middle">${escapeXml(line)}</text>
  `).join('')}

  <!-- RSVP if requested -->
  ${includeRSVP ? `
  <rect x="230" y="${toName ? 1062 : 1018}" width="340" height="44"
    fill="${color.accent}" stroke="${color.secondary}" stroke-width="1" rx="22"/>
  <text x="400" y="${toName ? 1090 : 1046}"
    font-family="'Cinzel', 'Georgia', serif"
    font-size="12" letter-spacing="3" font-weight="600"
    fill="${color.primary}" text-anchor="middle">KINDLY RSVP VIA EVENTVERSE</text>
  ` : ''}

  <!-- Bottom ornament -->
  <line x1="100" y1="1090" x2="330" y2="1090" stroke="${color.secondary}" stroke-width="1" opacity="0.5"/>
  <polygon points="400,1082 407,1090 400,1098 393,1090" fill="${color.secondary}" opacity="0.6"/>
  <line x1="470" y1="1090" x2="700" y2="1090" stroke="${color.secondary}" stroke-width="1" opacity="0.5"/>

  <!-- Footer Brand -->
  <text x="400" y="1140"
    font-family="'Montserrat', Arial, sans-serif"
    font-size="10" letter-spacing="2"
    fill="#9ca3af" text-anchor="middle" opacity="0.7">CREATED BY EVENTVERSE AI STUDIO</text>
</svg>`;
}

function escapeXml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxLength: number): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxLength) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}
