export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-[#4b2e2b]">
      <h1 className="text-3xl font-semibold text-stone-900">Frequently asked questions</h1>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        Find answers about orders, delivery, warranty, and product care. For anything
        not listed here, use{" "}
        <a href="/contact" className="font-medium text-[#c7794a] underline">
          Contact
        </a>{" "}
        and our team will respond as soon as possible.
      </p>
      <ul className="mt-8 space-y-6 text-sm text-stone-600">
        <li>
          <p className="font-semibold text-stone-800">How do I place an order?</p>
          <p className="mt-1">
            Browse collections, add items to your cart, and complete checkout. You can
            also reach us by phone or email for assistance.
          </p>
        </li>
        <li>
          <p className="font-semibold text-stone-800">Do you ship across India?</p>
          <p className="mt-1">
            Yes. See our shipping policy for timelines and coverage details.
          </p>
        </li>
        <li>
          <p className="font-semibold text-stone-800">How does warranty work?</p>
          <p className="mt-1">
            Warranty terms vary by product. Use the claim warranty page to submit a
            request with your purchase details.
          </p>
        </li>
      </ul>
    </div>
  );
}
