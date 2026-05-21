(function () {
  "use strict";

  var SESSION_KEY = "spectr_shop_customer_v1";

  function showMessage(text, type) {
    var node = document.getElementById("auth-message");
    if (!node) return;
    node.textContent = text;
    node.hidden = false;
    node.className = "auth-message " + (type === "error" ? "is-error" : "is-success");
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function readValue(id) {
    var node = document.getElementById(id);
    return node ? String(node.value || "").trim() : "";
  }

  function setSubmitting(form, submitting) {
    var button = form.querySelector("button[type='submit']");
    if (!button) return;
    if (!button.dataset.defaultText) button.dataset.defaultText = button.textContent;
    button.disabled = submitting;
    button.textContent = submitting ? button.dataset.submittingText || "Please wait..." : button.dataset.defaultText;
  }

  function nextUrl() {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next");
    if (!next || !next.startsWith("/") || next.startsWith("//")) return "index.html";
    return next;
  }

  function preserveNextOnAuthLinks() {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next");
    if (!next || !next.startsWith("/") || next.startsWith("//")) return;
    document.querySelectorAll("a[href='login.html'], a[href='create-account.html']").forEach(function (link) {
      var href = link.getAttribute("href");
      link.setAttribute("href", href + "?next=" + encodeURIComponent(next));
    });
  }

  function saveLocalCustomer(customer) {
    var payload = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: customer.role || "customer",
      accessToken: customer.accessToken || "",
      createdAt: customer.created_at || customer.createdAt || new Date().toISOString()
    };
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  }

  async function postAuth(path, details) {
    var res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details)
    });
    var data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    if (!res.ok) {
      throw new Error(data.error || "Authentication failed. Please try again.");
    }
    return data;
  }

  async function submitSignInForm(form, options) {
    var email = normalizeEmail(readValue(options.emailId));
    var password = readValue(options.passwordId);

    if (!email) {
      showMessage("Enter your email to continue.", "error");
      return;
    }
    if (!password) {
      showMessage("Enter your password to continue.", "error");
      return;
    }

    form.querySelector("button[type='submit']").dataset.submittingText = "Signing in...";
    setSubmitting(form, true);
    try {
      var data = await postAuth("/api/auth/sign-in", {
        email: email,
        password: password,
        page: window.location.pathname,
        referrer: document.referrer
      });
      saveLocalCustomer(data.user || { email: email });
      if (window.SpectrAuthNav && SpectrAuthNav.refresh) SpectrAuthNav.refresh();
      showMessage("Signed in. Redirecting to the store...", "success");
      setTimeout(function () {
        window.location.href = nextUrl();
      }, 650);
    } catch (err) {
      showMessage(err.message || "Could not sign in. Please try again.", "error");
      setSubmitting(form, false);
    }
  }

  async function submitCreateAccountForm(form) {
    var email = normalizeEmail(readValue("create-email"));
    var password = readValue("create-password");
    var passwordConfirm = readValue("create-password-confirm");

    if (!email) {
      showMessage("Enter your email to continue.", "error");
      return;
    }
    if (!password) {
      showMessage("Create a password to continue.", "error");
      return;
    }
    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.", "error");
      return;
    }
    if (password !== passwordConfirm) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    form.querySelector("button[type='submit']").dataset.submittingText = "Creating account...";
    setSubmitting(form, true);
    try {
      var data = await postAuth("/api/auth/create-account", {
        email: email,
        password: password,
        page: window.location.pathname,
        referrer: document.referrer
      });
      saveLocalCustomer(data.user || { email: email });
      if (window.SpectrAuthNav && SpectrAuthNav.refresh) SpectrAuthNav.refresh();
      showMessage("Account created. Redirecting to the store...", "success");
      setTimeout(function () {
        window.location.href = nextUrl();
      }, 650);
    } catch (err) {
      showMessage(err.message || "Could not create your account. Please try again.", "error");
      setSubmitting(form, false);
    }
  }

  function initSignIn() {
    var form = document.getElementById("signin-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitSignInForm(form, {
        emailId: "signin-email",
        passwordId: "signin-password"
      });
    });
  }

  function initCreateAccount() {
    var form = document.getElementById("create-account-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitCreateAccountForm(form);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-current-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
    preserveNextOnAuthLinks();
    initSignIn();
    initCreateAccount();
  });
})();
