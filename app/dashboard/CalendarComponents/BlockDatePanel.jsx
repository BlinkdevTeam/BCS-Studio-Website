"use client";

import React, { useState } from "react";
import { Icon, LBL, INP, IC, ALL_TIMES } from "../data/compData";

// ─── Block Date Panel (modal content) ─────────────────────────────────────────
function BlockDatePanel({ mode, prefill, onSave, onClose }) {
  // mode: "single" | "range" | "time"
  const [tab, setTab] = useState(mode || "single");
  const [single, setSingle] = useState(prefill || "");
  const [rangeFrom, setRangeFrom] = useState(prefill || "");
  const [rangeTo, setRangeTo] = useState("");
  const [timeDate, setTimeDate] = useState(prefill || "");
  const [timeFrom, setTimeFrom] = useState("09:00 AM");
  const [timeTo, setTimeTo] = useState("05:00 PM");
  const [label, setLabel] = useState("");

  const tabs = [
    { id: "single", label: "Single Date", icon: IC.cal },
    { id: "range",  label: "Date Range",  icon: IC.range },
    { id: "time",   label: "Time Block",  icon: IC.time },
  ];

  const save = () => {
    if (tab === "single" && single) {
      onSave({ type: "single", date: single, label: label || "Blocked" });
    } else if (tab === "range" && rangeFrom && rangeTo) {
      onSave({ type: "range", from: rangeFrom, to: rangeTo, label: label || "Blocked Range" });
    } else if (tab === "time" && timeDate) {
      onSave({ type: "time", date: timeDate, from: timeFrom, to: timeTo, label: label || "Time Blocked" });
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#fdf5f6" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={tab === t.id
              ? { background: "#A30A24", color: "#fff" }
              : { color: "#7a3a42" }}>
            <Icon d={t.icon} size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "single" && (
        <div className="space-y-3">
          <div><LBL>Date to Block *</LBL><INP type="date" value={single} onChange={e => setSingle(e.target.value)} /></div>
          <div><LBL>Label / Reason</LBL><INP placeholder="e.g. Day off, Personal leave…" value={label} onChange={e => setLabel(e.target.value)} /></div>
        </div>
      )}

      {tab === "range" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><LBL>From *</LBL><INP type="date" value={rangeFrom} onChange={e => setRangeFrom(e.target.value)} /></div>
            <div><LBL>To *</LBL><INP type="date" value={rangeTo} onChange={e => setRangeTo(e.target.value)} /></div>
          </div>
          <div><LBL>Label / Reason</LBL><INP placeholder="e.g. Vacation, Training week…" value={label} onChange={e => setLabel(e.target.value)} /></div>
        </div>
      )}

      {tab === "time" && (
        <div className="space-y-3">
          <div><LBL>Date *</LBL><INP type="date" value={timeDate} onChange={e => setTimeDate(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <LBL>Block From *</LBL>
              <select className="w-full px-3.5 py-2 rounded-lg text-sm border outline-none" style={{ borderColor: "#e5d5d8", background: "#fdfafa" }}
                value={timeFrom} onChange={e => setTimeFrom(e.target.value)}>
                {ALL_TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <LBL>Block To *</LBL>
              <select className="w-full px-3.5 py-2 rounded-lg text-sm border outline-none" style={{ borderColor: "#e5d5d8", background: "#fdfafa" }}
                value={timeTo} onChange={e => setTimeTo(e.target.value)}>
                {ALL_TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><LBL>Label / Reason</LBL><INP placeholder="e.g. Lunch break, Prep time…" value={label} onChange={e => setLabel(e.target.value)} /></div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-1">
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-red-50 transition-colors" style={{ borderColor: "#A30A24", color: "#A30A24" }}>Cancel</button>
        <button onClick={save} className="px-5 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "#A30A24" }}>Apply Block</button>
      </div>
    </div>
  );
}

export default BlockDatePanel;