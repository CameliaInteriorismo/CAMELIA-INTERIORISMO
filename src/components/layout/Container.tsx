import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-40 ${className}`}
    >
      {children}
    </div>
  );
}

export function Grid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    // Only the COLUMN gap shrinks below md: every "col-span-12
    // md:col-span-X" item spans all 12 tracks at mobile widths too, and
    // that column-gap is reserved 11 times regardless — at gap-8 (32px)
    // that's 352px, more than most mobile containers have, which
    // collapsed every track to 0 and let spanning children overflow past
    // the grid's own box. gap-x-2 keeps that reserved space trivial.
    // gap-y stays 32px throughout: every existing layout already relies
    // on it for the vertical spacing between mobile-stacked items, and
    // this fix has no reason to touch that.
    <div
      className={`grid grid-cols-12 gap-x-2 gap-y-8 md:gap-x-8 ${className}`}
    >
      {children}
    </div>
  );
}
