import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy | Auto Maestro LLC',
  description: 'How Auto Maestro LLC collects, uses, protects, and respects your personal and inquiry data.',
  alternates: {
    canonical: 'https://www.automaestrocars.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Auto Maestro LLC',
    description: 'How Auto Maestro LLC collects, uses, protects, and respects your personal and inquiry data.',
    url: 'https://www.automaestrocars.com/privacy-policy',
  }
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader variant="detail" />

      <main className="bg-body py-16">
        <div className="container max-w-3xl">
          <h1 className="font-title text-4xl font-extrabold mb-2">Privacy Policy</h1>
          <p className="text-text-muted mb-10">Last updated: {new Date().getFullYear()}</p>

          <div className="flex flex-col gap-8 text-text-main leading-relaxed">
            <section>
              <h2 className="font-title text-xl font-bold mb-2">1. Information We Collect</h2>
              <p>When you submit a contact form, schedule a test drive, or request vehicle information, we collect the details you provide: full name, email address, phone number, and any message or appointment details you include.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">2. How We Use Your Information</h2>
              <p>We use this information solely to respond to your inquiry, schedule appointments, and follow up on your interest in our vehicle inventory. We do not sell or rent your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">3. Third-Party Services</h2>
              <p>We use trusted third-party services to operate this site: Cloudinary for image hosting, and Resend for transactional email notifications. These providers process data solely on our behalf and under their own privacy and security commitments.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">4. Data Retention</h2>
              <p>Inquiry and appointment records are retained only as long as necessary to manage your request and our sales process, and can be deleted upon request.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">5. Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="font-title text-xl font-bold mb-2">6. Contact</h2>
              <p>For privacy-related questions, contact us at <a href="mailto:contact@automaestrocars.com" className="text-primary underline">contact@automaestrocars.com</a>.</p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter variant="detail" />
    </>
  );
}
