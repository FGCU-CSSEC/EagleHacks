import { site } from "@/config/site";
import { getPublicSettings } from "@/lib/settings";

type Props = {
  size?: "lg" | "sm";
  /** "button" (default): pill button. "status": plain text for the dark hero, next to the main CTA. */
  variant?: "button" | "status";
};

const textLink = "text-paper underline underline-offset-4";

function Follow() {
  return (
    <>
      Follow along on{" "}
      <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className={textLink}>
        Instagram
      </a>{" "}
      and{" "}
      <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={textLink}>
        LinkedIn
      </a>
      .
    </>
  );
}

export default async function RegisterButton({ size = "lg", variant = "button" }: Props) {
  const { state, opensLabel, applicationUrl: formUrl } = await getPublicSettings();

  if (variant === "status") {
    const cls = "m-0 text-sm leading-[1.45] text-on-dark desk:text-[15px]";
    if ((state === "open" || state === "waitlist") && formUrl) {
      return (
        <p className={cls}>
          {state === "open" ? "Hacker applications are open." : "Applications are full; join the waitlist."}
          <br />
          <a href={formUrl} target="_blank" rel="noopener noreferrer" className={textLink}>
            {state === "open" ? "Apply now" : "Join the waitlist"}
          </a>
          .
        </p>
      );
    }
    return (
      <p className={cls}>
        {state === "closed" ? "Hacker applications are closed." : `Hacker applications open ${opensLabel}.`}
        <br className="hidden desk:inline" /> <Follow />
      </p>
    );
  }

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
