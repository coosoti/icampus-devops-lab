import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;

    if (password === process.env.ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      redirect(from ?? "/admin");
    } else {
      redirect("/admin/login?error=1");
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "2rem", width: "100%", maxWidth: 380 }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#3b82f6" opacity="0.12"/>
            <path d="M6 14L12 8L18 14L12 20L6 14Z" fill="#3b82f6"/>
            <path d="M14 14L20 8L26 14L20 20L14 14Z" fill="#f97316" opacity="0.85"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem", color: "var(--text-primary)", marginBottom: "0.4rem", letterSpacing: "-0.02em" }}>
          Admin access
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.75rem" }}>
          Enter your admin password to continue.
        </p>
        {error && (
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, padding: "0.5rem 0.75rem", marginBottom: "1rem" }}>
            Incorrect password. Try again.
          </div>
        )}
        <form action={login} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoFocus placeholder="Enter admin password" className="input" />
          </div>
          <button type="submit" className="btn-cta" style={{ justifyContent: "center" }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}