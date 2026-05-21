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
    button.textContent = submitting ? "Signing in..." : button.dataset.defaultText;
  }

  function nextUrl() {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next");
    if (!next || !next.startsWith("/") || next.startsWith("//")) return "index.html";
    return next;
  }

  function saveLocalCustomer(customer, remember) {
    var payload = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      createdAt: customer.created_at || new Date().toISOString()
    };
    var storage = remember ? localStorage : sessionStorage;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    storage.setItem(SESSION_KEY, JSON.stringify(payload));
  }

  async function saveCustomerSignin(details) {
    var res = await fetch("/api/auth/customer-signin", {
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
      throw new Error(data.error || "Could not save your details. Please try again.");
    }
    return data;
  }

  async function submitCustomerForm(form, options) {
    var name = readValue(options.nameId);
    var email = normalizeEmail(readValue(options.emailId));
    var phone = readValue(options.phoneId);
    var rememberNode = document.getElementById(options.rememberId || "");
    var remember = rememberNode ? rememberNode.checked : true;

    if (!name) {
      showMessage("Enter your name to continue.", "error");
      return;
    }
    if (!email) {
      showMessage("Enter your email to continue.", "error");
      return;
    }

    setSubmitting(form, true);
    try {
      var data = await saveCustomerSignin({
        name: name,
        email: email,
        phone: phone,
        remember: remember,
        source: options.source,
        page: window.location.pathname,
        referrer: document.referrer
      });
      saveLocalCustomer(data.user || { name: name, email: email }, remember);
      if (window.SpectrAuthNav && SpectrAuthNav.refresh) SpectrAuthNav.refresh();
      showMessage("Signed in. Redirecting to the store...", "success");
      setTimeout(function () {
        window.location.href = nextUrl();
      }, 650);
    } catch (err) {
      showMessage(err.message || "Could not save your details. Please try again.", "error");
      setSubmitting(form, false);
    }
  }

  function initSignIn() {
    var form = document.getElementById("signin-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitCustomerForm(form, {
        nameId: "signin-name",
        emailId: "signin-email",
        phoneId: "signin-phone",
        rememberId: "signin-remember",
        source: "login_page"
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-current-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
    initSignIn();
  });
})();
