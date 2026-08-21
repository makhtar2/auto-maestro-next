import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: 'Legal Terms & Conditions | Auto Maestro LLC',
  description: 'Legal terms and conditions governing vehicle sales, appointments, and showroom services at Auto Maestro LLC.',
  alternates: {
    canonical: 'https://www.automaestrocars.com/legal-terms',
  },
  openGraph: {
    title: 'Legal Terms & Conditions | Auto Maestro LLC',
    description: 'Legal terms and conditions governing vehicle sales, appointments, and showroom services at Auto Maestro LLC.',
    url: 'https://www.automaestrocars.com/legal-terms',
  }
};

export default function LegalTermsPage() {
  return (
    <>
      <SiteHeader variant="detail" />

      <main className="bg-body py-16">
        <div className="container max-w-3xl">
          <h1 className="font-title text-4xl font-extrabold mb-2">Legal Terms</h1>
          <p className="text-text-muted mb-10">Last updated: {new Date().getFullYear()}</p>

          <div className="flex flex-col gap-8 text-text-main leading-relaxed">
            <section>
              <h2 className="font-title text-xl font-bold mb-2">1. Company Information</h2>
              <p>AUTO MAESTRO LLC ("we", "us", "our") operates this website to showcase and market its vehicle inventory. By accessing this site, you agree to the terms described below.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">2. Vehicle Listings</h2>
              <p>All vehicle information, including pricing, mileage, specifications, and availability, is provided in good faith but may change without notice. Listed prices do not include applicable taxes, registration, or dealer fees unless stated otherwise. We recommend confirming all details directly with our sales team before completing a purchase.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">3. Intellectual Property</h2>
              <p>All content on this site — including text, images, logos, and design — is the property of AUTO MAESTRO LLC or its licensors and may not be reproduced without written permission.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">4. Limitation of Liability</h2>
              <p>AUTO MAESTRO LLC is not liable for any indirect, incidental, or consequential damages arising from the use of this website or reliance on the information it contains.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">5. Governing Law</h2>
              <p>These terms are governed by the laws of the United States and the state in which AUTO MAESTRO LLC is registered, without regard to conflict-of-law principles.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">6. Contact</h2>
              <p>Questions about these terms can be sent to <a href="mailto:contact@automaestrocars.com" className="text-primary underline">contact@automaestrocars.com</a>.</p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter variant="detail" />
    </>
  );
}
