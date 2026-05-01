export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-[#4b2e2b]">
      <h1 className="text-3xl font-semibold text-stone-900">Return policy</h1>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        We want you to be satisfied with your purchase. Return eligibility depends on the
        product type, condition, and time since delivery. Please contact us before
        returning any item so we can guide you through the correct process.
      </p>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-sm text-stone-600">
        <li>Items must be unused and in original packaging where return is accepted.</li>
        <li>Some categories may be non-returnable due to hygiene or size constraints.</li>
        <li>Refunds or replacements, when approved, are processed as per company policy.</li>
      </ul>
      <p className="mt-8 text-sm text-stone-600">
        Start a return inquiry:{" "}
        <a href="/contact" className="font-medium text-[#c7794a] underline">
          Contact us
        </a>
        .
      </p>
    </div>
  );
}
