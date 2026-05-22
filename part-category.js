(function () {
  "use strict";

  if (!window.SpectrShop) return;

  var Shop = window.SpectrShop;
  var state = {
    category: "",
    parts: [],
  };

  var DEALS_CATEGORY = "Deals";
  var FEATURED_LIMIT = 8;
  var DEALS_LIMIT = 12;
  var CONTINENTAL_LOGO_SRC = "assets/brand/continental-logo.png";

  function $(id) { return document.getElementById(id); }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function isContinentalPart(part) {
    return /continental/i.test([part && part.brand, part && part.name].filter(Boolean).join(" "));
  }

  function continentalBadgeHtml(part) {
    if (!isContinentalPart(part)) return "";
    return '<span class="product-brand-badge" aria-label="Continental product"><img src="' + CONTINENTAL_LOGO_SRC + '" alt="Continental" loading="lazy" decoding="async"></span>';
  }

  function selectedCategory() {
    return new URLSearchParams(window.location.search).get("category") || "Oils";
  }

  function isSameCategory(part) {
    if (normalize(state.category) === normalize(DEALS_CATEGORY)) return true;
    return normalize(part.category) === normalize(state.category);
  }

  function productRank(part) {
    var stock = parseInt(part.stock, 10) || 0;
    return {
      inStock: stock > 0 ? 1 : 0,
      stock: stock,
      price: Number(part.price) || 0,
      name: String(part.name || "")
    };
  }

  function featuredProducts(parts, limit) {
    return parts.slice().sort(function (a, b) {
      var ar = productRank(a);
      var br = productRank(b);
      if (br.inStock !== ar.inStock) return br.inStock - ar.inStock;
      if (br.stock !== ar.stock) return br.stock - ar.stock;
      if (ar.price !== br.price) return ar.price - br.price;
      return ar.name.localeCompare(br.name);
    }).slice(0, limit);
  }

  function dealProducts(parts, limit) {
    return parts.slice().sort(function (a, b) {
      var ar = productRank(a);
      var br = productRank(b);
      if (br.inStock !== ar.inStock) return br.inStock - ar.inStock;
      if (ar.price !== br.price) return ar.price - br.price;
      if (br.stock !== ar.stock) return br.stock - ar.stock;
      return ar.name.localeCompare(br.name);
    }).slice(0, limit);
  }

  function stockLabel(stock) {
    var count = Number(stock) || 0;
    if (count <= 0) return "Out of stock";
    return count > 99 ? "99+ in stock" : count + " in stock";
  }

  function productCardMedia(part) {
    return (
      '<div class="product-image product-image--has-image">' +
        '<img src="' + escapeHtml(Shop.productImageUrl(part)) + '" alt="' + escapeHtml(part.name) + '" loading="lazy" />' +
      '</div>'
    );
  }

  function cartLineMedia(part) {
    return '<div class="cart-line-media cart-line-media--has-image"><img src="' + escapeHtml(Shop.productImageUrl(part)) + '" alt="' + escapeHtml(part.name) + '" loading="lazy" /></div>';
  }

  function visibleParts() {
    return state.parts.filter(isSameCategory);
  }

  function renderHero() {
    document.title = state.category + " | Spectr";
  }

  function renderProducts() {
    var grid = $("category-products-grid");
    var summary = $("category-products-summary");
    var availableParts = visibleParts();
    var parts = normalize(state.category) === normalize(DEALS_CATEGORY)
      ? dealProducts(availableParts, DEALS_LIMIT)
      : featuredProducts(availableParts, FEATURED_LIMIT);
    var cart = Shop.cartForParts(state.parts);

    if (summary) {
      summary.textContent = parts.length + " shown from " + availableParts.length;
    }

    if (!parts.length) {
      grid.innerHTML =
        '<div class="catalog-empty">' +
          '<strong>No compatible products found</strong>' +
          '<span>Try another category or check back soon.</span>' +
        '</div>';
      return;
    }

    grid.innerHTML = parts.map(function (part) {
      var inCart = cart.find(function (line) { return line.partId === part.id; });
      var outOfStock = (part.stock || 0) <= 0;
      return '' +
        '<article class="product" data-product-id="' + escapeHtml(part.id) + '">' +
          productCardMedia(part) +
          '<div class="product-body">' +
            '<span class="product-category">' + escapeHtml(part.category || "Car part") + '</span>' +
            continentalBadgeHtml(part) +
            '<h3 class="product-name">' + escapeHtml(part.name) + '</h3>' +
            '<span class="product-sku">' + escapeHtml(part.article_number || part.sku || part.id) + '</span>' +
            (part.description ? '<p class="product-description">' + escapeHtml(part.description) + '</p>' : '') +
            (outOfStock ? '' : '<span class="product-stock is-in">' + escapeHtml(stockLabel(part.stock)) + '</span>') +
            '<span class="product-delivery">' + escapeHtml(part.delivery_time || "2-5 days") + ' delivery</span>' +
            '<div class="product-foot">' +
              '<span class="product-price">' + escapeHtml(Shop.formatNok(part.price || 0)) + '</span>' +
              '<button type="button" class="product-add" data-add-part="' + escapeHtml(part.id) + '"' + (outOfStock ? " disabled" : "") + '>' +
                (outOfStock ? "Out of stock" : (inCart ? "In cart · " + inCart.qty : "Add to cart")) +
              '</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  function renderCart() {
    var body = $("cart-body");
    var total = $("cart-total");
    var count = $("cart-fab-count");
    var cart = Shop.cartForParts(state.parts);

    if (count) count.textContent = Shop.cartItemCount(cart);

    if (!cart.length) {
      if (body) body.innerHTML = '<p class="cart-empty">Your cart is empty. Browse products to add parts.</p>';
      if (total) total.textContent = Shop.formatNok(0);
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
          cartLineMedia(part) +
          '<div class="cart-line-main">' +
            '<h4>' + escapeHtml(part.name) + '</h4>' +
            '<small>' + escapeHtml(part.sku || part.id) + ' · ' + escapeHtml(part.category || "Car part") + '</small>' +
          '</div>' +
          '<span class="cart-line-price">' + escapeHtml(Shop.formatNok(lineTotal)) + '</span>' +
          '<div class="cart-line-controls">' +
            '<button type="button" data-qty-dec aria-label="Minus">-</button>' +
            '<span>' + escapeHtml(line.qty) + '</span>' +
            '<button type="button" data-qty-inc aria-label="Plus">+</button>' +
            SpectrShop.cartRemoveButtonHtml() +
          '</div>' +
        '</div>';
    }).join("");
    if (total) total.textContent = Shop.formatNok(sum);
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

  function bindCart() {
    $("category-products-grid").addEventListener("click", function (event) {
      var button = event.target.closest("[data-add-part]");
      if (button) {
        Shop.celebrateAddToCart(button);
        Shop.addToCart(button.dataset.addPart, 1);
        renderProducts();
        renderCart();
        openCart();
        return;
      }
      var product = event.target.closest("[data-product-id]");
      if (product) {
        window.location.href = "product.html?id=" + encodeURIComponent(product.dataset.productId);
      }
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
      renderProducts();
      renderCart();
    });

    $("cart-checkout").addEventListener("click", function () {
      if (!Shop.getCart().length) return;
      window.location.href = "checkout.html";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    state.category = selectedCategory();
    renderHero();

    Shop.fetchCatalogParts().then(function (parts) {
      state.parts = Array.isArray(parts) ? parts : [];
      bindCart();
      renderHero();
      renderProducts();
      renderCart();
    }).catch(function (err) {
      $("category-products-grid").innerHTML =
        '<div class="catalog-empty"><strong>Could not load this category</strong><span>' +
        escapeHtml(err.message || "Database unavailable.") +
        '</span></div>';
    });
  });
})();
