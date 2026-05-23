/**
 * analytics-static.js — Spectr Analytics & Tracking
 *
 * Loads and initialises:
 *   1. Google Consent Mode v2  (MUST run before gtag.js)
 *   2. Google Analytics 4      (G-XXXXXXXXXX — replace with real ID)
 *   3. Meta (Facebook) Pixel   (XXXXXXXXXXXXXXXXX — replace with real ID)
 *   4. Microsoft Clarity        (xxxxxxxxxx — replace with real ID)
 *   5. Vercel Web Analytics    (already loaded here; kept for deploy metrics)
 *
 * All non-essential tracking is gated behind spectr:consent events.
 * Defaults are "denied" — compliant with GDPR / ePrivacy / Norwegian MVA rules.
 *
 * ─── REPLACE THESE PLACEHOLDERS BEFORE GO-LIVE ───────────────────────────
 *   GA4_ID      = "G-XXXXXXXXXX"
 *   META_PIXEL  = "XXXXXXXXXXXXXXXXX"
 *   CLARITY_ID  = "xxxxxxxxxx"
 * ─────────────────────────────────────────────────────────────────────────
 */
(function () {
  "use strict";

  /* ── CONFIG — swap these values for real IDs ─────────────────────────── */
  var GA4_ID     = "G-XXXXXXXXXX";         // Google Analytics 4 Measurement ID
  var META_PIXEL = "XXXXXXXXXXXXXXXXX";    // Meta / Facebook Pixel ID
  var CLARITY_ID = "xxxxxxxxxx";           // Microsoft Clarity Project ID
  /* ──────────────────────────────────────────────────────────────────────── */

  var host    = window.location.hostname;
  var isLocal = host === "localhost" || host === "127.0.0.1" || host === "";
  var isProd  = !isLocal;

  /* ── 1. Google Consent Mode v2 defaults — must run before gtag.js ────── */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("consent", "default", {
    analytics_storage:  "denied",
    ad_storage:         "denied",
    ad_user_data:       "denied",
    ad_personalization: "denied",
    wait_for_update:    500,
  });

  gtag("set", "ads_data_redaction", true);
  gtag("set", "url_passthrough", true);

  /* ── 2. Google Analytics 4 ───────────────────────────────────────────── */
  function loadGA4() {
    if (document.getElementById("spectr-ga4")) return;
    var s = document.createElement("script");
    s.id    = "spectr-ga4";
    s.async = true;
    s.src   = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA4_ID, {
      send_page_view:          true,
      cookie_flags:            "SameSite=None;Secure",
      cookie_domain:           "auto",
      link_attribution:        true,
      allow_google_signals:    true,
      allow_ad_personalization_signals: true,
    });
  }

  /* ── 3. Meta (Facebook) Pixel ───────────────────────────────────────── */
  var metaLoaded = false;
  function loadMetaPixel() {
    if (metaLoaded) return;
    metaLoaded = true;
    /* Standard Meta Pixel base code */
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq("init", META_PIXEL);
    window.fbq("track", "PageView");
  }

  /* ── 4. Microsoft Clarity ────────────────────────────────────────────── */
  var clarityLoaded = false;
  function loadClarity() {
    if (clarityLoaded) return;
    clarityLoaded = true;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script",CLARITY_ID);
  }

  /* ── 5. Vercel Web Analytics ─────────────────────────────────────────── */
  function loadVercel() {
    if (document.getElementById("spectr-vercel-va")) return;
    var s = document.createElement("script");
    s.id    = "spectr-vercel-va";
    s.defer = true;
    s.src   = isLocal
      ? "https://cdn.vercel-insights.com/v1/script.debug.js"
      : "/_vercel/insights/script.js";
    document.head.appendChild(s);
  }

  /* ── Track ecommerce events ──────────────────────────────────────────── */
  window.SpectrTrack = {
    /** Call when a product card is clicked */
    viewItem: function (part) {
      gtag("event", "view_item", {
        currency: (window.SpectrCurrency && window.SpectrCurrency.config)
          ? window.SpectrCurrency.config.currency : "NOK",
        value: Number(part.price) || 0,
        items: [{ item_id: part.id || part.sku, item_name: part.name, price: part.price, item_category: part.category }],
      });
    },
    /** Call when item is added to cart */
    addToCart: function (part, qty) {
      qty = qty || 1;
      var price = Number(part.price) || 0;
      gtag("event", "add_to_cart", {
        currency: (window.SpectrCurrency && window.SpectrCurrency.config)
          ? window.SpectrCurrency.config.currency : "NOK",
        value: price * qty,
        items: [{ item_id: part.id || part.sku, item_name: part.name, price: price, quantity: qty, item_category: part.category }],
      });
      if (window.fbq) window.fbq("track", "AddToCart", { value: price * qty, currency: "NOK" });
    },
    /** Call at checkout start */
    beginCheckout: function (cartTotal) {
      gtag("event", "begin_checkout", { value: cartTotal, currency: "NOK" });
      if (window.fbq) window.fbq("track", "InitiateCheckout", { value: cartTotal, currency: "NOK" });
    },
    /** Call on purchase complete */
    purchase: function (orderId, total) {
      gtag("event", "purchase", { transaction_id: orderId, value: total, currency: "NOK" });
      if (window.fbq) window.fbq("track", "Purchase", { value: total, currency: "NOK" });
    },
    /** Call on search */
    search: function (term) {
      gtag("event", "search", { search_term: term });
    },
  };

  /* ── React to consent decisions ──────────────────────────────────────── */
  function onConsent(e) {
    var c = e.detail || {};
    if (c.analytics && isProd) {
      loadGA4();
      loadClarity();
    }
    if (c.marketing && isProd) {
      loadMetaPixel();
    }
  }

  window.addEventListener("spectr:consent", onConsent);

  /* ── Always load Vercel VA (cookieless, privacy-safe) ────────────────── */
  loadVercel();

  /* ── Re-apply on page load if consent already given ─────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      try {
        var saved = JSON.parse(localStorage.getItem("spectr_consent_v2") || "null");
        if (saved) onConsent({ detail: saved });
      } catch (e) {}
    });
  } else {
    try {
      var saved = JSON.parse(localStorage.getItem("spectr_consent_v2") || "null");
      if (saved) onConsent({ detail: saved });
    } catch (e) {}
  }
})();
