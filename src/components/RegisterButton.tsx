import { site } from "@/config/site";

type Props = { size?: "lg" | "sm" };

export default function RegisterButton({ size = "lg" }: Props) {
  const { state, opensLabel, formUrl } = site.registration;
  const cls = size === "lg" ? "btn btn-lg" : "btn btn-sm";

  if ((state === "open" || state === "waitlist") && formUrl) {
    return (
      <a className={`${cls} btn-primary`} href={formUrl} target="_blank" rel="noopener noreferrer">
        {state === "open" ? "Apply now" : "Join the waitlist"}
      </a>
    );
  }

  if (state === "closed") {
    return (
      <span className={`${cls} btn-disabled`} aria-disabled="true">
        Applications closed
      </span>
    );
  }

  return (
    <span className={`${cls} btn-pending`} aria-disabled="true">
      Applications open {opensLabel}
    </span>
  );
}
