"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { BookingData } from "@/lib/postgres/types";

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [proof, setProof] = useState<File | null>(null);

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
      <div className="bg-white text-[#A30A24]">
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
            <section className="space-y-4 my-12">
              {addons && addons.length > 0 && (
                <section>
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
            </section>

            <hr />

            {/* Date & Time */}
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
              <hr />
            </section>

            {/* Payment Method */}
            <section className="border-2 border-[#A30A24] p-12 space-y-2">
              <p className="flex justify-between text-[48px]">
                <span>Payment Instructions</span>
              </p>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-8">
                    <p className="bg-[#A30A24] w-8 h-8 text-white flex justify-center items-center rounded-full">
                      1
                    </p>
                    <p className="text-[36px] font-bold">
                      Choose Payment Method
                    </p>
                  </div>
                  <div className="flex gap-4 px-16 py-4">
                    <div className="w-full border border-[#A30A24] p-6">
                      <p className="text-[24px] font-bold">Bank Transfer</p>
                      <div className="text-[18px]">
                        <p>Metro Bank</p>
                        <p>Acc No: 1234-5678-91</p>
                        <p>Acc Name: Blink Creative Studio</p>
                      </div>
                    </div>
                    <div className="w-full border border-[#A30A24] p-6">
                      <p className="text-[24px] font-bold">E-Wallet</p>
                      <div className="text-[18px]">
                        <p>GCASH: 0917-567-891</p>
                        <p>PAYMAYA: 0916-852-963</p>
                        <p>Acc Name: Blink Creative Studio</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <p className="bg-[#A30A24] w-8 h-8 text-white flex justify-center items-center rounded-full">
                    2
                  </p>
                  <div>
                    <p className="text-[36px] font-bold">Make Downpayment</p>
                    <p>
                      Transfer 50% of total amount. Keep your receipt or
                      screenshot.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <p className="bg-[#A30A24] w-8 h-8 text-white flex justify-center items-center rounded-full">
                    3
                  </p>
                  <div>
                    <p className="text-[36px] font-bold">Upload Proof Below</p>
                    <p>Upload receipt (JPG, PNG, PDF - Max 5MB)</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 border-[#A30A24] p-12 space-y-2 text-center flex justify-center items-center">
              <div className="w-full">
                <p className="text-[36px] font-bold">Upload Proof</p>
                <p className="text-[24px]">
                  Please upload your payment receipt to confirm your booking
                </p>
                <div className="flex justify-center items-center">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        alert("File must be 5MB or smaller");
                        return;
                      }

                      setProof(file);
                    }}
                    className="mt-4 text-center"
                  />
                </div>
                <p className="text-[24px]">
                  Accepted formats: JPG, PNG, PDF • Maximum file size: 5MB
                </p>
              </div>
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
                {loading ? "Confirming..." : "Confirm & Book"}
              </button>
            </div>
          </div>
          <div className="max-w-[15%] w-full h-30.5 bg-[#A30A24]"></div>
        </div>
      </div>
    </>
  );
}
