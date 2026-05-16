(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function openLoginModal() {
    var modal = $("login-modal");
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var email = $("plt-login-email");
    if (email) email.focus();
  }

  function closeLoginModal() {
    var modal = $("login-modal");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function updateNavAuth() {
    var authed = window.SpectrAuth && SpectrAuth.isAuthenticated();
    var loginLink = $("nav-login");
    var platformLink = $("nav-platform");

    if (loginLink) loginLink.hidden = !!authed;
    if (platformLink) platformLink.hidden = !authed;

    if (document.body.classList.contains("page-landing")) {
      if (authed && window.location.hash === "#login") {
        window.location.replace("app.html");
        return;
      }
      if (!authed && window.location.hash === "#login") {
        openLoginModal();
      }
    }
  }

  function initLoginModal() {
    var loginLink = $("nav-login");
    if (loginLink) {
      loginLink.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.SpectrAuth && SpectrAuth.isAuthenticated()) {
          window.location.href = "app.html";
          return;
        }
        openLoginModal();
      });
    }

    document.querySelectorAll("[data-close-login]").forEach(function (el) {
      el.addEventListener("click", function () {
        closeLoginModal();
        if (window.location.hash === "#login") {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      });
    });

    var modal = $("login-modal");
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeLoginModal();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLoginModal();
    });

    var form = $("plt-login-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = ($("plt-login-email") && $("plt-login-email").value) || "";
        var password = ($("plt-login-password") && $("plt-login-password").value) || "";
        var remember = $("plt-login-remember") && $("plt-login-remember").checked;
        var errEl = $("plt-login-error");
        var submitBtn = $("plt-login-submit");
        if (errEl) errEl.hidden = true;
        if (submitBtn) submitBtn.disabled = true;

        SpectrAuth.login(email, password, remember)
          .then(function () {
            closeLoginModal();
            window.location.href = "app.html";
          })
          .catch(function (err) {
            if (errEl) {
              errEl.hidden = false;
              errEl.textContent = err.message || "Login failed";
            }
          })
          .finally(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
      });
    }
  }

  function init() {
    initLoginModal();

    var logout = $("nav-logout");
    if (logout) {
      logout.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.SpectrAuth) SpectrAuth.logout();
        window.location.href = "index.html";
      });
    }

    var footerLogin = $("footer-login");
    if (footerLogin) {
      footerLogin.addEventListener("click", function (e) {
        e.preventDefault();
        openLoginModal();
      });
    }

    if (window.SpectrAuth) {
      SpectrAuth.onChange(updateNavAuth);
      SpectrAuth.verifySession().then(updateNavAuth);
    } else {
      updateNavAuth();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
