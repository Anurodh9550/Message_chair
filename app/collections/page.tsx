"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "../context/StoreContext";

type CollectionProduct = {
  id: string;
  name: string;
  img: string;
  hoverImg?: string;
  price: string;
  oldPrice: string;
  discount: string;
  tag: "Sale" | "Sold out";
  category: string;
  type: "Premium" | "Zero Gravity" | "Office" | "Family" | "Compact";
};

const products: CollectionProduct[] = [
  {
    id: "kila-opulant-neo",
    name: "Opulant Neo Massage Chair",
    img: "/items/p1.jpg",
    hoverImg: "/items/p3.jpg",
    price: "Rs. 339,999.00",
    oldPrice: "Rs. 399,000.00",
    discount: "14%",
    tag: "Sale",
    category: "Premium 4D",
    type: "Premium",
  },
  {
    id: "kila-royal-recline",
    name: "Royal Recline Massage Chair",
    img: "/items/p3.jpg",
    hoverImg: "/items/p1.jpg",
    price: "Rs. 289,999.00",
    oldPrice: "Rs. 349,000.00",
    discount: "17%",
    tag: "Sale",
    category: "Luxury Series",
    type: "Premium",
  },
  {
    id: "kila-majestic-neo",
    name: "Majestic Neo Zero Gravity",
    img: "/items/p2.jpg",
    hoverImg: "/items/p3.jpg",
    price: "Rs. 210,999.00",
    oldPrice: "Rs. 295,000.00",
    discount: "28%",
    tag: "Sale",
    category: "Zero Gravity",
    type: "Zero Gravity",
  },
  {
    id: "kila-serene-office",
    name: "Serene Office Smart Chair",
    img: "/items/p1.jpg",
    hoverImg: "/items/p2.jpg",
    price: "Rs. 161,499.00",
    oldPrice: "Rs. 195,000.00",
    discount: "17%",
    tag: "Sale",
    category: "Office Comfort",
    type: "Office",
  },
  {
    id: "kila-magic-plus",
    name: "Magic Plus Advanced Chair",
    img: "/p5.png",
    hoverImg: "/items/p3.jpg",
    price: "Rs. 98,999.00",
    oldPrice: "Rs. 245,000.00",
    discount: "59%",
    tag: "Sale",
    category: "Family Choice",
    type: "Family",
  },
  {
    id: "kila-elegant-body",
    name: "Elegant Full Body Chair",
    img: "/items/p2.jpg",
    hoverImg: "/items/p1.jpg",
    price: "Rs. 144,999.00",
    oldPrice: "Rs. 189,000.00",
    discount: "23%",
    tag: "Sale",
    category: "Full Body",
    type: "Family",
  },
  {
    id: "kila-zen-heat",
    name: "Zen Heat Therapy Chair",
    img: "/items/p3.jpg",
    hoverImg: "/items/p2.jpg",
    price: "Rs. 124,999.00",
    oldPrice: "Rs. 169,000.00",
    discount: "26%",
    tag: "Sale",
    category: "Heat Therapy",
    type: "Office",
  },
  {
    id: "kila-compact-lite",
    name: "Compact Lite Massage Chair",
    img: "/items/p1.jpg",
    hoverImg: "/items/p3.jpg",
    price: "Rs. 84,999.00",
    oldPrice: "Rs. 119,000.00",
    discount: "29%",
    tag: "Sale",
    category: "Compact Series",
    type: "Compact",
  },
  {
    id: "kila-regal-ai",
    name: "Regal AI Voice Chair",
    img: "/items/p2.jpg",
    hoverImg: "/items/p1.jpg",
    price: "Rs. 399,999.00",
    oldPrice: "Rs. 449,000.00",
    discount: "11%",
    tag: "Sale",
    category: "AI Smart",
    type: "Premium",
  },
  {
    id: "kila-dual-relief",
    name: "Dual Relief Leg Massage Chair",
    img: "/items/p3.jpg",
    hoverImg: "/items/p2.jpg",
    price: "Rs. 174,999.00",
    oldPrice: "Rs. 219,000.00",
    discount: "20%",
    tag: "Sold out",
    category: "Leg Care",
    type: "Zero Gravity",
  },
];

const chairTypeSections: {
  type: CollectionProduct["type"];
  title: string;
  description: string;
}[] = [
  {
    type: "Premium",
    title: "Premium Massage Chairs",
    description:
      "Classic flagship designs with AI controls, deep tissue comfort, and luxury finish.",
  },
  {
    type: "Zero Gravity",
    title: "Zero Gravity Collection",
    description:
      "Spine-friendly recline positions designed to reduce pressure and support recovery.",
  },
  {
    type: "Office",
    title: "Office Wellness Chairs",
    description:
      "Built for long desk hours with posture support and daily stress relief modes.",
  },
  {
    type: "Family",
    title: "Family Comfort Series",
    description:
      "Balanced comfort chairs suitable for daily home use across all age groups.",
  },
  {
    type: "Compact",
    title: "Compact Space-Saver Chairs",
    description:
      "Smaller footprint chairs with strong massage programs for modern apartments.",
  },
];

function CollectionsContent() {
  const { addToCart } = useStore();
  const searchParams = useSearchParams();

  const getNumericPrice = (value: string) =>
    Number(value.replace(/Rs\.\s?/g, "").replace(/,/g, ""));

  const selectedType = searchParams.get("type") as CollectionProduct["type"] | null;
  const validSelectedType =
    selectedType &&
    chairTypeSections.some((section) => section.type === selectedType)
      ? selectedType
      : null;

  const visibleSections = useMemo(
    () =>
      validSelectedType
        ? chairTypeSections.filter((section) => section.type === validSelectedType)
        : chairTypeSections,
    [validSelectedType],
  );

  return (
    <div className="bg-[#f7faf8] pb-16 text-[#4f3a35]">
      <section className="mx-auto w-[95%] max-w-[1280px]">
        <div className="mb-10 rounded-2xl border border-[#d9ebdc] bg-white p-5 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#63c66d]">
            Kila Store
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900 md:text-4xl">
            All Collections
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Explore our complete massage chair range curated for home, office,
            and premium wellness comfort.
          </p>
          {validSelectedType ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#ebf8ee] px-3 py-1 text-sm text-[#2f8a44]">
                Filter: {validSelectedType}
              </span>
              <Link
                href="/collections"
                className="text-sm font-medium text-[#4f3a35] underline"
              >
                Show all categories
              </Link>
            </div>
          ) : null}
        </div>

        <div className="space-y-10">
          {visibleSections.map((section) => {
            const sectionProducts = products.filter(
              (item) => item.type === section.type,
            );

            return (
              <section
                key={section.type}
                className="rounded-2xl border border-[#d9ebdc] bg-white p-5 shadow-sm sm:p-7"
              >
                <div className="mb-6 border-b border-[#ebf2ed] pb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#63c66d]">
                    {section.type}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-stone-900">
                    {section.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-stone-600">
                    {section.description}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {sectionProducts.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -8 }}
                      className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        <span className="absolute right-2 top-2 z-10 rounded bg-green-500 px-2 py-1 text-xs text-white">
                          {item.discount}
                        </span>

                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-[190px] w-full object-contain transition duration-500 group-hover:scale-110 group-hover:opacity-0"
                        />

                        {item.hoverImg && (
                          <img
                            src={item.hoverImg}
                            alt={`${item.name} alternate`}
                            className="absolute left-0 top-0 h-[190px] w-full object-contain opacity-0 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
                          />
                        )}

                        <span className="absolute bottom-2 left-2 rounded-full bg-gray-800 px-3 py-1 text-xs text-white">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-sm font-medium text-stone-700">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-wide text-stone-500">
                        {item.category}
                      </p>

                      <div className="mt-2">
                        <p className="text-sm text-stone-400 line-through">
                          {item.oldPrice}
                        </p>
                        <p className="text-lg font-semibold text-stone-900">
                          {item.price}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            img: item.img,
                            price: getNumericPrice(item.price),
                          })
                        }
                        disabled={item.tag === "Sold out"}
                        className={`mt-3 w-full rounded-lg border py-2 text-sm transition-all duration-300 ${
                          item.tag === "Sold out"
                            ? "cursor-not-allowed border-stone-200 text-stone-400"
                            : "border-stone-900 group-hover:bg-black group-hover:text-white"
                        }`}
                      >
                        {item.tag === "Sold out" ? "Sold out" : "Add to cart"}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="bg-[#f7faf8] pb-16" />}>
      <CollectionsContent />
    </Suspense>
  );
}
