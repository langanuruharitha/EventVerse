// Real Invitation Card Templates with HTML/CSS designs
// These are actual template layouts that render in the browser

export interface InvitationTemplate {
  id: string;
  name: string;
  category: 'birthday' | 'wedding' | 'anniversary' | 'corporate';
  style: string;
  orientation: 'portrait' | 'landscape' | 'square';
  thumbnailUrl: string;
  isPremium: boolean;
  
  // Actual HTML template with placeholders
  htmlTemplate: string;
  
  // CSS styles for the template
  cssTemplate: string;
  
  // Default values
  defaultValues: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    backgroundImage?: string;
  };
}

export const invitationTemplates: InvitationTemplate[] = [
  // ==========================================
  // BIRTHDAY TEMPLATES - Modern Gold
  // ==========================================
  {
    id: 'birthday-modern-gold',
    name: 'Golden Birthday Celebration',
    category: 'birthday',
    style: 'modern',
    orientation: 'portrait',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600',
    isPremium: true,
    
    htmlTemplate: `
      <div class="invitation-card">
        <div class="header-section">
          <div class="decorative-line"></div>
          <h1 class="event-title">{{eventName}}</h1>
          <div class="decorative-line"></div>
        </div>
        
        <div class="main-content">
          <div class="hosts">
            <p class="label">You're Invited By</p>
            <h2 class="host-names">{{hostNames}}</h2>
          </div>
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="icon">📅</div>
              <div class="detail-text">
                <p class="detail-label">Date</p>
                <p class="detail-value">{{date}}</p>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="icon">🕐</div>
              <div class="detail-text">
                <p class="detail-label">Time</p>
                <p class="detail-value">{{time}}</p>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="icon">📍</div>
              <div class="detail-text">
                <p class="detail-label">Venue</p>
                <p class="detail-value">{{venue}}</p>
              </div>
            </div>
          </div>
          
          <div class="message-section">
            <p class="message">{{message}}</p>
          </div>
          
          <div class="footer-decoration">
            <div class="sparkle">✨</div>
            <div class="sparkle">✨</div>
            <div class="sparkle">✨</div>
          </div>
        </div>
      </div>
    `,
    
    cssTemplate: `
      .invitation-card {
        width: 600px;
        height: 800px;
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        padding: 40px;
        font-family: 'Playfair Display', serif;
        position: relative;
        overflow: hidden;
      }
      
      .invitation-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: shimmer 3s infinite;
      }
      
      .header-section {
        text-align: center;
        margin-bottom: 60px;
        position: relative;
        z-index: 1;
      }
      
      .decorative-line {
        width: 100px;
        height: 2px;
        background: #fff;
        margin: 20px auto;
      }
      
      .event-title {
        font-size: 48px;
        font-weight: 700;
        color: #fff;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        margin: 0;
      }
      
      .main-content {
        background: rgba(255,255,255,0.95);
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        position: relative;
        z-index: 1;
      }
      
      .hosts {
        text-align: center;
        margin-bottom: 40px;
      }
      
      .label {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #666;
        margin-bottom: 10px;
      }
      
      .host-names {
        font-size: 32px;
        color: #333;
        margin: 0;
        font-weight: 700;
      }
      
      .details-grid {
        display: flex;
        flex-direction: column;
        gap: 25px;
        margin: 40px 0;
      }
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 15px;
        background: #f8f8f8;
        border-radius: 10px;
      }
      
      .icon {
        font-size: 32px;
      }
      
      .detail-text {
        flex: 1;
      }
      
      .detail-label {
        font-size: 12px;
        text-transform: uppercase;
        color: #666;
        margin: 0 0 5px 0;
      }
      
      .detail-value {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
      
      .message-section {
        text-align: center;
        margin-top: 40px;
        padding-top: 30px;
        border-top: 1px solid #ddd;
      }
      
      .message {
        font-size: 16px;
        line-height: 1.6;
        color: #555;
        font-style: italic;
      }
      
      .footer-decoration {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 30px;
      }
      
      .sparkle {
        font-size: 24px;
        animation: twinkle 1.5s infinite;
      }
      
      .sparkle:nth-child(2) {
        animation-delay: 0.5s;
      }
      
      .sparkle:nth-child(3) {
        animation-delay: 1s;
      }
      
      @keyframes shimmer {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(180deg); }
      }
      
      @keyframes twinkle {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.2); }
      }
    `,
    
    defaultValues: {
      primaryColor: '#ffd700',
      secondaryColor: '#fff',
      fontFamily: 'Playfair Display, serif',
      backgroundImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600'
    }
  },

  // ==========================================
  // BIRTHDAY TEMPLATES - Elegant Floral
  // ==========================================
  {
    id: 'birthday-elegant-floral',
    name: 'Elegant Floral Birthday',
    category: 'birthday',
    style: 'elegant',
    orientation: 'portrait',
    thumbnailUrl: 'https://images.unsplash.com/photo-1496284427489-f59461d8a8e6?w=600',
    isPremium: false,
    
    htmlTemplate: `
      <div class="invitation-card floral-theme">
        <div class="floral-border">
          <div class="corner-flower top-left">🌸</div>
          <div class="corner-flower top-right">🌸</div>
          <div class="corner-flower bottom-left">🌸</div>
          <div class="corner-flower bottom-right">🌸</div>
        </div>
        
        <div class="content-wrapper">
          <div class="header-floral">
            <div class="flower-accent">🌺</div>
            <h1 class="birthday-title">{{eventName}}</h1>
            <div class="flower-accent">🌺</div>
          </div>
          
          <div class="invitation-text">
            <p class="you-are-invited">You Are Cordially Invited</p>
          </div>
          
          <div class="host-section">
            <p class="hosted-by">Hosted By</p>
            <h2 class="host-name">{{hostNames}}</h2>
          </div>
          
          <div class="divider-line"></div>
          
          <div class="event-details">
            <div class="detail-row">
              <span class="detail-icon">📅</span>
              <span class="detail-content">{{date}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">🕐</span>
              <span class="detail-content">{{time}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">📍</span>
              <span class="detail-content">{{venue}}</span>
            </div>
          </div>
          
          <div class="special-message">
            <p>{{message}}</p>
          </div>
          
          <div class="bottom-flowers">
            <span>🌹</span><span>🌷</span><span>🌹</span>
          </div>
        </div>
      </div>
    `,
    
    cssTemplate: `
      .floral-theme {
        width: 600px;
        height: 800px;
        background: linear-gradient(to bottom, #fff5f5 0%, #ffe4e6 100%);
        padding: 40px;
        font-family: 'Lora', serif;
        position: relative;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      }
      
      .floral-border {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        border: 3px solid #ff69b4;
        border-radius: 10px;
      }
      
      .corner-flower {
        position: absolute;
        font-size: 40px;
        z-index: 10;
      }
      
      .top-left { top: -20px; left: -20px; }
      .top-right { top: -20px; right: -20px; }
      .bottom-left { bottom: -20px; left: -20px; }
      .bottom-right { bottom: -20px; right: -20px; }
      
      .content-wrapper {
        position: relative;
        z-index: 5;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 40px;
      }
      
      .header-floral {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .flower-accent {
        font-size: 36px;
        margin: 10px 0;
      }
      
      .birthday-title {
        font-size: 42px;
        color: #d91a60;
        margin: 20px 0;
        font-weight: 700;
        text-align: center;
      }
      
      .you-are-invited {
        text-align: center;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 3px;
        color: #666;
        margin: 20px 0;
      }
      
      .host-section {
        text-align: center;
        margin: 30px 0;
      }
      
      .hosted-by {
        font-size: 14px;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 10px;
      }
      
      .host-name {
        font-size: 32px;
        color: #333;
        font-weight: 600;
        margin: 0;
      }
      
      .divider-line {
        width: 200px;
        height: 2px;
        background: linear-gradient(to right, transparent, #ff69b4, transparent);
        margin: 30px auto;
      }
      
      .event-details {
        margin: 30px 0;
      }
      
      .detail-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin: 15px 0;
        font-size: 18px;
      }
      
      .detail-icon {
        font-size: 24px;
      }
      
      .detail-content {
        color: #444;
        font-weight: 500;
      }
      
      .special-message {
        text-align: center;
        margin: 30px 0;
        padding: 20px;
        background: rgba(255,255,255,0.7);
        border-radius: 10px;
      }
      
      .special-message p {
        font-size: 16px;
        line-height: 1.6;
        color: #555;
        font-style: italic;
        margin: 0;
      }
      
      .bottom-flowers {
        text-align: center;
        font-size: 32px;
        margin-top: 20px;
      }
      
      .bottom-flowers span {
        margin: 0 10px;
        display: inline-block;
        animation: sway 2s ease-in-out infinite;
      }
      
      .bottom-flowers span:nth-child(2) {
        animation-delay: 0.3s;
      }
      
      .bottom-flowers span:nth-child(3) {
        animation-delay: 0.6s;
      }
      
      @keyframes sway {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
    `,
    
    defaultValues: {
      primaryColor: '#ff69b4',
      secondaryColor: '#ffe4e6',
      fontFamily: 'Lora, serif',
      backgroundImage: 'https://images.unsplash.com/photo-1496284427489-f59461d8a8e6?w=600'
    }
  },

  // ==========================================
  // WEDDING TEMPLATES - Classic Elegant
  // ==========================================
  {
    id: 'wedding-classic-elegant',
    name: 'Classic Wedding Elegance',
    category: 'wedding',
    style: 'traditional',
    orientation: 'portrait',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    isPremium: true,
    
    htmlTemplate: `
      <div class="invitation-card wedding-classic">
        <div class="ornamental-border">
          <div class="top-ornament">❖</div>
          <div class="side-ornament left">❖</div>
          <div class="side-ornament right">❖</div>
          <div class="bottom-ornament">❖</div>
        </div>
        
        <div class="wedding-content">
          <div class="wedding-header">
            <p class="invitation-label">The Wedding Celebration of</p>
          </div>
          
          <div class="couple-names">
            <h1 class="bride-groom">{{hostNames}}</h1>
            <div class="ampersand">&</div>
            <h1 class="bride-groom">{{guestNames}}</h1>
          </div>
          
          <div class="invitation-message">
            <p class="request-honor">Request the honor of your presence</p>
            <p class="celebrate">to celebrate their union</p>
          </div>
          
          <div class="ceremony-details">
            <div class="detail-group">
              <p class="detail-title">Date</p>
              <p class="detail-info">{{date}}</p>
            </div>
            
            <div class="separator">◆</div>
            
            <div class="detail-group">
              <p class="detail-title">Time</p>
              <p class="detail-info">{{time}}</p>
            </div>
            
            <div class="separator">◆</div>
            
            <div class="detail-group">
              <p class="detail-title">Venue</p>
              <p class="detail-info">{{venue}}</p>
            </div>
          </div>
          
          <div class="closing-message">
            <p>{{message}}</p>
          </div>
          
          <div class="rsvp-note">
            <p>Please RSVP by [Date]</p>
          </div>
        </div>
      </div>
    `,
    
    cssTemplate: `
      .wedding-classic {
        width: 600px;
        height: 850px;
        background: linear-gradient(135deg, #f5f5dc 0%, #ffffff 100%);
        padding: 50px;
        font-family: 'Cormorant Garamond', serif;
        position: relative;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      }
      
      .ornamental-border {
        position: absolute;
        top: 30px;
        left: 30px;
        right: 30px;
        bottom: 30px;
        border: 2px solid #c9a961;
        padding: 10px;
      }
      
      .ornamental-border::before {
        content: '';
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border: 1px solid #c9a961;
      }
      
      .top-ornament, .bottom-ornament, .side-ornament {
        position: absolute;
        color: #c9a961;
        font-size: 20px;
      }
      
      .top-ornament { top: -10px; left: 50%; transform: translateX(-50%); }
      .bottom-ornament { bottom: -10px; left: 50%; transform: translateX(-50%); }
      .side-ornament.left { left: -10px; top: 50%; transform: translateY(-50%); }
      .side-ornament.right { right: -10px; top: 50%; transform: translateY(-50%); }
      
      .wedding-content {
        position: relative;
        z-index: 10;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 40px;
        text-align: center;
      }
      
      .wedding-header {
        margin-bottom: 30px;
      }
      
      .invitation-label {
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 4px;
        color: #666;
        margin: 0;
      }
      
      .couple-names {
        margin: 40px 0;
      }
      
      .bride-groom {
        font-size: 56px;
        font-weight: 700;
        color: #2c2c2c;
        margin: 10px 0;
        letter-spacing: 2px;
      }
      
      .ampersand {
        font-size: 48px;
        color: #c9a961;
        font-style: italic;
        margin: 20px 0;
      }
      
      .invitation-message {
        margin: 40px 0;
      }
      
      .request-honor {
        font-size: 20px;
        color: #444;
        margin: 10px 0;
        font-style: italic;
      }
      
      .celebrate {
        font-size: 18px;
        color: #666;
        margin: 10px 0;
      }
      
      .ceremony-details {
        margin: 40px 0;
        padding: 30px 0;
        border-top: 1px solid #c9a961;
        border-bottom: 1px solid #c9a961;
      }
      
      .detail-group {
        margin: 20px 0;
      }
      
      .detail-title {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 3px;
        color: #888;
        margin: 0 0 10px 0;
      }
      
      .detail-info {
        font-size: 22px;
        color: #333;
        font-weight: 600;
        margin: 0;
      }
      
      .separator {
        color: #c9a961;
        font-size: 16px;
        margin: 15px 0;
      }
      
      .closing-message {
        margin: 30px 0;
        font-size: 16px;
        line-height: 1.8;
        color: #555;
        font-style: italic;
      }
      
      .rsvp-note {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }
      
      .rsvp-note p {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #999;
        margin: 0;
      }
    `,
    
    defaultValues: {
      primaryColor: '#c9a961',
      secondaryColor: '#f5f5dc',
      fontFamily: 'Cormorant Garamond, serif',
      backgroundImage: 'https://images.unsplash.com/photo-5197414974-611481863552?w=600'
    }
  },
];

// Helper function to render template with data
export function renderTemplate(template: InvitationTemplate, data: {
  eventName: string;
  hostNames: string;
  guestNames?: string;
  date: string;
  time: string;
  venue: string;
  message: string;
}): string {
  let html = template.htmlTemplate;
  
  // Replace placeholders
  html = html.replace(/{{eventName}}/g, data.eventName);
  html = html.replace(/{{hostNames}}/g, data.hostNames);
  html = html.replace(/{{guestNames}}/g, data.guestNames || '');
  html = html.replace(/{{date}}/g, data.date);
  html = html.replace(/{{time}}/g, data.time);
  html = html.replace(/{{venue}}/g, data.venue);
  html = html.replace(/{{message}}/g, data.message || 'We look forward to celebrating with you!');
  
  return `
    <style>${template.cssTemplate}</style>
    ${html}
  `;
}
