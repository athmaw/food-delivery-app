"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { CategoriesSection } from "@/components/landing/categories-section"
import { RestaurantsSection } from "@/components/landing/restaurants-section"
import { TopDishesSection } from "@/components/landing/top-dishes-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { PromoSection } from "@/components/landing/promo-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { DownloadSection } from "@/components/landing/download-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(""); 
  };

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <Navbar />
      <main>
        <HeroSection 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
        />

        <CategoriesSection
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange} 
        />

        <RestaurantsSection 
          activeCategory={activeCategory}
          searchQuery={searchQuery}
        />

        <TopDishesSection 
          searchQuery={searchQuery}
        />

        <HowItWorksSection />
        <PromoSection />
        <TestimonialsSection />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  )
}