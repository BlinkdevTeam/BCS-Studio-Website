"use client";

import React, { useState } from "react";
import { Icon } from "../data/compData";

// ─── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ booking, onConfirm, onCancel }) {
  return (
    <div className="text-center space-y-5 py-4">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: "#FEF0F2" }}>
        <Icon d={Icons.warning} size={28} stroke="#A30A24" strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-lg font-bold" style={{ color: "#1a0a0d" }}>Delete Booking?</h3>
        <p className="text-sm mt-1" style={{ color: "#7a3a42" }}>
          You&apos;re about to permanently delete booking <strong>{booking.id}</strong> for <strong>{booking.customer.name}</strong>. This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: "#d1d5db", color: "#374151" }}>
          Keep Booking
        </button>
        <button onClick={onConfirm} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: "#A30A24" }}>
          Yes, Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirm;