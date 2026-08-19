import Link from "next/link";
import { AuthMeshBackground } from "@/components/auth-mesh-background";
import { BrandLink } from "@/components/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  wide = false,
  hideIntro = false,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
  hideIntro?: boolean;
}) {
  return (
    <main className="auth-page relative flex min-h-screen flex-col">
      <AuthMeshBackground />
      <div className="auth-cut" aria-hidden="true" />
      <header className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-6 py-5">
        <BrandLink href="/" light />
        {process.env.NODE_ENV === "development" ? (
          <Link
            href="/dashboard"
            className="rounded-md bg-black/50 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-black/70"
          >
            DEV: Dashboard
          </Link>
        ) : null}
      </header>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-y-auto px-5 py-24">
        <div className={`auth-glass w-full p-8 ${wide ? "max-w-[480px]" : "max-w-[420px]"}`}>
          {hideIntro ? null : (
            <>
              <h1 className="text-center text-[22px] font-semibold tracking-[-0.01em] text-[#0a2540]">
                {title}
              </h1>
              <p className="mt-2 text-center text-[14px] leading-6 text-[#697386]">{subtitle}</p>
            </>
          )}
          {children}
          {footer ? (
            <div className="mt-6 text-center text-[13px] leading-6 text-[#425466]">{footer}</div>
          ) : null}
        </div>
        <p className="mt-5 text-center text-[12px] leading-5 text-[#425466]">
          <Link href="/privacy" className="hover:text-[#0a2540]">
            Privacy policy
          </Link>
          <span className="mx-2 text-[#c1c9d2]">·</span>
          <Link href="/terms" className="hover:text-[#0a2540]">
            Terms of service
          </Link>
        </p>
      </div>
    </main>
  );
}
