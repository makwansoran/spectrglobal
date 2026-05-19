(function () {
  "use strict";

  var LOGIN_CLASS = "plt-header-login";
  var NAV_CTA_CLASS = "plt-cta-get-started";

  function initials(user) {
    var name = (user && user.username) || (user && user.email) || "?";
    var parts = String(name).replace(/^@/, "").split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
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

  function renderLogin(slot) {
    var isNav = slot.getAttribute("data-spectr-auth-variant") === "nav";
    var a = document.createElement("a");
    a.href = loginHref();
    a.textContent = "Login";
    a.className = isNav ? NAV_CTA_CLASS : LOGIN_CLASS;
    slot.replaceChildren(a);
  }

  function editorMenuItems(user) {
    if (user.role !== "editor") return "";
    return '<a href="admin-company.html" role="menuitem" class="spectr-user-dropdown-editor">Add / edit company</a>';
  }

  function renderMenu(slot, user) {
    var label = user.username ? "@" + user.username : user.email || "Account";
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
      editorMenuItems(user) +
      '<a href="settings.html" role="menuitem">Settings</a>' +
      '<a href="watchlist.html" role="menuitem">Watchlist</a>' +
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
      if (window.SpectrAuth) SpectrAuth.clearSession();
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

  async function resolveUser() {
    if (!window.SpectrAuth) return null;
    var session = SpectrAuth.getSession();
    if (!session || !session.access_token) return null;

    if (SpectrAuth.isExpired(session) && session.refresh_token) {
      try {
        var res = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        });
        var data = {};
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        if (res.ok && data.access_token) {
          SpectrAuth.saveSession(data, SpectrAuth.rememberEnabled());
          session = SpectrAuth.getSession();
        } else {
          SpectrAuth.clearSession();
          return null;
        }
      } catch {
        SpectrAuth.clearSession();
        return null;
      }
    }

    if (SpectrAuth.isExpired(session)) {
      SpectrAuth.clearSession();
      return null;
    }

    if (session.user && session.user.username) return session.user;

    try {
      var meRes = await fetch("/api/auth/me", { headers: SpectrAuth.authHeaders(session) });
      var me = {};
      try {
        me = await meRes.json();
      } catch {
        me = {};
      }
      if (meRes.ok && me.user) {
        session.user = me.user;
        SpectrAuth.saveSession(session, SpectrAuth.rememberEnabled());
        return me.user;
      }
    } catch {
      /* optional */
    }

    return session.user || null;
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
    if (e.key === "Escape") {
      document.querySelectorAll(".spectr-user-menu.is-open").forEach(function (menu) {
        menu.classList.remove("is-open");
        var btn = menu.querySelector(".spectr-user-menu-btn");
        var panel = menu.querySelector(".spectr-user-dropdown");
        if (btn) btn.setAttribute("aria-expanded", "false");
        if (panel) panel.hidden = true;
      });
    }
  });

  function init() {
    var slots = document.querySelectorAll("[data-spectr-auth-slot]");
    if (!slots.length) return;

    renderAllSlots(null);

    resolveUser().then(function (user) {
      renderAllSlots(user);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SpectrAuthNav = { refresh: function () { resolveUser().then(renderAllSlots); } };
})();
