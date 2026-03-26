"use client";

import { useState, useRef, useEffect } from "react";

// ─── Seed Bookings (same shape as BookingsDashboard) ──────────────────────────
const SEED_BOOKINGS = [
  {
    id: "BK-0001",
    customer: { name: "Maria Santos", email: "maria@example.com", phone: "09171234567" },
    service: { title: "Bridal Package Deluxe", price: 8500 },
    addons: [{ id: "a1", label: "Hair Styling", price: 1200 }],
    date: "2025-08-05",
    time: "09:00 AM",
    totalPrice: 9700,
    status: "Confirmed",
  },
  {
    id: "BK-0002",
    customer: { name: "Ana Reyes", email: "ana@example.com", phone: "09289876543" },
    service: { title: "Debut Makeup", price: 5000 },
    addons: [],
    date: "2025-08-05",
    time: "02:00 PM",
    totalPrice: 5000,
    status: "Pending",
  },
  {
    id: "BK-0003",
    customer: { name: "Liza Cruz", email: "liza@example.com", phone: "09051112233" },
    service: { title: "Everyday Glam", price: 2500 },
    addons: [],
    date: "2025-08-12",
    time: "11:00 AM",
    totalPrice: 2500,
    status: "Confirmed",
  },
  {
    id: "BK-0004",
    customer: { name: "Jenny Flores", email: "jenny@example.com", phone: "09991234567" },
    service: { title: "SDE / Film Shoot Makeup", price: 3800 },
    addons: [{ id: "a4", label: "Airbrush Upgrade", price: 1500 }],
    date: "2025-08-19",
    time: "06:00 AM",
    totalPrice: 5300,
    status: "Confirmed",
  },
  {
    id: "BK-0005",
    customer: { name: "Rica Tan", email: "rica@example.com", phone: "09171110000" },
    service: { title: "Special Occasion", price: 3200 },
    addons: [],
    date: "2025-08-26",
    time: "10:00 AM",
    totalPrice: 3200,
    status: "Pending",
  },
];

// ─── Utilities ─────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");
const toKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parseKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
};
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAYS_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const fmtPrice = (n) => "₱" + Number(n).toLocaleString("en-PH");

const STATUS_COLOR = { Confirmed: "#10b981", Pending: "#f59e0b", Cancelled: "#ef4444" };

// ─── SVG Icon ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IC = {
  prev:    "M15 18l-6-6 6-6",
  next:    "M9 18l6-6-6-6",
  close:   "M18 6L6 18M6 6l12 12",
  block:   "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636",
  clock:   "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  cal:     "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  plus:    "M12 5v14M5 12h14",
  range:   "M8 6h13M8 12h13M8 18h5M3 6h.01M3 12h.01M3 18h.01",
  time:    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0",
  weekend: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  dayoff:  "M12 2a10 10 0 100 20A10 10 0 0012 2zM4.93 4.93l14.14 14.14",
  unlock:  "M8 11V7a4 4 0 018 0M5 11h14v10H5z",
  lock:    "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  user:    "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  trash:   "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6",
  check:   "M20 6L9 17l-5-5",
  info:    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M11 12h1v4h1",
  settings:"M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
};

// ─── Time slots ────────────────────────────────────────────────────────────────
const ALL_TIMES = [
  "06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM",
  "06:00 PM","07:00 PM","08:00 PM",
];

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

// ─── Label helpers ──────────────────────────────────────────────────────────────
const LBL = ({ children }) => (
  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#7a3a42" }}>{children}</label>
);
const INP = ({ ...props }) => (
  <input className="w-full px-3.5 py-2 rounded-lg text-sm border outline-none focus:border-[#A30A24] focus:ring-2 focus:ring-[#A30A24]/10 transition-all"
    style={{ borderColor: "#e5d5d8", background: "#fdfafa" }} {...props} />
);

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

const Row = ({ label, sub, configKey, icon }) => (
  <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: config[configKey] ? "#fff5f5" : "#f9fafb", border: `1.5px solid ${config[configKey] ? "#fecdd3" : "#e5e7eb"}` }}>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: config[configKey] ? "#FEF0F2" : "#f3f4f6" }}>
        <Icon d={icon} size={15} stroke={config[configKey] ? "#A30A24" : "#6b7280"} />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: config[configKey] ? "#A30A24" : "#374151" }}>{label}</p>
        <p className="text-[11px]" style={{ color: "#9ca3af" }}>{sub}</p>
      </div>
    </div>
    <button onClick={() => toggle(configKey)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 flex items-center"
      style={{ background: config[configKey] ? "#A30A24" : "#d1d5db" }}>
      <span className="absolute w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
        style={{ left: config[configKey] ? "calc(100% - 20px)" : "4px" }} />
    </button>
  </div>
);
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

// ─── Legend Item ───────────────────────────────────────────────────────────────
const Leg = ({ color, label, pattern }) => (
  <div className="flex items-center gap-1.5">
    <span className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center" style={{ background: pattern ? undefined : color, border: pattern ? `2px solid ${color}` : undefined }}>
      {pattern && <span className="w-1.5 h-1.5 rounded-sm" style={{ background: color }} />}
    </span>
    <span className="text-[11px]" style={{ color: "#7a3a42" }}>{label}</span>
  </div>
);

// ─── Main Calendar ─────────────────────────────────────────────────────────────
export default function CalendarTab() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  // Data state
  const [bookings] = useState(SEED_BOOKINGS);
  const [manualBlocks, setManualBlocks] = useState([]); // { type:"single"|"range"|"time", ... }
  const [weekendOverrides, setWeekendOverrides] = useState(new Set()); // dateKeys of opened weekends

  // Config
  const [config, setConfig] = useState({ blockWeekends: true, blockSundays: false, blockSaturdays: false });

  // Modal
  const [modal, setModal] = useState(null); // { type, payload? }

  // Derived: days in month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  // Helpers: determine state of a cell
  const getBookingsForDate = (key) => bookings.filter(b => b.date === key);

  const isWeekendDay = (dow) => {
    if (config.blockWeekends) return dow === 0 || dow === 6;
    if (config.blockSundays) return dow === 0;
    if (config.blockSaturdays) return dow === 6;
    return false;
  };

  const getBlocksForDate = (key) => {
    const { year: y, month: m, day: d } = parseKey(key);
    const dow = new Date(y, m, d).getDay();
    const blocks = [];

    // Weekend rule
    if (isWeekendDay(dow) && !weekendOverrides.has(key)) {
      const name = dow === 0 ? "Sunday" : "Saturday";
      blocks.push({ type: "auto-weekend", label: `${name} – Day Off`, date: key });
    }

    // Manual single / range
    manualBlocks.forEach(b => {
      if (b.type === "single" && b.date === key) blocks.push(b);
      if (b.type === "range" && b.from <= key && key <= b.to) blocks.push(b);
    });

    return blocks;
  };

  const getTimeBlocksForDate = (key) =>
    manualBlocks.filter(b => b.type === "time" && b.date === key);

  const isFullyBlocked = (key) => getBlocksForDate(key).length > 0;
  const isPartiallyBlocked = (key) => !isFullyBlocked(key) && getTimeBlocksForDate(key).length > 0;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const handleAddBlock = (payload) => {
    const { type, date, from, to, label } = payload;
    setManualBlocks(prev => [...prev, payload]);

    // If it's a single block on a weekend, also override so it appears differently
    if (type === "single") {
      const { year: y, month: m, day: d } = parseKey(date);
      const dow = new Date(y, m, d).getDay();
      if (isWeekendDay(dow)) weekendOverrides.delete(date); // ensure it stays blocked
    }
    setModal(null);
  };

  const handleRemoveBlock = (block) => {
    setManualBlocks(prev => prev.filter(b => b !== block));
  };

  const handleUnblockWeekend = (key) => {
    setWeekendOverrides(prev => new Set([...prev, key]));
  };

  // Render cells
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - firstDay + 1;
    const isPrev = dayNum < 1;
    const isNext = dayNum > daysInMonth;
    const actualDay = isPrev ? daysInPrev + dayNum : isNext ? dayNum - daysInMonth : dayNum;
    const cellMonth = isPrev ? month - 1 : isNext ? month + 1 : month;
    const cellYear = isPrev && month === 0 ? year - 1 : isNext && month === 11 ? year + 1 : year;
    const key = toKey(cellYear, cellMonth, actualDay);
    const isCurrentMonth = !isPrev && !isNext;
    const dow = new Date(cellYear, cellMonth, actualDay).getDay();
    const isToday = key === toKey(now.getFullYear(), now.getMonth(), now.getDate());
    const bkgs = isCurrentMonth ? getBookingsForDate(key) : [];
    const fullyBlocked = isCurrentMonth && isFullyBlocked(key);
    const partBlocked = isCurrentMonth && isPartiallyBlocked(key);
    const isWeekendCell = dow === 0 || dow === 6;
    const isWeekendBlocked = fullyBlocked && getBlocksForDate(key).some(b => b.type === "auto-weekend");

    cells.push({ key, dayNum: actualDay, isCurrentMonth, dow, isToday, bkgs, fullyBlocked, partBlocked, isWeekendBlocked, isWeekendCell, cellMonth, cellYear });
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // Stats for current month
  const monthBookings = bookings.filter(b => {
    const d = new Date(b.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const blockedCount = cells.filter(c => c.isCurrentMonth && c.fullyBlocked).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#f7f0f1" }}>

      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: "#A30A24", color: "#fff" }}>
        <div className="px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Icon d={IC.cal} size={17} stroke="#fff" sw={2} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight" style={{ fontFamily: "'Georgia',serif" }}>StudioRed</p>
              <p className="text-xs opacity-60">Calendar</p>
            </div>
          </div>
        </div>

        <nav className="py-4 px-2 space-y-1">
          {[
            { label: "Dashboard",  icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10", active: false },
            { label: "Bookings",   icon: IC.range, active: false },
            { label: "Calendar",   icon: IC.cal, active: true },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{ background: item.active ? "rgba(255,255,255,0.18)" : "transparent", color: item.active ? "#fff" : "rgba(255,255,255,0.65)" }}>
              <Icon d={item.icon} size={15} sw={2} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Mini stats */}
        <div className="px-4 mt-2 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3">This Month</p>
          {[
            { label: "Bookings",     value: monthBookings.length },
            { label: "Blocked Days", value: blockedCount },
            { label: "Revenue",      value: fmtPrice(monthBookings.filter(b => b.status !== "Cancelled").reduce((s, b) => s + b.totalPrice, 0)) },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: "rgba(255,255,255,0.1)" }}>
              <span className="text-xs opacity-70">{s.label}</span>
              <span className="text-xs font-bold">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Block actions */}
        <div className="px-4 mt-auto mb-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Quick Block</p>
          {[
            { label: "Block a Date",       icon: IC.cal,   mode: "single" },
            { label: "Block Date Range",   icon: IC.range, mode: "range" },
            { label: "Block Time Slot",    icon: IC.time,  mode: "time" },
          ].map(a => (
            <button key={a.label} onClick={() => setModal({ type: "block", mode: a.mode })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}>
              <Icon d={a.icon} size={13} />
              {a.label}
            </button>
          ))}
          <button onClick={() => setModal({ type: "settings" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mt-1 transition-colors"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
            <Icon d={IC.settings} size={13} />
            Schedule Settings
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-7 py-4 bg-white border-b" style={{ borderColor: "#ede0e2" }}>
          <div className="flex items-center gap-5">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-red-50" style={{ borderColor: "#e5d5d8", color: "#A30A24" }}>
              <Icon d={IC.prev} size={15} sw={2.5} />
            </button>
            <h1 className="text-2xl font-bold min-w-52 text-center" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>
              {MONTHS[month]} <span style={{ color: "#A30A24" }}>{year}</span>
            </h1>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-red-50" style={{ borderColor: "#e5d5d8", color: "#A30A24" }}>
              <Icon d={IC.next} size={15} sw={2.5} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ background: "#fdf5f6", border: "1px solid #f0e0e3" }}>
              <Leg color="#A30A24" label="Booked" />
              <Leg color="#ef4444" label="Blocked" />
              <Leg color="#f59e0b" label="Time Block" />
              <Leg color="#6b7280" label="Weekend Off" />
            </div>

            <button onClick={() => setModal({ type: "block", mode: "single" })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "#A30A24" }}>
              <Icon d={IC.plus} size={14} sw={2.5} />
              Block Date
            </button>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 20px rgba(163,10,36,0.08)", border: "1px solid #f0e0e3" }}>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b" style={{ borderColor: "#f0e0e3" }}>
              {DAYS_SHORT.map((d, i) => (
                <div key={d} className="text-center py-3.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: (i === 0 || i === 6) ? "#A30A24" : "#7a3a42", background: (i === 0 || i === 6) ? "#fdf5f6" : "#fff" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7" style={{ borderBottom: wi < weeks.length - 1 ? "1px solid #f5eaec" : undefined }}>
                {week.map((cell) => {
                  const { key, dayNum, isCurrentMonth, dow, isToday, bkgs, fullyBlocked, partBlocked, isWeekendBlocked, isWeekendCell } = cell;

                  let cellBg = "#fff";
                  if (!isCurrentMonth) cellBg = "#fdfafa";
                  else if (fullyBlocked && isWeekendBlocked) cellBg = "#f3f4f6";
                  else if (fullyBlocked) cellBg = "#fff5f5";
                  else if (partBlocked) cellBg = "#fffbeb";
                  else if (bkgs.length > 0) cellBg = "#fff8f9";

                  return (
                    <div key={key}
                      onClick={() => isCurrentMonth && setModal({ type: "day", dateKey: key })}
                      className="relative border-r last:border-r-0 p-2 min-h-28 flex flex-col gap-1 group transition-colors"
                      style={{
                        borderColor: "#f5eaec",
                        background: cellBg,
                        cursor: isCurrentMonth ? "pointer" : "default",
                      }}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between">
                        <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold transition-colors
                          ${isCurrentMonth ? "group-hover:bg-red-50" : ""}`}
                          style={{
                            background: isToday ? "#A30A24" : undefined,
                            color: isToday ? "#fff" : !isCurrentMonth ? "#d1c0c3" : isWeekendCell ? "#A30A24" : "#1a0a0d",
                            fontFamily: "'Georgia',serif",
                          }}>
                          {dayNum}
                        </span>

                        {/* Indicators row */}
                        <div className="flex items-center gap-1">
                          {isCurrentMonth && bkgs.length > 0 && !fullyBlocked && (
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A30A24" }} />
                          )}
                          {isCurrentMonth && partBlocked && (
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#f59e0b" }} />
                          )}
                          {isCurrentMonth && fullyBlocked && (
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
                          )}
                        </div>
                      </div>

                      {/* Blocked badge */}
                      {isCurrentMonth && fullyBlocked && (
                        <div className="rounded px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1"
                          style={{ background: isWeekendBlocked ? "#e5e7eb" : "#fee2e2", color: isWeekendBlocked ? "#4b5563" : "#b91c1c" }}>
                          <Icon d={IC.block} size={9} stroke={isWeekendBlocked ? "#4b5563" : "#b91c1c"} sw={2} />
                          {isWeekendBlocked ? "Day Off" : getBlocksForDate(key)[0]?.label?.slice(0, 12) || "Blocked"}
                        </div>
                      )}

                      {/* Time block badge */}
                      {isCurrentMonth && partBlocked && (
                        <div className="rounded px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1"
                          style={{ background: "#fef3c7", color: "#92400e" }}>
                          <Icon d={IC.clock} size={9} stroke="#92400e" sw={2} />
                          {getTimeBlocksForDate(key)[0]?.from}
                        </div>
                      )}

                      {/* Booking pills */}
                      {isCurrentMonth && !fullyBlocked && bkgs.slice(0, 2).map(b => (
                        <div key={b.id} className="rounded px-1.5 py-0.5 text-[10px] font-medium truncate flex items-center gap-1"
                          style={{ background: STATUS_COLOR[b.status] + "18", color: STATUS_COLOR[b.status] }}>
                          <span className="w-1 h-1 rounded-full shrink-0" style={{ background: STATUS_COLOR[b.status] }} />
                          {b.customer.name.split(" ")[0]} · {b.time}
                        </div>
                      ))}
                      {isCurrentMonth && !fullyBlocked && bkgs.length > 2 && (
                        <div className="text-[10px] font-semibold" style={{ color: "#9a6a72" }}>+{bkgs.length - 2} more</div>
                      )}

                      {/* Weekend override button */}
                      {isCurrentMonth && isWeekendBlocked && (
                        <button
                          onClick={e => { e.stopPropagation(); handleUnblockWeekend(key); }}
                          className="mt-auto text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors hover:bg-green-100"
                          style={{ color: "#059669", background: "#d1fae5" }}
                          title="Open this day">
                          Open Day
                        </button>
                      )}

                      {/* Hover overlay for non-blocked days */}
                      {isCurrentMonth && !fullyBlocked && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-1.5 pointer-events-none"
                          style={{ background: "linear-gradient(to bottom, transparent, rgba(163,10,36,0.04))" }}>
                          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#A30A24" }}>View</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Active Blocks List */}
          {manualBlocks.length > 0 && (
            <div className="mt-5 bg-white rounded-2xl p-5" style={{ border: "1px solid #f0e0e3", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm" style={{ color: "#A30A24", fontFamily: "'Georgia',serif" }}>Active Manual Blocks</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#FEF0F2", color: "#A30A24" }}>{manualBlocks.length}</span>
              </div>
              <div className="space-y-2">
                {manualBlocks.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 px-4 rounded-xl"
                    style={{ background: b.type === "time" ? "#fffbeb" : "#fff5f5", border: `1px solid ${b.type === "time" ? "#fde68a" : "#fecdd3"}` }}>
                    <Icon d={b.type === "time" ? IC.clock : IC.block} size={14} stroke={b.type === "time" ? "#b45309" : "#A30A24"} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: b.type === "time" ? "#92400e" : "#A30A24" }}>{b.label}</p>
                      <p className="text-[10px]" style={{ color: "#9a6a72" }}>
                        {b.type === "single" && b.date}
                        {b.type === "range" && `${b.from} → ${b.to}`}
                        {b.type === "time" && `${b.date} · ${b.from} – ${b.to}`}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: b.type === "time" ? "#fef3c7" : "#fee2e2", color: b.type === "time" ? "#b45309" : "#b91c1c" }}>
                      {b.type}
                    </span>
                    <button onClick={() => handleRemoveBlock(b)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Icon d={IC.trash} size={12} stroke="#ef4444" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal?.type === "block" && (
        <Modal title="Block Schedule" onClose={() => setModal(null)} width="max-w-md">
          <BlockDatePanel
            mode={modal.mode}
            prefill={modal.prefill}
            onSave={handleAddBlock}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === "day" && (
        <Modal title="Day Details" onClose={() => setModal(null)} width="max-w-md">
          <DayDetail
            dateKey={modal.dateKey}
            bookings={bookings}
            blocks={[
              ...manualBlocks.filter(b => b.type !== "time"),
              ...getBlocksForDate(modal.dateKey).filter(b => b.type === "auto-weekend"),
            ]}
            timeBlocks={getTimeBlocksForDate(modal.dateKey)}
            onAddBlock={(key) => setModal({ type: "block", mode: "single", prefill: key })}
            onRemoveBlock={handleRemoveBlock}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === "settings" && (
        <Modal title="Schedule Settings" onClose={() => setModal(null)} width="max-w-md">
          <SettingsPanel
            config={config}
            onChange={setConfig}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
