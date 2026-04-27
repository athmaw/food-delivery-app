"use client";

export function PromoSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-accent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              30% Off on
              <br />
              <span className="text-primary">First Order</span>
            </h2>
            <p className="mt-4 text-gray-300 max-w-md">
              Use code <span className="font-semibold text-white">FREESAMPLE</span> at checkout.
              <br />
              Valid for new users only.
            </p>
            <button className="mt-6 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Claim Offer
            </button>
          </div>

          <div className="text-6xl md:text-8xl">🍔🍟🥤</div>
        </div>
      </div>
    </section>
  );
}