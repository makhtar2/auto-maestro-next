import Link from 'next/link';
import DetailContent from './DetailContent';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { readVehicles } from '../../../lib/db-helper';

// Dynamic server-side rendering
export const revalidate = 0;

// Read vehicle data
function getVehicle(id) {
  try {
    const vehicles = readVehicles();
    return vehicles.find(v => v.id.toString() === id.toString()) || null;
  } catch (error) {
    console.error('Error loading vehicle details:', error);
    return null;
  }
}

// Generate dynamic SEO metadata for each vehicle
export async function generateMetadata({ params }) {
  const car = getVehicle(params.id);
  if (!car) {
    return {
      title: 'Vehicle Not Found | Auto Maestro LLC',
    };
  }
  return {
    title: `${car.year} ${car.make} ${car.model} | Auto Maestro LLC`,
    description: `Buy the ${car.year} ${car.make} ${car.model} with ${car.mileage.toLocaleString()} mi. Specs: ${car.engine}, ${car.transmission}, ${car.fuel}. Contact Auto Maestro for a test drive.`,
    openGraph: {
      title: `${car.year} ${car.make} ${car.model} - $${car.price.toLocaleString()}`,
      description: car.description,
      images: [{ url: car.mainImage }],
    }
  };
}

export default function VehicleDetailPage({ params }) {
  const car = getVehicle(params.id);

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-body p-10">
        <h2 className="font-title text-3xl mb-4">Vehicle Not Found</h2>
        <p className="text-text-muted mb-6">The vehicle you are looking for may have been sold or removed from our inventory.</p>
        <Link href="/" className="btn-figma-accent">Return to Catalog</Link>
      </div>
    );
  }

  // Create JSON-LD schema structured data for Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${car.year} ${car.make} ${car.model}`,
    "image": car.images || [car.mainImage],
    "description": car.description,
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
      "name": car.engine
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
      "seller": {
        "@type": "AutoDealer",
        "name": "AUTO MAESTRO LLC",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "AUTO MAESTRO LLC Showroom",
          "addressLocality": "USA",
          "addressRegion": "US",
          "postalCode": "00000",
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
