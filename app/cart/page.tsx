"use client";

import Link from "next/link";
import { useStore } from "../context/StoreContext";

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useStore();

  return (
    <section className="mx-auto w-[95%] max-w-[980px] py-14">
      <h1 className="text-3xl font-semibold text-[#4b2e2b]">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="mt-6 rounded-lg border border-[#f0dccd] bg-white p-6">
          <p className="text-[#6b4a3f]">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded bg-[#7a4b2f] px-4 py-2 text-sm text-white"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-lg border border-[#f0dccd] bg-white p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-16 w-16 object-contain"
                />
                <div className="min-w-0">
                  <p className="line-clamp-2 font-medium text-[#4b2e2b]">
                    {item.name}
                  </p>
                  <p className="text-sm text-[#6b4a3f]">
                    Rs. {item.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="rounded border border-[#f0dccd] px-3 py-1"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="rounded border border-[#f0dccd] px-3 py-1"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="rounded border border-red-200 px-3 py-1 text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-[#f0dccd] bg-white p-5">
            <p className="text-lg font-semibold">
              Total: Rs. {cartTotal.toLocaleString("en-IN")}
            </p>
            <Link
              href="/checkout"
              className="mt-3 inline-block rounded bg-[#c7794a] px-4 py-2 text-white"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
