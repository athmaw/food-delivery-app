"use client";

import { useState } from "react";

const categories = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "noodles", label: "Noodles", emoji: "🍜" },
  { id: "healthy", label: "Healthy", emoji: "🥗" },
  { id: "sushi", label: "Sushi", emoji: "🍣" },
];

export function CategoriesSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">What are you craving?</h2>
        <p className="text-sm text-muted mt-1">Browse by category and find your favourite</p>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-white border border-border text-foreground hover:border-primary/50"
            }`}
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}