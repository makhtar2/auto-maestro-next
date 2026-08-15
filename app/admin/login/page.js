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
    <div className="min-h-screen flex items-center justify-center bg-body p-5">
      <div className="w-full max-w-[420px] flex flex-col gap-6 rounded bg-surface border border-border p-10 shadow-lg">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/">
            <img src="/logo.svg" alt="Auto Maestro Logo" className="mx-auto mb-3 block h-10" />
          </Link>
          <h2 className="font-title text-[1.35rem] font-extrabold text-text-main">
            Operations Terminal
          </h2>
          <p className="mt-1 text-[0.8rem] text-text-muted">
            Authorized personnel access only.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-500 bg-red-500/10 p-3 text-center text-[0.85rem] font-semibold text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="form-group">
            <label htmlFor="loginUser" className="text-[0.85rem] font-semibold">Username</label>
            <input
              type="text"
              id="loginUser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="rounded-sm p-3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPass" className="text-[0.85rem] font-semibold">Password</label>
            <input
              type="password"
              id="loginPass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="rounded-sm p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-sm border-none bg-primary p-3.5 font-bold text-white cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-70 hover:bg-primary-hover"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="border-t border-border pt-4 text-center">
          <Link href="/" className="text-[0.85rem] font-semibold text-text-muted no-underline hover:text-primary">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
