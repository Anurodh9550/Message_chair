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

export default function ClaimWarrantyPage() {
  const [message, setMessage] = useState("");
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
      const response = await fetch(`${apiBase}/warranty-claims/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: String(formData.get("customerName") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          product_name: String(formData.get("productName") || "").trim(),
          purchase_date: String(formData.get("purchaseDate") || "").trim(),
          issue: String(formData.get("issue") || "").trim(),
          status: "pending",
        }),
      });
      const text = await response.text();
      if (!response.ok) {
        setIsError(true);
        setMessage(formatApiError(response.status, text));
        return;
      }
      form.reset();
      setMessage("Warranty claim submitted successfully.");
    } catch {
      setIsError(true);
      setMessage("Submit failed. Check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f7faf8] py-10">
      <section className="mx-auto w-[95%] max-w-3xl rounded-2xl border border-[#d8e6dc] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#63c66d]">
          Support
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900">
         Kila Support
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Fill this form and our service team will contact you quickly.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="customerName"
              type="text"
              placeholder="Customer Name"
              required
              className="rounded-lg border border-[#cfe2d2] px-3 py-2.5 outline-none focus:border-[#63c66d]"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="rounded-lg border border-[#cfe2d2] px-3 py-2.5 outline-none focus:border-[#63c66d]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="phone"
              type="text"
              placeholder="Phone Number"
              required
              className="rounded-lg border border-[#cfe2d2] px-3 py-2.5 outline-none focus:border-[#63c66d]"
            />
            <input
              name="purchaseDate"
              type="date"
              required
              className="rounded-lg border border-[#cfe2d2] px-3 py-2.5 outline-none focus:border-[#63c66d]"
            />
          </div>
          <input
            name="productName"
            type="text"
            placeholder="Product Name"
            required
            className="w-full rounded-lg border border-[#cfe2d2] px-3 py-2.5 outline-none focus:border-[#63c66d]"
          />
          <textarea
            name="issue"
            placeholder="Describe issue"
            rows={5}
            required
            className="w-full rounded-lg border border-[#cfe2d2] px-3 py-2.5 outline-none focus:border-[#63c66d]"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#4f3a35] px-6 py-2.5 text-sm text-white transition hover:bg-[#5b4740]"
          >
            {isSubmitting ? "Submitting..." : "Kila Support"}
          </button>
          {message ? (
            <p
              className={`text-sm ${isError ? "text-red-700" : "text-green-700"}`}
              role={isError ? "alert" : "status"}
            >
              {message}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
