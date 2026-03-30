"use client";

import React, { useState, useEffect } from "react";

function BookingForm({ initial, onSave, onCancel }) {
  // ─── State for available addons
  const [availableAddons, setAvailableAddons] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch all addons from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        const addonsSet = new Map();
        data.forEach((b) => b.addons?.forEach((a) => addonsSet.set(a.id, a)));
        setAvailableAddons(Array.from(addonsSet.values()));
      } catch (err) {
        console.error("Failed to fetch booking data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ─── Form state (hooks must be top-level, unconditional)
  const [form, setForm] = useState({
    customer: initial?.customer || { name: "", email: "", phone: "", description: "" },
    service: initial?.service || null,
    addons: initial?.addons || [],
    date: initial?.date || "",
    time: initial?.time || "",
    status: initial?.status || "Pending",
    proof: initial?.proof || null,
  });

  // ─── Handlers
  const toggleAddon = (addon) => {
    setForm((f) => {
      const exists = f.addons.find((a) => a.id === addon.id);
      return {
        ...f,
        addons: exists
          ? f.addons.filter((a) => a.id !== addon.id)
          : [...f.addons, addon],
      };
    });
  };

  const submit = () => {
    const total =
      Number(form.service?.price || 0) +
      form.addons.reduce((sum, a) => sum + Number(a.price || 0), 0);

    onSave({ ...form, totalPrice: total, id: initial.id });
  };

  if (!initial) return <p>No booking selected.</p>;
  if (loading) return <p>Loading addons...</p>;

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none transition-all";
  const inputStyle = { borderColor: "#e5d5d8", background: "#fdfafa", color: "#555" };
  const labelCls = "block text-xs font-semibold mb-1.5 uppercase tracking-wider";

  // ─── Total calculation
  const total =
    Number(form.service?.price || 0) +
    form.addons.reduce((sum, a) => sum + Number(a.price || 0), 0);

  return (
    <div className="space-y-6 text-sm">
      {/* Customer info (read-only) */}
      <div>
        <h3 className="font-bold text-base mb-3" style={{ color: "#A30A24" }}>
          Customer Information
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Full Name *</label>
            <input className={inputCls} style={inputStyle} value={form.customer.name} readOnly />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Phone *</label>
            <input className={inputCls} style={inputStyle} value={form.customer.phone} readOnly />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>Email Address *</label>
            <input type="email" className={inputCls} style={inputStyle} value={form.customer.email} readOnly />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>Special Notes</label>
            <textarea rows={2} className={inputCls} style={inputStyle} value={form.customer.description} readOnly />
          </div>
        </div>
      </div>

      <hr style={{ borderColor: "#f0e0e3" }} />

      {/* Service & schedule */}
      <div>
        <h3 className="font-bold text-base mb-3" style={{ color: "#A30A24" }}>
          Service & Schedule
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>Service</label>
            <input
              type="text"
              className={inputCls}
              style={{ ...inputStyle, background: "#f5f5f5", cursor: "not-allowed" }}
              value={form.service ? `${form.service.title} - ₱${Number(form.service.price).toLocaleString()}` : ""}
              readOnly
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Date *</label>
            <input
              type="date"
              className={inputCls}
              style={inputStyle}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Time *</label>
            <input
              type="time"
              className={inputCls}
              style={inputStyle}
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Add-ons */}
      {availableAddons.length > 0 && (
        <div>
          <label className={labelCls} style={{ color: "#7a3a42" }}>Add-ons</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {availableAddons.map((addon) => {
              const checked = !!form.addons.find((a) => a.id === addon.id);
              return (
                <label
                  key={addon.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: checked ? "#FEF0F2" : "#fdfafa",
                    border: `1.5px solid ${checked ? "#A30A24" : "#e5d5d8"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAddon(addon)}
                    className="accent-[#A30A24]"
                  />
                  <span className="flex-1 text-xs">{addon.label}</span>
                  <span className="text-xs font-semibold" style={{ color: "#A30A24" }}>
                    +₱{Number(addon.price).toLocaleString()}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Total */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: "#A30A24", color: "#fff" }}
      >
        <span className="font-semibold">Total Amount</span>
        <span className="text-2xl font-bold" style={{ fontFamily: "'Georgia', serif" }}>
          ₱{Number(total).toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-red-50"
          style={{ borderColor: "#A30A24", color: "#A30A24" }}
        >
          Cancel
        </button>
        <button
          onClick={submit}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#A30A24" }}
        >
          Save Booking
        </button>
      </div>
    </div>
  );
}

export default BookingForm;