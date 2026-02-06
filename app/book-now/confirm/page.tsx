"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { BookingData, createBooking } from "@/lib/postgres/api"; // ✅ single source of truth

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam) {
      router.push("/book-now"); // go back if no data
      return;
    }

    try {
      const parsedData: BookingData = JSON.parse(dataParam);
      setBooking(parsedData);
    } catch {
      router.push("/book-now");
    }
  }, [searchParams, router]);

  const handleConfirm = async () => {
    if (!booking) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      const result: { message?: string; error?: string } = await res.json();

      if (result.message) {
        alert(result.message);
        router.push("/book-now/success");
      } else {
        alert(result.error || "Failed to confirm booking");
      }
    } catch {
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 border-2 border-[#A30A24]">
      <h1 className="text-2xl font-bold mb-4">Review Your Booking</h1>
      <p>
        <strong>Name:</strong> {booking.name}
      </p>
      <p>
        <strong>Email:</strong> {booking.email}
      </p>
      <p>
        <strong>Phone:</strong> {booking.phone}
      </p>
      <p>
        <strong>Date:</strong> {booking.date}
      </p>
      <p>
        <strong>Time:</strong> {booking.time}
      </p>
      <p>
        <strong>Description:</strong> {booking.description}
      </p>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          className="px-6 py-3 border border-black"
          onClick={() => router.back()}
        >
          Back
        </button>
        <button
          type="button"
          className="px-6 py-3 bg-black text-white"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirm & Book"}
        </button>
      </div>
    </div>
  );
}
