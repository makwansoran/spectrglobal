/**
 * Euronext Live product-directory screeners (CSV download per market).
 * @see https://live.euronext.com/en/markets
 */

const EURONEXT_MARKETS = [
  {
    key: "oslo",
    locale: "nb",
    pathSegment: "stocks-oslo",
    mics: "MERK,XOAS,XOSL",
    defaultCurrency: "NOK",
    marketUrl: "https://live.euronext.com/nb/markets/oslo",
    micRules: [
      { test: /growth/i, mic: "XOAS" },
      { test: /merkur/i, mic: "MERK" },
      { test: /.*/, mic: "XOSL" },
    ],
  },
  {
    key: "amsterdam",
    locale: "en",
    pathSegment: "stocks-amsterdam",
    mics: "XAMS,XAPA,XEUE",
    defaultCurrency: "EUR",
    marketUrl: "https://live.euronext.com/en/markets/amsterdam",
    defaultMic: "XAMS",
  },
  {
    key: "paris",
    locale: "en",
    pathSegment: "stocks-paris",
    mics: "XPAR,ALXP",
    defaultCurrency: "EUR",
    marketUrl: "https://live.euronext.com/en/markets/paris",
    defaultMic: "XPAR",
  },
  {
    key: "brussels",
    locale: "en",
    pathSegment: "stocks-brussels",
    mics: "XBRU,ALXB",
    defaultCurrency: "EUR",
    marketUrl: "https://live.euronext.com/en/markets/brussels",
    defaultMic: "XBRU",
  },
  {
    key: "dublin",
    locale: "en",
    pathSegment: "stocks-dublin",
    mics: "XDUB",
    defaultCurrency: "EUR",
    marketUrl: "https://live.euronext.com/en/markets/dublin",
    defaultMic: "XDUB",
  },
  {
    key: "lisbon",
    locale: "en",
    pathSegment: "stocks-lisbon",
    mics: "XLIS",
    defaultCurrency: "EUR",
    marketUrl: "https://live.euronext.com/en/markets/lisbon",
    defaultMic: "XLIS",
  },
  {
    key: "milan",
    locale: "en",
    pathSegment: "stocks-milan",
    mics: "XMIL",
    defaultCurrency: "EUR",
    marketUrl: "https://live.euronext.com/en/markets/milan",
    defaultMic: "XMIL",
  },
  {
    key: "oslo-bonds",
    locale: "nb",
    pathSegment: "bonds-oslo",
    mics: "XOSL",
    defaultCurrency: "NOK",
    marketUrl: "https://live.euronext.com/nb/markets/oslo",
    defaultMic: "XOSL",
    optional: true,
  },
];

function getMarket(key) {
  return EURONEXT_MARKETS.find((m) => m.key === key) || null;
}

function listMarkets({ includeOptional = false } = {}) {
  return EURONEXT_MARKETS.filter((m) => includeOptional || !m.optional);
}

module.exports = { EURONEXT_MARKETS, getMarket, listMarkets };
