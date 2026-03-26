"use client";

import React, { useState } from "react";
import { Icon, fmtPrice, parseKey, DAYS_FULL, pad, MONTHS, IC } from "../data/compData";

// ─── Day Detail Panel ──────────────────────────────────────────────────────────
function DayDetail({ dateKey, bookings, blocks, timeBlocks, onAddBlock, onRemoveBlock, onClose }) {
  const { year, month, day } = parseKey(dateKey);
  const dateObj = new Date(year, month, day);
  const dow = DAYS_FULL[dateObj.getDay()];
  const dayBookings = bookings.filter(b => b.date === dateKey);
  const dayBlocks = blocks.filter(b => b.date === dateKey || (b.type === "range" && b.from <= dateKey && dateKey <= b.to));
  const dayTimeBlocks = timeBlocks.filter(b => b.date === dateKey);

  const Badge = ({ status }) => (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: STATUS_COLOR[status] + "22", color: STATUS_COLOR[status] }}>{status}</span>
  );

  return (
    <div className="space-y-5">
      {/* Date header */}
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#A30A24" }}>
        <div className="text-center w-12">
          <p className="text-[10px] uppercase tracking-widest text-white/60">{dow.slice(0,3)}</p>
          <p className="text-3xl font-bold text-white leading-none" style={{ fontFamily: "'Georgia',serif" }}>{pad(day)}</p>
          <p className="text-[10px] text-white/60 mt-0.5">{MONTHS[month].slice(0,3)} {year}</p>
        </div>
        <div className="w-px h-12 bg-white/20" />
        <div className="text-white">
          <p className="font-semibold text-sm">{dayBookings.length} booking{dayBookings.length !== 1 ? "s" : ""}</p>
          <p className="text-xs text-white/60">{dayBlocks.length + dayTimeBlocks.length} block{dayBlocks.length + dayTimeBlocks.length !== 1 ? "s" : ""} active</p>
        </div>
        <button onClick={() => onAddBlock(dateKey)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>
          <Icon d={IC.block} size={12} /> Block
        </button>
      </div>

      {/* Bookings */}
      {dayBookings.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#A30A24" }}>Bookings</p>
          <div className="space-y-2">
            {dayBookings.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "#fdf5f6", border: "1px solid #f0e0e3" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "#A30A24" }}>
                  {b.customer.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#1a0a0d" }}>{b.customer.name}</p>
                  <p className="text-[10px]" style={{ color: "#9a6a72" }}>{b.service.title} · {b.time}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge status={b.status} />
                  <p className="text-[10px] font-semibold" style={{ color: "#A30A24" }}>{fmtPrice(b.totalPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day Blocks */}
      {dayBlocks.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#7a3a42" }}>Day Blocks</p>
          <div className="space-y-2">
            {dayBlocks.map((b, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "#fff5f5", border: "1px solid #fecdd3" }}>
                <Icon d={IC.block} size={13} stroke="#A30A24" />
                <span className="flex-1 text-xs font-medium" style={{ color: "#A30A24" }}>{b.label}</span>
                {b.type === "range" && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#fee2e2", color: "#b91c1c" }}>range</span>}
                {b.type !== "range" && (
                  <button onClick={() => onRemoveBlock(b)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-100 transition-colors">
                    <Icon d={IC.trash} size={11} stroke="#ef4444" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Blocks */}
      {dayTimeBlocks.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#7a3a42" }}>Time Blocks</p>
          <div className="space-y-2">
            {dayTimeBlocks.map((b, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                <Icon d={IC.clock} size={13} stroke="#b45309" />
                <span className="flex-1 text-xs font-medium" style={{ color: "#92400e" }}>{b.label}</span>
                <span className="text-[10px] font-semibold" style={{ color: "#b45309" }}>{b.from} – {b.to}</span>
                <button onClick={() => onRemoveBlock(b)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-yellow-100 transition-colors">
                  <Icon d={IC.trash} size={11} stroke="#b45309" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {dayBookings.length === 0 && dayBlocks.length === 0 && dayTimeBlocks.length === 0 && (
        <div className="text-center py-8" style={{ color: "#b0707a" }}>
          <Icon d={IC.cal} size={28} stroke="#d4a0a8" sw={1.5} />
          <p className="text-sm mt-2">No bookings or blocks on this day.</p>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#A30A24" }}>Close</button>
      </div>
    </div>
  );
}

export default DayDetail;