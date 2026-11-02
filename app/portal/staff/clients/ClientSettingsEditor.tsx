"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LIMITS, type ClientSetting, type ClientSettings, type PickupBox } from "@/lib/staff/pickup-config";

/* A box as the editor shows it: choices typed as comma-separated text. */
type Extra = "none" | "location" | "bin";
type BoxDraft = { waste: string; extra: Extra; extraText: string };
type Draft = {
  id: string; // "" for a new client
  label: string;
  store: string;
  note: string;
  active: boolean;
  logoUrl: string;
  boxes: BoxDraft[];
};

const splitList = (s: string) => [...new Set(s.split(",").map((x) => x.trim()).filter(Boolean))];

const boxToDraft = (b: PickupBox): BoxDraft => ({
  waste: (b.wasteOptions ?? (b.waste ? [b.waste] : [])).join(", "),
  extra: b.locationOptions ? "location" : b.capacityOptions ? "bin" : "none",
  extraText: (b.locationOptions ?? b.capacityOptions ?? []).join(", "),
});

const draftToBox = (b: BoxDraft) => {
  const wasteOptions = splitList(b.waste);
  // A bin with a waste-type choice can't ask for anything else (one selector per bin).
  const extra = wasteOptions.length > 1 ? "none" : b.extra;
  return {
    wasteOptions,
    ...(extra === "location" ? { locationOptions: splitList(b.extraText) } : {}),
    ...(extra === "bin" ? { capacityOptions: splitList(b.extraText) } : {}),
  };
};

const toDraft = (c: ClientSetting): Draft => ({
  id: c.id,
  label: c.label,
  store: c.store,
  note: c.note,
  active: c.active,
  logoUrl: c.logoUrl,
  boxes: c.boxes.map(boxToDraft),
});

const NEW_CLIENT: Draft = {
  id: "",
  label: "",
  store: "",
  note: "",
  active: true,
  logoUrl: "",
  boxes: [{ waste: "Food waste", extra: "none", extraText: "" }],
};

/** One-line summary of a client's boxes, e.g. "3 bins · Food waste". */
function summary(c: ClientSetting) {
  const waste = [...new Set(c.boxes.flatMap((b) => b.wasteOptions ?? (b.waste ? [b.waste] : [])))];
  const extras = [
    c.boxes.some((b) => b.locationOptions) && "location",
    c.boxes.some((b) => b.capacityOptions) && "bin size",
  ].filter(Boolean);
  return `${c.boxes.length} bin${c.boxes.length === 1 ? "" : "s"} · ${waste.join(", ")}${extras.length ? ` · asks ${extras.join(" and ")}` : ""}`;
}

const card = "rounded-2xl bg-white border border-soil/10 shadow-[var(--shadow-card)]";
const fieldLabel = "block text-xs font-semibold text-soil/60 mb-1";
const hint = "mt-1 text-xs text-soil/45 leading-relaxed";
const inputBase =
  "w-full rounded-lg border border-soil/20 bg-white px-3 py-2 text-[15px] text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 disabled:bg-offwhite disabled:text-soil/50";

export default function ClientSettingsEditor({
  staffEmail,
  initial,
  openId,
}: {
  staffEmail: string;
  initial: ClientSettings;
  openId: string;
}) {
  const [settings, setSettings] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(() => {
    const c = initial.clients.find((x) => x.id === openId);
    return c ? toDraft(c) : null;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function open(d: Draft) {
    setDraft(d);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function close() {
    setDraft(null);
    setError("");
    if (window.location.search) history.replaceState(null, "", window.location.pathname);
  }

  const setBox = (i: number, patch: Partial<BoxDraft>) =>
    draft && setDraft({ ...draft, boxes: draft.boxes.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });

  async function save() {
    if (!draft || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/staff/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: settings.updatedAt,
          client: { ...draft, id: draft.id || undefined, boxes: draft.boxes.map(draftToBox) },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSettings(data.settings);
      setNotice(`Saved “${draft.label.trim()}”. The pickup form uses this straight away.`);
      close();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const isNew = draft?.id === "";

  return (
    <div className="min-h-screen bg-offwhite">
      <header className="bg-green-deep text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/portal/staff" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <Image src="/logos/hungry-worms.png" alt="Hungry Worms" width={28} height={28} className="size-7 object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block font-display font-bold text-sm">Clients &amp; bins</span>
              <span className="block text-white/45 text-xs">Staff Portal</span>
            </span>
          </Link>
          <Link href="/portal/staff/pickup" className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors">
            Log a pickup
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <h1 className="font-display text-2xl font-extrabold text-green-deep">Clients &amp; bins</h1>
        <p className="mt-1 text-sm text-soil/60 leading-relaxed">
          What <strong>Log a pickup</strong> shows for each client: how many bins, the waste types,
          and any location or bin-size choice. Changes apply straight away. Pickups you already
          logged stay as they are; to fix one of those, use{" "}
          <Link href="/portal/staff/pickups" className="font-semibold text-green-primary hover:underline">Fix a pickup</Link>.
          {staffEmail && <> Signed in as <strong className="text-soil/80">{staffEmail}</strong>.</>}
        </p>

        {notice && (
          <p className="mt-5 rounded-xl border border-green-primary/30 bg-green-primary/10 px-4 py-3 text-sm font-semibold text-green-deep" role="status">
            {notice}
          </p>
        )}

        {draft ? (
          <section className={`${card} mt-6 p-4 sm:p-5`} aria-labelledby="editTitle">
            <h2 id="editTitle" className="font-display text-lg font-bold text-green-deep">
              {isNew ? "Add a client" : `Edit ${draft.label || "client"}`}
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={fieldLabel} htmlFor="label">Name in the client list</label>
                <input id="label" className={inputBase} value={draft.label} maxLength={LIMITS.label}
                  onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
              </div>
              <div>
                <label className={fieldLabel} htmlFor="store">Name saved in the sheet and reports</label>
                <input id="store" className={inputBase} value={draft.store} maxLength={LIMITS.label}
                  placeholder={isNew ? draft.label || "Same as the list name" : ""} disabled={!isNew}
                  onChange={(e) => setDraft({ ...draft, store: e.target.value })} />
                <p className={hint}>
                  {isNew
                    ? "Leave empty to use the list name. This can't be changed later."
                    : "Fixed, so this client's past pickups stay together."}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className={fieldLabel} htmlFor="note">Note shown on the form (optional)</label>
                <input id="note" className={inputBase} value={draft.note} maxLength={LIMITS.note}
                  placeholder="e.g. Bin count to confirm"
                  onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={fieldLabel} htmlFor="logo">Logo for the impact report (optional)</label>
                <div className="flex items-center gap-3">
                  <input id="logo" className={inputBase} value={draft.logoUrl} maxLength={LIMITS.logo}
                    placeholder="https://…" inputMode="url"
                    onChange={(e) => setDraft({ ...draft, logoUrl: e.target.value })} />
                  {/^https:\/\/\S+$/i.test(draft.logoUrl) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.logoUrl} alt="" className="h-10 w-20 shrink-0 rounded border border-soil/10 bg-white object-contain p-1" />
                  )}
                </div>
                <p className={hint}>
                  On the client&apos;s website, right-click their logo and choose “Copy image address”, then paste it here.
                  Leave empty to keep the logo the report already uses.
                </p>
              </div>
              <label className="sm:col-span-2 flex items-center gap-2 text-sm font-medium text-green-deep cursor-pointer select-none">
                <input type="checkbox" className="size-4 accent-green-primary" checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
                Show this client in Log a pickup
              </label>
            </div>

            <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-wide text-soil/55">
              Bins ({draft.boxes.length})
            </h3>
            <p className={hint}>
              One row per bin you weigh. Several waste types separated by commas, e.g. “Food waste, Yard / green waste”,
              give a choice on the form.
            </p>
            <ol className="mt-3 space-y-3">
              {draft.boxes.map((b, i) => {
                const several = splitList(b.waste).length > 1;
                return (
                  <li key={i} className="rounded-xl border border-soil/10 bg-offwhite/60 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-soil/55">Bin {i + 1}</span>
                      <button type="button" disabled={draft.boxes.length === 1}
                        onClick={() => setDraft({ ...draft, boxes: draft.boxes.filter((_, idx) => idx !== i) })}
                        className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-40">
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr_1fr]">
                      <div>
                        <label className={fieldLabel} htmlFor={`waste-${i}`}>Waste type</label>
                        <input id={`waste-${i}`} className={inputBase} value={b.waste}
                          onChange={(e) => setBox(i, { waste: e.target.value })} />
                      </div>
                      <div>
                        <label className={fieldLabel} htmlFor={`extra-${i}`}>Also ask for</label>
                        <select id={`extra-${i}`} className={inputBase} value={several ? "none" : b.extra} disabled={several}
                          onChange={(e) => setBox(i, { extra: e.target.value as Extra })}>
                          <option value="none">Nothing else</option>
                          <option value="location">Location</option>
                          <option value="bin">Bin size</option>
                        </select>
                        {several && <p className={hint}>Not available when the bin has a waste-type choice.</p>}
                      </div>
                      {!several && b.extra !== "none" && (
                        <div className="sm:col-span-2">
                          <label className={fieldLabel} htmlFor={`extraText-${i}`}>
                            {b.extra === "location" ? "Locations" : "Bin sizes"} to choose from
                          </label>
                          <input id={`extraText-${i}`} className={inputBase} value={b.extraText}
                            placeholder={b.extra === "location" ? "e.g. Main Kitchen, Ashley Block" : "e.g. 120L, 80L"}
                            onChange={(e) => setBox(i, { extraText: e.target.value })} />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            <button type="button" disabled={draft.boxes.length >= LIMITS.boxes}
              onClick={() => setDraft({ ...draft, boxes: [...draft.boxes, { ...draft.boxes[draft.boxes.length - 1] }] })}
              className="mt-3 w-full rounded-xl border border-dashed border-green-primary/40 py-2.5 text-sm font-semibold text-green-primary hover:bg-green-primary/5 disabled:opacity-40">
              + Add a bin (copies the last one)
            </button>

            {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">{error}</p>}
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={save} disabled={busy}
                className="flex-1 rounded-xl bg-green-primary py-3 text-sm font-bold text-white hover:bg-green-deep disabled:opacity-50">
                {busy ? "Saving…" : isNew ? "Add client" : "Save changes"}
              </button>
              <button type="button" onClick={close} disabled={busy}
                className="rounded-xl border border-soil/20 bg-white px-4 py-3 text-sm font-semibold text-soil/70 hover:bg-offwhite">
                Cancel
              </button>
            </div>
          </section>
        ) : (
          <>
            <button type="button" onClick={() => open(NEW_CLIENT)}
              className="mt-6 w-full rounded-xl bg-green-primary py-3 text-sm font-bold text-white hover:bg-green-deep">
              + Add a client
            </button>
            <ul className="mt-4 space-y-3">
              {settings.clients.map((c) => (
                <li key={c.id} className={`${card} flex items-center gap-3 px-4 py-3`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-soil">
                      {c.label}
                      {!c.active && (
                        <span className="ml-2 rounded-full bg-soil/10 px-2 py-0.5 text-[11px] font-semibold text-soil/60">Hidden</span>
                      )}
                    </p>
                    <p className="text-xs text-soil/55">{summary(c)}</p>
                    {c.note && <p className="text-xs text-amber-700">{c.note}</p>}
                  </div>
                  <button type="button" onClick={() => open(toDraft(c))}
                    className="rounded-lg border border-green-primary/30 px-3 py-1.5 text-xs font-bold text-green-primary hover:bg-green-primary/10">
                    Edit
                  </button>
                </li>
              ))}
            </ul>
            {settings.updatedAt && (
              <p className="mt-6 text-xs text-soil/45">
                Last changed {new Date(settings.updatedAt).toLocaleString("en-NZ", { dateStyle: "medium", timeStyle: "short" })}
                {settings.updatedBy && <> by {settings.updatedBy}</>}.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
