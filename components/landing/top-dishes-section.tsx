"use client";

type Dish = {
  id: number;
  name: string;
  restaurant: string;
  price: number;
  emoji: string;
};

const dishes: Dish[] = [
  {
    id: 1,
    name: "Classic Smash Burger",
    restaurant: "Burger King",
    price: 9.49,
    emoji: "🍔",
  },
  {
    id: 2,
    name: "Caramel Latte",
    restaurant: "Starbucks",
    price: 6.99,
    emoji: "☕",
  },
  {
    id: 3,
    name: "Strawberry Cake",
    restaurant: "Sweet Treats",
    price: 8.69,
    emoji: "🍰",
  },
  {
    id: 4,
    name: "Spicy Ramen Bowl",
    restaurant: "Noodle House",
    price: 13.69,
    emoji: "🍜",
  },
  {
    id: 5,
    name: "Salmon Sushi Set",
    restaurant: "Sushi World",
    price: 18.99,
    emoji: "🍣",
  },
];

type Props = {
  searchQuery: string;
};

export function TopDishesSection({ searchQuery }: Props) {
  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Top dishes</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {filtered.map((dish) => (
          <div key={dish.id} className="border rounded-xl p-3 hover:shadow-sm transition">

            {/* EMOJI DISPLAY */}
            <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg text-5xl">
              {dish.emoji}
            </div>

            {/* INFO */}
            <h3 className="text-sm mt-2">{dish.name}</h3>
            <p className="text-xs text-muted">{dish.restaurant}</p>

            <div className="mt-2">
              <span className="text-primary font-medium">
                ${dish.price}
              </span>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}