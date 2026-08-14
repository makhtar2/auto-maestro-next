import Link from 'next/link';
import DetailGalleryAndCalculator from './DetailGalleryAndCalculator';
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-body)', padding: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', marginBottom: '16px' }}>Vehicle Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>The vehicle you are looking for may have been sold or removed from our inventory.</p>
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
      <header id="mainHeader" style={{ position: 'relative', background: 'var(--bg-surface)' }}>
        <div className="container nav-container" style={{ height: '75px' }}>
          <Link href="/" className="logo-container">
            <img src="/logo.svg" alt="AUTO MAESTRO LLC Logo" className="brand-logo-img" />
          </Link>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#inventaire">Inventory</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
          <Link href="/#inventaire" className="nav-cta">Back to Catalog</Link>
        </div>
      </header>

      <main style={{ backgroundColor: 'var(--bg-body)', padding: '40px 0 80px 0' }}>
        <div className="container">
          
          {/* Back button */}
          <Link href="/#inventaire" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '24px', transition: 'var(--transition)' }} className="back-link-hover">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Inventory
          </Link>

          {/* Page Layout Grid */}
          <DetailGalleryAndCalculator car={car} />

        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo-container">
              <img src="/logo-white.svg" alt="AUTO MAESTRO LLC Logo" className="brand-logo-img" />
            </Link>
            <p>AUTO MAESTRO LLC is your trusted partner for buying, selling, and financing your next premium or sports vehicle. All our vehicles are meticulously inspected.</p>
          </div>
          <div className="footer-links-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#inventaire">Inventory</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-links-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Legal Terms</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; {new Date().getFullYear()} AUTO MAESTRO LLC. All rights reserved.</p>
          <p>Developed by <span>Makhtar Wade</span></p>
        </div>
      </footer>
    </>
  );
}
