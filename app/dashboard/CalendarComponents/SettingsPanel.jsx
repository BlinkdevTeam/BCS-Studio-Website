"use client";

import React, { useState } from "react";
import { Row } from "./compData";

// ─── Settings Panel ────────────────────────────────────────────────────────────
function SettingsPanel({ config, onChange, onClose }) {
  const toggle = (key) => onChange({ ...config, [key]: !config[key] });


  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: "#9a6a72" }}>Configure which days are automatically blocked. Toggling a rule ON will block those days across the entire calendar. You can still manually override individual dates.</p>

      <Row label="Block Weekends" sub="Saturdays and Sundays are unavailable" configKey="blockWeekends" icon={IC.weekend} />
      <Row label="Block Sundays Only" sub="Only Sundays are unavailable" configKey="blockSundays" icon={IC.dayoff} />
      <Row label="Block Saturdays Only" sub="Only Saturdays are unavailable" configKey="blockSaturdays" icon={IC.dayoff} />

      <hr style={{ borderColor: "#f0e0e3" }} />

      <div className="p-3.5 rounded-xl text-xs" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
        <p className="font-semibold mb-1" style={{ color: "#92400e" }}>ℹ️ Override Note</p>
        <p style={{ color: "#b45309" }}>Even when weekends are globally blocked, you can open specific weekend dates by clicking them on the calendar and removing the auto-block, or using "Unblock Day" in the day detail panel.</p>
      </div>

      <div className="flex justify-end">
        <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#A30A24" }}>Done</button>
      </div>
    </div>
  );
}

export default SettingsPanel;