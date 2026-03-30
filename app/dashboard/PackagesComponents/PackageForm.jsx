"use client";

import React, { useState, useRef } from "react";
import { Ic, I, inpSty, inp, labelCls, labelSty, DURATION_OPTIONS, ACCENT_COLORS, durLabel } from "../data/compData";
import SectionHeading from "./ui/sectionHeading";
import Toggle from "../components/Toggle";
import Divider from "./ui/divider";

// Simple uid generator to avoid uuid package
const uid = () => Math.random().toString(36).substr(2, 9);

export default function PackageForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
  ...JSON.parse(JSON.stringify(initial)),
  type: initial.type || "portrait", // default to 'portrait' if not set
}));
  const [newInc, setNewInc] = useState("");
  const [newAddonLabel, setNewAddonLabel] = useState("");
  const [newAddonPrice, setNewAddonPrice] = useState("");
  const [errors, setErrors] = useState({});
  const incRef = useRef(null);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Inclusions ──
  const addInclusion = () => {
    const t = newInc.trim();
    if (!t) return;
    setF("inclusions", [...form.inclusions, { id: uid(), text: t }]);
    setNewInc("");
    setTimeout(() => incRef.current?.focus(), 50);
  };
  const removeInclusion = id => setF("inclusions", form.inclusions.filter(i => i.id !== id));
  const updateInclusion = (id, text) => setF("inclusions", form.inclusions.map(i => i.id === id ? { ...i, text } : i));

  // ── Add-ons ──
  const addAddon = () => {
    const l = newAddonLabel.trim();
    const p = parseFloat(newAddonPrice);
    if (!l || isNaN(p) || p < 0) return;
    setF("addons", [...form.addons, { id: uid(), label: l, price: p }]);
    setNewAddonLabel(""); setNewAddonPrice("");
  };
  const removeAddon = id => setF("addons", form.addons.filter(a => a.id !== id));
  const updateAddon = (id, key, val) => setF("addons", form.addons.map(a => a.id === id ? { ...a, [key]: val } : a));

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Package title is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleSave = async () => {
  if (!validate()) return;

  const payload = {
  ...form,
  price: Number(form.price),
  duration: Number(form.duration),
  isActive: !!form.isActive,
  type: form.type, // <-- include type here
  inclusions: Array.isArray(form.inclusions) ? form.inclusions : [],
  addons: Array.isArray(form.addons) ? form.addons : [],
};

  try {
    const res = await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
  alert("Package saved successfully!");

  const savedPackage = {
    ...payload,
    id: data.id, // ✅ real DB id
  };

  onSave(savedPackage); // ✅ send correct object
} else {
      console.error("API error:", data.error);
      alert("Failed to save package: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Network/server error:", err);
    alert("Failed to save package due to network/server error");
  }
};

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Basic Info */}
      <section>
        <SectionHeading label="Basic Information" icon={I.tag} />
        <div className="space-y-3">
          <div>
            <label className={labelCls} style={labelSty}>Package Title *</label>
            <input className={`${inp}${errors.title ? " border-red-400 ring-1 ring-red-200" : ""}`}
              style={errors.title ? { background: "#fff5f5" } : inpSty}
              value={form.title} onChange={e => setF("title", e.target.value)}
              placeholder="e.g. Solo Shoot" />
            {errors.title && <p className="text-[10px] mt-1 text-red-500 font-semibold">{errors.title}</p>}
          </div>

          <div>
            <label className={labelCls} style={labelSty}>Description</label>
            <textarea className={inp} style={{ ...inpSty, resize: "none" }}
              rows={3} value={form.description} onChange={e => setF("description", e.target.value)}
              placeholder="Brief description…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelSty}>Session Duration *</label>
              <select className={inp} style={inpSty}
                value={form.duration} onChange={e => setF("duration", Number(e.target.value))}>
                {DURATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelSty}>Base Price (₱) *</label>
              <div className="relative">
                <input className={`${inp} pl-6${errors.price ? " border-red-400 ring-1 ring-red-200" : ""}`}
                  style={errors.price ? { background: "#fff5f5" } : inpSty}
                  type="number" min="0" step="50"
                  value={form.price} onChange={e => setF("price", Number(e.target.value))}
                  placeholder="e.g. 1500" />
              </div>
              {errors.price && <p className="text-[10px] mt-1 text-red-500 font-semibold">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelSty}>Accent Color</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {ACCENT_COLORS.map(c => (
                  <button key={c} type="button" title={c}
                    onClick={() => setF("color", c)}
                    className="w-6 h-6 rounded-full transition-all flex items-center justify-center"
                    style={{ background: c, border: form.color === c ? "2.5px solid #1a0a0d" : "2px solid transparent",
                      boxShadow: form.color === c ? "0 0 0 2px #fff, 0 0 0 4px " + c : "none" }}>
                    {form.color === c && <Ic d="M5 13l4 4L19 7" size={11} stroke="#fff" sw={2.5} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls} style={labelSty}>Visibility</label>
              <div className="flex items-center gap-3 mt-2">
                <Toggle on={form.isActive} onChange={() => setF("isActive", !form.isActive)} />
                <span className="text-xs font-semibold" style={{ color: form.isActive ? "#059669" : "#9a7a80" }}>
                  {form.isActive ? "Active — visible to clients" : "Inactive — hidden"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Inclusions */}
      <section>
        <SectionHeading label="Inclusions" icon={I.check} />
        <div className="space-y-2">
          {form.inclusions.length === 0 && (
            <p className="text-[11px] text-center py-3 rounded-lg" style={{ color: "#b07a80", background: "#fdf8f9", border: "1px dashed #e5d5d8" }}>
              No inclusions added yet
            </p>
          )}
          {form.inclusions.map((inc, idx) => (
            <div key={inc.id} className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "#fdf0f2", border: "1px solid #f5d0d5", color: "#A30A24" }}>{idx + 1}</span>
              <input className={`${inp} flex-1`} style={inpSty}
                value={inc.text} onChange={e => updateInclusion(inc.id, e.target.value)}
                placeholder="Inclusion detail…" />
              <button onClick={() => removeInclusion(inc.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 flex-shrink-0"
                style={{ color: "#c05070" }}>
                <Ic d={I.close} size={12} sw={2.5} />
              </button>
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <input ref={incRef} className={`${inp} flex-1`} style={inpSty}
              value={newInc} onChange={e => setNewInc(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addInclusion()}
              placeholder="Type an inclusion and press Enter…" />
            <button onClick={addInclusion}
              className="px-3 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1 hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ background: "#A30A24" }}>
              <Ic d={I.plus} size={11} stroke="#fff" sw={2.5} /> Add
            </button>
          </div>
        </div>
      </section>

      <Divider />

      {/* Add-ons */}
      <section>
        <SectionHeading label="Available Add-ons" icon={I.gift} />
        <div className="space-y-2">
          {form.addons.length === 0 && (
            <p className="text-[11px] text-center py-3 rounded-lg" style={{ color: "#b07a80", background: "#fdf8f9", border: "1px dashed #e5d5d8" }}>
              No add-ons configured yet
            </p>
          )}
          {form.addons.map((a, idx) => (
            <div key={a.id} className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "#fdf0f2", border: "1px solid #f5d0d5", color: "#A30A24" }}>{idx + 1}</span>
              <input className={`${inp} flex-1`} style={inpSty}
                value={a.label} onChange={e => updateAddon(a.id, "label", e.target.value)}
                placeholder="Add-on name" />
              <div className="relative flex-shrink-0 w-28">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "#A30A24" }}>₱</span>
                <input className={`${inp} pl-5`} style={inpSty}
                  type="number" min="0" step="50"
                  value={a.price} onChange={e => updateAddon(a.id, "price", Number(e.target.value))}
                  placeholder="0" />
              </div>
              <button onClick={() => removeAddon(a.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 flex-shrink-0"
                style={{ color: "#c05070" }}>
                <Ic d={I.close} size={12} sw={2.5} />
              </button>
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <input className={`${inp} flex-1`} style={inpSty}
              value={newAddonLabel} onChange={e => setNewAddonLabel(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addAddon()}
              placeholder="Add-on label (e.g. Rush delivery)" />
            <div className="relative flex-shrink-0 w-28">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "#A30A24" }}>₱</span>
              <input className={`${inp} pl-5`} style={inpSty}
                type="number" min="0" step="50"
                value={newAddonPrice} onChange={e => setNewAddonPrice(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addAddon()}
                placeholder="0" />
            </div>
            <button onClick={addAddon}
              className="px-3 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1 hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ background: "#f59e0b" }}>
              <Ic d={I.plus} size={11} stroke="#fff" sw={2.5} /> Add
            </button>
          </div>
        </div>
      </section>

      <Divider />

      {/* Package Type */}
<section>
  <SectionHeading label="Package Type" icon={I.tag} />
  <div className="flex items-center gap-3 mt-2">
    {["portrait", "rental"].map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => setF("type", type)}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
          form.type === type
            ? "bg-[#A30A24] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
</section>

<Divider />

      {/* Preview */}
      <section className="rounded-xl p-4" style={{ background: `${form.color}0d`, border: `1.5px solid ${form.color}25` }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: form.color }}>Preview</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${form.color}15`, border: `1px solid ${form.color}30` }}>
            <Ic d={I.pkg} size={18} stroke={form.color} sw={1.8} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>{form.title || "Package Title"}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#7a5560" }}>
              {durLabel(form.duration)} · {form.price ? `₱${Number(form.price).toLocaleString()}` : "₱—"} · {form.inclusions.length} inclusions
              {form.addons.length > 0 && ` · ${form.addons.length} add-ons`}
            </p>
          </div>
          <span className="ml-auto text-[9px] font-extrabold px-2 py-0.5 rounded-full"
            style={form.isActive
              ? { background: "#d1fae5", color: "#059669", border: "1px solid #a7f3d0" }
              : { background: "#f3f3f4", color: "#9a8a90", border: "1px solid #e0d8da" }}>
            {form.isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2 pb-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors hover:bg-red-50" style={{ borderColor: "#e5d5d8", color: "#7a4a50", background: "#fff" }}>
          Cancel
        </button>
        <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity" style={{ background: "#A30A24" }}>
          <Ic d={I.check} size={13} stroke="#fff" sw={2.5} />
          {initial.id ? "Save Changes" : "Create Package"}
        </button>
      </div>
    </div>
  );
}