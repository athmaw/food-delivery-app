"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Clock, Heart, Grid3X3, List, X, ChevronDown, SearchX } from "lucide-react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useCart } from "@/hooks/use-cart";
import { Navbar } from "@/components/landing/navbar"

// Categories data
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

// Restaurants data
const restaurants = [
  {
    id: 1,
    name: "Pizza-Bit",
    tags: ["Pizza", "Italian", "Fast food"],
    rating: 4.9,
    deliveryTime: "5 min",
    priceRange: "$",
    distance: "1.2 km",
    minOrder: 8,
    badge: "30% OFF",
    badgeColor: "bg-primary",
    bgColor: "bg-yellow-100",
    emoji: "🍕",
  },
  {
    id: 2,
    name: "McDonalds",
    tags: ["Burgers", "Fast food", "American"],
    rating: 4.8,
    deliveryTime: "5 min",
    priceRange: "$",
    distance: "0.8 km",
    minOrder: 5,
    bgColor: "bg-amber-100",
    emoji: "🍔",
  },
  {
    id: 3,
    name: "Starbucks",
    tags: ["Coffee", "Drinks", "Snacks"],
    rating: 4.7,
    deliveryTime: "10 min",
    priceRange: "$$",
    distance: "2.1 km",
    minOrder: 6,
    bgColor: "bg-green-100",
    emoji: "☕",
  },
  {
    id: 4,
    name: "Noodle House",
    tags: ["Noodles", "Asian", "Ramen"],
    rating: 4.6,
    deliveryTime: "8 min",
    priceRange: "$",
    distance: "1.5 km",
    minOrder: 10,
    bgColor: "bg-orange-100",
    emoji: "🍜",
  },
  {
    id: 5,
    name: "Green Bowl",
    tags: ["Healthy", "Salads", "Vegan"],
    rating: 4.5,
    deliveryTime: "12 min",
    priceRange: "$$",
    distance: "2.4 km",
    minOrder: 12,
    bgColor: "bg-lime-100",
    emoji: "🥗",
  },
  {
    id: 6,
    name: "Sushi World",
    tags: ["Sushi", "Japanese", "Seafood"],
    rating: 4.8,
    deliveryTime: "15 min",
    priceRange: "$$$",
    distance: "3.0 km",
    minOrder: 20,
    bgColor: "bg-pink-100",
    emoji: "🍣",
  },
  {
    id: 7,
    name: "Sweet Spot",
    tags: ["Desserts", "Cakes", "Waffles"],
    rating: 4.7,
    deliveryTime: "15 min",
    priceRange: "$$",
    distance: "1.9 km",
    minOrder: 8,
    badge: "New!",
    badgeColor: "bg-green-500",
    bgColor: "bg-rose-100",
    emoji: "🧁",
  },
  {
    id: 8,
    name: "Oven Story",
    tags: ["Pizza", "Pasta", "Italian"],
    rating: 4.5,
    deliveryTime: "18 min",
    priceRange: "$$",
    distance: "2.8 km",
    minOrder: 10,
    bgColor: "bg-orange-100",
    emoji: "🍕",
  },
  {
    id: 9,
    name: "Arabica Roasters",
    tags: ["Coffee", "Specialty", "Brunch"],
    rating: 4.9,
    deliveryTime: "8 min",
    priceRange: "$$$",
    distance: "1.1 km",
    minOrder: 15,
    bgColor: "bg-amber-100",
    emoji: "☕",
  },
  {
    id: 10,
    name: "Poke Bar",
    tags: ["Healthy", "Poke", "Hawaiian"],
    rating: 4.7,
    deliveryTime: "14 min",
    priceRange: "$$",
    distance: "2.2 km",
    minOrder: 12,
    badge: "15% Off",
    badgeColor: "bg-primary",
    bgColor: "bg-teal-100",
    emoji: "🥗",
  },
  {
    id: 11,
    name: "Bento Express",
    tags: ["Japanese", "Bento", "Sushi"],
    rating: 4.6,
    deliveryTime: "20 min",
    priceRange: "$$",
    distance: "3.2 km",
    minOrder: 15,
    bgColor: "bg-red-100",
    emoji: "🍱",
  },
];

const popularDishes = [
  { id: 1, name: "Pepperoni Pizza", restaurant: "Pizza-Bit", deliveryTime: "5 min", price: 12.99, bgColor: "bg-yellow-100", emoji: "🍕" },
  { id: 2, name: "Classic Smash Burger", restaurant: "McDonalds", deliveryTime: "5 min", price: 9.49, bgColor: "bg-amber-100", emoji: "🍔" },
  { id: 3, name: "Caramel Latte", restaurant: "Starbucks", deliveryTime: "10 min", price: 6.50, bgColor: "bg-green-100", emoji: "☕" },
  { id: 4, name: "Spicy Ramen Bowl", restaurant: "Noodle House", deliveryTime: "8 min", price: 11.00, bgColor: "bg-orange-100", emoji: "🍜" },
  { id: 5, name: "Salmon Sushi Set", restaurant: "Sushi World", deliveryTime: "15 min", price: 18.50, bgColor: "bg-pink-100", emoji: "🍣" },
];

const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "highest-rated", label: "Highest rated" },
  { id: "fastest-delivery", label: "Fastest delivery" },
  { id: "price-low-high", label: "Price: low to high" },
  { id: "most-popular", label: "Most popular" },
];

function ExploreUserDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };
  const getFirstName = () => user.displayName?.split(" ")[0] || user.email?.split("@")[0] || "User";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
      >
        {getFirstName()}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <Link href="/profile" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 block">Profile</Link>
          <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("recommended");
  const [minRating, setMinRating] = useState("all");
  const [deliveryTime, setDeliveryTime] = useState("any");
  const [priceRange, setPriceRange] = useState("all");
  const [openNow, setOpenNow] = useState(true);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [newRestaurants, setNewRestaurants] = useState(false);
  const [promotionsOnly, setPromotionsOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 9]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]);
  };

  const clearAllFilters = () => {
    setActiveCategory("all");
    setActiveSort("recommended");
    setMinRating("all");
    setDeliveryTime("any");
    setPriceRange("all");
    setOpenNow(true);
    setFreeDelivery(false);
    setNewRestaurants(false);
    setPromotionsOnly(false);
    setSearchQuery("");
  };

  // IDEAL UX: Typing clears category
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim() !== "") {
      setActiveCategory("all");
    }
  };

  // IDEAL UX: Selecting category clears search
  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");
  };

  const getCategoryCount = (categoryId: string) => {
    return restaurants.filter((restaurant) => {
      if (categoryId === "all") return true;
      return restaurant.tags.some((tag) => tag.toLowerCase().includes(categoryId.toLowerCase()));
    }).length;
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // Category
      if (activeCategory !== "all") {
        if (!restaurant.tags.some((tag) => tag.toLowerCase().includes(activeCategory.toLowerCase()))) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = restaurant.name.toLowerCase().includes(query);
        const matchesTags = restaurant.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesTags) return false;
      }
      // Ratings/Time/Price
      if (minRating !== "all") {
        const val = parseFloat(minRating.replace("+", ""));
        if (restaurant.rating < val) return false;
      }
      if (deliveryTime !== "any") {
        const max = parseInt(deliveryTime);
        if (parseInt(restaurant.deliveryTime) > max) return false;
      }
      if (priceRange !== "all" && restaurant.priceRange !== priceRange) return false;
      if (freeDelivery && !restaurant.badge?.toLowerCase().includes("free")) return false;
      if (newRestaurants && !restaurant.badge?.toLowerCase().includes("new")) return false;
      if (promotionsOnly && !restaurant.badge) return false;

      return true;
    });
  }, [activeCategory, searchQuery, minRating, deliveryTime, priceRange, freeDelivery, newRestaurants, promotionsOnly]);

  const filteredDishes = useMemo(() => {
    return popularDishes.filter(dish => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = dish.name.toLowerCase().includes(query) || dish.restaurant.toLowerCase().includes(query);
      if (activeCategory === "all") return matchesSearch;
      
      const parent = restaurants.find(r => r.name === dish.restaurant);
      return matchesSearch && parent?.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase()));
    });
  }, [searchQuery, activeCategory]);

  const sortedRestaurants = useMemo(() => {
    const result = [...filteredRestaurants];
    switch (activeSort) {
      case "highest-rated": return result.sort((a, b) => b.rating - a.rating);
      case "fastest-delivery": return result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      case "price-low-high":
        const pMap: Record<string, number> = { "$": 1, "$$": 2, "$$$": 3 };
        return result.sort((a, b) => pMap[a.priceRange] - pMap[b.priceRange]);
      default: return result;
    }
  }, [filteredRestaurants, activeSort]);

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary">FOOD APP</Link>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>123 Orchard Road, Singapore</span>
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-muted hover:text-foreground">Home</Link>
              <Link href="/explore" className="text-primary font-medium">Explore Foods</Link>
              <Link href="/cart" className="text-muted hover:text-foreground">Cart</Link>
            </nav>
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg">Sign Up</Link>
                  <Link href="/login" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg">Log In</Link>
                </>
              ) : <ExploreUserDropdown user={user} />}
            </div>
          </div>
        </div>
      </header> */}

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Explore Foods 🍽️</h1>
          <p className="text-muted mt-1">Discover restaurants and dishes near you.</p>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg">Search</button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Category</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat.id ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                    >
                      <span className="flex items-center gap-2"><span>{cat.emoji}</span>{cat.label}</span>
                      <span className={activeCategory === cat.id ? "text-white/80" : "text-primary"}>{getCategoryCount(cat.id)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Sort By</h3>
                <div className="space-y-1">
                  {sortOptions.map((opt) => (
                    <button key={opt.id} onClick={() => setActiveSort(opt.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSort === opt.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"}`}>{opt.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Min. Rating</h3>
                <div className="flex flex-wrap gap-2">
                  {["all", "4.5+", "4.7+", "4.9+"].map((r) => (
                    <button key={r} onClick={() => setMinRating(r)} className={`px-3 py-1.5 rounded-lg text-sm border ${minRating === r ? "bg-primary text-white border-primary" : "border-border hover:border-primary/50"}`}>{r === "all" ? "All" : `★ ${r}`}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Preferences</h3>
                <div className="space-y-3">
                  {[
                    { id: "freeDelivery", label: "Free delivery", value: freeDelivery, setter: setFreeDelivery },
                    { id: "newRestaurants", label: "New restaurants", value: newRestaurants, setter: setNewRestaurants },
                    { id: "promotionsOnly", label: "Promotions only", value: promotionsOnly, setter: setPromotionsOnly },
                  ].map((pref) => (
                    <label key={pref.id} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm">{pref.label}</span>
                      <button onClick={() => pref.setter(!pref.value)} className={`w-10 h-6 rounded-full transition-colors ${pref.value ? "bg-primary" : "bg-gray-300"}`}>
                        <span className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${pref.value ? "translate-x-5" : "translate-x-1"}`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={clearAllFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted hover:text-foreground hover:border-foreground/30"><X className="w-4 h-4" /> Clear all filters</button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {sortedRestaurants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-border">
                <div className="bg-gray-100 p-4 rounded-full mb-4"><SearchX className="w-10 h-10 text-muted" /></div>
                <h3 className="text-xl font-semibold text-foreground">No results found</h3>
                <p className="text-muted mt-2 text-center max-w-xs">We couldn't find any restaurants matching your current criteria.</p>
                <button onClick={clearAllFilters} className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted">Showing <span className="font-semibold text-foreground">{sortedRestaurants.length}</span> restaurants</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg border ${viewMode === "grid" ? "bg-primary text-white border-primary" : "border-border text-muted"}`}><Grid3X3 className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg border ${viewMode === "list" ? "bg-primary text-white border-primary" : "border-border text-muted"}`}><List className="w-4 h-4" /></button>
                  </div>
                </div>

                {!searchQuery && activeCategory === "all" && (
                  <div className="bg-accent rounded-xl p-6 mb-6 relative overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">🔥 Trending this week</h2>
                      <p className="text-gray-300 text-sm mt-1">These spots are getting all the orders right now.</p>
                    </div>
                    <div className="absolute right-4 bottom-0 text-6xl opacity-50">🍕🍔🥗</div>
                  </div>
                )}

                <div className={`grid gap-4 mb-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" : "grid-cols-1"}`}>
                  {sortedRestaurants.map((restaurant) => (
                    <div key={restaurant.id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-all cursor-pointer">
                      <div className={`relative ${restaurant.bgColor} p-4 flex items-center justify-center h-32`}>
                        {restaurant.badge && <span className={`absolute top-2 left-2 ${restaurant.badgeColor} text-white text-xs font-medium px-2 py-1 rounded-md`}>{restaurant.badge}</span>}
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(restaurant.id); }} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full">
                          <Heart className={`w-4 h-4 ${favorites.includes(restaurant.id) ? "fill-primary text-primary" : "text-gray-400"}`} />
                        </button>
                        <span className="text-5xl">{restaurant.emoji}</span>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-foreground truncate">{restaurant.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {restaurant.tags.slice(0, 3).map((tag) => <span key={tag} className="text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{tag}</span>)}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-current" />{restaurant.rating}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{restaurant.deliveryTime}</span>
                          <span>{restaurant.priceRange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredDishes.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-foreground mb-4">Popular dishes 🔥</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {filteredDishes.map((dish) => (
                        <div key={dish.id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-all cursor-pointer">
                          <div className={`${dish.bgColor} p-4 flex items-center justify-center h-28`}><span className="text-4xl">{dish.emoji}</span></div>
                          <div className="p-3">
                            <h3 className="font-medium text-sm truncate">{dish.name}</h3>
                            <p className="text-xs text-muted truncate">{dish.restaurant}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-semibold text-primary">${dish.price.toFixed(2)}</span>
                              <button onClick={() => addItem({ name: dish.name, price: dish.price, restaurant: dish.restaurant })} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90">+</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}