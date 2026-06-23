export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Spectr",
    legalName: "spectr as",
    url: "https://www.spectr.no",
    logo: "https://www.spectr.no/spectr-logo.png",
    email: "makwan@spectr.no",
    telephone: "+4746503934",
    taxID: "936961967",
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
