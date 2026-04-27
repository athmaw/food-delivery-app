"use client";

import { Search } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {"Let's Feed You "}
            <span className="text-primary">Right Now!</span>
          </h1>
          <p className="mt-4 text-muted text-lg max-w-md mx-auto md:mx-0">
            Your favourite food, delivered fresh and fast — no waiting, no stress.
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex items-center gap-2 max-w-md mx-auto md:mx-0">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Search for restaurants and dishes"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-sm text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              500+ restaurants open now
            </span>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src="/images/hero-food.jpg"
              alt="Delicious food delivery"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}