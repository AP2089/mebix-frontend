"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

interface LogoProps {
  href?: string;
  showWordmark?: boolean;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="64" height="64" className="fill-mebix-graphite" />
      <path
        d="M16 46V18h7.2l8.8 18.4L40.8 18H48v28h-6.4V28.2L34.4 46h-4.8L22.4 28.2V46H16z"
        className="fill-mebix-milk"
      />
    </svg>
  );
}

export function Logo({
  href = "/",
  showWordmark = true,
  className = "",
  markClassName = "h-9 w-9",
  wordmarkClassName = "text-xl md:text-2xl",
}: LogoProps) {
  const t = useTranslations("brand");

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      {showWordmark ? (
        <span
          className={`font-display font-semibold tracking-[0.08em] text-mebix-graphite ${wordmarkClassName}`}
        >
          {t("name")}
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center" aria-label={t("homeAria")}>
      {content}
    </Link>
  );
}
