"use client";

import { useState, useEffect, FormEvent } from "react";
import SkewButton from "@/components/ui/buttons/SkewButton";

type Service = {
  id: string;
  title: string;
  description?: string;
  price: number;
  type: "portrait" | "rental";
};

type ServiceCategory = "portraits" | "studio" | "event";

const FILTERS = [
  { label: "Portraits", value: "portraits" },
  { label: "Studio Rental", value: "studio" },
  { label: "Event Coverage", value: "event" },
] as const;

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default function ServiceSection() {
  const [activeFilter, setActiveFilter] =
    useState<ServiceCategory>("portraits");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for "Talk to Our Team"
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Fetch services
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/packages");
        const data = await res.json();

        type PackageAPI = {
          id: string;
          title: string;
          description?: string;
          price: number | string;
          type?: "portrait" | "rental";
        };

        const mapped: Service[] = data.map((pkg: PackageAPI) => ({
          id: pkg.id,
          title: pkg.title,
          description: pkg.description,
          price: Number(pkg.price),
          type: pkg.type ?? "portrait",
        }));

        setServices(mapped);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const displayedServices =
    activeFilter === "event"
      ? []
      : services.filter((service) =>
          activeFilter === "portraits"
            ? service.type === "portrait"
            : service.type === "rental",
        );

  // -------------------- Handle TalkToOurTeam Submit --------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError("");

    if (!form.name || !form.email || !form.phone || !form.message) {
      setError("Please fill in all fields.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/send-event-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send email.");

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-6 lg:px-24 py-24 bg-white">
      {/* Header */}
      <div className="flex flex-col mb-12">
        <div className="mb-6 text-start">
          <h2 className="text-[#A30A24] text-[48px] md:text-[72px] font-bold">
            Select Service
          </h2>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap mb-12">
          {FILTERS.map((filter) => (
            <SkewButton
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              isActive={activeFilter === filter.value}
            >
              <span className="text-[18px] md:text-[24px]">{filter.label}</span>
            </SkewButton>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center mt-12 text-gray-500">Loading services...</p>
      )}

      {/* Services Grid */}
      {!loading && activeFilter !== "event" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="border shadow-md bg-white rounded-xl p-8 flex flex-col gap-4"
            >
              <div className="flex justify-between">
                <h4 className="text-[24px] md:text-[36px] text-[#191919] font-bold">
                  {service.title}
                </h4>
                <h4 className="text-[24px] md:text-[36px] text-[#A30A24] font-bold">
                  ₱{service.price.toLocaleString()}
                </h4>
              </div>

              {service.description && (
                <p className="text-[18px] md:text-[24px] text-[#808080] mt-2">
                  {service.description}
                </p>
              )}

              <SkewButton href={`/book-now/services/${service.id}`}>
                Book Now
              </SkewButton>
            </div>
          ))}
        </div>
      )}

      {/* Static Event Coverage card */}
      {activeFilter === "event" && (
        <div className="bg-white border overflow-hidden shadow-md rounded-xl p-8 flex flex-col gap-6 text-[#A30A24]">
          <h5 className="text-[24px] md:text-[36px] font-bold">
            TALK TO OUR TEAM
          </h5>

          {/* Contact Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Full Name */}
              <div className="flex flex-col w-full">
                <label className="text-[16px] md:text-[18px] font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
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
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
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
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24] resize-none"
                required
              />
            </div>

            {/* Success/Error Messages */}
            {success && (
              <p className="text-green-600 font-medium">
                Message sent successfully!
              </p>
            )}
            {error && <p className="text-red-600 font-medium">{error}</p>}

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-[#A30A24] text-white font-bold"
              >
                {submitting ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {!loading &&
        activeFilter !== "event" &&
        displayedServices.length === 0 && (
          <p className="text-center mt-12">
            No services available for this category.
          </p>
        )}
    </section>
  );
}
