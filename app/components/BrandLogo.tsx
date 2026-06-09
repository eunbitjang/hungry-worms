import Image from "next/image";
import Icon from "./Icon";
import { BRAND_LOGO } from "@/lib/brand";

/**
 * Renders the real Hungry Worms logo when configured in lib/brand.ts,
 * otherwise falls back to the built-in worm-icon mark + wordmark.
 *
 * `variant="light"` → for white backgrounds (header)
 * `variant="dark"`  → for dark backgrounds (footer, portal)
 */
export default function BrandLogo({
  variant = "light",
  priority = false,
}: {
  variant?: "light" | "dark";
  priority?: boolean;
}) {
  const src = variant === "dark" ? BRAND_LOGO.onDark : BRAND_LOGO.onLight;

  if (src) {
    return (
      <Image
        src={src}
        alt="Hungry Worms"
        width={BRAND_LOGO.width}
        height={BRAND_LOGO.height}
        priority={priority}
        className="h-8 w-auto"
      />
    );
  }

  // Fallback: gradient tile + worm icon + wordmark
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-primary to-green-deep shadow-sm"
        aria-hidden="true"
      >
        <Icon name="worm" className="size-5 text-green-leaf" />
      </span>
      <span className="font-display font-extrabold text-[1.05rem] leading-tight tracking-tight">
        Hungry Worms
      </span>
    </span>
  );
}
