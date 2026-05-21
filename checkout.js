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
    guestOpen: false,
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
    var itemsTotal = $("checkout-items-total");
    var count = $("checkout-count");
    var title = $("checkout-title");
    var sum = 0;
    var itemCount = state.cart.reduce(function (acc, line) {
      return acc + (parseInt(line.qty, 10) || 0);
    }, 0);

    if (count) count.textContent = "(" + itemCount + ")";
    if (title) title.textContent = "Shopping Cart (" + itemCount + ")";

    if (!state.cart.length) {
      if (lines) {
        lines.innerHTML =
          '<p class="cart-empty">Your cart is empty. Add products before checkout.</p>' +
          '<a class="btn btn-secondary" href="index.html">Back to store</a>';
      }
      if (total) total.textContent = Shop.formatNok(0);
      if (itemsTotal) itemsTotal.textContent = Shop.formatNok(0);
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
        var stockLabel = (Number(part.stock) || 0) > 0 ? "In stock" : "Out of stock";
        return '' +
          '<article class="checkout-line" data-line="' + escapeHtml(part.id) + '">' +
            '<div class="checkout-line-media"><span>' + escapeHtml(initials(part.name)) + '</span></div>' +
            '<div class="checkout-line-main">' +
              '<h3>' + escapeHtml(part.name) + '</h3>' +
              '<p>' + escapeHtml(part.sku || part.id) + '</p>' +
              '<small>' + escapeHtml(stockLabel) + '</small>' +
              '<div class="checkout-line-perks">' +
                '<span>Free shipping</span>' +
                '<span>Secure payment</span>' +
              '</div>' +
              '<div class="checkout-line-actions">' +
                '<button type="button" data-remove>Remove</button>' +
                '<button type="button" data-save>Save for later</button>' +
              '</div>' +
            '</div>' +
            '<div class="checkout-line-side">' +
              '<div class="checkout-qty">' +
                '<button type="button" data-qty-dec aria-label="Decrease quantity">-</button>' +
                '<span>' + escapeHtml(qty) + '</span>' +
                '<button type="button" data-qty-inc aria-label="Increase quantity">+</button>' +
              '</div>' +
              '<strong>' + escapeHtml(Shop.formatNok(lineTotal)) + '</strong>' +
            '</div>' +
          '</article>';
      }).join("");
    }

    state.total = sum;
    if (total) total.textContent = Shop.formatNok(sum);
    if (itemsTotal) itemsTotal.textContent = Shop.formatNok(sum);
    renderCustomer();
  }

  function initials(name) {
    return String(name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) { return word.charAt(0).toUpperCase(); })
      .join("") || "SP";
  }

  function signedInHtml(customer) {
    return '' +
      '<div class="checkout-login-card">' +
        '<p>Signed in as <strong>' + escapeHtml(customer.name || customer.email) + '</strong></p>' +
        '<span>This order will count toward your rewards.</span>' +
      '</div>';
  }

  function guestHtml() {
    var openAttr = state.guestOpen ? "true" : "false";
    var formAttrs = state.guestOpen ? ' class="checkout-guest-form is-open" id="checkout-guest-form"' : ' class="checkout-guest-form" id="checkout-guest-form" hidden';
    return '' +
      '<div class="checkout-login-card">' +
        '<p>Want rewards?</p>' +
        '<span>Log in before checkout, or continue as guest.</span>' +
        '<div class="checkout-actions">' +
          '<a href="' + escapeHtml(loginHref()) + '">Log in</a>' +
          '<a href="' + escapeHtml(createAccountHref()) + '">Create account</a>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="checkout-guest-toggle" id="checkout-guest-toggle" aria-expanded="' + openAttr + '" aria-controls="checkout-guest-form"><span>Continue as guest</span><strong aria-hidden="true">⌄</strong></button>' +
      '<form' + formAttrs + '>' +
        '<label>Full name<input type="text" id="guest-name" autocomplete="name" required placeholder="Your name" /></label>' +
        '<label>Email address<input type="email" id="guest-email" autocomplete="email" required placeholder="you@example.com" /></label>' +
        '<label>Phone number<input type="tel" id="guest-phone" autocomplete="tel" required placeholder="+47 123 45 678" /></label>' +
        '<label>Address<input type="text" id="guest-address" autocomplete="street-address" required placeholder="Street and house number" /></label>' +
        '<label>Country<select id="guest-country" autocomplete="country-name" required>' +
          '<option value="">Choose country</option>' +
          '<option value="Norway">Norway</option>' +
          '<option value="Sweden">Sweden</option>' +
          '<option value="Denmark">Denmark</option>' +
          '<option value="Finland">Finland</option>' +
          '<option value="Germany">Germany</option>' +
          '<option value="United Kingdom">United Kingdom</option>' +
          '<option value="United States">United States</option>' +
          '<option value="Other">Other</option>' +
        '</select></label>' +
        '<button type="submit" class="btn btn-primary checkout-submit" id="checkout-submit">Check Out</button>' +
      '</form>';
  }

  function renderCustomer() {
    var node = $("checkout-customer");
    if (!node) return;
    if (!state.cart.length) {
      node.innerHTML = "";
      return;
    }
    node.innerHTML = state.customer
      ? signedInHtml(state.customer) + '<button type="button" class="btn btn-primary checkout-submit" id="checkout-submit">Check Out</button>'
      : guestHtml();

    var signedInButton = state.customer && $("checkout-submit");
    if (signedInButton) signedInButton.addEventListener("click", submitCheckout);

    var guestToggle = $("checkout-guest-toggle");
    var guestForm = $("checkout-guest-form");
    if (guestToggle && guestForm) {
      guestToggle.addEventListener("click", function () {
        state.guestOpen = true;
        guestToggle.setAttribute("aria-expanded", "true");
        guestForm.hidden = false;
        guestForm.classList.add("is-open");
        var nameInput = $("guest-name");
        if (nameInput) nameInput.focus();
      });
    }
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
      phone: ($("guest-phone") && $("guest-phone").value || "").trim(),
      address: ($("guest-address") && $("guest-address").value || "").trim(),
      country: ($("guest-country") && $("guest-country").value || "").trim(),
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
    if (!state.customer && (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.country)) {
      showMessage("Fill in name, email, address, country, and phone number to continue as guest.", "error");
      return;
    }
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

    $("checkout-lines").addEventListener("click", function (event) {
      var row = event.target.closest("[data-line]");
      if (!row) return;
      var current = Shop.getCart().find(function (line) { return line.partId === row.dataset.line; });
      if (!current) return;
      if (event.target.closest("[data-qty-inc]")) {
        Shop.updateCartQty(row.dataset.line, current.qty + 1);
      } else if (event.target.closest("[data-qty-dec]")) {
        Shop.updateCartQty(row.dataset.line, current.qty - 1);
      } else if (event.target.closest("[data-remove]")) {
        Shop.removeFromCart(row.dataset.line);
      } else {
        return;
      }
      state.cart = Shop.getCart();
      renderOrder();
    });
  });
})();
