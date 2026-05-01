"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hero-bg mt-10 border-t border-[var(--border-light)] px-6 pb-4 pt-10 md:px-12">
      <div className="mx-auto grid w-full max-w-[1280px] gap-6 md:grid-cols-4">
        {/* Logo + About */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--card)] p-5 shadow-sm">
          <Link
            href="/"
            className="mb-3 inline-flex flex-col items-start rounded-md px-1 py-1 transition hover:bg-[var(--surface-muted)]"
          >
            <img
              src="/newlogo2.png"
              alt="Kila Massage Wellness"
              className="h-8 w-auto object-contain"
            />
            <p className="max-w-[26ch] text-xs leading-relaxed text-[var(--text-primary)] md:text-sm">
              Experience ultimate comfort with our premium massage chairs.
              Designed for relaxation, health, and luxury.
            </p>
          </Link>
          <p className="inline-flex rounded-full bg-[var(--brand-50)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-warm)] ring-1 ring-[var(--border-warm)]">
            Corporate Wellness Partner
          </p>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--card)] p-5 shadow-sm">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-primary)]">
            {["Home", "About", "Collections", "Blogs", "Contact"].map(
              (item, i) => (
                <li key={i}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="group relative inline-block text-[var(--text-primary)] transition duration-300 hover:translate-x-0.5 hover:text-[var(--brand-dark)]"
                  >
                    {item}
                    <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[var(--secondary)] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Support */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--card)] p-5 shadow-sm">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">
            Support
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-primary)]">
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
                  className="group relative inline-block text-[var(--text-primary)] transition duration-300 hover:translate-x-0.5 hover:text-[var(--brand-dark)]"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[var(--secondary)] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--card)] p-5 shadow-sm">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">
            Contact Us
          </h3>
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-primary)] md:text-sm">📞 9135895389</p>
            <p className="text-xs text-[var(--text-primary)] md:text-sm"></p>
            <p className="text-xs text-[var(--text-primary)] md:text-sm">📍 India</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mx-auto mt-6 w-full max-w-[1280px] border-t border-[var(--border-light)] pt-3 text-center text-[11px] tracking-[0.1em] text-[var(--text-warm)]">
        © 2026 Kila. All rights reserved.
      </div>
    </footer>
  );
}
