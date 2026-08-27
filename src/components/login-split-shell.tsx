import Link from "next/link";
import { AimWorkspacePreview } from "@/components/aim-workspace-preview";
import { BrandLink } from "@/components/logo";

export function LoginSplitShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="auth-page login-split">
      <div className="login-split__frame">
        <header className="mb-4 flex items-center justify-between px-1">
          <BrandLink />
          {process.env.NODE_ENV === "development" ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-black px-3 py-1.5 text-[12px] font-medium text-white hover:bg-black/80"
            >
              DEV: Dashboard
            </Link>
          ) : null}
        </header>

        <section className="login-split__card">
          <div className="login-split__visual">
            <AimWorkspacePreview />
          </div>

          <div className="login-split__form">
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#0a2540]">
              {title}
            </h1>
            <p className="mt-2 max-w-[34ch] text-[15px] leading-6 text-[#697386]">{subtitle}</p>
            {children}
            <p className="mt-8 text-[12px] leading-5 text-[#8792a2]">
              <Link href="/privacy" className="hover:text-[#0a2540]">
                Privacy policy
              </Link>
              <span className="mx-2 text-[#c1c9d2]">·</span>
              <Link href="/terms" className="hover:text-[#0a2540]">
                Terms of service
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
