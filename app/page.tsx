"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "./context/StoreContext";
import { useState, useEffect } from "react";
import { BadgeCheck, ShieldCheck, Truck, Wallet } from "lucide-react";
import { getApiBaseUrl } from "./utils/apiBase";

const products = [
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
  },
];

type HomeProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  old_price?: string;
  image_url?: string;
  collection_name: string;
  in_stock: boolean;
  show_on_home?: boolean;
  home_order?: number;
  product_features?: string[];
};

type DisplayProductCard = {
  id: string;
  slug?: string;
  detailHref?: string;
  name: string;
  img: string;
  hoverImg?: string;
  price: string;
  oldPrice: string;
  discount: string;
  tag: string;
  category: string;
  features?: string[];
};

type GoogleReview = {
  id: number;
  name: string;
  review_text: string;
  rating: number;
  source_label: string;
  source_url?: string;
  reviewed_at?: string;
};

const fallbackReviews: GoogleReview[] = [
  {
    id: 1,
    name: "Sonu Prasad",
    reviewed_at: "2023-01-10",
    source_label: "Google",
    rating: 5,
    review_text:
      "Writing this review after using the chair for 10 days. I sit all day in the office and used to have body pain and stiffness. Robocura's Serene has helped me relax and smoothen my muscles.",
  },
  {
    id: 2,
    name: "Kailash Babu",
    reviewed_at: "2020-08-20",
    source_label: "Google",
    rating: 5,
    review_text: "Nice products",
  },
  {
    id: 3,
    name: "Sadaf Chaudhry",
    reviewed_at: "2020-05-12",
    source_label: "Google",
    rating: 5,
    review_text: "Tried in GIP Mall Noida. Amazing experience and felt refreshed",
  },
];

const marketplaces = [
  { name: "Indiamart", img: "/brand/inda.jpg" },
  { name: "Amazon", img: "/brand/amoz.jpg" },
  { name: "Justdial", img: "/brand/jd.jpg" },
  { name: "Flipkart", img: "/brand/filp.jpg" },
];

const featureHighlights = [
  "4D Intelligent Massage Rollers",
  "Zero Gravity Recline & Spinal Alignment",
  "Heat Therapy for Back & Leg Relief",
];
const slides = [
  {
    image: "/images/banner1.png",
    title: "Comfort with KILA Energy Massage Chair",
    subtitle: "",
    badge: "Premium Wellness",
    emphasis: "Massage Chair",
    points: ["Heat Therapy", "Swing Mode", "Zero Gravity"],
  },
  {
    image: "/images/banner2.png",
    title: "Wedding Gift Special Massage Chair",
    subtitle: "",
    badge: "Limited Edition",
    emphasis: "Wedding Gift",
    points: ["Luxury Design", "Family Comfort", "Smart Controls"],
  },
  {
    image: "/images/banner4.png",
    title: "Boost Productivity with Relaxation",
    subtitle: "",
    badge: "Office Comfort",
    emphasis: "Magic Plus",
    points: ["Reduce Stress", "Improve Focus", "Relieve Back Pain"],
    alignRight: true,
  },
];

export default function Home() {
  const { addToCart } = useStore();
  const apiBase = getApiBaseUrl();

  const getNumericPrice = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const [current, setCurrent] = useState(0);
  const [reviewList, setReviewList] = useState<GoogleReview[]>(fallbackReviews);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [homeProducts, setHomeProducts] = useState<HomeProduct[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch(
          `${apiBase}/google-reviews/?ordering=display_order`,
          {
            cache: "no-store",
          },
        );
        if (!response.ok) {
          throw new Error("reviews fetch failed");
        }
        const payload = (await response.json()) as {
          results?: GoogleReview[];
        };
        if (payload.results?.length) {
          setReviewList(payload.results);
        }
      } catch {
        setReviewList(fallbackReviews);
      } finally {
        setReviewLoading(false);
      }
    };
    void loadReviews();
  }, [apiBase]);

  useEffect(() => {
    const loadHomeProducts = async () => {
      try {
        const response = await fetch(`${apiBase}/products/?ordering=home_order`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("products fetch failed");
        const payload = (await response.json()) as { results?: HomeProduct[] };
        const items = payload.results ?? [];
        const visible = items.filter((item) => item.show_on_home);
        if (visible.length > 0) {
          setHomeProducts(visible);
        } else {
          setHomeProducts(items.slice(0, 10));
        }
      } catch {
        setHomeProducts([]);
      }
    };
    void loadHomeProducts();
  }, [apiBase]);

  const formatCurrency = (value: string) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const averageRating = (
    reviewList.reduce((sum, item) => sum + item.rating, 0) /
    Math.max(reviewList.length, 1)
  ).toFixed(1);

  const displayProducts: DisplayProductCard[] =
    homeProducts.length > 0
      ? homeProducts.map((item) => ({
          id: `api-${item.id}`,
          slug: item.slug,
          detailHref: `/collections/${item.slug}`,
          name: item.name,
          img: item.image_url || "/items/p1.jpg",
          hoverImg: item.image_url || "/items/p1.jpg",
          price: formatCurrency(item.price),
          oldPrice: item.old_price
            ? formatCurrency(item.old_price)
            : formatCurrency(item.price),
          discount:
            item.old_price && Number(item.old_price) > Number(item.price)
              ? `${Math.round(
                  ((Number(item.old_price) - Number(item.price)) /
                    Number(item.old_price)) *
                    100,
                )}%`
              : "New",
          tag: item.in_stock ? "Sale" : "Sold out",
          category: item.collection_name,
          features: item.product_features ?? [],
        }))
      : products.map((item) => ({
          id: item.id,
          name: item.name,
          img: item.img,
          hoverImg: item.hoverImg,
          price: item.price,
          oldPrice: item.oldPrice,
          discount: item.discount,
          tag: item.tag,
          category: item.category,
        }));

  return (
    <div className="bg-[#f6f8fc] text-[#2b2b2b]">
      <section className="relative h-[550px] w-full overflow-hidden md:h-[700px]">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: current === index ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            aria-hidden={current !== index}
            className={`absolute inset-0 ${
              current === index ? "pointer-events-auto z-10" : "pointer-events-none z-0"
            }`}
          >
            {/* IMAGE */}
            <img
              src={slide.image}
              alt="banner"
              className="h-full w-full object-cover brightness-[1.2]"
            />

            {/* LIGHT GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/42 to-transparent"></div>

            {/* CONTENT */}
            <div
              className={`absolute inset-0 mx-auto flex max-w-[1280px] items-center px-6 ${
                slide.alignRight ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-2xl space-y-5">
                {/* SUBTITLE */}
                <p className="text-xs tracking-[0.3em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                  {slide.subtitle}
                </p>

                {/* TITLE */}
                <h1
                  className="text-4xl font-bold leading-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.58)] md:text-6xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {slide.title}
                </h1>

                {/* DESCRIPTION */}
                <p className="max-w-lg text-sm text-white md:text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                  Official premium massage technology with modern wellness
                  comfort for home and office use.
                </p>

                {/* BADGE */}
                <p className="inline-block rounded-full border border-[var(--accent)] bg-black/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)] backdrop-blur-sm">
                  {slide.badge}
                </p>

                {/* FEATURES */}
                <div
                  className={`flex flex-wrap gap-3 text-sm text-white ${
                    slide.alignRight ? "justify-end" : "justify-start"
                  }`}
                >
                  {slide.points.map((point) => (
                    <span
                      key={point}
                      className="rounded-full border border-white/30 bg-black/20 px-3 py-1 backdrop-blur-sm"
                    >
                      {point}
                    </span>
                  ))}
                </div>

                {/* BUTTONS */}
                <div
                  className={`flex flex-wrap gap-3 ${
                    slide.alignRight ? "justify-end" : "justify-start"
                  }`}
                >
                  <Link
                    href="/collections"
                    className="rounded-lg bg-[#c7794a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#d18856] transition"
                  >
                    Explore Collection
                  </Link>

                  <Link
                    href="/checkout"
                    className="rounded-lg border border-[#1f2937] bg-white px-5 py-2.5 text-sm font-medium text-[#1f2937] hover:bg-[#1f2937] hover:text-white transition"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* DOTS */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 w-7 rounded-full transition ${
                current === index ? "bg-[#4b2e2b]" : "bg-[#c7794a]"
              }`}
            ></button>
          ))}
        </div>

        {/* ARROWS */}
        <button
          onClick={() =>
            setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2"
        >
          ◀
        </button>

        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2"
        >
          ▶
        </button>
      </section>

      <section className="border-y border-[var(--border-light)] bg-[color:rgba(248,243,236,0.9)] py-5 text-[var(--text-primary)]">
        <div className="mx-auto grid w-[95%] max-w-[1280px] gap-3 md:grid-cols-4">
          {[
            {
              title: "Free Shipping",
              subtitle: "Free shipping across India",
              Icon: Truck,
            },
            {
              title: "No Cost EMI",
              subtitle: "No Cost EMI Option",
              Icon: Wallet,
            },
            {
              title: "Warranty",
              subtitle: "1 Year Warranty",
              Icon: ShieldCheck,
            },
            {
              title: "Trust Buy",
              subtitle: "Robocura Trust Buy",
              Icon: BadgeCheck,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-base)] px-4 py-3"
            >
              <div className="rounded-full bg-[var(--surface-soft)] p-2">
                <item.Icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight text-[var(--text-primary)]">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[95%] max-w-[1280px] py-14">
        <h2 className="mb-8 text-3xl font-semibold">Shop Top Categories</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            {
              img: "/chair/chair1.png",
              label: "Full Body",
              type: "Family",
            },
            {
              img: "/chair/0 gravative.jpg",
              label: "Zero Gravity",
              type: "Zero Gravity",
            },
            {
              img: "/chair/4d Snart.jpg",
              label: "4D Smart AI",
              type: "Premium",
            },
            {
              img: "/chair/ai.jpg",
              label: "Luxury Series",
              type: "Premium",
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -4 }}
              className="cursor-pointer rounded-xl border border-[#f0dccd] bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <Link href={`/collections?type=${encodeURIComponent(item.type)}`}>
                <img
                  src={item.img}
                  alt={item.label}
                  className="mx-auto h-[280px] w-[280px] object-cover"
                />
                <p className="mt-4 text-center text-base font-medium text-stone-700">
                  {item.label}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid w-[95%] max-w-[1280px] gap-8 rounded-2xl border border-[#f0dccd] p-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-[#4b2e2b]">
              Official Feature Highlights
            </h2>
            <p className="text-[#6b4a3f]">
              Crafted for long sessions, ergonomic posture support, and luxury
              home aesthetics.
            </p>
            <Link
              href="/collections"
              className="premium-btn inline-block rounded-lg bg-[#c7794a] px-5 py-2.5 text-white transition hover:bg-[#d18856]"
            >
              View Collection
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-[#c7794a] p-6 text-white"
          >
            <h3 className="mb-4 text-xl font-semibold">
              Why customers trust us
            </h3>
            <div className="space-y-3">
              {featureHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-md bg-white/10 px-3 py-2 shadow-[0_6px_16px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-[0_10px_22px_rgba(0,0,0,0.2)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid w-[95%] max-w-[1280px] items-center gap-10 md:grid-cols-2">

  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="relative w-full overflow-hidden rounded-3xl shadow-lg aspect-video"
  >

    <video
      src="/videos/58354a8e62034d4f9719adf0c81a4696 (online-video-cutter.com).mp4"
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover block"
    />

  </motion.div>



          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-stone-900">
              About Kila
            </h2>

            <p className="mb-4 leading-relaxed text-stone-600">
              Kila combines robotics and wellness. We create robotic massage
              products that can be used in the comfort of your home.
            </p>

            <p className="mb-6 leading-relaxed text-stone-600">
              Our range includes massage pillows to full-body chairs. While
              expanding our inventory, we never compromise on quality because
              our customers always come first.
            </p>

            <div className="grid grid-cols-3 gap-4 rounded-xl bg-white p-6 text-center shadow-sm border border-[#c7794a]/25">
  
  <div>
    <p className="text-2xl font-bold text-[#7a4b2f]">10+</p>
    <p className="text-sm text-[#7a4b2f]">Categories</p>
  </div>

  <div>
    <p className="text-2xl font-bold text-[#7a4b2f]">100+</p>
    <p className="text-sm text-[#7a4b2f]">Products</p>
  </div>

  <div>
    <p className="text-2xl font-bold text-[#7a4b2f]">99%</p>
    <p className="text-sm text-[#7a4b2f]">Satisfied Customer</p>
  </div>

</div>

<Link
  href="/about"
  className="premium-btn mt-6 inline-block rounded-lg border border-[#c7794a] px-6 py-2 font-semibold text-white transition hover:bg-[#c7794a] hover:text-white"
>
  Know More
</Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto w-[95%] max-w-[1280px]">
          <h2 className="mb-2 text-3xl font-semibold text-stone-900">
            All Collections
          </h2>
          <p className="mb-10 text-stone-600">
            Explore our complete massage chair range curated for home, office,
            and premium wellness needs.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {displayProducts.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -8 }}
                className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative overflow-hidden rounded-xl">
                  {/* Discount */}
                  <span className="absolute right-2 top-2 z-10 rounded bg-green-500 px-2 py-1 text-xs text-white">
                    {item.discount}
                  </span>

                  {/* Image */}
                  {item.detailHref ? (
                    <Link href={item.detailHref}>
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-[180px] w-full object-contain transition duration-500 group-hover:scale-110 group-hover:opacity-0"
                      />
                    </Link>
                  ) : (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-[180px] w-full object-contain transition duration-500 group-hover:scale-110 group-hover:opacity-0"
                    />
                  )}

                  {/* Hover Image */}
                  {item.hoverImg && (
                    <img
                      src={item.hoverImg}
                      alt="hover"
                      className="absolute top-0 left-0 h-[180px] w-full object-contain opacity-0 transition duration-500 group-hover:opacity-100 group-hover:scale-110"
                    />
                  )}

                  {/* Tag */}
                  <span className="absolute bottom-2 left-2 rounded-full bg-gray-800 px-3 py-1 text-xs text-white">
                    {item.tag}
                  </span>
                </div>

                {/* Name */}
                {item.detailHref ? (
                  <Link
                    href={item.detailHref}
                    className="mt-3 line-clamp-2 block text-sm font-medium text-stone-700 hover:underline"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <h3 className="mt-3 line-clamp-2 text-sm font-medium text-stone-700 hover:underline cursor-pointer">
                    {item.name}
                  </h3>
                )}
                <p className="mt-1 text-xs uppercase tracking-wide text-stone-600">
                  {item.category}
                </p>
                {item.features?.length ? (
                  <ul className="mt-2 space-y-1 text-xs text-stone-600">
                    {item.features.slice(0, 3).map((f) => (
                      <li key={f}>- {f}</li>
                    ))}
                  </ul>
                ) : null}
                {/* Price */}
                <div className="mt-2">
                  <p className="text-sm text-stone-500 line-through">
                    {item.oldPrice}
                  </p>
                  <p className="text-lg font-semibold text-stone-900">
                    {item.price}
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    addToCart({
                      id: item.slug ?? item.id,
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
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-[95%] max-w-[1280px] text-center">
          <h2 className="text-3xl font-semibold tracking-wide text-stone-900">
            Google Rating & Reviews
          </h2>
          <div className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-5 py-2">
            <span className="text-2xl font-bold text-stone-900">
              {averageRating}
            </span>
            <span className="text-xl text-amber-500">★★★★★</span>
            <span className="text-sm text-stone-600">
              Based on{" "}
              <span className="font-semibold text-stone-900">
                {reviewList.length} reviews
              </span>
            </span>
          </div>
          
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviewList.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50 to-white p-6 text-left shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-stone-900">{item.name}</h3>

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
          {reviewLoading ? (
            <p className="mt-4 text-sm text-stone-600">Loading reviews...</p>
          ) : null}
        </div>
      </section>

      <section className="w-full bg-gradient-to-r from-[#c7794a] to-[#7a4b2f] py-8">
        <div className="mx-auto w-full max-w-[1280px] px-4 text-center sm:px-6 md:px-12">
          <h2 className="mb-2 text-2xl font-semibold text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
            Our Online Marketplace Presence
          </h2>
          <p className="mb-6 text-sm text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            Trusted platforms where Kila wellness products are available.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            {marketplaces.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04, y: -3 }}
                className="flex h-[64px] w-[124px] items-center justify-center rounded-xl border border-white/25 bg-white/95 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-white/40 transition hover:border-white/50 hover:shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-[40px] max-h-full w-auto object-contain drop-shadow-sm"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
