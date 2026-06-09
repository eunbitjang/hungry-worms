"use client";

import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";

/**
 * Portrait (9:16) video frame for dark sections.
 * Renders a native <video> when `src` is set, otherwise a styled placeholder
 * so the layout looks intentional while the clip is still being produced.
 *
 * We deliberately do NOT use the JSX `muted`/`autoPlay` attributes: React
 * re-applies the `muted` prop on every render, which silently re-mutes the
 * video the instant the user unmutes it (the state change triggers a re-render).
 * Instead we drive muting and autoplay imperatively through the ref, so once a
 * visitor turns the sound on it stays on. Autoplay still works because we start
 * playback muted on mount.
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // Start muted autoplay once mounted (allowed without a user gesture).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    void v.play().catch(() => {});
  }, [src]);

  function unmute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    void v.play().catch(() => {});
  }

  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl border border-white/15 bg-soil/40 shadow-2xl ring-1 ring-white/5">
        {src ? (
          <>
            <video
              ref={videoRef}
              className="size-full object-cover"
              src={src}
              poster={poster ?? undefined}
              controls
              loop
              playsInline
              preload="metadata"
              onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            />
            {muted && (
              <button
                type="button"
                onClick={unmute}
                aria-label="Tap to unmute"
                className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-soil/75 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm hover:bg-soil transition-colors"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 5 6 9H2v6h4l5 4z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                Tap for sound
              </button>
            )}
          </>
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
