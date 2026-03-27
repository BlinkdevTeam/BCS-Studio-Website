"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Ic,
  I,
  durLabel,
} from "../data/compData";

import Toggle from "../components/Toggle";

export default // ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, onEdit, onDuplicate, onDelete, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: "#fff", border: `1.5px solid ${pkg.isActive ? "#f0e0e3" : "#e8e0e1"}`,
        boxShadow: pkg.isActive ? "0 2px 16px rgba(163,10,36,0.07)" : "0 1px 6px rgba(0,0,0,0.04)",
        opacity: pkg.isActive ? 1 : 0.75 }}>

      {/* Color bar */}
      <div className="h-1.5 w-full" style={{ background: pkg.color }} />

      {/* Card header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon badge */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${pkg.color}15`, border: `1px solid ${pkg.color}30` }}>
              <Ic d={I.pkg} size={16} stroke={pkg.color} sw={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm truncate" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>
                  {pkg.title}
                </h3>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full leading-none"
                  style={pkg.isActive
                    ? { background: "#d1fae5", color: "#059669", border: "1px solid #a7f3d0" }
                    : { background: "#f3f3f4", color: "#9a8a90", border: "1px solid #e0d8da" }}>
                  {pkg.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-[11px]" style={{ color: "#9a6a72" }}>
                  <Ic d={I.clock} size={11} stroke="#9a6a72" sw={2} />
                  {durLabel(pkg.duration)}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: pkg.color }}>
                  <Ic d={I.peso} size={11} stroke={pkg.color} sw={2} />
                  ₱{Number(pkg.price).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => setExpanded(e => !e)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
              style={{ color: "#A30A24" }} title={expanded ? "Collapse" : "Preview"}>
              <Ic d={expanded ? I.eyeoff : I.eye} size={13} sw={2} />
            </button>
            <button onClick={() => onEdit(pkg)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
              style={{ color: "#A30A24" }} title="Edit">
              <Ic d={I.edit} size={13} sw={2} />
            </button>
            <button onClick={() => onDuplicate(pkg)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
              style={{ color: "#A30A24" }} title="Duplicate">
              <Ic d={I.copy} size={13} sw={2} />
            </button>
            <button onClick={() => onDelete(pkg.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
              style={{ color: "#c05070" }} title="Delete">
              <Ic d={I.trash} size={13} sw={2} />
            </button>
          </div>
        </div>

        {/* Description */}
        {pkg.description && (
          <p className="text-xs mt-2.5 leading-relaxed" style={{ color: "#7a5560" }}>{pkg.description}</p>
        )}
      </div>

      {/* Stats row */}
      <div className="px-5 pb-3 flex items-center gap-4 border-t" style={{ borderColor: "#f7eff0" }}>
        <div className="flex items-center gap-1.5 pt-3">
          <Ic d={I.check} size={12} stroke="#059669" sw={2} />
          <span className="text-[11px]" style={{ color: "#6a8070" }}>
            <strong style={{ color: "#1a3a2a" }}>{pkg.inclusions.length}</strong> inclusions
          </span>
        </div>
        <div className="flex items-center gap-1.5 pt-3">
          <Ic d={I.gift} size={12} stroke="#A30A24" sw={2} />
          <span className="text-[11px]" style={{ color: "#7a5560" }}>
            <strong style={{ color: "#1a0a0d" }}>{pkg.addons.length}</strong> add-ons
          </span>
        </div>
        <div className="ml-auto pt-3 flex items-center gap-2">
          <span className="text-[10px]" style={{ color: "#9a7a80" }}>{pkg.isActive ? "Visible to clients" : "Hidden"}</span>
          <Toggle on={pkg.isActive} onChange={() => onToggle(pkg.id)} />
        </div>
      </div>

      {/* Expanded preview */}
      {expanded && (
        <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: "#f0e0e3", background: "#fdf8f9" }}>
          {/* Inclusions */}
          {pkg.inclusions.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#7a4a50" }}>
                Inclusions
              </p>
              <ul className="space-y-1.5">
                {pkg.inclusions.map(inc => (
                  <li key={inc.id} className="flex items-start gap-2 text-xs" style={{ color: "#5a3a42" }}>
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#d1fae5", border: "1px solid #6ee7b7" }}>
                      <Ic d="M5 13l4 4L19 7" size={9} stroke="#059669" sw={2.5} />
                    </span>
                    {inc.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add-ons */}
          {pkg.addons.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#7a4a50" }}>
                Available Add-ons
              </p>
              <div className="flex flex-wrap gap-2">
                {pkg.addons.map(a => (
                  <span key={a.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: `${pkg.color}10`, border: `1px solid ${pkg.color}25`, color: pkg.color }}>
                    <Ic d={I.plus} size={9} stroke={pkg.color} sw={2.5} />
                    {a.label} — ₱{Number(a.price).toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}