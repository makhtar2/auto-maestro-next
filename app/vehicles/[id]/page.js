import Link from 'next/link';
import DetailContent from './DetailContent';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { getVehiclesAsync } from '../../../lib/db-helper';

// Dynamic server-side rendering
export const revalidate = 0;

// Read vehicle data
async function getVehicle(id) {
  try {
    const vehicles = await getVehiclesAsync();
    return vehicles.find(v => v.id.toString() === id.toString()) || null;
  } catch (error) {
    console.error('Error loading vehicle details:', error);
    return null;
  }
}

// Generate dynamic SEO metadata for each vehicle
export async function generateMetadata({ params }) {
  const car = await getVehicle(params.id);
  if (!car) {
    return {
      title: 'Vehicle Not Found | Auto Maestro LLC',
      robots: { index: false, follow: true }
    };
  }

  const title = `${car.year} ${car.make} ${car.model} for Sale | AUTO MAESTRO LLC`;
  const description = `Buy this certified ${car.year} ${car.make} ${car.model} in ${car.color || 'pristine condition'} with only ${car.mileage.toLocaleString()} miles. Price: $${car.price.toLocaleString()}. Book a test drive today.`;
  const url = `https://www.automaestrocars.com/vehicles/${car.id}`;
  const images = car.images && car.images.length > 0 ? car.images : [car.mainImage];

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${car.year} ${car.make} ${car.model} - $${car.price.toLocaleString()}`,
      description,
      url,
      type: 'article',
      siteName: 'AUTO MAESTRO LLC',
      images: images.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: `${car.year} ${car.make} ${car.model}`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [car.mainImage],
      creator: '@automaestrocars',
    }
  };
}

export default async function VehicleDetailPage({ params }) {
  const car = await getVehicle(params.id);

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-body p-10">
        <h2 className="font-title text-3xl mb-4">Vehicle Not Found</h2>
        <p className="text-text-muted mb-6">The vehicle you are looking for may have been sold or removed from our inventory.</p>
        <Link href="/" className="btn-hero-primary">Return to Catalog</Link>
      </div>
    );
  }

  // Create JSON-LD schema structured data for Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Car", "Product"],
    "name": `${car.year} ${car.make} ${car.model}`,
    "image": car.images && car.images.length > 0 ? car.images : [car.mainImage],
    "description": car.description,
    "vehicleIdentificationNumber": car.vin || undefined,
    "sku": car.stockNumber || `AM-${car.id.toUpperCase()}`,
    "color": car.color || undefined,
    "vehicleInteriorColor": car.interior || undefined,
    "brand": {
      "@type": "Brand",
      "name": car.make
    },
    "model": car.model,
    "productionDate": car.year.toString(),
    "vehicleTransmission": car.transmission,
    "fuelType": car.fuel,
    "vehicleEngine": {
      "@type": "EngineSpecification",
      "name": car.engine || "Factory Engine"
    },
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": car.mileage,
      "unitCode": "SMI"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": car.price.toString(),
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": "https://schema.org/InStock",
      "url": `https://www.automaestrocars.com/vehicles/${car.id}`,
      "seller": {
        "@type": "AutoDealer",
        "name": "AUTO MAESTRO LLC",
        "url": "https://www.automaestrocars.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "AUTO MAESTRO LLC Main Showroom",
          "addressLocality": "Showroom Center",
          "addressRegion": "US",
          "postalCode": "45202",
          "addressCountry": "US"
        }
      }
    }
  };

  return (
    <>
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <SiteHeader variant="detail" />

      <main className="bg-body pt-10 pb-20">
        <div className="container">

          {/* Back button */}
          <Link href="/#inventaire" className="back-link-hover inline-flex items-center gap-2 no-underline text-text-muted font-semibold mb-6 transition">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Inventory
          </Link>

          {/* Page Layout Grid */}
          <DetailContent car={car} />

        </div>
      </main>

      {/* Footer */}
      <SiteFooter variant="detail" />
    </>
  );
}
