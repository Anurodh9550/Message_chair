"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white px-6 pb-3 pt-5 md:px-12">
      <div className="grid gap-5 md:grid-cols-4">
        {/* Logo + About */}
        <div>
          <Link
            href="/"
            className="mb-1 inline-flex flex-col items-start rounded-sm px-1 py-0.5 transition hover:bg-stone-50"
          >
            <img
              src="/newlogo2.png"
              alt="Kila Massage Wellness"
              className="h-7 w-auto object-contain"
            />
            <p className="text-xs leading-relaxed text-stone-600 md:text-sm">
            Experience ultimate comfort with our premium massage chairs.
            Designed for relaxation, health, and luxury.
          </p>
          </Link>

         
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-900">
            Quick Links
          </h3>
          <ul className="space-y-1.5 text-sm text-stone-600">
            {["Home", "About", "Collections", "Blogs", "Contact"].map(
              (item, i) => (
                <li key={i}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="group relative inline-block text-stone-600 transition duration-300 hover:text-stone-900"
                  >
                    {item}
                    <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-stone-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-900">
            Support
          </h3>
          <ul className="space-y-1.5 text-sm text-stone-600">
            {[
              { label: "FAQ", href: "/faq" },
              { label: "Shipping Policy", href: "/shipping-policy" },
              { label: "Return Policy", href: "/return-policy" },
              { label: "Warranty", href: "/claim-warranty" },
              { label: "Privacy Policy", href: "/privacy-policy" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative inline-block text-stone-600 transition duration-300 hover:text-stone-900"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-stone-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-900">
            Contact Us
          </h3>
          <p className="text-xs text-stone-600 md:text-sm">📞 9135895389</p>
          <p className="text-xs text-stone-600 md:text-sm">📧 support@robocura.com</p>
          <p className="text-xs text-stone-600 md:text-sm">📍 India</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-4 border-t border-stone-200 pt-2 text-center text-[11px] tracking-wide text-stone-500">
        © 2026 Kila. All rights reserved.
      </div>
    </footer>
  );
}
