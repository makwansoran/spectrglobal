(function () {
  "use strict";

  if (!window.SpectrShop) return;

  var Shop = window.SpectrShop;
  var state = {
    parts: [],
    product: null,
  };

  function $(id) { return document.getElementById(id); }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initials(name) {
    return (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) { return word.charAt(0).toUpperCase(); })
      .join("") || "SP";
  }

  function productId() {
    return new URLSearchParams(window.location.search).get("id") || "";
  }

  function cartLine(partId) {
    return Shop.getCart().find(function (line) { return line.partId === partId; });
  }

  function productHref(part) {
    return "product.html?id=" + encodeURIComponent(part.id);
  }

  function renderFitment(product) {
    var vehicles = Array.isArray(product.vehicles) ? product.vehicles : [];
    if (!vehicles.length) {
      return '<p class="product-detail-muted">Universal listing or fitment data is not connected yet.</p>';
    }

    return (
      '<div class="product-fitment-list">' +
        vehicles.slice(0, 18).map(function (vehicle) {
          return '<span>' + escapeHtml([vehicle.brand, vehicle.model, vehicle.engine].filter(Boolean).join(" ")) + '</span>';
        }).join("") +
        (vehicles.length > 18 ? '<small>+' + (vehicles.length - 18) + ' more compatible vehicles</small>' : '') +
      '</div>'
    );
  }

  function renderDetail() {
    var product = state.product;
    var detail = $("product-detail");
    if (!product) {
      detail.innerHTML =
        '<div class="catalog-empty"><strong>Product not found</strong><span>This listing may no longer be available.</span></div>';
      return;
    }

    var line = cartLine(product.id);
    var outOfStock = (product.stock || 0) <= 0;
    document.title = product.name + " | Spectr";

    detail.innerHTML = '' +
      '<a class="brand-back-link" href="javascript:history.back()">Back to listings</a>' +
      '<div class="product-detail-card">' +
        '<div class="product-detail-media"><span>' + escapeHtml(initials(product.name)) + '</span></div>' +
        '<div class="product-detail-body">' +
          '<p class="shop-eyebrow">' + escapeHtml(product.category || "Car part") + '</p>' +
          '<h1>' + escapeHtml(product.name) + '</h1>' +
          '<p class="product-detail-sku">' + escapeHtml(product.sku || product.id) + '</p>' +
          '<p class="product-detail-description">' + escapeHtml(product.description || "No product description has been added yet.") + '</p>' +
          '<div class="product-detail-buy">' +
            '<strong>' + escapeHtml(Shop.formatNok(product.price || 0)) + '</strong>' +
            '<span class="' + (outOfStock ? "is-out" : "") + '">' + (outOfStock ? "Out of stock" : (product.stock || 0) + " in stock") + '</span>' +
          '</div>' +
          '<button type="button" class="btn btn-primary product-detail-add" id="product-detail-add" ' + (outOfStock ? "disabled" : "") + '>' +
            (line ? "In cart · " + line.qty : "Add to cart") +
          '</button>' +
          '<section class="product-detail-section">' +
            '<h2>Product description</h2>' +
            '<p>' + escapeHtml(product.description || "This product is available in the Spectr catalog. Add detailed specifications in the admin panel.") + '</p>' +
          '</section>' +
          '<section class="product-detail-section">' +
            '<h2>Compatible vehicles</h2>' +
            renderFitment(product) +
          '</section>' +
        '</div>' +
      '</div>';

    $("product-detail-add").addEventListener("click", function () {
      Shop.addToCart(product.id, 1);
      renderDetail();
      renderSimilar();
      renderCart();
      openCart();
    });
  }

  function renderProductCard(part) {
    var line = cartLine(part.id);
    var outOfStock = (part.stock || 0) <= 0;
    return '' +
      '<article class="product" data-product-id="' + escapeHtml(part.id) + '">' +
        '<div class="product-image"><span>' + escapeHtml(initials(part.name)) + '</span></div>' +
        '<div class="product-body">' +
          '<span class="product-category">' + escapeHtml(part.category || "Car part") + '</span>' +
          '<h3 class="product-name">' + escapeHtml(part.name) + '</h3>' +
          '<span class="product-sku">' + escapeHtml(part.sku || part.id) + '</span>' +
          (part.description ? '<p class="product-description">' + escapeHtml(part.description) + '</p>' : '') +
          '<span class="product-stock ' + (outOfStock ? "is-out" : "") + '">' + (outOfStock ? "Out of stock" : (part.stock || 0) + " in stock") + '</span>' +
          '<div class="product-foot">' +
            '<span class="product-price">' + escapeHtml(Shop.formatNok(part.price || 0)) + '</span>' +
            '<button type="button" class="product-add" data-add-part="' + escapeHtml(part.id) + '"' + (outOfStock ? " disabled" : "") + '>' +
              (line ? "In cart · " + line.qty : "Add to cart") +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderSimilar() {
    var grid = $("similar-products-grid");
    var summary = $("similar-products-summary");
    if (!state.product) {
      grid.innerHTML = "";
      return;
    }

    var similar = state.parts.filter(function (part) {
      return part.id !== state.product.id && part.category === state.product.category;
    }).slice(0, 8);

    if (summary) {
      summary.textContent = similar.length
        ? "More " + String(state.product.category || "products").toLowerCase() + " from the catalog."
        : "No similar products found yet.";
    }

    grid.innerHTML = similar.length
      ? similar.map(renderProductCard).join("")
      : '<div class="catalog-empty"><strong>No similar products yet</strong></div>';
  }

  function renderCart() {
    var body = $("cart-body");
    var total = $("cart-total");
    var count = $("cart-fab-count");
    var cart = Shop.getCart();

    if (count) count.textContent = cart.reduce(function (sum, line) { return sum + (parseInt(line.qty, 10) || 0); }, 0);

    if (!cart.length) {
      body.innerHTML = '<p class="cart-empty">Your cart is empty. Browse listings to add products.</p>';
      total.textContent = Shop.formatNok(0);
      return;
    }

    var sum = 0;
    body.innerHTML = cart.map(function (line) {
      var part = state.parts.find(function (item) { return item.id === line.partId; });
      if (!part) return "";
      var lineTotal = (part.price || 0) * (line.qty || 0);
      sum += lineTotal;
      return '' +
        '<div class="cart-line" data-line="' + escapeHtml(part.id) + '">' +
          '<div>' +
            '<h4>' + escapeHtml(part.name) + '</h4>' +
            '<small>' + escapeHtml(part.sku || part.id) + ' · ' + escapeHtml(part.category || "Car part") + '</small>' +
          '</div>' +
          '<span class="cart-line-price">' + escapeHtml(Shop.formatNok(lineTotal)) + '</span>' +
          '<div class="cart-line-controls">' +
            '<button type="button" data-qty-dec aria-label="Minus">-</button>' +
            '<span>' + escapeHtml(line.qty) + '</span>' +
            '<button type="button" data-qty-inc aria-label="Plus">+</button>' +
            '<button type="button" class="cart-line-remove" data-remove>Remove</button>' +
          '</div>' +
        '</div>';
    }).join("");
    total.textContent = Shop.formatNok(sum);
  }

  function openCart() {
    $("cart-drawer").classList.add("is-open");
    $("cart-drawer").setAttribute("aria-hidden", "false");
    $("cart-backdrop").hidden = false;
    $("cart-fab").setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    $("cart-drawer").classList.remove("is-open");
    $("cart-drawer").setAttribute("aria-hidden", "true");
    $("cart-backdrop").hidden = true;
    $("cart-fab").setAttribute("aria-expanded", "false");
  }

  function bindInteractions() {
    $("similar-products-grid").addEventListener("click", function (event) {
      var button = event.target.closest("[data-add-part]");
      if (button) {
        Shop.addToCart(button.dataset.addPart, 1);
        renderDetail();
        renderSimilar();
        renderCart();
        openCart();
        return;
      }
      var product = event.target.closest("[data-product-id]");
      if (product) window.location.href = productHref({ id: product.dataset.productId });
    });

    $("cart-fab").addEventListener("click", openCart);
    $("cart-close").addEventListener("click", closeCart);
    $("cart-backdrop").addEventListener("click", closeCart);

    $("cart-body").addEventListener("click", function (event) {
      var line = event.target.closest("[data-line]");
      if (!line) return;
      var current = Shop.getCart().find(function (item) { return item.partId === line.dataset.line; });
      if (!current) return;
      if (event.target.closest("[data-qty-inc]")) {
        Shop.updateCartQty(line.dataset.line, current.qty + 1);
      } else if (event.target.closest("[data-qty-dec]")) {
        Shop.updateCartQty(line.dataset.line, current.qty - 1);
      } else if (event.target.closest("[data-remove]")) {
        Shop.removeFromCart(line.dataset.line);
      }
      renderDetail();
      renderSimilar();
      renderCart();
    });

    $("cart-checkout").addEventListener("click", function () {
      if (!Shop.getCart().length) return;
      alert("Thanks for your order! A checkout integration can be connected in the next step.");
      Shop.clearCart();
      renderDetail();
      renderSimilar();
      renderCart();
      closeCart();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Shop.fetchCatalogParts().then(function (parts) {
      state.parts = Array.isArray(parts) ? parts : [];
      state.product = state.parts.find(function (part) { return part.id === productId(); }) || null;
      bindInteractions();
      renderDetail();
      renderSimilar();
      renderCart();
    }).catch(function () {
      $("product-detail").innerHTML =
        '<div class="catalog-empty"><strong>Could not load product</strong><span>Database unavailable.</span></div>';
    });
  });
})();
