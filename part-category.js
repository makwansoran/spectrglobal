(function () {
  "use strict";

  if (!window.SpectrShop) return;

  var Shop = window.SpectrShop;
  var state = {
    category: "",
    parts: [],
    filters: {
      brand: new Set(),
      model: new Set(),
      dimension: new Set()
    }
  };

  var DEALS_CATEGORY = "Deals";
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

  function sortedProducts(parts) {
    return parts.slice().sort(function (a, b) {
      var ar = productRank(a);
      var br = productRank(b);
      if (br.inStock !== ar.inStock) return br.inStock - ar.inStock;
      if (br.stock !== ar.stock) return br.stock - ar.stock;
      if (ar.price !== br.price) return ar.price - br.price;
      return ar.name.localeCompare(br.name);
    });
  }

  function stockLabel(stock) {
    var count = Number(stock) || 0;
    if (count <= 0) return "Out of stock";
    return count > 99 ? "99+ in stock" : count + " in stock";
  }

  /* ── Filter data extraction ───────────────────────────── */

  function extractBrand(part) {
    return (part.brand || "").trim() || null;
  }

  function extractDimensions(part) {
    var haystack = [part.name, part.description, part.sku, part.article_number]
      .filter(Boolean).join(" ");
    var matches = haystack.match(/\d{3}\/\d{2,3}\s*[Rr]\s*\d{2}/g) || [];
    return matches.map(function (m) { return m.replace(/\s+/g, "").toUpperCase(); });
  }

  function extractModels(part) {
    var vehicles = Array.isArray(part.vehicles) ? part.vehicles : [];
    var seen = {};
    var result = [];
    vehicles.forEach(function (v) {
      var key = [v.brand, v.model].filter(Boolean).join(" ").trim();
      if (key && !seen[key]) {
        seen[key] = true;
        result.push(key);
      }
    });
    return result;
  }

  function buildFilterOptions(parts) {
    var brands = {}, models = {}, dimensions = {};
    parts.forEach(function (part) {
      var b = extractBrand(part);
      if (b) brands[b] = (brands[b] || 0) + 1;
      extractDimensions(part).forEach(function (d) {
        dimensions[d] = (dimensions[d] || 0) + 1;
      });
      extractModels(part).forEach(function (m) {
        models[m] = (models[m] || 0) + 1;
      });
    });
    return {
      brands: Object.keys(brands).sort(),
      models: Object.keys(models).sort(),
      dimensions: Object.keys(dimensions).sort(function (a, b) {
        return a.localeCompare(b, undefined, { numeric: true });
      })
    };
  }

  /* ── Filter matching ──────────────────────────────────── */

  function partMatchesFilters(part) {
    var f = state.filters;

    if (f.brand.size > 0) {
      var b = extractBrand(part);
      if (!b || !f.brand.has(b)) return false;
    }

    if (f.dimension.size > 0) {
      var dims = extractDimensions(part);
      var hit = dims.some(function (d) { return f.dimension.has(d); });
      if (!hit) return false;
    }

    if (f.model.size > 0) {
      var mods = extractModels(part);
      var mhit = mods.some(function (m) { return f.model.has(m); });
      if (!mhit) return false;
    }

    return true;
  }

  function visibleParts() {
    return state.parts.filter(function (part) {
      return isSameCategory(part) && partMatchesFilters(part);
    });
  }

  /* ── Sidebar rendering ────────────────────────────────── */

  function renderCheckboxList(containerId, values, activeSet, filterKey) {
    var container = $(containerId);
    if (!container) return;
    if (!values.length) {
      container.innerHTML = '<p class="cat-filter-empty">No options available</p>';
      return;
    }
    container.innerHTML = values.map(function (value) {
      var checked = activeSet.has(value) ? " checked" : "";
      var id = "chk-" + filterKey + "-" + value.replace(/[^a-z0-9]/gi, "-");
      return (
        '<label class="cat-filter-option">' +
          '<input type="checkbox" value="' + escapeHtml(value) + '"' + checked +
            ' data-filter-key="' + escapeHtml(filterKey) + '">' +
          '<span>' + escapeHtml(value) + '</span>' +
        '</label>'
      );
    }).join("");
  }

  function renderSidebar() {
    var categoryParts = state.parts.filter(isSameCategory);
    var opts = buildFilterOptions(categoryParts);
    renderCheckboxList("filter-body-brand",     opts.brands,     state.filters.brand,     "brand");
    renderCheckboxList("filter-body-model",     opts.models,     state.filters.model,     "model");
    renderCheckboxList("filter-body-dimension", opts.dimensions, state.filters.dimension, "dimension");
  }

  function bindSidebar() {
    var sidebar = $("cat-filter-sidebar");
    if (!sidebar) return;

    sidebar.addEventListener("click", function (event) {
      var toggle = event.target.closest(".cat-filter-toggle");
      if (toggle) {
        var group = toggle.closest(".cat-filter-group");
        var body = group && group.querySelector(".cat-filter-body");
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", open ? "false" : "true");
        if (body) body.classList.toggle("is-open", !open);
      }
    });

    sidebar.addEventListener("change", function (event) {
      var checkbox = event.target;
      if (checkbox.type !== "checkbox") return;
      var key = checkbox.dataset.filterKey;
      var value = checkbox.value;
      if (!key || !state.filters[key]) return;
      if (checkbox.checked) {
        state.filters[key].add(value);
      } else {
        state.filters[key].delete(value);
      }
      renderProducts();
    });
  }

  /* ── Product grid rendering ───────────────────────────── */

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

  function renderHero() {
    document.title = state.category + " | Spectr";
  }

  function renderProducts() {
    var grid = $("category-products-grid");
    var summary = $("category-products-summary");
    var availableParts = visibleParts();
    var parts = sortedProducts(availableParts);
    var cart = Shop.cartForParts(state.parts);

    if (summary) {
      var total = state.parts.filter(isSameCategory).length;
      summary.textContent = parts.length === total
        ? parts.length + " products"
        : parts.length + " of " + total + " products";
    }

    if (!parts.length) {
      grid.innerHTML =
        '<div class="catalog-empty">' +
          '<strong>No products match your filters</strong>' +
          '<span>Try removing a filter to see more results.</span>' +
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

  /* ── Cart ─────────────────────────────────────────────── */

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
      renderSidebar();
      bindSidebar();
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
