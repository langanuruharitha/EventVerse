// REAL EDITABLE INVITATION TEMPLATES
// Users can click, edit text, and generate final images

export interface EditableTemplate {
  id: string;
  name: string;
  category: 'birthday' | 'wedding' | 'anniversary' | 'corporate';
  thumbnailUrl: string;
  isPremium: boolean;
  
  // Template component that renders with editable fields
  component: React.FC<TemplateProps>;
}

export interface TemplateProps {
  data: {
    eventName: string;
    hostName: string;
    date: string;
    time: string;
    venue: string;
    message?: string;
    age?: string;
    year?: string;
  };
  isEditing?: boolean;
}

// BIRTHDAY TEMPLATE 1: Golden Balloons
export const GoldenBalloonsTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    padding: '60px',
    fontFamily: 'Arial Black, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Gold Balloons */}
    <div style={{ position: 'absolute', top: '50px', left: '50px', fontSize: '80px' }}>🎈</div>
    <div style={{ position: 'absolute', top: '100px', right: '80px', fontSize: '80px' }}>🎈</div>
    
    {/* Main Content */}
    <div style={{
      background: 'rgba(255,215,0,0.95)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      {/* Age Badge */}
      {data.age && (
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: '#1a1a1a',
          color: '#ffd700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '72px',
          fontWeight: 'bold',
          marginBottom: '40px',
          border: '8px solid #fff',
        }}>
          {data.age}
        </div>
      )}
      
      {/* Event Name */}
      <h1 style={{
        fontSize: '56px',
        color: '#1a1a1a',
        margin: '0 0 30px 0',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '3px 3px 0 rgba(255,255,255,0.5)',
      }}>
        {data.eventName}
      </h1>
      
      {/* Host Name */}
      <h2 style={{
        fontSize: '36px',
        color: '#333',
        margin: '0 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      {/* Date & Time */}
      <div style={{
        background: '#1a1a1a',
        color: '#ffd700',
        padding: '30px 50px',
        borderRadius: '20px',
        marginBottom: '30px',
      }}>
        <p style={{ fontSize: '24px', margin: '0 0 10px 0', fontWeight: 'bold' }}>
          📅 {data.date}
        </p>
        <p style={{ fontSize: '24px', margin: '0', fontWeight: 'bold' }}>
          🕐 {data.time}
        </p>
      </div>
      
      {/* Venue */}
      <p style={{
        fontSize: '20px',
        color: '#333',
        margin: '20px 0',
        fontWeight: '600',
      }}>
        📍 {data.venue}
      </p>
      
      {/* Message */}
      {data.message && (
        <p style={{
          fontSize: '18px',
          color: '#444',
          marginTop: '30px',
          fontStyle: 'italic',
        }}>
          {data.message}
        </p>
      )}
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 2: Confetti Burst
export const ConfettiBurstTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%)',
    padding: '40px',
    fontFamily: 'Comic Sans MS, cursive',
    position: 'relative',
  }}>
    {/* Confetti Elements */}
    <div style={{ position: 'absolute', top: '30px', left: '40px', fontSize: '40px', transform: 'rotate(15deg)' }}>🎉</div>
    <div style={{ position: 'absolute', top: '80px', right: '60px', fontSize: '40px', transform: 'rotate(-20deg)' }}>🎊</div>
    <div style={{ position: 'absolute', bottom: '100px', left: '50px', fontSize: '40px', transform: 'rotate(25deg)' }}>🎁</div>
    <div style={{ position: 'absolute', bottom: '80px', right: '40px', fontSize: '40px', transform: 'rotate(-15deg)' }}>🎂</div>
    
    <div style={{
      background: 'rgba(255,255,255,0.98)',
      borderRadius: '40px',
      padding: '60px',
      height: '100%',
      border: '10px solid #fff',
      boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
    }}>
      {/* Party Badge */}
      <div style={{
        background: '#ff6b9d',
        color: '#fff',
        padding: '15px 40px',
        borderRadius: '30px',
        display: 'inline-block',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '40px',
        transform: 'rotate(-5deg)',
      }}>
        PARTY TIME!
      </div>
      
      {/* Event Name */}
      <h1 style={{
        fontSize: '64px',
        color: '#ff6b9d',
        margin: '30px 0',
        fontWeight: '900',
        textAlign: 'center',
        textShadow: '4px 4px 0 #ffd700, 8px 8px 0 #c084fc',
        lineHeight: '1.2',
      }}>
        {data.eventName}
      </h1>
      
      {/* Join Us */}
      <p style={{
        fontSize: '24px',
        color: '#666',
        textAlign: 'center',
        margin: '30px 0',
      }}>
        Join us to celebrate
      </p>
      
      {/* Host Name */}
      <h2 style={{
        fontSize: '48px',
        color: '#c084fc',
        textAlign: 'center',
        margin: '20px 0 50px 0',
        fontWeight: '900',
      }}>
        {data.hostName}
      </h2>
      
      {/* Details Bubbles */}
      <div style={{ marginTop: '50px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
          padding: '25px',
          borderRadius: '25px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <span style={{ fontSize: '36px' }}>📅</span>
          <div>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0', fontWeight: 'bold' }}>WHEN</p>
            <p style={{ fontSize: '20px', color: '#333', margin: '0', fontWeight: '900' }}>{data.date}</p>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
          padding: '25px',
          borderRadius: '25px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <span style={{ fontSize: '36px' }}>🕐</span>
          <div>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0', fontWeight: 'bold' }}>TIME</p>
            <p style={{ fontSize: '20px', color: '#333', margin: '0', fontWeight: '900' }}>{data.time}</p>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
          padding: '25px',
          borderRadius: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <span style={{ fontSize: '36px' }}>📍</span>
          <div>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0', fontWeight: 'bold' }}>WHERE</p>
            <p style={{ fontSize: '20px', color: '#333', margin: '0', fontWeight: '900' }}>{data.venue}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 3: Elegant Purple
export const ElegantPurpleTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #5b21b6 0%, #9333ea 100%)',
    padding: '50px',
    fontFamily: 'Georgia, serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '20px',
      padding: '60px',
      height: '100%',
      border: '3px solid rgba(147,51,234,0.3)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      {/* Decorative Top */}
      <div style={{
        width: '100px',
        height: '3px',
        background: '#9333ea',
        margin: '0 auto 40px auto',
      }}></div>
      
      {/* Event Name */}
      <h1 style={{
        fontSize: '52px',
        color: '#5b21b6',
        margin: '0 0 30px 0',
        fontWeight: '700',
        fontStyle: 'italic',
      }}>
        {data.eventName}
      </h1>
      
      {/* You're Invited */}
      <p style={{
        fontSize: '18px',
        color: '#666',
        margin: '0 0 30px 0',
        textTransform: 'uppercase',
        letterSpacing: '3px',
      }}>
        You're Cordially Invited
      </p>
      
      {/* Host Name */}
      <h2 style={{
        fontSize: '40px',
        color: '#9333ea',
        margin: '30px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      {/* Decorative Middle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        margin: '40px 0',
      }}>
        <div style={{ width: '80px', height: '1px', background: '#9333ea' }}></div>
        <span style={{ fontSize: '24px' }}>✦</span>
        <div style={{ width: '80px', height: '1px', background: '#9333ea' }}></div>
      </div>
      
      {/* Details */}
      <div style={{ margin: '40px 0' }}>
        <p style={{ fontSize: '20px', color: '#5b21b6', margin: '15px 0', fontWeight: '600' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '20px', color: '#5b21b6', margin: '15px 0', fontWeight: '600' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '20px', color: '#5b21b6', margin: '15px 0', fontWeight: '600' }}>
          {data.venue}
        </p>
      </div>
      
      {/* Decorative Bottom */}
      <div style={{
        width: '100px',
        height: '3px',
        background: '#9333ea',
        margin: '40px auto 0 auto',
      }}></div>
    </div>
  </div>
);



// BIRTHDAY TEMPLATE 4: Rose Red Romance
export const RoseRedTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: '#1a0000',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Red Rose Background */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'linear-gradient(rgba(26,0,0,0.7), rgba(26,0,0,0.9))',
    }}></div>
    
    <div style={{
      position: 'relative',
      zIndex: 10,
      padding: '80px 60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#ffd700',
    }}>
      {/* Names in Gold Script */}
      <h1 style={{
        fontSize: '72px',
        fontFamily: 'Edwardian Script ITC, cursive',
        color: '#ffd700',
        margin: '0 0 20px 0',
        fontWeight: '400',
        textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
      }}>
        {data.hostName}
      </h1>
      
      {/* Event Type */}
      <p style={{
        fontSize: '24px',
        color: '#fff',
        margin: '30px 0',
        letterSpacing: '4px',
        textTransform: 'uppercase',
      }}>
        {data.eventName}
      </p>
      
      {/* Decorative Line */}
      <div style={{
        width: '200px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
        margin: '30px auto',
      }}></div>
      
      {/* Details */}
      <div style={{ margin: '40px 0', color: '#fff' }}>
        <p style={{ fontSize: '20px', margin: '15px 0' }}>{data.date}</p>
        <p style={{ fontSize: '20px', margin: '15px 0' }}>{data.time}</p>
        <p style={{ fontSize: '20px', margin: '15px 0' }}>{data.venue}</p>
      </div>
      
      {/* Message */}
      {data.message && (
        <p style={{
          fontSize: '18px',
          color: '#ffd700',
          marginTop: '40px',
          fontStyle: 'italic',
        }}>
          {data.message}
        </p>
      )}
    </div>
  </div>
);

// ANNIVERSARY TEMPLATE 1: 10th Anniversary Black & Gold
export const TenthAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    padding: '60px',
    fontFamily: 'Garamond, serif',
    position: 'relative',
  }}>
    {/* Gold Balloons */}
    <div style={{
      position: 'absolute',
      top: '100px',
      left: '50px',
      fontSize: '60px',
      opacity: 0.3,
    }}>🎈</div>
    
    <div style={{
      position: 'relative',
      zIndex: 10,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      {/* Big Number */}
      <div style={{
        fontSize: '180px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '30px',
      }}>
        {data.year || '10'}
      </div>
      
      {/* Anniversary Text */}
      <h1 style={{
        fontSize: '48px',
        color: '#ffd700',
        margin: '0 0 40px 0',
        fontWeight: '400',
        letterSpacing: '3px',
      }}>
        ANNIVERSARY
      </h1>
      
      {/* Celebrating */}
      <p style={{
        fontSize: '20px',
        color: '#fff',
        margin: '30px 0 20px 0',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        Celebrating
      </p>
      
      {/* Names */}
      <h2 style={{
        fontSize: '42px',
        color: '#ffd700',
        margin: '0 0 50px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      {/* Details Box */}
      <div style={{
        background: 'rgba(255,215,0,0.1)',
        border: '2px solid #ffd700',
        padding: '30px',
        borderRadius: '10px',
      }}>
        <p style={{ fontSize: '20px', color: '#fff', margin: '10px 0' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '20px', color: '#fff', margin: '10px 0' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '20px', color: '#fff', margin: '10px 0' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// ANNIVERSARY TEMPLATE 2: 50th Golden Anniversary
export const GoldenAnniversaryClassicTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #2d1810 0%, #1a0f09 100%)',
    padding: '50px',
    fontFamily: 'Baskerville, serif',
  }}>
    <div style={{
      background: 'rgba(255,215,0,0.95)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      border: '8px solid #fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      {/* Gold Number Circle */}
      <div style={{
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b4513 0%, #6b3410 100%)',
        border: '6px solid #fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 40px auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}>
        <span style={{
          fontSize: '80px',
          fontWeight: '700',
          color: '#ffd700',
          lineHeight: '1',
        }}>
          50
        </span>
        <span style={{
          fontSize: '20px',
          color: '#ffd700',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}>
          Years
        </span>
      </div>
      
      {/* Golden Anniversary */}
      <h1 style={{
        fontSize: '52px',
        color: '#8b4513',
        margin: '0 0 40px 0',
        fontWeight: '700',
      }}>
        Golden Anniversary
      </h1>
      
      {/* Names */}
      <h2 style={{
        fontSize: '36px',
        color: '#6b3410',
        margin: '0 0 50px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      {/* Details */}
      <div style={{
        padding: '30px',
        background: 'rgba(139,69,19,0.1)',
        borderRadius: '15px',
      }}>
        <p style={{ fontSize: '22px', color: '#8b4513', margin: '12px 0', fontWeight: '600' }}>
          📅 {data.date}
        </p>
        <p style={{ fontSize: '22px', color: '#8b4513', margin: '12px 0', fontWeight: '600' }}>
          🕐 {data.time}
        </p>
        <p style={{ fontSize: '22px', color: '#8b4513', margin: '12px 0', fontWeight: '600' }}>
          📍 {data.venue}
        </p>
      </div>
      
      {/* Message */}
      {data.message && (
        <p style={{
          fontSize: '18px',
          color: '#6b3410',
          marginTop: '30px',
          fontStyle: 'italic',
        }}>
          {data.message}
        </p>
      )}
    </div>
  </div>
);

// WEDDING TEMPLATE 1: Modern Navy & Gold
export const NavyGoldWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
    padding: '60px',
    fontFamily: 'Playfair Display, serif',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      padding: '60px 50px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '3px solid #ffd700',
    }}>
      {/* Together with families */}
      <p style={{
        fontSize: '16px',
        color: '#666',
        margin: '0 0 30px 0',
        textTransform: 'uppercase',
        letterSpacing: '3px',
      }}>
        Together with their families
      </p>
      
      {/* Names */}
      <h1 style={{
        fontSize: '56px',
        color: '#1e3a8a',
        margin: '0',
        fontWeight: '700',
        lineHeight: '1.2',
      }}>
        {data.hostName}
      </h1>
      
      {/* & */}
      <div style={{
        fontSize: '48px',
        color: '#ffd700',
        margin: '20px 0',
        fontStyle: 'italic',
      }}>
        &
      </div>
      
      <h1 style={{
        fontSize: '56px',
        color: '#1e3a8a',
        margin: '0 0 40px 0',
        fontWeight: '700',
        lineHeight: '1.2',
      }}>
        {(data as any).data?.guestName || 'Partner Name'}
      </h1>
      
      {/* Invite you */}
      <p style={{
        fontSize: '18px',
        color: '#555',
        margin: '30px 0',
        fontStyle: 'italic',
      }}>
        Invite you to celebrate their wedding
      </p>
      
      {/* Gold Divider */}
      <div style={{
        width: '150px',
        height: '2px',
        background: '#ffd700',
        margin: '30px auto',
      }}></div>
      
      {/* Details */}
      <div style={{ margin: '30px 0' }}>
        <p style={{ fontSize: '20px', color: '#1e3a8a', margin: '15px 0', fontWeight: '600' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '20px', color: '#1e3a8a', margin: '15px 0', fontWeight: '600' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '20px', color: '#1e3a8a', margin: '15px 0', fontWeight: '600' }}>
          {data.venue}
        </p>
      </div>
      
      {/* RSVP */}
      <p style={{
        fontSize: '14px',
        color: '#999',
        marginTop: '30px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
      }}>
        Kindly RSVP
      </p>
    </div>
  </div>
);

// CORPORATE TEMPLATE 1: Modern Company Event
export const ModernCompanyEventTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    display: 'flex',
    fontFamily: 'Inter, sans-serif',
  }}>
    {/* Left Panel - Dark */}
    <div style={{
      width: '320px',
      background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)',
      padding: '60px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* Company Logo Placeholder */}
      <div style={{
        width: '120px',
        height: '120px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        marginBottom: '40px',
        border: '3px solid rgba(255,255,255,0.2)',
      }}>
        🏢
      </div>
      
      {/* Event Type */}
      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.7)',
        margin: '0',
        textTransform: 'uppercase',
        letterSpacing: '3px',
      }}>
        Corporate Event
      </p>
    </div>
    
    {/* Right Panel - White */}
    <div style={{
      flex: 1,
      background: '#fff',
      padding: '60px 50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* Event Name */}
      <h1 style={{
        fontSize: '48px',
        color: '#0f172a',
        margin: '0 0 20px 0',
        fontWeight: '800',
        lineHeight: '1.2',
      }}>
        {data.eventName}
      </h1>
      
      {/* Blue Line */}
      <div style={{
        width: '100px',
        height: '4px',
        background: '#1e40af',
        marginBottom: '30px',
      }}></div>
      
      {/* Organized By */}
      <p style={{
        fontSize: '14px',
        color: '#64748b',
        margin: '0 0 10px 0',
        textTransform: 'uppercase',
        letterSpacing: '2px',
      }}>
        Organized By
      </p>
      
      <h2 style={{
        fontSize: '28px',
        color: '#1e293b',
        margin: '0 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      {/* Details Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          padding: '15px 20px',
          background: '#f1f5f9',
          borderRadius: '8px',
          borderLeft: '4px solid #1e40af',
        }}>
          <span style={{ fontSize: '24px' }}>📅</span>
          <div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
            <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.date}</p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          padding: '15px 20px',
          background: '#f1f5f9',
          borderRadius: '8px',
          borderLeft: '4px solid #1e40af',
        }}>
          <span style={{ fontSize: '24px' }}>🕐</span>
          <div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</p>
            <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.time}</p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          padding: '15px 20px',
          background: '#f1f5f9',
          borderRadius: '8px',
          borderLeft: '4px solid #1e40af',
        }}>
          <span style={{ fontSize: '24px' }}>📍</span>
          <div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</p>
            <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.venue}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 5: Neon Glow Party
export const NeonGlowTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: '#000',
    padding: '50px',
    fontFamily: 'Impact, sans-serif',
    position: 'relative',
  }}>
    {/* Neon Glow Effect */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(0,255,255,0.3) 0%, transparent 70%)',
      filter: 'blur(60px)',
    }}></div>
    
    <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{
        fontSize: '72px',
        color: '#00ffff',
        margin: '0 0 20px 0',
        fontWeight: '900',
        textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
        textTransform: 'uppercase',
      }}>
        {data.eventName}
      </h1>
      
      <div style={{
        width: '200px',
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #ff00ff, transparent)',
        margin: '30px auto',
        boxShadow: '0 0 20px #ff00ff',
      }}></div>
      
      <h2 style={{
        fontSize: '48px',
        color: '#ff00ff',
        margin: '30px 0',
        fontWeight: '700',
        textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff',
      }}>
        {data.hostName}
      </h2>
      
      {data.age && (
        <div style={{
          fontSize: '120px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '20px 0',
          textShadow: '0 0 40px rgba(0,255,255,0.5)',
        }}>
          {data.age}
        </div>
      )}
      
      <div style={{ marginTop: '50px', color: '#fff' }}>
        <p style={{ fontSize: '20px', margin: '10px 0', textShadow: '0 0 10px #00ffff' }}>{data.date}</p>
        <p style={{ fontSize: '20px', margin: '10px 0', textShadow: '0 0 10px #ff00ff' }}>{data.time}</p>
        <p style={{ fontSize: '20px', margin: '10px 0', textShadow: '0 0 10px #00ffff' }}>{data.venue}</p>
      </div>
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 6: Vintage Kraft Paper
export const VintageKraftTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #d2b48c 0%, #c19a6b 100%)',
    padding: '60px',
    fontFamily: 'Courier New, monospace',
  }}>
    <div style={{
      background: '#f5f5dc',
      borderRadius: '15px',
      padding: '60px',
      height: '100%',
      border: '8px double #8b4513',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      boxShadow: 'inset 0 0 50px rgba(139,69,19,0.1)',
    }}>
      {/* Vintage Badge */}
      <div style={{
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        border: '5px solid #8b4513',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 40px auto',
        background: '#d2b48c',
      }}>
        <span style={{ fontSize: '36px' }}>🎂</span>
      </div>
      
      <h1 style={{
        fontSize: '48px',
        color: '#8b4513',
        margin: '0 0 20px 0',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '3px',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#a0522d',
        margin: '20px 0 30px 0',
        letterSpacing: '2px',
      }}>
        Please Join Us To Celebrate
      </p>
      
      <h2 style={{
        fontSize: '40px',
        color: '#8b4513',
        margin: '20px 0 40px 0',
        fontWeight: '600',
        fontStyle: 'italic',
      }}>
        {data.hostName}
      </h2>
      
      {/* Decorative Line */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        margin: '30px 0',
      }}>
        <div style={{ width: '100px', height: '2px', background: '#8b4513' }}></div>
        <span style={{ fontSize: '20px' }}>✦</span>
        <div style={{ width: '100px', height: '2px', background: '#8b4513' }}></div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <p style={{ fontSize: '18px', color: '#8b4513', margin: '12px 0', fontWeight: '600' }}>{data.date}</p>
        <p style={{ fontSize: '18px', color: '#8b4513', margin: '12px 0', fontWeight: '600' }}>{data.time}</p>
        <p style={{ fontSize: '18px', color: '#8b4513', margin: '12px 0', fontWeight: '600' }}>{data.venue}</p>
      </div>
    </div>
  </div>
);


// BIRTHDAY TEMPLATE 7: Kids Cartoon Fun
export const KidsCartoonTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    padding: '40px',
    fontFamily: 'Comic Sans MS, cursive',
    position: 'relative',
  }}>
    {/* Fun Emojis */}
    <div style={{ position: 'absolute', top: '30px', left: '30px', fontSize: '50px', transform: 'rotate(-20deg)' }}>🎈</div>
    <div style={{ position: 'absolute', top: '50px', right: '30px', fontSize: '50px', transform: 'rotate(20deg)' }}>🎂</div>
    <div style={{ position: 'absolute', bottom: '80px', left: '40px', fontSize: '50px', transform: 'rotate(15deg)' }}>🎁</div>
    <div style={{ position: 'absolute', bottom: '100px', right: '50px', fontSize: '50px', transform: 'rotate(-15deg)' }}>🍭</div>
    
    <div style={{
      background: '#fff',
      borderRadius: '50px',
      padding: '60px',
      height: '100%',
      border: '12px solid #ef4444',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2), inset 0 0 0 8px #fbbf24',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
        padding: '15px 30px',
        borderRadius: '50px',
        display: 'inline-block',
        margin: '0 auto 30px auto',
        color: '#fff',
        fontSize: '20px',
        fontWeight: '900',
        transform: 'rotate(-3deg)',
        boxShadow: '0 5px 20px rgba(236,72,153,0.4)',
      }}>
        🎉 PARTY TIME! 🎉
      </div>
      
      {data.age && (
        <div style={{
          fontSize: '120px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #ec4899, #f97316, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1',
          margin: '20px 0',
        }}>
          {data.age}
        </div>
      )}
      
      <h1 style={{
        fontSize: '56px',
        color: '#ef4444',
        margin: '20px 0',
        fontWeight: '900',
        textShadow: '5px 5px 0 #fbbf24',
        textTransform: 'uppercase',
      }}>
        {data.hostName}
      </h1>
      
      <p style={{
        fontSize: '24px',
        color: '#f97316',
        margin: '20px 0',
        fontWeight: '700',
      }}>
        is turning {data.age}!
      </p>
      
      <div style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        padding: '30px',
        borderRadius: '30px',
        marginTop: '30px',
        border: '4px solid #ef4444',
      }}>
        <p style={{ fontSize: '20px', color: '#7c2d12', margin: '10px 0', fontWeight: '900' }}>📅 {data.date}</p>
        <p style={{ fontSize: '20px', color: '#7c2d12', margin: '10px 0', fontWeight: '900' }}>🕐 {data.time}</p>
        <p style={{ fontSize: '20px', color: '#7c2d12', margin: '10px 0', fontWeight: '900' }}>📍 {data.venue}</p>
      </div>
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 8: Minimalist Modern
export const MinimalistModernTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: '#fff',
    padding: '80px 60px',
    fontFamily: 'Helvetica Neue, sans-serif',
  }}>
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* Minimalist Line Accent */}
      <div style={{
        width: '80px',
        height: '4px',
        background: '#000',
        marginBottom: '40px',
      }}></div>
      
      <h2 style={{
        fontSize: '16px',
        color: '#666',
        margin: '0 0 20px 0',
        fontWeight: '400',
        letterSpacing: '4px',
        textTransform: 'uppercase',
      }}>
        You're Invited
      </h2>
      
      <h1 style={{
        fontSize: '64px',
        color: '#000',
        margin: '0 0 30px 0',
        fontWeight: '700',
        lineHeight: '1.1',
        letterSpacing: '-2px',
      }}>
        {data.hostName}
      </h1>
      
      <p style={{
        fontSize: '28px',
        color: '#333',
        margin: '20px 0 50px 0',
        fontWeight: '300',
      }}>
        {data.eventName}
      </p>
      
      {/* Details in Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: '20px',
        marginTop: '50px',
        paddingTop: '40px',
        borderTop: '1px solid #e5e5e5',
      }}>
        <div>
          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Date</p>
          <p style={{ fontSize: '18px', color: '#000', margin: '0', fontWeight: '600' }}>{data.date}</p>
        </div>
        <div></div>
        
        <div>
          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Time</p>
          <p style={{ fontSize: '18px', color: '#000', margin: '0', fontWeight: '600' }}>{data.time}</p>
        </div>
        <div></div>
        
        <div>
          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Location</p>
          <p style={{ fontSize: '18px', color: '#000', margin: '0', fontWeight: '600' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);


// BIRTHDAY TEMPLATE 9: Floral Garden Party
export const FloralGardenTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    padding: '50px',
    fontFamily: 'Georgia, serif',
    position: 'relative',
  }}>
    {/* Flower Emojis */}
    <div style={{ position: 'absolute', top: '40px', left: '40px', fontSize: '60px', opacity: 0.6 }}>🌸</div>
    <div style={{ position: 'absolute', top: '80px', right: '50px', fontSize: '70px', opacity: 0.6 }}>🌺</div>
    <div style={{ position: 'absolute', bottom: '100px', left: '50px', fontSize: '65px', opacity: 0.6 }}>🌷</div>
    
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '3px solid #ec4899',
      boxShadow: '0 20px 60px rgba(236,72,153,0.3)',
    }}>
      <div style={{
        fontSize: '80px',
        marginBottom: '30px',
      }}>
        🌹
      </div>
      
      <h1 style={{
        fontSize: '52px',
        color: '#be185d',
        margin: '0 0 20px 0',
        fontWeight: '700',
        fontStyle: 'italic',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#9f1239',
        margin: '20px 0',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        Garden Party Celebration
      </p>
      
      <h2 style={{
        fontSize: '40px',
        color: '#ec4899',
        margin: '30px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      {/* Decorative Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        margin: '30px 0',
      }}>
        <span style={{ fontSize: '24px' }}>🌿</span>
        <div style={{ width: '100px', height: '2px', background: '#ec4899' }}></div>
        <span style={{ fontSize: '24px' }}>🌿</span>
      </div>
      
      <div style={{
        background: '#fce7f3',
        padding: '30px',
        borderRadius: '20px',
        border: '2px solid #ec4899',
      }}>
        <p style={{ fontSize: '20px', color: '#be185d', margin: '10px 0', fontWeight: '600' }}>{data.date}</p>
        <p style={{ fontSize: '20px', color: '#be185d', margin: '10px 0', fontWeight: '600' }}>{data.time}</p>
        <p style={{ fontSize: '20px', color: '#be185d', margin: '10px 0', fontWeight: '600' }}>{data.venue}</p>
      </div>
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 10: Geometric Blue
export const GeometricBlueTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    padding: '50px',
    fontFamily: 'Futura, sans-serif',
    position: 'relative',
  }}>
    {/* Geometric Shapes */}
    <div style={{
      position: 'absolute',
      top: '80px',
      left: '80px',
      width: '100px',
      height: '100px',
      border: '4px solid rgba(255,255,255,0.3)',
      borderRadius: '50%',
    }}></div>
    <div style={{
      position: 'absolute',
      bottom: '100px',
      right: '100px',
      width: '80px',
      height: '80px',
      border: '4px solid rgba(255,255,255,0.3)',
      transform: 'rotate(45deg)',
    }}></div>
    
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Top Accent */}
      <div style={{
        width: '60px',
        height: '60px',
        background: '#0ea5e9',
        borderRadius: '50%',
        margin: '0 auto 30px auto',
      }}></div>
      
      <h1 style={{
        fontSize: '56px',
        color: '#0c4a6e',
        margin: '0 0 20px 0',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '2px',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#0369a1',
        margin: '20px 0 30px 0',
        letterSpacing: '3px',
      }}>
        JOIN US TO CELEBRATE
      </p>
      
      <h2 style={{
        fontSize: '44px',
        color: '#0ea5e9',
        margin: '20px 0 50px 0',
        fontWeight: '700',
      }}>
        {data.hostName}
      </h2>
      
      {/* Details in Modern Boxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          padding: '20px',
          borderRadius: '10px',
          borderLeft: '5px solid #0ea5e9',
          textAlign: 'left',
        }}>
          <p style={{ fontSize: '12px', color: '#0369a1', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Date</p>
          <p style={{ fontSize: '18px', color: '#0c4a6e', margin: '0', fontWeight: '700' }}>{data.date}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          padding: '20px',
          borderRadius: '10px',
          borderLeft: '5px solid #0ea5e9',
          textAlign: 'left',
        }}>
          <p style={{ fontSize: '12px', color: '#0369a1', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Time</p>
          <p style={{ fontSize: '18px', color: '#0c4a6e', margin: '0', fontWeight: '700' }}>{data.time}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          padding: '20px',
          borderRadius: '10px',
          borderLeft: '5px solid #0ea5e9',
          textAlign: 'left',
        }}>
          <p style={{ fontSize: '12px', color: '#0369a1', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Venue</p>
          <p style={{ fontSize: '18px', color: '#0c4a6e', margin: '0', fontWeight: '700' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);


// BIRTHDAY TEMPLATE 11: Tropical Paradise
export const TropicalParadiseTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    padding: '50px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  }}>
    {/* Tropical Elements */}
    <div style={{ position: 'absolute', top: '40px', left: '40px', fontSize: '70px' }}>🌴</div>
    <div style={{ position: 'absolute', top: '60px', right: '40px', fontSize: '60px' }}>🥥</div>
    <div style={{ position: 'absolute', bottom: '80px', left: '50px', fontSize: '65px' }}>🍹</div>
    <div style={{ position: 'absolute', bottom: '100px', right: '60px', fontSize: '55px' }}>🏖️</div>
    
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '40px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '5px solid #f59e0b',
      boxShadow: '0 25px 70px rgba(0,0,0,0.3)',
    }}>
      <h1 style={{
        fontSize: '64px',
        background: 'linear-gradient(135deg, #14b8a6 0%, #f59e0b 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 20px 0',
        fontWeight: '900',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '20px',
        color: '#0d9488',
        margin: '20px 0',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '3px',
      }}>
        🌺 Tropical Party 🌺
      </p>
      
      <h2 style={{
        fontSize: '42px',
        color: '#f59e0b',
        margin: '30px 0',
        fontWeight: '700',
      }}>
        {data.hostName}
      </h2>
      
      {data.age && (
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '56px',
          fontWeight: '900',
          margin: '20px auto',
          border: '5px solid #f59e0b',
        }}>
          {data.age}
        </div>
      )}
      
      <div style={{
        background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
        padding: '30px',
        borderRadius: '25px',
        marginTop: '30px',
        border: '3px solid #14b8a6',
      }}>
        <p style={{ fontSize: '20px', color: '#115e59', margin: '12px 0', fontWeight: '700' }}>📅 {data.date}</p>
        <p style={{ fontSize: '20px', color: '#115e59', margin: '12px 0', fontWeight: '700' }}>🕐 {data.time}</p>
        <p style={{ fontSize: '20px', color: '#115e59', margin: '12px 0', fontWeight: '700' }}>📍 {data.venue}</p>
      </div>
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 12: Luxury Black & White
export const LuxuryBlackWhiteTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: '#fff',
    padding: '80px',
    fontFamily: 'Didot, serif',
  }}>
    <div style={{
      border: '3px solid #000',
      padding: '50px',
      height: '100%',
      position: 'relative',
    }}>
      {/* Inner Border */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        right: '15px',
        bottom: '15px',
        border: '1px solid #000',
      }}></div>
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: '0 0 30px 0',
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}>
          You Are Cordially Invited To
        </p>
        
        <h1 style={{
          fontSize: '58px',
          color: '#000',
          margin: '0',
          fontWeight: '400',
          lineHeight: '1.2',
          marginBottom: '30px',
        }}>
          {data.eventName}
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '30px 0 20px 0',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          In Honor Of
        </p>
        
        <h2 style={{
          fontSize: '42px',
          color: '#000',
          margin: '0 0 50px 0',
          fontWeight: '600',
        }}>
          {data.hostName}
        </h2>
        
        {/* Decorative Diamond */}
        <div style={{
          width: '40px',
          height: '40px',
          background: '#000',
          transform: 'rotate(45deg)',
          margin: '30px auto',
        }}></div>
        
        <div style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '18px', color: '#000', margin: '15px 0', fontWeight: '600' }}>{data.date}</p>
          <p style={{ fontSize: '18px', color: '#000', margin: '15px 0', fontWeight: '600' }}>{data.time}</p>
          <p style={{ fontSize: '18px', color: '#000', margin: '15px 0', fontWeight: '600' }}>{data.venue}</p>
        </div>
        
        {data.message && (
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '40px',
            fontStyle: 'italic',
            letterSpacing: '1px',
          }}>
            {data.message}
          </p>
        )}
      </div>
    </div>
  </div>
);


// BIRTHDAY TEMPLATE 13: Pastel Rainbow
export const PastelRainbowTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #fce7f3 0%, #e0e7ff 50%, #dbeafe 100%)',
    padding: '50px',
    fontFamily: 'Quicksand, sans-serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '35px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    }}>
      <div style={{
        fontSize: '90px',
        marginBottom: '20px',
      }}>
        🌈
      </div>
      
      <h1 style={{
        fontSize: '60px',
        background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 25%, #3b82f6 50%, #10b981 75%, #f59e0b 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 20px 0',
        fontWeight: '800',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '20px',
        color: '#8b5cf6',
        margin: '20px 0',
        fontWeight: '600',
      }}>
        Let's celebrate together!
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#ec4899',
        margin: '20px 0 40px 0',
        fontWeight: '700',
      }}>
        {data.hostName}
      </h2>
      
      {data.age && (
        <div style={{
          fontSize: '100px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '20px 0',
        }}>
          {data.age}
        </div>
      )}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '30px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #fce7f3 0%, #e0e7ff 100%)',
          padding: '18px',
          borderRadius: '20px',
        }}>
          <p style={{ fontSize: '18px', color: '#831843', margin: '0', fontWeight: '700' }}>📅 {data.date}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)',
          padding: '18px',
          borderRadius: '20px',
        }}>
          <p style={{ fontSize: '18px', color: '#312e81', margin: '0', fontWeight: '700' }}>🕐 {data.time}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #d1fae5 100%)',
          padding: '18px',
          borderRadius: '20px',
        }}>
          <p style={{ fontSize: '18px', color: '#065f46', margin: '0', fontWeight: '700' }}>📍 {data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 14: Starry Night
export const StarryNightTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    padding: '50px',
    fontFamily: 'Montserrat, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Stars */}
    <div style={{ position: 'absolute', top: '50px', left: '60px', fontSize: '40px' }}>✨</div>
    <div style={{ position: 'absolute', top: '100px', right: '80px', fontSize: '35px' }}>⭐</div>
    <div style={{ position: 'absolute', bottom: '150px', left: '70px', fontSize: '30px' }}>💫</div>
    <div style={{ position: 'absolute', bottom: '100px', right: '90px', fontSize: '38px' }}>✨</div>
    <div style={{ position: 'absolute', top: '200px', left: '100px', fontSize: '25px' }}>⭐</div>
    <div style={{ position: 'absolute', top: '300px', right: '100px', fontSize: '28px' }}>✨</div>
    
    <div style={{
      position: 'relative',
      zIndex: 10,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
    }}>
      <div style={{
        fontSize: '70px',
        marginBottom: '30px',
      }}>
        🌙
      </div>
      
      <h1 style={{
        fontSize: '56px',
        color: '#fbbf24',
        margin: '0 0 20px 0',
        fontWeight: '800',
        textShadow: '0 0 30px rgba(251,191,36,0.5)',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#c7d2fe',
        margin: '20px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Under The Stars
      </p>
      
      <h2 style={{
        fontSize: '42px',
        color: '#fff',
        margin: '30px 0 50px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      {/* Glowing Details Box */}
      <div style={{
        background: 'rgba(99,102,241,0.2)',
        border: '2px solid rgba(251,191,36,0.5)',
        borderRadius: '20px',
        padding: '35px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 40px rgba(251,191,36,0.3)',
      }}>
        <p style={{ fontSize: '20px', color: '#fbbf24', margin: '12px 0', fontWeight: '700' }}>📅 {data.date}</p>
        <p style={{ fontSize: '20px', color: '#fbbf24', margin: '12px 0', fontWeight: '700' }}>🕐 {data.time}</p>
        <p style={{ fontSize: '20px', color: '#fbbf24', margin: '12px 0', fontWeight: '700' }}>📍 {data.venue}</p>
      </div>
    </div>
  </div>
);


// BIRTHDAY TEMPLATE 15: Watercolor Art
export const WatercolorArtTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fecaca 100%)',
    padding: '50px',
    fontFamily: 'Brush Script MT, cursive',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        fontSize: '75px',
        marginBottom: '30px',
      }}>
        🎨
      </div>
      
      <h1 style={{
        fontSize: '52px',
        background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 25px 0',
        fontWeight: '400',
        lineHeight: '1.2',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '20px',
        color: '#f97316',
        margin: '20px 0',
        fontWeight: '600',
        fontFamily: 'Georgia, serif',
      }}>
        An artistic celebration for
      </p>
      
      <h2 style={{
        fontSize: '44px',
        color: '#ec4899',
        margin: '20px 0 40px 0',
        fontWeight: '400',
      }}>
        {data.hostName}
      </h2>
      
      {/* Paint Splatter Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        margin: '30px 0',
        fontSize: '30px',
      }}>
        <span>🎨</span>
        <span>🖌️</span>
        <span>🎨</span>
      </div>
      
      <div style={{
        background: 'rgba(251,146,60,0.15)',
        padding: '30px',
        borderRadius: '25px',
        border: '3px dashed #f97316',
      }}>
        <p style={{ fontSize: '20px', color: '#7c2d12', margin: '12px 0', fontWeight: '600', fontFamily: 'Georgia, serif' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '20px', color: '#7c2d12', margin: '12px 0', fontWeight: '600', fontFamily: 'Georgia, serif' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '20px', color: '#7c2d12', margin: '12px 0', fontWeight: '600', fontFamily: 'Georgia, serif' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// BIRTHDAY TEMPLATE 16: Cinema Movie Premiere
export const CinemaMovieTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: '#1a1a1a',
    padding: '50px',
    fontFamily: 'Impact, sans-serif',
    position: 'relative',
  }}>
    {/* Film Strip Border */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: '30px',
      right: '30px',
      height: '30px',
      background: 'repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 20px, #1a1a1a 20px, #1a1a1a 30px)',
    }}></div>
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: '30px',
      right: '30px',
      height: '30px',
      background: 'repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 20px, #1a1a1a 20px, #1a1a1a 30px)',
    }}></div>
    
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{
        fontSize: '80px',
        marginBottom: '20px',
      }}>
        🎬
      </div>
      
      <div style={{
        background: '#dc2626',
        padding: '12px 30px',
        borderRadius: '5px',
        display: 'inline-block',
        margin: '0 auto 30px auto',
        fontSize: '18px',
        fontWeight: '900',
        letterSpacing: '3px',
      }}>
        NOW SHOWING
      </div>
      
      <h1 style={{
        fontSize: '58px',
        color: '#fbbf24',
        margin: '0 0 20px 0',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '4px 4px 0 #dc2626',
        lineHeight: '1.1',
      }}>
        {data.hostName}
      </h1>
      
      <p style={{
        fontSize: '24px',
        color: '#fff',
        margin: '20px 0',
        fontWeight: '700',
        letterSpacing: '2px',
      }}>
        {data.eventName}
      </p>
      
      {data.age && (
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: '#fbbf24',
          color: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px',
          fontWeight: '900',
          margin: '30px auto',
          border: '5px solid #dc2626',
          boxShadow: '0 10px 30px rgba(251,191,36,0.5)',
        }}>
          {data.age}
        </div>
      )}
      
      <div style={{
        background: 'rgba(251,191,36,0.15)',
        border: '3px solid #fbbf24',
        padding: '30px',
        borderRadius: '10px',
        marginTop: '30px',
      }}>
        <p style={{ fontSize: '20px', color: '#fbbf24', margin: '10px 0', fontWeight: '700' }}>
          🎟️ {data.date}
        </p>
        <p style={{ fontSize: '20px', color: '#fbbf24', margin: '10px 0', fontWeight: '700' }}>
          🍿 {data.time}
        </p>
        <p style={{ fontSize: '20px', color: '#fbbf24', margin: '10px 0', fontWeight: '700' }}>
          📍 {data.venue}
        </p>
      </div>
    </div>
  </div>
);


// WEDDING TEMPLATE 2: Rose Garden Romance
export const RoseGardenWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    padding: '60px',
    fontFamily: 'Playfair Display, serif',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '25px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '2px solid #f9a8d4',
      boxShadow: '0 20px 60px rgba(236,72,153,0.2)',
    }}>
      <div style={{ fontSize: '60px', marginBottom: '30px' }}>🌹</div>
      
      <p style={{
        fontSize: '14px',
        color: '#be185d',
        margin: '0 0 30px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Together With Their Families
      </p>
      
      <h1 style={{
        fontSize: '52px',
        color: '#be185d',
        margin: '0',
        fontWeight: '700',
        lineHeight: '1.2',
      }}>
        {data.hostName}
      </h1>
      
      <div style={{
        fontSize: '38px',
        color: '#f9a8d4',
        margin: '25px 0',
        fontStyle: 'italic',
      }}>
        &
      </div>
      
      <h1 style={{
        fontSize: '52px',
        color: '#be185d',
        margin: '0 0 40px 0',
        fontWeight: '700',
        lineHeight: '1.2',
      }}>
        Partner Name
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#9f1239',
        margin: '30px 0',
        fontStyle: 'italic',
      }}>
        Request the honor of your presence at their wedding
      </p>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        margin: '30px 0',
      }}>
        <span style={{ fontSize: '20px' }}>🌹</span>
        <div style={{ width: '80px', height: '1px', background: '#f9a8d4' }}></div>
        <span style={{ fontSize: '20px' }}>🌹</span>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <p style={{ fontSize: '18px', color: '#be185d', margin: '12px 0', fontWeight: '600' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '18px', color: '#be185d', margin: '12px 0', fontWeight: '600' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '18px', color: '#be185d', margin: '12px 0', fontWeight: '600' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// WEDDING TEMPLATE 3: Beach Sunset Wedding
export const BeachSunsetWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(180deg, #fef3c7 0%, #fed7aa 50%, #fca5a5 100%)',
    padding: '50px',
    fontFamily: 'Georgia, serif',
    position: 'relative',
  }}>
    <div style={{ position: 'absolute', top: '50px', right: '60px', fontSize: '80px' }}>🌅</div>
    
    <div style={{
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '3px solid rgba(251,146,60,0.5)',
    }}>
      <p style={{
        fontSize: '14px',
        color: '#c2410c',
        margin: '0 0 20px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Beach Wedding Ceremony
      </p>
      
      <h1 style={{
        fontSize: '48px',
        color: '#ea580c',
        margin: '20px 0',
        fontWeight: '700',
      }}>
        {data.hostName}
      </h1>
      
      <div style={{
        fontSize: '35px',
        margin: '20px 0',
      }}>
        🏖️ & 🌴
      </div>
      
      <h1 style={{
        fontSize: '48px',
        color: '#ea580c',
        margin: '20px 0 40px 0',
        fontWeight: '700',
      }}>
        Partner Name
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#9a3412',
        margin: '20px 0',
        fontStyle: 'italic',
      }}>
        Are getting married by the sea
      </p>
      
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
        padding: '30px',
        borderRadius: '20px',
        marginTop: '40px',
        border: '2px solid #fb923c',
      }}>
        <p style={{ fontSize: '18px', color: '#9a3412', margin: '10px 0', fontWeight: '600' }}>
          🗓️ {data.date}
        </p>
        <p style={{ fontSize: '18px', color: '#9a3412', margin: '10px 0', fontWeight: '600' }}>
          ⏰ {data.time}
        </p>
        <p style={{ fontSize: '18px', color: '#9a3412', margin: '10px 0', fontWeight: '600' }}>
          🏖️ {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// WEDDING TEMPLATE 4: Classic Elegant White
export const ClassicElegantWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: '#f8f9fa',
    padding: '70px',
    fontFamily: 'Baskerville, serif',
  }}>
    <div style={{
      border: '2px solid #d1d5db',
      padding: '50px',
      height: '100%',
      background: '#fff',
    }}>
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '50px', marginBottom: '30px' }}>💍</div>
        
        <p style={{
          fontSize: '13px',
          color: '#6b7280',
          margin: '0 0 30px 0',
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}>
          The Wedding Celebration Of
        </p>
        
        <h1 style={{
          fontSize: '46px',
          color: '#1f2937',
          margin: '0 0 20px 0',
          fontWeight: '600',
        }}>
          {data.hostName}
        </h1>
        
        <p style={{
          fontSize: '24px',
          color: '#9ca3af',
          margin: '20px 0',
          fontStyle: 'italic',
        }}>
          and
        </p>
        
        <h1 style={{
          fontSize: '46px',
          color: '#1f2937',
          margin: '0 0 40px 0',
          fontWeight: '600',
        }}>
          Partner Name
        </h1>
        
        <div style={{
          width: '150px',
          height: '1px',
          background: '#d1d5db',
          margin: '30px auto',
        }}></div>
        
        <div style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '16px', color: '#4b5563', margin: '15px 0' }}>
            {data.date}
          </p>
          <p style={{ fontSize: '16px', color: '#4b5563', margin: '15px 0' }}>
            {data.time}
          </p>
          <p style={{ fontSize: '16px', color: '#4b5563', margin: '15px 0' }}>
            {data.venue}
          </p>
        </div>
        
        <p style={{
          fontSize: '13px',
          color: '#9ca3af',
          marginTop: '50px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Reception to follow
        </p>
      </div>
    </div>
  </div>
);


// WEDDING TEMPLATE 5: Rustic Barn Wedding
export const RusticBarnWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    padding: '60px',
    fontFamily: 'Courier New, monospace',
  }}>
    <div style={{
      background: '#fefce8',
      borderRadius: '20px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '4px solid #a16207',
      boxShadow: 'inset 0 0 40px rgba(161,98,7,0.1)',
    }}>
      <div style={{ fontSize: '55px', marginBottom: '25px' }}>🌾</div>
      
      <p style={{
        fontSize: '14px',
        color: '#78350f',
        margin: '0 0 25px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        fontWeight: '600',
      }}>
        Rustic Wedding
      </p>
      
      <h1 style={{
        fontSize: '50px',
        color: '#92400e',
        margin: '0 0 15px 0',
        fontWeight: '700',
      }}>
        {data.hostName}
      </h1>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        margin: '25px 0',
      }}>
        <div style={{ width: '60px', height: '2px', background: '#a16207' }}></div>
        <span style={{ fontSize: '24px' }}>🤎</span>
        <div style={{ width: '60px', height: '2px', background: '#a16207' }}></div>
      </div>
      
      <h1 style={{
        fontSize: '50px',
        color: '#92400e',
        margin: '15px 0 35px 0',
        fontWeight: '700',
      }}>
        Partner Name
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#78350f',
        margin: '25px 0',
        fontWeight: '600',
      }}>
        Join us for a rustic celebration
      </p>
      
      <div style={{
        background: '#fef3c7',
        padding: '25px',
        borderRadius: '15px',
        marginTop: '35px',
        border: '3px dashed #a16207',
      }}>
        <p style={{ fontSize: '17px', color: '#78350f', margin: '10px 0', fontWeight: '700' }}>
          📅 {data.date}
        </p>
        <p style={{ fontSize: '17px', color: '#78350f', margin: '10px 0', fontWeight: '700' }}>
          🕐 {data.time}
        </p>
        <p style={{ fontSize: '17px', color: '#78350f', margin: '10px 0', fontWeight: '700' }}>
          🏡 {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// WEDDING TEMPLATE 6: Garden Floral Wedding
export const GardenFloralWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    padding: '60px',
    fontFamily: 'Georgia, serif',
    position: 'relative',
  }}>
    {/* Floral decorations */}
    <div style={{ position: 'absolute', top: '40px', left: '40px', fontSize: '50px' }}>🌸</div>
    <div style={{ position: 'absolute', top: '60px', right: '50px', fontSize: '55px' }}>🌺</div>
    <div style={{ position: 'absolute', bottom: '80px', left: '50px', fontSize: '52px' }}>🌷</div>
    <div style={{ position: 'absolute', bottom: '100px', right: '45px', fontSize: '48px' }}>🌼</div>
    
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '3px solid #86efac',
    }}>
      <div style={{ fontSize: '65px', marginBottom: '25px' }}>🌿</div>
      
      <p style={{
        fontSize: '13px',
        color: '#166534',
        margin: '0 0 25px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Garden Wedding
      </p>
      
      <h1 style={{
        fontSize: '48px',
        color: '#15803d',
        margin: '0 0 20px 0',
        fontWeight: '700',
        fontStyle: 'italic',
      }}>
        {data.hostName}
      </h1>
      
      <p style={{
        fontSize: '26px',
        color: '#4ade80',
        margin: '20px 0',
        fontStyle: 'italic',
      }}>
        &
      </p>
      
      <h1 style={{
        fontSize: '48px',
        color: '#15803d',
        margin: '0 0 35px 0',
        fontWeight: '700',
        fontStyle: 'italic',
      }}>
        Partner Name
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#166534',
        margin: '25px 0',
      }}>
        Invite you to their garden ceremony
      </p>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        margin: '30px 0',
      }}>
        <span style={{ fontSize: '22px' }}>🌿</span>
        <div style={{ width: '80px', height: '2px', background: '#86efac' }}></div>
        <span style={{ fontSize: '22px' }}>🌿</span>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <p style={{ fontSize: '17px', color: '#166534', margin: '12px 0', fontWeight: '600' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '17px', color: '#166534', margin: '12px 0', fontWeight: '600' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '17px', color: '#166534', margin: '12px 0', fontWeight: '600' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// WEDDING TEMPLATE 7: Modern Geometric Wedding
export const ModernGeometricWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: '#fff',
    padding: '60px',
    fontFamily: 'Helvetica Neue, sans-serif',
  }}>
    <div style={{
      border: '3px solid #000',
      height: '100%',
      position: 'relative',
    }}>
      {/* Geometric accent */}
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        width: '100px',
        height: '100px',
        border: '3px solid #d4af37',
        transform: 'rotate(45deg)',
      }}></div>
      
      <div style={{
        padding: '60px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{
          width: '60px',
          height: '3px',
          background: '#d4af37',
          margin: '0 auto 35px auto',
        }}></div>
        
        <h1 style={{
          fontSize: '52px',
          color: '#000',
          margin: '0 0 25px 0',
          fontWeight: '300',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          {data.hostName}
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#d4af37',
          margin: '25px 0',
          fontWeight: '600',
        }}>
          &
        </p>
        
        <h1 style={{
          fontSize: '52px',
          color: '#000',
          margin: '0 0 40px 0',
          fontWeight: '300',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          Partner Name
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: '30px 0',
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}>
          Request The Pleasure Of Your Company
        </p>
        
        <div style={{
          width: '60px',
          height: '3px',
          background: '#d4af37',
          margin: '35px auto',
        }}></div>
        
        <div style={{ marginTop: '30px' }}>
          <p style={{ fontSize: '16px', color: '#000', margin: '15px 0' }}>
            {data.date}
          </p>
          <p style={{ fontSize: '16px', color: '#000', margin: '15px 0' }}>
            {data.time}
          </p>
          <p style={{ fontSize: '16px', color: '#000', margin: '15px 0' }}>
            {data.venue}
          </p>
        </div>
      </div>
    </div>
  </div>
);


// WEDDING TEMPLATE 8: Vintage Lace Wedding
export const VintageLaceWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #fdf4f5 0%, #f8e8ea 100%)',
    padding: '60px',
    fontFamily: 'Garamond, serif',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '25px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '3px solid #e0c3c7',
      boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontSize: '50px', marginBottom: '25px' }}>💐</div>
      
      <p style={{
        fontSize: '13px',
        color: '#8b6771',
        margin: '0 0 25px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Vintage Wedding
      </p>
      
      <h1 style={{
        fontSize: '46px',
        color: '#6b4852',
        margin: '0 0 18px 0',
        fontWeight: '600',
        fontStyle: 'italic',
      }}>
        {data.hostName}
      </h1>
      
      <div style={{
        fontSize: '30px',
        color: '#d4a5ae',
        margin: '18px 0',
      }}>
        ❤️
      </div>
      
      <h1 style={{
        fontSize: '46px',
        color: '#6b4852',
        margin: '18px 0 35px 0',
        fontWeight: '600',
        fontStyle: 'italic',
      }}>
        Partner Name
      </h1>
      
      <p style={{
        fontSize: '15px',
        color: '#8b6771',
        margin: '25px 0',
        fontStyle: 'italic',
      }}>
        Are delighted to invite you to their wedding
      </p>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        margin: '30px 0',
      }}>
        <div style={{ width: '70px', height: '1px', background: '#d4a5ae' }}></div>
        <span style={{ fontSize: '18px' }}>✦</span>
        <div style={{ width: '70px', height: '1px', background: '#d4a5ae' }}></div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <p style={{ fontSize: '16px', color: '#6b4852', margin: '12px 0', fontWeight: '500' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '16px', color: '#6b4852', margin: '12px 0', fontWeight: '500' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '16px', color: '#6b4852', margin: '12px 0', fontWeight: '500' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// WEDDING TEMPLATE 9: Burgundy & Gold Luxury
export const BurgundyGoldWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
    padding: '60px',
    fontFamily: 'Bodoni, serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '20px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '4px solid #fbbf24',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
        border: '3px solid #fbbf24',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 30px auto',
        fontSize: '35px',
      }}>
        💍
      </div>
      
      <p style={{
        fontSize: '12px',
        color: '#7f1d1d',
        margin: '0 0 25px 0',
        letterSpacing: '4px',
        textTransform: 'uppercase',
      }}>
        Luxury Wedding Celebration
      </p>
      
      <h1 style={{
        fontSize: '50px',
        color: '#991b1b',
        margin: '0 0 20px 0',
        fontWeight: '700',
      }}>
        {data.hostName}
      </h1>
      
      <div style={{
        fontSize: '32px',
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '20px 0',
        fontWeight: '700',
      }}>
        &
      </div>
      
      <h1 style={{
        fontSize: '50px',
        color: '#991b1b',
        margin: '0 0 40px 0',
        fontWeight: '700',
      }}>
        Partner Name
      </h1>
      
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '30px',
        borderRadius: '15px',
        border: '2px solid #fbbf24',
        marginTop: '30px',
      }}>
        <p style={{ fontSize: '17px', color: '#78350f', margin: '10px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '17px', color: '#78350f', margin: '10px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '17px', color: '#78350f', margin: '10px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// WEDDING TEMPLATE 10: Lavender Fields Wedding
export const LavenderWeddingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    padding: '60px',
    fontFamily: 'Palatino, serif',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '3px solid #c4b5fd',
    }}>
      <div style={{ fontSize: '55px', marginBottom: '25px' }}>💜</div>
      
      <p style={{
        fontSize: '13px',
        color: '#6b21a8',
        margin: '0 0 25px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Lavender Wedding
      </p>
      
      <h1 style={{
        fontSize: '48px',
        color: '#7c3aed',
        margin: '0 0 18px 0',
        fontWeight: '700',
      }}>
        {data.hostName}
      </h1>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        margin: '18px 0',
      }}>
        <span style={{ fontSize: '24px' }}>🌸</span>
        <span style={{ fontSize: '28px', color: '#a78bfa' }}>~</span>
        <span style={{ fontSize: '24px' }}>🌸</span>
      </div>
      
      <h1 style={{
        fontSize: '48px',
        color: '#7c3aed',
        margin: '18px 0 35px 0',
        fontWeight: '700',
      }}>
        Partner Name
      </h1>
      
      <p style={{
        fontSize: '15px',
        color: '#6b21a8',
        margin: '25px 0',
        fontStyle: 'italic',
      }}>
        Request the honor of your presence
      </p>
      
      <div style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        padding: '30px',
        borderRadius: '20px',
        marginTop: '35px',
        border: '2px solid #c4b5fd',
      }}>
        <p style={{ fontSize: '17px', color: '#5b21b6', margin: '10px 0', fontWeight: '600' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '17px', color: '#5b21b6', margin: '10px 0', fontWeight: '600' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '17px', color: '#5b21b6', margin: '10px 0', fontWeight: '600' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);


// ANNIVERSARY TEMPLATE 3: Silver 25th Anniversary
export const SilverAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
    padding: '60px',
    fontFamily: 'Arial, sans-serif',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '25px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '5px solid #9ca3af',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        border: '6px solid #6b7280',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 35px auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      }}>
        <span style={{
          fontSize: '72px',
          fontWeight: '900',
          color: '#4b5563',
          lineHeight: '1',
        }}>
          25
        </span>
        <span style={{
          fontSize: '16px',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginTop: '5px',
        }}>
          Years
        </span>
      </div>
      
      <h1 style={{
        fontSize: '48px',
        color: '#374151',
        margin: '0 0 25px 0',
        fontWeight: '800',
      }}>
        Silver Anniversary
      </h1>
      
      <h2 style={{
        fontSize: '36px',
        color: '#6b7280',
        margin: '0 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        padding: '30px',
        borderRadius: '15px',
        border: '3px solid #d1d5db',
        marginTop: '30px',
      }}>
        <p style={{ fontSize: '20px', color: '#374151', margin: '12px 0', fontWeight: '700' }}>
          📅 {data.date}
        </p>
        <p style={{ fontSize: '20px', color: '#374151', margin: '12px 0', fontWeight: '700' }}>
          🕐 {data.time}
        </p>
        <p style={{ fontSize: '20px', color: '#374151', margin: '12px 0', fontWeight: '700' }}>
          📍 {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// ANNIVERSARY TEMPLATE 4: Ruby 40th Anniversary
export const RubyAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
    padding: '60px',
    fontFamily: 'Times New Roman, serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.98)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '6px solid #dc2626',
    }}>
      <div style={{ fontSize: '70px', marginBottom: '25px' }}>💎</div>
      
      <div style={{
        fontSize: '90px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '20px',
      }}>
        40
      </div>
      
      <h1 style={{
        fontSize: '44px',
        color: '#991b1b',
        margin: '0 0 30px 0',
        fontWeight: '700',
      }}>
        Ruby Anniversary
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#7f1d1d',
        margin: '20px 0',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        Celebrating
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#dc2626',
        margin: '20px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'rgba(220,38,38,0.1)',
        padding: '30px',
        borderRadius: '20px',
        border: '3px solid #dc2626',
      }}>
        <p style={{ fontSize: '19px', color: '#7f1d1d', margin: '12px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '19px', color: '#7f1d1d', margin: '12px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '19px', color: '#7f1d1d', margin: '12px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// ANNIVERSARY TEMPLATE 5: Pearl 30th Anniversary
export const PearlAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    padding: '60px',
    fontFamily: 'Garamond, serif',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '4px solid #bae6fd',
      boxShadow: '0 20px 60px rgba(14,165,233,0.2)',
    }}>
      <div style={{ fontSize: '65px', marginBottom: '25px' }}>🦪</div>
      
      <div style={{
        fontSize: '100px',
        fontWeight: '900',
        color: '#0284c7',
        lineHeight: '1',
        marginBottom: '15px',
      }}>
        30
      </div>
      
      <h1 style={{
        fontSize: '46px',
        color: '#0369a1',
        margin: '0 0 30px 0',
        fontWeight: '700',
      }}>
        Pearl Anniversary
      </h1>
      
      <p style={{
        fontSize: '17px',
        color: '#075985',
        margin: '20px 0',
        fontStyle: 'italic',
      }}>
        Three decades of love
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#0284c7',
        margin: '20px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        padding: '30px',
        borderRadius: '20px',
        border: '3px solid #7dd3fc',
      }}>
        <p style={{ fontSize: '19px', color: '#075985', margin: '12px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '19px', color: '#075985', margin: '12px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '19px', color: '#075985', margin: '12px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);


// ANNIVERSARY TEMPLATE 6: Diamond 60th Anniversary
export const DiamondAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '60px',
    fontFamily: 'Georgia, serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '25px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '5px solid #94a3b8',
      boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>💎</div>
      
      <div style={{
        fontSize: '110px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '20px',
      }}>
        60
      </div>
      
      <h1 style={{
        fontSize: '50px',
        color: '#334155',
        margin: '0 0 25px 0',
        fontWeight: '800',
      }}>
        Diamond Anniversary
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#475569',
        margin: '20px 0',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        60 Years of Marriage
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#64748b',
        margin: '20px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        padding: '30px',
        borderRadius: '15px',
        border: '3px solid #94a3b8',
      }}>
        <p style={{ fontSize: '20px', color: '#1e293b', margin: '12px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '20px', color: '#1e293b', margin: '12px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '20px', color: '#1e293b', margin: '12px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// ANNIVERSARY TEMPLATE 7: Emerald 55th Anniversary
export const EmeraldAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    padding: '60px',
    fontFamily: 'Palatino, serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.97)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '5px solid #10b981',
    }}>
      <div style={{ fontSize: '75px', marginBottom: '25px' }}>💚</div>
      
      <div style={{
        fontSize: '95px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '20px',
      }}>
        55
      </div>
      
      <h1 style={{
        fontSize: '48px',
        color: '#065f46',
        margin: '0 0 30px 0',
        fontWeight: '700',
      }}>
        Emerald Anniversary
      </h1>
      
      <p style={{
        fontSize: '17px',
        color: '#047857',
        margin: '20px 0',
        fontStyle: 'italic',
      }}>
        55 years of precious memories
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#10b981',
        margin: '20px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        padding: '30px',
        borderRadius: '20px',
        border: '3px solid #10b981',
      }}>
        <p style={{ fontSize: '19px', color: '#064e3b', margin: '12px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '19px', color: '#064e3b', margin: '12px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '19px', color: '#064e3b', margin: '12px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// ANNIVERSARY TEMPLATE 8: Sapphire 45th Anniversary
export const SapphireAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    padding: '60px',
    fontFamily: 'Baskerville, serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.96)',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '5px solid #3b82f6',
    }}>
      <div style={{ fontSize: '72px', marginBottom: '25px' }}>💙</div>
      
      <div style={{
        fontSize: '98px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '20px',
      }}>
        45
      </div>
      
      <h1 style={{
        fontSize: '48px',
        color: '#1e40af',
        margin: '0 0 30px 0',
        fontWeight: '700',
      }}>
        Sapphire Anniversary
      </h1>
      
      <p style={{
        fontSize: '17px',
        color: '#1e3a8a',
        margin: '20px 0',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        45 Years Together
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#2563eb',
        margin: '20px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        padding: '30px',
        borderRadius: '20px',
        border: '3px solid #3b82f6',
      }}>
        <p style={{ fontSize: '19px', color: '#1e3a8a', margin: '12px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '19px', color: '#1e3a8a', margin: '12px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '19px', color: '#1e3a8a', margin: '12px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);


// ANNIVERSARY TEMPLATE 9: Coral 35th Anniversary
export const CoralAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
    padding: '60px',
    fontFamily: 'Georgia, serif',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '30px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '4px solid #fb923c',
      boxShadow: '0 20px 60px rgba(251,146,60,0.3)',
    }}>
      <div style={{ fontSize: '70px', marginBottom: '25px' }}>🪸</div>
      
      <div style={{
        fontSize: '92px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '20px',
      }}>
        35
      </div>
      
      <h1 style={{
        fontSize: '46px',
        color: '#c2410c',
        margin: '0 0 30px 0',
        fontWeight: '700',
      }}>
        Coral Anniversary
      </h1>
      
      <p style={{
        fontSize: '17px',
        color: '#9a3412',
        margin: '20px 0',
        fontStyle: 'italic',
      }}>
        35 years of beautiful partnership
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#ea580c',
        margin: '20px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
        padding: '30px',
        borderRadius: '20px',
        border: '3px solid #fb923c',
      }}>
        <p style={{ fontSize: '19px', color: '#7c2d12', margin: '12px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '19px', color: '#7c2d12', margin: '12px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '19px', color: '#7c2d12', margin: '12px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// ANNIVERSARY TEMPLATE 10: Bronze 8th Anniversary
export const BronzeAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
    padding: '60px',
    fontFamily: 'Arial, sans-serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.97)',
      borderRadius: '25px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '5px solid #b45309',
    }}>
      <div style={{ fontSize: '68px', marginBottom: '25px' }}>🥉</div>
      
      <div style={{
        fontSize: '88px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '20px',
      }}>
        {data.year || '8'}
      </div>
      
      <h1 style={{
        fontSize: '44px',
        color: '#92400e',
        margin: '0 0 30px 0',
        fontWeight: '800',
      }}>
        Bronze Anniversary
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#78350f',
        margin: '20px 0',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        Celebrating
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#b45309',
        margin: '20px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '30px',
        borderRadius: '15px',
        border: '3px solid #d97706',
      }}>
        <p style={{ fontSize: '19px', color: '#78350f', margin: '12px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '19px', color: '#78350f', margin: '12px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '19px', color: '#78350f', margin: '12px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);

// ANNIVERSARY TEMPLATE 11: Platinum 70th Anniversary
export const PlatinumAnniversaryTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '600px',
    height: '800px',
    background: '#0f172a',
    padding: '60px',
    fontFamily: 'Didot, serif',
    position: 'relative',
  }}>
    {/* Elegant glow */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(226,232,240,0.2) 0%, transparent 70%)',
      filter: 'blur(50px)',
    }}></div>
    
    <div style={{
      position: 'relative',
      zIndex: 10,
      background: 'rgba(255,255,255,0.98)',
      borderRadius: '25px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      border: '5px solid #cbd5e1',
    }}>
      <div style={{ fontSize: '85px', marginBottom: '25px' }}>👑</div>
      
      <div style={{
        fontSize: '115px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '20px',
      }}>
        70
      </div>
      
      <h1 style={{
        fontSize: '52px',
        color: '#334155',
        margin: '0 0 25px 0',
        fontWeight: '800',
      }}>
        Platinum Anniversary
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#475569',
        margin: '20px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Seven Decades of Love
      </p>
      
      <h2 style={{
        fontSize: '38px',
        color: '#64748b',
        margin: '20px 0 40px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        padding: '30px',
        borderRadius: '15px',
        border: '3px solid #94a3b8',
      }}>
        <p style={{ fontSize: '20px', color: '#1e293b', margin: '12px 0', fontWeight: '700' }}>
          {data.date}
        </p>
        <p style={{ fontSize: '20px', color: '#1e293b', margin: '12px 0', fontWeight: '700' }}>
          {data.time}
        </p>
        <p style={{ fontSize: '20px', color: '#1e293b', margin: '12px 0', fontWeight: '700' }}>
          {data.venue}
        </p>
      </div>
    </div>
  </div>
);


// CORPORATE TEMPLATE 2: Tech Conference Blue
export const TechConferenceTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
  }}>
    {/* Left side */}
    <div style={{
      width: '400px',
      padding: '60px 50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: '#fff',
    }}>
      <div style={{
        fontSize: '72px',
        marginBottom: '30px',
      }}>
        💻
      </div>
      
      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.8)',
        margin: '0 0 20px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Tech Conference 2026
      </p>
      
      <h1 style={{
        fontSize: '42px',
        margin: '0',
        fontWeight: '800',
        lineHeight: '1.1',
      }}>
        {data.eventName}
      </h1>
    </div>
    
    {/* Right side */}
    <div style={{
      flex: 1,
      background: '#fff',
      padding: '60px 50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <p style={{
        fontSize: '12px',
        color: '#64748b',
        margin: '0 0 15px 0',
        textTransform: 'uppercase',
        letterSpacing: '2px',
      }}>
        Presented By
      </p>
      
      <h2 style={{
        fontSize: '32px',
        color: '#0f172a',
        margin: '0 0 50px 0',
        fontWeight: '700',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        <div style={{
          padding: '18px 25px',
          background: '#f1f5f9',
          borderRadius: '10px',
          borderLeft: '4px solid #3b82f6',
        }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
          <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.date}</p>
        </div>
        
        <div style={{
          padding: '18px 25px',
          background: '#f1f5f9',
          borderRadius: '10px',
          borderLeft: '4px solid #3b82f6',
        }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</p>
          <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.time}</p>
        </div>
        
        <div style={{
          padding: '18px 25px',
          background: '#f1f5f9',
          borderRadius: '10px',
          borderLeft: '4px solid #3b82f6',
        }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Venue</p>
          <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);

// CORPORATE TEMPLATE 3: Product Launch Orange
export const ProductLaunchTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    fontFamily: 'Montserrat, sans-serif',
    padding: '50px',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '25px',
      padding: '60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{
        background: '#ea580c',
        color: '#fff',
        padding: '10px 25px',
        borderRadius: '30px',
        display: 'inline-block',
        margin: '0 auto 30px auto',
        fontSize: '14px',
        fontWeight: '800',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        Product Launch
      </div>
      
      <h1 style={{
        fontSize: '52px',
        color: '#9a3412',
        margin: '0 0 25px 0',
        fontWeight: '900',
        lineHeight: '1.1',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '14px',
        color: '#7c2d12',
        margin: '0 0 40px 0',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        By {data.hostName}
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginTop: '40px',
      }}>
        <div style={{
          background: '#fff7ed',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid #fed7aa',
        }}>
          <p style={{ fontSize: '11px', color: '#9a3412', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Date</p>
          <p style={{ fontSize: '16px', color: '#7c2d12', margin: '0', fontWeight: '800' }}>{data.date}</p>
        </div>
        
        <div style={{
          background: '#fff7ed',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid #fed7aa',
        }}>
          <p style={{ fontSize: '11px', color: '#9a3412', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Time</p>
          <p style={{ fontSize: '16px', color: '#7c2d12', margin: '0', fontWeight: '800' }}>{data.time}</p>
        </div>
        
        <div style={{
          background: '#fff7ed',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid #fed7aa',
        }}>
          <p style={{ fontSize: '11px', color: '#9a3412', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Venue</p>
          <p style={{ fontSize: '16px', color: '#7c2d12', margin: '0', fontWeight: '800' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);

// CORPORATE TEMPLATE 4: Business Seminar Green
export const BusinessSeminarTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: '#fff',
    fontFamily: 'Georgia, serif',
    display: 'flex',
  }}>
    {/* Left panel - Green */}
    <div style={{
      width: '300px',
      background: 'linear-gradient(180deg, #047857 0%, #059669 100%)',
      padding: '50px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: '#fff',
    }}>
      <div style={{
        fontSize: '60px',
        marginBottom: '30px',
      }}>
        📊
      </div>
      
      <p style={{
        fontSize: '13px',
        color: 'rgba(255,255,255,0.8)',
        margin: '0 0 15px 0',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        Business Seminar
      </p>
      
      <h2 style={{
        fontSize: '20px',
        color: '#fff',
        margin: '0',
        fontWeight: '600',
        lineHeight: '1.3',
      }}>
        {data.hostName}
      </h2>
    </div>
    
    {/* Right panel - White */}
    <div style={{
      flex: 1,
      padding: '50px 50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h1 style={{
        fontSize: '44px',
        color: '#064e3b',
        margin: '0 0 30px 0',
        fontWeight: '700',
        lineHeight: '1.2',
      }}>
        {data.eventName}
      </h1>
      
      <div style={{
        width: '80px',
        height: '4px',
        background: '#10b981',
        marginBottom: '40px',
      }}></div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>
            📅
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Date</p>
            <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.date}</p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>
            🕐
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Time</p>
            <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.time}</p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>
            📍
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Location</p>
            <p style={{ fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: '600' }}>{data.venue}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);


// CORPORATE TEMPLATE 5: Networking Event Purple
export const NetworkingEventTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: 'linear-gradient(135deg, #6b21a8 0%, #7c3aed 100%)',
    fontFamily: 'Arial, sans-serif',
    padding: '50px',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      padding: '50px',
      height: '100%',
      display: 'flex',
    }}>
      {/* Left content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: '65px',
          marginBottom: '25px',
        }}>
          🤝
        </div>
        
        <h1 style={{
          fontSize: '46px',
          color: '#5b21b6',
          margin: '0 0 20px 0',
          fontWeight: '800',
          lineHeight: '1.1',
        }}>
          {data.eventName}
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: '#7c3aed',
          margin: '0 0 15px 0',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Networking Event
        </p>
        
        <p style={{
          fontSize: '20px',
          color: '#6b21a8',
          margin: '10px 0 0 0',
          fontWeight: '600',
        }}>
          Hosted by {data.hostName}
        </p>
      </div>
      
      {/* Right details */}
      <div style={{
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '20px',
      }}>
        <div style={{
          background: '#faf5ff',
          padding: '20px',
          borderRadius: '12px',
          borderLeft: '5px solid #7c3aed',
        }}>
          <p style={{ fontSize: '11px', color: '#6b21a8', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
          <p style={{ fontSize: '16px', color: '#5b21b6', margin: '0', fontWeight: '700' }}>{data.date}</p>
        </div>
        
        <div style={{
          background: '#faf5ff',
          padding: '20px',
          borderRadius: '12px',
          borderLeft: '5px solid #7c3aed',
        }}>
          <p style={{ fontSize: '11px', color: '#6b21a8', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</p>
          <p style={{ fontSize: '16px', color: '#5b21b6', margin: '0', fontWeight: '700' }}>{data.time}</p>
        </div>
        
        <div style={{
          background: '#faf5ff',
          padding: '20px',
          borderRadius: '12px',
          borderLeft: '5px solid #7c3aed',
        }}>
          <p style={{ fontSize: '11px', color: '#6b21a8', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</p>
          <p style={{ fontSize: '16px', color: '#5b21b6', margin: '0', fontWeight: '700' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);

// CORPORATE TEMPLATE 6: Annual Meeting Red
export const AnnualMeetingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    padding: '60px',
  }}>
    <div style={{
      border: '4px solid #dc2626',
      height: '100%',
      padding: '50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#dc2626',
        color: '#fff',
        padding: '8px 20px',
        borderRadius: '5px',
        display: 'inline-block',
        fontSize: '12px',
        fontWeight: '800',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '30px',
        width: 'fit-content',
      }}>
        Annual Meeting
      </div>
      
      <h1 style={{
        fontSize: '56px',
        color: '#7f1d1d',
        margin: '0 0 20px 0',
        fontWeight: '900',
        lineHeight: '1.1',
      }}>
        {data.eventName}
      </h1>
      
      <div style={{
        width: '120px',
        height: '4px',
        background: '#dc2626',
        margin: '25px 0 35px 0',
      }}></div>
      
      <h2 style={{
        fontSize: '26px',
        color: '#991b1b',
        margin: '0 0 50px 0',
        fontWeight: '600',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '25px',
      }}>
        <div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Date</p>
          <p style={{ fontSize: '18px', color: '#0f172a', margin: '0', fontWeight: '700' }}>{data.date}</p>
        </div>
        
        <div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Time</p>
          <p style={{ fontSize: '18px', color: '#0f172a', margin: '0', fontWeight: '700' }}>{data.time}</p>
        </div>
        
        <div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Venue</p>
          <p style={{ fontSize: '18px', color: '#0f172a', margin: '0', fontWeight: '700' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);

// CORPORATE TEMPLATE 7: Workshop Training Teal
export const WorkshopTrainingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    fontFamily: 'Roboto, sans-serif',
    padding: '50px',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '25px',
      padding: '50px 60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
        marginBottom: '40px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
        }}>
          🎓
        </div>
        
        <div>
          <p style={{
            fontSize: '13px',
            color: '#14b8a6',
            margin: '0 0 8px 0',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '700',
          }}>
            Professional Workshop
          </p>
          <h1 style={{
            fontSize: '38px',
            color: '#115e59',
            margin: '0',
            fontWeight: '800',
            lineHeight: '1.1',
          }}>
            {data.eventName}
          </h1>
        </div>
      </div>
      
      <p style={{
        fontSize: '18px',
        color: '#0f766e',
        margin: '0 0 40px 0',
        fontWeight: '600',
      }}>
        Conducted by {data.hostName}
      </p>
      
      <div style={{
        display: 'flex',
        gap: '20px',
      }}>
        <div style={{
          flex: 1,
          background: '#f0fdfa',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid #99f6e4',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>📅</div>
          <p style={{ fontSize: '12px', color: '#115e59', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
          <p style={{ fontSize: '16px', color: '#0f766e', margin: '0', fontWeight: '700' }}>{data.date}</p>
        </div>
        
        <div style={{
          flex: 1,
          background: '#f0fdfa',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid #99f6e4',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>🕐</div>
          <p style={{ fontSize: '12px', color: '#115e59', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</p>
          <p style={{ fontSize: '16px', color: '#0f766e', margin: '0', fontWeight: '700' }}>{data.time}</p>
        </div>
        
        <div style={{
          flex: 1,
          background: '#f0fdfa',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid #99f6e4',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>📍</div>
          <p style={{ fontSize: '12px', color: '#115e59', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Venue</p>
          <p style={{ fontSize: '16px', color: '#0f766e', margin: '0', fontWeight: '700' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);


// CORPORATE TEMPLATE 8: Executive Summit Black Gold
export const ExecutiveSummitTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: '#000',
    fontFamily: 'Didot, serif',
    padding: '50px',
  }}>
    <div style={{
      background: '#fff',
      height: '100%',
      padding: '50px 60px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100px',
        height: '4px',
        background: '#d4af37',
        marginBottom: '35px',
      }}></div>
      
      <p style={{
        fontSize: '13px',
        color: '#d4af37',
        margin: '0 0 20px 0',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        fontWeight: '600',
      }}>
        Executive Summit
      </p>
      
      <h1 style={{
        fontSize: '52px',
        color: '#000',
        margin: '0 0 25px 0',
        fontWeight: '700',
        lineHeight: '1.1',
      }}>
        {data.eventName}
      </h1>
      
      <h2 style={{
        fontSize: '24px',
        color: '#666',
        margin: '0 0 50px 0',
        fontWeight: '400',
      }}>
        {data.hostName}
      </h2>
      
      <div style={{
        display: 'flex',
        gap: '30px',
        marginTop: '30px',
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Date</p>
          <p style={{ fontSize: '18px', color: '#000', margin: '0', fontWeight: '600' }}>{data.date}</p>
        </div>
        
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Time</p>
          <p style={{ fontSize: '18px', color: '#000', margin: '0', fontWeight: '600' }}>{data.time}</p>
        </div>
        
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Location</p>
          <p style={{ fontSize: '18px', color: '#000', margin: '0', fontWeight: '600' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);

// CORPORATE TEMPLATE 9: Team Building Pink
export const TeamBuildingTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
    fontFamily: 'Poppins, sans-serif',
    padding: '50px',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '30px',
      padding: '50px 60px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '50px',
    }}>
      {/* Left side */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '80px', marginBottom: '25px' }}>🎯</div>
        
        <h1 style={{
          fontSize: '42px',
          color: '#9f1239',
          margin: '0 0 20px 0',
          fontWeight: '800',
          lineHeight: '1.1',
        }}>
          {data.eventName}
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#db2777',
          margin: '0',
          fontWeight: '600',
        }}>
          Team Building Event
        </p>
        
        <p style={{
          fontSize: '20px',
          color: '#be185d',
          margin: '25px 0 0 0',
          fontWeight: '600',
        }}>
          {data.hostName}
        </p>
      </div>
      
      {/* Right side */}
      <div style={{
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        <div style={{
          background: '#fdf2f8',
          padding: '22px',
          borderRadius: '15px',
          border: '2px solid #fbcfe8',
        }}>
          <p style={{ fontSize: '11px', color: '#9f1239', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
          <p style={{ fontSize: '16px', color: '#831843', margin: '0', fontWeight: '700' }}>{data.date}</p>
        </div>
        
        <div style={{
          background: '#fdf2f8',
          padding: '22px',
          borderRadius: '15px',
          border: '2px solid #fbcfe8',
        }}>
          <p style={{ fontSize: '11px', color: '#9f1239', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</p>
          <p style={{ fontSize: '16px', color: '#831843', margin: '0', fontWeight: '700' }}>{data.time}</p>
        </div>
        
        <div style={{
          background: '#fdf2f8',
          padding: '22px',
          borderRadius: '15px',
          border: '2px solid #fbcfe8',
        }}>
          <p style={{ fontSize: '11px', color: '#9f1239', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Venue</p>
          <p style={{ fontSize: '16px', color: '#831843', margin: '0', fontWeight: '700' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);

// CORPORATE TEMPLATE 10: Awards Ceremony Gold
export const AwardsCeremonyTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
    fontFamily: 'Palatino, serif',
    padding: '50px',
  }}>
    <div style={{
      background: '#fffbeb',
      borderRadius: '20px',
      padding: '50px 60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '85px', marginBottom: '25px' }}>🏆</div>
      
      <p style={{
        fontSize: '14px',
        color: '#d97706',
        margin: '0 0 20px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        fontWeight: '700',
      }}>
        Awards Ceremony
      </p>
      
      <h1 style={{
        fontSize: '48px',
        color: '#78350f',
        margin: '0 0 25px 0',
        fontWeight: '700',
        lineHeight: '1.1',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '20px',
        color: '#92400e',
        margin: '0 0 50px 0',
        fontWeight: '600',
      }}>
        Presented by {data.hostName}
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginTop: '30px',
      }}>
        <div style={{
          background: '#fef3c7',
          padding: '25px',
          borderRadius: '15px',
          border: '3px solid #fbbf24',
        }}>
          <p style={{ fontSize: '12px', color: '#78350f', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Date</p>
          <p style={{ fontSize: '17px', color: '#92400e', margin: '0', fontWeight: '800' }}>{data.date}</p>
        </div>
        
        <div style={{
          background: '#fef3c7',
          padding: '25px',
          borderRadius: '15px',
          border: '3px solid #fbbf24',
        }}>
          <p style={{ fontSize: '12px', color: '#78350f', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Time</p>
          <p style={{ fontSize: '17px', color: '#92400e', margin: '0', fontWeight: '800' }}>{data.time}</p>
        </div>
        
        <div style={{
          background: '#fef3c7',
          padding: '25px',
          borderRadius: '15px',
          border: '3px solid #fbbf24',
        }}>
          <p style={{ fontSize: '12px', color: '#78350f', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Venue</p>
          <p style={{ fontSize: '17px', color: '#92400e', margin: '0', fontWeight: '800' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);

// CORPORATE TEMPLATE 11: Charity Gala Elegant
export const CharityGalaTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div style={{
    width: '800px',
    height: '600px',
    background: 'linear-gradient(135deg, #5b21b6 0%, #6b21a8 100%)',
    fontFamily: 'Garamond, serif',
    padding: '50px',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.98)',
      borderRadius: '25px',
      padding: '50px 60px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '75px', marginBottom: '25px' }}>💝</div>
      
      <p style={{
        fontSize: '14px',
        color: '#7c3aed',
        margin: '0 0 25px 0',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        fontWeight: '600',
      }}>
        Charity Gala
      </p>
      
      <h1 style={{
        fontSize: '46px',
        color: '#5b21b6',
        margin: '0 0 20px 0',
        fontWeight: '700',
        lineHeight: '1.2',
      }}>
        {data.eventName}
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#6b21a8',
        margin: '20px 0 50px 0',
        fontStyle: 'italic',
      }}>
        Hosted by {data.hostName}
      </p>
      
      <div style={{
        display: 'flex',
        gap: '25px',
        justifyContent: 'center',
      }}>
        <div style={{
          background: '#faf5ff',
          padding: '25px 30px',
          borderRadius: '15px',
          border: '2px solid #ddd6fe',
        }}>
          <p style={{ fontSize: '12px', color: '#6b21a8', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
          <p style={{ fontSize: '17px', color: '#5b21b6', margin: '0', fontWeight: '700' }}>{data.date}</p>
        </div>
        
        <div style={{
          background: '#faf5ff',
          padding: '25px 30px',
          borderRadius: '15px',
          border: '2px solid #ddd6fe',
        }}>
          <p style={{ fontSize: '12px', color: '#6b21a8', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</p>
          <p style={{ fontSize: '17px', color: '#5b21b6', margin: '0', fontWeight: '700' }}>{data.time}</p>
        </div>
        
        <div style={{
          background: '#faf5ff',
          padding: '25px 30px',
          borderRadius: '15px',
          border: '2px solid #ddd6fe',
        }}>
          <p style={{ fontSize: '12px', color: '#6b21a8', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Venue</p>
          <p style={{ fontSize: '17px', color: '#5b21b6', margin: '0', fontWeight: '700' }}>{data.venue}</p>
        </div>
      </div>
    </div>
  </div>
);


// COMPLETE EXPORTS LIST - 49 Templates Total
export const editableTemplatesList: EditableTemplate[] = [
  // ========== BIRTHDAY TEMPLATES (16) ==========
  { id: 'birthday-golden-balloons', name: 'Golden Balloons Birthday', category: 'birthday', thumbnailUrl: '/templates/golden-balloons.jpg', isPremium: true, component: GoldenBalloonsTemplate },
  { id: 'birthday-confetti-burst', name: 'Confetti Burst Party', category: 'birthday', thumbnailUrl: '/templates/confetti-burst.jpg', isPremium: false, component: ConfettiBurstTemplate },
  { id: 'birthday-elegant-purple', name: 'Elegant Purple Celebration', category: 'birthday', thumbnailUrl: '/templates/elegant-purple.jpg', isPremium: false, component: ElegantPurpleTemplate },
  { id: 'birthday-rose-red', name: 'Rose Red Romance', category: 'birthday', thumbnailUrl: '/templates/rose-red.jpg', isPremium: true, component: RoseRedTemplate },
  { id: 'birthday-neon-glow', name: 'Neon Glow Party', category: 'birthday', thumbnailUrl: '/templates/neon-glow.jpg', isPremium: true, component: NeonGlowTemplate },
  { id: 'birthday-vintage-kraft', name: 'Vintage Kraft Paper', category: 'birthday', thumbnailUrl: '/templates/vintage-kraft.jpg', isPremium: false, component: VintageKraftTemplate },
  { id: 'birthday-kids-cartoon', name: 'Kids Cartoon Fun', category: 'birthday', thumbnailUrl: '/templates/kids-cartoon.jpg', isPremium: false, component: KidsCartoonTemplate },
  { id: 'birthday-minimalist-modern', name: 'Minimalist Modern', category: 'birthday', thumbnailUrl: '/templates/minimalist-modern.jpg', isPremium: false, component: MinimalistModernTemplate },
  { id: 'birthday-floral-garden', name: 'Floral Garden Party', category: 'birthday', thumbnailUrl: '/templates/floral-garden.jpg', isPremium: false, component: FloralGardenTemplate },
  { id: 'birthday-geometric-blue', name: 'Geometric Blue', category: 'birthday', thumbnailUrl: '/templates/geometric-blue.jpg', isPremium: false, component: GeometricBlueTemplate },
  { id: 'birthday-tropical-paradise', name: 'Tropical Paradise', category: 'birthday', thumbnailUrl: '/templates/tropical-paradise.jpg', isPremium: true, component: TropicalParadiseTemplate },
  { id: 'birthday-luxury-black-white', name: 'Luxury Black & White', category: 'birthday', thumbnailUrl: '/templates/luxury-bw.jpg', isPremium: true, component: LuxuryBlackWhiteTemplate },
  { id: 'birthday-pastel-rainbow', name: 'Pastel Rainbow', category: 'birthday', thumbnailUrl: '/templates/pastel-rainbow.jpg', isPremium: false, component: PastelRainbowTemplate },
  { id: 'birthday-starry-night', name: 'Starry Night', category: 'birthday', thumbnailUrl: '/templates/starry-night.jpg', isPremium: true, component: StarryNightTemplate },
  { id: 'birthday-watercolor-art', name: 'Watercolor Art', category: 'birthday', thumbnailUrl: '/templates/watercolor-art.jpg', isPremium: false, component: WatercolorArtTemplate },
  { id: 'birthday-cinema-movie', name: 'Cinema Movie Premiere', category: 'birthday', thumbnailUrl: '/templates/cinema-movie.jpg', isPremium: true, component: CinemaMovieTemplate },
  
  // ========== WEDDING TEMPLATES (10) ==========
  { id: 'wedding-navy-gold', name: 'Navy & Gold Wedding', category: 'wedding', thumbnailUrl: '/templates/navy-gold-wedding.jpg', isPremium: false, component: NavyGoldWeddingTemplate },
  { id: 'wedding-rose-garden', name: 'Rose Garden Romance', category: 'wedding', thumbnailUrl: '/templates/rose-garden.jpg', isPremium: false, component: RoseGardenWeddingTemplate },
  { id: 'wedding-beach-sunset', name: 'Beach Sunset Wedding', category: 'wedding', thumbnailUrl: '/templates/beach-sunset.jpg', isPremium: true, component: BeachSunsetWeddingTemplate },
  { id: 'wedding-classic-elegant', name: 'Classic Elegant White', category: 'wedding', thumbnailUrl: '/templates/classic-elegant.jpg', isPremium: false, component: ClassicElegantWeddingTemplate },
  { id: 'wedding-rustic-barn', name: 'Rustic Barn Wedding', category: 'wedding', thumbnailUrl: '/templates/rustic-barn.jpg', isPremium: false, component: RusticBarnWeddingTemplate },
  { id: 'wedding-garden-floral', name: 'Garden Floral Wedding', category: 'wedding', thumbnailUrl: '/templates/garden-floral.jpg', isPremium: false, component: GardenFloralWeddingTemplate },
  { id: 'wedding-modern-geometric', name: 'Modern Geometric Wedding', category: 'wedding', thumbnailUrl: '/templates/modern-geometric.jpg', isPremium: true, component: ModernGeometricWeddingTemplate },
  { id: 'wedding-vintage-lace', name: 'Vintage Lace Wedding', category: 'wedding', thumbnailUrl: '/templates/vintage-lace.jpg', isPremium: false, component: VintageLaceWeddingTemplate },
  { id: 'wedding-burgundy-gold', name: 'Burgundy & Gold Luxury', category: 'wedding', thumbnailUrl: '/templates/burgundy-gold.jpg', isPremium: true, component: BurgundyGoldWeddingTemplate },
  { id: 'wedding-lavender', name: 'Lavender Fields Wedding', category: 'wedding', thumbnailUrl: '/templates/lavender-wedding.jpg', isPremium: false, component: LavenderWeddingTemplate },
  
  // ========== ANNIVERSARY TEMPLATES (12) ==========
  { id: 'anniversary-10th-black-gold', name: '10th Anniversary Black & Gold', category: 'anniversary', thumbnailUrl: '/templates/10th-anniversary.jpg', isPremium: false, component: TenthAnniversaryTemplate },
  { id: 'anniversary-50th-golden', name: '50th Golden Anniversary', category: 'anniversary', thumbnailUrl: '/templates/50th-golden.jpg', isPremium: true, component: GoldenAnniversaryClassicTemplate },
  { id: 'anniversary-25th-silver', name: '25th Silver Anniversary', category: 'anniversary', thumbnailUrl: '/templates/25th-silver.jpg', isPremium: false, component: SilverAnniversaryTemplate },
  { id: 'anniversary-40th-ruby', name: '40th Ruby Anniversary', category: 'anniversary', thumbnailUrl: '/templates/40th-ruby.jpg', isPremium: true, component: RubyAnniversaryTemplate },
  { id: 'anniversary-30th-pearl', name: '30th Pearl Anniversary', category: 'anniversary', thumbnailUrl: '/templates/30th-pearl.jpg', isPremium: false, component: PearlAnniversaryTemplate },
  { id: 'anniversary-60th-diamond', name: '60th Diamond Anniversary', category: 'anniversary', thumbnailUrl: '/templates/60th-diamond.jpg', isPremium: true, component: DiamondAnniversaryTemplate },
  { id: 'anniversary-55th-emerald', name: '55th Emerald Anniversary', category: 'anniversary', thumbnailUrl: '/templates/55th-emerald.jpg', isPremium: true, component: EmeraldAnniversaryTemplate },
  { id: 'anniversary-45th-sapphire', name: '45th Sapphire Anniversary', category: 'anniversary', thumbnailUrl: '/templates/45th-sapphire.jpg', isPremium: true, component: SapphireAnniversaryTemplate },
  { id: 'anniversary-35th-coral', name: '35th Coral Anniversary', category: 'anniversary', thumbnailUrl: '/templates/35th-coral.jpg', isPremium: false, component: CoralAnniversaryTemplate },
  { id: 'anniversary-8th-bronze', name: '8th Bronze Anniversary', category: 'anniversary', thumbnailUrl: '/templates/8th-bronze.jpg', isPremium: false, component: BronzeAnniversaryTemplate },
  { id: 'anniversary-70th-platinum', name: '70th Platinum Anniversary', category: 'anniversary', thumbnailUrl: '/templates/70th-platinum.jpg', isPremium: true, component: PlatinumAnniversaryTemplate },
  { id: 'anniversary-custom', name: 'Custom Anniversary', category: 'anniversary', thumbnailUrl: '/templates/custom-anniversary.jpg', isPremium: false, component: TenthAnniversaryTemplate },
  
  // ========== CORPORATE TEMPLATES (11) ==========
  { id: 'corporate-modern-event', name: 'Modern Company Event', category: 'corporate', thumbnailUrl: '/templates/modern-corporate.jpg', isPremium: false, component: ModernCompanyEventTemplate },
  { id: 'corporate-tech-conference', name: 'Tech Conference Blue', category: 'corporate', thumbnailUrl: '/templates/tech-conference.jpg', isPremium: false, component: TechConferenceTemplate },
  { id: 'corporate-product-launch', name: 'Product Launch Orange', category: 'corporate', thumbnailUrl: '/templates/product-launch.jpg', isPremium: true, component: ProductLaunchTemplate },
  { id: 'corporate-business-seminar', name: 'Business Seminar Green', category: 'corporate', thumbnailUrl: '/templates/business-seminar.jpg', isPremium: false, component: BusinessSeminarTemplate },
  { id: 'corporate-networking-event', name: 'Networking Event Purple', category: 'corporate', thumbnailUrl: '/templates/networking-event.jpg', isPremium: false, component: NetworkingEventTemplate },
  { id: 'corporate-annual-meeting', name: 'Annual Meeting Red', category: 'corporate', thumbnailUrl: '/templates/annual-meeting.jpg', isPremium: false, component: AnnualMeetingTemplate },
  { id: 'corporate-workshop-training', name: 'Workshop Training Teal', category: 'corporate', thumbnailUrl: '/templates/workshop-training.jpg', isPremium: false, component: WorkshopTrainingTemplate },
  { id: 'corporate-executive-summit', name: 'Executive Summit Black Gold', category: 'corporate', thumbnailUrl: '/templates/executive-summit.jpg', isPremium: true, component: ExecutiveSummitTemplate },
  { id: 'corporate-team-building', name: 'Team Building Pink', category: 'corporate', thumbnailUrl: '/templates/team-building.jpg', isPremium: false, component: TeamBuildingTemplate },
  { id: 'corporate-awards-ceremony', name: 'Awards Ceremony Gold', category: 'corporate', thumbnailUrl: '/templates/awards-ceremony.jpg', isPremium: true, component: AwardsCeremonyTemplate },
  { id: 'corporate-charity-gala', name: 'Charity Gala Elegant', category: 'corporate', thumbnailUrl: '/templates/charity-gala.jpg', isPremium: true, component: CharityGalaTemplate },
];
