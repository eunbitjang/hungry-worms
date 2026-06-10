"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { StaffOverviewData, StaffWasteRow } from "@/lib/data/staff-overview";

type Period = "month" | "year" | "all" | "custom";

const GREEN = "#1F8A4C";
const GREEN_LEAF = "#7FB800";
const CTA = "#E07A2F";
const SOIL = "#2B2A26";
const WASTE_COLORS = [GREEN, GREEN_LEAF, CTA, "#60A5FA", "#A78BFA", "#F472B6"];

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-NZ", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function isoToDisplay(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}
function monthKey(date: string) {
  return date.slice(0, 7);
}
function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("en-NZ", { month: "short", year: "2-digit" });
}

function exportCSV(rows: StaffWasteRow[]) {
  const header = "Client,Pickup Date,Location/Site,Waste Type,Bin Number,Weight (kg),CO₂e Avoided (kg),Car Equiv (1 yr)";
  const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const lines = rows.map((r) =>
    [
      esc(r.clientName),
      isoToDisplay(r.pickup_date),
      esc(r.location_site ?? ""),
      esc(r.waste_type ?? ""),
      esc(r.bin_number ?? ""),
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
  a.download = "hungry-worms-all-clients-impact.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function StaffOverview({ data }: { data: StaffOverviewData }) {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<"clientName" | keyof StaffWasteRow>("pickup_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // ── Period filter ─────────────────────────────────────────────────────────
  const periodRows = useMemo(() => {
    const now = new Date();
    return data.rows.filter((r) => {
      const d = new Date(r.pickup_date);
      if (period === "month") return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      if (period === "year") return d.getFullYear() === now.getFullYear();
      if (period === "custom") {
        if (customFrom && d < new Date(customFrom)) return false;
        if (customTo && d > new Date(customTo)) return false;
        return true;
      }
      return true;
    });
  }, [data.rows, period, customFrom, customTo]);

  // ── KPIs (period, all clients) ────────────────────────────────────────────
  const kpis = useMemo(() => {
    const wasteKg = periodRows.reduce((s, r) => s + r.weight_kg, 0);
    const co2eKg = periodRows.reduce((s, r) => s + r.co2e_kg, 0);
    const carsYear = periodRows.reduce((s, r) => s + r.car_equiv_year, 0);
    const activeClients = new Set(periodRows.map((r) => r.clientId)).size;
    return { wasteKg, co2eKg, carsYear, pickups: periodRows.length, activeClients };
  }, [periodRows]);

  // ── Per-client breakdown (period) ─────────────────────────────────────────
  const byClient = useMemo(() => {
    const map = new Map<string, { wasteKg: number; co2eKg: number; pickups: number }>();
    periodRows.forEach((r) => {
      const cur = map.get(r.clientName) ?? { wasteKg: 0, co2eKg: 0, pickups: 0 };
      cur.wasteKg += r.weight_kg;
      cur.co2eKg += r.co2e_kg;
      cur.pickups += 1;
      map.set(r.clientName, cur);
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.wasteKg - a.wasteKg);
  }, [periodRows]);
  const topClientKg = byClient[0]?.wasteKg ?? 0;

  // ── Monthly trend (all clients) ───────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    periodRows.forEach((r) => map.set(monthKey(r.pickup_date), (map.get(monthKey(r.pickup_date)) ?? 0) + r.weight_kg));
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({ month: monthLabel(k), kg: Math.round(v) }));
  }, [periodRows]);

  // ── Waste by type (all clients) ───────────────────────────────────────────
  const wasteByType = useMemo(() => {
    const map = new Map<string, number>();
    periodRows.forEach((r) => map.set(r.waste_type ?? "Other", (map.get(r.waste_type ?? "Other") ?? 0) + r.weight_kg));
    return Array.from(map.entries()).sort(([, a], [, b]) => b - a).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [periodRows]);

  // ── Collection log: client filter + search + sort ─────────────────────────
  const tableRows = useMemo(() => {
    let rows = clientFilter ? periodRows.filter((r) => r.clientName === clientFilter) : periodRows;
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.clientName.toLowerCase().includes(q) ||
          r.pickup_date.includes(q) ||
          r.waste_type?.toLowerCase().includes(q) ||
          r.location_site?.toLowerCase().includes(q) ||
          r.bin_number?.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortCol] ?? "";
      const bv = (b as Record<string, unknown>)[sortCol] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [periodRows, clientFilter, search, sortCol, sortDir]);

  function toggleSort(col: "clientName" | keyof StaffWasteRow) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("desc"); }
  }

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push("/portal");
  }

  const clientNames = useMemo(
    () => Array.from(new Set(data.rows.map((r) => r.clientName))).sort(),
    [data.rows]
  );

  const KPI_CARDS = [
    { label: "Waste diverted", value: fmt(kpis.wasteKg), unit: "kg", icon: "🗑️", color: "border-green-primary/20 bg-green-primary/5" },
    { label: "CO₂e avoided", value: fmt(kpis.co2eKg), unit: "kg CO₂e", icon: "🌿", color: "border-green-leaf/30 bg-green-leaf/5" },
    { label: "Cars off road", value: fmt(kpis.carsYear, 1), unit: "per year", icon: "🚗", color: "border-cta/20 bg-cta/5" },
    { label: "Collections", value: fmt(kpis.pickups), unit: "pickups", icon: "🚛", color: "border-soil/10 bg-white" },
    { label: "Active clients", value: fmt(kpis.activeClients), unit: `of ${data.totalClients}`, icon: "🏢", color: "border-soil/10 bg-white" },
  ];

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Header */}
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
            <span className="text-white font-semibold text-sm truncate">All Clients · Overview</span>
            <span className="rounded-full bg-green-leaf/20 px-2 py-0.5 text-[11px] font-bold text-green-leaf">STAFF</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/portal/staff/pickup"
              className="flex items-center gap-1.5 rounded-full bg-green-leaf px-3 py-1.5 text-xs font-bold text-soil hover:bg-white transition-colors"
            >
              ＋ Log a pickup
            </Link>
            <button onClick={() => exportCSV(tableRows)} className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors">
              ⬇ CSV
            </button>
            <button onClick={handleSignOut} className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Period selector */}
        <div className="flex flex-wrap items-center gap-2">
          {(["month", "year", "all", "custom"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                period === p ? "bg-green-primary text-white shadow-sm" : "bg-white border border-soil/15 text-soil/70 hover:border-green-primary hover:text-green-primary"
              }`}
            >
              {p === "month" ? "This month" : p === "year" ? "This year" : p === "all" ? "Since start" : "Custom range"}
            </button>
          ))}
          {period === "custom" && (
            <div className="flex items-center gap-2 ml-2">
              <input type="date" lang="en-NZ" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="rounded-lg border border-soil/20 px-3 py-1.5 text-xs text-soil bg-white focus:border-green-primary focus:outline-none" />
              <span className="text-soil/40 text-xs">to</span>
              <input type="date" lang="en-NZ" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="rounded-lg border border-soil/20 px-3 py-1.5 text-xs text-soil bg-white focus:border-green-primary focus:outline-none" />
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {KPI_CARDS.map(({ label, value, unit, icon, color }) => (
            <div key={label} className={`rounded-2xl border ${color} p-5`}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-xs font-semibold text-soil/50 uppercase tracking-widest">{label}</div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-soil mt-1">{value}</div>
              <div className="text-xs text-soil/40 mt-0.5">{unit}</div>
            </div>
          ))}
        </div>

        {/* Per-client breakdown */}
        <div className="rounded-2xl bg-white border border-soil/10 p-6 shadow-sm">
          <h2 className="font-display font-bold text-soil text-base mb-5">Waste diverted by client</h2>
          {byClient.length > 0 ? (
            <ul className="space-y-3.5">
              {byClient.map((c) => (
                <li key={c.name}>
                  <button
                    onClick={() => setClientFilter((cur) => (cur === c.name ? "" : c.name))}
                    className="w-full text-left group"
                    title="Filter the collection log to this client"
                  >
                    <div className="flex items-baseline justify-between gap-3 text-sm mb-1">
                      <span className={`font-semibold ${clientFilter === c.name ? "text-green-primary" : "text-soil"} group-hover:text-green-primary transition-colors`}>{c.name}</span>
                      <span className="shrink-0 text-soil/60">
                        <strong className="text-soil">{fmt(c.wasteKg)} kg</strong> · {fmt(c.co2eKg)} kg CO₂e · {c.pickups} pickups
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-offwhite overflow-hidden">
                      <div className="h-full rounded-full bg-green-primary group-hover:bg-green-deep transition-colors" style={{ width: `${topClientKg ? (c.wasteKg / topClientKg) * 100 : 0}%` }} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-soil/40 text-center py-10">No data for this period</p>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-soil/10 p-6 shadow-sm">
            <h2 className="font-display font-bold text-soil text-base mb-4">Monthly waste recycled — all clients (kg)</h2>
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

          <div className="rounded-2xl bg-white border border-soil/10 p-6 shadow-sm">
            <h2 className="font-display font-bold text-soil text-base mb-4">Waste by type</h2>
            {wasteByType.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={wasteByType} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                      {wasteByType.map((_, i) => (
                        <Cell key={i} fill={WASTE_COLORS[i % WASTE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${fmt(Number(v))} kg`]} />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="space-y-1.5 mt-2">
                  {wasteByType.slice(0, 6).map(({ name, value }, i) => (
                    <li key={name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full shrink-0" style={{ background: WASTE_COLORS[i % WASTE_COLORS.length] }} />
                        <span className="text-soil/70 truncate max-w-[140px]">{name}</span>
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

        {/* Collection log */}
        <div className="rounded-2xl bg-white border border-soil/10 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-soil/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display font-bold text-soil text-base">
              Collection log
              {clientFilter && (
                <button onClick={() => setClientFilter("")} className="ml-2 rounded-full bg-green-primary/10 px-2.5 py-0.5 text-xs font-semibold text-green-primary hover:bg-green-primary/20">
                  {clientFilter} ✕
                </button>
              )}
            </h2>
            <div className="flex items-center gap-2">
              <input type="search" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-lg border border-soil/20 px-3 py-1.5 text-xs text-soil bg-offwhite focus:border-green-primary focus:outline-none w-40" />
              <button onClick={() => exportCSV(tableRows)} className="rounded-lg border border-green-primary/30 px-3 py-1.5 text-xs font-semibold text-green-primary hover:bg-green-primary/5 transition-colors">
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
                      { key: "clientName", label: "Client" },
                      { key: "pickup_date", label: "Date" },
                      { key: "location_site", label: "Location" },
                      { key: "waste_type", label: "Type" },
                      { key: "bin_number", label: "Bin" },
                      { key: "weight_kg", label: "Weight (kg)" },
                      { key: "co2e_kg", label: "CO₂e (kg)" },
                    ] as { key: "clientName" | keyof StaffWasteRow; label: string }[]
                  ).map(({ key, label }) => (
                    <th key={key} onClick={() => toggleSort(key)} className="px-4 py-3 text-left text-xs font-bold text-soil/60 uppercase tracking-widest cursor-pointer select-none hover:text-green-primary transition-colors whitespace-nowrap">
                      {label}
                      {sortCol === key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-soil/5">
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-soil/40">No records found</td>
                  </tr>
                ) : (
                  tableRows.slice(0, 500).map((r) => (
                    <tr key={r.id} className="hover:bg-offwhite/60">
                      <td className="px-4 py-3 font-medium text-soil whitespace-nowrap">{r.clientName}</td>
                      <td className="px-4 py-3 text-soil/80 whitespace-nowrap">{isoToDisplay(r.pickup_date)}</td>
                      <td className="px-4 py-3 text-soil/70">{r.location_site || "—"}</td>
                      <td className="px-4 py-3 text-soil/70">{r.waste_type || "—"}</td>
                      <td className="px-4 py-3 text-soil/70">{r.bin_number || "—"}</td>
                      <td className="px-4 py-3 text-soil/80">{fmt(r.weight_kg, 1)}</td>
                      <td className="px-4 py-3 text-soil/80">{fmt(r.co2e_kg, 1)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {tableRows.length > 500 && (
            <p className="px-6 py-3 text-xs text-soil/45">Showing the first 500 of {fmt(tableRows.length)} rows — narrow the period or search, or export CSV for everything.</p>
          )}
        </div>
      </div>
    </div>
  );
}
