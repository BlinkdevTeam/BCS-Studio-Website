"use client";

import React, { useState, useEffect } from "react";
import { parseLocalDateTime, formatDateTime } from "../../../utils/dateUtils";
import {
  SEED_BOOKINGS,
  Icon,
  Icons,
  fmtPrice,
  STATUS_STYLES,
  STATUS_DOT,
} from "../data/compData";
import StatCard from "./StatCard";
import Modal from "./Modal";
import BookingForm from "./BookingForm";
import ViewBooking from "./ViewBooking";
import DeleteConfirm from "./DeleteConfirm";

import CalendarTab from "../CalendarComponents/CalendarTab";

// ── Helper to format date + time ──


// ─── Main Dashboard ─────────────────────────────────────────────────────────────
export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        const normalized = data.map((b) => ({
          ...b,
          customerName: b.customer?.name || "Unknown",
          customerEmail: b.customer?.email || "",
          serviceTitle: b.service?.title || "Service",
        }));

        setBookings(normalized);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null); // { type: "create"|"edit"|"view"|"delete", booking? }
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Bookings");

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      b.customer.name.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.service.title.toLowerCase().includes(q);
    const matchS = statusFilter === "All" || b.status === statusFilter;
    return matchQ && matchS;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    revenue: bookings
      .filter((b) => b.status !== "Cancelled")
      .reduce((s, b) => s + b.totalPrice, 0),
  };

  const closeModal = () => setModal(null);

  const handleCreate = (data) => {
    setBookings((prev) => [...prev, { ...data, id: uid(), proof: null }]);
    closeModal();
  };

  const handleEdit = (data) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === modal.booking.id ? { ...b, ...data, id: b.id } : b,
      ),
    );
    closeModal();
  };

  const handleDelete = () => {
    setBookings((prev) => prev.filter((b) => b.id !== modal.booking.id));
    closeModal();
  };

  // ── Update booking status ──
  const updateBookingStatus = async (id, newStatus) => {
    const previous = bookings;

    try {
      // optimistic update
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );

      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
      console.error(err);

      // rollback
      setBookings(previous);

      alert("Failed to update booking status");
    }
  };

  return (
    <div
      className="flex h-screen font-sans overflow-hidden"
      style={{
        background: "#f7f0f1",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? 240 : 68,
          background: "#A30A24",
          color: "#fff",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Icon d={Icons.logo} size={18} stroke="#fff" strokeWidth={2} />
          </div>
          {sidebarOpen && (
            <div>
              <p
                className="font-bold text-sm leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                StudioRed
              </p>
              <p className="text-xs opacity-60">Booking Manager</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {[
            { label: "Bookings", icon: Icons.bookings },
            { label: "Calendar", icon: Icons.calendar },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background:
                  activeTab === item.label
                    ? "rgba(255,255,255,0.18)"
                    : "transparent",
                color:
                  activeTab === item.label ? "#fff" : "rgba(255,255,255,0.65)",
              }}
            >
              <Icon d={item.icon} size={16} strokeWidth={2} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="mx-2 mb-4 flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-colors"
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <Icon d={sidebarOpen ? Icons.close : Icons.filter} size={14} />
          {sidebarOpen && "Collapse"}
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {activeTab === "Calendar" ? (
            // CalendarTab bookings prop mapping
<CalendarTab
  bookings={bookings.map((b) => {
    const dt = parseLocalDateTime(b.date, b.time);

    return {
      id: b.id,
      status: b.status,
      customer: b.customer?.name || "Unknown",
      service: b.service?.title || "Service",
      date: dt.toISOString().slice(0, 10), // YYYY-MM-DD
      time: dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  })}
/>
          ) : (
            <div className="space-y-6">
              <div
                className="flex items-center justify-between px-7 py-4 bg-white border-b"
                style={{ borderColor: "#ede0e2" }}
              >
                <div>
                  <h1
                    className="text-xl font-bold"
                    style={{ color: "#1a0a0d", fontFamily: "'Georgia', serif" }}
                  >
                    Bookings
                  </h1>
                  <p className="text-xs mt-0.5" style={{ color: "#9a6a72" }}>
                    Manage all your customer bookings
                  </p>
                </div>
                <button
                  onClick={() => setModal({ type: "create" })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                  style={{ background: "#A30A24" }}
                >
                  <Icon d={Icons.plus} size={15} strokeWidth={2.5} />
                  New Booking
                </button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard
                  label="Total Bookings"
                  value={stats.total}
                  sub="All time"
                  iconPath={Icons.bookings}
                  accent
                />
                <StatCard
                  label="Confirmed"
                  value={stats.confirmed}
                  sub="Active bookings"
                  iconPath={Icons.check}
                />
                <StatCard
                  label="Pending"
                  value={stats.pending}
                  sub="Awaiting confirmation"
                  iconPath={Icons.calendar}
                />
                <StatCard
                  label="Revenue"
                  value={fmtPrice(stats.revenue)}
                  sub="Confirmed + Pending"
                  iconPath={Icons.money}
                />
              </div>

              {/* Table Card */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  border: "1px solid #f0e0e3",
                }}
              >
                {/* Filters */}
                <div
                  className="flex items-center gap-3 px-6 py-4 border-b"
                  style={{ borderColor: "#f5eaec" }}
                >
                  <div className="relative flex-1 max-w-xs">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#b0707a" }}
                    >
                      <Icon d={Icons.search} size={14} />
                    </span>
                    <input
                      className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: "#fdfafa",
                        border: "1.5px solid #e5d5d8",
                      }}
                      placeholder="Search bookings…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {["All", "Confirmed", "Pending", "Cancelled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={
                          statusFilter === s
                            ? { background: "#A30A24", color: "#fff" }
                            : {
                                background: "#fdfafa",
                                color: "#7a3a42",
                                border: "1.5px solid #e5d5d8",
                              }
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <span
                    className="ml-auto text-xs"
                    style={{ color: "#9a6a72" }}
                  >
                    {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#fdf5f6" }}>
                        {[
                          "Booking ID",
                          "Customer",
                          "Service",
                          "Schedule",
                          "Total",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider"
                            style={{ color: "#b0707a" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-16 text-sm"
                            style={{ color: "#b0707a" }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Icon
                                d={Icons.bookings}
                                size={28}
                                stroke="#d4a0a8"
                                strokeWidth={1.5}
                              />
                              No bookings found
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((b, i) => (
                          <tr
                            key={b.id}
                            className="border-t transition-colors hover:bg-red-50/40"
                            style={{ borderColor: "#f5eaec" }}
                          >
                            <td className="px-6 py-4">
                              <span
                                className="font-mono text-xs font-bold px-2 py-1 rounded"
                                style={{
                                  background: "#FEF0F2",
                                  color: "#A30A24",
                                }}
                              >
                                {b.id}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                  style={{ background: "#A30A24" }}
                                >
                                  {(b.customer?.name || b.customer || "?")[0]}
                                </div>
                                <div>
                                  <p
                                    className="font-semibold text-xs"
                                    style={{ color: "#1a0a0d" }}
                                  >
                                    {b.customer?.name ||
                                      b.customer ||
                                      "Unknown"}
                                  </p>
                                  <p
                                    className="text-xs"
                                    style={{ color: "#9a6a72" }}
                                  >
                                    {b.customer?.email || "-"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p
                                className="font-medium text-xs"
                                style={{ color: "#1a0a0d" }}
                              >
                                {b.service.title}
                              </p>
                              {b.addons.length > 0 && (
                                <p
                                  className="text-xs mt-0.5"
                                  style={{ color: "#9a6a72" }}
                                >
                                  {b.addons.length} add-on
                                  {b.addons.length > 1 ? "s" : ""}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4">
  <p className="text-xs font-medium" style={{ color: "#1a0a0d" }}>
    {formatDateTime(parseLocalDateTime(b.date, b.time))}
  </p>
</td>
                            <td className="px-6 py-4">
                              <span
                                className="font-bold text-xs"
                                style={{
                                  color: "#A30A24",
                                  fontFamily: "'Georgia', serif",
                                }}
                              >
                                {fmtPrice(b.totalPrice)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_STYLES[b.status]}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`}
                                />
                                {b.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    setModal({ type: "view", booking: b })
                                  }
                                  title="View"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                                  style={{ color: "#A30A24" }}
                                >
                                  <Icon d={Icons.eye} size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    setModal({ type: "edit", booking: b })
                                  }
                                  title="Edit"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
                                  style={{ color: "#2563eb" }}
                                >
                                  <Icon d={Icons.edit} size={14} />
                                </button>
                                {/* ── New Confirm / Cancel buttons ── */}
                                {b.status !== "Confirmed" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateBookingStatus(b.id, "Confirmed")
                                    }
                                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                                    title="Mark as Confirmed"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {b.status !== "Cancelled" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateBookingStatus(b.id, "Cancelled")
                                    }
                                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    title="Mark as Cancelled"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
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
          <BookingForm
            initial={modal.booking}
            onSave={handleEdit}
            onCancel={closeModal}
          />
        </Modal>
      )}
      {modal?.type === "view" && (
        <Modal title="Booking Details" onClose={closeModal}>
          <ViewBooking booking={modal.booking} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <Modal title="Confirm Deletion" onClose={closeModal}>
          <DeleteConfirm
            booking={modal.booking}
            onConfirm={handleDelete}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
