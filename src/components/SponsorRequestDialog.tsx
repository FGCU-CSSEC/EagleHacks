"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent, type MouseEvent, type ReactNode } from "react";
import {
  SPONSOR_INTERESTS,
  submitSponsorRequest,
  validateSponsorRequest,
  type SponsorInterest,
  type SponsorRequest,
  type SponsorRequestErrors,
} from "@/lib/sponsorRequest";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = keyof SponsorRequestErrors;

const EMPTY_REQUEST: SponsorRequest = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  interests: [],
  message: "",
  website: "",
};

const FIELD_ORDER: FieldName[] = ["name", "organization", "email", "phone"];

const fieldClass = (error?: string) =>
  `block w-full border bg-white px-3.5 text-base text-ink placeholder:text-[#8d887c] ${
    error ? "border-red-700" : "border-line"
  }`;

type FieldProps = { id: string; label: string; hint?: string; error?: string; children: ReactNode };

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="label block text-muted">
        {label}
        {hint && <span className="ml-1 font-normal normal-case tracking-normal"> {hint}</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="m-0 mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function ArrowIcon() {
  return (
    <span aria-hidden="true" className="font-normal [font-stretch:100%]">
      →
    </span>
  );
}

/**
 * "Request the sponsor packet" button and the dialog it opens. The form is client-side only:
 * submission goes through submitSponsorRequest in src/lib, which is a placeholder for now.
 */
export default function SponsorRequestDialog({ email }: { email: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const pressStartedOnBackdrop = useRef(false);

  const [values, setValues] = useState<SponsorRequest>(EMPTY_REQUEST);
  const [errors, setErrors] = useState<SponsorRequestErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const formId = useId();
  const titleId = `${formId}-title`;
  const interestsId = `${formId}-interests`;
  const submitting = status === "submitting";

  const openDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  };

  const closeDialog = () => dialogRef.current?.close();

  // Runs for every way the dialog can close (button, Escape, backdrop click).
  const handleClose = () => {
    document.documentElement.style.overflow = "";
    if (status === "success") {
      setValues(EMPTY_REQUEST);
      setErrors({});
    }
    if (status !== "submitting") setStatus("idle");
    triggerRef.current?.focus();
  };

  const handleCancel = (event: { preventDefault: () => void }) => {
    if (submitting) event.preventDefault();
  };

  // Close on a click on the backdrop, but not when a text selection drag ends there.
  const handlePointerDown = (event: MouseEvent<HTMLDialogElement>) => {
    pressStartedOnBackdrop.current = event.target === event.currentTarget;
  };
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (!submitting && pressStartedOnBackdrop.current && event.target === event.currentTarget) closeDialog();
  };

  const setField =
    (name: keyof Omit<SponsorRequest, "interests">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [name]: event.target.value }));
      if (name in errors) setErrors((current) => ({ ...current, [name]: undefined }));
    };

  const toggleInterest = (interest: SponsorInterest) =>
    setValues((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const found = validateSponsorRequest(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      (event.currentTarget.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await submitSponsorRequest({
        ...values,
        name: values.name.trim(),
        organization: values.organization.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
      });
      setStatus("success");
      // Let the success view render, then move focus to its heading so it is announced.
      requestAnimationFrame(() => successHeadingRef.current?.focus());
    } catch {
      setStatus("error");
    }
  };

  const idFor = (name: FieldName) => `${formId}-${name}`;
  const describedBy = (name: FieldName) => (errors[name] ? `${idFor(name)}-error` : undefined);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="cta cta-accent w-full desk:w-auto"
        aria-haspopup="dialog"
        onClick={openDialog}
      >
        Request the sponsor packet <ArrowIcon />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="sponsor-dialog m-auto h-dvh max-h-none w-full max-w-none border-0 bg-paper p-0 text-ink open:flex open:flex-col desk:h-fit desk:max-h-[calc(100dvh-48px)] desk:w-[600px] desk:max-w-[calc(100vw-48px)]"
        onCancel={handleCancel}
        onClose={handleClose}
        onMouseDown={handlePointerDown}
        onClick={handleClick}
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <button
            type="button"
            aria-label="Close"
            disabled={submitting}
            onClick={closeDialog}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center text-ink transition-opacity hover:opacity-60 disabled:opacity-30 desk:right-7 desk:top-7"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M1 1l14 14M15 1L1 15" />
            </svg>
          </button>

          {status === "success" ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-16 desk:px-10 desk:pb-10 desk:pt-12">
              <span className="flex h-[54px] w-[54px] items-center justify-center bg-green text-paper">
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
              </span>
              <h2
                id={titleId}
                ref={successHeadingRef}
                tabIndex={-1}
                className="h-display m-0 mt-6 text-[44px] outline-none desk:text-[52px]"
              >
                Request sent
              </h2>
              <p className="m-0 mt-4 text-lg leading-snug text-body-light">
                Thanks! The EagleHacks team will email the 2027 sponsorship packet to{" "}
                <strong className="font-bold text-ink">{values.email.trim()}</strong>.
              </p>
              <p className="m-0 mt-3 text-[15px] text-muted">Questions in the meantime? Reach us at {email}.</p>
              <button type="button" onClick={closeDialog} className="cta cta-ink mt-8">
                Back to the site
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-6 desk:px-10 desk:pb-3 desk:pt-9">
                <p className="label m-0 pr-12 text-accent">Sponsor EagleHacks 2027</p>
                <h2 id={titleId} className="h-display m-0 mt-2.5 text-[44px] desk:text-[48px]">
                  Request the sponsor packet
                </h2>
                <p className="m-0 mt-3 text-base leading-snug text-body-light">
                  Tell us a little about you and we&rsquo;ll email you the 2027 sponsorship packet.
                </p>

                <div className="mt-5 grid gap-x-4 gap-y-4 desk:grid-cols-2">
                  <Field id={idFor("name")} label="Your name" error={errors.name}>
                    <input
                      id={idFor("name")}
                      name="name"
                      type="text"
                      data-autofocus
                      autoComplete="name"
                      required
                      placeholder="John Smith"
                      value={values.name}
                      onChange={setField("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={describedBy("name")}
                      className={`${fieldClass(errors.name)} h-11`}
                    />
                  </Field>
                  <Field id={idFor("organization")} label="Company or organization" error={errors.organization}>
                    <input
                      id={idFor("organization")}
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      required
                      placeholder="Company name"
                      value={values.organization}
                      onChange={setField("organization")}
                      aria-invalid={!!errors.organization}
                      aria-describedby={describedBy("organization")}
                      className={`${fieldClass(errors.organization)} h-11`}
                    />
                  </Field>
                  <Field id={idFor("email")} label="Work email" error={errors.email}>
                    <input
                      id={idFor("email")}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="name@company.com"
                      value={values.email}
                      onChange={setField("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={describedBy("email")}
                      className={`${fieldClass(errors.email)} h-11`}
                    />
                  </Field>
                  <Field id={idFor("phone")} label="Phone" hint="(optional)" error={errors.phone}>
                    <input
                      id={idFor("phone")}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(239) 555-0100"
                      value={values.phone}
                      onChange={setField("phone")}
                      aria-invalid={!!errors.phone}
                      aria-describedby={describedBy("phone")}
                      className={`${fieldClass(errors.phone)} h-11`}
                    />
                  </Field>
                </div>

                <div role="group" aria-labelledby={interestsId} className="mt-5">
                  <p id={interestsId} className="label m-0 text-muted">
                    Interested in <span className="font-normal normal-case tracking-normal">(pick any)</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SPONSOR_INTERESTS.map((interest) => {
                      const selected = values.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleInterest(interest)}
                          className={`inline-flex min-h-11 items-center border px-3.5 text-[15px] font-bold leading-tight transition-colors duration-150 ${
                            selected
                              ? "border-ink bg-ink text-paper"
                              : "border-line bg-white text-ink hover:border-ink"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <Field id={`${formId}-message`} label="Message" hint="(optional)">
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={3}
                      placeholder="Anything we should know? Questions, timing, ideas for a challenge..."
                      value={values.message}
                      onChange={setField("message")}
                      className={`${fieldClass()} min-h-[88px] resize-y py-2.5`}
                    />
                  </Field>
                </div>

                {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={setField("website")}
                    />
                  </label>
                </div>
              </div>

              <div className="shrink-0 border-t border-line bg-paper px-5 py-4 desk:border-t-0 desk:px-10 desk:pb-8 desk:pt-2">
                {status === "error" && (
                  <p role="alert" className="m-0 mb-3 text-sm text-red-700">
                    Something went wrong sending your request. Please email {email} directly.
                  </p>
                )}
                <div className="flex flex-col-reverse gap-3 desk:flex-row desk:items-center desk:justify-between">
                  <p className="m-0 text-center text-sm leading-snug text-muted desk:text-left">
                    Goes to the CSSEC team at <br className="hidden desk:inline" />
                    <strong className="font-bold text-ink">{email}</strong>
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="cta cta-accent w-full desk:w-auto"
                  >
                    {submitting ? "Sending…" : "Send request"} <ArrowIcon />
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
