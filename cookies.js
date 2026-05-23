/**
 * cookies.js — Spectr GDPR-compliant Consent Manager
 *
 * Categories:
 *   necessary  — always active (session, cart, auth)
 *   analytics  — Google Analytics 4, Vercel Insights
 *   marketing  — Meta Pixel, Google Ads, retargeting
 *
 * Fires window CustomEvent "spectr:consent" with { detail: { analytics, marketing } }
 * whenever consent changes. All tracking scripts listen to this event.
 */
(function () {
  "use strict";

  var STORAGE_KEY     = "spectr_consent_v2";
  var CONSENT_VERSION = "2";

  /* ── Consent state ───────────────────────────────────────────────────── */

  function defaultConsent() {
    return { version: CONSENT_VERSION, analytics: false, marketing: false };
  }

  function loadConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || obj.version !== CONSENT_VERSION) return null;
      return obj;
    } catch (e) { return null; }
  }

  function saveConsent(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function hasDecided() {
    return loadConsent() !== null;
  }

  /* ── Dispatch event so analytics-static.js can react ────────────────── */

  function dispatchConsent(consent) {
    window.dispatchEvent(new CustomEvent("spectr:consent", { detail: consent }));
    /* Google Consent Mode v2 */
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage:   consent.analytics  ? "granted" : "denied",
        ad_storage:          consent.marketing  ? "granted" : "denied",
        ad_user_data:        consent.marketing  ? "granted" : "denied",
        ad_personalization:  consent.marketing  ? "granted" : "denied",
      });
    }
  }

  /* ── Apply saved consent on page load ───────────────────────────────── */

  function applyStoredConsent() {
    var consent = loadConsent();
    if (consent) dispatchConsent(consent);
  }

  /* ── Banner & modal DOM ──────────────────────────────────────────────── */

  var banner;
  var modal;

  function dismiss() {
    if (banner) {
      banner.classList.add("cookie-banner--out");
      window.setTimeout(function () {
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
        banner = null;
      }, 260);
    }
    document.body.classList.remove("has-cookie-banner");
  }

  function accept(analytics, marketing) {
    var consent = { version: CONSENT_VERSION, analytics: !!analytics, marketing: !!marketing };
    saveConsent(consent);
    dispatchConsent(consent);
    closeModal();
    dismiss();
  }

  /* ── Preferences modal ───────────────────────────────────────────────── */

  function openModal() {
    if (modal) { modal.removeAttribute("hidden"); modal.focus(); return; }

    modal = document.createElement("div");
    modal.className = "cookie-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Cookie preferences");
    modal.setAttribute("tabindex", "-1");

    var current = loadConsent() || defaultConsent();

    modal.innerHTML =
      '<div class="cookie-modal-box">' +
        '<button type="button" class="cookie-modal-close" id="cookie-modal-close" aria-label="Close">&#x2715;</button>' +
        '<h2 class="cookie-modal-title">Cookie preferences</h2>' +
        '<p class="cookie-modal-intro">We use cookies to keep the site secure, understand how it is used, and show you relevant products and offers. Choose which categories you accept below.</p>' +

        '<div class="cookie-pref-row">' +
          '<div class="cookie-pref-info">' +
            '<strong>Necessary</strong>' +
            '<span>Shopping cart, authentication, security, language preference. Always active.</span>' +
          '</div>' +
          '<span class="cookie-pref-always">Always on</span>' +
        '</div>' +

        '<div class="cookie-pref-row">' +
          '<div class="cookie-pref-info">' +
            '<strong>Analytics</strong>' +
            '<span>Google Analytics 4, Vercel Web Analytics. Help us understand traffic and improve the experience. No personal data is sold.</span>' +
          '</div>' +
          '<label class="cookie-toggle" aria-label="Analytics cookies">' +
            '<input type="checkbox" id="pref-analytics"' + (current.analytics ? ' checked' : '') + '>' +
            '<span class="cookie-toggle-track"></span>' +
          '</label>' +
        '</div>' +

        '<div class="cookie-pref-row">' +
          '<div class="cookie-pref-info">' +
            '<strong>Marketing</strong>' +
            '<span>Meta Pixel, Google Ads. Used to show you relevant ads on other platforms and measure campaign performance.</span>' +
          '</div>' +
          '<label class="cookie-toggle" aria-label="Marketing cookies">' +
            '<input type="checkbox" id="pref-marketing"' + (current.marketing ? ' checked' : '') + '>' +
            '<span class="cookie-toggle-track"></span>' +
          '</label>' +
        '</div>' +

        '<div class="cookie-modal-actions">' +
          '<button type="button" class="cookie-banner-btn cookie-banner-btn--ghost" id="pref-reject">Reject non-essential</button>' +
          '<button type="button" class="cookie-banner-btn cookie-banner-btn--accept" id="pref-save">Save preferences</button>' +
        '</div>' +
      '</div>' +
      '<div class="cookie-modal-backdrop" id="cookie-modal-backdrop"></div>';

    document.body.appendChild(modal);
    modal.focus();

    document.getElementById("cookie-modal-close").addEventListener("click", closeModal);
    document.getElementById("cookie-modal-backdrop").addEventListener("click", closeModal);
    document.getElementById("pref-reject").addEventListener("click", function () { accept(false, false); });
    document.getElementById("pref-save").addEventListener("click", function () {
      var a = document.getElementById("pref-analytics");
      var m = document.getElementById("pref-marketing");
      accept(a && a.checked, m && m.checked);
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("hidden", "");
    if (modal.parentNode) modal.parentNode.removeChild(modal);
    modal = null;
  }

  /* ── Build banner ────────────────────────────────────────────────────── */

  function buildBanner() {
    banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent");

    banner.innerHTML =
      '<div class="cookie-banner-body">' +
        '<p class="cookie-banner-text">' +
          'We use cookies to improve your experience, analyse traffic, and show relevant products. ' +
          'Read our <a href="privacy-policy.html">Privacy Policy</a>.' +
        '</p>' +
        '<div class="cookie-banner-actions">' +
          '<button type="button" class="cookie-banner-btn cookie-banner-btn--ghost" id="cookie-manage">Manage</button>' +
          '<button type="button" class="cookie-banner-btn cookie-banner-btn--secondary" id="cookie-reject">Reject non-essential</button>' +
          '<button type="button" class="cookie-banner-btn cookie-banner-btn--accept" id="cookie-accept-all">Accept all</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);
    document.body.classList.add("has-cookie-banner");

    document.getElementById("cookie-accept-all").addEventListener("click", function () { accept(true, true); });
    document.getElementById("cookie-reject").addEventListener("click", function () { accept(false, false); });
    document.getElementById("cookie-manage").addEventListener("click", openModal);

    document.getElementById("cookie-accept-all").focus();
  }

  /* ── Init ────────────────────────────────────────────────────────────── */

  function init() {
    applyStoredConsent();
    if (!hasDecided()) buildBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ── Expose for manual re-opening (e.g. footer "Cookie settings" link) ─ */
  window.SpectrConsent = {
    open: openModal,
    get: loadConsent,
    reset: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      buildBanner();
    },
  };
})();
