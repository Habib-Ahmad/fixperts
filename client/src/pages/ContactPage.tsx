const ContactPage = () => (
  <section className="max-w-3xl mx-auto py-10 px-6">
    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
    <p className="mb-6 text-gray-600">We’re here to help. Reach out with any questions or concerns you have.</p>

    <div className="space-y-4 text-gray-800">
      <div>
        <strong>Email:</strong> <a href="mailto:support@fixperts.com" className="text-blue-600 underline">support@fixperts.com</a>
      </div>
      <div>
        <strong>Phone:</strong> +1 (555) 123-4567
      </div>
      <div>
        <strong>Business Hours:</strong> Monday – Friday, 9am – 5pm CET
      </div>
    </div>
  </section>
);
export default ContactPage;
