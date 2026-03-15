import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WargaLDII - Platform Ekonomi Jamaah LDII';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F0F1A 0%, #0a2e1a 40%, #1B6B3A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #1B6B3A, #145A2E)',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '42px',
              fontWeight: 'bold',
              border: '3px solid rgba(255,255,255,0.2)',
            }}
          >
            W
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: 'white', fontSize: '48px', fontWeight: 900 }}>
              WargaLDII
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '16px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              wargaldii.com
            </div>
          </div>
        </div>

        <div
          style={{
            color: '#D4A017',
            fontSize: '36px',
            fontWeight: 'bold',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.3,
            marginBottom: '24px',
          }}
        >
          Platform Ekonomi Jamaah LDII
        </div>

        <div
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          Marketplace · E-Learning · Lowongan Kerja · Investasi Syariah · BMT · Hibah Barkas
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '40px',
          }}
        >
          {['🛒', '📚', '💼', '📈', '🏦', '🎁'].map((icon) => (
            <div
              key={icon}
              style={{
                width: '56px',
                height: '56px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
