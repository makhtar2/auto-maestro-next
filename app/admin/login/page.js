"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid username or password. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-body)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius)',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/">
            <img src="/logo.svg" alt="Auto Maestro Logo" style={{ height: '40px', margin: '0 auto 12px auto', display: 'block' }} />
          </Link>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Operations Terminal
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Authorized personnel access only.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            color: '#EF4444',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="loginUser" style={{ fontSize: '0.85rem', fontWeight: '600' }}>Username</label>
            <input
              type="text"
              id="loginUser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={{ padding: '12px', borderRadius: 'var(--radius-sm)' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPass" style={{ fontSize: '0.85rem', fontWeight: '600' }}>Password</label>
            <input
              type="password"
              id="loginPass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ padding: '12px', borderRadius: 'var(--radius-sm)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-search-full"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              padding: '14px',
              fontWeight: '700',
              marginTop: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600' }} className="back-link-hover">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
