"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  DAYS_SHORT,
  TODAY,
  TODAY_D,
  // SEED,
  parseD,
  // addDays,
  MONTH_NAMES,
  Ic,
  I,
  displayDate,
  displayShort,
  SB,
  SD,
  STRIPE_SOFT,
  STRIPE_HARD,
  // getCellBg,
  // isBlocked,
  inpSty,
  inp,
} from "../data/compData";

export default // ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(26,10,13,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ border: "1.5px solid #f0e0e3" }}>
        <div className="h-1.5 w-full" style={{ background: "#A30A24" }} />
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "#fff0f1", border: "1.5px solid #fcd4d8" }}>
            <Ic d={I.trash} size={20} stroke="#A30A24" sw={1.8} />
          </div>
          <p className="font-bold text-sm mb-1" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>Delete Package?</p>
          <p className="text-xs mb-5 leading-relaxed" style={{ color: "#7a5560" }}>
            <strong style={{ color: "#A30A24" }}>&quot;{title}&quot;</strong> will be permanently deleted.<br />This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-xs font-bold border hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#e5d5d8", color: "#7a4a50" }}>
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90"
              style={{ background: "#A30A24" }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}