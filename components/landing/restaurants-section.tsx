"use client";

import { Star, Clock } from "lucide-react";

const restaurants = [
  { id: 1, name: "McDonald's", category: "American, Burgers", rating: 4.5, deliveryTime: "15-20", emoji: "🍔" },
  { id: 2, name: "Starbucks", category: "Beverages", rating: 4.7, deliveryTime: "10-15", emoji: "☕" },
  { id: 3, name: "Pizza Hut", category: "Italian, American", rating: 4.3, deliveryTime: "25-30", emoji: "🍕" },
  { id: 4, name: "Noodle House", category: "Noodles, Delivery", rating: 4.6, deliveryTime: "20-25", emoji: "🍜" },
  { id: 5, name: "Green Bowl", category: "Healthy", rating: 4.5, deliveryTime: "15-20", emoji: "🥗" },
  { id: 6, name: "Sushi World", category: "Japanese", rating: 4.8, deliveryTime: "30-35", emoji: "🍣" },
  { id: 7, name: "Blazers", category: "Desserts", rating: 4.4, deliveryTime: "20-25", emoji: "🍰" },
];

export function RestaurantsSection() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Fast Delivery</h2>
        <p className="text-sm text-muted mt-1">Restaurants that deliver quickly to your door</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-xl p-4 border border-border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
          >
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-3">
              {restaurant.emoji}
            </div>
            <h3 className="font-medium text-foreground text-center text-sm truncate">
              {restaurant.name}
            </h3>
            <p className="text-xs text-muted text-center truncate mt-1">{restaurant.category}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs">
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                {restaurant.rating}
              </span>
              <span className="flex items-center gap-1 text-muted">
                <Clock className="w-3 h-3" />
                {restaurant.deliveryTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}