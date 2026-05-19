(function () {
  "use strict";

  var yearEl = document.getElementById("login-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var messageEl = document.getElementById("login-message");
  var titleEl = document.getElementById("login-title");
  var subtitleEl = document.getElementById("login-subtitle");
  var tabsEl = document.querySelector(".login-tabs");
  var tabSignin = document.getElementById("tab-signin");
  var tabSignup = document.getElementById("tab-signup");
  var panelSignin = document.getElementById("panel-signin");
  var panelSignup = document.getElementById("panel-signup");
  var panelForgot = document.getElementById("panel-forgot");
  var signinForm = document.getElementById("signin-form");
  var signupForm = document.getElementById("signup-form");
  var forgotForm = document.getElementById("forgot-form");
  var rememberEl = document.getElementById("signin-remember");
  var forgotBtn = document.getElementById("forgot-password-btn");
  var forgotBack = document.getElementById("forgot-back");

  function redirectAfterAuth(sessionData) {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next") || "index.html";
    if (!/^[\w./?#=&%-]+$/.test(next) || next.indexOf("://") !== -1) next = "index.html";
    window.location.href = next;
  }

  function showMessage(text, type) {
    if (!messageEl) return;
    messageEl.textContent = text || "";
    messageEl.hidden = !text;
    messageEl.classList.remove("is-error", "is-success");
    if (type === "error") messageEl.classList.add("is-error");
    if (type === "success") messageEl.classList.add("is-success");
  }

  function setLoading(form, loading) {
    if (!form) return;
    form.querySelectorAll("button, input").forEach(function (el) {
      el.disabled = !!loading;
    });
    var submit = form.querySelector('[type="submit"]');
    if (submit && submit.dataset.label == null) submit.dataset.label = submit.textContent;
    if (submit && loading) submit.textContent = "Please wait…";
    else if (submit && submit.dataset.label) submit.textContent = submit.dataset.label;
  }

  async function apiPost(path, body) {
    var res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body || {}),
    });
    var raw = "";
    try {
      raw = await res.text();
    } catch {
      raw = "";
    }
    var data = {};
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = {};
      }
    }
    if (!res.ok) {
      var fallback = res.status === 404 ? "Service unavailable (API not found). Try again after deploy." : "Request failed";
      var msg =
        window.SpectrAuth && SpectrAuth.formatApiError
          ? SpectrAuth.formatApiError(data, fallback)
          : data.error || data.message || fallback;
      if ((!msg || msg === fallback) && raw && !raw.trim().startsWith("{")) {
        msg = raw.split("\n")[0].trim() || fallback;
      }
      if (typeof msg !== "string") msg = String(msg);
      var err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function setMode(mode) {
    var isSignin = mode === "signin";
    var isSignup = mode === "signup";
    var isForgot = mode === "forgot";

    if (tabsEl) tabsEl.hidden = isForgot;
    if (panelSignin) panelSignin.hidden = !isSignin;
    if (panelSignup) panelSignup.hidden = !isSignup;
    if (panelForgot) panelForgot.hidden = !isForgot;

    if (tabSignin) {
      tabSignin.classList.toggle("is-active", isSignin);
      tabSignin.setAttribute("aria-selected", isSignin ? "true" : "false");
    }
    if (tabSignup) {
      tabSignup.classList.toggle("is-active", isSignup);
      tabSignup.setAttribute("aria-selected", isSignup ? "true" : "false");
    }

    if (titleEl) {
      titleEl.textContent = isForgot
        ? "Reset password"
        : isSignup
          ? "Create your account"
          : "Sign in to Spectr";
    }
    if (subtitleEl) {
      subtitleEl.textContent = isForgot
        ? "We will email you a link to choose a new password"
        : isSignup
          ? "Username, email, and password are stored securely in Spectr"
          : "Operational intelligence for investment teams";
    }
    showMessage("");
  }

  if (tabSignin) tabSignin.addEventListener("click", function () {
    setMode("signin");
  });
  if (tabSignup) tabSignup.addEventListener("click", function () {
    setMode("signup");
  });
  if (forgotBtn) forgotBtn.addEventListener("click", function () {
    setMode("forgot");
  });
  if (forgotBack) forgotBack.addEventListener("click", function () {
    setMode("signin");
  });

  if (new URLSearchParams(window.location.search).get("signup") === "1") {
    setMode("signup");
  }

  (async function checkExistingSession() {
    var session = window.SpectrAuth && SpectrAuth.getSession();
    if (!session || !session.access_token) return;
    if (SpectrAuth.isExpired(session) && session.refresh_token) {
      try {
        var refreshed = await apiPost("/api/auth/refresh", { refresh_token: session.refresh_token });
        SpectrAuth.saveSession(refreshed, SpectrAuth.rememberEnabled());
        redirectAfterAuth(refreshed);
        return;
      } catch {
        SpectrAuth.clearSession();
        return;
      }
    }
    if (SpectrAuth.isExpired(session)) {
      SpectrAuth.clearSession();
      return;
    }
    try {
      var res = await fetch("/api/auth/me", { headers: SpectrAuth.authHeaders(session) });
      if (res.ok) {
        var me = await res.json();
        redirectAfterAuth({ user: me.user });
      }
    } catch {
      /* stay on login */
    }
  })();

  if (signinForm) {
    signinForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      showMessage("");
      setLoading(signinForm, true);
      try {
        var emailEl = document.getElementById("signin-email");
        var passwordEl = document.getElementById("signin-password");
        var email = String((emailEl && emailEl.value) || "").trim();
        var password = String((passwordEl && passwordEl.value) || "");
        if (!email) {
          showMessage("Email or username is required.", "error");
          return;
        }
        if (!password) {
          showMessage("Password is required.", "error");
          return;
        }
        var data = await apiPost("/api/auth/login", { email: email, password: password });
        SpectrAuth.saveSession(data, rememberEl && rememberEl.checked);
        if (window.SpectrAuthNav && SpectrAuthNav.refresh) SpectrAuthNav.refresh();
        redirectAfterAuth(data);
      } catch (err) {
        showMessage(err.message || "Sign in failed.", "error");
      } finally {
        setLoading(signinForm, false);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      showMessage("");
      var fd = new FormData(signupForm);
      var password = String(fd.get("password") || "");
      var confirm = String(fd.get("password_confirm") || "");
      if (password !== confirm) {
        showMessage("Passwords do not match.", "error");
        return;
      }
      setLoading(signupForm, true);
      try {
        var data = await apiPost("/api/auth/signup", {
          username: fd.get("username"),
          email: fd.get("email"),
          password: password,
        });
        if (data.access_token) {
          SpectrAuth.saveSession(data, true);
          redirectAfterAuth();
        } else {
          showMessage(data.message || "Account created. You can sign in now.", "success");
          setMode("signin");
        }
      } catch (err) {
        showMessage(err.message || "Could not create account.", "error");
      } finally {
        setLoading(signupForm, false);
      }
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      showMessage("");
      setLoading(forgotForm, true);
      try {
        var fd = new FormData(forgotForm);
        var data = await apiPost("/api/auth/forgot-password", {
          email: fd.get("email"),
          redirect_to: window.location.origin + window.location.pathname,
        });
        showMessage(data.message || "Check your email for a reset link.", "success");
      } catch (err) {
        showMessage(err.message || "Could not send reset email.", "error");
      } finally {
        setLoading(forgotForm, false);
      }
    });
  }

  var mesh = document.querySelector(".login-mesh");
  if (mesh && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var tx = 0;
    var ty = 0;
    window.addEventListener(
      "pointermove",
      function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;
        tx += (x * 12 - tx) * 0.06;
        ty += (y * 10 - ty) * 0.06;
        mesh.style.setProperty("--mx", tx.toFixed(2) + "%");
        mesh.style.setProperty("--my", ty.toFixed(2) + "%");
      },
      { passive: true }
    );
  }
})();
