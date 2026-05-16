(function () {
  "use strict";

  var STORAGE_KEY = "spectr_cookie_consent";
  var CONSENT_VERSION = "1";

  function hasConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY) === CONSENT_VERSION;
    } catch (e) {
      return false;
    }
  }

  function saveConsent() {
    try {
      localStorage.setItem(STORAGE_KEY, CONSENT_VERSION);
    } catch (e) {}
  }

  function dismiss(banner) {
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove("has-cookie-banner");
    window.setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 300);
  }

  function buildBanner() {
    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent");

    var text = document.createElement("p");
    text.className = "cookie-banner-text";
    text.innerHTML =
      'We use cookies and similar technologies to operate and secure this site. By clicking “Accept all cookies”, you agree to our use of cookies as described in our <a href="privacy.html#cookies">Privacy Policy</a>.';

    var actions = document.createElement("div");
    actions.className = "cookie-banner-actions";

    var settings = document.createElement("a");
    settings.className = "cookie-banner-btn cookie-banner-btn--ghost";
    settings.href = "privacy.html#cookies";
    settings.textContent = "Cookie settings";

    var accept = document.createElement("button");
    accept.type = "button";
    accept.className = "cookie-banner-btn cookie-banner-btn--accept";
    accept.id = "cookie-banner-accept";
    accept.textContent = "Accept all cookies";

    accept.addEventListener("click", function () {
      saveConsent();
      dismiss(banner);
    });

    actions.appendChild(settings);
    actions.appendChild(accept);
    banner.appendChild(text);
    banner.appendChild(actions);
    return banner;
  }

  function init() {
    if (hasConsent()) return;

    var banner = buildBanner();
    document.body.appendChild(banner);
    document.body.classList.add("has-cookie-banner");
    acceptFocus(banner);
  }

  function acceptFocus(banner) {
    var btn = banner.querySelector("#cookie-banner-accept");
    if (btn) btn.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
