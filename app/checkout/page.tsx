"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "../context/StoreContext";

type PaymentMethod = "card" | "upi" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, cartItems, cartTotal, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [status, setStatus] = useState("");

  if (!user) {
    return (
      <section className="mx-auto w-[95%] max-w-[680px] py-14">
        <div className="rounded-lg border border-[#d9ebdc] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[#4f3a35]">Checkout</h1>
          <p className="mt-2 text-[#5b4740]">
            Please login first to complete payment.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded bg-[#63c66d] px-4 py-2 text-white"
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
        <div className="rounded-lg border border-[#d9ebdc] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[#4f3a35]">Checkout</h1>
          <p className="mt-2 text-[#5b4740]">
            Your cart is empty. Add items before payment.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded bg-[#63c66d] px-4 py-2 text-white"
          >
            Shop Now
          </Link>
        </div>
      </section>
    );
  }

  const handlePlaceOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(`Order placed successfully via ${paymentMethod.toUpperCase()}.`);
    clearCart();
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <section className="mx-auto w-[95%] max-w-[980px] py-14">
      <h1 className="text-3xl font-semibold text-[#4f3a35]">
        Checkout & Payment
      </h1>
      <p className="mt-2 text-[#5b4740]">Logged in as {user.email}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#d9ebdc] bg-white p-5">
          <h2 className="text-xl font-semibold text-[#4f3a35]">
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
          <p className="mt-4 border-t border-[#d9ebdc] pt-3 text-lg font-semibold">
            Total: Rs. {cartTotal.toLocaleString("en-IN")}
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="rounded-lg border border-[#d9ebdc] bg-white p-5"
        >
          <h2 className="text-xl font-semibold text-[#4f3a35]">
            Payment Method
          </h2>

          <div className="mt-4 space-y-2 text-sm text-[#5b4740]">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Credit / Debit Card
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
            className="mt-6 w-full rounded-lg bg-[#4f3a35] px-4 py-2.5 text-white transition hover:bg-[#5b4740]"
          >
            Place Order
          </button>
          {status && <p className="mt-3 text-sm text-green-700">{status}</p>}
        </form>
      </div>
    </section>
  );
}
