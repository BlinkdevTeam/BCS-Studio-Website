"use client";

import React, { useEffect } from "react";
import { Icon, IC } from "../data/compData";

// ─── Modal Shell ───────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width = "max-w-lg" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,2,4,0.6)", backdropFilter: "blur(6px)" }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] flex flex-col`}
        style={{ border: "1.5px solid #f0e0e3" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "#f0e0e3" }}>
          <h2 className="text-lg font-bold" style={{ color: "#A30A24", fontFamily: "'Georgia',serif" }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" style={{ color: "#A30A24" }}>
            <Icon d={IC.close} size={15} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default Modal;