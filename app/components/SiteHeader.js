"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SiteHeader({ variant = 'home' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHome = variant === 'home';
  const logoHref = isHome ? '#' : '/';
  const homeHref = isHome ? '#accueil' : '/';
  const inventoryHref = isHome ? '#inventaire' : '/#inventaire';
  const contactHref = isHome ? '#contact' : '/#contact';
  const ctaHref = isHome ? '#inventaire' : '/#inventaire';
  const ctaLabel = isHome ? 'View Inventory' : 'Back to Catalog';

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header id="mainHeader" className={isHome ? undefined : 'relative bg-surface'}>
      <div className={`container nav-container ${isHome ? '' : 'h-[75px]'}`}>
        <Link href={logoHref} className="logo-container">
          <img src="/logo.svg" alt="AUTO MAESTRO LLC Logo" className="brand-logo-img" />
        </Link>

        <ul className="nav-links">
          <li><Link href={homeHref}>Home</Link></li>
          <li><Link href={inventoryHref}>Inventory</Link></li>
          <li><Link href={contactHref}>Contact</Link></li>
        </ul>

        <div className="flex items-center gap-2">
          <Link href={ctaHref} className="nav-cta">{ctaLabel}</Link>
          <button
            className="nav-mobile-toggle"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="nav-mobile-panel">
          <Link href={homeHref} onClick={closeMenu}>Home</Link>
          <Link href={inventoryHref} onClick={closeMenu}>Inventory</Link>
          <Link href={contactHref} onClick={closeMenu}>Contact</Link>
        </div>
      )}
    </header>
  );
}
