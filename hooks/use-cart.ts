"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,

} from "firebase/firestore";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

export function useCart() {
  const [items, setItems] = useState<any[]>([]);
  const [promo, setPromo] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // 🔥 FIX: listen to auth properly
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  const cartRef = user
    ? collection(db, "users", user.uid, "cart")
    : null;

  const promoRef = user
    ? doc(db, "users", user.uid, "promo", "active")
    : null;

  // 🔥 REALTIME SYNC
  useEffect(() => {
    if (!user || !cartRef || !promoRef) return;

    const unsubCart = onSnapshot(cartRef, (snapshot) => {
      setItems(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    const unsubPromo = onSnapshot(promoRef, (docSnap) => {
      if (docSnap.exists()) {
        setPromo(docSnap.data());
      } else {
        setPromo(null);
      }
    });

    return () => {
      unsubCart();
      unsubPromo();
    };
  }, [user]);

  // ➕ ADD ITEM (NOW WORKS)
  const addItem = async (item: any) => {
    if (!user || !cartRef) return;

    const existing = items.find((i) => i.name === item.name);

    if (existing) {
      await updateQuantity(existing.id, 1);
    } else {
      await setDoc(doc(db, "users", user.uid, "cart", Date.now().toString()), {
        ...item,
        quantity: 1,
      });
    }
  };

  // 🔼🔽 UPDATE
  const updateQuantity = async (id: string, delta: number) => {
    if (!user || !cartRef) return;

    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      await deleteDoc(doc(db, "users", user.uid, "cart", id));
    } else {
      await setDoc(doc(db, "users", user.uid, "cart", id), {
        ...item,
        quantity: newQty,
      });
    }
  };

  const removeItem = async (id: string) => {
    if (!user || !cartRef) return;
    await deleteDoc(doc(db, "users", user.uid, "cart", id));
  };

  const applyPromoCode = async (code: string) => {
    if (!user || !promoRef) return false;

    if (code.toUpperCase() === "FREESAMPLE") {
      const promoData = { code: "FREESAMPLE", discount: 0.3 };
      await setDoc(promoRef, promoData);
      setPromo(promoData);
      return true;
    }

    return false;
  };

  const clearCart = async () => {
    if (!user || !cartRef || !promoRef) return;

    const snapshot = await getDocs(cartRef);

    snapshot.forEach(async (d) => {
      await deleteDoc(d.ref);
    });

    await deleteDoc(promoRef);
    setPromo(null);
  };

  return {
    items,
    promo,
    addItem,
    updateQuantity,
    removeItem,
    applyPromoCode,
    clearCart,
  };
}