import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-mebix-graphite text-mebix-milk hover:bg-mebix-graphite/90 disabled:bg-mebix-graphite/40",
  secondary:
    "border border-mebix-graphite text-mebix-graphite hover:bg-mebix-beige/60 disabled:opacity-40",
  ghost: "text-mebix-graphite hover:text-mebix-wood disabled:opacity-40",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const classes = `inline-flex min-h-11 cursor-pointer items-center justify-center px-5 py-2.5 text-sm font-medium tracking-wide transition ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
