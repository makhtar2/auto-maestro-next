import Link from 'next/link';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

export default function NotFound() {
  return (
    <>
      <SiteHeader variant="detail" />
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-body p-6 text-center">
        <div className="max-w-md">
          <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-2">404 ERROR</span>
          <h1 className="font-title text-4xl sm:text-5xl font-extrabold mb-4">Page Not Found</h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            The page you are looking for does not exist or may have been moved.
          </p>
          <Link href="/" className="btn-hero-primary inline-flex">
            Return to Homepage
          </Link>
        </div>
      </main>
      <SiteFooter variant="detail" />
    </>
  );
}
