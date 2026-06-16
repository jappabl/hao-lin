import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "motion/react";

/**
 * Scroll-hijack transition. The track pins on the `cover` section (About); as you
 * scroll, orange marker strokes swipe in left→right one after another, stacking
 * top-to-bottom until the whole screen is solid orange. After a brief hold on the
 * full cover, an eraser wipe sweeps left→right to reveal the `reveal` section.
 *
 * Progress map (smoothed scroll 0 → 1):
 *   0.00 → 0.70   build  — 14 marker swipes draw in, stacking top→bottom
 *   0.70          `cover` drops out (invisible under the solid orange)
 *   0.70 → 0.80   hold   — screen fully covered in orange
 *   0.80 → 1.00   reveal — eraser clip wipes the orange away
 *
 * Honors prefers-reduced-motion: both sections render normally, no hijack.
 */

// 14 slightly-wavy horizontal marker strokes — overlap to a solid fill.
const STROKES = Array.from({ length: 14 }, (_, i) => {
  const y = -2 + i * 8;
  return `M -4 ${y} C 26 ${y - 2.2}, 52 ${y + 2.6}, 76 ${y - 1.8} S 104 ${y + 1.4} 104 ${y}`;
});

// One marker swipe: drawn left→right via stroke-dashoffset over its scroll window.
function Stroke({
  d,
  p,
  s0,
  s1,
}: {
  d: string;
  p: MotionValue<number>;
  s0: number;
  s1: number;
}) {
  const dashoffset = useTransform(p, [s0, s1], [1, 0]);
  // fully hidden until its draw window starts — kills the at-rest end-cap dot
  const opacity = useTransform(p, [s0, s0 + 0.004], [0, 1]);
  return (
    <motion.path
      d={d}
      pathLength={1}
      fill="none"
      stroke="var(--color-ember)"
      strokeWidth={9}
      strokeLinecap="round"
      style={{ strokeDasharray: 1, strokeDashoffset: dashoffset, opacity }}
    />
  );
}

export default function MarkerWipe({
  cover,
  reveal,
  anchorId,
}: {
  cover: React.ReactNode;
  reveal: React.ReactNode;
  anchorId?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 220, damping: 36, mass: 0.4 });

  // erase: left inset 0% → 100% (orange wiped away to reveal target), after the hold.
  // finishes at 0.97 so the fully-revealed state has margin (clean #contact landing).
  const eraseInset = useTransform(p, [0.8, 0.97], [0, 100]);
  const eraseClip = useMotionTemplate`inset(0% 0% 0% ${eraseInset}%)`;
  // cover section stays solid until the orange is complete, then drops out
  const coverOpacity = useTransform(p, [0.7, 0.72], [1, 0]);
  // the revealed section is only interactive once the wipe has uncovered it
  const revealPointer = useTransform(p, (v) => (v >= 0.96 ? "auto" : "none"));

  if (reduced) {
    return (
      <>
        {cover}
        <div id={anchorId} />
        {reveal}
      </>
    );
  }

  const N = STROKES.length;

  return (
    <div ref={trackRef} className="relative" style={{ height: "200vh" }}>
      {/* anchor: links to #contact land here — the moment the orange is fully erased */}
      <div
        id={anchorId}
        aria-hidden="true"
        className="absolute left-0 h-px w-px"
        style={{ top: "100vh" }}
      />
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* reveal target (the final section) — only clickable once uncovered */}
        <motion.div className="absolute inset-0" style={{ pointerEvents: revealPointer }}>
          {reveal}
        </motion.div>

        {/* the section being painted over — hidden once the orange is complete */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: coverOpacity }}
          aria-hidden="true"
        >
          {cover}
        </motion.div>

        {/* orange marker cover: erase wrapper clips the self-drawing swipes */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: eraseClip }}
          aria-hidden="true"
        >
          <svg
            className="absolute inset-0 h-full w-full overflow-hidden"
            viewBox="0 0 100 102"
            preserveAspectRatio="none"
          >
            {STROKES.map((d, i) => {
              // staggered top→bottom; last stroke finishes drawing at p = 0.70
              const s0 = (i / (N - 1)) * 0.52;
              const s1 = s0 + 0.18;
              return <Stroke key={i} d={d} p={p} s0={s0} s1={s1} />;
            })}
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
