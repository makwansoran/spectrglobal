import type { CompanyProfile } from "../types/company";
import type { CompanySeed } from "./seed-types";

export const equinorBlocksGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Troll",
        license: "PL085",
        operator: "Equinor",
        partners: "Petoro, Shell, TotalEnergies",
        status: "Producing",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [3.45, 60.58],
            [3.95, 60.58],
            [3.95, 60.92],
            [3.45, 60.92],
            [3.45, 60.58],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Johan Sverdrup",
        license: "PL265",
        operator: "Equinor",
        partners: "Aker BP, Petoro, TotalEnergies",
        status: "Producing",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2.55, 58.95],
            [3.15, 58.95],
            [3.15, 59.35],
            [2.55, 59.35],
            [2.55, 58.95],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Snorre",
        license: "PL057",
        operator: "Equinor",
        partners: "Vår Energi, Petoro",
        status: "Producing",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2.05, 61.38],
            [2.55, 61.38],
            [2.55, 61.72],
            [2.05, 61.72],
            [2.05, 61.38],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Oseberg",
        license: "PL163",
        operator: "Equinor",
        partners: "TotalEnergies, ConocoPhillips, Petoro",
        status: "Producing",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2.65, 60.42],
            [3.15, 60.42],
            [3.15, 60.72],
            [2.65, 60.72],
            [2.65, 60.42],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Martin Linge",
        license: "PL298",
        operator: "Equinor",
        partners: "Petoro",
        status: "Producing",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [4.85, 59.92],
            [5.25, 59.92],
            [5.25, 60.18],
            [4.85, 60.18],
            [4.85, 59.92],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Wisting",
        license: "PL537",
        operator: "Equinor",
        partners: "Aker BP, Petoro, PGNiG",
        status: "Development",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [19.2, 73.42],
            [19.85, 73.42],
            [19.85, 73.78],
            [19.2, 73.78],
            [19.2, 73.42],
          ],
        ],
      },
    },
  ],
};

export const equinorProfile: CompanyProfile = {
  id: "equinor",
  name: "Equinor",
  legalName: "Equinor ASA",
  logoInitials: "EQ",
  countryCode: "NO",
  countryName: "Norway",
  founded: 1972,
  headquarters: "Stavanger, Norway",
  industryTags: ["Oil & Gas", "Energy", "Integrated"],
  isPublic: true,
  stock: {
    ticker: "EQNR",
    exchange: "NYSE",
    price: 28.42,
    change: 0.38,
    changePercent: 1.35,
    currency: "USD",
  },
  industry: "oil_gas",
  industryTabLabel: "Blocks",
  about:
    "Equinor ASA is a Norwegian state-majority-owned energy company engaged in exploration, development, and production of oil and gas, with growing investments in renewables and low-carbon solutions. The company operates across the Norwegian Continental Shelf, international upstream assets, and an integrated marketing & midstream business. Equinor is among Europe's largest offshore operators and a leading producer in the North Sea.",
  quickStats: [
    { label: "Employees", value: 22000, format: "number" },
    { label: "Revenue", value: 107_000_000_000, format: "currency" },
    { label: "Market cap", value: 87_000_000_000, format: "currency" },
  ],
  people: [
    {
      id: "1",
      name: "Anders Opedal",
      title: "President & CEO",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anders",
    },
    {
      id: "2",
      name: "Torgrim Reitan",
      title: "EVP, Exploration & Production",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Torgrim",
    },
    {
      id: "3",
      name: "Pål Eitrheim",
      title: "EVP, Renewables",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pal",
    },
    {
      id: "4",
      name: "Hanne Lekva",
      title: "EVP, People & Organisation",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hanne",
    },
    {
      id: "5",
      name: "Irene Rummelhoff",
      title: "EVP, Marketing, Midstream & Processing",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Irene",
    },
    {
      id: "6",
      name: "Geir Tungesvik",
      title: "EVP, Projects, Drilling & Procurement",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Geir",
    },
  ],
  financials: {
    years: [
      { year: 2020, revenue: 45_800_000_000, ebitda: 12_100_000_000, netIncome: -5_500_000_000 },
      { year: 2021, revenue: 60_900_000_000, ebitda: 24_800_000_000, netIncome: 8_600_000_000 },
      { year: 2022, revenue: 150_800_000_000, ebitda: 79_200_000_000, netIncome: 28_700_000_000 },
      { year: 2023, revenue: 107_100_000_000, ebitda: 52_400_000_000, netIncome: 21_200_000_000 },
      { year: 2024, revenue: 98_500_000_000, ebitda: 48_100_000_000, netIncome: 18_900_000_000 },
    ],
    metrics: [
      { label: "Revenue (TTM)", value: 98_500_000_000, format: "currency", change: -8.0 },
      { label: "EBITDA", value: 48_100_000_000, format: "currency", change: -8.2 },
      { label: "Net income", value: 18_900_000_000, format: "currency", change: -10.8 },
      { label: "Operating margin", value: 38.2, format: "percent", change: 1.2 },
      { label: "Debt / EBITDA", value: 0.82, format: "ratio", change: -0.05 },
      { label: "ROE", value: 21.4, format: "percent", change: -2.1 },
    ],
  },
  news: [
    {
      id: "n1",
      title: "Equinor raises Johan Sverdrup production guidance after tie-in completion",
      source: "Reuters",
      date: "2026-05-12",
      summary: "The operator expects plateau rates to exceed prior forecasts following subsea upgrades on the Utsira High.",
    },
    {
      id: "n2",
      title: "Norway awards three APA licences with Equinor as operator on two blocks",
      source: "Upstream",
      date: "2026-04-28",
      summary: "Awards reinforce Equinor's position in mature areas of the Norwegian Continental Shelf.",
    },
    {
      id: "n3",
      title: "Equinor and partners sanction Hywind Tampen expansion study",
      source: "Energy Voice",
      date: "2026-04-15",
      summary: "Floating offshore wind concept could supply additional electrification to North Sea platforms.",
    },
    {
      id: "n4",
      title: "Q1 2026 results: adjusted earnings beat consensus on strong gas marketing",
      source: "Company release",
      date: "2026-04-30",
      summary: "Integrated marketing & midstream offset lower liquids realizations versus prior quarter.",
    },
    {
      id: "n5",
      title: "Equinor sells non-core UK upstream package to focus on NCS core areas",
      source: "Bloomberg",
      date: "2026-03-18",
      summary: "Portfolio high-grading continues as capital is redirected to Johan Sverdrup and renewables pipeline.",
    },
  ],
  filings: [
    {
      id: "f1",
      title: "Annual Report 2025",
      type: "10-K / Annual",
      date: "2026-03-20",
      jurisdiction: "Norway / SEC",
    },
    {
      id: "f2",
      title: "Q1 2026 Interim Report",
      type: "Quarterly",
      date: "2026-04-30",
      jurisdiction: "Oslo Børs",
    },
    {
      id: "f3",
      title: "Prospectus — Senior Unsecured Bonds",
      type: "Debt offering",
      date: "2026-02-10",
      jurisdiction: "EU Prospectus",
    },
  ],
  keyFacts: [
    { label: "Legal form", value: "Allmennaksjeselskap (ASA)" },
    { label: "State ownership", value: "67% (Norwegian state)" },
    { label: "Primary listing", value: "Oslo Børs (EQNR)" },
    { label: "CEO tenure", value: "Since 2020" },
    { label: "Proved reserves", value: "6.2 Bboe (2025)" },
    { label: "Production", value: "~2.1 mboe/d" },
  ],
  competitors: [
    { name: "Shell", country: "UK/NL", similarity: 92 },
    { name: "TotalEnergies", country: "France", similarity: 89 },
    { name: "BP", country: "UK", similarity: 86 },
    { name: "Aker BP", country: "Norway", similarity: 84 },
    { name: "Vår Energi", country: "Norway", similarity: 78 },
  ],
  funding: [
    {
      id: "m1",
      date: "2025-11-02",
      type: "Acquisition",
      amount: 2_400_000_000,
      counterparty: "Sval Energi",
      description: "Bolt-on NCS producing assets portfolio",
    },
    {
      id: "m2",
      date: "2025-06-18",
      type: "Divestiture",
      amount: 1_100_000_000,
      counterparty: "Private buyer",
      description: "UK upstream non-core package exit",
    },
    {
      id: "m3",
      date: "2024-09-05",
      type: "JV",
      counterparty: "BP",
      description: "Offshore wind partnership — US East Coast cluster",
    },
  ],
  esg: {
    overall: 72,
    environmental: 68,
    social: 74,
    governance: 78,
    trend: "up",
  },
  dataSources: [
    { name: "Oslo Børs", url: "https://www.oslobors.no" },
    { name: "SEC EDGAR" },
    { name: "Norwegian Petroleum Directorate" },
    { name: "Company disclosures" },
  ],
  lastUpdated: "2026-05-18T09:00:00Z",
  mapConfig: { center: [5.5, 61.2], zoom: 5 },
};

export const equinorSeed: CompanySeed = {
  slug: "equinor",
  profile: equinorProfile,
  mapGeojson: equinorBlocksGeoJSON as GeoJSON.GeoJsonObject,
  searchTerms: ["equinor", "equinor asa", "eqnr", "statoil"],
};
