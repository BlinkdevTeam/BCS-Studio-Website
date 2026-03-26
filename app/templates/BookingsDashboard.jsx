"use client";

import { useState, useEffect } from "react";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED = [
  {
    id: "BK-0001",
    customer: { name: "Maria Santos", email: "maria@example.com", phone: "09171234567", description: "Need extra care for sensitive skin" },
    service: { title: "Bridal Package Deluxe", price: 8500 },
    addons: [{ id: "a1", label: "Hair Styling", price: 1200 }, { id: "a2", label: "Lash Extensions", price: 800 }],
    date: "2025-08-10",
    time: "09:00 AM",
    totalPrice: 10500,
    status: "Confirmed",
    proof: "receipt_001.jpg",
  },
  {
    id: "BK-0002",
    customer: { name: "Ana Reyes", email: "ana@example.com", phone: "09289876543", description: "" },
    service: { title: "Debut Makeup", price: 5000 },
    addons: [{ id: "a3", label: "Touch-up Kit", price: 500 }],
    date: "2025-08-15",
    time: "02:00 PM",
    totalPrice: 5500,
    status: "Pending",
    proof: "receipt_002.png",
  },
  {
    id: "BK-0003",
    customer: { name: "Liza Cruz", email: "liza@example.com", phone: "09051112233", description: "Allergic to latex" },
    service: { title: "Everyday Glam", price: 2500 },
    addons: [],
    date: "2025-08-20",
    time: "11:00 AM",
    totalPrice: 2500,
    status: "Cancelled",
    proof: null,
  },
];

const SERVICES = [
  { title: "Bridal Package Deluxe", price: 8500 },
  { title: "Debut Makeup", price: 5000 },
  { title: "Everyday Glam", price: 2500 },
  { title: "SDE / Film Shoot Makeup", price: 3800 },
  { title: "Special Occasion", price: 3200 },
];

const ADDON_OPTIONS = [
  { id: "a1", label: "Hair Styling", price: 1200 },
  { id: "a2", label: "Lash Extensions", price: 800 },
  { id: "a3", label: "Touch-up Kit", price: 500 },
  { id: "a4", label: "Airbrush Upgrade", price: 1500 },
  { id: "a5", label: "On-site Assistance", price: 2000 },
];

const STATUS_STYLES = {
  Confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const STATUS_DOT = {
  Confirmed: "bg-emerald-500",
  Pending: "bg-amber-400",
  Cancelled: "bg-red-500",
};

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  bookings: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  close: "M18 6L6 18M6 6l12 12",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  check: "M20 6L9 17l-5-5",
  warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  money: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  trend: "M23 6l-9.5 9.5-5-5L1 18",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  logo: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => "BK-" + String(Math.floor(Math.random() * 9000) + 1000);
const fmtPrice = (n) => "₱" + Number(n).toLocaleString("en-PH");
const totalFromBooking = (b) =>
  b.service.price + b.addons.reduce((s, a) => s + a.price, 0);

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

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,2,4,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" style={{ border: "1.5px solid #f0e0e3" }}>
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: "#f0e0e3" }}>
          <h2 className="text-xl font-bold" style={{ color: "#A30A24", fontFamily: "'Georgia', serif" }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" style={{ color: "#A30A24" }}>
            <Icon d={Icons.close} size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-7 py-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Booking Form ──────────────────────────────────────────────────────────────
function BookingForm({ initial, onSave, onCancel }) {
  const blank = {
    customer: { name: "", email: "", phone: "", description: "" },
    service: SERVICES[0],
    addons: [],
    date: "",
    time: "",
    status: "Pending",
    proof: null,
  };

  const [form, setForm] = useState(initial ? {
    customer: { ...initial.customer },
    service: { ...initial.service },
    addons: [...initial.addons],
    date: initial.date,
    time: initial.time,
    status: initial.status,
    proof: initial.proof,
  } : blank);

  const setCustomer = (k, v) => setForm(f => ({ ...f, customer: { ...f.customer, [k]: v } }));
  const setService = (title) => {
    const svc = SERVICES.find(s => s.title === title);
    setForm(f => ({ ...f, service: svc }));
  };
  const toggleAddon = (addon) => {
    setForm(f => {
      const exists = f.addons.find(a => a.id === addon.id);
      return { ...f, addons: exists ? f.addons.filter(a => a.id !== addon.id) : [...f.addons, addon] };
    });
  };

  const total = form.service.price + form.addons.reduce((s, a) => s + a.price, 0);

  const submit = () => {
    if (!form.customer.name || !form.customer.email || !form.date || !form.time) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave({ ...form, totalPrice: total });
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none transition-all focus:border-[#A30A24] focus:ring-2 focus:ring-[#A30A24]/10";
  const inputStyle = { borderColor: "#e5d5d8", background: "#fdfafa" };
  const labelCls = "block text-xs font-semibold mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-6 text-sm">
      {/* Customer */}
      <div>
        <h3 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "#A30A24" }}>
          <Icon d={Icons.users} size={15} /> Customer Information
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Full Name *</label>
            <input className={inputCls} style={inputStyle} value={form.customer.name} onChange={e => setCustomer("name", e.target.value)} placeholder="Maria Santos" />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Phone *</label>
            <input className={inputCls} style={inputStyle} value={form.customer.phone} onChange={e => setCustomer("phone", e.target.value)} placeholder="09171234567" />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>Email Address *</label>
            <input type="email" className={inputCls} style={inputStyle} value={form.customer.email} onChange={e => setCustomer("email", e.target.value)} placeholder="maria@example.com" />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>Special Notes</label>
            <textarea rows={2} className={inputCls} style={inputStyle} value={form.customer.description} onChange={e => setCustomer("description", e.target.value)} placeholder="Allergies, preferences, etc." />
          </div>
        </div>
      </div>

      <hr style={{ borderColor: "#f0e0e3" }} />

      {/* Service */}
      <div>
        <h3 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "#A30A24" }}>
          <Icon d={Icons.bookings} size={15} /> Service & Schedule
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#7a3a42" }}>Service *</label>
            <select className={inputCls} style={inputStyle} value={form.service.title} onChange={e => setService(e.target.value)}>
              {SERVICES.map(s => <option key={s.title}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Date *</label>
            <input type="date" className={inputCls} style={inputStyle} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Time *</label>
            <input className={inputCls} style={inputStyle} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="09:00 AM" />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#7a3a42" }}>Status</label>
            <select className={inputCls} style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {["Pending", "Confirmed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <label className={labelCls} style={{ color: "#7a3a42" }}>Add-ons</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {ADDON_OPTIONS.map(addon => {
            const checked = !!form.addons.find(a => a.id === addon.id);
            return (
              <label key={addon.id} className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors" style={{ background: checked ? "#FEF0F2" : "#fdfafa", border: `1.5px solid ${checked ? "#A30A24" : "#e5d5d8"}` }}>
                <input type="checkbox" checked={checked} onChange={() => toggleAddon(addon)} className="accent-[#A30A24]" />
                <span className="flex-1 text-xs">{addon.label}</span>
                <span className="text-xs font-semibold" style={{ color: "#A30A24" }}>+₱{addon.price.toLocaleString()}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#A30A24", color: "#fff" }}>
        <span className="font-semibold">Total Amount</span>
        <span className="text-2xl font-bold" style={{ fontFamily: "'Georgia', serif" }}>{fmtPrice(total)}</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-red-50" style={{ borderColor: "#A30A24", color: "#A30A24" }}>
          Cancel
        </button>
        <button onClick={submit} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "#A30A24" }}>
          Save Booking
        </button>
      </div>
    </div>
  );
}

// ─── View Modal ────────────────────────────────────────────────────────────────
function ViewBooking({ booking, onClose }) {
  const { customer, service, addons, date, time, totalPrice, status, proof, id } = booking;
  const row = (label, value) => (
    <div className="flex justify-between items-start py-2.5 border-b last:border-0" style={{ borderColor: "#f5e8ea" }}>
      <span className="text-xs font-semibold uppercase tracking-wider w-36 shrink-0" style={{ color: "#b0707a" }}>{label}</span>
      <span className="text-sm text-right" style={{ color: "#1a0a0d" }}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-5 text-sm">
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FEF0F2" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: "#A30A24", fontFamily: "'Georgia', serif" }}>
          {customer.name[0]}
        </div>
        <div>
          <p className="font-bold text-base" style={{ color: "#A30A24" }}>{customer.name}</p>
          <p className="text-xs" style={{ color: "#7a3a42" }}>{id}</p>
        </div>
        <span className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 ${STATUS_STYLES[status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
          {status}
        </span>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A30A24" }}>Customer</p>
        {row("Email", customer.email)}
        {row("Phone", customer.phone)}
        {customer.description && row("Notes", customer.description)}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A30A24" }}>Service</p>
        {row("Package", service.title)}
        {row("Base Price", fmtPrice(service.price))}
        {row("Date", date)}
        {row("Time", time)}
      </div>

      {addons.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A30A24" }}>Add-ons</p>
          {addons.map(a => row(a.label, `+${fmtPrice(a.price)}`))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl px-5 py-4 text-white" style={{ background: "#A30A24" }}>
        <span className="font-semibold">Total Amount</span>
        <span className="text-2xl font-bold" style={{ fontFamily: "'Georgia', serif" }}>{fmtPrice(totalPrice)}</span>
      </div>

      {proof && (
        <div className="flex items-center gap-2 p-3 rounded-lg text-xs" style={{ background: "#f5f5f5", border: "1px solid #e0e0e0" }}>
          <Icon d={Icons.upload} size={14} stroke="#888" />
          <span className="text-gray-500">Payment proof:</span>
          <span className="font-medium text-gray-700">{proof}</span>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: "#A30A24" }}>Close</button>
      </div>
    </div>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ booking, onConfirm, onCancel }) {
  return (
    <div className="text-center space-y-5 py-4">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: "#FEF0F2" }}>
        <Icon d={Icons.warning} size={28} stroke="#A30A24" strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-lg font-bold" style={{ color: "#1a0a0d" }}>Delete Booking?</h3>
        <p className="text-sm mt-1" style={{ color: "#7a3a42" }}>
          You&apos;re about to permanently delete booking <strong>{booking.id}</strong> for <strong>{booking.customer.name}</strong>. This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: "#d1d5db", color: "#374151" }}>
          Keep Booking
        </button>
        <button onClick={onConfirm} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: "#A30A24" }}>
          Yes, Delete
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
export default function BookingsDashboard() {
  const [bookings, setBookings] = useState(SEED);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null); // { type: "create"|"edit"|"view"|"delete", booking? }
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchQ = !q || b.customer.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.service.title.toLowerCase().includes(q);
    const matchS = statusFilter === "All" || b.status === statusFilter;
    return matchQ && matchS;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    pending: bookings.filter(b => b.status === "Pending").length,
    revenue: bookings.filter(b => b.status !== "Cancelled").reduce((s, b) => s + b.totalPrice, 0),
  };

  const closeModal = () => setModal(null);

  const handleCreate = (data) => {
    setBookings(prev => [...prev, { ...data, id: uid(), proof: null }]);
    closeModal();
  };

  const handleEdit = (data) => {
    setBookings(prev => prev.map(b => b.id === modal.booking.id ? { ...b, ...data, id: b.id } : b));
    closeModal();
  };

  const handleDelete = () => {
    setBookings(prev => prev.filter(b => b.id !== modal.booking.id));
    closeModal();
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden" style={{ background: "#f7f0f1", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300"
        style={{ width: sidebarOpen ? 240 : 68, background: "#A30A24", color: "#fff" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
            <Icon d={Icons.logo} size={18} stroke="#fff" strokeWidth={2} />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-sm leading-tight" style={{ fontFamily: "'Georgia', serif" }}>StudioRed</p>
              <p className="text-xs opacity-60">Booking Manager</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {[
            { label: "Dashboard", icon: Icons.dashboard, active: false },
            { label: "Bookings", icon: Icons.bookings, active: true },
            { label: "Calendar", icon: Icons.calendar, active: false },
          ].map(item => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{ background: item.active ? "rgba(255,255,255,0.18)" : "transparent", color: item.active ? "#fff" : "rgba(255,255,255,0.65)" }}
            >
              <Icon d={item.icon} size={16} strokeWidth={2} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="mx-2 mb-4 flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-colors"
          style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}
        >
          <Icon d={sidebarOpen ? Icons.close : Icons.filter} size={14} />
          {sidebarOpen && "Collapse"}
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="flex items-center justify-between px-7 py-4 bg-white border-b" style={{ borderColor: "#ede0e2" }}>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#1a0a0d", fontFamily: "'Georgia', serif" }}>Bookings</h1>
            <p className="text-xs mt-0.5" style={{ color: "#9a6a72" }}>Manage all your customer bookings</p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ background: "#A30A24" }}
          >
            <Icon d={Icons.plus} size={15} strokeWidth={2.5} />
            New Booking
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Bookings" value={stats.total} sub="All time" iconPath={Icons.bookings} accent />
            <StatCard label="Confirmed" value={stats.confirmed} sub="Active bookings" iconPath={Icons.check} />
            <StatCard label="Pending" value={stats.pending} sub="Awaiting confirmation" iconPath={Icons.calendar} />
            <StatCard label="Revenue" value={fmtPrice(stats.revenue)} sub="Confirmed + Pending" iconPath={Icons.money} />
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #f0e0e3" }}>

            {/* Filters */}
            <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "#f5eaec" }}>
              <div className="relative flex-1 max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b0707a" }}>
                  <Icon d={Icons.search} size={14} />
                </span>
                <input
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "#fdfafa", border: "1.5px solid #e5d5d8" }}
                  placeholder="Search bookings…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1.5">
                {["All", "Confirmed", "Pending", "Cancelled"].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={statusFilter === s
                      ? { background: "#A30A24", color: "#fff" }
                      : { background: "#fdfafa", color: "#7a3a42", border: "1.5px solid #e5d5d8" }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-xs" style={{ color: "#9a6a72" }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#fdf5f6" }}>
                    {["Booking ID", "Customer", "Service", "Schedule", "Total", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: "#b0707a" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-sm" style={{ color: "#b0707a" }}>
                        <div className="flex flex-col items-center gap-2">
                          <Icon d={Icons.bookings} size={28} stroke="#d4a0a8" strokeWidth={1.5} />
                          No bookings found
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((b, i) => (
                    <tr
                      key={b.id}
                      className="border-t transition-colors hover:bg-red-50/40"
                      style={{ borderColor: "#f5eaec" }}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded" style={{ background: "#FEF0F2", color: "#A30A24" }}>{b.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "#A30A24" }}>
                            {b.customer.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-xs" style={{ color: "#1a0a0d" }}>{b.customer.name}</p>
                            <p className="text-xs" style={{ color: "#9a6a72" }}>{b.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-xs" style={{ color: "#1a0a0d" }}>{b.service.title}</p>
                        {b.addons.length > 0 && <p className="text-xs mt-0.5" style={{ color: "#9a6a72" }}>{b.addons.length} add-on{b.addons.length > 1 ? "s" : ""}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium" style={{ color: "#1a0a0d" }}>{b.date}</p>
                        <p className="text-xs" style={{ color: "#9a6a72" }}>{b.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-xs" style={{ color: "#A30A24", fontFamily: "'Georgia', serif" }}>{fmtPrice(b.totalPrice)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_STYLES[b.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`} />
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setModal({ type: "view", booking: b })}
                            title="View"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                            style={{ color: "#A30A24" }}
                          >
                            <Icon d={Icons.eye} size={14} />
                          </button>
                          <button
                            onClick={() => setModal({ type: "edit", booking: b })}
                            title="Edit"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
                            style={{ color: "#2563eb" }}
                          >
                            <Icon d={Icons.edit} size={14} />
                          </button>
                          <button
                            onClick={() => setModal({ type: "delete", booking: b })}
                            title="Delete"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                            style={{ color: "#dc2626" }}
                          >
                            <Icon d={Icons.trash} size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ── Modals ── */}
      {modal?.type === "create" && (
        <Modal title="New Booking" onClose={closeModal}>
          <BookingForm onSave={handleCreate} onCancel={closeModal} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Edit Booking" onClose={closeModal}>
          <BookingForm initial={modal.booking} onSave={handleEdit} onCancel={closeModal} />
        </Modal>
      )}
      {modal?.type === "view" && (
        <Modal title="Booking Details" onClose={closeModal}>
          <ViewBooking booking={modal.booking} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <Modal title="Confirm Deletion" onClose={closeModal}>
          <DeleteConfirm booking={modal.booking} onConfirm={handleDelete} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
