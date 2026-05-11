"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { Search } from "lucide-react";
import Image from "next/image";

type Props = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export function HeroSection({ searchQuery, setSearchQuery }: Props) {
  // Sync local input with global query if it changes from external sources (like a "Clear" button)
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-900">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Let's Feed You <span className="text-primary">Right Now!</span>
          </h1>

          <p className="mt-4 text-muted text-lg">
            Your favourite food, delivered fresh and fast.
          </p>

          <div className="mt-8 flex items-center gap-2 max-w-md mx-auto md:mx-0">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search restaurants or dishes"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src="/images/hero-food.jpg"
              alt="Food"
              fill
              className="object-cover rounded-2xl shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}