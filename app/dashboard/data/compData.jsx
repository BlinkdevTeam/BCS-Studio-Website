// ─── Seed Data ────────────────────────────────────────────────────────────────
export const SEED_BOOKINGS = [
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

export const SERVICES = [
  { title: "Bridal Package Deluxe", price: 8500 },
  { title: "Debut Makeup", price: 5000 },
  { title: "Everyday Glam", price: 2500 },
  { title: "SDE / Film Shoot Makeup", price: 3800 },
  { title: "Special Occasion", price: 3200 },
];

export const ADDON_OPTIONS = [
  { id: "a1", label: "Hair Styling", price: 1200 },
  { id: "a2", label: "Lash Extensions", price: 800 },
  { id: "a3", label: "Touch-up Kit", price: 500 },
  { id: "a4", label: "Airbrush Upgrade", price: 1500 },
  { id: "a5", label: "On-site Assistance", price: 2000 },
];

export const STATUS_STYLES = {
  Confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Cancelled: "bg-red-100 text-red-700 border border-red-200",
};

export const STATUS_DOT = {
  Confirmed: "bg-emerald-500",
  Pending: "bg-amber-400",
  Cancelled: "bg-red-500",
};

// ─── Icons ─────────────────────────────────────────────────────────────────────
export const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const Ic = ({ d, size = 16, stroke = "currentColor", fill = "none", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const Icons = {
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
  money: "M12 2C6.48 2 2 3.79 2 6s4.48 4 10 4 10-1.79 10-4-4.48-4-10-4zm0 8c-5.52 0-10 1.79-10 4v2c0 2.21 4.48 4 10 4s10-1.79 10-4v-2c0-2.21-4.48-4-10-4zm0 6c-5.52 0-10 1.79-10 4v2c0 2.21 4.48 4 10 4s10-1.79 10-4v-2c0-2.21-4.48-4-10-4z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  trend: "M23 6l-9.5 9.5-5-5L1 18",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  logo: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  package: "M4 6l8-4 8 4-8 4-8-4M4 6v12l8 4 8-4V6M12 10v12",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const uid = () => Math.random().toString(36).slice(2, 8);
export const fmtPrice = (n) => "₱" + Number(n).toLocaleString("en-PH");
export const totalFromBooking = (b) =>
  b.service.price + b.addons.reduce((s, a) => s + a.price, 0);

// ─── Legend Item ───────────────────────────────────────────────────────────────
export const Leg = ({ color, label, pattern }) => (
  <div className="flex items-center gap-1.5">
    <span className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center" style={{ background: pattern ? undefined : color, border: pattern ? `2px solid ${color}` : undefined }}>
      {pattern && <span className="w-1.5 h-1.5 rounded-sm" style={{ background: color }} />}
    </span>
    <span className="text-[11px]" style={{ color: "#7a3a42" }}>{label}</span>
  </div>
);

// ─── Label helpers ──────────────────────────────────────────────────────────────
export const LBL = ({ children }) => (
  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#7a3a42" }}>{children}</label>
);
export const INP = ({ ...props }) => (
  <input className="w-full px-3.5 py-2 rounded-lg text-sm border outline-none focus:border-[#A30A24] focus:ring-2 focus:ring-[#A30A24]/10 transition-all"
    style={{ borderColor: "#e5d5d8", background: "#fdfafa" }} {...props} />
);

export const Row = ({ label, sub, configKey, icon }) => (
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

// ─── Utilities ─────────────────────────────────────────────────────────────────
export const pad = (n) => String(n).padStart(2, "0");
export const toKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
export const parseKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
};
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const IC = {
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
export const ALL_TIMES = [
  "06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM",
  "06:00 PM","07:00 PM","08:00 PM",
];

// ─── Date Utilities ───────────────────────────────────────────────────────────
export const TODAY_D = new Date();
TODAY_D.setHours(0, 0, 0, 0);

export const fmt = (d) => {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};
export const TODAY = fmt(TODAY_D);
export const parseD = (s) => { if (!s) return null; const [y, m, d] = s.split("-").map(Number); const dt = new Date(y, m - 1, d); dt.setHours(0, 0, 0, 0); return dt; };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const isPast = (s) => { const d = parseD(s); return d && d < TODAY_D; };
export const isToday = (s) => s === TODAY;
export const displayDate = (s) => { if (!s) return ""; return parseD(s).toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); };
export const displayShort = (s) => { if (!s) return ""; return parseD(s).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }); };

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const TIME_OPTIONS = ["06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM"];

// ─── Seed Bookings ────────────────────────────────────────────────────────────
export const SEED = (() => {
  const rows = [
    [3,"Maria Santos","Bridal Package Deluxe","09:00 AM","Confirmed"],
    [5,"Ana Reyes","Debut Makeup","02:00 PM","Pending"],
    [7,"Liza Cruz","Everyday Glam","11:00 AM","Confirmed"],
    [7,"Rachel Kim","Special Occasion","03:00 PM","Confirmed"],
    [10,"Jenny Park","Bridal Package Deluxe","08:00 AM","Confirmed"],
    [12,"Rose Tan","SDE / Film Shoot","10:00 AM","Pending"],
    [14,"Clara Wong","Everyday Glam","01:00 PM","Confirmed"],
    [18,"Diana Lee","Special Occasion","09:00 AM","Confirmed"],
    [21,"Patricia Gomez","Debut Makeup","11:00 AM","Pending"],
    [25,"Sophia Chen","Bridal Package Deluxe","08:00 AM","Confirmed"],
    [28,"Emma Torres","Everyday Glam","02:00 PM","Confirmed"],
    [33,"Iris Nava","SDE / Film Shoot","03:00 PM","Confirmed"],
    [40,"Carla Reyes","Special Occasion","10:00 AM","Pending"],
    [45,"Mia Santos","Bridal Package Deluxe","09:00 AM","Confirmed"],
  ];
  return rows.map(([off, customer, service, time, status], i) => ({
    id: `BK-${String(i + 1).padStart(4, "0")}`,
    date: fmt(addDays(TODAY_D, off)),
    customer, service, time, status,
  }));
})();

export const I = {
  prev: "M15 18l-6-6 6-6",
  next: "M9 18l6-6-6-6",
  close: "M18 6L6 18M6 6l12 12",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  unlock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0 19.9-1",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM2 12h2M20 12h2M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41",
  logo: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  dash: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z",
  menu: "M3 12h18M3 6h18M3 18h18",
};

// ─── Status Badges ────────────────────────────────────────────────────────────
export const SB = { Confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200", Pending: "bg-amber-100 text-amber-700 border border-amber-200" };
export const SD = { Confirmed: "bg-emerald-500", Pending: "bg-amber-400" };

export const STRIPE_SOFT = "repeating-linear-gradient(45deg,#ede0e2,#ede0e2 2px,#f8f1f2 2px,#f8f1f2 8px)";
export const STRIPE_HARD = "repeating-linear-gradient(45deg,#c5a5aa,#c5a5aa 2.5px,#d8b5ba 2.5px,#d8b5ba 8px)";

export const inp = "w-full px-3 py-2 rounded-lg text-xs border outline-none transition-all focus:border-[#A30A24] focus:ring-1 focus:ring-[#A30A24]/20";
export const inpSty = { borderColor: "#e5d5d8", background: "#fdfafa" };

export const getCellBg = (ds, status, sel) => {
    if (!ds) return "#fafafa";
    if (status === "past") return "#faf7f7";
    if (status === "blocked-manual") return null; // uses gradient
    if (isBlocked(status)) return null; // uses gradient
    if (sel) return "#A30A24";
    if (isToday(ds)) return "#fff";
    const bk = bookingsByDate[ds] || [];
    if (bk.length > 0) return "#FEF0F2";
    if (timeBlocks.some(t => t.date === ds)) return "#fffbf0";
    return "#fff";
};
  
export const isBlocked = (s) => s.startsWith("blocked");
export const isOverridable = (s) => ["blocked-range","blocked-dayoff","blocked-weekend"].includes(s);

export const durLabel = (mins) => {
  const opt = DURATION_OPTIONS.find(o => o.value === mins);
  return opt ? opt.label : `${mins} min`;
};

export const DURATION_OPTIONS = [
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

export const EMPTY_PKG = {
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

export const labelCls = "block text-[10px] font-bold mb-1 uppercase tracking-wider";
export const labelSty = { color: "#7a3a42" };

export const ACCENT_COLORS = [
  "#A30A24","#7a0a1e","#c41a3a","#b91c1c","#c2410c",
  "#b45309","#15803d","#0e7490","#1d4ed8","#7c3aed",
];