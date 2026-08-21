"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const IconCar = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" />
    <path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Z" />
    <circle cx="7.5" cy="13.5" r="1.5" />
    <circle cx="16.5" cy="13.5" r="1.5" />
  </svg>
);

const IconInbox = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12h4l2 3h6l2-3h4" />
    <path d="M5.2 6.2 3 12v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6l-2.2-5.8A1 1 0 0 0 17.9 5H6.1a1 1 0 0 0-.9 1.2Z" />
  </svg>
);

const IconHome = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
  </svg>
);

const IconLogout = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const IconEye = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconPencil = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconTrash = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconArchive = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
    <path d="M10 13h4" />
  </svg>
);

const IconLayers = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </svg>
);

const IconWallet = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
    <path d="M3 7v10a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H6a2 2 0 0 1-2-2Z" />
    <circle cx="16.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const IconTrendingUp = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

const IconBell = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </svg>
);

const IconPlus = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 4v16m8-8H4" />
  </svg>
);

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error(error);
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error(error);
    }
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
  const [saving, setSaving] = useState(false);
  
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
    vin: '',
    stockNumber: '',
    mainImage: '',
    images: [],
    description: '',
    featuresText: '' // Comma-separated list for features
  });

  const [toast, setToast] = useState({ show: false, error: false, message: '' });
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingMain(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ 
          ...prev, 
          mainImage: data.url,
          images: prev.images.includes(data.url) ? prev.images : [data.url, ...prev.images]
        }));
        triggerToast('Main photo uploaded successfully!');
      } else {
        triggerToast(data.error || 'Failed to upload image.', true);
      }
    } catch (error) {
      console.error(error);
      triggerToast('Error uploading image.', true);
    } finally {
      setUploadingMain(false);
    }
  };

  const handleGalleryImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGallery(true);

    try {
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, data.url]
          }));
        }
      }
      triggerToast('Gallery photos uploaded successfully!');
    } catch (error) {
      console.error(error);
      triggerToast('Error uploading gallery photos.', true);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
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
      vin: '',
      stockNumber: '',
      mainImage: '',
      images: [],
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
      vin: car.vin || '',
      stockNumber: car.stockNumber || '',
      mainImage: car.mainImage || '',
      images: Array.isArray(car.images) ? car.images : (car.mainImage ? [car.mainImage] : []),
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

    if (!formData.mainImage) {
      triggerToast('Please upload a vehicle main photo before saving.', true);
      return;
    }

    setSaving(true);

    // Prepare features array
    const features = formData.featuresText
      ? formData.featuresText.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    const galleryImages = formData.images && formData.images.length > 0
      ? formData.images
      : [formData.mainImage];

    const requestBody = {
      ...formData,
      year: parseInt(formData.year) || new Date().getFullYear(),
      price: parseInt(formData.price) || 0,
      mileage: parseInt(formData.mileage) || 0,
      features,
      mainImage: formData.mainImage,
      images: galleryImages
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
    } finally {
      setSaving(false);
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
      <div className="min-h-screen flex items-center justify-center bg-body">
        <div className="font-body font-semibold text-text-muted">Verifying authorization...</div>
      </div>
    );
  }

  const pendingCount = inquiries.filter(q => q.status === 'new').length;

  return (
    <div className="admin-app">

      {/* Sticky top bar */}
      <header className="admin-topbar">
        <Link href="/" className="admin-topbar-logo">
          <img src="/logo.svg" alt="AUTO MAESTRO LLC" />
        </Link>
        <div className="admin-topbar-actions">
          <Link href="/" className="admin-icon-btn" aria-label="Back to site" title="Back to site">
            <IconHome width="18" height="18" />
          </Link>
          <button onClick={handleSignOut} className="admin-icon-btn" aria-label="Sign out" title="Sign out">
            <IconLogout width="18" height="18" />
          </button>
        </div>
      </header>

      <div className="admin-content container">

        {/* Dashboard Title */}
        <div className="admin-header">
          <div className="admin-title-wrap">
            <h1>Platform Operations</h1>
            <p>Monitor customer inquiries, update showroom appointments, and manage stock inventories.</p>
          </div>
          <button onClick={handleAddClick} className="btn btn-primary inline-flex items-center gap-2">
            <IconPlus width="16" height="16" />
            Add Vehicle
          </button>
        </div>

        {/* Metrics Row */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <h4>Total Vehicles</h4>
              <span className="admin-stat-icon"><IconLayers width="14" height="14" /></span>
            </div>
            <div className="val">{stats.total}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <h4>Inventory Value</h4>
              <span className="admin-stat-icon"><IconWallet width="14" height="14" /></span>
            </div>
            <div className="val">${stats.totalVal.toLocaleString()}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <h4>Average Price</h4>
              <span className="admin-stat-icon"><IconTrendingUp width="14" height="14" /></span>
            </div>
            <div className="val">${stats.avgPrice.toLocaleString()}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <h4>Pending Leads</h4>
              <span className="admin-stat-icon accent"><IconBell width="14" height="14" /></span>
            </div>
            <div className="val text-primary">{pendingCount}</div>
          </div>
        </div>

        {/* Tab bar: fixed bottom nav on mobile, top tabs on desktop */}
        <nav className="admin-tabbar">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`admin-tabbar-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          >
            <IconCar width="20" height="20" />
            <span>Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`admin-tabbar-btn ${activeTab === 'leads' ? 'active' : ''}`}
          >
            <IconInbox width="20" height="20" />
            <span>Leads</span>
            {pendingCount > 0 && <span className="admin-tabbar-badge">{pendingCount}</span>}
          </button>
        </nav>

        {/* Tab CONTENT 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <>
            {/* Filters and List */}
            <div className="catalog-controls">
              <div className="admin-search">
                <IconSearch width="16" height="16" />
                <input
                  type="text"
                  placeholder="Search by make, model, or year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="admin-results-count">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </div>
            </div>

            <div className="admin-table-container">
              {loading ? (
                <div className="text-center p-10 text-text-muted">Loading...</div>
              ) : filteredVehicles.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Year</th>
                      <th>Price</th>
                      <th>Mileage</th>
                      <th>Fuel / Transmission</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map(car => (
                      <tr key={car.id}>
                        <td className="cell-main">
                          <div className="admin-car-info">
                            <img src={car.mainImage} alt={car.model} className="admin-car-thumb" />
                            <div>
                              <div className="admin-car-name">{car.make} {car.model}</div>
                              <div className="text-xs text-text-dim">ID: {car.id}</div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Year">{car.year}</td>
                        <td data-label="Price" className="font-bold text-primary">${car.price.toLocaleString()}</td>
                        <td data-label="Mileage">{car.mileage.toLocaleString()} mi</td>
                        <td data-label="Fuel / Transmission">
                          <div>
                            <div className="text-[0.85rem] font-medium">{car.fuel}</div>
                            <div className="text-xs text-text-muted">{car.transmission}</div>
                          </div>
                        </td>
                        <td className="cell-actions">
                          <div className="admin-actions">
                            <Link href={`/vehicles/${car.id}`} className="admin-icon-action" aria-label="View listing" title="View listing">
                              <IconEye width="16" height="16" />
                            </Link>
                            <button onClick={() => handleEditClick(car)} className="admin-icon-action" aria-label="Edit vehicle" title="Edit vehicle">
                              <IconPencil width="16" height="16" />
                            </button>
                            <button onClick={() => handleDeleteClick(car.id, `${car.make} ${car.model}`)} className="admin-icon-action danger" aria-label="Delete vehicle" title="Delete vehicle">
                              <IconTrash width="16" height="16" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-text-muted">
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
              <div className="text-center p-10 text-text-muted">Loading leads...</div>
            ) : inquiries.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Lead Contact Info</th>
                    <th>Vehicle Requested</th>
                    <th>Appointment Schedule</th>
                    <th>Status</th>
                    <th>Message Details</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq.id} className={inq.status === 'new' ? 'bg-[rgba(29,97,231,0.03)]' : ''}>
                      <td className="cell-main">
                        <div className="font-bold text-text-main">{inq.name}</div>
                        <div className="text-[0.8rem] text-text-muted">{inq.email}</div>
                        <div className="text-[0.8rem] text-text-muted">{inq.phone}</div>
                      </td>
                      <td data-label="Vehicle">
                        {inq.vehicleId !== 'General Inquiry' ? (
                          <Link href={`/vehicles/${inq.vehicleId}`} className="font-semibold text-primary underline">
                            {inq.vehicleName}
                          </Link>
                        ) : (
                          <span className="italic text-text-dim">General Contact</span>
                        )}
                      </td>
                      <td data-label="Appointment">
                        {inq.date !== 'N/A' ? (
                          <div>
                            <div className="font-semibold">{inq.date}</div>
                            <div className="text-[0.8rem] text-text-muted">at {inq.time}</div>
                          </div>
                        ) : (
                          <span className="text-text-dim">None</span>
                        )}
                      </td>
                      <td data-label="Status">
                        {inq.status === 'new' ? (
                          <span className="bg-emerald-500/10 text-emerald-500 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
                            New
                          </span>
                        ) : inq.status === 'contacted' ? (
                          <span className="bg-primary-light text-primary text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
                            Contacted
                          </span>
                        ) : (
                          <span className="bg-border text-text-muted text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
                            Archived
                          </span>
                        )}
                      </td>
                      <td data-label="Message" className="max-w-[280px] text-[0.85rem] text-text-muted whitespace-normal break-words">
                        {inq.message}
                      </td>
                      <td className="cell-actions">
                        <div className="admin-actions">
                          {inq.status === 'new' && (
                            <button
                              onClick={() => handleUpdateInquiryStatus(inq.id, 'contacted')}
                              className="admin-icon-action primary"
                              aria-label="Mark as contacted"
                              title="Mark as contacted"
                            >
                              <IconCheck width="16" height="16" />
                            </button>
                          )}
                          {inq.status === 'contacted' && (
                            <button
                              onClick={() => handleUpdateInquiryStatus(inq.id, 'archived')}
                              className="admin-icon-action"
                              aria-label="Archive lead"
                              title="Archive lead"
                            >
                              <IconArchive width="16" height="16" />
                            </button>
                          )}
                          <button onClick={() => handleDeleteInquiry(inq.id)} className="admin-icon-action danger" aria-label="Delete lead" title="Delete lead">
                            <IconTrash width="16" height="16" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-text-muted">
                No customer leads found.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Admin Add/Edit Modal Overlay */}
      {isModalOpen && (
        <div className="modal active admin-modal">
          <div className="modal-content">
            <button onClick={() => setIsModalOpen(false)} className="modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div className="p-6 border-b border-border">
              <h2 className="font-title text-2xl font-extrabold">
                {editCar ? `Edit details for ${editCar.make} ${editCar.model}` : 'Add Vehicle to Inventory'}
              </h2>
              <p className="text-text-muted text-[0.85rem]">Enter the technical details of the vehicle.</p>
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

                {/* Exterior Color */}
                <div className="form-group">
                  <label>Exterior Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. Deep Black Metallic" />
                </div>

                {/* Interior */}
                <div className="form-group">
                  <label>Interior Finish</label>
                  <input type="text" name="interior" value={formData.interior} onChange={handleInputChange} placeholder="e.g. Black Leather / Carbon" />
                </div>

                {/* VIN */}
                <div className="form-group">
                  <label>VIN (Chassis Number)</label>
                  <input type="text" name="vin" value={formData.vin} onChange={handleInputChange} placeholder="e.g. 1FMCU9GD5LUB12345" />
                </div>

                {/* Stock Number */}
                <div className="form-group">
                  <label>Stock Number</label>
                  <input type="text" name="stockNumber" value={formData.stockNumber} onChange={handleInputChange} placeholder="e.g. AM-2026-01" />
                </div>

                {/* Main Image Upload & URL */}
                <div className="form-group-full border border-dashed border-border p-4 rounded-sm bg-black/[0.02]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-bold block m-0">Vehicle Main Cover Photo *</label>
                    <span className="text-xs text-text-muted">Primary display photo</span>
                  </div>

                  <div className="flex gap-4 items-center flex-wrap">
                    {/* Thumbnail Preview */}
                    {formData.mainImage && (
                      <div className="relative group">
                        <img
                          src={formData.mainImage}
                          alt="Main Preview"
                          className="w-24 h-20 object-cover rounded border border-border"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/70 text-[10px] text-white px-1 rounded font-bold">COVER</span>
                      </div>
                    )}

                    {/* File Selector */}
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                        id="carImageFile"
                        disabled={uploadingMain || saving}
                      />
                      <label
                        htmlFor="carImageFile"
                        className={`btn btn-secondary inline-flex items-center gap-2 py-2 px-4 text-[0.85rem] ${uploadingMain || saving ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                      >
                        {uploadingMain ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full inline-block animate-spin" />
                            Uploading to Cloud...
                          </>
                        ) : (
                          <>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                            {formData.mainImage ? 'Change Main Photo' : 'Upload Main Photo'}
                          </>
                        )}
                      </label>
                      <div className="text-xs text-text-muted mt-1.5">
                        High resolution JPG, PNG, WEBP automatically optimized on Cloudinary.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Gallery Photos */}
                <div className="form-group-full border border-dashed border-border p-4 rounded-sm bg-black/[0.02]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-bold block m-0">Additional Gallery Photos</label>
                    <span className="text-xs text-text-muted">{formData.images.length} photos selected</span>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group w-16 h-16 rounded border border-border overflow-hidden">
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl hover:bg-red-700 transition"
                            title="Remove photo"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageUpload}
                    className="hidden"
                    id="carGalleryFiles"
                    disabled={uploadingGallery || saving}
                  />
                  <label
                    htmlFor="carGalleryFiles"
                    className={`btn btn-secondary inline-flex items-center gap-2 py-1.5 px-3 text-[0.8rem] ${uploadingGallery || saving ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                  >
                    {uploadingGallery ? (
                      <>
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full inline-block animate-spin" />
                        Uploading gallery...
                      </>
                    ) : (
                      <>
                        <IconPlus width="14" height="14" />
                        Add Gallery Photos
                      </>
                    )}
                  </label>
                </div>

                {/* Description */}
                <div className="form-group-full">
                  <label>Vehicle Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Enter detailed vehicle condition, history, performance specs..." required></textarea>
                </div>

                {/* Features (comma separated) */}
                <div className="form-group-full">
                  <label>Key Features & Options (comma-separated)</label>
                  <input type="text" name="featuresText" value={formData.featuresText} onChange={handleInputChange} placeholder="e.g. Carbon Ceramic Brakes, Apple CarPlay, Panoramic Sunroof, Heated Seats" />
                </div>

                {/* Action buttons */}
                <div className="admin-modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary inline-flex items-center gap-2" disabled={saving || uploadingMain || uploadingGallery}>
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block animate-spin" />
                        Saving Vehicle...
                      </>
                    ) : (
                      editCar ? 'Update Vehicle' : 'Publish to Inventory'
                    )}
                  </button>
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

      {/* Floating action button (mobile) */}
      {activeTab === 'inventory' && (
        <button onClick={handleAddClick} className="admin-fab" aria-label="Add vehicle" title="Add vehicle">
          <IconPlus width="24" height="24" />
        </button>
      )}
    </div>
  );
}
