"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleViewFullProfile = () => {
    onClose();
    router.push("/profile");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-foreground mb-6 mt-2">View Profile</h2>

        {/* Profile Content */}
        <div className="space-y-4">
          <p className="text-muted">Click below to view your full profile and manage your account settings.</p>
          <button
            onClick={handleViewFullProfile}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}
