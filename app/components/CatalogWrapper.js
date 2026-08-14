"use client";

import { useState, useEffect, useMemo } from 'react';

export default function CatalogWrapper({ initialVehicles = [] }) {
  const [vehicles, setVehicles] = useState(initialVehicles);

  // Horizontal Category Pill State ("all", "sport", "berline", "suv", "electric")
  const [activeCategory, setActiveCategory] = useState('all');

  // Main Dropdown Filter States
  const [filterMake, setFilterMake] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterMileage, setFilterMileage] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Modal Display States
  const [selectedCar, setSelectedCar] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Inquiry Form States
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [toast, setToast] = useState({ show: false, error: false, message: '' });

  // Comparison & Favorites States
  const [selectedCompare, setSelectedCompare] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleCompare = (car, e) => {
    if (e) e.stopPropagation();
    setSelectedCompare(prev => {
      const exists = prev.some(c => c.id === car.id);
      if (exists) {
        return prev.filter(c => c.id !== car.id);
      }
      if (prev.length >= 3) {
        triggerToast('You can save or compare a maximum of 3 vehicles.', true);
        return prev;
      }
      return [...prev, car];
    });
  };

  // Unique makes from current stock
  const makesList = useMemo(() => {
    const makes = vehicles.map(v => v.make);
    return ['', ...Array.from(new Set(makes))].sort();
  }, [vehicles]);

  // Dynamic models based on selected make in stock
  const modelsList = useMemo(() => {
    const filtered = filterMake 
      ? vehicles.filter(v => v.make === filterMake)
      : vehicles;
    const models = filtered.map(v => v.model);
    return ['', ...Array.from(new Set(models))].sort();
  }, [vehicles, filterMake]);

  // Unique years in current stock
  const yearsList = useMemo(() => {
    const years = vehicles.map(v => v.year);
    return ['', ...Array.from(new Set(years))].sort((a, b) => b - a);
  }, [vehicles]);

  // Dynamic price thresholds derived from actual stock prices
  const priceOptions = useMemo(() => {
    if (!vehicles.length) return [];
    const prices = vehicles.map(v => v.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const candidateThresholds = [20000, 30000, 50000, 75000, 100000, 150000, 200000];
    return candidateThresholds.filter(t => t >= minP && t <= maxP + 30000);
  }, [vehicles]);

  // Category vehicle counts based on current inventory
  const categoryCounts = useMemo(() => {
    const counts = { all: vehicles.length, sport: 0, berline: 0, suv: 0, electric: 0 };
    vehicles.forEach(v => {
      const model = (v.model || '').toLowerCase();
      const make = (v.make || '').toLowerCase();
      const trans = (v.transmission || '').toLowerCase();
      const fuel = (v.fuel || '').toLowerCase();

      if (make === "porsche" || model.includes("mustang") || model.includes("amg") || model.includes("corvette") || model.includes("r8") || model.includes("m4") || trans.includes("pdk") || trans.includes("dct")) {
        counts.sport++;
      }
      if (model.includes("s-class") || model.includes("model s") || model.includes("c-class") || model.includes("civic")) {
        counts.berline++;
      }
      if (model.includes("g-class") || model.includes("cayenne") || model.includes("rav4") || model.includes("model y") || model.includes("navigator") || model.includes("defender") || model.includes("raptor") || model.includes("macan")) {
        counts.suv++;
      }
      if (fuel.includes("electric") || fuel.includes("hybrid")) {
        counts.electric++;
      }
    });
    return counts;
  }, [vehicles]);

  // Filtered and Sorted list
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    if (activeCategory === 'sport') {
      result = result.filter(v => 
        v.make === "Porsche" || 
        v.model.toLowerCase().includes("mustang") || 
        v.model.toLowerCase().includes("amg") || 
        v.model.toLowerCase().includes("corvette") || 
        v.model.toLowerCase().includes("r8") || 
        v.model.toLowerCase().includes("m4") || 
        v.transmission.toLowerCase().includes("pdk") ||
        v.transmission.toLowerCase().includes("dct")
      );
    } else if (activeCategory === 'berline') {
      result = result.filter(v => 
        v.model.toLowerCase().includes("s-class") || 
        v.model.toLowerCase().includes("model s") || 
        v.model.toLowerCase().includes("c-class") || 
        v.model.toLowerCase().includes("civic")
      );
    } else if (activeCategory === 'suv') {
      result = result.filter(v => 
        v.model.toLowerCase().includes("g-class") || 
        v.model.toLowerCase().includes("cayenne") || 
        v.model.toLowerCase().includes("rav4") || 
        v.model.toLowerCase().includes("model y") || 
        v.model.toLowerCase().includes("navigator") ||
        v.model.toLowerCase().includes("defender") ||
        v.model.toLowerCase().includes("raptor") ||
        v.model.toLowerCase().includes("macan")
      );
    } else if (activeCategory === 'electric') {
      result = result.filter(v => 
        v.fuel.toLowerCase().includes("electric") || 
        v.fuel.toLowerCase().includes("hybrid")
      );
    }

    if (filterMake) {
      result = result.filter(v => v.make === filterMake);
    }
    if (filterModel) {
      result = result.filter(v => v.model === filterModel);
    }
    if (filterYear) {
      result = result.filter(v => v.year === parseInt(filterYear));
    }
    if (filterPrice) {
      result = result.filter(v => v.price <= parseInt(filterPrice));
    }
    if (filterMileage) {
      result = result.filter(v => v.mileage <= parseInt(filterMileage));
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'mileage-asc') {
      result.sort((a, b) => a.mileage - b.mileage);
    } else if (sortBy === 'year-desc') {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [vehicles, activeCategory, filterMake, filterModel, filterYear, filterPrice, filterMileage, sortBy]);

  // Scroll to inventory section
  const scrollToInventory = () => {
    const inv = document.getElementById('inventaire');
    if (inv) inv.scrollIntoView({ behavior: 'smooth' });
  };

  // Modal handlers
  const openModal = (car) => {
    setSelectedCar(car);
    setActiveImgIndex(0);
    setInquiryName('');
    setInquiryEmail('');
    setInquiryPhone('');
    setInquiryMsg(`Hello, I am interested in checking availability for the ${car.make} ${car.model} (${car.year}) priced at $${car.price.toLocaleString()}.`);
  };

  const closeModal = () => {
    setSelectedCar(null);
  };

  const triggerToast = (message, isError = false) => {
    setToast({ show: true, error: isError, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) {
      triggerToast('Please fill out your name and email address.', true);
      return;
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          message: inquiryMsg,
          vehicleId: selectedCar ? selectedCar.id : 'GENERAL',
          vehicleName: selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : 'General Inquiry',
          date: 'N/A',
          time: 'N/A'
        })
      });

      if (res.ok) {
        triggerToast(`Inquiry sent successfully! Our sales team will contact you shortly.`);
        setInquiryName('');
        setInquiryEmail('');
        setInquiryPhone('');
        setInquiryMsg('');
        if (selectedCar) closeModal();
      } else {
        triggerToast('Failed to submit inquiry. Please try again.', true);
      }
    } catch (error) {
      console.error(error);
      triggerToast('Server communication error. Please try again.', true);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          backgroundColor: toast.error ? '#EF4444' : '#10B981',
          color: '#FFFFFF',
          padding: '14px 20px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-lg)',
          fontWeight: '600',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {toast.error ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            )}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* HERO SECTION - Find Your Dream Car with Blurred Car Background */}
      <section className="hero-section" id="accueil">
        <div className="hero-bg-blur-container">
          <div className="hero-bg-blur-image"></div>
          <div className="hero-bg-blur-overlay"></div>
        </div>

        <div className="container hero-content-relative" style={{ textAlign: 'center' }}>
          <h1 className="hero-dream-title">
            Find Your Dream Car
          </h1>
          <p className="hero-dream-subtitle">
            Explore verified pre-owned vehicles & premium inventory
          </p>

          {/* Professional Dealership Search Console */}
          <div className="search-console-card">
            {/* Category Segment Tabs */}
            <div className="search-console-tabs">
              <button 
                type="button"
                className={`console-tab ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Vehicles
              </button>
              <button 
                type="button"
                className={`console-tab ${activeCategory === 'sport' ? 'active' : ''}`}
                onClick={() => setActiveCategory('sport')}
              >
                Sports
              </button>
              <button 
                type="button"
                className={`console-tab ${activeCategory === 'berline' ? 'active' : ''}`}
                onClick={() => setActiveCategory('berline')}
              >
                Sedans
              </button>
              <button 
                type="button"
                className={`console-tab ${activeCategory === 'suv' ? 'active' : ''}`}
                onClick={() => setActiveCategory('suv')}
              >
                SUVs & 4x4s
              </button>
              <button 
                type="button"
                className={`console-tab ${activeCategory === 'electric' ? 'active' : ''}`}
                onClick={() => setActiveCategory('electric')}
              >
                Electric
              </button>
            </div>

            {/* Structured Search Controls */}
            <div className="search-console-grid">
              <div className="console-field">
                <span className="console-field-label">MAKE</span>
                <select 
                  value={filterMake} 
                  onChange={(e) => { setFilterMake(e.target.value); setFilterModel(''); }}
                  className="console-select"
                >
                  <option value="">Any Make</option>
                  {makesList.filter(Boolean).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="console-field">
                <span className="console-field-label">MODEL</span>
                <select 
                  value={filterModel} 
                  onChange={(e) => setFilterModel(e.target.value)}
                  className="console-select"
                >
                  <option value="">Any Model</option>
                  {modelsList.filter(Boolean).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="console-field">
                <span className="console-field-label">MAX PRICE</span>
                <select 
                  value={filterPrice} 
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="console-select"
                >
                  <option value="">All Prices</option>
                  {priceOptions.map(p => (
                    <option key={p} value={p}>Under ${p.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={scrollToInventory} 
                className="btn-console-submit"
              >
                <span>Search ({filteredVehicles.length})</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS SECTION - Drivenest Grid */}
      <section className="featured-section" id="inventaire">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title-main">Featured Listings</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                Explore certified vehicles available for immediate delivery.
              </p>
            </div>
          </div>

          {/* Sub-Category Pills */}
          <div className="category-tabs-container" style={{ marginBottom: '32px' }}>
            <ul className="category-tabs">
              <li 
                className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Vehicles ({categoryCounts.all})
              </li>
              <li 
                className={`category-tab ${activeCategory === 'sport' ? 'active' : ''}`}
                onClick={() => setActiveCategory('sport')}
              >
                Sports ({categoryCounts.sport})
              </li>
              <li 
                className={`category-tab ${activeCategory === 'berline' ? 'active' : ''}`}
                onClick={() => setActiveCategory('berline')}
              >
                Sedans ({categoryCounts.berline})
              </li>
              <li 
                className={`category-tab ${activeCategory === 'suv' ? 'active' : ''}`}
                onClick={() => setActiveCategory('suv')}
              >
                SUVs & 4x4s ({categoryCounts.suv})
              </li>
              <li 
                className={`category-tab ${activeCategory === 'electric' ? 'active' : ''}`}
                onClick={() => setActiveCategory('electric')}
              >
                Hybrids & Electrics ({categoryCounts.electric})
              </li>
            </ul>
          </div>

          {/* Grid of Drivenest Vehicle Cards */}
          <div className="vehicle-cards-grid">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((car) => {
                const isFavorited = selectedCompare.some(c => c.id === car.id);
                return (
                  <div key={car.id} className="drivenest-car-card">
                    <div className="card-img-box">
                      <img 
                        src={car.mainImage || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80'} 
                        alt={`${car.make} ${car.model}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <button 
                        className={`card-fav-btn ${isFavorited ? 'active' : ''}`}
                        onClick={(e) => handleToggleCompare(car, e)}
                        title={isFavorited ? 'Remove from saved' : 'Save vehicle / Compare'}
                      >
                        <svg width="18" height="18" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                    </div>

                    <div className="card-body-content">
                      <h3 className="card-title-text">{car.year} {car.make} {car.model}</h3>
                      <div className="card-subtitle-text">{car.engine || 'Certified Package'}</div>
                      <div className="card-price-text">${car.price.toLocaleString()}</div>

                      <div className="card-specs-row">
                        <div className="card-spec-item">
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>{car.mileage.toLocaleString()} mi</span>
                        </div>
                        <div className="card-spec-item">
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                          </svg>
                          <span>{car.transmission}</span>
                        </div>
                        <div className="card-spec-item">
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                          </svg>
                          <span>{car.fuel}</span>
                        </div>
                      </div>

                      <div className="card-location-row">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          In Stock & Verified
                        </span>
                        <span style={{ color: '#10B981', fontWeight: '700' }}>In Stock</span>
                      </div>

                      <button 
                        onClick={() => openModal(car)}
                        className="btn-card-action"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-results" style={{ gridColumn: '1 / -1', padding: '60px 24px', textAlign: 'center' }}>
                <h3>No Vehicles Found</h3>
                <p>Try clearing your active filters to see all available inventory.</p>
                <button 
                  onClick={() => {
                    setActiveCategory('all');
                    setFilterMake('');
                    setFilterModel('');
                    setFilterYear('');
                    setFilterPrice('');
                    setFilterMileage('');
                  }}
                  className="btn-hero-primary"
                  style={{ margin: '0 auto', display: 'inline-flex' }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* VEHICLE DETAILS MODAL */}
      {selectedCar && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <img 
                    src={selectedCar.images && selectedCar.images[activeImgIndex] ? selectedCar.images[activeImgIndex] : (selectedCar.mainImage || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80')} 
                    alt={selectedCar.model}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '12px' }}
                  />
                  {selectedCar.images && selectedCar.images.length > 1 && (
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                      {selectedCar.images.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt="thumb" 
                          referrerPolicy="no-referrer"
                          onClick={() => setActiveImgIndex(idx)}
                          style={{
                            width: '70px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: activeImgIndex === idx ? '2px solid var(--primary)' : '1px solid var(--border)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
                    {selectedCar.year} {selectedCar.make}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: '800', margin: '4px 0 12px 0' }}>
                    {selectedCar.model}
                  </h2>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '20px' }}>
                    ${selectedCar.price.toLocaleString()}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.85rem' }}>
                    <div><strong>Mileage:</strong> {selectedCar.mileage.toLocaleString()} mi</div>
                    <div><strong>Engine:</strong> {selectedCar.engine || 'V6 Turbo'}</div>
                    <div><strong>Transmission:</strong> {selectedCar.transmission}</div>
                    <div><strong>Fuel:</strong> {selectedCar.fuel}</div>
                    <div><strong>VIN:</strong> {selectedCar.vin || '1FMCU9GD5LUB12345'}</div>
                    <div><strong>Stock #:</strong> {selectedCar.stockNumber || `AM-${selectedCar.id}`}</div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {selectedCar.description || 'Pre-owned vehicle in pristine condition. Certified by Auto Maestro technicians.'}
                  </p>
                </div>
              </div>

              {/* Inquiry / Order Form */}
              <div style={{ backgroundColor: 'var(--bg-body)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>
                  Request Information / Schedule Test Drive
                </h3>
                <form onSubmit={handleInquirySubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Your Full Name *" 
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    required
                    style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email Address *" 
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    required
                    style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
                  />
                  <input 
                    type="text" 
                    disabled 
                    value={`Vehicle: ${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`} 
                    style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: '#E2E8F0', opacity: 0.8 }}
                  />
                  <textarea 
                    placeholder="Message / Special Requests" 
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    rows="3"
                    style={{ gridColumn: '1 / -1', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
                  ></textarea>

                  <button 
                    type="submit" 
                    className="btn-hero-primary" 
                    style={{ gridColumn: '1 / -1', justifyContent: 'center', marginTop: '8px' }}
                  >
                    Submit Availability Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY COMPARE DRAWER */}
      {selectedCompare.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1500,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>
            {selectedCompare.length} Vehicle(s) Saved
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selectedCompare.map(car => (
              <span key={car.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem' }}>
                {car.make} {car.model}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
