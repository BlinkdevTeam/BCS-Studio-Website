"use client";

import { useRouter } from "next/navigation";

export default function BookingSuccess() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto p-6 border-2 border-[#A30A24] bg-white text-[#A30A24] flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>

      <p className="text-lg mb-6 text-center">
        Thank you for your booking. We have received your request and will
        contact you shortly to confirm the details.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-black text-white rounded hover:bg-gray-900 transition"
        >
          Back to Home
        </button>

        <button
          onClick={() => router.push("/book-now")}
          className="px-6 py-3 border border-black rounded hover:bg-gray-100 transition"
        >
          Book Another
        </button>
      </div>
    </div>
  );
}
