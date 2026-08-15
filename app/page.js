import CatalogWrapper from './components/CatalogWrapper';
import ContactForm from './components/ContactForm';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { readVehicles } from '../lib/db-helper';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering so modifications in /admin are immediate
export const revalidate = 0;

export default function Home() {
  try {
    const src = '/home/almuxtaar/.gemini/antigravity/brain/9506d595-cf6d-4390-a261-dd6c79c5e0d0/.tempmediaStorage/media_9506d595-cf6d-4390-a261-dd6c79c5e0d0_1786738869211.jpg';
    const dest = path.join(process.cwd(), 'public', 'hero-custom.jpg');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  } catch (e) {}

  let vehicles = [];
  try {
    vehicles = readVehicles();
  } catch (error) {
    console.error('Error loading vehicles on page load:', error);
  }

  return (
    <>
      {/* Sticky Header */}
      <SiteHeader variant="home" />

      <main>
        {/* CatalogWrapper encapsulates Hero text, Quick Search Form, Features, Categories and Catalog Grid */}
        <CatalogWrapper initialVehicles={vehicles} />

        {/* Contact Section */}
        <section className="contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="hero-tagline-figma">Get In Touch</span>
              <h2 className="contact-title">Visit Our Showroom</h2>
              <p className="contact-desc">
                We welcome you from Monday to Saturday to discover our premium inventory and conduct a detailed test drive.
              </p>
              
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-card-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div className="info-card-content">
                    <h5>Address</h5>
                    <p>AUTO MAESTRO LLC Main Showroom</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div className="info-card-content">
                    <h5>Phone & Email</h5>
                    <p>+1 (513) 555-0199 | contact@automaestro.com</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="info-card-content">
                    <h5>Showroom Hours</h5>
                    <p>Mon - Fri: 9:00 AM - 6:30 PM | Sat: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="map-wrapper">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3096.5292020295825!2d-84.62002342345511!3d39.11723827170138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8841c305c48bdfb5%3A0xc00f135bdfd058c4!2sShowroom!5e0!3m2!1sen!2sen!4v1786400000000!5m2!1sen!2sen" 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Showroom Location Map"
                ></iframe>
              </div>
            </div>

            <div className="contact-form-box">
              <div className="contact-box-header">
                <span className="contact-badge">CONCIERGE & SALES</span>
                <h3>Direct Sales Inquiry</h3>
                <p>Send a message to our sales advisors. We reply within 24 business hours.</p>
              </div>
              
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter variant="home" />
    </>
  );
}
