/**
 * Legacy demo shapes only — catalog/contact/warranty seed DB via backend:
 * `python manage.py seed_frontend_data`
 * SiteChrome uses STORAGE_KEYS.featureSettings only.
 */
export const STORAGE_KEYS = {
  products: "admin_products",
  contactSubmissions: "admin_contact_submissions",
  warrantyClaims: "admin_warranty_claims",
  featureSettings: "admin_feature_settings",
} as const;

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  comment: string;
  createdAt: string;
  status: "new" | "resolved";
};

export type WarrantyClaim = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  purchaseDate: string;
  issue: string;
  createdAt: string;
  status: "pending" | "in-progress" | "closed";
};

export type FeatureSettings = {
  showHeader: boolean;
  showFooter: boolean;
  showFloatingContact: boolean;
};

export const defaultProducts: AdminProduct[] = [
  {
    id: "prd-opulent-prime",
    name: "Opulent Prime Massage Chair",
    category: "Premium",
    price: 339999,
    stock: 8,
    active: true,
  },
  {
    id: "prd-magic-plus",
    name: "Magic Plus Advanced Chair",
    category: "Family",
    price: 98999,
    stock: 15,
    active: true,
  },
  {
    id: "prd-majestic-neo",
    name: "Majestic Neo Zero Gravity",
    category: "Zero Gravity",
    price: 210999,
    stock: 4,
    active: true,
  },
  {
    id: "prd-regal-ai",
    name: "Regal AI Voice Chair",
    category: "Premium",
    price: 399999,
    stock: 0,
    active: false,
  },
];

export const defaultContactSubmissions: ContactSubmission[] = [
  {
    id: "ct-1001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    comment: "Need demo for Opulent Prime in Delhi.",
    createdAt: "2026-04-19T10:22:00.000Z",
    status: "new",
  },
  {
    id: "ct-1002",
    name: "Pooja Verma",
    email: "pooja@example.com",
    phone: "+91 9988776655",
    comment: "Looking for dealership terms in Jaipur.",
    createdAt: "2026-04-20T08:10:00.000Z",
    status: "resolved",
  },
];

export const defaultWarrantyClaims: WarrantyClaim[] = [
  {
    id: "wc-2001",
    customerName: "Ankit Singh",
    email: "ankit@example.com",
    phone: "+91 9090909090",
    productName: "Majestic Neo Zero Gravity",
    purchaseDate: "2025-11-05",
    issue: "Leg rest motor is making unusual sound.",
    createdAt: "2026-04-18T12:32:00.000Z",
    status: "pending",
  },
  {
    id: "wc-2002",
    customerName: "Neha Arora",
    email: "neha@example.com",
    phone: "+91 9000011111",
    productName: "Magic Plus Advanced Chair",
    purchaseDate: "2025-09-20",
    issue: "Remote display not responding intermittently.",
    createdAt: "2026-04-21T09:12:00.000Z",
    status: "in-progress",
  },
];

export const defaultFeatureSettings: FeatureSettings = {
  showHeader: true,
  showFooter: true,
  showFloatingContact: true,
};
