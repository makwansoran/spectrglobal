export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Spectr",
    url: "https://www.spectr.no",
    logo: "https://www.spectr.no/spectr-logo.png",
    email: "makwan@spectr.no",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NO",
      addressLocality: "Norway",
    },
    sameAs: [
      "https://x.com/spectrnorway",
      "https://www.linkedin.com/company/spectr-norway/",
      "https://www.instagram.com/spectr.no/",
      "https://www.youtube.com/@SpectrNorway",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
