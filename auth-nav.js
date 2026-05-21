(function () {
  "use strict";

  var LOGIN_CLASS = "plt-header-login";
  var CUSTOMER_SESSION_KEY = "spectr_shop_customer_v1";
  var LANGUAGE_STORAGE_KEY = "spectr_language_v1";
  var PAGE_LANGUAGE = "en";
  var LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "af", name: "Afrikaans", flag: "🇿🇦" },
    { code: "sq", name: "Albanian", flag: "🇦🇱" },
    { code: "am", name: "Amharic", flag: "🇪🇹" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "hy", name: "Armenian", flag: "🇦🇲" },
    { code: "as", name: "Assamese", flag: "🇮🇳" },
    { code: "ay", name: "Aymara", flag: "🇧🇴" },
    { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
    { code: "bm", name: "Bambara", flag: "🇲🇱" },
    { code: "eu", name: "Basque", flag: "🇪🇸" },
    { code: "be", name: "Belarusian", flag: "🇧🇾" },
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
    { code: "bho", name: "Bhojpuri", flag: "🇮🇳" },
    { code: "bs", name: "Bosnian", flag: "🇧🇦" },
    { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
    { code: "ca", name: "Catalan", flag: "🇪🇸" },
    { code: "ceb", name: "Cebuano", flag: "🇵🇭" },
    { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
    { code: "zh-TW", name: "Chinese (Traditional)", flag: "🇹🇼" },
    { code: "co", name: "Corsican", flag: "🇫🇷" },
    { code: "hr", name: "Croatian", flag: "🇭🇷" },
    { code: "cs", name: "Czech", flag: "🇨🇿" },
    { code: "da", name: "Danish", flag: "🇩🇰" },
    { code: "dv", name: "Dhivehi", flag: "🇲🇻" },
    { code: "doi", name: "Dogri", flag: "🇮🇳" },
    { code: "nl", name: "Dutch", flag: "🇳🇱" },
    { code: "eo", name: "Esperanto", flag: "🌐" },
    { code: "et", name: "Estonian", flag: "🇪🇪" },
    { code: "ee", name: "Ewe", flag: "🇬🇭" },
    { code: "fil", name: "Filipino", flag: "🇵🇭" },
    { code: "fi", name: "Finnish", flag: "🇫🇮" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "fy", name: "Frisian", flag: "🇳🇱" },
    { code: "gl", name: "Galician", flag: "🇪🇸" },
    { code: "ka", name: "Georgian", flag: "🇬🇪" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "el", name: "Greek", flag: "🇬🇷" },
    { code: "gn", name: "Guarani", flag: "🇵🇾" },
    { code: "gu", name: "Gujarati", flag: "🇮🇳" },
    { code: "ht", name: "Haitian Creole", flag: "🇭🇹" },
    { code: "ha", name: "Hausa", flag: "🇳🇬" },
    { code: "haw", name: "Hawaiian", flag: "🇺🇸" },
    { code: "iw", name: "Hebrew", flag: "🇮🇱" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "hmn", name: "Hmong", flag: "🌐" },
    { code: "hu", name: "Hungarian", flag: "🇭🇺" },
    { code: "is", name: "Icelandic", flag: "🇮🇸" },
    { code: "ig", name: "Igbo", flag: "🇳🇬" },
    { code: "ilo", name: "Ilocano", flag: "🇵🇭" },
    { code: "id", name: "Indonesian", flag: "🇮🇩" },
    { code: "ga", name: "Irish", flag: "🇮🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "jw", name: "Javanese", flag: "🇮🇩" },
    { code: "kn", name: "Kannada", flag: "🇮🇳" },
    { code: "kk", name: "Kazakh", flag: "🇰🇿" },
    { code: "km", name: "Khmer", flag: "🇰🇭" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
    { code: "gom", name: "Konkani", flag: "🇮🇳" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "kri", name: "Krio", flag: "🇸🇱" },
    { code: "ku", name: "Kurdish", flag: "🌐" },
    { code: "ckb", name: "Kurdish (Sorani)", flag: "🌐" },
    { code: "ky", name: "Kyrgyz", flag: "🇰🇬" },
    { code: "lo", name: "Lao", flag: "🇱🇦" },
    { code: "la", name: "Latin", flag: "🇻🇦" },
    { code: "lv", name: "Latvian", flag: "🇱🇻" },
    { code: "ln", name: "Lingala", flag: "🇨🇩" },
    { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
    { code: "lg", name: "Luganda", flag: "🇺🇬" },
    { code: "lb", name: "Luxembourgish", flag: "🇱🇺" },
    { code: "mk", name: "Macedonian", flag: "🇲🇰" },
    { code: "mai", name: "Maithili", flag: "🇮🇳" },
    { code: "mg", name: "Malagasy", flag: "🇲🇬" },
    { code: "ms", name: "Malay", flag: "🇲🇾" },
    { code: "ml", name: "Malayalam", flag: "🇮🇳" },
    { code: "mt", name: "Maltese", flag: "🇲🇹" },
    { code: "mi", name: "Maori", flag: "🇳🇿" },
    { code: "mr", name: "Marathi", flag: "🇮🇳" },
    { code: "mni-Mtei", name: "Meiteilon", flag: "🇮🇳" },
    { code: "lus", name: "Mizo", flag: "🇮🇳" },
    { code: "mn", name: "Mongolian", flag: "🇲🇳" },
    { code: "my", name: "Myanmar", flag: "🇲🇲" },
    { code: "ne", name: "Nepali", flag: "🇳🇵" },
    { code: "no", name: "Norwegian", flag: "🇳🇴" },
    { code: "ny", name: "Nyanja", flag: "🇲🇼" },
    { code: "or", name: "Odia", flag: "🇮🇳" },
    { code: "om", name: "Oromo", flag: "🇪🇹" },
    { code: "ps", name: "Pashto", flag: "🇦🇫" },
    { code: "fa", name: "Persian", flag: "🇮🇷" },
    { code: "pl", name: "Polish", flag: "🇵🇱" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "pa", name: "Punjabi", flag: "🇮🇳" },
    { code: "qu", name: "Quechua", flag: "🇵🇪" },
    { code: "ro", name: "Romanian", flag: "🇷🇴" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "sm", name: "Samoan", flag: "🇼🇸" },
    { code: "sa", name: "Sanskrit", flag: "🇮🇳" },
    { code: "gd", name: "Scots Gaelic", flag: "🏴" },
    { code: "nso", name: "Sepedi", flag: "🇿🇦" },
    { code: "sr", name: "Serbian", flag: "🇷🇸" },
    { code: "st", name: "Sesotho", flag: "🇱🇸" },
    { code: "sn", name: "Shona", flag: "🇿🇼" },
    { code: "sd", name: "Sindhi", flag: "🇵🇰" },
    { code: "si", name: "Sinhala", flag: "🇱🇰" },
    { code: "sk", name: "Slovak", flag: "🇸🇰" },
    { code: "sl", name: "Slovenian", flag: "🇸🇮" },
    { code: "so", name: "Somali", flag: "🇸🇴" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "su", name: "Sundanese", flag: "🇮🇩" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },
    { code: "sv", name: "Swedish", flag: "🇸🇪" },
    { code: "tg", name: "Tajik", flag: "🇹🇯" },
    { code: "ta", name: "Tamil", flag: "🇮🇳" },
    { code: "tt", name: "Tatar", flag: "🇷🇺" },
    { code: "te", name: "Telugu", flag: "🇮🇳" },
    { code: "th", name: "Thai", flag: "🇹🇭" },
    { code: "ti", name: "Tigrinya", flag: "🇪🇷" },
    { code: "ts", name: "Tsonga", flag: "🇿🇦" },
    { code: "tr", name: "Turkish", flag: "🇹🇷" },
    { code: "tk", name: "Turkmen", flag: "🇹🇲" },
    { code: "ak", name: "Twi", flag: "🇬🇭" },
    { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
    { code: "ur", name: "Urdu", flag: "🇵🇰" },
    { code: "ug", name: "Uyghur", flag: "🌐" },
    { code: "uz", name: "Uzbek", flag: "🇺🇿" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { code: "cy", name: "Welsh", flag: "🏴" },
    { code: "xh", name: "Xhosa", flag: "🇿🇦" },
    { code: "yi", name: "Yiddish", flag: "🌐" },
    { code: "yo", name: "Yoruba", flag: "🇳🇬" },
    { code: "zu", name: "Zulu", flag: "🇿🇦" },
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
    if (translated && translated[1]) return translated[1];
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) || PAGE_LANGUAGE;
    } catch {
      return PAGE_LANGUAGE;
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
    saveLanguage(code);
    setTranslateCookie(code);
    document.documentElement.lang = code === "iw" ? "he" : code;

    var combo = document.querySelector(".goog-te-combo");
    if (combo && code !== PAGE_LANGUAGE) {
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
      return;
    }

    window.location.reload();
  }

  function renderLanguageOptions(currentCode) {
    return LANGUAGES.map(function (language) {
      return (
        '<option value="' +
        escapeAttribute(language.code) +
        '"' +
        (language.code === currentCode ? " selected" : "") +
        ">" +
        escapeHtml(language.flag + " " + language.name) +
        "</option>"
      );
    }).join("");
  }

  function updateLanguageFlag(slot, code) {
    var language = findLanguage(code);
    var flag = slot.querySelector(".plt-language-flag");
    var select = slot.querySelector(".plt-language-select");
    if (flag) flag.textContent = language.flag;
    if (select) {
      select.value = language.code;
      select.title = "Website language: " + language.name;
    }
  }

  function createLanguageSlot() {
    var currentCode = findLanguage(storedLanguage()).code;
    var slot = document.createElement("div");
    slot.className = "plt-language";
    slot.setAttribute("data-spectr-language", "");
    slot.innerHTML =
      '<label class="plt-language-label">' +
      '<span class="plt-language-flag" aria-hidden="true">' +
      escapeHtml(findLanguage(currentCode).flag) +
      "</span>" +
      '<select class="plt-language-select" aria-label="Select website language">' +
      renderLanguageOptions(currentCode) +
      "</select>" +
      "</label>";

    slot.querySelector(".plt-language-select").addEventListener("change", function (event) {
      var nextCode = findLanguage(event.target.value).code;
      updateLanguageFlag(slot, nextCode);
      applyLanguage(nextCode);
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
