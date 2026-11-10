import type { ComponentProps } from "react";
import ArrowIcon from "@/components/ArrowIcon";

type Props = ComponentProps<"a"> & { variant?: "paper" | "accent" };

/** Square condensed call-to-action link with a trailing arrow. */
export default function Cta({ variant = "paper", className = "", children, ...rest }: Props) {
  return (
    <a className={`cta cta-${variant} ${className}`} {...rest}>
      {children} <ArrowIcon />
    </a>
  );
}
