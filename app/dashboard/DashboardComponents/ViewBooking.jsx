"use client";

import React from "react";
import { format } from "date-fns";
import { Icon, Icons, STATUS_STYLES, STATUS_DOT, fmtPrice } from "../data/compData";

function ViewBooking({ booking, onClose }) {
  const { customer, service, addons, date, time, totalPrice, status, proof, id } = booking;

  let formattedDate = date || "—";
  let formattedTime = time || "—";

  try {
    // ✅ FIX: Prevent timezone shift
    if (date) {
      const [year, month, day] = date.split("-").map(Number);

      if (year && month && day) {
        const safeDate = new Date(year, month - 1, day); // LOCAL date
        formattedDate = format(safeDate, "MMMM dd, yyyy");
      }
    }

    // ✅ Convert 24hr → 12hr
    if (time) {
      const [hours, minutes] = time.split(":");

      if (hours !== undefined && minutes !== undefined) {
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;

        formattedTime = `${h}:${minutes} ${ampm}`;
      }
    }
  } catch (err) {
    console.warn("Failed to format date/time:", err);
  }

  const row = (label, value) => (
    <div
      className="flex justify-between items-start py-2.5 border-b last:border-0"
      style={{ borderColor: "#f5e8ea" }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider w-36 shrink-0"
        style={{ color: "#b0707a" }}
      >
        {label}
      </span>
      <span className="text-sm text-right" style={{ color: "#1a0a0d" }}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="space-y-5 text-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FEF0F2" }}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "#A30A24", fontFamily: "'Georgia', serif" }}
        >
          {customer.name[0]}
        </div>
        <div>
          <p className="font-bold text-base" style={{ color: "#A30A24" }}>
            {customer.name}
          </p>
          <p className="text-xs" style={{ color: "#7a3a42" }}>
            {id}
          </p>
        </div>
        <span
          className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 ${STATUS_STYLES[status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
          {status}
        </span>
      </div>

      {/* Customer */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A30A24" }}>
          Customer
        </p>
        {row("Email", customer.email)}
        {row("Phone", customer.phone)}
        {customer.description && row("Notes", customer.description)}
      </div>

      {/* Service */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A30A24" }}>
          Service
        </p>
        {row("Package", service.title)}
        {row("Base Price", fmtPrice(service.price))}
        {row("Date", formattedDate)}
        {row("Time", formattedTime)}
      </div>

      {/* Add-ons */}
      {addons.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A30A24" }}>
            Add-ons
          </p>
          {addons.map((a) => (
            <div key={a.id}>{row(a.label, `+${fmtPrice(a.price)}`)}</div>
          ))}
        </div>
      )}

      {/* Total */}
      <div
        className="flex items-center justify-between rounded-xl px-5 py-4 text-white"
        style={{ background: "#A30A24" }}
      >
        <span className="font-semibold">Total Amount</span>
        <span className="text-2xl font-bold" style={{ fontFamily: "'Georgia', serif" }}>
          {fmtPrice(totalPrice)}
        </span>
      </div>

      {/* Proof */}
      {proof && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg text-xs"
          style={{ background: "#f5f5f5", border: "1px solid #e0e0e0" }}
        >
          <Icon d={Icons.upload} size={14} stroke="#888" />
          <span className="text-gray-500">Payment proof:</span>
          <span className="font-medium text-gray-700">{proof}</span>
        </div>
      )}

      {/* Close */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: "#A30A24" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ViewBooking;