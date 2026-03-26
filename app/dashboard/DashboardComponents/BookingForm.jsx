"use client";

import React, { useState } from "react";
import { SERVICES, Icon, Icons, ADDON_OPTIONS, fmtPrice } from "../data/compData";

// ─── Booking Form ──────────────────────────────────────────────────────────────
function BookingForm({ initial, onSave, onCancel }) {
  const blank = {
    customer: { name: "", email: "", phone: "", description: "" },
    service: SERVICES[0],
    addons: [],
    date: "",
    time: "",
    status: "Pending",
    proof: null,
  };

  const [form, setForm] = useState(
    initial
      ? {
          customer: { ...initial.customer },
          service: { ...initial.service },
          addons: [...initial.addons],
          date: initial.date,
          time: initial.time,
          status: initial.status,
          proof: initial.proof,
        }
      : blank,
  );

  const setCustomer = (k, v) =>
    setForm((f) => ({ ...f, customer: { ...f.customer, [k]: v } }));
  const setService = (title) => {
    const svc = SERVICES.find((s) => s.title === title);
    setForm((f) => ({ ...f, service: svc }));
  };
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

  const total =
    form.service.price + form.addons.reduce((s, a) => s + a.price, 0);

  const submit = () => {
    if (
      !form.customer.name ||
      !form.customer.email ||
      !form.date ||
      !form.time
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave({ ...form, totalPrice: total });
  };

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none transition-all focus:border-[#A30A24] focus:ring-2 focus:ring-[#A30A24]/10";
  const inputStyle = { borderColor: "#e5d5d8", background: "#fdfafa" };
  const labelCls =
    "block text-xs font-semibold mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-6 text-sm">
      {/* Customer */}
      <div>
        <h3
          className="font-bold text-base mb-3 flex items-center gap-2"
          style={{ color: "#A30A24" }}
        >
          <Icon d={Icons.users} size={15} /> Customer Information
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>
              Full Name *
            </label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.customer.name}
              onChange={(e) => setCustomer("name", e.target.value)}
              placeholder="Maria Santos"
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>
              Phone *
            </label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.customer.phone}
              onChange={(e) => setCustomer("phone", e.target.value)}
              placeholder="09171234567"
            />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>
              Email Address *
            </label>
            <input
              type="email"
              className={inputCls}
              style={inputStyle}
              value={form.customer.email}
              onChange={(e) => setCustomer("email", e.target.value)}
              placeholder="maria@example.com"
            />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>
              Special Notes
            </label>
            <textarea
              rows={2}
              className={inputCls}
              style={inputStyle}
              value={form.customer.description}
              onChange={(e) => setCustomer("description", e.target.value)}
              placeholder="Allergies, preferences, etc."
            />
          </div>
        </div>
      </div>

      <hr style={{ borderColor: "#f0e0e3" }} />

      {/* Service */}
      <div>
        <h3
          className="font-bold text-base mb-3 flex items-center gap-2"
          style={{ color: "#A30A24" }}
        >
          <Icon d={Icons.bookings} size={15} /> Service & Schedule
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>
              Service *
            </label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.service.title}
              onChange={(e) => setService(e.target.value)}
            >
              {SERVICES.map((s) => (
                <option key={s.title}>{s.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>
              Date *
            </label>
            <input
              type="date"
              className={inputCls}
              style={inputStyle}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>
              Time *
            </label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              placeholder="09:00 AM"
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>
              Status
            </label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              {["Pending", "Confirmed", "Cancelled"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <label className={labelCls} style={{ color: "#7a3a42" }}>
          Add-ons
        </label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {ADDON_OPTIONS.map((addon) => {
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
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#A30A24" }}
                >
                  +₱{addon.price.toLocaleString()}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: "#A30A24", color: "#fff" }}
      >
        <span className="font-semibold">Total Amount</span>
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {fmtPrice(total)}
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
