import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: 'Terms of Service | Auto Maestro LLC',
  description: 'Terms of service for scheduling test drives, requesting quotes, and financing estimates through Auto Maestro LLC.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <SiteHeader variant="detail" />

      <main className="bg-body py-16">
        <div className="container max-w-3xl">
          <h1 className="font-title text-4xl font-extrabold mb-2">Terms of Service</h1>
          <p className="text-text-muted mb-10">Last updated: {new Date().getFullYear()}</p>

          <div className="flex flex-col gap-8 text-text-main leading-relaxed">
            <section>
              <h2 className="font-title text-xl font-bold mb-2">1. Test Drive Appointments</h2>
              <p>Scheduling a test drive through this site is a request, not a guaranteed reservation. AUTO MAESTRO LLC will confirm availability directly with you before your appointment.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">2. Financing Estimates</h2>
              <p>Any monthly payment or financing figures shown on this site are estimates only, based on the inputs provided, and do not constitute a loan offer. Final financing terms are subject to credit approval and lender conditions.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">3. Vehicle Availability</h2>
              <p>Inventory listed on this site is subject to prior sale. Submitting an inquiry does not reserve a vehicle unless confirmed in writing by our sales team.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">4. Accuracy of Information</h2>
              <p>While we strive for accuracy, occasional errors in pricing, specifications, or availability may occur. We reserve the right to correct any such errors.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">5. Changes to These Terms</h2>
              <p>We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">6. Contact</h2>
              <p>For questions about these terms, contact us at <a href="mailto:contact@automaestro.com" className="text-primary underline">contact@automaestro.com</a>.</p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter variant="detail" />
    </>
  );
}
