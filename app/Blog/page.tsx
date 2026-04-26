"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const allBlogs = [
  {
    title: "Boost Your Office Productivity with Robocura Massage Chairs",
    desc: "In today’s fast-paced world, we spend most of our time sitting in front of our laptops or computers...",
    img: "/blog1.png",
  },
  {
    title: "Massage Chair Helps With Back Pain? Let’s Find Out",
    desc: "If you’ve ever experienced back pain, you know how it can make everything difficult...",
    img: "/blog2.png",
  },
  {
    title: "Benefits of Daily Massage Therapy",
    desc: "Daily massage improves blood circulation and reduces stress...",
    img: "/blog3.png",
  },
  {
    title: "Top Features in Modern Massage Chairs",
    desc: "Modern massage chairs come with advanced features like zero gravity...",
    img: "/blog4.png",
  },
  {
    title: "Why You Should Buy a Massage Chair",
    desc: "Massage chairs are becoming essential in modern homes...",
    img: "/blog5.png",
  },
  {
    title: "Best Massage Chairs in India",
    desc: "Here are the best massage chairs available in India...",
    img: "/blog6.png",
  },
  {
    title: "History of Massage Therapy",
    desc: "Massage therapy has been used for thousands of years...",
    img: "/blog7.png",
  },
  {
    title: "Zero Gravity Explained",
    desc: "Zero gravity position improves posture and reduces pressure...",
    img: "/blog8.png",
  },
];

export default function BlogsPage() {
  const [page, setPage] = useState(1);

  // ✅ 6 per page
  const perPage = 6;

  const totalPages = Math.ceil(allBlogs.length / perPage);

  const start = (page - 1) * perPage;
  const currentBlogs = allBlogs.slice(start, start + perPage);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto w-[95%] max-w-[1280px]">
        {/* Heading */}
        <h1 className="mb-10 text-3xl font-semibold text-[#4f3a35] sm:text-4xl">
          News
        </h1>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {currentBlogs.map((item, i) => (
            <motion.article
              key={i}
              whileHover={{ y: -8 }}
              className="premium-card rounded-xl bg-white shadow-md transition hover:shadow-xl"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-t-xl">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-[230px] w-full object-cover transition duration-300 hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-[#4f3a35] hover:underline">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm text-[#5b4740]">{item.desc}</p>

                <Link
                  href="/contact"
                  className="premium-btn mt-3 inline-block rounded-md border border-[#63c66d] px-3 py-1.5 font-medium text-[#2f8a44] transition hover:bg-[#eaf7ec]"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="premium-btn rounded bg-[#d9ebdc] px-3 py-1 hover:bg-[#cfe2d2]"
          >
            {"<"}
          </button>

          {/* Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`premium-btn rounded px-3 py-1 ${
                page === i + 1
                  ? "bg-[#4f3a35] text-white"
                  : "bg-[#d9ebdc] hover:bg-[#cfe2d2]"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="premium-btn rounded bg-[#d9ebdc] px-3 py-1 hover:bg-[#cfe2d2]"
          >
            {">"}
          </button>
        </div>
      </div>
    </section>
  );
}
