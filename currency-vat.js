/**
 * currency-vat.js
 *
 * Detects the visitor's country via browser locale or geo-IP,
 * fetches live exchange rates relative to NOK, and applies the
 * correct local VAT/MVA rule so every price on the site is shown
 * in the visitor's own currency with the right tax label.
 *
 * Exposed as:  window.SpectrCurrency
 * Events:      window fires "spectr:currency" when country/rate is known.
 */
(function () {
  "use strict";

  /* ── Country / VAT table ─────────────────────────────────────────────────
     currency  = ISO 4217 code used for Intl.NumberFormat
     vatRate   = decimal (0.25 = 25%)
     vatLabel  = local tax abbreviation
     locale    = BCP 47 locale for Intl formatting                          */
  var COUNTRIES = {
    NO: { currency: "NOK", vatRate: 0.25, vatLabel: "MVA",   locale: "nb-NO", name: "Norway"      },
    SE: { currency: "SEK", vatRate: 0.25, vatLabel: "moms",  locale: "sv-SE", name: "Sweden"      },
    DK: { currency: "DKK", vatRate: 0.25, vatLabel: "moms",  locale: "da-DK", name: "Denmark"     },
    FI: { currency: "EUR", vatRate: 0.24, vatLabel: "ALV",   locale: "fi-FI", name: "Finland"     },
    DE: { currency: "EUR", vatRate: 0.19, vatLabel: "MwSt.", locale: "de-DE", name: "Germany"     },
    FR: { currency: "EUR", vatRate: 0.20, vatLabel: "TVA",   locale: "fr-FR", name: "France"      },
    IT: { currency: "EUR", vatRate: 0.22, vatLabel: "IVA",   locale: "it-IT", name: "Italy"       },
    ES: { currency: "EUR", vatRate: 0.21, vatLabel: "IVA",   locale: "es-ES", name: "Spain"       },
    NL: { currency: "EUR", vatRate: 0.21, vatLabel: "BTW",   locale: "nl-NL", name: "Netherlands" },
    BE: { currency: "EUR", vatRate: 0.21, vatLabel: "BTW",   locale: "nl-BE", name: "Belgium"     },
    AT: { currency: "EUR", vatRate: 0.20, vatLabel: "MwSt.", locale: "de-AT", name: "Austria"     },
    PT: { currency: "EUR", vatRate: 0.23, vatLabel: "IVA",   locale: "pt-PT", name: "Portugal"    },
    GR: { currency: "EUR", vatRate: 0.24, vatLabel: "ΦΠΑ",  locale: "el-GR", name: "Greece"      },
    PL: { currency: "PLN", vatRate: 0.23, vatLabel: "VAT",   locale: "pl-PL", name: "Poland"      },
    CZ: { currency: "CZK", vatRate: 0.21, vatLabel: "DPH",   locale: "cs-CZ", name: "Czechia"     },
    CH: { currency: "CHF", vatRate: 0.081,vatLabel: "MWST",  locale: "de-CH", name: "Switzerland" },
    GB: { currency: "GBP", vatRate: 0.20, vatLabel: "VAT",   locale: "en-GB", name: "UK"          },
    IE: { currency: "EUR", vatRate: 0.23, vatLabel: "VAT",   locale: "en-IE", name: "Ireland"     },
    US: { currency: "USD", vatRate: 0,    vatLabel: "",       locale: "en-US", name: "United States"},
    CA: { currency: "CAD", vatRate: 0.05, vatLabel: "GST",   locale: "en-CA", name: "Canada"      },
    AU: { currency: "AUD", vatRate: 0.10, vatLabel: "GST",   locale: "en-AU", name: "Australia"   },
    NZ: { currency: "NZD", vatRate: 0.15, vatLabel: "GST",   locale: "en-NZ", name: "New Zealand" },
    SG: { currency: "SGD", vatRate: 0.09, vatLabel: "GST",   locale: "en-SG", name: "Singapore"   },
    AE: { currency: "AED", vatRate: 0.05, vatLabel: "VAT",   locale: "ar-AE", name: "UAE"         },
    ZA: { currency: "ZAR", vatRate: 0.15, vatLabel: "VAT",   locale: "en-ZA", name: "South Africa"},
  };

  /* Baked-in fallback NOK rates (May 2026) — refreshed from open.er-api.com */
  var FALLBACK_RATES = {
    NOK: 1, SEK: 0.916, DKK: 0.668, EUR: 0.0897, GBP: 0.0765,
    USD: 0.0968, CAD: 0.133, AUD: 0.149, NZD: 0.164, CHF: 0.0878,
    PLN: 0.397, CZK: 2.21, SGD: 0.130, AED: 0.355, ZAR: 1.77,
  };

  var SK_COUNTRY  = "spectr_country_v1";
  var SK_RATES    = "spectr_rates_v1";
  var SK_RATES_TS = "spectr_rates_ts_v1";
  var RATES_TTL   = 6 * 60 * 60 * 1000;  // 6 hours

  var state = {
    country: "NO",
    config: COUNTRIES["NO"],
    rates: Object.assign({}, FALLBACK_RATES),
    ready: false,
  };

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ── Country detection ───────────────────────────────────────────────── */

  function ccFromLocale() {
    var langs = navigator.languages || (navigator.language ? [navigator.language] : []);
    for (var i = 0; i < langs.length; i++) {
      var parts = langs[i].split("-");
      var cc = (parts[parts.length - 1] || "").toUpperCase();
      if (COUNTRIES[cc]) return cc;
    }
    return null;
  }

  function detectCountry() {
    var saved = storeGet(SK_COUNTRY);
    if (saved && COUNTRIES[saved]) return Promise.resolve(saved);

    var fromLocale = ccFromLocale();
    if (fromLocale) return Promise.resolve(fromLocale);

    return fetch("https://ipapi.co/json/", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var cc = d && d.country_code ? d.country_code.toUpperCase() : "NO";
        return COUNTRIES[cc] ? cc : "NO";
      })
      .catch(function () { return "NO"; });
  }

  /* ── Exchange rate fetching ──────────────────────────────────────────── */

  function fetchRates() {
    var ts = parseInt(ssGet(SK_RATES_TS) || "0");
    if (Date.now() - ts < RATES_TTL) {
      try {
        var cached = JSON.parse(ssGet(SK_RATES) || "null");
        if (cached) { state.rates = cached; return Promise.resolve(); }
      } catch (e) {}
    }

    return fetch("https://open.er-api.com/v6/latest/NOK")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.rates) {
          state.rates = d.rates;
          ssSet(SK_RATES, JSON.stringify(d.rates));
          ssSet(SK_RATES_TS, String(Date.now()));
        }
      })
      .catch(function () { /* keep fallback */ });
  }

  /* ── Formatting ──────────────────────────────────────────────────────── */

  function convertNok(nokAmount) {
    var currency = state.config.currency;
    var rate = (state.rates && state.rates[currency]) ? state.rates[currency] : (FALLBACK_RATES[currency] || 1);
    return nokAmount * rate;
  }

  function formatAmount(amount, currency, locale) {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      return currency + "\u00a0" + Math.round(amount);
    }
  }

  function format(nokAmount) {
    var cfg = state.config;
    return formatAmount(convertNok(nokAmount), cfg.currency, cfg.locale);
  }

  function vatHtml(nokAmount) {
    var cfg = state.config;
    if (!cfg.vatRate) return "";
    var pct = Math.round(cfg.vatRate * 100);
    return "inkl.\u00a0" + pct + "\u00a0% " + cfg.vatLabel;
  }

  /* ── Country badge UI ────────────────────────────────────────────────── */

  function buildBadge() {
    if (document.getElementById("spectr-currency-badge")) return;

    var badge = document.createElement("div");
    badge.id = "spectr-currency-badge";
    badge.setAttribute("aria-label", "Change currency/country");
    badge.setAttribute("title", "Change currency");

    var currentEl = document.createElement("button");
    currentEl.id = "spectr-currency-btn";
    currentEl.type = "button";
    badge.appendChild(currentEl);

    var dropdown = document.createElement("div");
    dropdown.id = "spectr-currency-dropdown";
    dropdown.hidden = true;

    // Popular currencies
    var popular = ["NO","SE","DK","FI","DE","FR","GB","US","AU","CH"];
    popular.forEach(function (cc) {
      var cfg = COUNTRIES[cc];
      if (!cfg) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.cc = cc;
      btn.textContent = cfg.currency + " — " + cfg.name;
      btn.addEventListener("click", function () {
        setCountry(cc);
        dropdown.hidden = true;
      });
      dropdown.appendChild(btn);
    });

    badge.appendChild(dropdown);

    currentEl.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });

    document.addEventListener("click", function () { dropdown.hidden = true; });

    var tools = document.querySelector(".plt-header-tools");
    if (tools) tools.insertBefore(badge, tools.firstChild);
  }

  function updateBadge() {
    var btn = document.getElementById("spectr-currency-btn");
    if (!btn) return;
    btn.textContent = state.config.currency;
    var pct = state.config.vatRate ? Math.round(state.config.vatRate * 100) + "% " + state.config.vatLabel : "";
    btn.title = state.config.name + (pct ? " · " + pct : "");
    // Highlight active country in dropdown
    var items = document.querySelectorAll("#spectr-currency-dropdown button");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("is-active", items[i].dataset.cc === state.country);
    }
  }

  /* ── Public setCountry ───────────────────────────────────────────────── */

  function setCountry(cc) {
    if (!COUNTRIES[cc]) return;
    state.country = cc;
    state.config = COUNTRIES[cc];
    storeSet(SK_COUNTRY, cc);
    updateBadge();
    window.dispatchEvent(new CustomEvent("spectr:currency", { detail: state }));
  }

  /* ── Init ────────────────────────────────────────────────────────────── */

  function init() {
    Promise.all([detectCountry(), fetchRates()]).then(function (res) {
      var cc = res[0] || "NO";
      state.country = cc;
      state.config = COUNTRIES[cc] || COUNTRIES["NO"];
      state.ready = true;

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () { buildBadge(); updateBadge(); });
      } else {
        buildBadge();
        updateBadge();
      }

      window.dispatchEvent(new CustomEvent("spectr:currency", { detail: state }));
    });
  }

  /* ── Expose API ──────────────────────────────────────────────────────── */
  window.SpectrCurrency = {
    get country()  { return state.country; },
    get config()   { return state.config; },
    get rates()    { return state.rates; },
    get ready()    { return state.ready; },
    countries:     COUNTRIES,
    format:        format,
    vatHtml:       vatHtml,
    setCountry:    setCountry,
    convertFromNok: convertNok,
  };

  init();
})();
