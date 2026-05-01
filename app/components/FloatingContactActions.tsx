"use client";

import { FormEvent, useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { getApiBaseUrl } from "../utils/apiBase";

const whatsappNumber = "919135895389";
const whatsappMessage = encodeURIComponent(
  "Hi, I need help with warranty support.",
);

export default function FloatingContactActions() {
  const apiBase = getApiBaseUrl();
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isWarrantyOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsWarrantyOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isWarrantyOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);
    setIsError(false);
    setStatusMessage("");
    try {
      const response = await fetch(`${apiBase}/support-requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: String(formData.get("fullName") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          address: String(formData.get("address") || "").trim(),
          message: String(formData.get("message") || "").trim(),
          status: "new",
        }),
      });
      if (!response.ok) {
        throw new Error("submit failed");
      }
      form.reset();
      window.alert("Thank you! Your Kila Support request has been submitted.");
      setStatusMessage("Support request submitted successfully.");
      setIsWarrantyOpen(false);
      setStatusMessage("");
    } catch {
      setIsError(true);
      setStatusMessage("Submit failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsWarrantyOpen(true)}
        className="fixed bottom-5 left-4 z-[70] inline-flex items-center gap-2 rounded-xl bg-[var(--secondary)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
        aria-label="Claim warranty"
      >
        <ShieldCheck size={16} />
        <span>Kila Support</span>
      </button>

      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noreferrer noopener"
        className="fixed bottom-5 right-4 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7 fill-current"
          aria-hidden="true"
        >
          <path d="M19.11 17.22c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.85 1.05-.15.18-.31.2-.58.07-.27-.14-1.12-.41-2.13-1.31-.79-.7-1.32-1.56-1.48-1.83-.15-.27-.02-.41.11-.55.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.72.34-.24.27-.94.92-.94 2.24 0 1.32.96 2.59 1.09 2.77.14.18 1.88 2.87 4.56 4.03.64.27 1.13.43 1.52.55.64.2 1.21.17 1.66.1.51-.08 1.58-.65 1.81-1.28.22-.63.22-1.17.15-1.28-.07-.1-.24-.16-.51-.3Z" />
          <path d="M16.02 3.2c-7.03 0-12.74 5.71-12.74 12.74 0 2.25.59 4.44 1.71 6.37L3.2 28.8l6.66-1.75a12.7 12.7 0 0 0 6.17 1.58h.01c7.02 0 12.74-5.72 12.74-12.75 0-3.4-1.32-6.6-3.73-9a12.64 12.64 0 0 0-9.03-3.68Zm0 23.28h-.01a10.5 10.5 0 0 1-5.35-1.47l-.38-.23-3.95 1.04 1.05-3.85-.25-.4a10.55 10.55 0 0 1-1.62-5.63c0-5.84 4.75-10.59 10.6-10.59 2.83 0 5.48 1.1 7.48 3.11 2 2 3.1 4.66 3.1 7.48 0 5.85-4.75 10.6-10.6 10.6Z" />
        </svg>
      </a>

      {isWarrantyOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4">
          <div
            className="absolute inset-0"
            onClick={() => setIsWarrantyOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-[81] w-full max-w-sm rounded-xl bg-[var(--secondary)] p-5 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setIsWarrantyOpen(false)}
              className="absolute right-3 top-3 rounded p-1 text-white/90 transition hover:bg-black/10"
              aria-label="Close warranty form"
            >
              <X size={16} />
            </button>

            <h2 className="text-center text-3xl font-semibold">
              Kila Care Support
            </h2>
            <p className="mb-4 text-center text-sm text-white/90">
              Get quick support for your massage chair. We&apos;re here to help
              you relax better.
            </p>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                className="w-full rounded-md border border-[var(--primary)] px-3 py-2 text-sm text-[var(--text-dark)] outline-none focus:ring-2 focus:ring-[var(--primary)]  bg-gray-100"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                className="w-full rounded-md border border-[var(--primary)] px-3 py-2 text-sm text-[var(--text-dark)] outline-none focus:ring-2 focus:ring-[var(--primary)]  bg-gray-100"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full rounded-md border border-[var(--primary)] px-3 py-2 text-sm text-[var(--text-dark)] outline-none focus:ring-2 focus:ring-[var(--primary)]  bg-gray-100"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                className="w-full rounded-md border border-[var(--primary)] px-3 py-2 text-sm text-[var(--text-dark)] outline-none focus:ring-2 focus:ring-[var(--primary)]  bg-gray-100"
              />
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                required
                className="w-full resize-none rounded-md border border-[var(--primary)] bg-gray-100 px-3 py-2 text-sm text-[var(--text-dark)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full rounded-md bg-[var(--text-dark)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                {isSubmitting ? "Submitting..." : "Request Support"}
              </button>
            </form>
            {statusMessage ? (
              <p
                className={`mt-2 text-center text-xs ${
                  isError ? "text-red-200" : "text-emerald-200"
                }`}
              >
                {statusMessage}
              </p>
            ) : null}

            <p className="mt-3 text-center text-xs leading-snug text-white/90">
              Our team will contact you within 24 hours.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
