(function () {
  "use strict";

  if (!window.SpectrShop) return;

  var Shop = window.SpectrShop;
  var state = {
    category: "",
    parts: [],
    makes: [],
    modelsByMakeId: {},
    selectedMake: null,
    selectedYear: "",
    selectedModel: "",
    selectedVin: "",
  };

  var DEALS_CATEGORY = "Deals";
  var FEATURED_LIMIT = 8;
  var DEALS_LIMIT = 12;

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

  function selectedCategory() {
    return new URLSearchParams(window.location.search).get("category") || "Oils";
  }

  function cleanVin(value) {
    return String(value || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 17);
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

  function modelSupportsYear(model, year) {
    var selectedYear = parseInt(year, 10);
    if (!selectedYear || !model.year_from) return true;
    if (selectedYear < model.year_from) return false;
    if (model.year_to && selectedYear > model.year_to) return false;
    return true;
  }

  function supportedYears(models) {
    var currentYear = new Date().getFullYear();
    var years = new Set();
    models.forEach(function (model) {
      if (!model.year_from) return;
      var from = parseInt(model.year_from, 10);
      var to = parseInt(model.year_to || currentYear, 10);
      for (var year = to; year >= from; year -= 1) years.add(year);
    });
    return Array.from(years).sort(function (a, b) { return b - a; });
  }

  function vehicleFitsSelection(part) {
    if (!state.selectedMake) return true;

    var brandName = state.selectedMake.name;
    var modelName = state.selectedModel;
    var vehicles = Array.isArray(part.vehicles) ? part.vehicles : [];
    if (!vehicles.length) return false;

    return vehicles.some(function (vehicle) {
      if (normalize(vehicle.brand) !== normalize(brandName)) return false;
      if (modelName && normalize(vehicle.model) !== normalize(modelName)) return false;
      return true;
    });
  }

  function visibleParts() {
    return state.parts.filter(function (part) {
      return isSameCategory(part) && vehicleFitsSelection(part);
    });
  }

  function renderHero() {
    document.title = state.category + " | Spectr";
    if (normalize(state.category).indexOf("oil") !== -1) {
      $("category-fit-title").textContent = "Find the correct oil by car or VIN";
    } else if (normalize(state.category).indexOf("brake") !== -1) {
      $("category-fit-title").textContent = "Find the correct brakes by car or VIN";
    } else if (normalize(state.category).indexOf("deal") !== -1) {
      $("category-fit-title").textContent = "Find weekly deals for your car";
    } else {
      $("category-fit-title").textContent = "Find the correct tyre size by car or VIN";
    }
  }

  function renderProducts() {
    var grid = $("category-products-grid");
    var summary = $("category-products-summary");
    var availableParts = visibleParts();
    var parts = normalize(state.category) === normalize(DEALS_CATEGORY)
      ? dealProducts(availableParts, DEALS_LIMIT)
      : featuredProducts(availableParts, FEATURED_LIMIT);
    var cart = Shop.getCart();

    if (summary) {
      var bits = [];
      if (state.selectedMake) {
        var label = state.selectedMake.name;
        if (state.selectedModel) label += " " + state.selectedModel;
        if (state.selectedYear) label += " " + state.selectedYear;
        if (state.selectedVin) label += " · VIN " + state.selectedVin;
        bits.push(label);
      } else if (state.selectedVin) {
        bits.push("VIN " + state.selectedVin);
      }
      bits.push(parts.length + " shown from " + availableParts.length);
      summary.textContent = bits.join(" · ");
    }

    if (!parts.length) {
      grid.innerHTML =
        '<div class="catalog-empty">' +
          '<strong>No compatible products found</strong>' +
          '<span>Try another model, year, or category.</span>' +
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
            '<h3 class="product-name">' + escapeHtml(part.name) + '</h3>' +
            '<span class="product-sku">' + escapeHtml(part.article_number || part.sku || part.id) + '</span>' +
            (part.description ? '<p class="product-description">' + escapeHtml(part.description) + '</p>' : '') +
            '<span class="product-stock ' + (outOfStock ? "is-out" : "is-in") + '">' + escapeHtml(stockLabel(part.stock)) + '</span>' +
            '<span class="product-delivery">' + escapeHtml(part.delivery_time || "2-5 days") + ' delivery</span>' +
            '<div class="product-foot">' +
              '<span class="product-price">' + escapeHtml(Shop.formatNok(part.price || 0)) + '</span>' +
              '<button type="button" class="product-add" data-add-part="' + escapeHtml(part.id) + '"' + (outOfStock ? " disabled" : "") + '>' +
                (inCart ? "In cart · " + inCart.qty : "Add to cart") +
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
    var cart = Shop.getCart();

    if (count) count.textContent = cart.reduce(function (sum, line) { return sum + (parseInt(line.qty, 10) || 0); }, 0);

    if (!cart.length) {
      if (body) body.innerHTML = '<p class="cart-empty">Your cart is empty. Choose your car and add compatible products.</p>';
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

  function renderModelOptions(models) {
    var modelSelect = $("category-model-select");
    var compatibleModels = models.filter(function (model) {
      return modelSupportsYear(model, state.selectedYear);
    });

    modelSelect.disabled = !compatibleModels.length;
    modelSelect.innerHTML = '<option value="">Choose model</option>' +
      compatibleModels.map(function (model) {
        return '<option value="' + escapeHtml(model.name) + '"' +
          (state.selectedModel === model.name ? " selected" : "") + '>' +
          escapeHtml(model.name) +
          '</option>';
      }).join("");
  }

  function renderYearOptions(models) {
    var yearSelect = $("category-year-select");
    var sourceModels = state.selectedModel
      ? models.filter(function (model) { return model.name === state.selectedModel; })
      : models;
    var years = supportedYears(sourceModels);

    yearSelect.disabled = !years.length;
    yearSelect.innerHTML = '<option value="">Choose year</option>' +
      years.map(function (year) {
        return '<option value="' + year + '"' +
          (String(state.selectedYear) === String(year) ? " selected" : "") + '>' +
          year +
          '</option>';
      }).join("");
  }

  function loadModels(make) {
    if (!make || !make.id) return Promise.resolve([]);
    if (state.modelsByMakeId[make.id]) return Promise.resolve(state.modelsByMakeId[make.id]);
    return fetch("/api/models?make_id=" + encodeURIComponent(make.id), { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || "Car models are unavailable.");
          state.modelsByMakeId[make.id] = Array.isArray(data.models) ? data.models : [];
          return state.modelsByMakeId[make.id];
        });
      });
  }

  function applySelection() {
    var status = $("category-fit-status");
    var reset = $("category-fit-reset");
    reset.hidden = !state.selectedMake && !state.selectedYear && !state.selectedModel && !state.selectedVin;
    status.textContent = state.selectedMake || state.selectedVin
      ? [state.selectedMake && state.selectedMake.name, state.selectedModel, state.selectedYear, state.selectedVin && "VIN " + state.selectedVin].filter(Boolean).join(" ") + " selected."
      : "";
    renderProducts();
  }

  function bindFitForm() {
    var brandSelect = $("category-brand-select");
    var yearSelect = $("category-year-select");
    var modelSelect = $("category-model-select");
    var vinInput = $("category-vin-input");
    var reset = $("category-fit-reset");

    brandSelect.innerHTML = '<option value="">Choose brand</option>' +
      state.makes.map(function (make) {
        return '<option value="' + escapeHtml(make.id) + '">' + escapeHtml(make.name) + '</option>';
      }).join("");

    brandSelect.addEventListener("change", function () {
      state.selectedMake = state.makes.find(function (make) { return make.id === brandSelect.value; }) || null;
      state.selectedYear = "";
      state.selectedModel = "";
      yearSelect.innerHTML = '<option value="">Choose year</option>';
      yearSelect.disabled = true;
      modelSelect.innerHTML = '<option value="">Choose model</option>';
      modelSelect.disabled = true;
      if (!state.selectedMake) {
        applySelection();
        return;
      }
      loadModels(state.selectedMake).then(function (models) {
        renderYearOptions(models);
        renderModelOptions(models);
        applySelection();
      }).catch(function () {
        modelSelect.innerHTML = '<option value="">Models unavailable</option>';
      });
    });

    yearSelect.addEventListener("change", function () {
      state.selectedYear = yearSelect.value;
      loadModels(state.selectedMake).then(function (models) {
        renderModelOptions(models);
        if (state.selectedModel && !modelSelect.value) state.selectedModel = "";
        applySelection();
      });
    });

    modelSelect.addEventListener("change", function () {
      state.selectedModel = modelSelect.value;
      loadModels(state.selectedMake).then(function (models) {
        renderYearOptions(models);
        applySelection();
      });
    });

    if (vinInput) {
      vinInput.addEventListener("input", function () {
        state.selectedVin = cleanVin(vinInput.value);
        vinInput.value = state.selectedVin;
        applySelection();
      });
    }

    $("category-fit-form").addEventListener("submit", function (event) {
      event.preventDefault();
      if (vinInput) {
        state.selectedVin = cleanVin(vinInput.value);
        vinInput.value = state.selectedVin;
      }
      applySelection();
      $("category-products-grid").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    reset.addEventListener("click", function () {
      state.selectedMake = null;
      state.selectedYear = "";
      state.selectedModel = "";
      state.selectedVin = "";
      brandSelect.value = "";
      yearSelect.innerHTML = '<option value="">Choose year</option>';
      yearSelect.disabled = true;
      modelSelect.innerHTML = '<option value="">Choose model</option>';
      modelSelect.disabled = true;
      if (vinInput) vinInput.value = "";
      applySelection();
    });
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

    if (window.SpectrShopNav) {
      window.SpectrShopNav.mountSidebar("shop-category-sidebar", {
        useLinks: true,
        activeCategory: state.category
      });
    }

    Promise.all([
      fetch("/api/makes?active=1&with_models=1&limit=300", { headers: { Accept: "application/json" } })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.error || "Car brands are unavailable.");
            return Array.isArray(data.makes) ? data.makes : [];
          });
        }),
      Shop.fetchCatalogParts(),
    ]).then(function (results) {
      state.makes = results[0];
      state.parts = Array.isArray(results[1]) ? results[1] : [];
      bindFitForm();
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
