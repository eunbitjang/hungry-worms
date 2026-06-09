import Image from "next/image";
import Icon from "./Icon";
import { BRAND_LOGO } from "@/lib/brand";

/**
 * Hungry Worms lockup: square emblem mark + wordmark.
 * Falls back to the built-in worm-icon tile when no mark file is configured.
 * The wordmark inherits its colour from the parent (green on light, off-white on dark).
 */
export default function BrandLogo({
  priority = false,
}: {
  variant?: "light" | "dark";
  priority?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      {BRAND_LOGO.mark ? (
        <Image
          src={BRAND_LOGO.mark}
          alt=""
          width={40}
          height={40}
          priority={priority}
          className="size-9 object-contain"
        />
      ) : (
        <span
          className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-primary to-green-deep shadow-sm"
          aria-hidden="true"
        >
          <Icon name="worm" className="size-5 text-green-leaf" />
        </span>
      )}
      {BRAND_LOGO.wordmark && (
        <span className="font-display font-extrabold text-[1.05rem] leading-tight tracking-tight">
          Hungry Worms
        </span>
      )}
    </span>
  );
}
