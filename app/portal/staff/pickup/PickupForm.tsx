"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PICKUP_CLIENTS,
  PICKUP_CLIENT_NAMES,
  type PickupBox,
} from "@/lib/staff/pickup-config";

/* ── helpers ──────────────────────────────────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, "0");
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const fmtStamp = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const isoToDisplay = (iso: string) => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
};
/** Stable per-form-fill id so a retried submit is de-duplicated server-side. */
const newRequestId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `rid-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/** What kind of selector (if any) a box carries. */
function selectorFor(box: PickupBox):
  | { kind: "waste" | "location" | "capacity"; options: string[] }
  | null {
  if (box.wasteOptions) return { kind: "waste", options: box.wasteOptions };
  if (box.locationOptions) return { kind: "location", options: box.locationOptions };
  if (box.capacityOptions) return { kind: "capacity", options: box.capacityOptions };
  return null;
}

type BoxState = { kg: string; select: string };
type SavedRow = {
  pickupDate: string;
  client: string;
  location: string;
  waste: string;
  bin: string;
  kg: number;
};
type Result = { rows: SavedRow[]; client: string; pickupDate: string; totalKg: number };

const card = "rounded-2xl bg-white border border-soil/10 p-4 sm:p-5 shadow-[var(--shadow-card)]";
const fieldLabel = "block text-xs font-semibold text-soil/60 mb-1.5";
const inputBase =
  "w-full rounded-lg border border-soil/20 bg-white px-3 py-2.5 text-[15px] text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20";

export default function PickupForm({ staffEmail }: { staffEmail: string }) {
  const [client, setClient] = useState("");
  const [manualOn, setManualOn] = useState(false);
  const [manualDate, setManualDate] = useState(todayISO());
  const [boxes, setBoxes] = useState<BoxState[]>([]);
  const [notes, setNotes] = useState("");
  const [stamp, setStamp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  // One id per form fill; reused across retries so the server can dedupe, and
  // regenerated only when a fresh pickup is started (see reset()).
  const [requestId, setRequestId] = useState(newRequestId);

  const cfg = client ? PICKUP_CLIENTS[client] : undefined;

  // Live device clock
  useEffect(() => {
    const tick = () => setStamp(fmtStamp(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  // Reset boxes whenever the client changes
  useEffect(() => {
    setError("");
    if (!cfg) {
      setBoxes([]);
      return;
    }
    setBoxes(
      cfg.boxes.map((b) => {
        const sel = selectorFor(b);
        return { kg: "", select: sel ? sel.options[0] : "" };
      })
    );
  }, [client]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = useMemo(
    () =>
      boxes.reduce((s, b) => {
        const v = parseFloat(b.kg);
        return !isNaN(v) && v > 0 ? s + v : s;
      }, 0),
    [boxes]
  );
  const filledCount = boxes.filter((b) => {
    const v = parseFloat(b.kg);
    return !isNaN(v) && v > 0;
  }).length;

  function updateBox(i: number, patch: Partial<BoxState>) {
    setBoxes((prev) => prev.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  }

  async function handleSubmit() {
    if (!cfg || filledCount === 0 || submitting) return;
    setSubmitting(true);
    setError("");

    const pickupDate = manualOn && manualDate ? manualDate : todayISO();
    const entries: {
      boxIndex: number;
      kg: number;
      waste?: string;
      location?: string;
      capacity?: string;
    }[] = [];

    boxes.forEach((b, i) => {
      const v = parseFloat(b.kg);
      if (isNaN(v) || v <= 0) return;
      const sel = selectorFor(cfg.boxes[i]);
      const entry: (typeof entries)[number] = { boxIndex: i, kg: v };
      if (sel?.kind === "waste") entry.waste = b.select;
      if (sel?.kind === "location") entry.location = b.select;
      if (sel?.kind === "capacity") entry.capacity = b.select;
      entries.push(entry);
    });

    try {
      const res = await fetch("/api/staff/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, pickupDate, notes, entries, requestId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Build the saved-rows summary for confirmation
      const storeName = cfg.store ?? client;
      const rows: SavedRow[] = [];
      boxes.forEach((b, i) => {
        const v = parseFloat(b.kg);
        if (isNaN(v) || v <= 0) return;
        const box = cfg.boxes[i];
        const sel = selectorFor(box);
        rows.push({
          pickupDate: isoToDisplay(pickupDate),
          client: storeName,
          location: sel?.kind === "location" ? b.select : "",
          waste: sel?.kind === "waste" ? b.select : box.waste ?? "",
          bin: sel?.kind === "capacity" ? b.select : "",
          kg: v,
        });
      });
      setResult({ rows, client: storeName, pickupDate: isoToDisplay(pickupDate), totalKg: data.totalKg });
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  function reset() {
    setResult(null);
    setSubmitting(false);
    setClient("");
    setBoxes([]);
    setNotes("");
    setManualOn(false);
    setManualDate(todayISO());
    setError("");
    setRequestId(newRequestId()); // fresh id for the next pickup
  }

  /* ── Success screen ─────────────────────────────────────────────────────── */
  if (result) {
    return (
      <div className="min-h-screen bg-offwhite">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="rounded-2xl border border-green-primary/30 bg-white shadow-[var(--shadow-card)] overflow-hidden">
            <div className="bg-green-primary/10 px-5 py-6 text-center">
              <div className="text-4xl">✅</div>
              <h2 className="mt-2 font-display text-xl font-extrabold text-green-deep">
                Pickup logged
              </h2>
              <p className="mt-1 text-sm text-soil/70">
                {result.rows.length} bin{result.rows.length === 1 ? "" : "s"} ·{" "}
                <strong>{result.totalKg} kg</strong> · {result.client} · {result.pickupDate}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-offwhite text-soil/55">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold">Waste Type</th>
                    <th className="px-3 py-2 text-left font-bold">Location</th>
                    <th className="px-3 py-2 text-left font-bold">Bin</th>
                    <th className="px-3 py-2 text-right font-bold">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soil/5">
                  {result.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-soil">{r.waste || "—"}</td>
                      <td className="px-3 py-2 text-soil/70">{r.location || "—"}</td>
                      <td className="px-3 py-2 text-soil/70">{r.bin || "—"}</td>
                      <td className="px-3 py-2 text-right font-semibold text-soil">{r.kg} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-5 py-3 text-xs text-soil/45">
              Saved to the Master Log. Need to fix something? Edit the row directly in the Google
              Sheet, or log a correction.
            </p>
          </div>

          <button
            onClick={reset}
            className="mt-4 w-full rounded-xl bg-green-primary py-3.5 text-[15px] font-bold text-white hover:bg-green-deep transition-colors"
          >
            Log another pickup
          </button>
          <div className="mt-3 text-center">
            <Link href="/portal/staff" className="text-sm font-semibold text-green-primary hover:underline">
              ← Back to Staff Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
        {/* Date / time */}
        <div className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className={fieldLabel} style={{ marginBottom: 2 }}>
                Pickup date · time (auto)
              </span>
              <span className="font-semibold text-soil">{stamp || "—"}</span>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-green-deep cursor-pointer select-none">
              <input
                type="checkbox"
                checked={manualOn}
                onChange={(e) => setManualOn(e.target.checked)}
                className="size-4 accent-green-primary"
              />
              Set a different date
            </label>
          </div>
          {manualOn && (
            <input
              type="date"
              lang="en-NZ"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              className={`${inputBase} mt-3`}
            />
          )}
        </div>

        {/* Client */}
        <div className={card}>
          <label htmlFor="client" className={fieldLabel}>
            Select client
          </label>
          <select
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className={`${inputBase} text-base`}
          >
            <option value="">— Select a client —</option>
            {PICKUP_CLIENT_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Boxes */}
        <div className={card}>
          {!cfg ? (
            <p className="py-6 text-center text-sm text-soil/50">
              Select a client to show the input fields.
            </p>
          ) : (
            <>
              {cfg.note && (
                <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                  {cfg.note}
                </p>
              )}
              <div className="divide-y divide-dashed divide-soil/15">
                {cfg.boxes.map((box, i) => {
                  const sel = selectorFor(box);
                  return (
                    <div key={i} className="flex flex-wrap items-center gap-2.5 py-2.5">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-offwhite text-xs font-semibold text-soil/55">
                        {i + 1}
                      </span>
                      {box.waste && (
                        <span className="rounded-full bg-green-primary/10 px-2.5 py-1 text-xs font-semibold text-green-deep whitespace-nowrap">
                          {box.waste}
                        </span>
                      )}
                      {sel && (
                        <select
                          value={boxes[i]?.select ?? sel.options[0]}
                          onChange={(e) => updateBox(i, { select: e.target.value })}
                          className={`${inputBase} flex-1 min-w-[130px] py-2`}
                          aria-label={`${sel.kind} for bin ${i + 1}`}
                        >
                          {sel.options.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      )}
                      <div className="relative w-[120px] shrink-0">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          value={boxes[i]?.kg ?? ""}
                          onChange={(e) => updateBox(i, { kg: e.target.value })}
                          className={`${inputBase} pr-9 text-right`}
                          aria-label={`Weight in kg for bin ${i + 1}`}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-soil/50">
                          kg
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg bg-offwhite px-4 py-3">
                <span className="text-sm text-soil/70">Today&apos;s pickup total</span>
                <span className="font-display text-xl font-extrabold text-green-deep">
                  {Math.round(total * 10) / 10} kg
                </span>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        {cfg && (
          <div className={card}>
            <label htmlFor="notes" className={fieldLabel}>
              Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. bin 3 heavier than usual, extra bin added, etc."
              className={inputBase}
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!cfg || filledCount === 0 || submitting}
          className="w-full rounded-xl bg-green-primary py-3.5 text-[15px] font-bold text-white hover:bg-green-deep disabled:bg-soil/25 disabled:cursor-not-allowed transition-colors"
        >
          {submitting
            ? "Saving…"
            : filledCount > 0
              ? `Save ${filledCount} bin${filledCount === 1 ? "" : "s"} · ${Math.round(total * 10) / 10} kg`
              : "Save pickup"}
        </button>
        <p className="text-center text-xs text-soil/45">
          Empty fields aren&apos;t saved (all optional). Fill at least one to save.
        </p>
      </div>
    </div>
  );
}

/* ── Shared header ──────────────────────────────────────────────────────────── */
function Header() {
  return (
    <header className="bg-green-deep text-white">
      <div className="mx-auto max-w-2xl px-4 h-16 flex items-center gap-3">
        <Link href="/portal/staff" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm">
            <Image src="/logos/hungry-worms.png" alt="Hungry Worms" width={28} height={28} className="size-7 object-contain" />
          </span>
          <span className="leading-tight">
            <span className="block font-display font-bold text-sm">Log a Pickup</span>
            <span className="block text-white/45 text-xs">Staff Portal</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
