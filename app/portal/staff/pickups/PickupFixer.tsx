"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EDIT_OPTIONS } from "@/lib/staff/pickup-config";

/* Columns of an `App Pickups` row (formatted, as the API returns them). */
const C = { stamp: 0, date: 1, client: 2, location: 3, waste: 4, bin: 5, kg: 6, notes: 7 } as const;

type Row = { row: number; values: string[] };
type Draft = {
  pickupDate: string; // YYYY-MM-DD
  client: string;
  wasteType: string;
  location: string;
  binNumber: string;
  kg: string;
  notes: string;
};

const PAGE = 40;
const CLIENTS = Object.keys(EDIT_OPTIONS);

const toISO = (nz: string) => {
  const m = nz.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
};
const draftOf = (r: Row): Draft => ({
  pickupDate: toISO(r.values[C.date]),
  client: r.values[C.client],
  wasteType: r.values[C.waste],
  location: r.values[C.location],
  binNumber: r.values[C.bin],
  kg: r.values[C.kg],
  notes: r.values[C.notes],
});
/** Options for a field, always including the value the row already has. */
const withCurrent = (opts: string[] | undefined, current: string) =>
  current && !(opts ?? []).includes(current) ? [current, ...(opts ?? [])] : opts ?? [];

async function fetchRows(): Promise<Row[]> {
  const res = await fetch("/api/staff/pickup/rows", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Couldn't load pickups.");
  return data.rows;
}

const fieldLabel = "block text-xs font-semibold text-soil/60 mb-1";
const inputBase =
  "w-full rounded-lg border border-soil/20 bg-white px-3 py-2 text-[15px] text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20";

export default function PickupFixer({ staffEmail }: { staffEmail: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(
    () =>
      fetchRows().then(
        (r) => {
          setLoadError("");
          setRows(r);
        },
        (e) => setLoadError(e instanceof Error ? e.message : "Couldn't load pickups.")
      ),
    []
  );

  useEffect(() => {
    let alive = true;
    fetchRows().then(
      (r) => alive && setRows(r),
      (e) => alive && setLoadError(e instanceof Error ? e.message : "Couldn't load pickups.")
    );
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(
    () => (rows ?? []).filter((r) => !filter || r.values[C.client] === filter),
    [rows, filter]
  );

  // One card per logged visit (same timestamp + client), newest first.
  const groups = useMemo(() => {
    const out: { key: string; rows: Row[] }[] = [];
    for (const r of visible.slice(0, shown)) {
      const key = `${r.values[C.stamp]}|${r.values[C.client]}`;
      const last = out[out.length - 1];
      if (last?.key === key) last.rows.push(r);
      else out.push({ key, rows: [r] });
    }
    return out;
  }, [visible, shown]);

  function startEdit(r: Row) {
    setEditing(r.row);
    setDraft(draftOf(r));
    setError("");
    setNotice("");
  }

  function cancel() {
    setEditing(null);
    setDraft(null);
    setError("");
  }

  async function send(method: "PATCH" | "DELETE", r: Row, payload: object = {}) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/staff/pickup/rows", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row: r.row, expected: r.values, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        if (res.status === 409) await load();
        return false;
      }
      setNotice(
        method === "DELETE"
          ? "Pickup deleted. Website totals update in about a minute."
          : "Saved. Website totals update in about a minute."
      );
      cancel();
      await load();
      return true;
    } catch {
      setError("Network error. Please check your connection and try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function save(r: Row) {
    if (!draft) return;
    send("PATCH", r, draft);
  }

  function remove(r: Row) {
    const v = r.values;
    const label = `${v[C.kg]} kg · ${v[C.waste]} · ${v[C.client]} · ${v[C.date]}`;
    if (!window.confirm(`Delete this pickup?\n\n${label}\n\nThis removes it from the sheet and the website totals.`)) return;
    setNotice("");
    send("DELETE", r);
  }

  const opts = draft ? EDIT_OPTIONS[draft.client] : undefined;

  return (
    <div className="min-h-screen bg-offwhite">
      <header className="bg-green-deep text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/portal/staff" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <Image src="/logos/hungry-worms.png" alt="Hungry Worms" width={28} height={28} className="size-7 object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block font-display font-bold text-sm">Fix a pickup</span>
              <span className="block text-white/45 text-xs">Staff Portal</span>
            </span>
          </Link>
          <Link href="/portal/staff/pickup" className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors">
            Log a pickup
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <h1 className="font-display text-2xl font-extrabold text-green-deep">Recent pickups</h1>
        <p className="mt-1 text-sm text-soil/60 leading-relaxed">
          Everything logged with the app, newest first. Tap <strong>Edit</strong> to correct a weight,
          date, client or bin, or <strong>Delete</strong> to remove a pickup logged by mistake.
          {staffEmail && <> Signed in as <strong className="text-soil/80">{staffEmail}</strong>.</>}
        </p>

        <div className="mt-5">
          <label className={fieldLabel} htmlFor="filter">Client</label>
          <select
            id="filter"
            className={inputBase}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setShown(PAGE);
            }}
          >
            <option value="">All clients</option>
            {[...new Set([...CLIENTS, ...(rows ?? []).map((r) => r.values[C.client])])].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {notice && (
          <p className="mt-5 rounded-xl border border-green-primary/30 bg-green-primary/10 px-4 py-3 text-sm font-semibold text-green-deep" role="status">
            {notice}
          </p>
        )}
        {error && !editing && (
          <p className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>
        )}

        {loadError && (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {loadError}{" "}
            <button onClick={load} className="font-bold underline">Try again</button>
          </div>
        )}
        {!rows && !loadError && <p className="mt-8 text-sm text-soil/50">Loading pickups…</p>}
        {rows && visible.length === 0 && <p className="mt-8 text-sm text-soil/50">No pickups logged with the app yet.</p>}

        <div className="mt-6 space-y-4">
          {groups.map((g) => {
            const head = g.rows[0].values;
            const total = g.rows.reduce((s, r) => s + (parseFloat(r.values[C.kg]) || 0), 0);
            return (
              <section key={g.key + g.rows[0].row} className="rounded-2xl bg-white border border-soil/10 shadow-[var(--shadow-card)] overflow-hidden">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-offwhite px-4 py-3">
                  <h2 className="font-display font-bold text-green-deep">
                    {head[C.date]} · {head[C.client]}
                  </h2>
                  <span className="text-xs text-soil/50">
                    {Math.round(total * 10) / 10} kg · logged {head[C.stamp]}
                  </span>
                </div>
                <ul className="divide-y divide-soil/5">
                  {g.rows.map((r) => {
                    const v = r.values;
                    const isEditing = editing === r.row && draft;
                    if (!isEditing) {
                      return (
                        <li key={r.row} className="flex items-center gap-3 px-4 py-3">
                          <div className="min-w-0 flex-1 text-sm">
                            <span className="font-semibold text-soil">{v[C.kg]} kg</span>
                            <span className="text-soil/60"> · {[v[C.waste], v[C.location], v[C.bin]].filter(Boolean).join(" · ")}</span>
                            {v[C.notes] && <span className="block truncate text-xs text-soil/45">{v[C.notes]}</span>}
                          </div>
                          <button
                            onClick={() => startEdit(r)}
                            disabled={busy || editing !== null}
                            className="rounded-lg border border-green-primary/30 px-3 py-1.5 text-xs font-bold text-green-primary hover:bg-green-primary/10 disabled:opacity-40"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => remove(r)}
                            disabled={busy || editing !== null}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </li>
                      );
                    }
                    return (
                      <li key={r.row} className="bg-green-primary/5 px-4 py-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className={fieldLabel}>Pickup date</label>
                            <input type="date" className={inputBase} value={draft.pickupDate}
                              onChange={(e) => setDraft({ ...draft, pickupDate: e.target.value })} />
                          </div>
                          <div>
                            <label className={fieldLabel}>Weight (kg)</label>
                            <input type="number" inputMode="decimal" step="0.1" min="0" className={inputBase} value={draft.kg}
                              onChange={(e) => setDraft({ ...draft, kg: e.target.value })} />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={fieldLabel}>Client</label>
                            <select className={inputBase} value={draft.client}
                              onChange={(e) => {
                                const next = EDIT_OPTIONS[e.target.value];
                                setDraft({
                                  ...draft,
                                  client: e.target.value,
                                  wasteType: next?.waste.includes(draft.wasteType) ? draft.wasteType : next?.waste[0] ?? "",
                                  location: next?.location.includes(draft.location) ? draft.location : next?.location[0] ?? "",
                                  binNumber: next?.bin.includes(draft.binNumber) ? draft.binNumber : next?.bin[0] ?? "",
                                });
                              }}>
                              {withCurrent(CLIENTS, v[C.client]).map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={fieldLabel}>Waste type</label>
                            <select className={inputBase} value={draft.wasteType}
                              onChange={(e) => setDraft({ ...draft, wasteType: e.target.value })}>
                              {withCurrent(opts?.waste, draft.client === v[C.client] ? v[C.waste] : "").map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          {(opts?.location.length || draft.location) ? (
                            <div>
                              <label className={fieldLabel}>Location</label>
                              <select className={inputBase} value={draft.location}
                                onChange={(e) => setDraft({ ...draft, location: e.target.value })}>
                                {withCurrent(opts?.location, draft.client === v[C.client] ? v[C.location] : "").map((o) => <option key={o} value={o}>{o}</option>)}
                              </select>
                            </div>
                          ) : null}
                          {(opts?.bin.length || draft.binNumber) ? (
                            <div>
                              <label className={fieldLabel}>Bin size</label>
                              <select className={inputBase} value={draft.binNumber}
                                onChange={(e) => setDraft({ ...draft, binNumber: e.target.value })}>
                                {withCurrent(opts?.bin, draft.client === v[C.client] ? v[C.bin] : "").map((o) => <option key={o} value={o}>{o}</option>)}
                              </select>
                            </div>
                          ) : null}
                          <div className="sm:col-span-2">
                            <label className={fieldLabel}>Note</label>
                            <input type="text" className={inputBase} value={draft.notes} maxLength={500}
                              onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
                          </div>
                        </div>
                        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => save(r)} disabled={busy}
                            className="flex-1 rounded-xl bg-green-primary py-2.5 text-sm font-bold text-white hover:bg-green-deep disabled:opacity-50">
                            {busy ? "Saving…" : "Save changes"}
                          </button>
                          <button onClick={cancel} disabled={busy}
                            className="rounded-xl border border-soil/20 px-4 py-2.5 text-sm font-semibold text-soil/70 hover:bg-white">
                            Cancel
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        {visible.length > shown && (
          <button onClick={() => setShown((n) => n + PAGE)}
            className="mt-6 w-full rounded-xl border border-soil/15 bg-white py-3 text-sm font-semibold text-soil/70 hover:bg-offwhite">
            Show older pickups
          </button>
        )}

        <p className="mt-8 text-xs text-soil/45 leading-relaxed">
          Only pickups logged with this app appear here. Older entries from the Google Form or the
          historical records are still fixed in the Google Sheet.
        </p>
      </main>
    </div>
  );
}
