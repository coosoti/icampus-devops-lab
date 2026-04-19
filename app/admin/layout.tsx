import type { Metadata } from "next";

/**
 * app/admin/layout.tsx
 *
 * Applies noindex to ALL routes under /admin — the dashboard,
 * login page, and any future admin sub-pages — in one place.
 * Individual pages (like login) can still export their own
 * metadata; Next.js merges them, with the page-level taking
 * precedence for fields it defines.
 */
export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin — iCampus DevOps Lab",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}