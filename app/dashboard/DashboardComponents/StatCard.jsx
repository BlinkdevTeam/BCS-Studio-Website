"use client";

import React from "react";
import { Icon } from "../data/compData";

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, iconPath, accent }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3"
      style={{ background: accent ? "#A30A24" : "#fff", color: accent ? "#fff" : "#1a1a1a", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
    >
      {accent && (
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10" style={{ background: "#fff" }} />
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-70 tracking-wide uppercase">{label}</span>
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accent ? "rgba(255,255,255,0.15)" : "#FEF0F2", color: accent ? "#fff" : "#A30A24" }}
        >
          <Icon d={iconPath} size={18} strokeWidth={2} />
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>{value}</p>
        {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
      </div>
    </div>
  );
}

export default StatCard;