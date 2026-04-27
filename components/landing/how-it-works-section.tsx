"use client";

import { MapPin, UtensilsCrossed, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: MapPin,
    title: "Set your location",
    description: "Enter your delivery address to find restaurants near you",
  },
  {
    id: 2,
    icon: UtensilsCrossed,
    title: "Pick your food",
    description: "Browse menus and add your favourite dishes to the cart",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Pay securely",
    description: "Checkout fast with our secure payment methods",
  },
  {
    id: 4,
    icon: Truck,
    title: "Get it delivered",
    description: "Track your order in real-time until it reaches your door",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground">How it works</h2>
        <p className="text-muted mt-2">Order your favourite food in 4 easy steps</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={step.id} className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-primary/20 mb-4">
              <step.icon className="w-8 h-8 text-primary" />
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted max-w-xs mx-auto">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}