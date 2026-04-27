"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

const dishes = [
  {
    id: 1,
    name: "Classic Smash Burger",
    restaurant: "Burger King",
    price: 9.49,
    image: "/images/dishes/burger.jpg",
  },
  {
    id: 2,
    name: "Caramel Latte",
    restaurant: "Starbucks",
    price: 6.99,
    image: "/images/dishes/latte.jpg",
  },
  {
    id: 3,
    name: "Strawberry Cake",
    restaurant: "Sweet Treats",
    price: 8.69,
    image: "/images/dishes/cake.jpg",
  },
  {
    id: 4,
    name: "Spicy Ramen Bowl",
    restaurant: "Noodle House",
    price: 13.69,
    image: "/images/dishes/ramen.jpg",
  },
  {
    id: 5,
    name: "Salmon Sushi Set",
    restaurant: "Sushi World",
    price: 18.99,
    image: "/images/dishes/sushi.jpg",
  },
];

export function TopDishesSection() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Top dishes</h2>
        <p className="text-sm text-muted mt-1">Some people are ordering this week today</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-xl p-3 border border-border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-medium text-foreground text-sm truncate">{dish.name}</h3>
            <p className="text-xs text-muted truncate mt-0.5">{dish.restaurant}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-primary font-semibold">${dish.price.toFixed(2)}</span>
              <button className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}