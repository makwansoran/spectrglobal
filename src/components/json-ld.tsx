import { site } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/spectr-logo.png`,
    description: site.description,
    email: site.email,
    telephone: site.phone.replace(/\s/g, ""),
    taxID: site.orgNumber.replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      addressCountry: "NO",
      addressLocality: site.location,
    },
    sameAs: Object.values(site.social),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
