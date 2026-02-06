// components/ui/forms/BookingForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

import { fetchBookedSlots, fetchBlackoutDates } from "@/lib/postgres/api";
import type { Service, ServiceAddon } from "@/data/service";

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

interface BookingFormProps {
  service: Service;
  selectedAddons: ServiceAddon[];
  totalPrice: number;
}

export default function BookingForm({
  service,
  selectedAddons,
  totalPrice,
}: BookingFormProps) {
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  /* -------------------- Blackout Dates -------------------- */
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

  /* -------------------- Booked Slots -------------------- */
  useEffect(() => {
    if (!date) return;

    const formattedDate = format(date, "yyyy-MM-dd");
    fetchBookedSlots(formattedDate)
      .then((data) => setBookedSlots(data))
      .catch((err) => console.error("Failed to fetch slots", err));
  }, [date]);

  /* -------------------- Go to Review Page -------------------- */
  const handleNext = () => {
    if (!date || !selectedTime || !form.name || !form.email) return;

    const bookingData = {
      service: {
        slug: service.slug,
        title: service.title,
        price: service.price,
      },
      addons: selectedAddons.length ? selectedAddons : undefined,
      totalPrice,
      customer: form,
      date: format(date, "yyyy-MM-dd"),
      time: selectedTime,
    };

    router.push(
      `/book-now/confirm?data=${encodeURIComponent(JSON.stringify(bookingData))}`,
    );
  };

  /* ==================== UI ==================== */
  return (
    <div className="w-full max-w-5xl mx-auto p-6 border-2 border-[#A30A24] bg-white text-[#A30A24]">
      <div className="flex flex-col gap-4">
        {/* Top: Calendar & Time Slots */}
        <div className="grid grid-cols-2 gap-4">
          {/* Calendar */}
          <div className="space-y-4">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(d) => setDate(d || undefined)}
              disabled={(day) => {
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
                        className="p-1 rounded text-[#A30A24] hover:bg-[#A30A24] hover:text-white"
                      >
                        <GrFormPrevious />
                      </button>
                    );
                  }
                  if (ariaLabel.includes("Next")) {
                    return (
                      <button
                        {...props}
                        className="p-1 rounded text-[#A30A24] hover:bg-[#A30A24] hover:text-white"
                      >
                        <GrFormNext />
                      </button>
                    );
                  }
                  return <button {...props} />;
                },
              }}
              classNames={{ caption: "flex items-center justify-between mb-2" }}
            />
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">
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
                    className={`border border-[#A30A24] rounded px-2 py-1 text-sm ${
                      isSelected ? "bg-[#A30A24] text-white" : "text-[#A30A24]"
                    } ${isBooked ? "opacity-30 cursor-not-allowed" : ""}`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: Form Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left: Name, Email, Phone */}
          <div className="flex flex-col gap-4">
            <div>
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

            <div>
              <label className="text-[16px] md:text-[18px] font-medium mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 09123456789"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                }
                className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24]"
                required
              />
            </div>

            <div>
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

          {/* Right: Description */}
          <div className="flex flex-col">
            <label className="text-[16px] md:text-[18px] font-medium mb-1">
              Additional Details
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

          {/* Bottom Button */}
          <div className="mt-auto pt-6 col-span-2">
            <p className="text-[18px] mb-4 font-extralight">
              Selected: {date ? format(date, "PPPP") : "None"}{" "}
              {selectedTime && `@ ${selectedTime}`}
            </p>

            <button
              type="button"
              onClick={handleNext}
              className="w-full h-12 bg-black text-white font-bold"
            >
              Review Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
