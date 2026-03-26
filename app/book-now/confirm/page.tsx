"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { BookingData } from "@/lib/postgres/types";

function BookingConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [proof, setProof] = useState<File | null>(null);

  // Load booking data
  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (!dataParam) {
      router.replace("/book-now");
      return;
    }

    try {
      const parsed: BookingData = JSON.parse(
        decodeURIComponent(dataParam),
      ) as BookingData;

      setBooking(parsed);
    } catch (error) {
      console.error("Invalid booking data:", error);
      router.replace("/book-now");
    }
  }, [searchParams, router]);

  const handleConfirm = async (): Promise<void> => {
    if (loading) return; // 🔥 Prevent double click
    if (!booking) return;

    if (!proof) {
      alert("Please upload payment proof");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("booking", JSON.stringify(booking));
      formData.append("proof", proof);

      const res = await fetch("/api/bookings", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Booking failed");
      }

      router.push("/book-now/success");
    } catch (error) {
      console.error(error);
      alert("Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  const { customer, service, addons, date, time, totalPrice } = booking;

  return (
    <>
      {/* 🔥 LOCKED PAGE WRAPPER */}
      <div
        className={`bg-white text-[#A30A24] transition-opacity duration-200 ${
          loading ? "pointer-events-none opacity-60 select-none" : ""
        }`}
      >
        <section className="bg-white flex flex-col overflow-hidden">
          <div className="bg-[#A30A24] text-white pt-28 pb-10 px-6">
            <div className="max-w-220 w-full flex flex-col justify-center items-center mx-auto text-center">
              <h1 className="text-[72px] md:text-[96px] font-bold">
                Confirm Booking
              </h1>
            </div>
          </div>
        </section>

        <div className="flex">
          <div className="max-w-[15%] w-full h-30.5 bg-[#A30A24]"></div>

          <div className="bg-white max-w-[80%] mx-auto py-10 px-18 border-4 border-[#A30A24] space-y-4">
            <div className="text-center">
              <h1 className="text-[72px] font-bold">Almost There!</h1>
              <p className="text-[36px]">
                Please review your booking details carefully before confirming.
                We&apos;ll send a confirmation email to your registered email
                address.
              </p>
            </div>

            <div className="w-full h-[1.5px] bg-[#A30A24] my-12"></div>

            {/* Customer Info */}
            <section className="space-y-4 my-12">
              <h4 className="text-[36px] font-bold">Your Information</h4>
              <hr />
              <div className="text-[24px]">
                <p className="flex justify-between">
                  <span>Full Name:</span> {customer.name}
                </p>
                <p className="flex justify-between">
                  <span>Email Address:</span> {customer.email}
                </p>
                <p className="flex justify-between">
                  <span>Contact Number:</span> {customer.phone}
                </p>
              </div>
            </section>

            <hr />

            {/* Service Info */}
            <section className="space-y-4 my-12">
              <h4 className="text-[36px] font-bold">Service Information</h4>
              <div className="text-[24px]">
                <p className="flex justify-between">
                  <span>Service Details:</span> {service.title}
                </p>
                <p className="flex justify-between">
                  <span>Base Price:</span> ₱{service.price}
                </p>
                <p className="flex justify-between">
                  <span>Description:</span> {customer.description || "N/A"}
                </p>
              </div>
            </section>

            <hr />

            {/* Add-ons */}
            {addons && addons.length > 0 && (
              <section className="space-y-4 my-12">
                <h4 className="text-[36px] font-bold">Add-ons</h4>
                <ul className="list-disc ml-6 text-[24px]">
                  {addons.map((addon) => (
                    <li key={addon.id}>
                      {addon.label} (+ ₱{addon.price})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <hr />

            {/* Schedule */}
            <section className="space-y-4 my-12">
              <h4 className="text-[36px] font-bold">Schedule</h4>
              <div className="text-[24px]">
                <p className="flex justify-between">
                  <span>Date:</span> {date}
                </p>
                <p className="flex justify-between">
                  <span>Time:</span> {time}
                </p>
              </div>
            </section>

            {/* Total */}
            <section className="bg-[#F2F2F2] border-2 border-[#A30A24] p-12">
              <p className="flex justify-between text-[48px]">
                <span>Total Amount</span>₱{totalPrice}
              </p>
            </section>

            {/* Upload Proof */}
            <section className="border-2 border-[#A30A24] p-12 text-center">
              <p className="text-[36px] font-bold">Upload Proof</p>
              <p className="text-[24px]">Please upload your payment receipt</p>

              <input
                type="file"
                disabled={loading}
                accept="image/png,image/jpeg,application/pdf"
                onChange={(e) => {
                  if (loading) return;

                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 5 * 1024 * 1024) {
                    alert("File must be 5MB or smaller");
                    return;
                  }

                  setProof(file);
                }}
                className="mt-4"
              />

              <p className="text-[24px] mt-2">JPG, PNG, PDF • Max 5MB</p>
            </section>

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                className="px-6 py-3 border-2 border-[#A30A24]"
                onClick={() => router.back()}
                disabled={loading}
              >
                Back
              </button>

              <button
                type="button"
                className="px-6 py-3 bg-[#A30A24] text-white disabled:opacity-50"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm & Book"}
              </button>
            </div>
          </div>

          <div className="max-w-[15%] w-full h-30.5 bg-[#A30A24]"></div>
        </div>
      </div>

      {/* 🔥 FULL SCREEN BLOCKING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white px-10 py-8 rounded-xl shadow-xl text-center">
            <p className="text-2xl font-bold text-[#A30A24]">
              Processing your booking...
            </p>
            <p className="mt-2 text-[#808080]">
              Saving booking and sending confirmation email.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading booking confirmation...</p>}>
      <BookingConfirmation />
    </Suspense>
  );
}
