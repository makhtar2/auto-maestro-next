import './globals.css';

export const metadata = {
  metadataBase: new URL('https://auto-maestro-next.vercel.app'),
  title: "AUTO MAESTRO LLC | Véhicules de Prestige & Sport",
  description: "Découvrez le catalogue exclusif de véhicules certifiés et de prestige chez AUTO MAESTRO LLC. Berlines de luxe, sportives et SUV haut de gamme.",
  keywords: "Auto Maestro, véhicules de prestige, berline de luxe, voiture de sport, concessionnaire automobile",
  authors: [{ name: "Makhtar Wade" }],
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
    title: "AUTO MAESTRO LLC | Véhicules de Prestige & Sport",
    description: "Découvrez notre inventaire exclusif de véhicules de prestige et de sport inspectés et certifiés.",
    url: 'https://auto-maestro-next.vercel.app',
    siteName: 'AUTO MAESTRO LLC',
    images: [
      {
        url: '/hero-custom.jpg',
        width: 1200,
        height: 630,
        alt: 'AUTO MAESTRO LLC Premium Fleet',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AUTO MAESTRO LLC | Véhicules de Prestige & Sport",
    description: "Découvrez notre catalogue exclusif de véhicules haut de gamme.",
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
