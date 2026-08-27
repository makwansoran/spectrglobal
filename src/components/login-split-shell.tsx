import Link from "next/link";
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
      <header className="login-split__header">
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

      <div className="login-split__body">
        <div className="login-split__pane">
          <div className="login-split__modal auth-glass">
            <h1 className="text-center text-[22px] font-semibold tracking-[-0.01em] text-[#0a2540]">
              {title}
            </h1>
            <p className="mt-2 text-center text-[14px] leading-6 text-[#697386]">{subtitle}</p>
            {children}
          </div>
          <p className="login-split__legal">
            <Link href="/privacy" className="hover:text-[#0a2540]">
              Privacy policy
            </Link>
            <span className="mx-2 text-[#c1c9d2]">·</span>
            <Link href="/terms" className="hover:text-[#0a2540]">
              Terms of service
            </Link>
          </p>
        </div>

        <img
          src="/images/login/spectr-aim-laptop.png"
          alt="Spectr"
          width={1024}
          height={576}
          className="login-split__image"
        />
      </div>
    </main>
  );
}
