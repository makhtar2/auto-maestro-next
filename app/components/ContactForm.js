"use client";

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'General Inquiry',
    message: ''
  });
  
  const [status, setStatus] = useState({
    show: false,
    error: false,
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToast = (message, isError = false) => {
    setStatus({ show: true, error: isError, message });
    setTimeout(() => {
      setStatus(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill out all required fields marked with *.', true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'N/A',
          message: `[Topic: ${formData.topic}] ${formData.message}`,
          vehicleId: 'General Contact',
          vehicleName: `Inquiry: ${formData.topic}`,
          date: 'N/A',
          time: 'N/A'
        })
      });

      if (res.ok) {
        showToast('Thank you! Your message has been sent. Our team will reach back within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          topic: 'General Inquiry',
          message: ''
        });
      } else {
        showToast('Failed to send message. Please try again.', true);
      }
    } catch (error) {
      console.error(error);
      showToast('Server communication error. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modern-contact-form">
      <div className="contact-form-grid">
        <div className="form-group">
          <label htmlFor="contactName">FULL NAME *</label>
          <input 
            type="text" 
            id="contactName" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="John Doe" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">EMAIL ADDRESS *</label>
          <input 
            type="email" 
            id="contactEmail" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="john.doe@example.com" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactPhone">PHONE NUMBER</label>
          <input 
            type="tel" 
            id="contactPhone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="+1 (513) 555-0199" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactTopic">INQUIRY TOPIC</label>
          <select 
            id="contactTopic" 
            name="topic" 
            value={formData.topic} 
            onChange={handleChange}
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Schedule Test Drive">Schedule a Test Drive</option>
            <option value="Trade-in Estimate">Vehicle Trade-in Estimate</option>
            <option value="Financing & Purchasing">Financing & Purchasing</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label htmlFor="contactMessage">YOUR MESSAGE *</label>
        <textarea 
          id="contactMessage" 
          name="message" 
          value={formData.message} 
          onChange={handleChange} 
          placeholder="Tell us about the vehicle you are interested in or ask any question..." 
          rows="4" 
          required
        ></textarea>
      </div>

      <button type="submit" className="btn-modern-contact-submit" disabled={loading}>
        <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
        {!loading && (
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        )}
      </button>

      {status.show && (
        <div className={`form-toast-banner ${status.error ? 'error' : 'success'}`}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
            {!status.error ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            )}
          </svg>
          <span>{status.message}</span>
        </div>
      )}
    </form>
  );
}
