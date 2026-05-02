"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "../utils/apiBase";

type GoogleReview = {
  id: number;
  name: string;
  review_text: string;
  rating: number;
  source_label?: string;
  source_url?: string;
  reviewed_at?: string;
};

export default function AllReviewsPage() {
  const apiBase = getApiBaseUrl();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const all: GoogleReview[] = [];
        let url: string | null = `${apiBase}/google-reviews/?all=1&ordering=display_order`;
        while (url) {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) {
            throw new Error("Failed to load reviews");
          }
          const data = (await res.json()) as {
            results?: GoogleReview[];
            next?: string | null;
          };
          all.push(...(data.results ?? []));
          url = data.next ?? null;
        }
        setReviews(all);
      } catch {
        setError("Reviews could not be loaded. Please try again later.");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [apiBase]);

  const averageRating = useMemo(
    () =>
      (
        reviews.reduce((sum, item) => sum + item.rating, 0) /
        Math.max(reviews.length, 1)
      ).toFixed(1),
    [reviews],
  );

  return (
    <div className="min-h-screen bg-[#f6f8fc] py-12 text-[#2b2b2b]">
      <div className="mx-auto w-[95%] max-w-[1280px]">
        <div className="mb-10 flex flex-col gap-6 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-[#7a4b2f] transition hover:underline"
            >
              ← Back to home
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-wide text-stone-900">
              Google rating &amp; reviews
            </h1>
            <p className="mt-2 text-stone-600">
              All customer reviews (Google and other sources).
            </p>
          </div>
          <div className="flex w-fit flex-wrap items-center gap-3 self-start rounded-full border border-amber-200 bg-amber-50 px-5 py-2 sm:self-auto">
            <span className="text-2xl font-bold text-stone-900">
              {averageRating}
            </span>
            <span className="text-xl text-amber-500">★★★★★</span>
            <span className="text-sm text-stone-600">
              <span className="font-semibold text-stone-900">
                {reviews.length}
              </span>{" "}
              reviews
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-stone-600">Loading reviews…</p>
        ) : null}
        {error ? <p className="text-rose-600">{error}</p> : null}

        {!loading && !error && reviews.length === 0 ? (
          <p className="text-stone-600">No reviews available yet.</p>
        ) : null}

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50 to-white p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <h2 className="font-semibold text-stone-900">{item.name}</h2>
              <p className="text-sm text-stone-600">
                {item.reviewed_at ?? "Recently"}
              </p>
              <div className="mt-1 text-amber-500">
                {"★".repeat(Math.max(1, Math.min(item.rating, 5)))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">
                {item.review_text}
              </p>
              <p className="mt-4 text-xs text-stone-600">
                Posted on{" "}
                <span className="font-bold">
                  {item.source_label || "Google"}
                </span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
