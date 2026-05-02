"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useStore } from "../../context/StoreContext";
import { getApiBaseUrl } from "../../utils/apiBase";

type CollectionDetail = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  oldPrice: string;
  image: string;
  highlights: string[];
};

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  short_description?: string;
  price: string;
  old_price?: string;
  image_url?: string;
  hover_image?: string;
  product_features?: string[];
};

const getNumericPrice = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { addToCart } = useStore();
  const resolvedParams = use(params);
  const apiBase = getApiBaseUrl();
  const [apiProduct, setApiProduct] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams({
          slug: resolvedParams.slug,
          page_size: "5",
        });
        const response = await fetch(`${apiBase}/products/?${qs.toString()}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("product fetch failed");
        const payload = (await response.json()) as { results?: ApiProduct[] };
        const found = payload.results?.[0];
        if (!found) {
          setApiProduct(null);
          return;
        }
        const img = found.image_url || "/items/p1.jpg";
        setApiProduct({
          slug: found.slug,
          title: found.name,
          subtitle: found.short_description || "Premium wellness collection.",
          price: formatCurrency(found.price),
          oldPrice: found.old_price
            ? formatCurrency(found.old_price)
            : formatCurrency(found.price),
          image: img,
          highlights: found.product_features?.length
            ? found.product_features
            : ["Premium Build", "Comfort Therapy", "Daily Wellness"],
        });
      } catch {
        setApiProduct(null);
      } finally {
        setLoading(false);
      }
    };
    void loadProduct();
  }, [apiBase, resolvedParams.slug]);

  const product = apiProduct;

  if (loading && !product) {
    return (
      <div className="bg-[#f6f8fc] pb-16 pt-28 text-[#4b2e2b]">
        <section className="mx-auto w-[95%] max-w-[900px] rounded-2xl border border-[#f0dccd] bg-white p-8 text-center">
          <p className="text-stone-600">Loading collection details...</p>
        </section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#f6f8fc] pb-16 pt-28 text-[#4b2e2b]">
        <section className="mx-auto w-[95%] max-w-[900px] rounded-2xl border border-[#f0dccd] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-stone-900">
            Collection not found
          </h1>
          <p className="mt-2 text-stone-600">
            This product is not in the catalog yet. Add it from the admin panel or
            run backend seed.
          </p>
          <Link
            href="/collections"
            className="mt-5 inline-block rounded-lg bg-[#c7794a] px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to all collections
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8fc] pb-16 pt-28 text-[#4b2e2b]">
      <section className="mx-auto grid w-[95%] max-w-[1100px] gap-8 rounded-2xl border border-[#f0dccd] bg-white p-6 md:grid-cols-2 md:p-10">
        <div className="overflow-hidden rounded-xl bg-[#f8f8f8] p-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-[360px] w-full object-contain"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#c7794a]">
            Collection
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">
            {product.title}
          </h1>
          <p className="mt-3 text-stone-600">{product.subtitle}</p>

          <div className="mt-4">
            <p className="text-sm text-stone-400 line-through">
              {product.oldPrice}
            </p>
            <p className="text-2xl font-semibold text-stone-900">
              {product.price}
            </p>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-stone-700">
            {product.highlights.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                addToCart({
                  id: product.slug,
                  name: product.title,
                  img: product.image,
                  price: getNumericPrice(product.price),
                })
              }
              className="rounded-lg bg-[#c7794a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#d18856]"
            >
              Add to cart
            </button>
            <Link
              href="/collections"
              className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              View all collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
