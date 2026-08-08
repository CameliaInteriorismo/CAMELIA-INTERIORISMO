import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

// Every button on the site is 44px tall — fixed height, not padding-derived,
// so it stays exactly 44px regardless of label length.
const baseStyles =
  "font-title inline-flex h-11 items-center justify-center whitespace-nowrap bg-primary px-8 text-sm tracking-wide text-background transition-opacity hover:opacity-90";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(baseStyles, className)} {...props} />;
}

export function ButtonLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(baseStyles, className)}>
      {children}
    </Link>
  );
}
