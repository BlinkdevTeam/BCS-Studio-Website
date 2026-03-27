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
} from "../../data/compData";

export default function SectionHeading({ label, icon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "#fdf0f2" }}>
        <Ic d={icon} size={11} stroke="#A30A24" sw={2} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7a4a50" }}>{label}</p>
      <div className="flex-1 h-px" style={{ background: "#f0e0e3" }} />
    </div>
  );
}