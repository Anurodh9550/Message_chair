"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "../context/StoreContext";
import { getApiBaseUrl } from "../utils/apiBase";

type PaymentMethod = "gateway" | "upi" | "cod";

export default function CheckoutPage() {
  const API_BASE = getApiBaseUrl();
  const router = useRouter();
  const { user, cartItems, cartTotal, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("gateway");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <section className="mx-auto w-[95%] max-w-[680px] py-14">
        <div className="rounded-lg border border-[#f0dccd] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[#4b2e2b]">Checkout</h1>
          <p className="mt-2 text-[#6b4a3f]">
            Please login first to complete payment.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded bg-[#c7794a] px-4 py-2 text-white"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto w-[95%] max-w-[680px] py-14">
        <div className="rounded-lg border border-[#f0dccd] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[#4b2e2b]">Checkout</h1>
          <p className="mt-2 text-[#6b4a3f]">
            Your cart is empty. Add items before payment.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded bg-[#c7794a] px-4 py-2 text-white"
          >
            Shop Now
          </Link>
        </div>
      </section>
    );
  }

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setStatus("Please fill full name, phone and address.");
      return;
    }
    if (!user) {
      setStatus("Please login first.");
      return;
    }

    const payload = {
      customer_name: fullName.trim(),
      customer_email: user.email,
      customer_phone: phone.trim(),
      shipping_address: address.trim(),
      payment_method: paymentMethod,
      payment_status: paymentMethod === "cod" ? "pending" : "paid",
      order_status: "placed",
      notes:
        paymentMethod === "gateway"
          ? "Gateway payment initiated from frontend checkout."
          : "",
      items: cartItems.map((item) => ({
        product_name: item.name,
        product_slug: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        image_url: item.img,
      })),
    };

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Order create failed");
      }
      setStatus(
        paymentMethod === "cod"
          ? "Order placed. Payment status is pending (COD)."
          : "Order placed and payment marked paid.",
      );
      clearCart();
      window.setTimeout(() => {
        router.push("/");
      }, 1400);
    } catch (error) {
      setStatus(error instanceof Error ? error.message.slice(0, 140) : "Order failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-[95%] max-w-[980px] py-14">
      <h1 className="text-3xl font-semibold text-[#4b2e2b]">
        Checkout & Payment
      </h1>
      <p className="mt-2 text-[#6b4a3f]">Logged in as {user.email}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#f0dccd] bg-white p-5">
          <h2 className="text-xl font-semibold text-[#4b2e2b]">
            Order Summary
          </h2>
          <div className="mt-4 space-y-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap justify-between gap-2 text-sm"
              >
                <span className="pr-2">
                  {item.name} x {item.quantity}
                </span>
                <span>
                  Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-[#f0dccd] pt-3 text-lg font-semibold">
            Total: Rs. {cartTotal.toLocaleString("en-IN")}
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="rounded-lg border border-[#f0dccd] bg-white p-5"
        >
          <h2 className="text-xl font-semibold text-[#4b2e2b]">
            Payment Method
          </h2>

          <div className="mt-4 space-y-2">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-[#e7d8cc] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c79f80]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full rounded-lg border border-[#e7d8cc] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c79f80]"
            />
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shipping address"
              rows={3}
              className="w-full rounded-lg border border-[#e7d8cc] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c79f80]"
            />
          </div>

          <div className="mt-4 space-y-2 text-sm text-[#6b4a3f]">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "gateway"}
                onChange={() => setPaymentMethod("gateway")}
              />
              Gateway (Card / Netbanking / Wallet)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-[#7a4b2f] px-4 py-2.5 text-white transition hover:bg-[#5c3722]"
          >
            {submitting ? "Processing..." : "Place Order"}
          </button>
          {status && <p className="mt-3 text-sm text-green-700">{status}</p>}
        </form>
      </div>
    </section>
  );
}
