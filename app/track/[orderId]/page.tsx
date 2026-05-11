import { Metadata } from "next";
import TrackOrder from "@/components/orders/track-order";
import { Navbar } from "@/components/landing/navbar";

export const metadata: Metadata = {
  title: "Track Order | Food App",
};

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="min-h-screen bg-background">
        <TrackOrder orderId={orderId} />
      </main>
    </div>
  );
}