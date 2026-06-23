import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <>
      <Nav />
      <main className="flex flex-1 items-center px-5 py-32 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="brand-font text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">{t("title")}</h1>
          <p className="mt-6 text-base leading-8 text-muted">{t("description")}</p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
          >
            {t("home")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
