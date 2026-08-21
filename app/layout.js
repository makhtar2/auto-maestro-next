import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.automaestrocars.com'),
  title: "AUTO MAESTRO LLC | Prestige & Sport Vehicles",
  description: "Explore the exclusive catalog of certified prestige and sports vehicles at AUTO MAESTRO LLC. Luxury sedans, supercars, and premium SUVs.",
  keywords: "Auto Maestro, prestige vehicles, luxury cars, sports cars, certified auto dealer, automaestrocars",
  authors: [{ name: "AUTO MAESTRO LLC" }],
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
  openGraph: {
    title: "AUTO MAESTRO LLC | Prestige & Sport Vehicles",
    description: "Explore our exclusive inventory of inspected and certified prestige and sports vehicles.",
    url: 'https://www.automaestrocars.com',
    siteName: 'AUTO MAESTRO LLC',
    images: [
      {
        url: '/hero-custom.jpg',
        width: 1200,
        height: 630,
        alt: 'AUTO MAESTRO LLC Premium Fleet',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AUTO MAESTRO LLC | Prestige & Sport Vehicles",
    description: "Explore our exclusive catalog of luxury and performance vehicles.",
    images: ['/hero-custom.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
