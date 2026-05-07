"use client";

import { Star, Clock } from "lucide-react";

const restaurants = [
  { id: 1, name: "McDonald's", category: "burgers", rating: 4.5, deliveryTime: "15-20", emoji: "🍔" },
  { id: 2, name: "Starbucks", category: "coffee", rating: 4.7, deliveryTime: "10-15", emoji: "☕" },
  { id: 3, name: "Pizza Hut", category: "pizza", rating: 4.3, deliveryTime: "25-30", emoji: "🍕" },
  { id: 4, name: "Noodle House", category: "noodles", rating: 4.6, deliveryTime: "20-25", emoji: "🍜" },
  { id: 5, name: "Green Bowl", category: "healthy", rating: 4.5, deliveryTime: "15-20", emoji: "🥗" },
  { id: 6, name: "Sushi World", category: "sushi", rating: 4.8, deliveryTime: "30-35", emoji: "🍣" },
  { id: 7, name: "Blazers", category: "desserts", rating: 4.4, deliveryTime: "20-25", emoji: "🍰" },
];

type Props = {
  activeCategory: string;
  searchQuery: string;
};

export function RestaurantsSection({ activeCategory, searchQuery }: Props) {
  const filtered = restaurants.filter((r) => {
    const matchesCategory =
      activeCategory === "all" || r.category === activeCategory;

    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Restaurants</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="p-4 border rounded-xl bg-white">
            <div className="text-3xl text-center">{r.emoji}</div>
            <h3 className="text-sm font-medium text-center mt-2">{r.name}</h3>
            <p className="text-xs text-center text-muted">{r.category}</p>

            <div className="flex justify-center gap-2 mt-2 text-xs">
              <span className="text-yellow-500 flex items-center gap-1">
                <Star className="w-3 h-3" /> {r.rating}
              </span>
              <span className="text-muted flex items-center gap-1">
                <Clock className="w-3 h-3" /> {r.deliveryTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}