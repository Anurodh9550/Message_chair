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
  CreditCard,
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
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { getApiBaseUrl, getDefaultAdminApiKey } from "../utils/apiBase";

type AdminSection =
  | "dashboard"
  | "collections"
  | "products"
  | "orders"
  | "users"
  | "contacts"
  | "warranty"
  | "kila-support";

type Collection = {
  id: number;
  name: string;
  slug: string;
  description: string;
  banner_image?: string;
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
  old_price?: string;
  short_description?: string;
  product_features?: string[];
  category?: string;
  chair_type?: string;
  badge_label?: string;
  hover_image?: string;
  show_on_home?: boolean;
  home_order?: number;
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

type SupportRequest = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  message: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

type AppUser = {
  id: number;
  name: string;
  email: string;
  date_joined: string;
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
  support_requests: number;
  open_support_requests: number;
  users: number;
  orders: number;
  paid_orders: number;
  pending_payments: number;
};

type OrderItem = {
  id: number;
  product_name: string;
  product_slug: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  image_url?: string;
};

type Order = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: "gateway" | "upi" | "cod";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  order_status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: string;
  gateway_transaction_id?: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
};

type FrontendSection = {
  id: "massage-chair" | "portable-massagers" | "foot-massagers" | "back-massagers";
  title: string;
  matchers: string[];
};

const PURPLE = "#8f775a";
const PAGE_BG = "#f4efe8";
const ADMIN_KEY_STORAGE = "kila_admin_api_key";
const FRONTEND_SECTIONS: FrontendSection[] = [
  {
    id: "massage-chair",
    title: "Massage Chair",
    matchers: ["opulent", "enigma", "magic", "majestic", "chair"],
  },
  {
    id: "portable-massagers",
    title: "Portable Massagers",
    matchers: ["portable", "eye", "hand", "cushion"],
  },
  {
    id: "foot-massagers",
    title: "Foot Massagers",
    matchers: ["foot", "leg", "eden", "alis", "sage", "cosset"],
  },
  {
    id: "back-massagers",
    title: "Back Massagers",
    matchers: ["back", "minilux", "smart pad", "smart-pad"],
  },
];

const formatPrice = (value: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    Number(value || 0),
  );

const buildSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

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
  const ENV_ADMIN_KEY = getDefaultAdminApiKey();
  const [activeTab, setActiveTab] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [message, setMessage] = useState("");
  const [adminApiKey, setAdminApiKey] = useState(() => {
    if (typeof window === "undefined") return ENV_ADMIN_KEY;
    const saved = localStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    return saved || ENV_ADMIN_KEY;
  });

  const [collectionForm, setCollectionForm] = useState({
    name: "",
    slug: "",
    description: "",
    bannerImage: "",
  });
  const [productForm, setProductForm] = useState({
    collection: "",
    name: "",
    price: "",
    oldPrice: "",
    description: "",
    featuresText: "",
    category: "",
    chairType: "",
    badgeLabel: "Sale",
    hoverImage: "",
    showOnHome: false,
    homeOrder: 0,
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | "all">(
    "all",
  );
  const [selectedFrontendSection, setSelectedFrontendSection] = useState<
    FrontendSection["id"] | "all"
  >("all");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editProductForm, setEditProductForm] = useState({
    collection: "",
    name: "",
    price: "",
    oldPrice: "",
    description: "",
    featuresText: "",
    category: "",
    chairType: "",
    badgeLabel: "Sale",
    hoverImage: "",
    inStock: true,
    showOnHome: false,
    homeOrder: 0,
  });
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);
  const [editCollectionForm, setEditCollectionForm] = useState({
    name: "",
    slug: "",
    description: "",
    bannerImage: "",
  });
  const [editProductImage, setEditProductImage] = useState<File | null>(null);
  const [productFormError, setProductFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2200);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value = adminApiKey.trim();
    if (!value) {
      localStorage.removeItem(ADMIN_KEY_STORAGE);
      return;
    }
    localStorage.setItem(ADMIN_KEY_STORAGE, value);
  }, [adminApiKey]);

  const getResponseError = async (response: Response, fallback: string) => {
    const text = (await response.text()).trim();
    if (!text) return fallback;
    if (text.startsWith("<!DOCTYPE html")) {
      return `${fallback}. Check API base URL / backend route.`;
    }
    return text.slice(0, 180);
  };

  const resolvedAdminApiKey = adminApiKey.trim() || ENV_ADMIN_KEY;

  const getAdminHeaders = useCallback((): Record<string, string> => {
    if (!resolvedAdminApiKey) return {};
    return { "X-Admin-Api-Key": resolvedAdminApiKey };
  }, [resolvedAdminApiKey]);

  const fetchJson = useCallback(async <T,>(url: string): Promise<T> => {
    const response = await fetch(url, {
      headers: getAdminHeaders(),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "fetch failed");
    }
    return response.json();
  }, [getAdminHeaders]);

  const loadAll = useCallback(async () => {
    if (!resolvedAdminApiKey) {
      setStats(null);
      setCollections([]);
      setProducts([]);
      setContacts([]);
      setClaims([]);
      setSupportRequests([]);
      setOrders([]);
      setUsers([]);
      return;
    }

    const [
      collectionResult,
      productResult,
      statsResult,
      contactResult,
      claimResult,
      supportResult,
      ordersResult,
      usersResult,
    ] = await Promise.allSettled([
      fetchJson<{ results: Collection[] }>(`${API_BASE}/collections/`),
      fetchJson<{ results: Product[] }>(`${API_BASE}/products/`),
      fetchJson<Stats>(`${API_BASE}/admin-stats/`),
      fetchJson<{ results: ContactSubmission[] }>(`${API_BASE}/contact-submissions/`),
      fetchJson<{ results: WarrantyClaim[] }>(`${API_BASE}/warranty-claims/`),
      fetchJson<{ results: SupportRequest[] }>(`${API_BASE}/support-requests/`),
      fetchJson<{ results: Order[] }>(`${API_BASE}/orders/`),
      fetchJson<{ results: AppUser[] }>(`${API_BASE}/users/`),
    ]);

    if (collectionResult.status !== "fulfilled") {
      throw collectionResult.reason;
    }
    if (productResult.status !== "fulfilled") {
      throw productResult.reason;
    }

    setCollections(collectionResult.value.results ?? []);
    setProducts(productResult.value.results ?? []);
    setStats(statsResult.status === "fulfilled" ? statsResult.value : null);
    setContacts(
      contactResult.status === "fulfilled" ? (contactResult.value.results ?? []) : [],
    );
    setClaims(claimResult.status === "fulfilled" ? (claimResult.value.results ?? []) : []);
    setSupportRequests(
      supportResult.status === "fulfilled" ? (supportResult.value.results ?? []) : [],
    );
    setOrders(ordersResult.status === "fulfilled" ? (ordersResult.value.results ?? []) : []);
    setUsers(usersResult.status === "fulfilled" ? (usersResult.value.results ?? []) : []);
  }, [API_BASE, fetchJson, resolvedAdminApiKey]);

  useEffect(() => {
    if (!resolvedAdminApiKey) return;
    const timer = window.setTimeout(() => {
      void loadAll().catch((err: unknown) =>
        showMessage(
          err instanceof Error ? err.message.slice(0, 120) : "Backend not reachable",
        ),
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadAll, resolvedAdminApiKey]);

  useEffect(() => {
    if (!resolvedAdminApiKey) return;
    const interval = window.setInterval(() => {
      void loadAll().catch(() => {
        // Silent retry loop for live dashboard counters.
      });
    }, 15000);
    return () => window.clearInterval(interval);
  }, [loadAll, resolvedAdminApiKey]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const byCollection =
      selectedCollectionId === "all"
        ? products
        : products.filter((p) => p.collection === selectedCollectionId);
    const bySection =
      selectedFrontendSection === "all"
        ? byCollection
        : byCollection.filter((p) => {
            const section = FRONTEND_SECTIONS.find(
              (s) => s.id === selectedFrontendSection,
            );
            if (!section) return true;
            const haystack =
              `${p.name} ${p.collection_name} ${p.category ?? ""} ${p.chair_type ?? ""}`.toLowerCase();
            return section.matchers.some((m) => haystack.includes(m));
          });
    if (!q) return bySection;
    return bySection.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.collection_name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q) ||
        (p.chair_type ?? "").toLowerCase().includes(q),
    );
  }, [products, searchQuery, selectedCollectionId, selectedFrontendSection]);

  const filteredCollections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return collections;
    return collections.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [collections, searchQuery]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.comment.toLowerCase().includes(q),
    );
  }, [contacts, searchQuery]);

  const filteredClaims = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return claims;
    return claims.filter(
      (item) =>
        item.customer_name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.product_name.toLowerCase().includes(q) ||
        item.issue.toLowerCase().includes(q),
    );
  }, [claims, searchQuery]);

  const filteredSupportRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return supportRequests;
    return supportRequests.filter(
      (item) =>
        item.full_name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q),
    );
  }, [supportRequests, searchQuery]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (item) =>
        item.customer_name.toLowerCase().includes(q) ||
        item.customer_email.toLowerCase().includes(q) ||
        item.customer_phone.toLowerCase().includes(q) ||
        item.payment_status.toLowerCase().includes(q) ||
        item.order_status.toLowerCase().includes(q) ||
        item.items.some((entry) => entry.product_name.toLowerCase().includes(q)),
    );
  }, [orders, searchQuery]);

  const suggestedSlug = useMemo(
    () => buildSlug(productForm.name || ""),
    [productForm.name],
  );
  const suggestedEditSlug = useMemo(
    () => buildSlug(editProductForm.name || ""),
    [editProductForm.name],
  );

  const groupedCollections = useMemo(
    () =>
      FRONTEND_SECTIONS.map((section) => ({
        ...section,
        items: collections.filter((col) => {
          const haystack = `${col.name} ${col.slug}`.toLowerCase();
          return section.matchers.some((m) => haystack.includes(m));
        }),
      })),
    [collections],
  );

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
      {
        title: "Open Kila support",
        value: formatCompact(stats?.open_support_requests ?? 0),
        icon: MessageCircle,
      },
      {
        title: "Registered users",
        value: formatCompact(stats?.users ?? 0),
        icon: Users,
      },
      {
        title: "Orders",
        value: formatCompact(stats?.orders ?? 0),
        icon: CreditCard,
      },
      {
        title: "Pending payments",
        value: formatCompact(stats?.pending_payments ?? 0),
        icon: CreditCard,
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
    { id: "orders", label: "Orders", icon: CreditCard },
    { id: "users", label: "Users", icon: Users },
    { id: "contacts", label: "Contact queries", icon: Mail },
    { id: "warranty", label: "Warranty", icon: Shield },
    { id: "kila-support", label: "Kila Support", icon: MessageCircle },
  ];

  const addCollection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resolvedAdminApiKey) {
      showMessage("Enter Admin API key first");
      return;
    }
    setPendingAction("add-collection");
    try {
      const response = await fetch(`${API_BASE}/collections/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({
          name: collectionForm.name,
          slug: collectionForm.slug,
          description: collectionForm.description,
          banner_image: collectionForm.bannerImage,
        }),
      });
      if (!response.ok) {
        throw new Error(await getResponseError(response, "Create collection failed"));
      }
      setCollectionForm({ name: "", slug: "", description: "", bannerImage: "" });
      await loadAll();
      showMessage("Collection added");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Create collection failed");
    } finally {
      setPendingAction(null);
    }
  };

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resolvedAdminApiKey) {
      showMessage("Enter Admin API key first");
      return;
    }
    setProductFormError("");
    if (!productForm.collection || !productForm.name || !productForm.price) {
      setProductFormError("Collection, name and price are required.");
      return;
    }
    if (Number(productForm.price) <= 0) {
      setProductFormError("Price should be greater than 0.");
      return;
    }
    if (!productImage) {
      setProductFormError("Please upload product image file.");
      return;
    }
    const baseSlug = buildSlug(productForm.name);
    if (!baseSlug) {
      setProductFormError("Please enter a valid product name.");
      return;
    }
    const slugExists = products.some((item) => item.slug === baseSlug);
    const slug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;
    const formData = new FormData();
    formData.append("collection", productForm.collection);
    formData.append("name", productForm.name);
    formData.append("slug", slug);
    formData.append("price", productForm.price);
    formData.append("old_price", productForm.oldPrice);
    formData.append("short_description", productForm.description);
    formData.append(
      "product_features",
      JSON.stringify(
        productForm.featuresText
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    );
    formData.append("category", productForm.category);
    formData.append("chair_type", productForm.chairType);
    formData.append("badge_label", productForm.badgeLabel);
    formData.append("hover_image", productForm.hoverImage);
    formData.append("in_stock", "true");
    formData.append("show_on_home", String(productForm.showOnHome));
    formData.append("home_order", String(productForm.homeOrder));
    if (productImage) {
      formData.append("image_file", productImage);
    }
    setPendingAction("add-product");
    try {
      const response = await fetch(`${API_BASE}/products/`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await getResponseError(response, "Create product failed"));
      }
      setProductForm({
        collection: "",
        name: "",
        price: "",
        oldPrice: "",
        description: "",
        featuresText: "",
        category: "",
        chairType: "",
        badgeLabel: "Sale",
        hoverImage: "",
        showOnHome: false,
        homeOrder: 0,
      });
      setProductImage(null);
      await loadAll();
      showMessage("Product added");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Create product failed");
    } finally {
      setPendingAction(null);
    }
  };

  const patchStatus = async (
    endpoint:
      | "contact-submissions"
      | "warranty-claims"
      | "products"
      | "support-requests",
    id: number,
    body: Record<string, string | boolean>,
  ) => {
    if (!resolvedAdminApiKey) {
      showMessage("Enter Admin API key first");
      return;
    }
    setPendingAction(`patch-${endpoint}-${id}`);
    try {
      const response = await fetch(`${API_BASE}/${endpoint}/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(await getResponseError(response, "Status update failed"));
      }
      await loadAll();
      showMessage("Updated");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Status update failed");
    } finally {
      setPendingAction(null);
    }
  };

  const startEditProduct = (item: Product) => {
    setEditingProductId(item.id);
    setEditProductForm({
      collection: String(item.collection),
      name: item.name,
      price: item.price,
      oldPrice: item.old_price ?? "",
      description: item.short_description ?? "",
      featuresText: (item.product_features ?? []).join(", "),
      category: item.category ?? "",
      chairType: item.chair_type ?? "",
      badgeLabel: item.badge_label ?? "Sale",
      hoverImage: item.hover_image ?? "",
      inStock: item.in_stock,
      showOnHome: Boolean(item.show_on_home),
      homeOrder: item.home_order ?? 0,
    });
    setEditProductImage(null);
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setEditProductImage(null);
  };

  const updateProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingProductId === null) return;
    setEditFormError("");
    if (
      !editProductForm.collection.trim() ||
      !editProductForm.name.trim() ||
      !editProductForm.price.trim()
    ) {
      setEditFormError("Collection, name and price are required.");
      return;
    }
    if (Number(editProductForm.price) <= 0) {
      setEditFormError("Price should be greater than 0.");
      return;
    }
    const formData = new FormData();
    formData.append("collection", editProductForm.collection);
    formData.append("name", editProductForm.name);
    formData.append("slug", suggestedEditSlug);
    formData.append("price", editProductForm.price);
    formData.append("old_price", editProductForm.oldPrice);
    formData.append("short_description", editProductForm.description);
    formData.append(
      "product_features",
      JSON.stringify(
        editProductForm.featuresText
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    );
    formData.append("category", editProductForm.category);
    formData.append("chair_type", editProductForm.chairType);
    formData.append("badge_label", editProductForm.badgeLabel);
    formData.append("hover_image", editProductForm.hoverImage);
    formData.append("in_stock", String(editProductForm.inStock));
    formData.append("show_on_home", String(editProductForm.showOnHome));
    formData.append("home_order", String(editProductForm.homeOrder));
    if (editProductImage) {
      formData.append("image_file", editProductImage);
    }
    setPendingAction(`update-product-${editingProductId}`);
    try {
      const response = await fetch(`${API_BASE}/products/${editingProductId}/`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await getResponseError(response, "Update product failed"));
      }
      await loadAll();
      setEditingProductId(null);
      setEditProductImage(null);
      showMessage("Product updated");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Update product failed");
    } finally {
      setPendingAction(null);
    }
  };

  const startEditCollection = (item: Collection) => {
    setEditingCollectionId(item.id);
    setEditCollectionForm({
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      bannerImage: item.banner_image ?? "",
    });
  };

  const cancelEditCollection = () => {
    setEditingCollectionId(null);
    setEditCollectionForm({ name: "", slug: "", description: "", bannerImage: "" });
  };

  const updateCollection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingCollectionId === null) return;
    setPendingAction(`update-collection-${editingCollectionId}`);
    try {
      const response = await fetch(`${API_BASE}/collections/${editingCollectionId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({
          name: editCollectionForm.name,
          slug: editCollectionForm.slug,
          description: editCollectionForm.description,
          banner_image: editCollectionForm.bannerImage,
        }),
      });
      if (!response.ok) {
        throw new Error(await getResponseError(response, "Update collection failed"));
      }
      await loadAll();
      cancelEditCollection();
      showMessage("Collection updated");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Update collection failed");
    } finally {
      setPendingAction(null);
    }
  };

  const patchOrder = async (
    id: number,
    body: { payment_status?: Order["payment_status"]; order_status?: Order["order_status"] },
  ) => {
    if (!resolvedAdminApiKey) {
      showMessage("Enter Admin API key first");
      return;
    }
    setPendingAction(`patch-order-${id}`);
    try {
      const response = await fetch(`${API_BASE}/orders/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(await getResponseError(response, "Order update failed"));
      }
      await loadAll();
      showMessage("Order status updated");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Order update failed");
    } finally {
      setPendingAction(null);
    }
  };

  const deleteResource = async (
    endpoint: "collections" | "products",
    id: number,
    label: string,
  ) => {
    if (!resolvedAdminApiKey) {
      showMessage("Enter Admin API key first");
      return;
    }
    const ok = window.confirm(`Delete ${label}? This cannot be undone.`);
    if (!ok) return;
    setPendingAction(`delete-${endpoint}-${id}`);
    try {
      const response = await fetch(`${API_BASE}/${endpoint}/${id}/`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (!response.ok) {
        throw new Error(
          await getResponseError(response, `Delete ${label.toLowerCase()} failed`),
        );
      }
      await loadAll();
      showMessage(`${label} deleted`);
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : `Delete ${label.toLowerCase()} failed`,
      );
    } finally {
      setPendingAction(null);
    }
  };

  const recentProducts = filteredProducts.slice(0, 8);
  const recentContacts = useMemo(() => contacts.slice(0, 5), [contacts]);
  const recentClaims = useMemo(() => claims.slice(0, 5), [claims]);
  const recentSupportRequests = useMemo(
    () => supportRequests.slice(0, 5),
    [supportRequests],
  );

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div
      className="flex min-h-screen font-sans text-[var(--text-primary)]"
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border-soft)] bg-[var(--card)] shadow-lg transition-transform duration-200 md:static md:z-0 md:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="hidden border-b border-[var(--border-light)] px-4 py-5 md:block">
          <span className="text-xl font-bold tracking-tight text-[var(--primary)]">
            Massage Chair
          </span>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Admin dashboard</p>
        </div>
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-4 py-4 md:hidden">
          <span className="text-lg font-bold text-[var(--primary)]">Massage Chair</span>
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
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
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                }`}
                style={active ? { backgroundColor: PURPLE } : undefined}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-90" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-[var(--border-light)] p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
          <Link
            href="/"
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:min-h-0">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-[var(--border-soft)] bg-[var(--card)] px-4 py-3 shadow-sm md:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="hidden text-xl font-bold tracking-tight text-[var(--primary)] md:inline">
            Massage Chair
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] pl-4 pr-1 py-1">
              <Search className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
              <input
                type="search"
                placeholder="Search current section…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
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
              className="rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
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
        {pendingAction ? (
          <div className="mx-4 mt-2 rounded-lg bg-amber-50 px-4 py-2 text-center text-xs text-amber-800 shadow-sm md:mx-6">
            Processing request... please wait.
          </div>
        ) : null}

        <div
          className={`mx-4 mt-3 rounded-xl border px-4 py-3 md:mx-6 ${
            resolvedAdminApiKey
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              resolvedAdminApiKey ? "text-emerald-900" : "text-amber-900"
            }`}
          >
            {resolvedAdminApiKey ? "Admin API key configured" : "Admin API key required"}
          </p>
          <p
            className={`mt-1 text-xs ${
              resolvedAdminApiKey ? "text-emerald-800" : "text-amber-800"
            }`}
          >
            Use backend <code>ADMIN_API_KEY</code> for protected admin APIs.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="password"
              value={adminApiKey}
              onChange={(e) => setAdminApiKey(e.target.value)}
              placeholder="Enter Admin API key"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              type="button"
              onClick={() => showMessage("Admin API key saved")}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: PURPLE }}
            >
              Save key
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminApiKey("");
                showMessage("Admin API key cleared");
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear key
            </button>
          </div>
        </div>

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
                        <p className="text-sm text-white/95">{card.title}</p>
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
                                  ? "bg-[var(--primary)] text-white"
                                  : "bg-[#f3e7d2] text-[#6f5b43]"
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

                <TableCard
                  title="Recent Kila support requests"
                  action={
                    <button
                      type="button"
                      onClick={() => setActiveTab("kila-support")}
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
                        <th className="px-5 py-3 font-medium">Phone</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSupportRequests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-5 py-8 text-center text-slate-500"
                          >
                            No support requests yet.
                          </td>
                        </tr>
                      ) : (
                        recentSupportRequests.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-100 hover:bg-slate-50/80"
                          >
                            <td className="px-5 py-3 font-medium">
                              {item.full_name}
                            </td>
                            <td className="px-5 py-3 text-slate-600">
                              {item.phone}
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
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Banner image URL (optional)"
                    value={collectionForm.bannerImage}
                    onChange={(e) =>
                      setCollectionForm((p) => ({
                        ...p,
                        bannerImage: e.target.value,
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

              <div className="space-y-4">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-800">
                    Frontend dropdown sections
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Same grouping as Collections dropdown menu.
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {groupedCollections.map((group) => (
                      <div
                        key={group.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {group.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          {group.items.length} collections linked
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {group.items.slice(0, 5).map((col) => (
                            <span
                              key={col.id}
                              className="rounded-full bg-white px-2 py-1 text-[11px] text-slate-700 ring-1 ring-slate-200"
                            >
                              {col.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {editingCollectionId !== null ? (
                  <form
                    onSubmit={(e) => void updateCollection(e)}
                    className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                  >
                    <h3 className="mb-3 text-base font-semibold text-slate-800">
                      Update collection
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Name"
                        value={editCollectionForm.name}
                        onChange={(e) =>
                          setEditCollectionForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Slug"
                        value={editCollectionForm.slug}
                        onChange={(e) =>
                          setEditCollectionForm((p) => ({
                            ...p,
                            slug: e.target.value,
                          }))
                        }
                      />
                      <textarea
                        className="md:col-span-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        rows={3}
                        placeholder="Description"
                        value={editCollectionForm.description}
                        onChange={(e) =>
                          setEditCollectionForm((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="md:col-span-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Banner image URL"
                        value={editCollectionForm.bannerImage}
                        onChange={(e) =>
                          setEditCollectionForm((p) => ({
                            ...p,
                            bannerImage: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="submit"
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
                        style={{ backgroundColor: PURPLE }}
                      >
                        Save collection
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditCollection}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : null}

                <TableCard title="All collections">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Slug</th>
                      <th className="px-5 py-3 font-medium">Description</th>
                      <th className="px-5 py-3 font-medium">Banner</th>
                      <th className="px-5 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCollections.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-3">{item.name}</td>
                        <td className="px-5 py-3 text-slate-600">{item.slug}</td>
                        <td className="px-5 py-3 text-slate-600">
                          {item.description}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {item.banner_image ? "Yes" : "—"}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEditCollection(item)}
                              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                void deleteResource("collections", item.id, "Collection")
                              }
                              className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>
              </div>
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
                  {productFormError ? (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      {productFormError}
                    </p>
                  ) : null}
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
                    type="number"
                    min="1"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, price: e.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Old price"
                    type="number"
                    min="0"
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
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Features (comma separated)"
                    rows={2}
                    value={productForm.featuresText}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, featuresText: e.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Category (example: Premium 4D)"
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, category: e.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Chair type (Premium / Zero Gravity / Office...)"
                    value={productForm.chairType}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, chairType: e.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Badge label (Sale / Sold out)"
                    value={productForm.badgeLabel}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, badgeLabel: e.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="Hover image URL (optional)"
                    value={productForm.hoverImage}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, hoverImage: e.target.value }))
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
                  <p className="text-xs text-slate-500">
                    Upload product image file (JPG/PNG/WebP).
                  </p>
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    Frontend slug preview:{" "}
                    <span className="font-semibold text-slate-800">
                      {suggestedSlug || "auto-generated"}
                    </span>
                  </p>
                  <button
                    type="submit"
                    className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow"
                    style={{ backgroundColor: PURPLE }}
                  >
                    Create product
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Massage Chair Sections
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-slate-800">
                        Segment-wise product management
                      </h3>
                    </div>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                      {filteredProducts.length} visible products
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        selectedCollectionId === "all"
                          ? "text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      style={
                        selectedCollectionId === "all"
                          ? { backgroundColor: PURPLE }
                          : undefined
                      }
                      onClick={() => setSelectedCollectionId("all")}
                    >
                      All sections
                    </button>
                    {collections.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          selectedCollectionId === col.id
                            ? "text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                        style={
                          selectedCollectionId === col.id
                            ? { backgroundColor: PURPLE }
                            : undefined
                        }
                        onClick={() => setSelectedCollectionId(col.id)}
                      >
                        {col.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        selectedFrontendSection === "all"
                          ? "text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      style={
                        selectedFrontendSection === "all"
                          ? { backgroundColor: PURPLE }
                          : undefined
                      }
                      onClick={() => setSelectedFrontendSection("all")}
                    >
                      All frontend groups
                    </button>
                    {FRONTEND_SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          selectedFrontendSection === section.id
                            ? "text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                        style={
                          selectedFrontendSection === section.id
                            ? { backgroundColor: PURPLE }
                            : undefined
                        }
                        onClick={() => setSelectedFrontendSection(section.id)}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                </section>

                {editingProductId !== null ? (
                  <form
                    onSubmit={(e) => void updateProduct(e)}
                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                  >
                    <h3 className="mb-4 text-base font-semibold text-slate-800">
                      Update product
                    </h3>
                    {editFormError ? (
                      <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                        {editFormError}
                      </p>
                    ) : null}
                    <div className="grid gap-3 md:grid-cols-2">
                      <select
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        value={editProductForm.collection}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
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
                        value={editProductForm.name}
                        onChange={(e) =>
                          setEditProductForm((p) => ({ ...p, name: e.target.value }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Price"
                        type="number"
                        min="1"
                        value={editProductForm.price}
                        onChange={(e) =>
                          setEditProductForm((p) => ({ ...p, price: e.target.value }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Old price"
                        type="number"
                        min="0"
                        value={editProductForm.oldPrice}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
                            ...p,
                            oldPrice: e.target.value,
                          }))
                        }
                      />
                      <textarea
                        className="md:col-span-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Short description"
                        rows={3}
                        value={editProductForm.description}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                      />
                      <textarea
                        className="md:col-span-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Features (comma separated)"
                        rows={2}
                        value={editProductForm.featuresText}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
                            ...p,
                            featuresText: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Category"
                        value={editProductForm.category}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Chair type"
                        value={editProductForm.chairType}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
                            ...p,
                            chairType: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Badge label"
                        value={editProductForm.badgeLabel}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
                            ...p,
                            badgeLabel: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Hover image URL"
                        value={editProductForm.hoverImage}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
                            ...p,
                            hoverImage: e.target.value,
                          }))
                        }
                      />
                      <div className="flex items-center gap-2 md:col-span-2">
                        <input
                          id="edit-in-stock"
                          type="checkbox"
                          checked={editProductForm.inStock}
                          onChange={(e) =>
                            setEditProductForm((p) => ({
                              ...p,
                              inStock: e.target.checked,
                            }))
                          }
                        />
                        <label htmlFor="edit-in-stock" className="text-sm text-slate-700">
                          Product in stock
                        </label>
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2">
                        <input
                          id="edit-home-visible"
                          type="checkbox"
                          checked={editProductForm.showOnHome}
                          onChange={(e) =>
                            setEditProductForm((p) => ({
                              ...p,
                              showOnHome: e.target.checked,
                            }))
                          }
                        />
                        <label
                          htmlFor="edit-home-visible"
                          className="text-sm text-slate-700"
                        >
                          Show in homepage all collections
                        </label>
                      </div>
                      <input
                        className="md:col-span-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="Home display order (0,1,2...)"
                        type="number"
                        min="0"
                        value={editProductForm.homeOrder}
                        onChange={(e) =>
                          setEditProductForm((p) => ({
                            ...p,
                            homeOrder: Number(e.target.value || 0),
                          }))
                        }
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="md:col-span-2 w-full text-sm text-slate-600"
                        onChange={(e) => setEditProductImage(e.target.files?.[0] ?? null)}
                      />
                      <p className="md:col-span-2 text-xs text-slate-500">
                        Upload new image only if you want to replace current one.
                      </p>
                      <p className="md:col-span-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        Frontend slug preview:{" "}
                        <span className="font-semibold text-slate-800">
                          {suggestedEditSlug || "auto-generated"}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="submit"
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
                        style={{ backgroundColor: PURPLE }}
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditProduct}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : null}

                <TableCard title="Products">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-medium">Product</th>
                      <th className="px-5 py-3 font-medium">Collection</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Price</th>
                      <th className="px-5 py-3 font-medium">Image</th>
                      <th className="px-5 py-3 font-medium">Stock</th>
                      <th className="px-5 py-3 font-medium">Home</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
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
                        <td className="px-5 py-3 text-slate-600">
                          {item.category || "—"}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {item.chair_type || "—"}
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
                          <p className="mt-1 text-[11px] text-slate-500">
                            Badge: {item.badge_label || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50"
                            onClick={() =>
                              void patchStatus("products", item.id, {
                                show_on_home: !item.show_on_home,
                              })
                            }
                          >
                            {item.show_on_home ? "Visible" : "Hidden"}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEditProduct(item)}
                              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50"
                            >
                              Update
                            </button>
                            <Link
                              href={`/collections/${item.slug}`}
                              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Open page
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                void deleteResource("products", item.id, "Product")
                              }
                              className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>
              </div>
            </div>
          ) : null}

          {activeTab === "users" ? (
            <TableCard title="Registered users">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-3 font-medium text-slate-800">
                          {item.name}
                        </td>
                        <td className="px-5 py-3 text-slate-600">{item.email}</td>
                        <td className="px-5 py-3 text-slate-600">
                          {formatDateTime(item.date_joined)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </TableCard>
          ) : null}

          {activeTab === "orders" ? (
            <TableCard title="Customer orders">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Products selected</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Payment</th>
                    <th className="px-5 py-3 font-medium">Order status</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 align-top hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-3 whitespace-nowrap font-medium text-slate-800">
                          #{item.id}
                          <p className="mt-1 text-xs font-normal text-slate-500">
                            {formatDateTime(item.created_at)}
                          </p>
                        </td>
                        <td className="px-5 py-3 text-slate-700">
                          <p className="font-medium text-slate-800">{item.customer_name}</p>
                          <p className="text-xs">{item.customer_phone}</p>
                          <p className="text-xs">{item.customer_email}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-700">
                          <div className="space-y-1">
                            {item.items.map((line) => (
                              <p key={line.id} className="text-xs">
                                {line.product_name} x {line.quantity}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-800">
                          {formatPrice(item.total_amount)}
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-xs font-medium uppercase text-slate-500">
                            {item.payment_method}
                          </p>
                          <p className="text-xs text-slate-700">{item.payment_status}</p>
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-700">
                          {item.order_status}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-2">
                            <select
                              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                              value={item.payment_status}
                              onChange={(e) =>
                                void patchOrder(item.id, {
                                  payment_status: e.target.value as Order["payment_status"],
                                })
                              }
                            >
                              <option value="pending">pending</option>
                              <option value="paid">paid</option>
                              <option value="failed">failed</option>
                              <option value="refunded">refunded</option>
                            </select>
                            <select
                              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                              value={item.order_status}
                              onChange={(e) =>
                                void patchOrder(item.id, {
                                  order_status: e.target.value as Order["order_status"],
                                })
                              }
                            >
                              <option value="placed">placed</option>
                              <option value="processing">processing</option>
                              <option value="shipped">shipped</option>
                              <option value="delivered">delivered</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </TableCard>
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
                  {filteredContacts.map((item) => (
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
                  {filteredClaims.map((item) => (
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

          {activeTab === "kila-support" ? (
            <TableCard title="Kila support requests">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Address</th>
                    <th className="px-5 py-3 font-medium">Message</th>
                    <th className="px-5 py-3 font-medium">Submitted</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSupportRequests.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-3">{item.full_name}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {item.phone}
                      </td>
                      <td className="px-5 py-3">{item.email}</td>
                      <td
                        className="max-w-[240px] truncate px-5 py-3 text-slate-600"
                        title={item.address}
                      >
                        {item.address}
                      </td>
                      <td
                        className="max-w-[260px] truncate px-5 py-3 text-slate-600"
                        title={item.message}
                      >
                        {item.message}
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
                              item.status === "new"
                                ? "contacted"
                                : item.status === "contacted"
                                  ? "closed"
                                  : "new";
                            void patchStatus("support-requests", item.id, {
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
