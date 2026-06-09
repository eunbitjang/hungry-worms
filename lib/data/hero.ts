import { createClient } from "@supabase/supabase-js";

export type HeroStats = {
  total_waste_kg: number;
  total_co2e_kg: number;
  total_cars_year: number;
};

/** Shown when the DB is unavailable — based on last known figures. */
export const HERO_FALLBACK: HeroStats = {
  total_waste_kg: 48200,
  total_co2e_kg: 120500,
  total_cars_year: 26.2,
};

/**
 * Fetches company-wide impact totals from the public_impact_totals view.
 * Called server-side only; result is cached via Next.js ISR (revalidate: 600s).
 * Falls back to HERO_FALLBACK if the DB is unreachable or the table is empty.
 */
export async function getHeroStats(): Promise<HeroStats> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("public_impact_totals")
      .select("total_waste_kg, total_co2e_kg, total_cars_year")
      .single();

    if (error || !data) return HERO_FALLBACK;

    return {
      total_waste_kg: Number(data.total_waste_kg) || HERO_FALLBACK.total_waste_kg,
      total_co2e_kg: Number(data.total_co2e_kg) || HERO_FALLBACK.total_co2e_kg,
      total_cars_year: Number(data.total_cars_year) || HERO_FALLBACK.total_cars_year,
    };
  } catch {
    return HERO_FALLBACK;
  }
}

/** Format a number with thousands separator, e.g. 120500 → "120,500" */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("en-NZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
