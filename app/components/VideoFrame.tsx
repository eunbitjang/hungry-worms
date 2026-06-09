import Icon, { type IconName } from "./Icon";

/**
 * Portrait (9:16) video frame for dark sections.
 * Renders a native <video> when `src` is set, otherwise a styled placeholder
 * so the layout looks intentional while the clip is still being produced.
 */
export default function VideoFrame({
  src,
  poster,
  caption,
  fallbackIcon = "recycle",
}: {
  src: string | null;
  poster?: string | null;
  caption?: string;
  fallbackIcon?: IconName;
}) {
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl border border-white/15 bg-soil/40 shadow-2xl ring-1 ring-white/5">
        {src ? (
          <video
            className="size-full object-cover"
            src={src}
            poster={poster ?? undefined}
            controls
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center text-white/45">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/10">
              <Icon name={fallbackIcon} className="size-7" />
            </span>
            <p className="text-xs font-medium">Video coming soon</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-white/55">{caption}</figcaption>
      )}
    </figure>
  );
}
