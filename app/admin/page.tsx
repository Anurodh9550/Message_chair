"use client";

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Bell,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Package,
  Search,
  Settings,
  Shield,
  ThumbsUp,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { getApiBaseUrl } from "../utils/apiBase";

type AdminSection =
  | "dashboard"
  | "collections"
  | "products"
  | "contacts"
  | "warranty";

type Collection = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

type Product = {
  id: number;
  collection: number;
  collection_name: string;
  name: string;
  slug: string;
  price: string;
  in_stock: boolean;
  image_url?: string;
};

type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  phone: string;
  comment: string;
  status: "new" | "resolved";
  created_at: string;
};

type WarrantyClaim = {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  product_name: string;
  purchase_date: string;
  issue: string;
  status: "pending" | "in-progress" | "closed";
  created_at: string;
};

type Stats = {
  collections: number;
  products: number;
  in_stock_products: number;
  out_of_stock_products: number;
  contact_submissions: number;
  new_contacts: number;
  warranty_claims: number;
  open_warranty_claims: number;
};

const PURPLE = "#4c2a85";
const PAGE_BG = "#dfe8f4";

const formatPrice = (value: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    Number(value || 0),
  );

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function TableCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {action}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export default function AdminPage() {
  const API_BASE = getApiBaseUrl();
  const [activeTab, setActiveTab] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [message, setMessage] = useState("");

  const [collectionForm, setCollectionForm] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [productForm, setProductForm] = useState({
    collection: "",
    name: "",
    price: "",
    oldPrice: "",
    description: "",
  });
  const [productImage, setProductImage] = useState<File | null>(null);

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2200);
  };

  const fetchJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("fetch failed");
    return response.json();
  };

  const loadAll = useCallback(async () => {
    const [statsData, collectionData, productData, contactData, claimData] =
      await Promise.all([
        fetchJson<Stats>(`${API_BASE}/admin-stats/`),
        fetchJson<{ results: Collection[] }>(`${API_BASE}/collections/`),
        fetchJson<{ results: Product[] }>(`${API_BASE}/products/`),
        fetchJson<{ results: ContactSubmission[] }>(
          `${API_BASE}/contact-submissions/`,
        ),
        fetchJson<{ results: WarrantyClaim[] }>(`${API_BASE}/warranty-claims/`),
      ]);
    setStats(statsData);
    setCollections(collectionData.results ?? []);
    setProducts(productData.results ?? []);
    setContacts(contactData.results ?? []);
    setClaims(claimData.results ?? []);
  }, [API_BASE]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAll().catch(() => showMessage("Backend not reachable"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadAll]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.collection_name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    );
  }, [products, searchQuery]);

  const dashboardCards = useMemo(
    () => [
      {
        title: "Products",
        value: formatCompact(stats?.products ?? 0),
        icon: Package,
      },
      {
        title: "In stock",
        value: formatCompact(stats?.in_stock_products ?? 0),
        icon: ThumbsUp,
      },
      {
        title: "New contacts",
        value: formatCompact(stats?.new_contacts ?? 0),
        icon: MessageCircle,
      },
      {
        title: "Open warranty",
        value: formatCompact(stats?.open_warranty_claims ?? 0),
        icon: Shield,
      },
    ],
    [stats],
  );

  const navItems: {
    id: AdminSection;
    label: string;
    icon: typeof LayoutDashboard;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "collections", label: "Collections", icon: FolderOpen },
    { id: "products", label: "Products", icon: Package },
    { id: "contacts", label: "Contact queries", icon: Mail },
    { id: "warranty", label: "Warranty", icon: Shield },
  ];

  const addCollection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`${API_BASE}/collections/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectionForm),
    });
    if (!response.ok) throw new Error("create collection failed");
    setCollectionForm({ name: "", slug: "", description: "" });
    await loadAll();
    showMessage("Collection added");
  };

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productForm.collection || !productForm.name || !productForm.price)
      return;
    const slug = `${productForm.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const formData = new FormData();
    formData.append("collection", productForm.collection);
    formData.append("name", productForm.name);
    formData.append("slug", slug);
    formData.append("price", productForm.price);
    formData.append("old_price", productForm.oldPrice);
    formData.append("short_description", productForm.description);
    formData.append("in_stock", "true");
    if (productImage) {
      formData.append("image_file", productImage);
    }
    const response = await fetch(`${API_BASE}/products/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("create product failed");
    setProductForm({
      collection: "",
      name: "",
      price: "",
      oldPrice: "",
      description: "",
    });
    setProductImage(null);
    await loadAll();
    showMessage("Product added");
  };

  const patchStatus = async (
    endpoint: "contact-submissions" | "warranty-claims" | "products",
    id: number,
    body: Record<string, string | boolean>,
  ) => {
    const response = await fetch(`${API_BASE}/${endpoint}/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("status update failed");
    await loadAll();
  };

  const recentProducts = filteredProducts.slice(0, 8);
  const recentContacts = useMemo(() => contacts.slice(0, 5), [contacts]);
  const recentClaims = useMemo(() => claims.slice(0, 5), [claims]);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div
      className="flex min-h-screen font-sans text-slate-800"
      style={{ backgroundColor: PAGE_BG }}
    >
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-lg transition-transform duration-200 md:static md:z-0 md:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="hidden border-b border-slate-100 px-4 py-5 md:block">
          <span className="text-xl font-bold tracking-tight text-emerald-600">
            Message Chair
          </span>
          <p className="mt-1 text-xs text-slate-500">Admin dashboard</p>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 md:hidden">
          <span className="text-lg font-bold text-emerald-600">Message Chair</span>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3 pt-4 md:pt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  closeSidebar();
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                style={active ? { backgroundColor: PURPLE } : undefined}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-90" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
          <Link
            href="/"
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:min-h-0">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-slate-200/80 bg-white px-4 py-3 shadow-sm md:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="hidden text-xl font-bold tracking-tight text-emerald-600 md:inline">
            Message Chair
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center rounded-full border border-slate-200 bg-slate-100/80 pl-4 pr-1 py-1">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: PURPLE }}
              >
                Search
              </button>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: PURPLE }}
            >
              <UserRound className="h-5 w-5" />
            </div>
          </div>
        </header>

        {message ? (
          <div
            className="mx-4 mt-3 rounded-lg px-4 py-2 text-center text-sm text-white shadow md:mx-6"
            style={{ backgroundColor: PURPLE }}
          >
            {message}
          </div>
        ) : null}

        <main className="flex-1 space-y-6 px-4 py-6 md:px-6">
          {activeTab === "dashboard" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article
                      key={card.title}
                      className="flex items-center gap-4 rounded-2xl p-5 text-white shadow-md"
                      style={{ backgroundColor: PURPLE }}
                    >
                      <div className="rounded-xl bg-white/15 p-3">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-white/80">{card.title}</p>
                        <p className="text-2xl font-semibold tracking-tight">
                          {card.value}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <TableCard
                title="Recent products"
                action={
                  <button
                    type="button"
                    onClick={() => setActiveTab("products")}
                    className="rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm"
                    style={{ backgroundColor: PURPLE }}
                  >
                    View all
                  </button>
                }
              >
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-medium">Product</th>
                      <th className="px-5 py-3 font-medium">Collection</th>
                      <th className="px-5 py-3 font-medium">Price</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-8 text-center text-slate-500"
                        >
                          No products yet or nothing matches search.
                        </td>
                      </tr>
                    ) : (
                      recentProducts.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-slate-100 hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-3 font-medium text-slate-800">
                            {item.name}
                          </td>
                          <td className="px-5 py-3 text-slate-600">
                            {item.collection_name}
                          </td>
                          <td className="px-5 py-3 text-slate-700">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                item.in_stock
                                  ? "bg-emerald-500 text-white"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.in_stock ? "In stock" : "Out of stock"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </TableCard>

              <div className="grid gap-6 lg:grid-cols-2">
                <TableCard
                  title="Recent contact messages"
                  action={
                    <button
                      type="button"
                      onClick={() => setActiveTab("contacts")}
                      className="rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm"
                      style={{ backgroundColor: PURPLE }}
                    >
                      View all
                    </button>
                  }
                >
                  <table className="w-full min-w-[400px] text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr>
                        <th className="px-5 py-3 font-medium">Name</th>
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentContacts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-5 py-8 text-center text-slate-500"
                          >
                            No contact submissions yet.
                          </td>
                        </tr>
                      ) : (
                        recentContacts.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-100 hover:bg-slate-50/80"
                          >
                            <td className="px-5 py-3 font-medium">
                              {item.name}
                            </td>
                            <td className="px-5 py-3 text-slate-600">
                              {item.email}
                            </td>
                            <td className="px-5 py-3 text-slate-600">
                              {formatDateTime(item.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </TableCard>

                <TableCard
                  title="Recent warranty claims"
                  action={
                    <button
                      type="button"
                      onClick={() => setActiveTab("warranty")}
                      className="rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm"
                      style={{ backgroundColor: PURPLE }}
                    >
                      View all
                    </button>
                  }
                >
                  <table className="w-full min-w-[400px] text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr>
                        <th className="px-5 py-3 font-medium">Customer</th>
                        <th className="px-5 py-3 font-medium">Product</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentClaims.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-5 py-8 text-center text-slate-500"
                          >
                            No warranty claims yet.
                          </td>
                        </tr>
                      ) : (
                        recentClaims.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-100 hover:bg-slate-50/80"
                          >
                            <td className="px-5 py-3 font-medium">
                              {item.customer_name}
                            </td>
                            <td className="px-5 py-3 text-slate-600">
                              {item.product_name}
                            </td>
                            <td className="px-5 py-3">
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize">
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </TableCard>
              </div>
            </>
          ) : null}

          {activeTab === "collections" ? (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <form
                onSubmit={(e) => void addCollection(e)}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                  Add collection
                </h2>
                <div className="space-y-3">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Name"
                    value={collectionForm.name}
                    onChange={(e) =>
                      setCollectionForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Slug"
                    value={collectionForm.slug}
                    onChange={(e) =>
                      setCollectionForm((p) => ({ ...p, slug: e.target.value }))
                    }
                  />
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Description"
                    rows={3}
                    value={collectionForm.description}
                    onChange={(e) =>
                      setCollectionForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow"
                    style={{ backgroundColor: PURPLE }}
                  >
                    Save
                  </button>
                </div>
              </form>

              <TableCard title="All collections">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Slug</th>
                      <th className="px-5 py-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-3">{item.name}</td>
                        <td className="px-5 py-3 text-slate-600">{item.slug}</td>
                        <td className="px-5 py-3 text-slate-600">
                          {item.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>
            </div>
          ) : null}

          {activeTab === "products" ? (
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              <form
                onSubmit={(e) => void addProduct(e)}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                  Add product
                </h2>
                <div className="space-y-3">
                  <select
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    value={productForm.collection}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        collection: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select collection</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Name"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Price"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, price: e.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Old price"
                    value={productForm.oldPrice}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        oldPrice: e.target.value,
                      }))
                    }
                  />
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Short description"
                    rows={3}
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-slate-600"
                    onChange={(e) =>
                      setProductImage(e.target.files?.[0] ?? null)
                    }
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow"
                    style={{ backgroundColor: PURPLE }}
                  >
                    Create product
                  </button>
                </div>
              </form>

              <TableCard title="Products">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-medium">Product</th>
                      <th className="px-5 py-3 font-medium">Collection</th>
                      <th className="px-5 py-3 font-medium">Price</th>
                      <th className="px-5 py-3 font-medium">Image</th>
                      <th className="px-5 py-3 font-medium">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-3 font-medium">{item.name}</td>
                        <td className="px-5 py-3 text-slate-600">
                          {item.collection_name}
                        </td>
                        <td className="px-5 py-3">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-5 py-3">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50"
                            onClick={() =>
                              void patchStatus("products", item.id, {
                                in_stock: !item.in_stock,
                              })
                            }
                          >
                            {item.in_stock ? "In stock" : "Out of stock"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>
            </div>
          ) : null}

          {activeTab === "contacts" ? (
            <TableCard title="Contact submissions">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Message</th>
                    <th className="px-5 py-3 font-medium">Submitted</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-3">{item.name}</td>
                      <td className="px-5 py-3">{item.email}</td>
                      <td className="px-5 py-3">{item.phone}</td>
                      <td className="px-5 py-3 text-slate-600">
                        {item.comment}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50"
                          onClick={() =>
                            void patchStatus("contact-submissions", item.id, {
                              status:
                                item.status === "new" ? "resolved" : "new",
                            })
                          }
                        >
                          {item.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          ) : null}

          {activeTab === "warranty" ? (
            <TableCard title="Warranty claims">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Purchase</th>
                    <th className="px-5 py-3 font-medium">Issue</th>
                    <th className="px-5 py-3 font-medium">Received</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-3">{item.customer_name}</td>
                      <td className="px-5 py-3 text-slate-600">{item.email}</td>
                      <td className="px-5 py-3 text-slate-600">{item.phone}</td>
                      <td className="px-5 py-3">{item.product_name}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                        {item.purchase_date}
                      </td>
                      <td
                        className="max-w-[220px] truncate px-5 py-3 text-slate-600"
                        title={item.issue}
                      >
                        {item.issue}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50"
                          onClick={() => {
                            const next =
                              item.status === "pending"
                                ? "in-progress"
                                : item.status === "in-progress"
                                  ? "closed"
                                  : "pending";
                            void patchStatus("warranty-claims", item.id, {
                              status: next,
                            });
                          }}
                        >
                          {item.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          ) : null}
        </main>

        <footer
          className="mt-auto py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-white"
          style={{ backgroundColor: PURPLE }}
        >
          Admin panel
        </footer>
      </div>
    </div>
  );
}
