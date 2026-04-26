export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-[#4f3a35]">
      <h1 className="text-3xl font-semibold text-stone-900">Shipping policy</h1>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        We aim to dispatch orders promptly after confirmation. Delivery timelines depend
        on your location and product availability. You will receive updates by SMS or
        email where applicable.
      </p>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-sm text-stone-600">
        <li>Free shipping may apply on eligible products as shown on the product page.</li>
        <li>Large items such as massage chairs are delivered through our logistics partners.</li>
        <li>If a shipment is delayed, we will notify you and work to resolve the issue.</li>
      </ul>
      <p className="mt-8 text-sm text-stone-600">
        Questions?{" "}
        <a href="/contact" className="font-medium text-[#63c66d] underline">
          Contact us
        </a>
        .
      </p>
    </div>
  );
}
