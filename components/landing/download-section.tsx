"use client";

import { Apple, Play } from "lucide-react";

export function DownloadSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Order on the go</h2>
        <p className="text-muted mt-2 max-w-md mx-auto">
          Download our app for a faster, better delivery experience.
          Available on iOS and Android. Join over 500,000 happy users.
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="flex items-center gap-2 px-5 py-3 bg-foreground text-white rounded-lg hover:bg-foreground/90 transition-colors">
            <Apple className="w-5 h-5" />
            <div className="text-left">
              <p className="text-xs opacity-80">Download on the</p>
              <p className="text-sm font-semibold">App Store</p>
            </div>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-foreground text-white rounded-lg hover:bg-foreground/90 transition-colors">
            <Play className="w-5 h-5" />
            <div className="text-left">
              <p className="text-xs opacity-80">Get it on</p>
              <p className="text-sm font-semibold">Google Play</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}