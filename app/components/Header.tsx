
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";

const collectionGroups = [
  {
    title: "Massage Chair",
    items: [
      { name: "Opulent Prime", link: "/collections/opulent-prime" },
      { name: "Opulent Neo", link: "/collections/opulent-neo" },
      { name: "Enigma Plus", link: "/collections/enigma-plus" },
      { name: "Magic Plus", link: "/collections/magic-plus" },
      { name: "Majestic Neo", link: "/collections/majestic-neo" },
    ],
  },
  {
    title: "Portable Massagers",
    items: [
      { name: "Eye Massager", link: "/collections/eye-massager" },
      { name: "Hand Massager", link: "/collections/hand-massager" },
      { name: "Massage Cushion", link: "/collections/massage-cushion" },
    ],
  },
  {
    title: "Foot Massagers",
    items: [
      { name: "Eden Foot", link: "/collections/eden-foot" },
      { name: "Alis Foot", link: "/collections/alis-foot" },
      { name: "Sage Leg", link: "/collections/sage-leg" },
      { name: "Cosset Leg", link: "/collections/cosset-leg" },
    ],
  },
  {
    title: "Back Massagers",
    items: [
      { name: "Minilux Back", link: "/collections/minilux-back" },
      { name: "Smart Pad", link: "/collections/smart-pad" },
    ],
  },
];

const allCollectionItems = collectionGroups.flatMap((group) => group.items);
const navLinkClass =
  "group relative text-stone-700 transition-colors duration-200 hover:text-[#63c66d] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-[#63c66d] after:transition-all after:duration-200 hover:after:w-full";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const { cartCount, user, logout } = useStore();

  const filteredSearchItems = allCollectionItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const exact = filteredSearchItems[0];
    router.push(exact ? exact.link : "/collections");
    setSearchFocused(false);
  };

  const navClass = (href: string) =>
    `${navLinkClass} ${
      pathname === href ? "text-stone-900 after:w-full" : "text-stone-600"
    }`;

  const mobileNavClass = (href: string) =>
    `rounded-md px-2 py-1.5 transition ${
      pathname === href
        ? "bg-stone-100 text-stone-900"
        : "text-stone-700 hover:bg-stone-100/80"
    }`;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      setIsScrolled(currentScrollY > 12);
      setShowTopBar(currentScrollY < 8 || !scrollingDown);

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-30 w-full border-b border-stone-200/90 bg-white/95 backdrop-blur-md transition-all duration-300 ${
        isScrolled
          ? "shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
          : "shadow-[0_1px_8px_rgba(15,23,42,0.04)]"
      }`}
    >
      <div
        className={`overflow-hidden bg-[#4d8f58] text-center text-[11px] tracking-[0.04em] text-white transition-all duration-300 ${
          showTopBar ? "max-h-8 py-1 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        Free shipping on all products
      </div>

      <div
        className={`mx-auto flex w-[92%] max-w-[1280px] items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-[54px] gap-2" : "h-[62px] gap-3"
        }`}
      >
        <Link
          href="/"
          className={`group flex flex-col gap-0 items-start rounded-md transition-all ${
            isScrolled ? "px-1 py-0" : "px-1.5 py-0.5"
          }`}
        >
          <img
            src="/newlogo2.png"
            alt="Kila Massage Wellness"
            className={`block w-auto object-contain object-bottom transition-all duration-300 ${
              isScrolled ? "max-h-[38px]" : "max-h-[44px]"
            }`}
          />
          <span
            className={`block font-semibold uppercase leading-none tracking-[0.22em] text-[#b7862f] ${
              isScrolled
                ? "-mt-[11px] text-[6px]"
                : "-mt-[13px] text-[7px] sm:text-[8px]"
            }`}
          >
            Massage Wellness
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-[13px] font-medium lg:flex">
          <Link href="/" className={navClass("/")}>
            Home
          </Link>
          <Link href="/about" className={navClass("/about")}>
            About
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              onClick={() => setCollectionsOpen((prev) => !prev)}
              className={`group relative flex items-center gap-1 transition ${
                pathname.startsWith("/collections")
                  ? "text-stone-900"
                  : "text-stone-600 hover:text-[#63c66d]"
              }`}
            >
              <span className="relative">
                Collections
                <span
                  className={`absolute left-0 -bottom-1 h-[1px] bg-[#63c66d] transition-all duration-200 ${
                    pathname.startsWith("/collections")
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </span>
              <ChevronDown size={15} />
            </button>

            {collectionsOpen && (
              <>
                <div className="absolute left-0 top-full h-3 w-full" />
                <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[min(92vw,860px)] rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                  <div className="grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    {collectionGroups.map((group) => (
                      <div key={group.title}>
                        <h3 className="mb-2 font-semibold text-stone-900">
                          {group.title}
                        </h3>
                        <ul className="space-y-1 text-stone-600">
                          {group.items.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.link}
                                className="transition hover:text-[#63c66d] hover:underline"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <Link href="/all_collection" className={navClass("/all_collection")}>
            All Collections
          </Link>
          <Link href="/blogs" className={navClass("/blogs")}>
            Blogs
          </Link>
          <Link href="/contact" className={navClass("/contact")}>
            Contact
          </Link>
          <Link
            href="/checkout"
            className="rounded-md border border-[#63c66d] bg-[#63c66d] px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-white transition hover:bg-[#57b861]"
          >
            Checkout
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-stone-700">
          <div className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections..."
                className="h-9 w-[210px] rounded-full border border-stone-200 bg-stone-50 pl-9 pr-4 text-sm outline-none transition focus:border-[#63c66d] focus:bg-white focus:shadow-sm"
              />
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
            </form>
            {searchFocused && searchQuery.trim() && (
              <div className="absolute left-0 top-12 z-50 max-h-56 w-full overflow-y-auto rounded-xl border border-stone-200 bg-white p-2 shadow-xl">
                {filteredSearchItems.length > 0 ? (
                  filteredSearchItems.slice(0, 6).map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        router.push(item.link);
                        setSearchQuery("");
                        setSearchFocused(false);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-100"
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-stone-500">
                    No collections found
                  </p>
                )}
              </div>
            )}
          </div>

          <Link href={user ? "/checkout" : "/login"} className="cursor-pointer">
            <User size={18} />
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart className="cursor-pointer" size={18} />
            <span className="absolute -right-2 -top-2 rounded-full bg-[#63c66d] px-1 text-xs text-white">
              {cartCount}
            </span>
          </Link>
          {user ? (
            <button
              onClick={logout}
              className="hidden rounded-md border border-[#63c66d] px-2 py-1 text-xs text-[#4f3a35] hover:bg-[#eaf7ec] lg:block"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-md border border-[#63c66d] px-2 py-1 text-xs text-[#4f3a35] hover:bg-[#eaf7ec] lg:block"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-md border border-stone-300 p-1.5 lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-stone-700">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections..."
                className="h-10 w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#63c66d] focus:bg-white"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
              />
            </form>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={mobileNavClass("/")}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className={mobileNavClass("/about")}
            >
              About
            </Link>
            <button
              onClick={() => setMobileCollectionsOpen((prev) => !prev)}
              className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-stone-100"
            >
              Collections
              <ChevronDown
                size={16}
                className={
                  mobileCollectionsOpen ? "rotate-180 transition" : "transition"
                }
              />
            </button>
            {mobileCollectionsOpen && (
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
                {collectionGroups.map((group) => (
                  <div key={group.title} className="mb-2 last:mb-0">
                    <p className="font-semibold text-stone-800">{group.title}</p>
                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.link}
                          onClick={() => setMobileOpen(false)}
                          className="hover:text-[#63c66d] hover:underline"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/all_collection"
              onClick={() => setMobileOpen(false)}
              className={mobileNavClass("/all_collection")}
            >
              All Collections
            </Link>
            <Link
              href="/blogs"
              onClick={() => setMobileOpen(false)}
              className={mobileNavClass("/blogs")}
            >
              Blogs
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className={mobileNavClass("/contact")}
            >
              Contact
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className={mobileNavClass("/cart")}
            >
              Cart ({cartCount})
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMobileOpen(false)}
              className="rounded-md bg-[#63c66d] px-3 py-2 text-xs uppercase tracking-[0.08em] text-white"
            >
              Checkout
            </Link>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="rounded border border-stone-300 px-3 py-2 text-left text-xs"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded border border-stone-300 px-3 py-2 text-xs"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
