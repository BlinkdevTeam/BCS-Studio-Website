"use client";

import { useState, useRef } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = "currentColor", fill = "none", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const I = {
  logo:    "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  dash:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z",
  calendar:"M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  pkg:     "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  menu:    "M3 12h18M3 6h18M3 18h18",
  plus:    "M12 4v16m8-8H4",
  close:   "M18 6L6 18M6 6l12 12",
  edit:    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash:   "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  tag:     "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  clock:   "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
  check:   "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  copy:    "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2",
  eye:     "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  eyeoff:  "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
  peso:    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  gift:    "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
  star:    "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  drag:    "M4 8h16M4 16h16",
  info:    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_PACKAGES = [
  {
    id: "pkg-001",
    title: "Solo Shoot",
    description: "Perfect for individuals wanting professional portraits for LinkedIn, headshots, or personal branding.",
    duration: 60,
    price: 1500,
    isActive: true,
    color: "#A30A24",
    inclusions: [
      { id: uid(), text: "1 studio background of choice" },
      { id: uid(), text: "10 edited digital photos" },
      { id: uid(), text: "Online gallery delivery (3–5 days)" },
    ],
    addons: [
      { id: uid(), label: "Extra 30 mins", price: 400 },
      { id: uid(), label: "Rush delivery (24hrs)", price: 500 },
      { id: uid(), label: "Printed 4R photos (10pcs)", price: 300 },
    ],
  },
  {
    id: "pkg-002",
    title: "Graduation Shoot",
    description: "Celebrate your milestone with a full studio session, perfect for graduation photos with toga or casual attires.",
    duration: 90,
    price: 2500,
    isActive: true,
    color: "#7a0a1e",
    inclusions: [
      { id: uid(), text: "Up to 2 outfit changes" },
      { id: uid(), text: "20 edited digital photos" },
      { id: uid(), text: "2 studio backgrounds" },
      { id: uid(), text: "Online gallery delivery (3–5 days)" },
    ],
    addons: [
      { id: uid(), label: "Extra outfit (+1)", price: 350 },
      { id: uid(), label: "Aerial/drone shot add-on", price: 1200 },
      { id: uid(), label: "Rush delivery (24hrs)", price: 500 },
      { id: uid(), label: "Printed 5R photos (10pcs)", price: 450 },
    ],
  },
  {
    id: "pkg-003",
    title: "Couple / Pre-nup",
    description: "Romantic studio session for couples, engagements, anniversaries, or pre-nuptial shoots.",
    duration: 120,
    price: 3500,
    isActive: false,
    color: "#c41a3a",
    inclusions: [
      { id: uid(), text: "Up to 3 outfit changes" },
      { id: uid(), text: "30 edited digital photos" },
      { id: uid(), text: "3 studio backgrounds" },
      { id: uid(), text: "Complimentary rose bouquet prop" },
      { id: uid(), text: "Online gallery delivery (3–5 days)" },
    ],
    addons: [
      { id: uid(), label: "Videographer add-on (30 min)", price: 2000 },
      { id: uid(), label: "SDE film (same-day edit)", price: 3500 },
      { id: uid(), label: "Printed album (20 pages)", price: 1800 },
    ],
  },
];

const DURATION_OPTIONS = [
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "2.5 hours", value: 150 },
  { label: "3 hours", value: 180 },
  { label: "4 hours", value: 240 },
  { label: "Half-day (5 hrs)", value: 300 },
  { label: "Full-day (8 hrs)", value: 480 },
];

const ACCENT_COLORS = [
  "#A30A24","#7a0a1e","#c41a3a","#b91c1c","#c2410c",
  "#b45309","#15803d","#0e7490","#1d4ed8","#7c3aed",
];

const EMPTY_PKG = {
  id: "",
  title: "",
  description: "",
  duration: 60,
  price: "",
  isActive: true,
  color: "#A30A24",
  inclusions: [],
  addons: [],
};

// ─── Shared style tokens (matching CalendarTab) ───────────────────────────────
const inp = "w-full px-3 py-2 rounded-lg text-xs border outline-none transition-all focus:border-[#A30A24] focus:ring-1 focus:ring-[#A30A24]/20";
const inpSty = { borderColor: "#e5d5d8", background: "#fdfafa" };
const labelCls = "block text-[10px] font-bold mb-1 uppercase tracking-wider";
const labelSty = { color: "#7a3a42" };

function Toggle({ on, onChange }) {
  return (
    <div className="relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 flex-shrink-0"
      style={{ background: on ? "#A30A24" : "#d1c0c3" }} onClick={onChange}>
      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </div>
  );
}

// ─── Duration label ───────────────────────────────────────────────────────────
const durLabel = (mins) => {
  const opt = DURATION_OPTIONS.find(o => o.value === mins);
  return opt ? opt.label : `${mins} min`;
};

// ─── Package Card ─────────────────────────────────────────────────────────────
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

// ─── Package Form (Create / Edit) ─────────────────────────────────────────────
function PackageForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(initial)));
  const [newInc, setNewInc] = useState("");
  const [newAddonLabel, setNewAddonLabel] = useState("");
  const [newAddonPrice, setNewAddonPrice] = useState("");
  const [errors, setErrors] = useState({});
  const incRef = useRef(null);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addInclusion = () => {
    const t = newInc.trim();
    if (!t) return;
    setF("inclusions", [...form.inclusions, { id: uid(), text: t }]);
    setNewInc("");
    setTimeout(() => incRef.current?.focus(), 50);
  };
  const removeInclusion = (id) => setF("inclusions", form.inclusions.filter(i => i.id !== id));
  const updateInclusion = (id, text) => setF("inclusions", form.inclusions.map(i => i.id === id ? { ...i, text } : i));

  const addAddon = () => {
    const l = newAddonLabel.trim();
    const p = parseFloat(newAddonPrice);
    if (!l || isNaN(p) || p < 0) return;
    setF("addons", [...form.addons, { id: uid(), label: l, price: p }]);
    setNewAddonLabel(""); setNewAddonPrice("");
  };
  const removeAddon = (id) => setF("addons", form.addons.filter(a => a.id !== id));
  const updateAddon = (id, key, val) => setF("addons", form.addons.map(a => a.id === id ? { ...a, [key]: val } : a));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Package title is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* ── Basic Info ── */}
      <section>
        <SectionHeading label="Basic Information" icon={I.tag} />
        <div className="space-y-3">

          {/* Title */}
          <div>
            <label className={labelCls} style={labelSty}>Package Title *</label>
            <input className={`${inp}${errors.title ? " border-red-400 ring-1 ring-red-200" : ""}`}
              style={errors.title ? { background: "#fff5f5" } : inpSty}
              value={form.title} onChange={e => setF("title", e.target.value)}
              placeholder="e.g. Solo Shoot, Graduation, Couple Session" />
            {errors.title && <p className="text-[10px] mt-1 text-red-500 font-semibold">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls} style={labelSty}>Description</label>
            <textarea className={inp} style={{ ...inpSty, resize: "none" }}
              rows={3} value={form.description} onChange={e => setF("description", e.target.value)}
              placeholder="Brief description of what's included and who this package is for…" />
          </div>

          {/* Duration + Price row */}
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
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "#A30A24" }}>₱</span>
                <input className={`${inp} pl-6${errors.price ? " border-red-400 ring-1 ring-red-200" : ""}`}
                  style={errors.price ? { background: "#fff5f5" } : inpSty}
                  type="number" min="0" step="50"
                  value={form.price} onChange={e => setF("price", e.target.value)}
                  placeholder="e.g. 1500" />
              </div>
              {errors.price && <p className="text-[10px] mt-1 text-red-500 font-semibold">{errors.price}</p>}
            </div>
          </div>

          {/* Color + Active row */}
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

      {/* ── Inclusions ── */}
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

          {/* Add row */}
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

      {/* ── Add-ons ── */}
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

          {/* Add row */}
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

      {/* ── Preview bar ── */}
      <section className="rounded-xl p-4" style={{ background: `${form.color}0d`, border: `1.5px solid ${form.color}25` }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: form.color }}>
          Preview
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${form.color}15`, border: `1px solid ${form.color}30` }}>
            <Ic d={I.pkg} size={18} stroke={form.color} sw={1.8} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>
              {form.title || "Package Title"}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "#7a5560" }}>
              {durLabel(form.duration)} · {form.price ? `₱${Number(form.price).toLocaleString()}` : "₱—"}
              {" · "}{form.inclusions.length} inclusions
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

      {/* ── Actions ── */}
      <div className="flex gap-2 pb-2">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors hover:bg-red-50"
          style={{ borderColor: "#e5d5d8", color: "#7a4a50", background: "#fff" }}>
          Cancel
        </button>
        <button onClick={handleSave}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          style={{ background: "#A30A24" }}>
          <Ic d={I.check} size={13} stroke="#fff" sw={2.5} />
          {initial.id ? "Save Changes" : "Create Package"}
        </button>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function SectionHeading({ label, icon }) {
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
function Divider() {
  return <div className="h-px w-full" style={{ background: "#f0e0e3" }} />;
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
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
            <strong style={{ color: "#A30A24" }}>"{title}"</strong> will be permanently deleted.<br />This action cannot be undone.
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

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function PackagesTab() {
  const [navOpen, setNavOpen] = useState(true);
  const [packages, setPackages] = useState(SEED_PACKAGES);
  const [editing, setEditing] = useState(null);       // null | pkg object (new pkg has id:"")
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterActive, setFilterActive] = useState("all"); // "all" | "active" | "inactive"
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ text: "", ok: true });

  const flash = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast({ text: "", ok: true }), 2800);
  };

  const filtered = packages.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchFilter = filterActive === "all" || (filterActive === "active" ? p.isActive : !p.isActive);
    return matchSearch && matchFilter;
  });

  const handleSave = (form) => {
    if (form.id) {
      setPackages(ps => ps.map(p => p.id === form.id ? form : p));
      flash("Package updated successfully.");
    } else {
      setPackages(ps => [...ps, { ...form, id: `pkg-${uid()}` }]);
      flash("Package created successfully.");
    }
    setEditing(null);
  };

  const handleToggle = (id) => {
    setPackages(ps => ps.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleDuplicate = (pkg) => {
    const copy = { ...JSON.parse(JSON.stringify(pkg)), id: `pkg-${uid()}`, title: `${pkg.title} (Copy)`, isActive: false };
    setPackages(ps => [...ps, copy]);
    flash("Package duplicated.");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setPackages(ps => ps.filter(p => p.id !== deleteTarget.id));
    flash("Package deleted.", false);
    setDeleteTarget(null);
  };

  const activeCount = packages.filter(p => p.isActive).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f0f1", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast.text && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg"
          style={{ background: toast.ok ? "#d1fae5" : "#fee2e2", color: toast.ok ? "#059669" : "#dc2626",
            border: `1px solid ${toast.ok ? "#a7f3d0" : "#fca5a5"}` }}>
          {toast.ok ? "✓ " : "⚠ "}{toast.text}
        </div>
      )}

      {/* ─── Nav Sidebar (matching CalendarTab) ─── */}
      <aside className="flex flex-col shrink-0 transition-all duration-300" style={{ width: navOpen ? 220 : 60, background: "#A30A24" }}>
        <div className="flex items-center gap-3 px-3.5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
            <Ic d={I.logo} size={17} stroke="#fff" sw={2} />
          </div>
          {navOpen && (
            <div>
              <p className="font-bold text-sm text-white" style={{ fontFamily: "'Georgia',serif" }}>StudioRed</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Booking Manager</p>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {[
            { l: "Dashboard", ic: I.dash, a: false },
            { l: "Bookings",  ic: I.users, a: false },
            { l: "Calendar",  ic: I.calendar, a: false },
            { l: "Packages",  ic: I.pkg, a: true },
          ].map(item => (
            <button key={item.l} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{ background: item.a ? "rgba(255,255,255,0.18)" : "transparent", color: item.a ? "#fff" : "rgba(255,255,255,0.6)" }}>
              <Ic d={item.ic} size={15} stroke="currentColor" sw={2} />
              {navOpen && <span className="font-medium">{item.l}</span>}
              {navOpen && item.l === "Packages" && (
                <span className="ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.22)", color: "#fff" }}>
                  {packages.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button onClick={() => setNavOpen(o => !o)}
          className="mx-2 mb-4 flex items-center justify-center gap-2 py-2 rounded-lg text-xs"
          style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
          <Ic d={I.menu} size={13} />
          {navOpen && "Collapse"}
        </button>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Package list column */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <header className="flex items-center justify-between px-7 py-4 bg-white border-b shrink-0"
            style={{ borderColor: "#ede0e2" }}>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>
                Service Packages
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "#9a6a72" }}>
                {activeCount} active · {packages.length} total packages
              </p>
            </div>
            <button
              onClick={() => setEditing(EMPTY_PKG)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
              style={{ background: "#A30A24" }}>
              <Ic d={I.plus} size={13} stroke="#fff" sw={2.5} />
              New Package
            </button>
          </header>

          {/* Filter bar */}
          <div className="flex items-center gap-3 px-7 py-3 bg-white border-b shrink-0 flex-wrap"
            style={{ borderColor: "#ede0e2" }}>

            {/* Search */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9a6a72" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input className="pl-8 pr-3 py-2 rounded-xl text-xs border outline-none w-52 transition-all focus:border-[#A30A24] focus:ring-1 focus:ring-[#A30A24]/20"
                style={{ borderColor: "#e5d5d8", background: "#fdfafa" }}
                placeholder="Search packages…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5">
              {[
                { key: "all",      label: `All (${packages.length})` },
                { key: "active",   label: `Active (${activeCount})` },
                { key: "inactive", label: `Inactive (${packages.length - activeCount})` },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilterActive(key)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
                  style={filterActive === key
                    ? { background: "#A30A24", color: "#fff", border: "1px solid #A30A24" }
                    : { background: "transparent", color: "#7a4a50", border: "1px solid #e5d5d8" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#7a6a70" }}>
                <Ic d={I.peso} size={12} stroke="#A30A24" sw={2} />
                <span>Avg. <strong style={{ color: "#A30A24" }}>
                  ₱{packages.length ? Math.round(packages.reduce((s,p) => s + Number(p.price), 0) / packages.length).toLocaleString() : 0}
                </strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#7a6a70" }}>
                <Ic d={I.clock} size={12} stroke="#9a6a72" sw={2} />
                <span>Avg. <strong style={{ color: "#4a3a42" }}>
                  {packages.length ? durLabel(Math.round(packages.reduce((s,p) => s + p.duration, 0) / packages.length)) : "—"}
                </strong></span>
              </div>
            </div>
          </div>

          {/* Package list */}
          <div className="flex-1 overflow-y-auto p-5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "#fdf0f2", border: "1.5px solid #f5d0d5" }}>
                  <Ic d={I.pkg} size={26} stroke="#c07080" sw={1.5} />
                </div>
                <p className="text-sm font-bold" style={{ color: "#7a4a50", fontFamily: "'Georgia',serif" }}>
                  {search ? "No matching packages" : "No packages yet"}
                </p>
                <p className="text-xs" style={{ color: "#b07a80" }}>
                  {search ? "Try a different search term" : "Click \"New Package\" to create your first service package"}
                </p>
                {!search && (
                  <button onClick={() => setEditing(EMPTY_PKG)}
                    className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90"
                    style={{ background: "#A30A24" }}>
                    <span className="flex items-center gap-1.5">
                      <Ic d={I.plus} size={12} stroke="#fff" sw={2.5} /> Create First Package
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-w-2xl mx-auto">
                {filtered.map(pkg => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onEdit={setEditing}
                    onDuplicate={handleDuplicate}
                    onDelete={(id) => setDeleteTarget(packages.find(p => p.id === id))}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right panel: Create / Edit form ─── */}
        {editing !== null && (
          <aside className="w-[380px] shrink-0 flex flex-col overflow-hidden border-l"
            style={{ background: "#fff", borderColor: "#ede0e2" }}>

            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
              style={{ borderColor: "#f0e0e3", background: "#fdf5f6" }}>
              <div>
                <h2 className="font-bold text-sm" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>
                  {editing.id ? "Edit Package" : "New Package"}
                </h2>
                <p className="text-[10px] mt-0.5" style={{ color: "#9a6a72" }}>
                  {editing.id ? `Editing: ${editing.title}` : "Fill in the details below"}
                </p>
              </div>
              <button onClick={() => setEditing(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                style={{ color: "#A30A24" }}>
                <Ic d={I.close} size={15} sw={2.2} />
              </button>
            </div>

            <PackageForm
              key={editing.id || "new"}
              initial={editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
