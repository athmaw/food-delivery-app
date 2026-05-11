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

  // Auth listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubAuth();
  }, []);

  // Firestore document listener
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

  // Auto-progress timer
  useEffect(() => {
    if (!order || order.status === "arrived" || order.status === "cancelled" || order.status === "collected") return;

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

  // Countdown timer (runs only when order exists)
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

  // ── EARLY RETURNS AFTER ALL HOOKS ──
  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const createdDate = order.createdAt?.toDate?.() ?? new Date();
  const timeStr = createdDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

   // ── Dynamic timeline times ──
  const placedTime = createdDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const pickedUpTime = new Date(createdDate.getTime() + 10 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const deliveredTime = new Date(createdDate.getTime() + 30 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const timelineSteps = [
    { key: "preparing", label: "Order placed", time: placedTime },
    { key: "out_for_delivery", label: "Rider picked up your order", time: pickedUpTime },
    { key: "arrived", label: "arrived", time: deliveredTime },
  ];

  const currentStatusIndex = STATUS_STEPS.indexOf(order.status as any);

  return (
   <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_0.95fr] gap-6">
      
      {/* LEFT SIDE */}
      <div className="bg-[#F8F3F1] border border-[#EAD9D5]  h-[650px] rounded-[34px] overflow-hidden">
        
        {/* MAP */}
        <div className="relative h-[540px] bg-[#EDE4E0] overflow-hidden">
          
          {/* Fake map grid */}
          <div className="absolute inset-0 opacity-60">
            <div className="grid grid-cols-8 h-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-[#F7EDEF]"
                />
              ))}
            </div>
          </div>

          {/* Route path */}
          <div className="absolute top-24 left-40 w-[420px] h-[220px] border-[4px] border-dashed border-[#FF4F87] rounded-[40px]" />

          {/* Home marker */}
          <div className="absolute left-52 top-64">
            <div className="w-14 h-14 rounded-full border-2 border-[#FF7AA7] bg-white flex items-center justify-center shadow-sm">
              🏠
            </div>
          </div>

          {/* Rider marker */}
          <div className="absolute right-40 bottom-28">
            <div className="relative">
              <div className="absolute inset-0 bg-[#FF4F87] blur-xl opacity-40 rounded-full" />

              <div className="relative w-14 h-14 rounded-full bg-[#FF4F87] text-white flex items-center justify-center text-xl border-4 border-[#FFD1DF]">
                🛵
              </div>
            </div>
          </div>

          {/* Floating live card */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-8 py-4 shadow-lg border border-[#F1E6E8] flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="font-semibold text-[#4B3A3F]">
              Live tracking · Order #{order.id.slice(0, 5).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Rider info */}
        {(order.status === "out_for_delivery" || order.status === "arrived") && (
            <div className="bg-white px-8 py-6 flex items-center justify-between border-t border-[#F2E4E7]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#FF8DB3] bg-[#FFF1F5] flex items-center justify-center text-2xl">
                  👨
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#342326]">Carlos M.</h3>
                  <p className="text-[#B08F95] text-sm">Your delivery rider · Honda PCX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-14 h-14 rounded-full border border-[#ECD8DD] bg-[#FFFDFD] hover:bg-[#FFF4F7] transition">
                  📞
                </button>
                <button className="w-14 h-14 rounded-full border border-[#ECD8DD] bg-[#FFFDFD] hover:bg-[#FFF4F7] transition">
                  💬
                </button>
              </div>
            </div>
          )}
        </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">

        {/* ETA CARD */}
        <div className="bg-[#FF4F87] rounded-[32px] p-8 text-white relative overflow-hidden">
          <div className="absolute right-6 top-6 text-7xl opacity-10">
            🛵
          </div>

          <p className="text-sm font-semibold tracking-[0.2em] uppercase opacity-80">
            Estimated arrival
          </p>

          <h1 className="text-7xl font-black leading-none mt-2">
            {order.status === "arrived" ? "0" : remaining}
            <span className="text-3xl font-bold ml-2">min</span>
          </h1>

          <p className="mt-4 text-white/80">
            Arriving at {order.address}
          </p>

          <div className="w-full h-2 rounded-full bg-white/20 mt-8 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(10, (remaining / 30) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* ORDER CARD */}
        <div className="bg-white border border-[#F0DFE3] rounded-[32px] p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#2B1F22]">
                {order.items[0]?.restaurant || "Order"}
              </h2>

              <p className="text-[#AE9298] mt-2 text-sm">
                Today · {timeStr} · Order #
                {order.id.slice(0, 5).toUpperCase()}
              </p>
            </div>

            <div className="bg-[#DDF8E7] text-[#159A52] font-semibold px-4 py-2 rounded-full text-sm">
              {order.status === "out_for_delivery"
                ? "On the way"
                : order.status}
            </div>
          </div>

          {/* ITEMS */}
          <div className="space-y-3 mt-8">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF1F5] flex items-center justify-center">
                    {getEmoji(item.name)}
                  </div>

                  <span className="font-medium text-[#4D3A3F]">
                    {item.name}
                  </span>
                </div>

                <span className="text-[#B58F96] font-semibold">
                  ×{item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center border-t border-[#F4E8EB] mt-8 pt-6">
            <span className="text-2xl font-bold text-[#2B1F22]">
              Total
            </span>

            <span className="text-3xl font-black text-[#2B1F22]">
              ₱{(order.grandTotal || order.total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* TIMELINE */}
         <div className="bg-white border border-[#F0DFE3] rounded-[32px] p-7">
            <h3 className="text-2xl font-bold text-[#2B1F22] mb-8">Order status</h3>
            <div className="relative ml-4">
              <div className="absolute left-[15px] h-50 top-0 bottom-0 w-[2px] bg-[#F3D8E0]" />
              {timelineSteps.map((step, idx) => {
                const active = currentStatusIndex >= idx;
                const current = order.status === step.key;
                return (
                  <div key={step.key} className="relative flex gap-5 pb-10">
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        active
                          ? "bg-[#FF4F87] border-[#FF4F87] text-white"
                          : "bg-white border-[#EDD6DC] text-[#B48C95]"
                      }`}
                    >
                      {active ? "✓" : "•"}
                    </div>
                    <div className="-mt-1">
                      <h4 className={`font-bold ${active ? "text-[#352529]" : "text-[#B19197]"}`}>
                        {step.label}
                      </h4>
                      <p className="text-sm text-[#B19197] mt-1">{step.time}</p>
                      {current && (
                        <span className="inline-block mt-3 bg-[#FFE5EF] text-[#FF4F87] text-xs font-bold px-3 py-1 rounded-full">
                          In progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        {/* ADDRESS */}
        <div className="bg-white border border-[#F0DFE3] rounded-[28px] p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF1F5] flex items-center justify-center">
            📍
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#C29CA4]">
              Delivering to
            </p>

            <p className="font-bold text-lg text-[#2C1E22] mt-1">
              {order.address}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
       <div className="flex gap-4">
            {order.status === "arrived" && (
              <button
                onClick={handleCollect}
                className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-4 rounded-2xl transition"
              >
                Collected
              </button>
            )}
            <button
              onClick={handleCancel}
              className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold py-4 rounded-2xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}