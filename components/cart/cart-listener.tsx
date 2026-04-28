"use client";

import { useEffect } from "react";

export function CartListener() {
  useEffect(() => {
    const handleAddClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Identify the button by the Tailwind classes in the landing page module
      const btn = target.closest("button.bg-primary");
      if (!btn) return;

      // Navigate up to the card container to find dish details
      const card = btn.closest("div.bg-white.rounded-xl");
      if (!card) return;

      // Extract data directly from the DOM elements
      const name = card.querySelector("h3")?.textContent || "";
      const restaurant = card.querySelector("p.text-muted")?.textContent || "";
      const priceText = card.querySelector("span.text-primary")?.textContent || "0";
      const price = parseFloat(priceText.replace("$", ""));

      // Update LocalStorage state
      const currentCart = JSON.parse(localStorage.getItem("user_cart") || "[]");
      const existingItem = currentCart.find((i: any) => i.name === name);

      let newCart;
      if (existingItem) {
        newCart = currentCart.map((i: any) =>
          i.name === name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...currentCart, { 
          id: btoa(name).slice(0, 8), 
          name, 
          restaurant, 
          price, 
          quantity: 1 
        }];
      }

      localStorage.setItem("user_cart", JSON.stringify(newCart));
      
      // Notify the rest of the app that the cart changed
      window.dispatchEvent(new Event("cartUpdated"));
    };

    window.addEventListener("click", handleAddClick);
    return () => window.removeEventListener("click", handleAddClick);
  }, []);

  return null;
}