"use client";
import { FormEvent, useState } from "react";
import { getApiBaseUrl } from "../utils/apiBase";

function formatApiError(status: number, bodyText: string): string {
  try {
    const parsed = JSON.parse(bodyText) as Record<string, unknown>;
    const parts = Object.entries(parsed).map(([key, val]) => {
      if (Array.isArray(val)) return `${key}: ${val.join(", ")}`;
      if (val != null && typeof val === "object")
        return `${key}: ${JSON.stringify(val)}`;
      return `${key}: ${String(val)}`;
    });
    if (parts.length) return parts.join(" · ");
  } catch {
    /* ignore */
  }
  return bodyText.trim() || `Request failed (${status})`;
}

export default function ContactPage() {
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBase = getApiBaseUrl();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);
    setIsError(false);
    try {
      const response = await fetch(`${apiBase}/contact-submissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          comment: String(formData.get("comment") || "").trim(),
          status: "new",
        }),
      });
      const text = await response.text();
      if (!response.ok) {
        setIsError(true);
        setStatusMessage(formatApiError(response.status, text));
        return;
      }
      form.reset();
      setStatusMessage("Thanks! Your message has been submitted successfully.");
    } catch {
      setIsError(true);
      setStatusMessage("Submission failed. Check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* 🔥 HERO IMAGE */}
      <div className="h-[220px] w-full overflow-hidden sm:h-[280px] md:h-[350px]">
        <img
          src="/contecbg.png"
          alt="Contact Banner"
          className="h-full w-full object-cover"
        />
      </div>
      {/* 🔥 FORM SECTION */}
      <section className="mx-auto w-[95%] max-w-[900px] py-12">
        <h2 className="mb-6 text-xl font-semibold text-[#4f3a35] sm:text-2xl">
          Questions or comments? Get in touch and we&apos;ll be happy to help.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="name"
              type="text"
              placeholder="Name *"
              required
              className="w-full rounded-md border border-[#cfe2d2] p-3 outline-none focus:border-[#5b4740]"
            />
            <input
              name="email"
              type="email"
              placeholder="Email *"
              required
              className="w-full rounded-md border border-[#cfe2d2] p-3 outline-none focus:border-[#5b4740]"
            />
          </div>

          <input
            name="phone"
            type="text"
            placeholder="Phone number"
            className="w-full rounded-md border border-[#cfe2d2] p-3 outline-none focus:border-[#5b4740]"
          />

          <textarea
            name="comment"
            placeholder="Comment"
            rows={5}
            required
            className="w-full rounded-md border border-[#cfe2d2] p-3 outline-none focus:border-[#5b4740]"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="premium-btn w-full rounded-md bg-[#4f3a35] px-6 py-3 text-white transition hover:bg-[#5b4740] sm:w-auto"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
          {statusMessage && (
            <p
              className={`text-sm ${isError ? "text-red-700" : "text-green-700"}`}
              role={isError ? "alert" : "status"}
            >
              {statusMessage}
            </p>
          )}
        </form>
      </section>

      {/* 🔥 GREEN INFO CARDS */}
      <section className="bg-gradient-to-r from-[#5b4740] to-[#4f3a35] py-10">
        <div className="mx-auto grid w-[95%] max-w-[1280px] gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-[#4f3a35] p-6 text-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">For Service Queries</h3>
            <p className="text-sm">E-mail: customercare@robocura.com</p>
            <p className="text-sm">Call: +91 9910339544</p>
          </div>

          <div className="rounded-xl bg-[#4f3a35] p-6 text-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">For Product Queries</h3>
            <p className="text-sm">E-mail: enquiry@robocura.com</p>
            <p className="text-sm">Call: +91 9910339544</p>
          </div>

          <div className="rounded-xl bg-[#4f3a35] p-6 text-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              For Dealerships Queries
            </h3>
            <p className="text-sm">E-mail: enquiry@robocura.com</p>
            <p className="text-sm">Phone: +91 9910339544</p>
          </div>
        </div>
      </section>

      {/* 🔥 GOOGLE MAP */}
      <section className="w-full h-[400px]">
        <iframe
          src="https://www.google.com/maps?q=Delhi&output=embed"
          width="100%"
          height="100%"
          loading="lazy"
          className="border-0"
        ></iframe>
      </section>
    </div>
  );
}
