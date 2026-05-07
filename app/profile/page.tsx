"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
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

  const [addresses, setAddresses] = useState<string[]>([
    "Home - Iloilo City",
    "Office - Mandurriao",
  ]);

  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [editedAddresses, setEditedAddresses] = useState<string[]>([]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const getFirstName = () => {
    if (user?.displayName) return user.displayName.split(" ")[0];
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getInitials = () => {
    if (user?.displayName) {
      const parts = user.displayName.split(" ");
      return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
    }
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return "U";
  };

  const menuItems = [
    { title: "My Profile", description: "Edit personal info", badge: null },
    { title: "My Orders", description: "Track & reorder", badge: 2 },
    { title: "Saved Addresses", description: "Manage your addresses", badge: null },
    { title: "Settings", description: "Notifications, payments", badge: null },
  ];

  const openAddressEditor = () => {
    setEditedAddresses(addresses);
    setIsAddressOpen(true);
  };

  const updateAddress = (index: number, value: string) => {
    const updated = [...editedAddresses];
    updated[index] = value;
    setEditedAddresses(updated);
  };

  const addAddress = () => {
    setEditedAddresses([...editedAddresses, ""]);
  };

  const deleteAddress = (index: number) => {
    const updated = editedAddresses.filter((_, i) => i !== index);
    setEditedAddresses(updated);
  };

  const saveAddresses = () => {
    const cleaned = editedAddresses.filter((a) => a.trim() !== "");
    setAddresses(cleaned);
    setIsAddressOpen(false);
  };

  const openProfileEditor = () => {
    setEditedName(user?.displayName || "");
    setIsProfileOpen(true);
  };

  const saveProfile = async () => {
    if (!auth.currentUser) return;

    await updateProfile(auth.currentUser, {
      displayName: editedName,
    });

    setUser({ ...auth.currentUser });
    setIsProfileOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-b from-amber-900 to-amber-800 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-amber-100 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-pink-400 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {getInitials()}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.displayName || getFirstName()}
              </h1>
              <p className="text-amber-100">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.title === "Saved Addresses") openAddressEditor();
                if (item.title === "My Profile") openProfileEditor();
              }}
              className="flex justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <div>
                <p className="font-semibold">{item.title}</p>

                {/* ✅ FIXED DESCRIPTION */}
                <p className="text-sm text-gray-500">
                  {item.title === "Saved Addresses"
                    ? addresses.length === 0
                      ? "No addresses"
                      : addresses.slice(0, 2).join(", ") +
                        (addresses.length > 2
                          ? ` +${addresses.length - 2}`
                          : "")
                    : item.description}
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-400 text-white py-4 rounded-2xl flex justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      {/* PROFILE MODAL */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Change Username</h2>

            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="flex-1 bg-pink-400 text-white py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADDRESS MODAL */}
      {isAddressOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Saved Addresses</h2>

            <div className="space-y-3">
              {editedAddresses.map((addr, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    value={addr}
                    onChange={(e) => updateAddress(index, e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />

                  <button
                    onClick={() => deleteAddress(index)}
                    className="text-red-500 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={addAddress}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                + Add
              </button>

              <button
                onClick={saveAddresses}
                className="flex-1 bg-pink-400 text-white py-2 rounded-lg"
              >
                Save
              </button>
            </div>

            <button
              onClick={() => setIsAddressOpen(false)}
              className="w-full mt-3 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}