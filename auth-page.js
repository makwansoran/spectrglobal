(function () {
  "use strict";

  var ACCOUNTS_KEY = "spectr_shop_accounts_v1";
  var SESSION_KEY = "spectr_shop_session_v1";

  function readAccounts() {
    try {
      return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function writeAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts || []));
  }

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

  function createSession(account) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      email: account.email,
      name: account.name,
      createdAt: new Date().toISOString()
    }));
  }

  function initSignIn() {
    var form = document.getElementById("signin-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = normalizeEmail(document.getElementById("signin-email").value);
      var password = document.getElementById("signin-password").value;
      var accounts = readAccounts();
      var account = accounts.find(function (entry) {
        return entry.email === email && entry.password === password;
      });
      if (!account) {
        showMessage("We could not find an account with those details.", "error");
        return;
      }
      createSession(account);
      showMessage("Signed in. Redirecting to the store...", "success");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 700);
    });
  }

  function initCreateAccount() {
    var form = document.getElementById("create-account-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = document.getElementById("account-name").value.trim();
      var email = normalizeEmail(document.getElementById("account-email").value);
      var password = document.getElementById("account-password").value;
      var confirm = document.getElementById("account-password-confirm").value;
      if (password.length < 8) {
        showMessage("Password must be at least 8 characters.", "error");
        return;
      }
      if (password !== confirm) {
        showMessage("Passwords do not match.", "error");
        return;
      }
      var accounts = readAccounts();
      if (accounts.some(function (entry) { return entry.email === email; })) {
        showMessage("An account with that email already exists.", "error");
        return;
      }
      var account = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
      };
      accounts.push(account);
      writeAccounts(accounts);
      createSession(account);
      showMessage("Account created. Redirecting to the store...", "success");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 700);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-current-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
    initSignIn();
    initCreateAccount();
  });
})();
