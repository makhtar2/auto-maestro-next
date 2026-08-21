import Link from 'next/link';

export default function SiteFooter({ variant = 'home' }) {
  const isHome = variant === 'home';
  const logoHref = isHome ? '#' : '/';
  const homeHref = isHome ? '#accueil' : '/';
  const inventoryHref = isHome ? '#inventaire' : '/#inventaire';
  const contactHref = isHome ? '#contact' : '/#contact';

  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href={logoHref} className="logo-container" aria-label="AUTO MAESTRO LLC Home">
            <img src="/logo-white.svg" alt="AUTO MAESTRO LLC Logo" width="160" height="36" className="brand-logo-img" />
          </Link>
          <p>AUTO MAESTRO LLC is your trusted partner for buying and selling your next premium or sports vehicle. All our vehicles are meticulously inspected.</p>
        </div>
        <div className="footer-links-col">
          <h3 className="text-base font-bold text-white mb-3">Navigation</h3>
          <ul>
            <li><Link href={homeHref}>Home</Link></li>
            <li><Link href={inventoryHref}>Inventory</Link></li>
            <li><Link href={contactHref}>Contact</Link></li>
          </ul>
        </div>
        <div className="footer-links-col">
          <h3 className="text-base font-bold text-white mb-3">Legal</h3>
          <ul>
            <li><Link href="/legal-terms">Legal Terms</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} AUTO MAESTRO LLC. All rights reserved.</p>
        <p>Developed by <span>Makhtar Wade</span></p>
      </div>
    </footer>
  );
}
