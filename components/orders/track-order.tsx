"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface OrderItem {
  id: string;
  name: string;
  restaurant?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  grandTotal: number;
  address: string;
  phone?: string;
  paymentMethod: string;
  status: string;
  createdAt: any;
}

const getEmoji = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("coke can")) return "🥤";
  if (lower.includes("large fries")) return "🍟";
  if (lower.includes("choc lava")) return "🍰";
  if (lower.includes("bubble tea")) return "🧋";
  if (lower.includes("soft serve")) return "🍦";
  return "🍽️";
};

const STATUS_STEPS = ["preparing", "out_for_delivery", "arrived"] as const;

export default function TrackOrder({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [remaining, setRemaining] = useState(30);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!orderId) return;
    const unsub = onSnapshot(doc(db, "orders", orderId), (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
      } else {
        setOrder(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [orderId]);

  useEffect(() => {
    if (!order || ["arrived", "cancelled", "collected"].includes(order.status)) return;
    const created = order.createdAt?.toDate?.() ?? new Date();
    const check = setInterval(() => {
      const elapsed = (Date.now() - created.getTime()) / 1000;
      let newStatus = "preparing";
      if (elapsed >= 30) newStatus = "arrived";
      else if (elapsed >= 10) newStatus = "out_for_delivery";

      if (newStatus !== order.status) {
        updateDoc(doc(db, "orders", orderId), { status: newStatus });
      }
    }, 1000);
    return () => clearInterval(check);
  }, [order, orderId]);

  useEffect(() => {
    if (!order || order.status === "arrived") return;
    const createdDate = order.createdAt?.toDate?.() ?? new Date();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - createdDate.getTime()) / 1000);
      setRemaining(Math.max(0, 30 - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const handleCollect = async () => {
    await updateDoc(doc(db, "orders", orderId), { status: "collected" });
    router.push("/orders");
  };

  const handleCancel = async () => {
    await updateDoc(doc(db, "orders", orderId), { status: "cancelled" });
    router.push("/orders");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const createdDate = order.createdAt?.toDate?.() ?? new Date();
  const timeStr = createdDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const placedTime = createdDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const pickedUpTime = new Date(createdDate.getTime() + 10 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const deliveredTime = new Date(createdDate.getTime() + 30 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const timelineSteps = [
    { key: "preparing", label: "Order placed", time: placedTime },
    { key: "out_for_delivery", label: "Rider picked up your order", time: pickedUpTime },
    { key: "arrived", label: "Arrived", time: deliveredTime },
  ];

  const currentStatusIndex = STATUS_STEPS.indexOf(order.status as any);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_0.95fr] gap-6">
        <div className="bg-[#F8F3F1] border border-[#EAD9D5] h-[650px] rounded-[34px] overflow-hidden">
          <div className="relative h-[540px] bg-[#EDE4E0] overflow-hidden">
            <div className="absolute inset-0 opacity-60">
              <div className="grid grid-cols-8 h-full">
                {Array.from({ length: 24 }).map((_, i) => <div key={i} className="border border-[#F7EDEF]" />)}
              </div>
            </div>
            <div className="absolute top-24 left-40 w-[420px] h-[220px] border-[4px] border-dashed border-[#FF4F87] rounded-[40px]" />
            <div className="absolute left-52 top-64">
              <div className="w-14 h-14 rounded-full border-2 border-[#FF7AA7] bg-white flex items-center justify-center shadow-sm">🏠</div>
            </div>
            <div className="absolute right-40 bottom-28">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF4F87] blur-xl opacity-40 rounded-full" />
                <div className="relative w-14 h-14 rounded-full bg-[#FF4F87] text-white flex items-center justify-center text-xl border-4 border-[#FFD1DF]">🛵</div>
              </div>
            </div>
          </div>
          {(order.status === "out_for_delivery" || order.status === "arrived") && (
            <div className="bg-white px-8 py-6 flex items-center justify-between border-t border-[#F2E4E7]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#FF8DB3] bg-[#FFF1F5] flex items-center justify-center text-2xl">👨</div>
                <div>
                  <h3 className="font-bold text-lg text-[#342326]">Carlos M.</h3>
                  <p className="text-[#B08F95] text-sm">Delivery rider · Honda PCX</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#FF4F87] rounded-[32px] p-8 text-white">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase opacity-80">Estimated arrival</p>
            <h1 className="text-7xl font-black mt-2">
              {order.status === "arrived" ? "0" : remaining}<span className="text-3xl font-bold ml-2">min</span>
            </h1>
            <p className="mt-4 text-white/80">Arriving at {order.address}</p>
          </div>

          <div className="bg-white border border-[#F0DFE3] rounded-[32px] p-7">
            <div className="flex justify-between border-t border-[#F4E8EB] pt-6">
              <span className="text-2xl font-bold text-[#2B1F22]">Total</span>
              <span className="text-3xl font-black text-[#2B1F22]">
                ${(order.grandTotal || order.total).toFixed(2)}
              </span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-4">
            {order.status === "arrived" && (
              <button onClick={handleCollect} className="flex-1 bg-[#16A34A] text-white font-bold py-4 rounded-2xl">Collected</button>
            )}
            <button onClick={handleCancel} className="flex-1 bg-[#EF4444] text-white font-bold py-4 rounded-2xl">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}