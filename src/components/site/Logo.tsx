import Image from "next/image";

import { cn } from "@/lib/cn";

type LogoVariant = "horizontal" | "mark";
type LogoTone = "light" | "dark";

export function Logo({
  variant = "horizontal",
  tone = "light",
  height = 28,
  className,
  priority,
}: {
  variant?: LogoVariant;
  tone?: LogoTone;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const src = `/brand/logo-grove-${variant}-${tone}.svg`;
  const aspect = variant === "horizontal" ? 4.8 : 1;
  const width = Math.round(height * aspect);
  return (
    <Image
      src={src}
      alt="StrongRoots"
      width={width}
      height={height}
      priority={priority}
      className={cn("block select-none", className)}
    />
  );
}
