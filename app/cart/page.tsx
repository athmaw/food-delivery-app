import { Metadata } from "next"; // Import the specific type
import CartContainer from "@/components/cart/cart-container";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

// This is now explicitly typed to satisfy the TypeScript error
export const metadata: Metadata = {
  title: 'Your Cart | Food App',
  description: 'Review your order items and proceed to checkout',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
        <Navbar />
            <main className="min-h-screen bg-background">
            <CartContainer />
            </main>
        {/* <Footer /> */}
    </div>
  );
}