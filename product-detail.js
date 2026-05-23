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

  function categoryLabelHtml(label) {
    if (window.SpectrShopNav && typeof window.SpectrShopNav.categoryLabelHtml === "function") {
      return window.SpectrShopNav.categoryLabelHtml(label);
    }
    return '<span class="category-label-text">' + escapeHtml(label || "Car part") + "</span>";
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function brandSlug(brand) {
    return normalize(brand)
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function extractBrand(part) {
    var direct = String((part && part.brand) || "").trim();
    if (direct) return direct;

    var specs = Array.isArray(part && part.specifications) ? part.specifications : [];
    var brandSpec = specs.find(function (spec) {
      return normalize(spec && (spec.label || spec.name)) === "brand";
    });
    if (brandSpec && String(brandSpec.value || "").trim()) {
      return String(brandSpec.value || "").trim();
    }

    var name = String((part && part.name) || "").trim();
    if (/^continental\b/i.test(name)) return "Continental";
    return "";
  }

  function brandProductsHref(brand) {
    return "part-category.html?brand=" + encodeURIComponent(brand);
  }

  function brandBadgeHtml(part, modifier, linked) {
    var brand = extractBrand(part);
    var slug = brandSlug(brand);
    if (!brand || !slug) return "";
    var image = '<img src="assets/brand/' + escapeHtml(slug) + '-logo.png" alt="' + escapeHtml(brand) + '" loading="lazy" decoding="async" onerror="this.closest(\'.product-brand-badge\').hidden=true">';
    var classes = "product-brand-badge " + (modifier || "");
    if (linked) {
      return '<a class="' + escapeHtml(classes) + '" href="' + escapeHtml(brandProductsHref(brand)) + '" aria-label="View ' + escapeHtml(brand) + ' products">' + image + '</a>';
    }
    return '<span class="' + escapeHtml(classes) + '" aria-label="' + escapeHtml(brand) + ' product">' + image + '</span>';
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
    var category = normalize(product && product.category);
    return category === "tyres" || category === "tires";
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

  function productFactSpecs(product) {
    return [
      product.article_number ? { label: "Article number", value: product.article_number } : null,
      product.sku ? { label: "SKU", value: product.sku } : null,
      product.ean_code ? { label: "EAN", value: product.ean_code } : null,
      { label: "Delivery", value: product.delivery_time || "2-5 days" },
    ].filter(function (fact) { return fact && fact.value; });
  }

  function renderSpecifications(product) {
    var specs = (Array.isArray(product.specifications) ? product.specifications : []).concat(productFactSpecs(product));
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
    var imgUrl = escapeHtml(Shop.productImageUrl(product));
    var fallback = escapeHtml(Shop.productImageUrl({}));
    return '<div class="product-detail-media product-detail-media--image">' +
      '<img src="' + imgUrl + '" alt="' + escapeHtml(product.name) + '" ' +
        'onerror="this.onerror=null;this.src=\'' + fallback + '\'" /></div>';
  }

  function productCardMedia(part) {
    var imgUrl = escapeHtml(Shop.productImageUrl(part));
    var fallback = escapeHtml(Shop.productImageUrl({}));
    return (
      '<div class="product-image product-image--has-image">' +
        '<img src="' + imgUrl + '" alt="' + escapeHtml(part.name) + '" loading="lazy" decoding="async" ' +
          'onerror="this.onerror=null;this.src=\'' + fallback + '\'" />' +
      '</div>'
    );
  }

  function cartLineMedia(part) {
    return '<div class="cart-line-media cart-line-media--has-image"><img src="' + escapeHtml(Shop.productImageUrl(part)) + '" alt="' + escapeHtml(part.name) + '" loading="lazy" /></div>';
  }

  function previewDescription(part) {
    if (part.description) return part.description;
    return (Array.isArray(part.specifications) ? part.specifications : [])
      .map(function (spec) { return spec && spec.value; })
      .filter(Boolean)
      .slice(0, 4)
      .join(", ");
  }

  function reviewCount(part) {
    return Array.isArray(part.reviews) ? part.reviews.length : 0;
  }

  function previewPriceHtml(part) {
    var price = Number(part.price) || 0;
    if (!price) return '<span class="product-price">Contact us</span>';
    var vatNote = (window.SpectrCurrency && window.SpectrCurrency.ready)
      ? window.SpectrCurrency.vatHtml(price)
      : "inkl.\u00a025\u00a0% MVA";
    return (
      '<span class="product-price">' + escapeHtml(Shop.formatNok(price)) + '</span>' +
      (vatNote ? '<span class="product-vat">' + escapeHtml(vatNote) + '</span>' : '')
    );
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
        '<div class="product-detail-left">' +
          renderProductMedia(product) +
          renderSpecifications(product) +
        '</div>' +
        '<div class="product-detail-body">' +
          (hideProductEyebrow(product) ? '' : '<p class="shop-eyebrow">' + categoryLabelHtml(product.category || "Car part") + '</p>') +
          brandBadgeHtml(product, "product-brand-badge--detail", true) +
          '<h1>' + escapeHtml(product.name) + '</h1>' +
          '<p class="product-detail-description">' + escapeHtml(product.description || "Product details are generated from the Spectr compatibility catalog.") + '</p>' +
          '<div class="product-detail-buy">' +
            '<strong>' + escapeHtml(Shop.formatNok(product.price || 0)) + '</strong>' +
            (outOfStock ? '' : '<span class="is-in">' + escapeHtml(stockLabel(product.stock)) + '</span>') +
          '</div>' +
          (product.price
            ? '<p class="product-detail-vat">' + escapeHtml(
                (window.SpectrCurrency && window.SpectrCurrency.ready)
                  ? window.SpectrCurrency.vatHtml(product.price)
                  : "inkl.\u00a025\u00a0% MVA"
              ) + '</p>'
            : '') +
          '<button type="button" class="btn btn-primary product-detail-add" id="product-detail-add" ' + (outOfStock ? "disabled" : "") + '>' +
            (outOfStock ? "Out of stock" : (line ? "In cart · " + line.qty : "Add to cart")) +
          '</button>' +
          '<div class="product-detail-service">' +
            '<span>' + escapeHtml(product.delivery_time || "2-5 days") + ' delivery</span>' +
            '<span>Secure checkout</span>' +
          '</div>' +
          '<div class="product-overview-grid">' +
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

  var CART_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>';

  function stockMeta(part) {
    var stock = parseInt(part.stock, 10) || 0;
    return stock > 0
      ? '<div class="product-meta"><span class="product-stock-label is-in">In stock</span></div>'
      : '<div class="product-meta"><span class="product-stock-label is-out">Out of stock</span></div>';
  }

  function renderProductCard(part) {
    var description = previewDescription(part);
    var stock = parseInt(part.stock, 10) || 0;
    var price = Number(part.price) || 0;
    var addBtn = price
      ? '<button type="button" class="product-add" data-add-part="' + escapeHtml(part.id) + '"' +
          (stock <= 0 ? ' disabled' : '') +
          ' aria-label="Add to cart">' + CART_ICON + '</button>'
      : '';
    return '' +
      '<article class="product" data-product-id="' + escapeHtml(part.id) + '">' +
        productCardMedia(part) +
        '<div class="product-body">' +
          '<span class="product-category">' + categoryLabelHtml(part.category || "Car part") + '</span>' +
          '<h3 class="product-name">' + escapeHtml(part.name) + '</h3>' +
          (description ? '<p class="product-description">' + escapeHtml(description) + '</p>' : '') +
          '<div class="product-foot">' +
            '<div class="product-price-block">' + previewPriceHtml(part) + '</div>' +
            addBtn +
          '</div>' +
          stockMeta(part) +
        '</div>' +
      '</article>';
  }

  function renderSimilar() {
    var grid = $("similar-products-grid");
    if (!state.product) {
      grid.innerHTML = "";
      updateSimilarControls();
      return;
    }

    var similar = state.parts.filter(function (part) {
      return part.id !== state.product.id && part.category === state.product.category;
    }).slice(0, 8);

    grid.innerHTML = similar.length
      ? similar.map(renderProductCard).join("")
      : '<div class="catalog-empty"><strong>No similar products yet</strong></div>';
    grid.scrollLeft = 0;
    updateSimilarControls();
  }

  function updateSimilarControls() {
    var grid = $("similar-products-grid");
    var prev = $("similar-products-prev");
    var next = $("similar-products-next");
    if (!grid || !prev || !next) return;

    var canSlide = grid.scrollWidth > grid.clientWidth + 2;
    var atStart = grid.scrollLeft <= 2;
    var atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;

    prev.disabled = !canSlide || atStart;
    next.disabled = !canSlide || atEnd;
  }

  function slideSimilar(direction) {
    var grid = $("similar-products-grid");
    if (!grid) return;
    grid.scrollBy({
      left: direction * Math.max(1, grid.clientWidth - 32),
      behavior: "smooth"
    });
    window.setTimeout(updateSimilarControls, 260);
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

    $("similar-products-grid").addEventListener("scroll", updateSimilarControls);

    var similarPrev = $("similar-products-prev");
    var similarNext = $("similar-products-next");
    if (similarPrev) {
      similarPrev.addEventListener("click", function () {
        slideSimilar(-1);
      });
    }
    if (similarNext) {
      similarNext.addEventListener("click", function () {
        slideSimilar(1);
      });
    }

    window.addEventListener("resize", updateSimilarControls);

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
