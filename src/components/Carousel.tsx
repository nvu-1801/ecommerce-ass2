"use client";

import React from "react";

type CarouselProps = {
  /** Chiều rộng mỗi item (ví dụ "min-w-[260px]" hoặc "min-w-[70%] sm:min-w-[40%] lg:min-w-[28%]") */
  itemWidthClass?: string;
  /** khoảng cách giữa các item */
  gapClass?: string;
  /** bật tự chạy */
  autoplay?: boolean;
  /** ms mỗi lần trượt */
  intervalMs?: number;
  /** số item hiển thị đồng thời (để tính step cuộn) */
  visibleCountApprox?: number;
  /** nội dung item */
  children: React.ReactNode[];
  /** className wrapper */
  className?: string;
};

export default function Carousel({
  itemWidthClass = "min-w-[70%] sm:min-w-[45%] lg:min-w-[30%]",
  gapClass = "gap-4 sm:gap-5 lg:gap-6",
  autoplay = true,
  intervalMs = 3500,
  visibleCountApprox = 3,
  children,
  className,
}: CarouselProps) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const count = React.Children.count(children);

  // tính step = số item nhảy mỗi lần
  const step = Math.max(1, Math.round(visibleCountApprox * 0.8));

  const scrollToIndex = React.useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const items = Array.from(track.children) as HTMLElement[];
      const clamped = ((i % count) + count) % count;
      const target = items[clamped];
      if (target) {
        target.scrollIntoView({ inline: "start", behavior: "smooth", block: "nearest" });
        setIndex(clamped);
      }
    },
    [count]
  );

  const next = React.useCallback(() => scrollToIndex(index + step), [index, step, scrollToIndex]);
  const prev = React.useCallback(() => scrollToIndex(index - step), [index, step, scrollToIndex]);

  // autoplay
  React.useEffect(() => {
    if (!autoplay || count <= 1) return;
    let paused = false;

    const onMouseEnter = () => (paused = true);
    const onMouseLeave = () => (paused = false);

    const node = trackRef.current;
    node?.addEventListener("mouseenter", onMouseEnter);
    node?.addEventListener("mouseleave", onMouseLeave);
    node?.addEventListener("touchstart", onMouseEnter, { passive: true });
    node?.addEventListener("touchend", onMouseLeave, { passive: true });

    const id = setInterval(() => {
      if (!paused) next();
    }, intervalMs);

    return () => {
      clearInterval(id);
      node?.removeEventListener("mouseenter", onMouseEnter);
      node?.removeEventListener("mouseleave", onMouseLeave);
      node?.removeEventListener("touchstart", onMouseEnter);
      node?.removeEventListener("touchend", onMouseLeave);
    };
  }, [autoplay, intervalMs, count, next]);

  // sync index khi user scroll tay
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const items = Array.from(track.children) as HTMLElement[];
        let nearest = 0;
        let min = Number.POSITIVE_INFINITY;
        items.forEach((el, i) => {
          const { left } = el.getBoundingClientRect();
          const { left: tLeft } = track.getBoundingClientRect();
          const dist = Math.abs(left - tLeft);
          if (dist < min) {
            min = dist;
            nearest = i;
          }
        });
        setIndex(nearest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      {/* nút điều hướng */}
      <button
        type="button"
        aria-label="Previous"
        onClick={prev}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white/90 px-3 py-2 shadow hover:bg-white disabled:opacity-40"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={next}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white/90 px-3 py-2 shadow hover:bg-white disabled:opacity-40"
      >
        ›
      </button>

      {/* track */}
      <div
        ref={trackRef}
        className={`no-scrollbar flex overflow-x-auto ${gapClass} scroll-smooth snap-x snap-mandatory px-1 py-2`}
      >
        {React.Children.map(children, (child, i) => (
          <div
            className={`snap-start ${itemWidthClass} shrink-0`}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${count}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* dots */}
      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={[
                "h-2.5 w-2.5 rounded-full transition-all",
                i === index ? "bg-zinc-800 w-6" : "bg-zinc-300 hover:bg-zinc-400",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
