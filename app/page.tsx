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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <RestaurantsSection />
        <TopDishesSection />
        <HowItWorksSection />
        <PromoSection />
        <TestimonialsSection />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  )
}