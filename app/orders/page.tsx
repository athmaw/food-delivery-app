import { Metadata } from "next";
import ActiveOrders from "@/components/orders/active-orders";
import RecentOrders from "@/components/orders/recent-orders";  
import { Navbar } from "@/components/landing/navbar";

export const metadata: Metadata = {
  title: "My Orders | Food App",
  description: "View your order history and track active deliveries.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* You can add a main page header here if desired */}
        <ActiveOrders />
        <RecentOrders />
      </main>
    </div>
  );
}