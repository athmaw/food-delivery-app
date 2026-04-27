"use client";

import Link from "next/link";
import { MapPin, ChevronDown } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">FoodMe</span>
          </Link>

          {/* Location Selector */}
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
            <MapPin className="w-4 h-4" />
            <span>Select your address</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-muted hover:text-primary transition-colors">
              Explore Foods
            </Link>
            <Link href="/cart" className="text-muted hover:text-primary transition-colors">
              Cart
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}