"use client";

import { useEffect } from "react";

export function CartListener() {
  useEffect(() => {
    const handleAddClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const btn = target.closest("button");
      if (!btn || !btn.textContent?.includes("+")) return;

      // Identify the card container - works for both Home and Explore
      const card = btn.closest("div.bg-white.rounded-xl, div.bg-white.rounded-3xl, div.bg-white.rounded-\\[2rem\\]");
      if (!card) return;

      // Extract data - prioritizing Explore selectors then falling back to Home
      const name = card.querySelector("h3")?.textContent?.trim() || 
                   card.querySelector("h4")?.textContent?.trim() || "";
      
      // Restaurant selector: Explore uses p.text-xs.text-muted, Home uses p.text-muted
      const metaText = card.querySelector("p.text-xs.text-muted, p.text-muted")?.textContent || "";
      const restaurant = metaText.split('·')[0].trim() || "Restaurant";
      
      // Price selector: Explore uses span.font-semibold.text-primary, Home uses span.text-primary
      const priceText = card.querySelector("span.font-semibold.text-primary, span.text-primary")?.textContent || "0";
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

      if (!name || isNaN(price)) return;

      // Update LocalStorage
      const currentCart = JSON.parse(localStorage.getItem("user_cart") || "[]");
      const existingItem = currentCart.find((i: any) => i.name === name);

      let newCart;
      if (existingItem) {
        newCart = currentCart.map((i: any) =>
          i.name === name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...currentCart, { 
          id: btoa(name).slice(0, 8) + Date.now(), 
          name, 
          restaurant, 
          price, 
          quantity: 1 
        }];
      }

      localStorage.setItem("user_cart", JSON.stringify(newCart));
      window.dispatchEvent(new Event("cartUpdated"));
    };

    window.addEventListener("click", handleAddClick);
    return () => window.removeEventListener("click", handleAddClick);
  }, []);

  return null;
}