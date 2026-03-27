"use client";

import React, { useState } from "react";

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div className="relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 flex-shrink-0"
      style={{ background: on ? "#A30A24" : "#d1c0c3" }} onClick={onChange}>
      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </div>
  );
}

export default Toggle;