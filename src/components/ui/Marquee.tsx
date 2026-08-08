"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * The shared endless ticker. The track is the item list duplicated once
 * and translated exactly -50%, so the second copy lands precisely where
 * the first began — the loop restarts on an identical frame, which is what
 * keeps it seamless with no visible cut. `ease: "linear"` holds one
 * constant speed throughout (no easing in or out between repeats).
 *
 * `reverse` runs the same loop the other way by starting at -50% and
 * ending at 0% — the mirror of the default leg, so a reversed row keeps
 * exactly the same speed, easing and seamlessness, only its direction
 * differs.
 *
 * Items are ReactNodes rather than plain strings so the same motion drives
 * Home's phrase ticker, the request-sent screen and the partner-logo band.
 */
export function Marquee({
  items,
  duration = 42,
  reverse = false,
  gapClassName = "gap-16",
  className,
  separator,
}: {
  items: ReactNode[];
  duration?: number;
  reverse?: boolean;
  gapClassName?: string;
  className?: string;
  separator?: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();
  const track = [...items, ...items];

  return (
    <motion.div
      className={cn(
        "flex flex-nowrap items-center whitespace-nowrap",
        gapClassName,
        className,
      )}
      animate={
        shouldReduceMotion
          ? undefined
          : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }
      }
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {track.map((item, index) => (
        <span key={index} className={cn("flex items-center", gapClassName)}>
          {item}
          {separator}
        </span>
      ))}
    </motion.div>
  );
}
