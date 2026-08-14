import './globals.css';

export const metadata = {
  title: "AUTO MAESTRO LLC | Premium Automobile Catalog",
  description: "Explore the exclusive inventory of premium vehicles at AUTO MAESTRO LLC. Luxury sedans, sport cars, and hybrid/electric SUVs at the best value. Rigid technical inspection and high-end services.",
  keywords: "Auto Maestro, premium car, luxury sedan, sports car, luxury vehicles, automobile dealer",
  authors: [{ name: "Makhtar Wade" }],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "AUTO MAESTRO LLC | Premium Automobile Catalog",
    description: "Browse our exclusive catalog of hand-picked premium vehicles.",
    url: 'https://automaestro.com',
    siteName: 'Auto Maestro LLC',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AUTO MAESTRO LLC | Premium Automobile Catalog",
    description: "Our live premium vehicle catalog.",
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body>
        {children}
      </body>
    </html>
  );
}
