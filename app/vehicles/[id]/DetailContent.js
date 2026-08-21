"use client";

import { useState } from 'react';

export default function DetailContent({ car }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'description', 'features'

  // Booking Form States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [toast, setToast] = useState({ show: false, error: false, message: '' });

  const allImages = car.images && car.images.length > 0 ? car.images : [car.mainImage];

  const triggerToast = (message, isError = false) => {
    setToast({ show: true, error: isError, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !userEmail || !bookingDate) {
      triggerToast('Please fill out all required fields.', true);
      return;
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          phone: userPhone,
          vehicleId: car.id,
          vehicleName: `${car.year} ${car.make} ${car.model}`,
          date: bookingDate,
          time: bookingTime,
          message: `Scheduled test drive booking request.`
        })
      });

      if (res.ok) {
        triggerToast(`Booking confirmed for ${car.make} ${car.model}. Our team will contact you shortly!`);
        setUserName('');
        setUserEmail('');
        setUserPhone('');
        setBookingDate('');
      } else {
        triggerToast('Failed to submit request. Please try again.', true);
      }
    } catch (error) {
      console.error(error);
      triggerToast('Server communication error. Please try again.', true);
    }
  };

  const shareVehicle = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car.year} ${car.make} ${car.model}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast('Vehicle page link copied to clipboard!');
    }
  };

  return (
    <div className="modern-detail-wrapper">
      
      {/* 1. HERO TITLE HEADER BAR */}
      <div className="detail-hero-header">
        <div>
          <div className="hero-badge-row">
            <span className="badge-year">{car.year}</span>
            <span className="badge-stock-status">
              <span className="dot-green"></span> Certified In Stock
            </span>
          </div>
          <h1 className="detail-title-h1">
            {car.make} {car.model}
          </h1>
          <p className="detail-subtitle-meta">
            {car.vin ? <>VIN: <strong>{car.vin}</strong> • </> : null}Stock #: <strong>{car.stockNumber || `AM-${car.id.toUpperCase()}`}</strong>
          </p>
        </div>

        <div className="detail-price-box">
          <span className="price-tag-sub">Starting Price</span>
          <h2 className="price-tag-amount">${car.price.toLocaleString()}</h2>
          <div className="action-buttons-row">
            <button className="btn-action-outline" onClick={shareVehicle} title="Share Vehicle">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              Share
            </button>
            <a href="#booking-form" className="btn-action-primary">
              Book Test Drive
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="modern-detail-grid">
        
        {/* LEFT MAIN CONTENT */}
        <div className="detail-left-content">
          
          {/* GALLERY CONTAINER */}
          <div className="modern-gallery-container">
            <div className="gallery-main-frame" onClick={() => setIsLightboxOpen(true)}>
              <img 
                src={allImages[activeImgIndex] || car.mainImage} 
                alt={`${car.year} ${car.make} ${car.model}`} 
                width="800"
                height="500"
                className="gallery-main-img"
              />
              <div className="gallery-overlay-controls">
                <span className="image-counter-pill">
                  {activeImgIndex + 1} / {allImages.length}
                </span>
                <span className="zoom-hint-pill">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                  </svg>
                  Click to Expand
                </span>
              </div>
            </div>

            {/* THUMBNAIL CAROUSEL */}
            {allImages.length > 1 && (
              <div className="gallery-thumbnails-strip">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumb-card-modern ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                    aria-label={`View photo ${idx + 1} of ${allImages.length}`}
                  >
                    <img src={img} alt={`${car.make} ${car.model} view ${idx + 1}`} width="100" height="70" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* KEY SPECS HIGHLIGHT GRID (6 ICON CARDS) */}
          <div className="spec-highlights-grid">
            <div className="spec-card-iconic">
              <div className="spec-icon-wrapper">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <span className="spec-card-label">Mileage</span>
                <h4 className="spec-card-value">{car.mileage.toLocaleString()} mi</h4>
              </div>
            </div>

            <div className="spec-card-iconic">
              <div className="spec-icon-wrapper">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
              <div>
                <span className="spec-card-label">Engine</span>
                <h4 className="spec-card-value">{car.engine || 'V6 Turbo'}</h4>
              </div>
            </div>

            <div className="spec-card-iconic">
              <div className="spec-icon-wrapper">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
              </div>
              <div>
                <span className="spec-card-label">Transmission</span>
                <h4 className="spec-card-value">{car.transmission}</h4>
              </div>
            </div>

            <div className="spec-card-iconic">
              <div className="spec-icon-wrapper">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                </svg>
              </div>
              <div>
                <span className="spec-card-label">Fuel Type</span>
                <h4 className="spec-card-value">{car.fuel}</h4>
              </div>
            </div>

            <div className="spec-card-iconic">
              <div className="spec-icon-wrapper">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                </svg>
              </div>
              <div>
                <span className="spec-card-label">Exterior</span>
                <h4 className="spec-card-value">{car.color || 'Premium Metallic'}</h4>
              </div>
            </div>

            <div className="spec-card-iconic">
              <div className="spec-icon-wrapper">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <span className="spec-card-label">Warranty</span>
                <h4 className="spec-card-value">12 Months Included</h4>
              </div>
            </div>
          </div>

          {/* TABBED INFORMATION CONTAINER */}
          <div className="modern-tabs-card">
            <div className="tabs-navigation-bar">
              <button 
                className={`tab-btn-modern ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications
              </button>
              <button 
                className={`tab-btn-modern ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Dealer Review
              </button>
              <button 
                className={`tab-btn-modern ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Equipment ({car.features?.length || 0})
              </button>
            </div>

            <div className="tab-content-panel">
              {activeTab === 'specs' && (
                <div className="specs-grid-detailed">
                  <div className="spec-row-item"><span>Make</span><span>{car.make}</span></div>
                  <div className="spec-row-item"><span>Model</span><span>{car.model}</span></div>
                  <div className="spec-row-item"><span>Year</span><span>{car.year}</span></div>
                  <div className="spec-row-item"><span>Price</span><span className="highlight-price">${car.price.toLocaleString()}</span></div>
                  <div className="spec-row-item"><span>Mileage</span><span>{car.mileage.toLocaleString()} mi</span></div>
                  <div className="spec-row-item"><span>Engine</span><span>{car.engine || 'V6 Turbo'}</span></div>
                  <div className="spec-row-item"><span>Transmission</span><span>{car.transmission}</span></div>
                  <div className="spec-row-item"><span>Fuel</span><span>{car.fuel}</span></div>
                  <div className="spec-row-item"><span>Exterior Color</span><span>{car.color || 'N/A'}</span></div>
                  <div className="spec-row-item"><span>Interior Color</span><span>{car.interior || 'N/A'}</span></div>
                  <div className="spec-row-item"><span>VIN</span><span>{car.vin || '1FMCU9GD5LUB12345'}</span></div>
                  <div className="spec-row-item"><span>Stock Number</span><span>{car.stockNumber || `AM-${car.id}`}</span></div>
                </div>
              )}

              {activeTab === 'description' && (
                <div className="description-prose">
                  <h3>Professional Overview</h3>
                  <p>{car.description || 'This vehicle has undergone a rigorous multi-point inspection by Auto Maestro certified technicians. Clean title guaranteed.'}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="features-chips-grid">
                  {(car.features && car.features.length > 0 ? car.features : [
                    'Navigation System', 'Leather Upholstery', 'Heated Front Seats', 'Bluetooth Connectivity',
                    'Backup Camera', 'Keyless Entry', 'Premium Sound System', 'Blind Spot Monitor'
                  ]).map((feat, idx) => (
                    <div key={idx} className="feature-chip-item">
                      <svg width="16" height="16" fill="none" stroke="var(--primary)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                      </svg>
                      {feat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* END TABS CONTAINER */}

        </div>

        {/* RIGHT STICKY SIDEBAR: BOOKING FORM */}
        <div className="detail-right-sidebar">
          <div className="sticky-booking-card" id="booking-form">
            
            <div className="booking-card-header">
              <span className="badge-vip">Priority Booking</span>
              <h3>Schedule a Test Drive</h3>
              <p>Select your date and time slot. We will hold the vehicle for your appointment.</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form-modern">
              <div className="form-group-modern">
                <label htmlFor="bkName">Full Name *</label>
                <input 
                  type="text" 
                  id="bkName" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="bkEmail">Email Address *</label>
                <input 
                  type="email" 
                  id="bkEmail" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="bkPhone">Phone Number</label>
                <input 
                  type="tel" 
                  id="bkPhone" 
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+1 (513) 555-0199"
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group-modern">
                  <label htmlFor="bkDate">Date *</label>
                  <input 
                    type="date" 
                    id="bkDate" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group-modern">
                  <label htmlFor="bkTime">Time Slot</label>
                  <select id="bkTime" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-confirm-booking">
                Confirm Appointment Slot
              </button>

              <p className="booking-trust-note">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                No payment required. Free cancellation.
              </p>
            </form>

          </div>
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)} aria-label="Close Lightbox">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <img src={allImages[activeImgIndex]} alt="Expanded View" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* TOAST ALERT */}
      {toast.show && (
        <div className={`toast ${toast.error ? 'error' : ''}`}>
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
