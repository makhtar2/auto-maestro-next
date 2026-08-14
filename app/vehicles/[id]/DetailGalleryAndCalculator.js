"use client";

import { useState, useEffect } from 'react';

export default function DetailGalleryAndCalculator({ car }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Financing Calculator States
  const [downPayment, setDownPayment] = useState(Math.round(car.price * 0.1)); // Default 10% down
  const [loanTerm, setLoanTerm] = useState(60); // Default 60 months
  const [interestRate, setInterestRate] = useState(5.9); // Default 5.9% interest
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Booking Form States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [toast, setToast] = useState({ show: false, error: false, message: '' });

  // Calculate Loan Payment
  useEffect(() => {
    const principal = car.price - downPayment;
    if (principal <= 0) {
      setMonthlyPayment(0);
      return;
    }
    const monthlyRate = (interestRate / 100) / 12;
    if (monthlyRate === 0) {
      setMonthlyPayment(Math.round(principal / loanTerm));
      return;
    }
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                    (Math.pow(1 + monthlyRate, loanTerm) - 1);
    setMonthlyPayment(Math.round(payment));
  }, [downPayment, loanTerm, interestRate, car.price]);

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
          message: `Scheduled test drive booking request via details page. Estimated monthly payment calculated: $${monthlyPayment}/mo.`
        })
      });

      if (res.ok) {
        triggerToast(`Thank you! Your test drive booking for the ${car.make} ${car.model} is scheduled. Our representative will contact you shortly.`);
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

  return (
    <div className="detail-layout-grid">
      
      {/* Left Column: Media & Specifications */}
      <div className="detail-media-specs">
        {/* Main Image */}
        <div className="detail-main-img-box">
          <img 
            src={car.images?.[activeImgIndex] || car.mainImage} 
            alt={`${car.make} ${car.model}`} 
            className="detail-main-img"
          />
          <span className="detail-year-badge">{car.year}</span>
        </div>

        {/* Gallery Thumbnails */}
        {car.images && car.images.length > 1 && (
          <div className="detail-thumbs-container">
            {car.images.map((img, idx) => (
              <div 
                key={idx}
                className={`detail-thumb-card ${activeImgIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImgIndex(idx)}
              >
                <img src={img} alt={`${car.make} view ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}

        {/* Description card */}
        <div className="detail-card-panel">
          <h3>Dealer Review</h3>
          <p>{car.description}</p>
        </div>

        {/* Specs Table */}
        <div className="detail-card-panel">
          <h3>Technical Specifications</h3>
          <div className="detail-specs-table">
            <div className="specs-table-row">
              <span>Make</span>
              <span>{car.make}</span>
            </div>
            <div className="specs-table-row">
              <span>Model</span>
              <span>{car.model}</span>
            </div>
            <div className="specs-table-row">
              <span>Year</span>
              <span>{car.year}</span>
            </div>
            <div className="specs-table-row">
              <span>Price</span>
              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>${car.price.toLocaleString()}</span>
            </div>
            <div className="specs-table-row">
              <span>Mileage</span>
              <span>{car.mileage.toLocaleString()} miles</span>
            </div>
            <div className="specs-table-row">
              <span>Engine Size</span>
              <span>{car.engine || 'N/A'}</span>
            </div>
            <div className="specs-table-row">
              <span>Transmission</span>
              <span>{car.transmission}</span>
            </div>
            <div className="specs-table-row">
              <span>Fuel / Power</span>
              <span>{car.fuel}</span>
            </div>
            <div className="specs-table-row">
              <span>Exterior Color</span>
              <span>{car.color || 'N/A'}</span>
            </div>
            <div className="specs-table-row">
              <span>Interior Color</span>
              <span>{car.interior || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Included Features */}
        {car.features && car.features.length > 0 && (
          <div className="detail-card-panel">
            <h3>Standard Features</h3>
            <ul className="detail-features-list">
              {car.features.map((feat, idx) => (
                <li key={idx}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Column: Pricing, Calculator & Booking Form */}
      <div className="detail-sidebar-actions">
        
        {/* Main Price Card */}
        <div className="price-tag-card">
          <span className="price-label">Retail Price</span>
          <h2 className="price-value">${car.price.toLocaleString()}</h2>
          <p className="price-sub">Excludes tax, title, registration, and documentation fees.</p>
        </div>

        {/* Financing Calculator */}
        <div className="detail-sidebar-card">
          <h3>Estimated Financing Payment</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Calculate payments according to your specific down payment and interest rate.</p>
          
          <div className="calculator-form">
            <div className="form-group">
              <label>Down Payment ($)</label>
              <input 
                type="number" 
                value={downPayment}
                onChange={(e) => setDownPayment(Math.max(0, Math.min(car.price, parseInt(e.target.value) || 0)))}
                max={car.price}
                min={0}
              />
              <span className="input-helper-percent">({Math.round((downPayment / car.price) * 100)}% of price)</span>
            </div>

            <div className="form-group">
              <label>Loan Term</label>
              <select value={loanTerm} onChange={(e) => setLoanTerm(parseInt(e.target.value))}>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
                <option value="48">48 Months (4 Years)</option>
                <option value="60">60 Months (5 Years)</option>
                <option value="72">72 Months (6 Years)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Interest Rate (APR %)</label>
              <input 
                type="number" 
                step="0.1" 
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                min={0}
              />
            </div>

            <div className="calculator-output-card">
              <span>Estimated Payment</span>
              <h2>${monthlyPayment.toLocaleString()} <span>/mo</span></h2>
            </div>
          </div>
        </div>

        {/* Appointment Booking Form */}
        <div className="detail-sidebar-card appointment-card-highlight">
          <h3>Schedule a Showroom Visit</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Book a test drive or showroom viewing appointment. Our team will verify and hold the vehicle for your slot.</p>
          
          <form onSubmit={handleBookingSubmit} className="booking-form-vertical">
            <div className="form-group">
              <label htmlFor="bkName">Full Name *</label>
              <input 
                type="text" 
                id="bkName" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bkEmail">Email Address *</label>
              <input 
                type="email" 
                id="bkEmail" 
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g. john.doe@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bkPhone">Phone Number</label>
              <input 
                type="tel" 
                id="bkPhone" 
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="e.g. +1 (513) 555-9999"
              />
            </div>

            <div className="form-row-split">
              <div className="form-group">
                <label htmlFor="bkDate">Appointment Date *</label>
                <input 
                  type="date" 
                  id="bkDate" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // No past dates
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bkTime">Preferred Time</label>
                <select id="bkTime" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:30">02:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:30">05:30 PM</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-search-full" style={{ backgroundColor: 'var(--primary)', color: '#fff', marginTop: '10px' }}>
              Confirm Booking Slot
            </button>
          </form>
        </div>

      </div>

      {/* Global toast alert */}
      {toast.show && (
        <div className={`toast ${toast.error ? 'error' : ''}`}>
          {!toast.error ? (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
