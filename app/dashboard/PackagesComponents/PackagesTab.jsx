"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { fetchPackages } from "@/lib/postgres/api";

import {
  Ic,
    I,
    durLabel,
  EMPTY_PKG,
} from "../data/compData";

import DeleteModal from "./DeleteModal";
import PackageCard from "./PackageCard";
import PackageForm from "./PackageForm";

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Seed Data ────────────────────────────────────────────────────────────────


// ─── Main Export ──────────────────────────────────────────────────────────────
export default function PackagesTab() {
  const [navOpen, setNavOpen] = useState(true);
  const [packages, setPackages] = useState([]);
  const [editing, setEditing] = useState(null);       // null | pkg object (new pkg has id:"")
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterActive, setFilterActive] = useState("all"); // "all" | "active" | "inactive"
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ text: "", ok: true });

  useEffect(() => {
  async function loadPackages() {
    const data = await fetchPackages();
    setPackages(data);
  }

  loadPackages();
}, []);

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

const handleSave = (savedPkg) => {
  setPackages(prev => {
    const exists = prev.some(p => p.id === savedPkg.id);

    if (exists) {
      return prev.map(p => (p.id === savedPkg.id ? savedPkg : p));
    } else {
      return [savedPkg, ...prev]; // add to top
    }
  });

  flash(
    savedPkg.id ? "Package updated successfully." : "Package created successfully."
  );

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
