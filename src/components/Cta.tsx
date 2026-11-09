import type { ComponentProps } from "react";

type Props = ComponentProps<"a"> & { variant?: "paper" | "accent" };

/** Square condensed call-to-action link with a trailing arrow. */
export default function Cta({ variant = "paper", className = "", children, ...rest }: Props) {
  return (
    <a className={`cta cta-${variant} ${className}`} {...rest}>
      {children} <span aria-hidden="true" className="font-normal [font-stretch:100%]">→</span>
    </a>
  );
}
