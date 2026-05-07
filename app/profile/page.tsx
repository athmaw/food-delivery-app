"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { ChevronRight, LogOut, ArrowLeft } from "lucide-react";

interface UserStats {
  orders: number;
  points: number;
  favorites: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats] = useState<UserStats>({
    orders: 28,
    points: 1240,
    favorites: 4,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Redirect to login if not authenticated
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getFirstName = () => {
    if (user?.displayName) {
      return user.displayName.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getInitials = () => {
    if (user?.displayName) {
      const parts = user.displayName.split(" ");
      return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const menuItems = [
    {
      title: "My Profile",
      description: "Edit personal info",
      badge: null,
    },
    {
      title: "My Orders",
      description: "Track & reorder",
      badge: 2,
    },
    {
      title: "Saved Addresses",
      description: "Home, Office +1",
      badge: null,
    },
    {
      title: "Settings",
      description: "Notifications, payments",
      badge: null,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header Section */}
      <div className="bg-gradient-to-b from-amber-900 to-amber-800 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-amber-100 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>

          {/* Avatar and User Info */}
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-bold text-white">{getInitials()}</span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{user.displayName || getFirstName()}</h1>
                <span className="bg-pink-400 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  ⭐ Gold Member
                </span>
              </div>
              <p className="text-amber-100">{user.email}</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-pink-100 rounded-2xl px-4 py-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.orders}</p>
              <p className="text-sm text-gray-600">Orders</p>
            </div>
            <div className="bg-pink-100 rounded-2xl px-4 py-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.points.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Points</p>
            </div>
            <div className="bg-pink-100 rounded-2xl px-4 py-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.favorites}</p>
              <p className="text-sm text-gray-600">Favorites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                index !== menuItems.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>

              <div className="flex items-center gap-3">
                {item.badge && (
                  <span className="bg-pink-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-400 hover:bg-red-500 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>v2.4.1 · Food App © 2026</p>
        </div>
      </div>
    </div>
  );
}
