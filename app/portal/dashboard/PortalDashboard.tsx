"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { PortalData, WasteRow } from "@/lib/data/portal";
import Icon from "@/app/components/Icon";

type Period = "month" | "year" | "all" | "custom";

const GREEN = "#1F8A4C";
const GREEN_DEEP = "#0F5132";
const GREEN_LEAF = "#7FB800";
const CTA = "#E07A2F";
const SOIL = "#2B2A26";

const WASTE_COLORS = [GREEN, GREEN_LEAF, CTA, "#60A5FA", "#A78BFA", "#F472B6"];

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-NZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function isoToDisplay(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

function monthKey(date: string) {
  return date.slice(0, 7); // "YYYY-MM"
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("en-NZ", {
    month: "short", year: "2-digit",
  });
}

function exportCSV(rows: WasteRow[], clientName: string) {
  const header = "Pickup Date,Location/Site,Waste Type,Bin Number,Weight (kg),CO₂e Avoided (kg),Car Equiv (1 yr)";
  const lines = rows.map((r) =>
    [
      isoToDisplay(r.pickup_date),
      r.location_site ?? "",
      r.waste_type ?? "",
      r.bin_number ?? "",
      r.weight_kg,
      r.co2e_kg,
      r.car_equiv_year.toFixed(4),
    ].join(",")
  );
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${clientName.replace(/\s+/g, "-")}-impact-report.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PortalDashboard({ data }: { data: PortalData }) {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [sortCol, setSortCol] = useState<keyof WasteRow>("pickup_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");

  // ── Filter rows by period ────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    const now = new Date();
    return data.rows.filter((r) => {
      const d = new Date(r.pickup_date);
      if (period === "month")
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      if (period === "year") return d.getFullYear() === now.getFullYear();
      if (period === "custom") {
        if (customFrom && d < new Date(customFrom)) return false;
        if (customTo && d > new Date(customTo)) return false;
        return true;
      }
      return true; // "all"
    });
  }, [data.rows, period, customFrom, customTo]);

  // ── KPI aggregates ───────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const wasteKg = filteredRows.reduce((s, r) => s + r.weight_kg, 0);
    const co2eKg = filteredRows.reduce((s, r) => s + r.co2e_kg, 0);
    const carsYear = filteredRows.reduce((s, r) => s + r.car_equiv_year, 0);
    const allWaste = data.rows.reduce((s, r) => s + r.weight_kg, 0);
    const allCO2e = data.rows.reduce((s, r) => s + r.co2e_kg, 0);
    return { wasteKg, co2eKg, carsYear, allWaste, allCO2e, pickups: filteredRows.length };
  }, [filteredRows, data.rows]);

  // ── Monthly bar chart data ───────────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((r) => {
      const k = monthKey(r.pickup_date);
      map.set(k, (map.get(k) ?? 0) + r.weight_kg);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({ month: monthLabel(k), kg: Math.round(v) }));
  }, [filteredRows]);

  // ── Cumulative CO₂e area chart ───────────────────────────────────────────
  const cumulativeData = useMemo(() => {
    let running = 0;
    return filteredRows.map((r) => {
      running += r.co2e_kg;
      return { date: r.pickup_date.slice(0, 7), co2e: Math.round(running) };
    });
  }, [filteredRows]);

  // ── Waste by type donut ──────────────────────────────────────────────────
  const wasteByType = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((r) => {
      const k = r.waste_type ?? "Other";
      map.set(k, (map.get(k) ?? 0) + r.weight_kg);
    });
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [filteredRows]);

  // ── Table: sort + search ─────────────────────────────────────────────────
  const tableRows = useMemo(() => {
    let rows = [...filteredRows];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.pickup_date.includes(q) ||
          r.waste_type?.toLowerCase().includes(q) ||
          r.location_site?.toLowerCase().includes(q) ||
          r.bin_number?.toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) => {
      const av = a[sortCol] ?? "";
      const bv = b[sortCol] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [filteredRows, search, sortCol, sortDir]);

  function toggleSort(col: keyof WasteRow) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("desc"); }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal");
  }

  const periodLabel = period === "month" ? "this month" : period === "year" ? "this year" : "since we started";

  return (
    <div className="min-h-screen bg-offwhite">

      {/* ── Portal header ─────────────────────────────────────────────── */}
      <header className="bg-green-deep text-white sticky top-0 z-40 shadow-md print:static">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Image src="/logos/hungry-worms.png" alt="Hungry Worms" width={28} height={28} className="size-7 object-contain" />
              </span>
              <span className="font-display font-bold text-sm hidden sm:block">Hungry Worms</span>
            </Link>
            <span className="text-white/40 text-sm hidden sm:block">/</span>
            <span className="text-white font-semibold text-sm truncate">Impact Dashboard</span>
            <span className="text-white/50 text-xs truncate hidden md:block">· {data.clientName}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => exportCSV(filteredRows, data.clientName)}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              ⬇ CSV
            </button>
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              🖨 PDF
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Period selector ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          {(["month", "year", "all", "custom"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                period === p
                  ? "bg-green-primary text-white shadow-sm"
                  : "bg-white border border-soil/15 text-soil/70 hover:border-green-primary hover:text-green-primary"
              }`}
            >
              {p === "month" ? "This month" : p === "year" ? "This year" : p === "all" ? "Since start" : "Custom range"}
            </button>
          ))}
          {period === "custom" && (
            <div className="flex items-center gap-2 ml-2">
              <input type="date" lang="en-NZ" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-lg border border-soil/20 px-3 py-1.5 text-xs text-soil bg-white focus:border-green-primary focus:outline-none" />
              <span className="text-soil/40 text-xs">to</span>
              <input type="date" lang="en-NZ" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-lg border border-soil/20 px-3 py-1.5 text-xs text-soil bg-white focus:border-green-primary focus:outline-none" />
            </div>
          )}
        </div>

        {/* ── KPI cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Waste diverted", value: fmt(kpis.wasteKg), unit: "kg", icon: "🗑️", color: "border-green-primary/20 bg-green-primary/5" },
            { label: "CO₂e avoided", value: fmt(kpis.co2eKg), unit: "kg CO₂e", icon: "🌿", color: "border-green-leaf/30 bg-green-leaf/5" },
            { label: "Cars off road", value: fmt(kpis.carsYear, 1), unit: "per year", icon: "🚗", color: "border-cta/20 bg-cta/5" },
            { label: "Collections", value: fmt(kpis.pickups), unit: "pickups", icon: "🚛", color: "border-soil/10 bg-white" },
          ].map(({ label, value, unit, icon, color }) => (
            <div key={label} className={`rounded-2xl border ${color} p-5 sm:p-6`}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-xs font-semibold text-soil/50 uppercase tracking-widest">{label}</div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-soil mt-1">{value}</div>
              <div className="text-xs text-soil/40 mt-0.5">{unit}</div>
            </div>
          ))}
        </div>

        {/* ── Narrative summary ──────────────────────────────────────────── */}
        <div className="rounded-2xl bg-green-deep text-white px-7 py-5">
          <p className="text-sm leading-relaxed">
            <span className="font-bold">{data.clientName}</span> has diverted{" "}
            <span className="font-bold text-green-leaf">{fmt(kpis.allWaste)} kg</span> of food &amp; organic
            waste from landfill in total, avoiding{" "}
            <span className="font-bold text-green-leaf">{fmt(kpis.allCO2e)} kg CO₂e</span> — like taking{" "}
            <span className="font-bold text-green-leaf">{fmt(kpis.allCO2e / 4600, 1)} cars</span> off the road for a year.
            {data.firstPickupDate && (
              <> Service started <span className="font-semibold">{isoToDisplay(data.firstPickupDate)}</span>.</>
            )}
          </p>
        </div>

        {/* ── Charts row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Monthly bar */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-soil/10 p-6 shadow-sm">
            <h2 className="font-display font-bold text-soil text-base mb-4">Monthly waste recycled (kg)</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: SOIL }} />
                  <YAxis tick={{ fontSize: 11, fill: SOIL }} />
                  <Tooltip formatter={(v) => [`${fmt(Number(v))} kg`, "Waste"]} />
                  <Bar dataKey="kg" fill={GREEN} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-soil/40 text-center py-16">No data for this period</p>
            )}
          </div>

          {/* Waste by type donut */}
          <div className="rounded-2xl bg-white border border-soil/10 p-6 shadow-sm">
            <h2 className="font-display font-bold text-soil text-base mb-4">Waste by type</h2>
            {wasteByType.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={wasteByType} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                      dataKey="value" paddingAngle={2}>
                      {wasteByType.map((_, i) => (
                        <Cell key={i} fill={WASTE_COLORS[i % WASTE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${fmt(Number(v))} kg`]} />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="space-y-1.5 mt-2">
                  {wasteByType.slice(0, 5).map(({ name, value }, i) => (
                    <li key={name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full shrink-0" style={{ background: WASTE_COLORS[i % WASTE_COLORS.length] }} />
                        <span className="text-soil/70 truncate max-w-[120px]">{name}</span>
                      </div>
                      <span className="font-semibold text-soil">{fmt(value)} kg</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-soil/40 text-center py-16">No data for this period</p>
            )}
          </div>
        </div>

        {/* Cumulative CO₂e area chart */}
        <div className="rounded-2xl bg-white border border-soil/10 p-6 shadow-sm">
          <h2 className="font-display font-bold text-soil text-base mb-4">Cumulative CO₂e avoided (kg)</h2>
          {cumulativeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={cumulativeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="co2grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: SOIL }} />
                <YAxis tick={{ fontSize: 11, fill: SOIL }} />
                <Tooltip formatter={(v) => [`${fmt(Number(v))} kg CO₂e`, "Cumulative"]} />
                <Area type="monotone" dataKey="co2e" stroke={GREEN} strokeWidth={2} fill="url(#co2grad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-soil/40 text-center py-10">No data for this period</p>
          )}
        </div>

        {/* ── Collection log table ───────────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-soil/10 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-soil/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display font-bold text-soil text-base">Collection log</h2>
            <div className="flex items-center gap-2">
              <input
                type="search"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-soil/20 px-3 py-1.5 text-xs text-soil bg-offwhite focus:border-green-primary focus:outline-none w-40"
              />
              <button
                onClick={() => exportCSV(tableRows, data.clientName)}
                className="rounded-lg border border-green-primary/30 px-3 py-1.5 text-xs font-semibold text-green-primary hover:bg-green-primary/5 transition-colors"
              >
                ⬇ Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-offwhite border-b border-soil/10">
                <tr>
                  {(
                    [
                      { key: "pickup_date", label: "Date" },
                      { key: "location_site", label: "Location" },
                      { key: "waste_type", label: "Type" },
                      { key: "bin_number", label: "Bin" },
                      { key: "weight_kg", label: "Weight (kg)" },
                      { key: "co2e_kg", label: "CO₂e (kg)" },
                    ] as { key: keyof WasteRow; label: string }[]
                  ).map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="px-4 py-3 text-left text-xs font-bold text-soil/60 uppercase tracking-widest cursor-pointer select-none hover:text-green-primary transition-colors"
                    >
                      {label}
                      {sortCol === key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-soil/5">
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-soil/40">
                      No records found
                    </td>
                  </tr>
                ) : (
                  tableRows.map((r) => (
                    <tr key={r.id} className="hover:bg-green-primary/3 transition-colors">
                      <td className="px-4 py-3 text-soil/80 whitespace-nowrap">{isoToDisplay(r.pickup_date)}</td>
                      <td className="px-4 py-3 text-soil/70">{r.location_site ?? "—"}</td>
                      <td className="px-4 py-3 text-soil/70">{r.waste_type ?? "—"}</td>
                      <td className="px-4 py-3 text-soil/70">{r.bin_number ?? "—"}</td>
                      <td className="px-4 py-3 font-semibold text-soil">{fmt(r.weight_kg)}</td>
                      <td className="px-4 py-3 text-green-primary font-semibold">{fmt(r.co2e_kg)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-soil/10 flex justify-between text-xs text-soil/40">
            <span>Showing {tableRows.length} of {filteredRows.length} records</span>
            <span>You&apos;re viewing only <strong className="text-soil/60">{data.clientName}</strong> data. Updated live from Hungry Worms.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
