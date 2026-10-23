"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const PLACEHOLDER = "/images/placeholder.svg";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string | null | undefined;
};

export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const initial = src && src.trim().length > 0 ? src : PLACEHOLDER;
  const [current, setCurrent] = useState(initial);

  const { className, ...rest } = props;

  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      className={`z-0 ${className ?? ""}`}
      onError={() => {
        if (current !== PLACEHOLDER) {
          setCurrent(PLACEHOLDER);
        }
      }}
      unoptimized={current === PLACEHOLDER || current.startsWith("/")}
    />
  );
}
