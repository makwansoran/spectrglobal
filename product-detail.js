(function () {
  "use strict";

  if (!window.SpectrShop) return;

  var Shop = window.SpectrShop;
  var state = {
    parts: [],
    product: null,
  };
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

  function categoryLabelHtml(label) {
    if (window.SpectrShopNav && typeof window.SpectrShopNav.categoryLabelHtml === "function") {
      return window.SpectrShopNav.categoryLabelHtml(label);
    }
    return '<span class="category-label-text">' + escapeHtml(label || "Car part") + "</span>";
  }

  function isContinentalPart(part) {
    return /continental/i.test([part && part.brand, part && part.name].filter(Boolean).join(" "));
  }

  function continentalBadgeHtml(part, modifier) {
    if (!isContinentalPart(part)) return "";
    return '<span class="product-brand-badge ' + escapeHtml(modifier || "") + '" aria-label="Continental product"><img src="' + CONTINENTAL_LOGO_SRC + '" alt="Continental" loading="lazy" decoding="async"></span>';
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

  function hideProductEyebrow(product) {
    return product && product.id === "continental-contiprocontact";
  }

  function cartLine(partId) {
    return Shop.getCart().find(function (line) { return line.partId === partId; });
  }

  function productHref(part) {
    return "product.html?id=" + encodeURIComponent(part.id);
  }

  function stockLabel(stock) {
    var count = Number(stock) || 0;
    if (count <= 0) return "Out of stock";
    return count > 99 ? "99+ in stock" : count + " in stock";
  }

  function renderProductFacts(product) {
    var facts = [
      product.article_number ? ["Article number", product.article_number] : null,
      product.sku ? ["SKU", product.sku] : null,
      ["EAN", product.ean_code],
      ["Delivery", product.delivery_time || "2-5 days"],
    ].filter(function (fact) { return fact && fact[1]; });
    if (!facts.length) return "";
    return '<dl class="product-detail-facts">' + facts.map(function (fact) {
      return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
    }).join("") + '</dl>';
  }

  function renderSpecifications(product) {
    var specs = Array.isArray(product.specifications) ? product.specifications : [];
    if (!specs.length) return "";
    return (
      '<section class="product-detail-section product-detail-section--overview">' +
        '<h2>Product details</h2>' +
        '<dl class="product-spec-list">' +
          specs.map(function (spec) {
            var label = spec && typeof spec === "object" ? (spec.label || spec.name || "Detail") : "Detail";
            var value = spec && typeof spec === "object" ? spec.value : spec;
            return '<div><dt>' + escapeHtml(label) + '</dt><dd>' + escapeHtml(value || "") + '</dd></div>';
          }).join("") +
        '</dl>' +
      '</section>'
    );
  }

  function renderFitment(product) {
    var vehicles = Array.isArray(product.vehicles) ? product.vehicles : [];
    if (!vehicles.length) {
      return '<p class="product-detail-muted">Universal listing.</p>';
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

  function renderProductMedia(product) {
    return '<div class="product-detail-media product-detail-media--image"><img src="' + escapeHtml(Shop.productImageUrl(product)) + '" alt="' + escapeHtml(product.name) + '" /></div>';
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

  function renderFeatures(product) {
    var features = Array.isArray(product.features) ? product.features : [];
    if (!features.length) return "";
    return (
      '<section class="product-detail-section product-detail-section--overview">' +
        '<h2>Highlights</h2>' +
        '<ul class="product-feature-list">' +
          features.map(function (feature) { return '<li>' + escapeHtml(feature) + '</li>'; }).join("") +
        '</ul>' +
      '</section>'
    );
  }

  function renderReviews(product) {
    var reviews = Array.isArray(product.reviews) ? product.reviews : [];
    if (!reviews.length) return "";
    return (
      '<section class="product-detail-section product-detail-section--overview">' +
        '<h2>Reviews</h2>' +
        '<div class="product-review-list">' +
          reviews.slice(0, 6).map(function (review) {
            var rating = Math.max(1, Math.min(5, parseInt(review.rating, 10) || 5));
            return (
              '<article class="product-review">' +
                '<strong>' + escapeHtml("★★★★★".slice(0, rating)) + '</strong>' +
                '<p>' + escapeHtml(review.text || "Great quality and fitment.") + '</p>' +
                '<small>' + escapeHtml(review.name || "Verified customer") + '</small>' +
              '</article>'
            );
          }).join("") +
        '</div>' +
      '</section>'
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
      '<div class="product-detail-card">' +
        renderProductMedia(product) +
        '<div class="product-detail-body">' +
          (hideProductEyebrow(product) ? '' : '<p class="shop-eyebrow">' + categoryLabelHtml(product.category || "Car part") + '</p>') +
          continentalBadgeHtml(product, "product-brand-badge--detail") +
          '<h1>' + escapeHtml(product.name) + '</h1>' +
          '<p class="product-detail-sku">' + escapeHtml(product.article_number || product.sku || product.id) + '</p>' +
          '<p class="product-detail-description">' + escapeHtml(product.description || "Product details are generated from the Spectr compatibility catalog.") + '</p>' +
          renderProductFacts(product) +
          '<div class="product-detail-buy">' +
            '<strong>' + escapeHtml(Shop.formatNok(product.price || 0)) + '</strong>' +
            (outOfStock ? '' : '<span class="is-in">' + escapeHtml(stockLabel(product.stock)) + '</span>') +
          '</div>' +
          '<button type="button" class="btn btn-primary product-detail-add" id="product-detail-add" ' + (outOfStock ? "disabled" : "") + '>' +
            (outOfStock ? "Out of stock" : (line ? "In cart · " + line.qty : "Add to cart")) +
          '</button>' +
          '<div class="product-detail-service">' +
            '<span>' + escapeHtml(product.delivery_time || "2-5 days") + ' delivery</span>' +
            '<span>Secure checkout</span>' +
          '</div>' +
          '<div class="product-overview-grid">' +
            renderSpecifications(product) +
            renderFeatures(product) +
            '<section class="product-detail-section product-detail-section--overview">' +
              '<h2>Fitment</h2>' +
              renderFitment(product) +
            '</section>' +
            renderReviews(product) +
          '</div>' +
        '</div>' +
      '</div>';

    $("product-detail-add").addEventListener("click", function (event) {
      Shop.celebrateAddToCart(event.currentTarget);
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
        productCardMedia(part) +
        '<div class="product-body">' +
          '<span class="product-category">' + categoryLabelHtml(part.category || "Car part") + '</span>' +
          continentalBadgeHtml(part, "") +
          '<h3 class="product-name">' + escapeHtml(part.name) + '</h3>' +
          '<span class="product-sku">' + escapeHtml(part.article_number || part.sku || part.id) + '</span>' +
          (part.description ? '<p class="product-description">' + escapeHtml(part.description) + '</p>' : '') +
          (outOfStock ? '' : '<span class="product-stock is-in">' + escapeHtml(stockLabel(part.stock)) + '</span>') +
          '<span class="product-delivery">' + escapeHtml(part.delivery_time || "2-5 days") + ' delivery</span>' +
          '<div class="product-foot">' +
            '<span class="product-price">' + escapeHtml(Shop.formatNok(part.price || 0)) + '</span>' +
            '<button type="button" class="product-add" data-add-part="' + escapeHtml(part.id) + '"' + (outOfStock ? " disabled" : "") + '>' +
              (outOfStock ? "Out of stock" : (line ? "In cart · " + line.qty : "Add to cart")) +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderSimilar() {
    var grid = $("similar-products-grid");
    if (!state.product) {
      grid.innerHTML = "";
      return;
    }

    var similar = state.parts.filter(function (part) {
      return part.id !== state.product.id && part.category === state.product.category;
    }).slice(0, 8);

    grid.innerHTML = similar.length
      ? similar.map(renderProductCard).join("")
      : '<div class="catalog-empty"><strong>No similar products yet</strong></div>';
  }

  function renderCart() {
    var body = $("cart-body");
    var total = $("cart-total");
    var count = $("cart-fab-count");
    var cart = Shop.cartForParts(state.parts);

    if (count) count.textContent = Shop.cartItemCount(cart);

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
          cartLineMedia(part) +
          '<div class="cart-line-main">' +
            '<h4>' + escapeHtml(part.name) + '</h4>' +
            '<small>' + escapeHtml(part.sku || part.id) + ' · ' + categoryLabelHtml(part.category || "Car part") + '</small>' +
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
        Shop.celebrateAddToCart(button);
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
      window.location.href = "checkout.html";
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
