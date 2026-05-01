"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "../context/StoreContext";
import { getApiBaseUrl } from "../utils/apiBase";

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  image_url?: string;
  hover_image?: string;
  price: string;
  old_price?: string;
  in_stock: boolean;
  badge_label?: string;
  category?: string;
  chair_type?: string;
  collection_name: string;
  collection_slug: string;
  collection_description?: string;
};

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function CollectionsContent() {
  const apiBase = getApiBaseUrl();
  const { addToCart } = useStore();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${apiBase}/products/?page_size=200`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("products fetch failed");
        const payload = (await response.json()) as { results?: ApiProduct[] };
        setProducts(payload.results ?? []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    void loadProducts();
  }, [apiBase]);

  const getNumericPrice = (value: string | number) => Number(value || 0);

  const allTypes = useMemo(
    () =>
      Array.from(
        new Set(products.map((item) => item.chair_type).filter(Boolean) as string[]),
      ),
    [products],
  );
  const selectedType = searchParams.get("type");
  const validSelectedType =
    selectedType && allTypes.includes(selectedType) ? selectedType : null;

  const sections = useMemo(() => {
    const grouped = new Map<
      string,
      { title: string; description: string; products: ApiProduct[] }
    >();
    products.forEach((item) => {
      const key = item.collection_slug || item.collection_name || "misc";
      const existing = grouped.get(key);
      if (existing) {
        existing.products.push(item);
        return;
      }
      grouped.set(key, {
        title: item.collection_name || "Collection",
        description: item.collection_description || "Premium wellness products.",
        products: [item],
      });
    });
    return Array.from(grouped.values());
  }, [products]);

  const visibleSections = useMemo(
    () => sections
      .map((section) => ({
        ...section,
        products: validSelectedType
          ? section.products.filter((p) => p.chair_type === validSelectedType)
          : section.products,
      }))
      .filter((section) => section.products.length > 0),
    [sections, validSelectedType],
  );

  return (
    <div className="bg-[#f6f8fc] pb-16 text-[#4b2e2b]">
      <section className="mx-auto w-[95%] max-w-[1280px]">
        <div className="mb-10 rounded-2xl border border-[#f0dccd] bg-white p-5 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c7794a]">
            Kila Store
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900 md:text-4xl">
            All Collections
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Explore our complete massage chair range curated for home, office,
            and premium wellness comfort.
          </p>
          {validSelectedType && !loading ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#fff1e7] px-3 py-1 text-sm text-[#7a4b2f]">
                Filter: {validSelectedType}
              </span>
              <Link
                href="/collections"
                className="text-sm font-medium text-[#4b2e2b] underline"
              >
                Show all categories
              </Link>
            </div>
          ) : null}
        </div>

        <div className="space-y-10">
          {loading ? (
            <section className="rounded-2xl border border-[#f0dccd] bg-white p-8 text-center text-stone-600">
              Loading collections...
            </section>
          ) : visibleSections.length === 0 ? (
            <section className="rounded-2xl border border-[#f0dccd] bg-white p-8 text-center text-stone-600">
              No products available right now.
            </section>
          ) : (
            visibleSections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-[#f0dccd] bg-white p-5 shadow-sm sm:p-7"
              >
                <div className="mb-6 border-b border-[#ebf2ed] pb-4">
                  <h2 className="mt-1 text-2xl font-semibold text-stone-900">
                    {section.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-stone-600">
                    {section.description}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {section.products.map((item) => {
                    const oldPrice = Number(item.old_price || item.price || 0);
                    const currentPrice = Number(item.price || 0);
                    const discount =
                      oldPrice > currentPrice && oldPrice > 0
                        ? `${Math.round(((oldPrice - currentPrice) / oldPrice) * 100)}%`
                        : "0%";
                    const badge =
                      item.badge_label || (item.in_stock ? "Sale" : "Sold out");
                    return (
                    <motion.div
                      key={item.slug}
                      whileHover={{ y: -8 }}
                      className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        <span className="absolute right-2 top-2 z-10 rounded bg-green-500 px-2 py-1 text-xs text-white">
                          {discount}
                        </span>

                        <img
                          src={item.image_url || "/items/p1.jpg"}
                          alt={item.name}
                          className="h-[190px] w-full object-contain transition duration-500 group-hover:scale-110 group-hover:opacity-0"
                        />

                        {item.hover_image && (
                          <img
                            src={item.hover_image}
                            alt={`${item.name} alternate`}
                            className="absolute left-0 top-0 h-[190px] w-full object-contain opacity-0 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
                          />
                        )}

                        <span className="absolute bottom-2 left-2 rounded-full bg-gray-800 px-3 py-1 text-xs text-white">
                          {badge}
                        </span>
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-sm font-medium text-stone-700">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-wide text-stone-500">
                        {item.category || item.collection_name}
                      </p>

                      <div className="mt-2">
                        <p className="text-sm text-stone-400 line-through">
                          {formatCurrency(oldPrice)}
                        </p>
                        <p className="text-lg font-semibold text-stone-900">
                          {formatCurrency(currentPrice)}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            id: item.slug,
                            name: item.name,
                            img: item.image_url || "/items/p1.jpg",
                            price: getNumericPrice(item.price),
                          })
                        }
                        disabled={!item.in_stock}
                        className={`mt-3 w-full rounded-lg border py-2 text-sm transition-all duration-300 ${
                          !item.in_stock
                            ? "cursor-not-allowed border-stone-200 text-stone-400"
                            : "border-stone-900 group-hover:bg-black group-hover:text-white"
                        }`}
                      >
                        {!item.in_stock ? "Sold out" : "Add to cart"}
                      </button>
                    </motion.div>
                  )})}
                </div>
              </section>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="bg-[#f6f8fc] pb-16" />}>
      <CollectionsContent />
    </Suspense>
  );
}
