"use client";

import { Star, Clock, SearchX } from "lucide-react";

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
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto text-slate-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Restaurants</h2>
        <p className="text-sm text-muted">
          {filtered.length === 0 ? "No matches" : `${filtered.length} places found`}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((r) => (
            <div key={r.id} className="group p-5 border border-border rounded-2xl bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl text-center py-8 bg-slate-50 rounded-xl mb-4 group-hover:scale-105 transition-transform">
                {r.emoji}
              </div>
              <h3 className="text-lg font-bold text-center">{r.name}</h3>
              <p className="text-sm text-center text-muted capitalize mb-4">{r.category}</p>

              <div className="flex justify-center gap-4 pt-4 border-t border-slate-100 text-xs font-semibold">
                <span className="text-yellow-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500" /> {r.rating}
                </span>
                <span className="text-muted flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {r.deliveryTime} min
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- DYNAMIC NOTIFICATION STATE --- */
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <SearchX className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No results found</h3>
          <p className="text-slate-500 mt-2 text-center max-w-xs">
            {searchQuery 
              ? `We couldn't find anything matching "${searchQuery}" ${activeCategory !== 'all' ? `in ${activeCategory}` : ''}.`
              : `There are currently no items available in the ${activeCategory} category.`
            }
          </p>
          <button 
            onClick={() => window.location.reload()} // Simplest way to clear, or use your state setters
            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Browse all restaurants
          </button>
        </div>
      )}
    </section>
  );
}