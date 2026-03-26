"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  DAYS_SHORT,
  TODAY,
  TODAY_D,
  // SEED,
  parseD,
  addDays,
  MONTH_NAMES,
  Ic,
  I,
  displayDate,
  displayShort,
  SB,
  SD,
} from "../data/compData";
import Toggle from "./Toggle";

// Generate unique IDs for ranges/blocks
const uid = () => Math.random().toString(36).substr(2, 9);

// Time options for time blocks
const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const h = Math.floor(i / 4);
  const m = (i % 4) * 15;
  const hour = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? "AM" : "PM";
  const min = m.toString().padStart(2, "0");
  return `${hour}:${min} ${ampm}`;
});

export default function CalendarTab() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [rightTab, setRightTab] = useState("day");

  const [bookings, setBookings] = useState([]);

  // Availability
  const [weekendsBlocked, setWeekendsBlocked] = useState(true);
  const [dayOffsBlocked, setDayOffsBlocked] = useState(new Set());
  const [blockedDates, setBlockedDates] = useState(new Set());
  const [openDates, setOpenDates] = useState(new Set());
  const [blockedRanges, setBlockedRanges] = useState([
    { id: "r1", start: formatDate(addDays(TODAY_D, 35)), end: formatDate(addDays(TODAY_D, 38)), label: "Out of Town" },
  ]);
  const [timeBlocks, setTimeBlocks] = useState([
    { id: "t1", date: formatDate(addDays(TODAY_D, 7)), startTime: "12:00 PM", endTime: "01:30 PM", label: "Lunch Break" },
  ]);

  // Form
  const [blockMode, setBlockMode] = useState("date");
  const [blockDate, setBlockDate] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [rangeLabel, setRangeLabel] = useState("");
  const [timeDate, setTimeDate] = useState("");
  const [timeStart, setTimeStart] = useState("12:00 PM");
  const [timeEnd, setTimeEnd] = useState("01:00 PM");
  const [timeLabel, setTimeLabel] = useState("");
  const [msg, setMsg] = useState({ text: "", ok: true });

  const flash = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg({ text: "", ok: true }), 2800); };

  // --- Helpers ---
  function formatDate(d) {
    const dt = typeof d === "string" ? new Date(d) : d;
    const tzOffset = dt.getTimezoneOffset() * 60000;
    return new Date(dt - tzOffset).toISOString().split("T")[0]; // YYYY-MM-DD local
  }

  const isPast = (d) => formatDate(d) < formatDate(TODAY_D);
  const isToday = (d) => formatDate(d) === formatDate(TODAY_D);

  // Bookings map
  const bookingsByDate = useMemo(() => {
  const m = {};
  bookings.forEach(b => {
    (m[b.date] = m[b.date] || []).push(b);
  });
  return m;
}, [bookings]);

  useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings"); // your backend endpoint
      const data = await res.json();

      const normalized = data.map(b => ({
        ...b,
        date: formatDate(b.date), // fix timezone issues
      }));

      setBookings(normalized);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  fetchBookings();
}, []);


  // ----------------------------
  // Date status
  // ----------------------------
  const getStatus = useCallback(
    (s) => {
      if (!s) return "available";

      const d = parseD(s);
      if (!d) return "available";

      const dow = d.getDay();

      if (isPast(s) && !isToday(s)) return "past";
      if (blockedDates.has(s)) return "blocked-manual";

      const inRange = blockedRanges.find((r) => s >= r.start && s <= r.end);
      if (inRange && !openDates.has(s)) return "blocked-range";

      if (dayOffsBlocked.has(dow) && !openDates.has(s)) return "blocked-dayoff";

      if (weekendsBlocked && (dow === 0 || dow === 6) && !openDates.has(s))
        return "blocked-weekend";

      return "available";
    },
    [
      blockedDates,
      blockedRanges,
      openDates,
      dayOffsBlocked,
      weekendsBlocked,
      isPast,
      isToday,
      parseD
    ]
  );

  const isBlocked = (s) => s.startsWith("blocked");
  const isOverridable = (s) =>
    ["blocked-range", "blocked-dayoff", "blocked-weekend"].includes(s);

  // ----------------------------
  // Calendar cells
  // ----------------------------
  const calDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const cells = [];

    // Empty slots before first day
    for (let i = 0; i < first.getDay(); i++) cells.push(null);

    // Days of the month
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(formatDate(new Date(viewYear, viewMonth, d)));
    }

    // Fill last week to complete 7 days
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [viewYear, viewMonth, formatDate]); // include formatDate here


  const prevMonth = () => viewMonth === 0 ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0), setViewYear(y => y + 1)) : setViewMonth(m => m + 1);
  const goToday = () => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); setSelectedDate(formatDate(TODAY_D)); };

  const handleDayClick = (ds) => { if (!ds) return; if (getStatus(ds) === "past") return; setSelectedDate(ds); setRightTab("day"); };

  // Block actions
  const addBlockDate = () => { if (!blockDate) return flash("Please select a date.", false); if (isPast(blockDate)) return flash("Cannot block a past date.", false); setBlockedDates(p => new Set([...p, blockDate])); setOpenDates(p => { const s = new Set(p); s.delete(blockDate); return s; }); setBlockDate(""); flash("Date blocked successfully."); };
  const addBlockRange = () => { if (!rangeStart || !rangeEnd) return flash("Fill both dates.", false); if (rangeStart > rangeEnd) return flash("Start must be before end.", false); setBlockedRanges(p => [...p, { id: uid(), start: rangeStart, end: rangeEnd, label: rangeLabel || "Blocked Range" }]); setRangeStart(""); setRangeEnd(""); setRangeLabel(""); flash("Date range blocked."); };
  const addTimeBlock = () => { if (!timeDate) return flash("Please select a date.", false); if (isPast(timeDate)) return flash("Cannot block a past date.", false); setTimeBlocks(p => [...p, { id: uid(), date: timeDate, startTime: timeStart, endTime: timeEnd, label: timeLabel || "Time Block" }]); setTimeDate(""); setTimeLabel(""); flash("Time block added."); };
  const removeBlockedDate = (d) => setBlockedDates(p => { const s = new Set(p); s.delete(d); return s; });
  const removeRange = (id) => setBlockedRanges(p => p.filter(r => r.id !== id));
  const removeTimeBlock = (id) => setTimeBlocks(p => p.filter(t => t.id !== id));
  const openDate = (d) => setOpenDates(p => new Set([...p, d]));
  const closeDate = (d) => setOpenDates(p => { const s = new Set(p); s.delete(d); return s; });
  const manualBlock = (d) => { setBlockedDates(p => new Set([...p, d])); setOpenDates(p => { const s = new Set(p); s.delete(d); return s; }); };
  const toggleDayOff = (i) => setDayOffsBlocked(p => { const s = new Set(p); s.has(i) ? s.delete(i) : s.add(i); return s; });

  // Cell rendering
  const getCellBg = (ds, status, sel) => {
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

  const STRIPE_SOFT = "repeating-linear-gradient(45deg,#ede0e2,#ede0e2 2px,#f8f1f2 2px,#f8f1f2 8px)";
  const STRIPE_HARD = "repeating-linear-gradient(45deg,#c5a5aa,#c5a5aa 2.5px,#d8b5ba 2.5px,#d8b5ba 8px)";

  const inp = "w-full px-3 py-2 rounded-lg text-xs border outline-none transition-all focus:border-[#A30A24] focus:ring-1 focus:ring-[#A30A24]/20";
  const inpSty = { borderColor: "#e5d5d8", background: "#fdfafa" };

  // Selected date data
  const selStatus = getStatus(selectedDate);
  const selBookings = bookingsByDate[selectedDate] || [];
  const selTimeBlocks = timeBlocks.filter(t => t.date === selectedDate);
  const selRange = blockedRanges.find(r => selectedDate >= r.start && selectedDate <= r.end);
  const selIsOpen = openDates.has(selectedDate);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f0f1", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      {/* ─── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Calendar column */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <header className="flex items-center justify-between px-7 py-4 bg-white border-b shrink-0" style={{ borderColor: "#ede0e2" }}>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>Calendar</h1>
              <p className="text-xs mt-0.5" style={{ color: "#9a6a72" }}>Manage availability &amp; view bookings</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={goToday} className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-red-50"
                style={{ borderColor: "#A30A24", color: "#A30A24" }}>Today</button>
              <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#e0d0d2", background: "#fff" }}>
                <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center hover:bg-red-50 transition-colors" style={{ color: "#A30A24" }}>
                  <Ic d={I.prev} size={14} sw={2.5} />
                </button>
                <span className="px-2 text-sm font-bold min-w-[148px] text-center" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center hover:bg-red-50 transition-colors" style={{ color: "#A30A24" }}>
                  <Ic d={I.next} size={14} sw={2.5} />
                </button>
              </div>
            </div>
          </header>

          {/* Legend */}
          <div className="flex items-center gap-4 px-7 py-2 bg-white border-b shrink-0 flex-wrap" style={{ borderColor: "#ede0e2" }}>
            {[
              { color: "#fff", label: "Available", border: "#e5d5d8" },
              { color: "#FEF0F2", label: "Has Bookings", border: "#f5cdd4" },
              { gradient: STRIPE_SOFT, label: "Soft Block (Weekend / Day-off)" },
              { gradient: STRIPE_HARD, label: "Hard Block (Manual)" },
              { color: "#A30A24", label: "Selected / Today" },
              { color: "#fffbf0", label: "Time Block", border: "#fde68a" },
              { color: "#faf7f7", label: "Past (locked)", opacity: 0.5 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "#7a4a50" }}>
                <div className="w-3.5 h-3.5 rounded flex-shrink-0"
                  style={{ background: item.gradient || item.color, border: `1px solid ${item.border || "rgba(0,0,0,0.1)"}`, opacity: item.opacity || 1 }} />
                {item.label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)", border: "1.5px solid #f0e0e3" }}>

              {/* Day headers */}
              <div className="grid grid-cols-7 border-b" style={{ borderColor: "#f5eaec", background: "#fdf5f6" }}>
                {DAYS_SHORT.map((d, i) => (
                  <div key={d} className="py-3 text-center text-xs font-bold uppercase tracking-widest"
                    style={{ color: (i === 0 || i === 6) ? "#c05070" : "#9a6a72" }}>{d}
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: "minmax(80px, 1fr)" }}>
                {calDays.map((ds, idx) => {
                  if (!ds) return <div key={`b${idx}`} style={{ borderRight: "1px solid #f8f0f1", borderBottom: "1px solid #f8f0f1", background: "#fafafa" }} />;

                  const status = getStatus(ds);
                  const sel = ds === selectedDate;
                  const bks = bookingsByDate[ds] || [];
                  const hasTB = timeBlocks.some(t => t.date === ds);
                  const isOpen = openDates.has(ds);
                  const bg = getCellBg(ds, status, sel);
                  const isPastDay = status === "past";
                  const dow = parseD(ds)?.getDay();

                  const cellStyle = {
                    position: "relative",
                    cursor: isPastDay ? "not-allowed" : "pointer",
                    padding: "8px 8px 24px",
                    borderRight: "1px solid #f8f0f1",
                    borderBottom: "1px solid #f8f0f1",
                    transition: "all 0.12s",
                    ...(bg ? { background: bg } : {}),
                    ...(status === "blocked-manual" ? { backgroundImage: STRIPE_HARD } : {}),
                    ...(isBlocked(status) && status !== "blocked-manual" ? { backgroundImage: STRIPE_SOFT } : {}),
                    ...(isPastDay ? { opacity: 0.45 } : {}),
                    ...(sel ? { boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.3)" } : {}),
                    ...(isToday(ds) && !sel ? { outline: "2.5px solid #A30A24", outlineOffset: "-2px" } : {}),
                  };

                  const numColor = sel ? "#fff"
                    : isPastDay ? "#b0909a"
                    : isBlocked(status) ? "#9a7075"
                    : (dow === 0 || dow === 6) ? "#c05070"
                    : isToday(ds) ? "#A30A24"
                    : "#1a0a0d";

                  return (
                    <div key={ds} style={cellStyle} onClick={() => handleDayClick(ds)} className="group">
                      {/* Date number + badges */}
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-bold leading-none" style={{ color: numColor, fontFamily: "'Georgia',serif" }}>
                          {parseInt(ds.split("-")[2])}
                        </span>
                        <div className="flex flex-col items-end gap-0.5">
                          {isToday(ds) && !sel && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded leading-none" style={{ background: "#A30A24", color: "#fff" }}>TODAY</span>
                          )}
                          {isOpen && (
                            <span className="text-[8px] font-bold px-1 py-0.5 rounded leading-none" style={{ background: "#059669", color: "#fff" }}>OPEN</span>
                          )}
                        </div>
                      </div>

                      {/* Block label */}
                      {isBlocked(status) && !isToday(ds) && (
                        <p className="text-[9px] font-semibold mt-0.5 leading-tight" style={{ color: "#8a5560" }}>
                          {status === "blocked-manual" ? "Blocked" : status === "blocked-weekend" ? "Weekend" : status === "blocked-dayoff" ? "Day Off" : "Range"}
                        </p>
                      )}

                      {/* Time block indicator */}
                      {hasTB && !isBlocked(status) && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f59e0b" }} />
                          <span className="text-[8px] font-semibold" style={{ color: sel ? "rgba(255,255,255,0.8)" : "#b45309" }}>Time block</span>
                        </div>
                      )}

                      {/* Booking dots */}
                      {bks.length > 0 && !isBlocked(status) && (
                        <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-0.5 flex-wrap px-2">
                          {bks.slice(0, 3).map(b => (
                            <span key={b.id} className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: b.status === "Confirmed" ? "#10b981" : "#f59e0b" }} />
                          ))}
                          {bks.length > 3 && <span className="text-[8px] font-bold" style={{ color: sel ? "rgba(255,255,255,0.85)" : "#A30A24" }}>+{bks.length - 3}</span>}
                          <span className="w-full text-center text-[8px]" style={{ color: sel ? "rgba(255,255,255,0.75)" : "#9a6a72" }}>
                            {bks.length} bk{bks.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}

                      {/* Hover glow */}
                      {!isPastDay && !isBlocked(status) && !sel && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          style={{ background: "rgba(163,10,36,0.05)" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Panel ─────────────────────────────────────────────────────── */}
        <aside className="w-80 shrink-0 flex flex-col overflow-hidden bg-white border-l" style={{ borderColor: "#ede0e2" }}>

          {/* Tabs */}
          <div className="flex border-b shrink-0" style={{ borderColor: "#ede0e2" }}>
            {[{id:"day",label:"Day Detail",ic:I.calendar},{id:"manage",label:"Availability",ic:I.settings}].map(t => (
              <button key={t.id} onClick={() => setRightTab(t.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold transition-all border-b-2"
                style={{ borderColor: rightTab===t.id?"#A30A24":"transparent", color: rightTab===t.id?"#A30A24":"#9a6a72", background: rightTab===t.id?"#fdf5f6":"transparent" }}>
                <Ic d={t.ic} size={13} /> {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* ── DAY DETAIL ── */}
            {rightTab === "day" && (
              <div className="p-5 space-y-5">

                {/* Date card */}
                <div className="rounded-xl p-4" style={{ background: "#FEF0F2" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#A30A24" }}>Selected Date</p>
                  <p className="font-bold text-sm leading-snug" style={{ color: "#1a0a0d", fontFamily: "'Georgia',serif" }}>{displayDate(selectedDate)}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {isToday(selectedDate) && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ background: "#A30A24" }}>Today</span>}
                    {selStatus === "past" && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#f0e0e3", color: "#9a6a72" }}>Past</span>}
                    {isBlocked(selStatus) && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">Blocked</span>}
                    {!isBlocked(selStatus) && !isPast(selectedDate) && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700">Available</span>}
                    {selIsOpen && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700">Opened</span>}
                  </div>
                </div>

                {/* Block reason */}
                {isBlocked(selStatus) && (
                  <div className="rounded-xl p-3.5 flex gap-2.5 items-start" style={{ background: "#fff7f7", border: "1px solid #fcd4d8" }}>
                    <Ic d={I.lock} size={14} stroke="#A30A24" sw={2} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#A30A24" }}>
                        {selStatus === "blocked-manual" ? "Manually Blocked"
                          : selStatus === "blocked-weekend" ? "Weekend (Blocked)"
                          : selStatus === "blocked-dayoff" ? `${DAY_NAMES[parseD(selectedDate)?.getDay()]} (Day Off)`
                          : `Range: ${selRange?.label || "Blocked"}`}
                      </p>
                      {selRange && <p className="text-[10px] mt-0.5" style={{ color: "#9a6a72" }}>{displayShort(selRange.start)} — {displayShort(selRange.end)}</p>}
                      {isOverridable(selStatus) && !selIsOpen && (
                        <p className="text-[10px] mt-1" style={{ color: "#b0707a" }}>You can open this day as an exception.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick actions */}
                {!isPast(selectedDate) && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7a4a50" }}>Quick Actions</p>
                    <div className="flex flex-col gap-2">
                      {!isBlocked(selStatus) && (
                        <button onClick={() => manualBlock(selectedDate)}
                          className="w-full py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 hover:bg-red-50 transition-colors"
                          style={{ borderColor: "#A30A24", color: "#A30A24" }}>
                          <Ic d={I.lock} size={12} sw={2.5} /> Block This Day
                        </button>
                      )}
                      {selStatus === "blocked-manual" && (
                        <button onClick={() => removeBlockedDate(selectedDate)}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5"
                          style={{ background: "#059669" }}>
                          <Ic d={I.unlock} size={12} sw={2.5} stroke="#fff" /> Unblock Day
                        </button>
                      )}
                      {isOverridable(selStatus) && !selIsOpen && (
                        <button onClick={() => openDate(selectedDate)}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5"
                          style={{ background: "#059669" }}>
                          <Ic d={I.unlock} size={12} sw={2.5} stroke="#fff" /> Open This Day (Exception)
                        </button>
                      )}
                      {selIsOpen && (
                        <button onClick={() => closeDate(selectedDate)}
                          className="w-full py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 hover:bg-red-50 transition-colors"
                          style={{ borderColor: "#dc2626", color: "#dc2626" }}>
                          <Ic d={I.lock} size={12} sw={2.5} /> Re-block Day
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Bookings */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#7a4a50" }}>
                    Bookings ({selBookings.length})
                  </p>
                  {selBookings.length === 0
                    ? <div className="text-center py-6 rounded-xl" style={{ background: "#fdfafa", border: "1px dashed #e5d5d8" }}>
                        <Ic d={I.calendar} size={22} stroke="#d4a0a8" sw={1.5} />
                        <p className="text-xs mt-1.5" style={{ color: "#b0707a" }}>No bookings this day</p>
                      </div>
                    : <div className="space-y-2">
                        {selBookings.map(b => (
                          <div key={b.id} className="rounded-xl p-3" style={{ background: "#fdfafa", border: "1px solid #f0e0e3" }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: "#FEF0F2", color: "#A30A24" }}>{b.id}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${SB[b.status] || ""}`}>
                                <span className={`w-1 h-1 rounded-full ${SD[b.status] || "bg-gray-400"}`} />{b.status}
                              </span>
                            </div>
                            <p className="text-xs font-bold" style={{ color: "#1a0a0d" }}> {typeof b.customer === "object"
    ? b.customer?.name
    : b.customer}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: "#9a6a72" }}> {typeof b.service === "object"
    ? b.service?.title
    : b.service}</p>
                            <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: "#b0707a" }}>
                              <Ic d={I.clock} size={10} stroke="#b0707a" sw={2} /> {b.time}
                            </p>
                          </div>
                        ))}
                      </div>
                  }
                </div>

                {/* Time blocks on this day */}
                {selTimeBlocks.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#7a4a50" }}>Time Blocks</p>
                    <div className="space-y-2">
                      {selTimeBlocks.map(t => (
                        <div key={t.id} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "#92400e" }}>{t.label}</p>
                            <p className="text-[10px]" style={{ color: "#b45309" }}>{t.startTime} — {t.endTime}</p>
                          </div>
                          <button onClick={() => removeTimeBlock(t.id)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-amber-100 transition-colors" style={{ color: "#b45309" }}>
                            <Ic d={I.close} size={11} sw={2.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── AVAILABILITY MANAGEMENT ── */}
            {rightTab === "manage" && (
              <div className="p-5 space-y-6">

                {/* Working days */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#7a4a50" }}>Working Days</p>
                  <p className="text-[10px] mb-3" style={{ color: "#9a6a72" }}>Tap a day to toggle it as a recurring day off.</p>
                  <div className="grid grid-cols-7 gap-1">
                    {DAYS_SHORT.map((day, i) => {
                      const isOff = dayOffsBlocked.has(i);
                      const isWknd = i === 0 || i === 6;
                      return (
                        <button key={day} onClick={() => toggleDayOff(i)}
                          className="flex flex-col items-center py-1.5 rounded-lg text-[10px] font-bold transition-all"
                          style={{ background: isOff ? "#A30A24" : isWknd ? "#fef0f2" : "#fdfafa", color: isOff ? "#fff" : isWknd ? "#c05070" : "#7a4a50", border: `1.5px solid ${isOff ? "#A30A24" : "#e5d5d8"}` }}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <hr style={{ borderColor: "#f0e0e3" }} />

                {/* Weekend toggle */}
                <div className="flex items-center justify-between rounded-xl p-3.5" style={{ background: "#fdf5f6", border: "1px solid #f0d8db" }}>
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#1a0a0d" }}>Block Weekends</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#9a6a72" }}>Sat &amp; Sun closed by default</p>
                  </div>
                  <Toggle on={weekendsBlocked} onChange={() => setWeekendsBlocked(v => !v)} />
                </div>

                <hr style={{ borderColor: "#f0e0e3" }} />

                {/* Add Block */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#7a4a50" }}>Add Block</p>

                  {/* Mode tabs */}
                  <div className="flex rounded-xl overflow-hidden border mb-4" style={{ borderColor: "#e0d0d2" }}>
                    {[["date","📅 Date"],["range","📆 Range"],["time","🕐 Time"]].map(([mode, label]) => (
                      <button key={mode} onClick={() => { setBlockMode(mode); setMsg({text:"",ok:true}); }}
                        className="flex-1 py-2 text-[10px] font-bold transition-all"
                        style={{ background: blockMode===mode?"#A30A24":"#fdfafa", color: blockMode===mode?"#fff":"#9a6a72" }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Date form */}
                  {blockMode === "date" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#7a3a42" }}>Select Date *</label>
                        <input type="date" className={inp} style={inpSty} value={blockDate} min={TODAY} onChange={e => setBlockDate(e.target.value)} />
                      </div>
                      <button onClick={addBlockDate} className="w-full py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:opacity-90"
                        style={{ background: "#A30A24" }}>
                        <Ic d={I.lock} size={12} sw={2.5} stroke="#fff" /> Block This Date
                      </button>
                    </div>
                  )}

                  {/* Range form */}
                  {blockMode === "range" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#7a3a42" }}>From *</label>
                          <input type="date" className={inp} style={inpSty} value={rangeStart} min={TODAY} onChange={e => setRangeStart(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#7a3a42" }}>To *</label>
                          <input type="date" className={inp} style={inpSty} value={rangeEnd} min={rangeStart || TODAY} onChange={e => setRangeEnd(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#7a3a42" }}>Label</label>
                        <input className={inp} style={inpSty} placeholder="e.g. Vacation, Holiday" value={rangeLabel} onChange={e => setRangeLabel(e.target.value)} />
                      </div>
                      <button onClick={addBlockRange} className="w-full py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:opacity-90"
                        style={{ background: "#A30A24" }}>
                        <Ic d={I.lock} size={12} sw={2.5} stroke="#fff" /> Block Range
                      </button>
                    </div>
                  )}

                  {/* Time form */}
                  {blockMode === "time" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#7a3a42" }}>Date *</label>
                        <input type="date" className={inp} style={inpSty} value={timeDate} min={TODAY} onChange={e => setTimeDate(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#7a3a42" }}>From</label>
                          <select className={inp} style={inpSty} value={timeStart} onChange={e => setTimeStart(e.target.value)}>
                            {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#7a3a42" }}>To</label>
                          <select className={inp} style={inpSty} value={timeEnd} onChange={e => setTimeEnd(e.target.value)}>
                            {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#7a3a42" }}>Label</label>
                        <input className={inp} style={inpSty} placeholder="e.g. Lunch Break, Reserved" value={timeLabel} onChange={e => setTimeLabel(e.target.value)} />
                      </div>
                      <button onClick={addTimeBlock} className="w-full py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:opacity-90"
                        style={{ background: "#f59e0b" }}>
                        <Ic d={I.clock} size={12} sw={2.5} stroke="#fff" /> Add Time Block
                      </button>
                    </div>
                  )}

                  {msg.text && (
                    <div className="mt-2 text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: msg.ok ? "#d1fae5" : "#fee2e2", color: msg.ok ? "#059669" : "#dc2626" }}>
                      {msg.ok ? "✓ " : "⚠ "}{msg.text}
                    </div>
                  )}
                </div>

                <hr style={{ borderColor: "#f0e0e3" }} />

                {/* Active blocks list */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#7a4a50" }}>
                    Active Blocks ({blockedDates.size + blockedRanges.length + timeBlocks.length + openDates.size})
                  </p>

                  {blockedDates.size === 0 && blockedRanges.length === 0 && timeBlocks.length === 0 && openDates.size === 0
                    ? <p className="text-xs text-center py-4" style={{ color: "#b0707a" }}>No active blocks or exceptions</p>
                    : <div className="space-y-2">

                        {/* Manual date blocks */}
                        {[...blockedDates].sort().map(d => (
                          <div key={d} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#fff7f7", border: "1px solid #fcd4d8" }}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#A30A24" }} />
                              <div>
                                <p className="text-[10px] font-bold" style={{ color: "#A30A24" }}>Manual Block</p>
                                <p className="text-[10px]" style={{ color: "#9a6a72" }}>{displayShort(d)}</p>
                              </div>
                            </div>
                            <button onClick={() => removeBlockedDate(d)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-100" style={{ color: "#A30A24" }}>
                              <Ic d={I.close} size={11} sw={2.5} />
                            </button>
                          </div>
                        ))}

                        {/* Range blocks */}
                        {blockedRanges.map(r => (
                          <div key={r.id} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#fff7f7", border: "1px solid #fcd4d8" }}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-7 rounded-full flex-shrink-0" style={{ background: "#A30A24" }} />
                              <div>
                                <p className="text-[10px] font-bold" style={{ color: "#A30A24" }}>{r.label}</p>
                                <p className="text-[10px]" style={{ color: "#9a6a72" }}>{displayShort(r.start)} → {displayShort(r.end)}</p>
                              </div>
                            </div>
                            <button onClick={() => removeRange(r.id)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-100" style={{ color: "#A30A24" }}>
                              <Ic d={I.close} size={11} sw={2.5} />
                            </button>
                          </div>
                        ))}

                        {/* Time blocks */}
                        {timeBlocks.map(t => (
                          <div key={t.id} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#f59e0b" }} />
                              <div>
                                <p className="text-[10px] font-bold" style={{ color: "#92400e" }}>{t.label}</p>
                                <p className="text-[10px]" style={{ color: "#b45309" }}>{displayShort(t.date)} · {t.startTime}–{t.endTime}</p>
                              </div>
                            </div>
                            <button onClick={() => removeTimeBlock(t.id)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-amber-100" style={{ color: "#b45309" }}>
                              <Ic d={I.close} size={11} sw={2.5} />
                            </button>
                          </div>
                        ))}

                        {/* Opened exceptions */}
                        {[...openDates].sort().map(d => (
                          <div key={d} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#059669" }} />
                              <div>
                                <p className="text-[10px] font-bold" style={{ color: "#059669" }}>Exception (Opened)</p>
                                <p className="text-[10px]" style={{ color: "#065f46" }}>{displayShort(d)}</p>
                              </div>
                            </div>
                            <button onClick={() => closeDate(d)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-green-100" style={{ color: "#059669" }}>
                              <Ic d={I.close} size={11} sw={2.5} />
                            </button>
                          </div>
                        ))}
                      </div>
                  }
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
