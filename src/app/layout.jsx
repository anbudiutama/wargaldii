export const metadata = {
  metadataBase: new URL('https://wargaldii.com'),
  title: {
    default: 'WargaLDII — Platform Ekonomi Jamaah LDII',
    template: '%s | WargaLDII',
  },
  description: 'Platform digital untuk jamaah LDII: marketplace, e-learning, lowongan kerja, investasi syariah, BMT, dan hibah barkas. Bangun ekosistem ekonomi jamaah yang mandiri.',
  keywords: [
    'LDII', 'jamaah LDII', 'platform ekonomi LDII', 'marketplace LDII',
    'e-learning LDII', 'investasi syariah', 'BMT syariah', 'lowongan kerja LDII',
    'hibah barkas', 'ekonomi jamaah', 'WargaLDII', 'wargaldii.com',
    'usaha jamaah', 'koperasi syariah', 'belajar online LDII',
    'sertifikat digital', 'ekonomi umat', 'LDII Indonesia',
  ],
  authors: [{ name: 'WargaLDII', url: 'https://wargaldii.com' }],
  creator: 'WargaLDII',
  publisher: 'WargaLDII',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://wargaldii.com',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://wargaldii.com',
    siteName: 'WargaLDII',
    title: 'WargaLDII — Platform Ekonomi Jamaah LDII',
    description: 'Satu platform untuk belajar, bekerja, berdagang, berinvestasi, dan saling membantu sesama warga LDII. Marketplace, E-Learning, Lowongan Kerja, Investasi Syariah, BMT, dan Hibah Barkas.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WargaLDII - Platform Ekonomi Jamaah LDII',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WargaLDII — Platform Ekonomi Jamaah LDII',
    description: 'Marketplace, E-Learning, Lowongan Kerja, Investasi Syariah, BMT, dan Hibah Barkas untuk jamaah LDII.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Tambahkan nanti setelah mendaftar di Google Search Console
    // google: 'kode-verifikasi-google',
  },
  category: 'technology',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'WargaLDII',
  url: 'https://wargaldii.com',
  description: 'Platform digital ekonomi jamaah LDII: marketplace, e-learning, lowongan kerja, investasi syariah, BMT, dan hibah barkas.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'IDR',
  },
  author: {
    '@type': 'Organization',
    name: 'WargaLDII',
    url: 'https://wargaldii.com',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WargaLDII',
  url: 'https://wargaldii.com',
  logo: 'https://wargaldii.com/icon-512.png',
  description: 'Platform ekonomi digital untuk jamaah LDII Indonesia.',
  sameAs: [],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B6B3A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
