(function () {
  "use strict";

  var LOGIN_CLASS = "plt-header-login";
  var CUSTOMER_SESSION_KEY = "spectr_shop_customer_v1";

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
        role: "customer",
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
    if (!slots.length) return;
    renderAllSlots(readCustomerSession());
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
