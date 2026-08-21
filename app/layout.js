import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-title',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const viewport = {
  themeColor: '#0b0f19',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL('https://www.automaestrocars.com'),
  title: {
    default: "AUTO MAESTRO LLC | Certified Prestige & Sport Vehicles Dealership",
    template: "%s | AUTO MAESTRO LLC"
  },
  description: "Discover our exclusive inventory of certified prestige, sport, and luxury vehicles at AUTO MAESTRO LLC. Book a private showroom appointment or test drive today.",
  keywords: [
    "automaestro",
    "AutoMaestro",
    "Auto Maestro",
    "Auto Maestro LLC",
    "automaestrocars",
    "automaestro cars",
    "automaestrocars.com",
    "prestige vehicles",
    "luxury cars for sale",
    "sports cars dealership",
    "certified pre-owned luxury",
    "supercars showroom",
    "luxury auto dealer"
  ],
  authors: [{ name: "AUTO MAESTRO LLC", url: "https://www.automaestrocars.com" }],
  creator: "AUTO MAESTRO LLC",
  publisher: "AUTO MAESTRO LLC",
  category: "Automotive Dealership",
  alternates: {
    canonical: "https://www.automaestrocars.com",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icon.svg' }],
    shortcut: ['/icon.svg'],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
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
    title: "AUTO MAESTRO LLC | Certified Prestige & Sport Vehicles Dealership",
    description: "Explore our curated showroom of certified luxury, performance, and sports vehicles. Schedule your private viewing and test drive.",
    url: 'https://www.automaestrocars.com',
    siteName: 'AUTO MAESTRO LLC',
    images: [
      {
        url: '/hero-custom.jpg',
        width: 1200,
        height: 630,
        alt: 'AUTO MAESTRO LLC Exclusive Fleet',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AUTO MAESTRO LLC | Certified Prestige & Sport Vehicles Dealership",
    description: "Explore our curated showroom of certified luxury, performance, and sports vehicles.",
    images: ['/hero-custom.jpg'],
    creator: '@automaestrocars',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <link rel="preload" as="image" href="/hero-custom.jpg" type="image/jpeg" fetchPriority="high" />
      </head>
      <body className="font-body">
        {children}
      </body>
    </html>
  );
}

