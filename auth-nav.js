(function () {
  "use strict";

  var LOGIN_CLASS = "plt-header-login";
  var CUSTOMER_SESSION_KEY = "spectr_shop_customer_v1";
  var LANGUAGE_STORAGE_KEY = "spectr_language_v1";
  var PAGE_LANGUAGE = "en";
  var LANGUAGES = [
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "en-GB", name: "British English", flag: "🇬🇧", translateCode: "en" },
    { code: "no", name: "Norwegian", flag: "🇳🇴" },
    { code: "en-US", name: "American English", flag: "🇺🇸", translateCode: "en" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "zh-CN", name: "Mandarin", flag: "🇨🇳" },
  ];

  function initials(user) {
    var name = (user && user.name) || (user && user.email) || "?";
    var parts = String(name).split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return String(name).slice(0, 2).toUpperCase();
  }

  function loginHref() {
    var next = window.location.pathname + window.location.search;
    return "login.html?next=" + encodeURIComponent(next || "index.html");
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function readCustomerSession() {
    var raw = null;
    try {
      raw =
        localStorage.getItem(CUSTOMER_SESSION_KEY) ||
        sessionStorage.getItem(CUSTOMER_SESSION_KEY);
    } catch {
      return null;
    }
    if (!raw) return null;
    try {
      var data = JSON.parse(raw);
      if (!data || !data.email) return null;
      return {
        id: data.id || null,
        email: data.email,
        name: data.name || data.email,
        role: data.role || "customer",
      };
    } catch {
      return null;
    }
  }

  function clearCustomerSession() {
    try {
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
      sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
    } catch {
      /* ignore */
    }
  }

  function escapeAttribute(s) {
    return escapeHtml(s).replace(/>/g, "&gt;");
  }

  function findLanguage(code) {
    return LANGUAGES.find(function (language) {
      return language.code === code;
    }) || LANGUAGES[0];
  }

  function hasLanguage(code) {
    return LANGUAGES.some(function (language) {
      return language.code === code;
    });
  }

  function translateCode(language) {
    return (language && language.translateCode) || (language && language.code) || PAGE_LANGUAGE;
  }

  function flagCountryCode(flag) {
    var codePoints = Array.from(String(flag || ""));
    if (codePoints.length < 2) return "";
    var first = codePoints[0].codePointAt(0);
    var second = codePoints[1].codePointAt(0);
    var regionalIndicatorA = 0x1f1e6;
    if (
      first < regionalIndicatorA ||
      first > regionalIndicatorA + 25 ||
      second < regionalIndicatorA ||
      second > regionalIndicatorA + 25
    ) {
      return "";
    }
    return String.fromCharCode(97 + first - regionalIndicatorA, 97 + second - regionalIndicatorA);
  }

  function languageFlagMarkup(language, className) {
    var flag = language.flag;
    var countryCode = flagCountryCode(flag);
    if (countryCode) {
      return (
        '<span class="' +
        className +
        ' plt-language-flag--image" style="--plt-language-flag-url: url(&quot;https://flagcdn.com/w40/' +
        escapeAttribute(countryCode) +
        '.png&quot;)" aria-hidden="true"></span>'
      );
    }
    return '<span class="' + className + '" aria-hidden="true">' + escapeHtml(flag) + "</span>";
  }

  function readCookie(name) {
    var match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[2]) : "";
  }

  function rootCookieDomain() {
    var host = window.location.hostname;
    if (!host || host === "localhost" || /^[\d.]+$/.test(host)) return "";
    var parts = host.split(".");
    return parts.length > 2 ? "." + parts.slice(-2).join(".") : "." + host;
  }

  function writeCookie(name, value, days, domain) {
    var expires = "";
    if (typeof days === "number") {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + encodeURIComponent(value) + expires + "; path=/" + (domain ? "; domain=" + domain : "");
  }

  function clearCookie(name) {
    writeCookie(name, "", -1);
    var domain = rootCookieDomain();
    if (domain) writeCookie(name, "", -1, domain);
  }

  function setTranslateCookie(code) {
    clearCookie("googtrans");
    if (code === PAGE_LANGUAGE) return;
    var value = "/" + PAGE_LANGUAGE + "/" + code;
    writeCookie("googtrans", value, 365);
    var domain = rootCookieDomain();
    if (domain) writeCookie("googtrans", value, 365, domain);
  }

  function storedLanguage() {
    var translated = readCookie("googtrans").match(/\/[^/]+\/([^/]+)/);
    if (translated && translated[1] && hasLanguage(translated[1])) return translated[1];
    try {
      var saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return hasLanguage(saved) ? saved : LANGUAGES[0].code;
    } catch {
      return LANGUAGES[0].code;
    }
  }

  function saveLanguage(code) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }

  function loadGoogleTranslate() {
    if (document.getElementById("spectr-google-translate-script")) return;
    if (!document.getElementById("spectr-google-translate")) {
      var mount = document.createElement("div");
      mount.id = "spectr-google-translate";
      mount.setAttribute("aria-hidden", "true");
      document.body.appendChild(mount);
    }
    window.googleTranslateElementInit = function () {
      if (!window.google || !window.google.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: PAGE_LANGUAGE,
          autoDisplay: false,
        },
        "spectr-google-translate"
      );
    };
    var script = document.createElement("script");
    script.id = "spectr-google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }

  function applyLanguage(code) {
    var language = findLanguage(code);
    var targetCode = translateCode(language);
    saveLanguage(language.code);
    setTranslateCookie(targetCode);
    document.documentElement.lang = language.code;

    var combo = document.querySelector(".goog-te-combo");
    if (combo && targetCode !== PAGE_LANGUAGE) {
      combo.value = targetCode;
      combo.dispatchEvent(new Event("change"));
      return;
    }

    window.location.reload();
  }

  function renderLanguageOptions(currentCode) {
    return LANGUAGES.map(function (language) {
      return (
        '<button type="button" class="plt-language-option' +
        (language.code === currentCode ? " is-selected" : "") +
        '" role="option" aria-selected="' +
        (language.code === currentCode ? "true" : "false") +
        '" aria-label="' +
        escapeAttribute(language.name) +
        '" title="' +
        escapeAttribute(language.name) +
        '" data-language-code="' +
        escapeAttribute(language.code) +
        '">' +
        languageFlagMarkup(language, "plt-language-option-flag") +
        "</button>"
      );
    }).join("");
  }

  function updateLanguageFlag(slot, code) {
    var language = findLanguage(code);
    var flag = slot.querySelector(".plt-language-flag");
    var trigger = slot.querySelector(".plt-language-trigger");
    if (flag) flag.outerHTML = languageFlagMarkup(language, "plt-language-flag");
    if (trigger) {
      trigger.title = language.name;
      trigger.setAttribute("aria-label", "Website language: " + language.name);
    }
    slot.querySelectorAll(".plt-language-option").forEach(function (option) {
      var selected = option.getAttribute("data-language-code") === language.code;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-selected", selected ? "true" : "false");
    });
  }

  function closeLanguageMenus(except) {
    document.querySelectorAll(".plt-language.is-open").forEach(function (slot) {
      if (except && slot === except) return;
      slot.classList.remove("is-open");
      var trigger = slot.querySelector(".plt-language-trigger");
      var menu = slot.querySelector(".plt-language-menu");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (menu) menu.hidden = true;
    });
  }

  function openLanguageMenu(slot) {
    closeLanguageMenus(slot);
    slot.classList.add("is-open");
    var trigger = slot.querySelector(".plt-language-trigger");
    var menu = slot.querySelector(".plt-language-menu");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    if (menu) menu.hidden = false;
  }

  function createLanguageSlot() {
    var currentCode = findLanguage(storedLanguage()).code;
    var currentLanguage = findLanguage(currentCode);
    var slot = document.createElement("div");
    slot.className = "plt-language";
    slot.setAttribute("data-spectr-language", "");
    slot.innerHTML =
      '<button type="button" class="plt-language-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Website language: ' +
      escapeAttribute(currentLanguage.name) +
      '" title="' +
      escapeAttribute(currentLanguage.name) +
      '">' +
      languageFlagMarkup(currentLanguage, "plt-language-flag") +
      "</button>" +
      '<div class="plt-language-menu" role="listbox" aria-label="Choose website language" hidden>' +
      renderLanguageOptions(currentCode) +
      "</div>";

    slot.querySelector(".plt-language-trigger").addEventListener("click", function (event) {
      event.stopPropagation();
      if (slot.classList.contains("is-open")) closeLanguageMenus();
      else openLanguageMenu(slot);
    });

    slot.querySelector(".plt-language-trigger").addEventListener("keydown", function (event) {
      if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLanguageMenu(slot);
      var selected = slot.querySelector(".plt-language-option.is-selected") || slot.querySelector(".plt-language-option");
      if (selected) selected.focus();
    });

    slot.querySelector(".plt-language-menu").addEventListener("click", function (event) {
      var option = event.target.closest(".plt-language-option");
      if (!option) return;
      event.stopPropagation();
      var nextCode = findLanguage(option.getAttribute("data-language-code")).code;
      closeLanguageMenus();
      updateLanguageFlag(slot, nextCode);
      applyLanguage(nextCode);
    });

    slot.querySelector(".plt-language-menu").addEventListener("keydown", function (event) {
      var options = Array.prototype.slice.call(slot.querySelectorAll(".plt-language-option"));
      var currentIndex = options.indexOf(document.activeElement);
      if (event.key === "Escape") {
        event.preventDefault();
        closeLanguageMenus();
        slot.querySelector(".plt-language-trigger").focus();
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        options[(currentIndex + 1 + options.length) % options.length].focus();
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        options[(currentIndex - 1 + options.length) % options.length].focus();
      }
    });

    return slot;
  }

  function initLanguageControls() {
    document.querySelectorAll(".plt-header-tools").forEach(function (tools) {
      if (tools.querySelector("[data-spectr-language]")) return;
      var slot = createLanguageSlot();
      var search = tools.querySelector(".plt-header-search");
      var authSlot = tools.querySelector("[data-spectr-auth-slot]");
      if (search && search.nextSibling) tools.insertBefore(slot, search.nextSibling);
      else if (authSlot) tools.insertBefore(slot, authSlot);
      else tools.appendChild(slot);
    });
    loadGoogleTranslate();
  }

  function renderLogin(slot) {
    var a = document.createElement("a");
    a.href = loginHref();
    a.textContent = "Sign in";
    a.className = LOGIN_CLASS;
    slot.replaceChildren(a);
  }

  function renderMenu(slot, user) {
    var label = user.name || user.email || "Account";
    var wrap = document.createElement("div");
    wrap.className = "spectr-user-menu";
    wrap.innerHTML =
      '<button type="button" class="spectr-user-menu-btn" aria-haspopup="true" aria-expanded="false" aria-label="Account menu">' +
      '<span class="spectr-user-avatar" aria-hidden="true">' +
      escapeHtml(initials(user)) +
      "</span></button>" +
      '<div class="spectr-user-dropdown" role="menu" hidden>' +
      '<p class="spectr-user-dropdown-label">' +
      escapeHtml(label) +
      "</p>" +
      '<a href="supply.html" role="menuitem">Supply management</a>' +
      '<button type="button" role="menuitem" data-spectr-logout>Log out</button>' +
      "</div>";

    var menu = wrap;
    var btn = wrap.querySelector(".spectr-user-menu-btn");
    var panel = wrap.querySelector(".spectr-user-dropdown");

    function close() {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    }

    function open() {
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.classList.contains("is-open")) close();
      else {
        document.querySelectorAll(".spectr-user-menu.is-open").forEach(function (m) {
          if (m !== menu) {
            m.classList.remove("is-open");
            var b = m.querySelector(".spectr-user-menu-btn");
            var p = m.querySelector(".spectr-user-dropdown");
            if (b) b.setAttribute("aria-expanded", "false");
            if (p) p.hidden = true;
          }
        });
        open();
      }
    });

    wrap.querySelector("[data-spectr-logout]").addEventListener("click", function () {
      clearCustomerSession();
      close();
      renderAllSlots(null);
    });

    slot.replaceChildren(wrap);
  }

  function renderAllSlots(user) {
    document.querySelectorAll("[data-spectr-auth-slot]").forEach(function (slot) {
      if (user) renderMenu(slot, user);
      else renderLogin(slot);
    });
  }

  function init() {
    var slots = document.querySelectorAll("[data-spectr-auth-slot]");
    initLanguageControls();
    if (slots.length) renderAllSlots(readCustomerSession());
  }

  document.addEventListener("click", function () {
    closeLanguageMenus();
    document.querySelectorAll(".spectr-user-menu.is-open").forEach(function (menu) {
      menu.classList.remove("is-open");
      var btn = menu.querySelector(".spectr-user-menu-btn");
      var panel = menu.querySelector(".spectr-user-dropdown");
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeLanguageMenus();
    document.querySelectorAll(".spectr-user-menu.is-open").forEach(function (menu) {
      menu.classList.remove("is-open");
      var btn = menu.querySelector(".spectr-user-menu-btn");
      var panel = menu.querySelector(".spectr-user-dropdown");
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SpectrAuthNav = {
    refresh: function () {
      renderAllSlots(readCustomerSession());
    },
  };
})();
