(function () {
  "use strict";

  if (!window.SpectrShop) return;

  var Shop = window.SpectrShop;
  var SESSION_KEY = "spectr_shop_customer_v1";
  var state = {
    parts: [],
    cart: [],
    total: 0,
    customer: null,
    submitting: false,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readCustomerSession() {
    var raw = "";
    try {
      raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || "";
    } catch (e) {
      return null;
    }
    if (!raw) return null;
    try {
      var data = JSON.parse(raw);
      if (!data || !data.email) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function loginHref() {
    return "login.html?next=" + encodeURIComponent("/checkout.html");
  }

  function createAccountHref() {
    return "create-account.html?next=" + encodeURIComponent("/checkout.html");
  }

  function showMessage(text, type) {
    var node = $("checkout-message");
    if (!node) return;
    node.textContent = text;
    node.hidden = !text;
    node.className = "checkout-message " + (type === "error" ? "is-error" : "is-success");
  }

  function findPart(id) {
    return state.parts.find(function (part) { return part.id === id; });
  }

  function renderOrder() {
    var lines = $("checkout-lines");
    var total = $("checkout-total");
    var count = $("checkout-count");
    var sum = 0;
    var itemCount = state.cart.reduce(function (acc, line) {
      return acc + (parseInt(line.qty, 10) || 0);
    }, 0);

    if (count) count.textContent = itemCount + (itemCount === 1 ? " item" : " items");

    if (!state.cart.length) {
      if (lines) {
        lines.innerHTML =
          '<p class="cart-empty">Your cart is empty. Add products before checkout.</p>' +
          '<a class="btn btn-secondary" href="index.html">Back to store</a>';
      }
      if (total) total.textContent = Shop.formatNok(0);
      state.total = 0;
      renderCustomer();
      return;
    }

    if (lines) {
      lines.innerHTML = state.cart.map(function (line) {
        var part = findPart(line.partId);
        if (!part) return "";
        var qty = parseInt(line.qty, 10) || 0;
        var lineTotal = (Number(part.price) || 0) * qty;
        sum += lineTotal;
        return '' +
          '<article class="checkout-line">' +
            '<div>' +
              '<h3>' + escapeHtml(part.name) + '</h3>' +
              '<p>' + escapeHtml(part.sku || part.id) + ' · Qty ' + escapeHtml(qty) + '</p>' +
            '</div>' +
            '<strong>' + escapeHtml(Shop.formatNok(lineTotal)) + '</strong>' +
          '</article>';
      }).join("");
    }

    state.total = sum;
    if (total) total.textContent = Shop.formatNok(sum);
    renderCustomer();
  }

  function signedInHtml(customer) {
    return '' +
      '<div class="checkout-rewards-card">' +
        '<p class="shop-eyebrow">Rewards enabled</p>' +
        '<h2>Checkout as ' + escapeHtml(customer.name || customer.email) + '</h2>' +
        '<p>You are signed in, so this order can count toward Spectr rewards.</p>' +
        '<button type="button" class="btn btn-primary" id="checkout-submit">Continue to payment</button>' +
      '</div>';
  }

  function guestHtml() {
    return '' +
      '<div class="checkout-rewards-card">' +
        '<p class="shop-eyebrow">Earn rewards</p>' +
        '<h2>Log in before you pay</h2>' +
        '<p>Sign in or create an account to earn rewards on this order.</p>' +
        '<div class="checkout-actions">' +
          '<a class="btn btn-primary" href="' + escapeHtml(loginHref()) + '">Log in for rewards</a>' +
          '<a class="btn btn-secondary" href="' + escapeHtml(createAccountHref()) + '">Create account</a>' +
        '</div>' +
      '</div>' +
      '<form class="checkout-guest-form" id="checkout-guest-form">' +
        '<p class="shop-eyebrow">Guest checkout</p>' +
        '<h2>Continue as guest</h2>' +
        '<label>Email for receipt<input type="email" id="guest-email" autocomplete="email" required placeholder="you@example.com" /></label>' +
        '<label>Name, optional<input type="text" id="guest-name" autocomplete="name" placeholder="Your name" /></label>' +
        '<button type="submit" class="btn btn-primary" id="checkout-submit">Continue to payment</button>' +
      '</form>';
  }

  function renderCustomer() {
    var node = $("checkout-customer");
    if (!node) return;
    if (!state.cart.length) {
      node.innerHTML = "";
      return;
    }
    node.innerHTML = state.customer ? signedInHtml(state.customer) : guestHtml();

    var signedInButton = state.customer && $("checkout-submit");
    if (signedInButton) signedInButton.addEventListener("click", submitCheckout);

    var guestForm = $("checkout-guest-form");
    if (guestForm) {
      guestForm.addEventListener("submit", function (event) {
        event.preventDefault();
        submitCheckout();
      });
    }
  }

  function checkoutCustomerPayload() {
    if (state.customer) {
      return {
        email: state.customer.email,
        name: state.customer.name || state.customer.email,
      };
    }
    return {
      email: ($("guest-email") && $("guest-email").value || "").trim(),
      name: ($("guest-name") && $("guest-name").value || "").trim(),
    };
  }

  function setSubmitting(submitting) {
    state.submitting = submitting;
    document.querySelectorAll("#checkout-submit").forEach(function (button) {
      button.disabled = submitting;
      button.textContent = submitting ? "Opening Stripe..." : "Continue to payment";
    });
  }

  async function submitCheckout() {
    if (state.submitting || !state.cart.length) return;
    var customer = checkoutCustomerPayload();
    if (!customer.email) {
      showMessage("Enter your email to continue as guest, or log in for rewards.", "error");
      return;
    }

    setSubmitting(true);
    showMessage("", "success");

    try {
      var headers = { "Content-Type": "application/json" };
      if (state.customer && state.customer.accessToken) {
        headers.Authorization = "Bearer " + state.customer.accessToken;
      }
      var res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          lines: state.cart,
          customer: customer,
          accessToken: state.customer && state.customer.accessToken,
        }),
      });
      var data = await res.json().catch(function () { return {}; });
      if (!res.ok) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (err) {
      showMessage(err.message || "Could not start checkout.", "error");
      setSubmitting(false);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    state.customer = readCustomerSession();
    state.cart = Shop.getCart();

    if (new URLSearchParams(window.location.search).get("checkout") === "cancelled") {
      showMessage("Checkout was cancelled. Your cart is still here.", "error");
    }

    Shop.fetchCatalogParts()
      .then(function (parts) {
        state.parts = Array.isArray(parts) ? parts : [];
        renderOrder();
      })
      .catch(function () {
        showMessage("Could not load the product catalog. Please try again.", "error");
        renderOrder();
      });
  });
})();
