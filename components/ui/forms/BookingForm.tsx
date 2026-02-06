"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { format, parseISO, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
// UPDATED: Import the type-safe functions from your new postgres folder
import {
  fetchBookedSlots,
  createBooking,
  fetchBlackoutDates,
} from "@/lib/postgres/api";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export default function BookingForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  // UPDATED: Now fetches from your Next.js API instead of PHP
  useEffect(() => {
    const getBlackout = async () => {
      try {
        const data = await fetchBlackoutDates();
        setBlackoutDates(data.map((d) => parseISO(d)));
      } catch (err) {
        console.error("Failed to load blackout dates", err);
      }
    };
    getBlackout();
  }, []);

  // Fetch booked slots whenever date changes
  useEffect(() => {
    if (!date) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    fetchBookedSlots(formattedDate)
      .then((data) => setBookedSlots(data))
      .catch((err) => console.error("Failed to fetch slots", err));
  }, [date]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!date || !selectedTime) return;

      setLoading(true);
      try {
        // UPDATED: Calling the ESLint-safe Postgres bridge
        const res = await createBooking({
          name: form.name,
          email: form.email,
          phone: form.phone,
          description: form.description,
          date: format(date, "yyyy-MM-dd"),
          time: selectedTime,
        });

        if (res.message) {
          alert(res.message);
          window.location.reload();
        } else {
          alert(res.error || "Slot already taken");
        }
      } catch (err) {
        alert("Server error. Check if your PostgreSQL connection is active.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [date, selectedTime, form],
  );

  const router = useRouter();

  const handleNext = () => {
    if (!date || !selectedTime || !form.name || !form.email) return;

    // Save all booking data
    const bookingData = {
      ...form,
      date: format(date, "yyyy-MM-dd"),
      time: selectedTime,
    };

    // Pass via query params (or use sessionStorage/localStorage for more data)
    // FIXED
    router.push(
      `/book-now/confirm?data=${encodeURIComponent(JSON.stringify(bookingData))}`,
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 border-2 border-[#A30A24] bg-white text-[#A30A24]">
      <form className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left column: details & calendar */}
          <div className="space-y-4">
            <div className="">
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(d) => setDate(d || undefined)}
                disabled={(day: Date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return (
                    day < today || blackoutDates.some((b) => isSameDay(day, b))
                  );
                }}
                modifiersClassNames={{
                  selected: "bg-[#A30A24] text-white rounded",
                  today: "text-[#161616] rounded",
                }}
                components={{
                  Button: (
                    props: React.ButtonHTMLAttributes<HTMLButtonElement>,
                  ) => {
                    const ariaLabel = props["aria-label"] || "";

                    if (ariaLabel.includes("Previous")) {
                      return (
                        <button
                          {...props}
                          className="p-1 rounded text-[#A30A24] hover:bg-[#A30A24] hover:text-white transition"
                        >
                          <GrFormPrevious />
                        </button>
                      );
                    }

                    if (ariaLabel.includes("Next")) {
                      return (
                        <button
                          {...props}
                          className="p-1 rounded text-[#A30A24] hover:bg-[#A30A24] hover:text-white transition"
                        >
                          <GrFormNext />
                        </button>
                      );
                    }

                    // Default day button
                    return <button {...props} />;
                  },
                }}
                classNames={{
                  caption: "flex items-center justify-between mb-2",
                }}
                footer={
                  <p className="text-xs text-gray-500 mt-2">
                    Click a date to select
                  </p>
                }
              />
            </div>
          </div>

          {/* Right column: time slots */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-tight">
              Available Time Slots
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot)}
                    className={`border border-[#A30A24] rounded px-2 py-1 text-sm transition ${
                      isSelected
                        ? "bg-[#A30A24] text-white"
                        : "hover:bg--[#A30A24] text-[#A30A24]"
                    } ${isBooked ? "opacity-30 cursor-not-allowed" : ""}`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-4 w-full">
            {/* Full Name */}
            <div className="flex flex-col w-full">
              <label className="text-[16px] md:text-[18px] font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24]"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="flex flex-col w-full">
              <label className="text-[16px] md:text-[18px] font-medium mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 09123456789"
                value={form.phone || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""), // numeric only
                  })
                }
                className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24]"
                required
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col w-full">
              <label className="text-[16px] md:text-[18px] font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-[16px] md:text-[18px] font-medium mb-1">
              Please provide any additional details, ideas, specifications, or
              requirements that will assist us in better understanding and
              visualizing your vision.
            </label>
            <textarea
              placeholder="Tell us about your event..."
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24] resize-none"
            />
          </div>

          <div className="mt-auto pt-6">
            <p className="text-[18px] mb-4 font-extralight">
              Selected: {date ? format(date, "PPPP") : "None"}{" "}
              {selectedTime && `@ ${selectedTime}`}
            </p>

            <button
              type="button"
              disabled={!selectedTime || !form.name || !form.email}
              onClick={handleNext}
              className="w-full h-12 bg-black text-white font-bold rounded hover:bg-gray-900 transition"
            >
              Review Booking
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
