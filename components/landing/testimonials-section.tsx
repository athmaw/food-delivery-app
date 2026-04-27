"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John Charlies",
    location: "New York",
    rating: 5,
    comment: "Ordered food from small shops. Food arrived fast and way better than expected!",
    avatar: "JC",
  },
  {
    id: 2,
    name: "Lybrre Jonas Jr.",
    location: "California",
    rating: 5,
    comment: "The app is so attractive and easy to use. Took me 2 minutes to place my whole order!",
    avatar: "LJ",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground">What people are saying</h2>
        <p className="text-sm text-muted mt-1">Trusted by thousands of happy customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-foreground mb-4">{`"${testimonial.comment}"`}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                {testimonial.avatar}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                <p className="text-xs text-muted">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}