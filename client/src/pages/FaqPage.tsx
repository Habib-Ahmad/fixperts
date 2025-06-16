const FaqPage = () => (
  <section className="max-w-3xl mx-auto py-10 px-6">
    <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>

    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">How do I become a service provider?</h2>
        <p className="text-gray-600">Sign up and select “Service Provider” during registration. Complete your profile and upload certifications.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">How do I pay for a booking?</h2>
        <p className="text-gray-600">Once a quote is accepted, you can securely pay via our platform using your preferred payment method.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Can I cancel a booking?</h2>
        <p className="text-gray-600">Yes, but cancellations may be subject to fees based on timing. Contact support for assistance.</p>
      </div>
    </div>
  </section>
);
export default FaqPage;
