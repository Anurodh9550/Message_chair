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
  product_features?: string[];
};

const collectionDetails: CollectionDetail[] = [
  {
    slug: "opulent-neo",
    title: "Opulent Neo Massage Chair",
    subtitle: "Premium 4D robotic relaxation for home and office wellness.",
    price: "Rs. 339,999.00",
    oldPrice: "Rs. 399,000.00",
    image: "/items/p1.jpg",
    highlights: [
      "4D Intelligent Rollers",
      "Zero Gravity Recline",
      "Heat Therapy",
    ],
  },
  {
    slug: "enigma-plus",
    title: "Enigma Plus Chair",
    subtitle: "Smart massage programs with deep tissue and calf support.",
    price: "Rs. 289,999.00",
    oldPrice: "Rs. 349,000.00",
    image: "/items/p3.jpg",
    highlights: ["AI Body Scan", "Foot & Calf Care", "Bluetooth Controls"],
  },
  {
    slug: "magic-plus",
    title: "Magic Plus Advanced Chair",
    subtitle: "Compact premium comfort with heat and zero gravity modes.",
    price: "Rs. 98,999.00",
    oldPrice: "Rs. 245,000.00",
    image: "/p5.png",
    highlights: ["Space Saving Design", "Heat Therapy", "Family Friendly"],
  },
  {
    slug: "majestic-neo",
    title: "Majestic Neo Zero Gravity",
    subtitle: "Balanced full-body therapy with luxury recline comfort.",
    price: "Rs. 210,999.00",
    oldPrice: "Rs. 295,000.00",
    image: "/items/p2.jpg",
    highlights: ["Zero Gravity", "Air Compression Massage", "Back Relief Mode"],
  },
  {
    slug: "eye-massager",
    title: "Eye Massager",
    subtitle: "Gentle eye care for stress reduction and quick relaxation.",
    price: "Rs. 8,999.00",
    oldPrice: "Rs. 12,999.00",
    image: "/items/p1.jpg",
    highlights: ["Heat Compress", "Vibration Therapy", "Portable Use"],
  },
  {
    slug: "hand-massager",
    title: "Hand Massager",
    subtitle: "Targeted palm and finger relief after long work sessions.",
    price: "Rs. 7,499.00",
    oldPrice: "Rs. 10,499.00",
    image: "/items/p2.jpg",
    highlights: ["Air Pressure Massage", "Portable Build", "Easy Controls"],
  },
  {
    slug: "massage-cushion",
    title: "Massage Cushion",
    subtitle: "Portable back and waist support for chair, car, or office use.",
    price: "Rs. 5,999.00",
    oldPrice: "Rs. 8,499.00",
    image: "/items/p3.jpg",
    highlights: ["Dual Node Massage", "Heat Option", "Multi-Use Design"],
  },
  {
    slug: "eden-foot",
    title: "Eden Foot Massager",
    subtitle: "Comfortable foot care with rolling and kneading therapy.",
    price: "Rs. 20,999.00",
    oldPrice: "Rs. 28,999.00",
    image: "/items/p1.jpg",
    highlights: ["Kneading Rollers", "Relax Mode", "Deep Tissue Relief"],
  },
  {
    slug: "alis-foot",
    title: "Alis Foot Massager",
    subtitle: "Compact massager for daily leg and foot relaxation.",
    price: "Rs. 18,499.00",
    oldPrice: "Rs. 24,999.00",
    image: "/items/p2.jpg",
    highlights: ["Compact Body", "Easy Cleaning", "Gentle Compression"],
  },
  {
    slug: "sage-leg",
    title: "Sage Leg Massager",
    subtitle: "Relieve leg fatigue with dynamic compression and heat support.",
    price: "Rs. 15,999.00",
    oldPrice: "Rs. 21,999.00",
    image: "/items/p3.jpg",
    highlights: ["Leg Compression", "Heat Relaxation", "Adjustable Modes"],
  },
  {
    slug: "cosset-leg",
    title: "Cosset Leg Massager",
    subtitle: "Advanced leg therapy for recovery and daily comfort.",
    price: "Rs. 17,999.00",
    oldPrice: "Rs. 23,999.00",
    image: "/items/p1.jpg",
    highlights: ["Calf Coverage", "Pressure Control", "Recovery Programs"],
  },
  {
    slug: "minilux-back",
    title: "Minilux Back Massager",
    subtitle: "Portable back relaxation with focused shiatsu points.",
    price: "Rs. 6,999.00",
    oldPrice: "Rs. 9,999.00",
    image: "/items/p2.jpg",
    highlights: ["Shiatsu Nodes", "Heat Assist", "Office Friendly"],
  },
  {
    slug: "smart-pad",
    title: "Smart Pad Massager",
    subtitle: "Lightweight portable massage pad for neck and back support.",
    price: "Rs. 4,999.00",
    oldPrice: "Rs. 7,499.00",
    image: "/items/p3.jpg",
    highlights: ["Portable Pad", "Quick Sessions", "Rechargeable"],
  },
];

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
  const localProduct = collectionDetails.find(
    (item) => item.slug === resolvedParams.slug,
  );
  const [apiProduct, setApiProduct] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(
          `${apiBase}/products/?search=${encodeURIComponent(resolvedParams.slug)}`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("product fetch failed");
        const payload = (await response.json()) as { results?: ApiProduct[] };
        const found = (payload.results ?? []).find(
          (item) => item.slug === resolvedParams.slug,
        );
        if (!found) {
          setApiProduct(null);
          return;
        }
        setApiProduct({
          slug: found.slug,
          title: found.name,
          subtitle: found.short_description || "Premium wellness collection.",
          price: formatCurrency(found.price),
          oldPrice: found.old_price
            ? formatCurrency(found.old_price)
            : formatCurrency(found.price),
          image: found.image_url || "/items/p1.jpg",
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

  const product = apiProduct ?? localProduct;

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
            This product page is not available right now.
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
