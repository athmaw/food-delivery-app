"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { auth } from '../lib/firebase'; 
import { sendPasswordResetEmail, AuthError } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: string; msg: string }>({ type: '', msg: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({ 
        type: 'success', 
        msg: 'Instructions sent! Please check your email inbox.' 
      });
      setEmail('');
    } catch (error) {
      const authError = error as AuthError;
      let errorMsg = "An error occurred. Please try again.";
      if (authError.code === 'auth/user-not-found') errorMsg = "No account found with this email.";
      if (authError.code === 'auth/invalid-email') errorMsg = "Please enter a valid email address.";
      
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to login
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-primary">FeedMe</span>
            </Link>
            <h1 className="mt-4 text-2xl font-semibold text-foreground">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-muted">
              Enter your email and we'll send you a link to get back into your account.
            </p>
          </div>

          {status.msg && (
            <div className={`mb-6 rounded-lg p-3 text-center text-sm border ${
              status.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>

            {/* <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">
              Return to login
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}