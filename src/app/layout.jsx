export const metadata = {
  title: 'WargaLDII - Platform Ekonomi Jamaah LDII',
  description: 'Platform untuk belajar, bekerja, berdagang, berinvestasi, dan saling membantu sesama warga LDII',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
