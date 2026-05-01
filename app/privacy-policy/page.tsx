export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-[#4b2e2b]">
      <h1 className="text-3xl font-semibold text-stone-900">Privacy policy</h1>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        We respect your privacy. Information you provide when browsing, ordering, or
        contacting us is used to fulfil orders, improve our service, and communicate with
        you about your purchases.
      </p>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-sm text-stone-600">
        <li>We do not sell your personal data to third parties for marketing.</li>
        <li>Payment processing may be handled by trusted payment partners.</li>
        <li>You may request clarification on how your data is used via our contact page.</li>
      </ul>
      <p className="mt-8 text-sm text-stone-600">
        Contact:{" "}
        <a href="/contact" className="font-medium text-[#c7794a] underline">
          Contact us
        </a>
        .
      </p>
    </div>
  );
}
