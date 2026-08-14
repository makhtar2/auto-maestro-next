"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasSession = cookies.some(c => c.trim().startsWith('auto_maestro_session=authenticated'));
      if (!hasSession) {
        router.push('/admin/login');
      } else {
        setAuthenticated(true);
      }
    };
    checkAuth();
  }, [router]);

  const handleSignOut = () => {
    document.cookie = "auto_maestro_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/admin/login');
  };
  const [vehicles, setVehicles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'leads'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCar, setEditCar] = useState(null); // If null, we are adding. If object, we are editing.
  
  // Form State
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    engine: '',
    color: '',
    interior: '',
    mainImage: '',
    description: '',
    featuresText: '' // Comma-separated list for features
  });

  const [toast, setToast] = useState({ show: false, error: false, message: '' });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, mainImage: data.url }));
        triggerToast('Image uploaded successfully!');
      } else {
        triggerToast(data.error || 'Failed to upload image.', true);
      }
    } catch (error) {
      console.error(error);
      triggerToast('Error uploading image.', true);
    } finally {
      setUploading(false);
    }
  };

  // Fetch all vehicles
  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      if (res.ok) {
        setVehicles(data);
      } else {
        triggerToast('Error loading vehicle inventory.', true);
      }
    } catch (error) {
      console.error(error);
      triggerToast('Server communication error.', true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all inquiries
  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (res.ok) {
        setInquiries(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchInquiries();
  }, []);

  const triggerToast = (message, isError = false) => {
    setToast({ show: true, error: isError, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Stats Calculations
  const stats = useMemo(() => {
    if (vehicles.length === 0) return { total: 0, avgPrice: 0, brands: 0, totalVal: 0 };
    const total = vehicles.length;
    const totalVal = vehicles.reduce((sum, v) => sum + v.price, 0);
    const avgPrice = Math.round(totalVal / total);
    const brands = new Set(vehicles.map(v => v.make)).size;
    return { total, avgPrice, brands, totalVal };
  }, [vehicles]);

  // Filtered List
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => 
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.year.toString().includes(searchTerm)
    );
  }, [vehicles, searchTerm]);

  // Open modal for Adding
  const handleAddClick = () => {
    setEditCar(null);
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      mileage: '',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      engine: '',
      color: '',
      interior: '',
      mainImage: '',
      description: '',
      featuresText: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleEditClick = (car) => {
    setEditCar(car);
    setFormData({
      make: car.make || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      price: car.price || '',
      mileage: car.mileage || '',
      transmission: car.transmission || 'Automatic',
      fuel: car.fuel || 'Gasoline',
      engine: car.engine || '',
      color: car.color || '',
      interior: car.interior || '',
      mainImage: car.mainImage || '',
      description: car.description || '',
      featuresText: (car.features || []).join(', ')
    });
    setIsModalOpen(true);
  };

  // Form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Delete Vehicle Action
  const handleDeleteClick = async (id, modelName) => {
    if (!confirm(`Are you sure you want to permanently delete the vehicle "${modelName}"?`)) return;

    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast('Vehicle successfully removed from the database.');
        fetchVehicles(); // Refetch
      } else {
        triggerToast('Failed to delete the vehicle.', true);
      }
    } catch (error) {
      console.error(error);
      triggerToast('Error during deletion.', true);
    }
  };

  // Form Submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare features array
    const features = formData.featuresText
      ? formData.featuresText.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    const requestBody = {
      ...formData,
      year: parseInt(formData.year),
      price: parseInt(formData.price),
      mileage: parseInt(formData.mileage),
      features,
      images: [formData.mainImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'] // Fallback
    };

    try {
      const url = editCar ? `/api/vehicles/${editCar.id}` : '/api/vehicles';
      const method = editCar ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (res.ok) {
        triggerToast(editCar ? 'Vehicle details updated successfully!' : 'New vehicle added to the inventory!');
        setIsModalOpen(false);
        fetchVehicles(); // Reload
      } else {
        triggerToast('An error occurred while saving the details.', true);
      }
    } catch (error) {
      console.error(error);
      triggerToast('Server error during submission.', true);
    }
  };

  // Inquiries Actions
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        triggerToast('Inquiry status updated successfully.');
        fetchInquiries();
      }
    } catch (error) {
      console.error(error);
      triggerToast('Error updating status.', true);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this customer lead?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        triggerToast('Customer lead deleted.');
        fetchInquiries();
      }
    } catch (error) {
      console.error(error);
      triggerToast('Error deleting lead.', true);
    }
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-body)' }}>
        <div style={{ color: 'var(--text-muted)', fontWeight: '600', fontFamily: 'var(--font-body)' }}>Verifying authorization...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)', padding: '40px 0' }}>
      <div className="container">
        
        {/* Navigation Bar */}
        <header id="mainHeader" style={{ position: 'relative', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', marginBottom: '32px', borderRadius: 'var(--radius)' }}>
          <div className="container nav-container" style={{ height: '70px', padding: '0 20px' }}>
            <Link href="/" className="logo-container">
              <img src="/logo.svg" alt="AUTO MAESTRO LLC Logo" className="brand-logo-img" />
            </Link>
            <ul className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <li><Link href="/">Back to Site</Link></li>
              <li><Link href="/admin" className="active">Admin Dashboard</Link></li>
              <li>
                <button 
                  onClick={handleSignOut}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: 'var(--text-muted)',
                    transition: 'var(--transition)'
                  }}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </header>

        {/* Dashboard Title */}
        <div className="admin-header">
          <div className="admin-title-wrap">
            <h1>Platform Operations</h1>
            <p>Monitor customer inquiries, update showroom appointments, and manage stock inventories.</p>
          </div>
          <button onClick={handleAddClick} className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Vehicle
          </button>
        </div>

        {/* Metrics Row */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h4>Total Vehicles</h4>
            <div className="val">{stats.total}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Inventory Value</h4>
            <div className="val">${stats.totalVal.toLocaleString()}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Average Price</h4>
            <div className="val">${stats.avgPrice.toLocaleString()}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Pending Leads</h4>
            <div className="val" style={{ color: 'var(--primary)' }}>
              {inquiries.filter(q => q.status === 'new').length}
            </div>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="admin-tabs" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '24px', paddingBottom: '2px' }}>
          <button 
            onClick={() => setActiveTab('inventory')} 
            className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: activeTab === 'inventory' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'inventory' ? '3px solid var(--primary)' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Vehicles Inventory
          </button>
          <button 
            onClick={() => setActiveTab('leads')} 
            className={`admin-tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: activeTab === 'leads' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'leads' ? '3px solid var(--primary)' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Customer Leads
            {inquiries.filter(q => q.status === 'new').length > 0 && (
              <span style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text-main)',
                fontSize: '0.7rem',
                padding: '2px 7px',
                borderRadius: '50px',
                fontWeight: '800'
              }}>
                {inquiries.filter(q => q.status === 'new').length}
              </span>
            )}
          </button>
        </div>

        {/* Tab CONTENT 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <>
            {/* Filters and List */}
            <div className="catalog-controls" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div className="search-field" style={{ width: '100%', maxWidth: '400px' }}>
                <input 
                  type="text" 
                  placeholder="Search by make, model, or year..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-surface)', padding: '12px 16px' }}
                />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', alignSelf: 'center' }}>
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </div>
            </div>

            <div className="admin-table-container">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading...</div>
              ) : filteredVehicles.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Year</th>
                      <th>Price</th>
                      <th>Mileage</th>
                      <th>Fuel / Transmission</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map(car => (
                      <tr key={car.id}>
                        <td>
                          <div className="admin-car-info">
                            <img src={car.mainImage} alt={car.model} className="admin-car-thumb" />
                            <div>
                              <div className="admin-car-name">{car.make} {car.model}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {car.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{car.year}</td>
                        <td style={{ fontWeight: '700', color: 'var(--primary)' }}>${car.price.toLocaleString()}</td>
                        <td>{car.mileage.toLocaleString()} mi</td>
                        <td>
                          <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{car.fuel}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{car.transmission}</div>
                        </td>
                        <td>
                          <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                            <Link href={`/vehicles/${car.id}`} target="_blank" className="btn-edit" style={{ background: 'var(--bg-body)', color: 'var(--text-muted)', marginRight: '6px', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                              View
                            </Link>
                            <button onClick={() => handleEditClick(car)} className="btn-edit">Edit</button>
                            <button onClick={() => handleDeleteClick(car.id, `${car.make} ${car.model}`)} className="btn-delete">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No vehicles matched your search.
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab CONTENT 2: Customer Leads */}
        {activeTab === 'leads' && (
          <div className="admin-table-container">
            {loadingInquiries ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading leads...</div>
            ) : inquiries.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Lead Contact Info</th>
                    <th>Vehicle Requested</th>
                    <th>Appointment Schedule</th>
                    <th>Status</th>
                    <th>Message Details</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq.id} style={{ backgroundColor: inq.status === 'new' ? 'rgba(79, 70, 229, 0.02)' : 'transparent' }}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{inq.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.phone}</div>
                      </td>
                      <td>
                        {inq.vehicleId !== 'General Inquiry' ? (
                          <Link href={`/vehicles/${inq.vehicleId}`} target="_blank" style={{ fontWeight: '600', color: 'var(--primary)', textDecoration: 'underline' }}>
                            {inq.vehicleName}
                          </Link>
                        ) : (
                          <span style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}>General Contact</span>
                        )}
                      </td>
                      <td>
                        {inq.date !== 'N/A' ? (
                          <>
                            <div style={{ fontWeight: '600' }}>{inq.date}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>at {inq.time}</div>
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>None</span>
                        )}
                      </td>
                      <td>
                        {inq.status === 'new' ? (
                          <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '50px', textTransform: 'uppercase' }}>
                            New
                          </span>
                        ) : inq.status === 'contacted' ? (
                          <span style={{ backgroundColor: 'rgba(79, 70, 229, 0.12)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '50px', textTransform: 'uppercase' }}>
                            Contacted
                          </span>
                        ) : (
                          <span style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '50px', textTransform: 'uppercase' }}>
                            Archived
                          </span>
                        )}
                      </td>
                      <td style={{ maxWidth: '280px', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {inq.message}
                      </td>
                      <td>
                        <div className="admin-actions" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                          {inq.status === 'new' && (
                            <button 
                              onClick={() => handleUpdateInquiryStatus(inq.id, 'contacted')} 
                              className="btn-edit" 
                              style={{ backgroundColor: 'var(--primary)', color: '#fff', border: 'none' }}
                            >
                              Contacted
                            </button>
                          )}
                          {inq.status === 'contacted' && (
                            <button 
                              onClick={() => handleUpdateInquiryStatus(inq.id, 'archived')} 
                              className="btn-edit"
                              style={{ backgroundColor: 'var(--text-dim)', color: '#fff', border: 'none' }}
                            >
                              Archive
                            </button>
                          )}
                          <button onClick={() => handleDeleteInquiry(inq.id)} className="btn-delete">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No customer leads found.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Admin Add/Edit Modal Overlay */}
      {isModalOpen && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <button onClick={() => setIsModalOpen(false)} className="modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', fontWeight: '800' }}>
                {editCar ? `Edit details for ${editCar.make} ${editCar.model}` : 'Add Vehicle to Inventory'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enter the technical details of the vehicle.</p>
            </div>
 
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-form">
                
                {/* Brand */}
                <div className="form-group">
                  <label>Make *</label>
                  <input type="text" name="make" value={formData.make} onChange={handleInputChange} placeholder="e.g. Porsche" required />
                </div>

                {/* Model */}
                <div className="form-group">
                  <label>Model *</label>
                  <input type="text" name="model" value={formData.model} onChange={handleInputChange} placeholder="e.g. 911 GT3" required />
                </div>

                {/* Year */}
                <div className="form-group">
                  <label>Year *</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} placeholder="e.g. 2022" required />
                </div>

                {/* Price */}
                <div className="form-group">
                  <label>Selling Price ($) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 89000" required />
                </div>

                {/* Mileage */}
                <div className="form-group">
                  <label>Mileage (miles) *</label>
                  <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="e.g. 12000" required />
                </div>

                {/* Engine */}
                <div className="form-group">
                  <label>Engine Size / Type</label>
                  <input type="text" name="engine" value={formData.engine} onChange={handleInputChange} placeholder="e.g. 3.0L Flat-6" />
                </div>

                {/* Transmission */}
                <div className="form-group">
                  <label>Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic (PDK)">Automatic (PDK)</option>
                    <option value="Automatic (AMG DCT)">Automatic (AMG DCT)</option>
                  </select>
                </div>

                {/* Fuel */}
                <div className="form-group">
                  <label>Fuel / Energy Type</label>
                  <select name="fuel" value={formData.fuel} onChange={handleInputChange}>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Mild Hybrid (MHEV)">Mild Hybrid (MHEV)</option>
                  </select>
                </div>

                {/* Color */}
                <div className="form-group">
                  <label>Exterior Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. Deep Black" />
                </div>

                {/* Interior */}
                <div className="form-group">
                  <label>Interior Finish</label>
                  <input type="text" name="interior" value={formData.interior} onChange={handleInputChange} placeholder="e.g. Red Alcantara Leather" />
                </div>

                {/* Main Image Upload & URL */}
                <div className="form-group-full" style={{ border: '1px dashed var(--border)', padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <label style={{ fontWeight: '700', marginBottom: '8px', display: 'block' }}>Vehicle Main Photo *</label>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Thumbnail Preview */}
                    {formData.mainImage && (
                      <img 
                        src={formData.mainImage} 
                        alt="Preview" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} 
                      />
                    )}
                    
                    {/* File Selector */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} 
                        id="carImageFile"
                        disabled={uploading}
                      />
                      <label 
                        htmlFor="carImageFile" 
                        className="btn btn-secondary" 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          cursor: uploading ? 'not-allowed' : 'pointer', 
                          opacity: uploading ? 0.7 : 1,
                          padding: '10px 16px',
                          fontSize: '0.85rem'
                        }}
                      >
                        {uploading ? (
                          <>
                            <span style={{ width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                            Choose Photo File
                          </>
                        )}
                      </label>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        Supports JPG, PNG, WEBP.
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Or enter Image URL manually:</label>
                    <input 
                      type="url" 
                      name="mainImage" 
                      value={formData.mainImage} 
                      onChange={handleInputChange} 
                      placeholder="https://images.unsplash.com/photo-..." 
                      required 
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group-full">
                  <label>Vehicle Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Enter marketing details..." required></textarea>
                </div>

                {/* Features (comma separated) */}
                <div className="form-group-full">
                  <label>Key Features (comma-separated)</label>
                  <input type="text" name="featuresText" value={formData.featuresText} onChange={handleInputChange} placeholder="e.g. Backup Camera, GPS, Heated Seats" />
                </div>

                {/* Action buttons */}
                <div className="admin-modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Vehicle</button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global toast notification system */}
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
