/* Spectr — shop landing logic.
 * Wires up promo slideshow, catalog grid, and cart drawer. */
(function () {
  "use strict";

  if (!window.SpectrShop) {
    console.warn("SpectrShop data layer missing — shop.js cannot initialise.");
    return;
  }

  var Shop = window.SpectrShop;
  var state = {
    activeCategory: null,
    vehicle: null,
    catalogParts: [],
    catalogStatus: "loading"
  };

  var DEALS_CATEGORY = "__deals";
  var FEATURED_LIMIT = 8;
  var DEALS_LIMIT = 12;
  var CONTINENTAL_LOGO_SRC = "assets/brand/continental-logo.png";

  function $(id) { return document.getElementById(id); }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
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

  function continentalBadgeHtml(part) {
    if (!isContinentalPart(part)) return "";
    return '<span class="product-brand-badge" aria-label="Continental product"><img src="' + CONTINENTAL_LOGO_SRC + '" alt="Continental" loading="lazy" decoding="async"></span>';
  }

  function initials(name) {
    return (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) { return word.charAt(0).toUpperCase(); })
      .join("") || "SP";
  }

  /* ── Promo slideshow ─────────────────────────────────────── */
  function initSlider() {
    var track = $("promo-track");
    var dots = $("promo-dots");
    var prev = $("promo-prev");
    var next = $("promo-next");
    if (!track || !dots) return;

    var slides = Shop.getSlides();
    var index = 0;
    var timer = null;

    function render() {
      if (slides.length === 0) {
        track.innerHTML =
          '<div class="promo-slide is-active" style="background:#1f2937">' +
          '<div class="promo-slide-inner">' +
          '<p class="promo-eyebrow">Spectr</p>' +
          '<h3>Add promotions in admin</h3>' +
          '<p>You can publish offers and launches from the admin panel.</p>' +
          '<a href="admin-parts.html#slides">Go to admin</a>' +
          '</div></div>';
        dots.innerHTML = "";
        return;
      }
      track.innerHTML = slides.map(function (slide, i) {
        var style = "background:" + (slide.gradient || "linear-gradient(135deg,#1f2937,#0a0c10)") + ";";
        if (slide.accent) style += "color:#ffffff;";
        return '' +
          '<div class="promo-slide ' + (i === index ? "is-active" : "") + '" style="' + style + '">' +
            '<div class="promo-slide-inner">' +
              '<p class="promo-eyebrow">' + escapeHtml(slide.eyebrow || "Offer") + '</p>' +
              '<h3>' + escapeHtml(slide.title || "") + '</h3>' +
              (slide.body ? '<p>' + escapeHtml(slide.body) + '</p>' : '') +
              (slide.cta ? '<a href="' + escapeHtml(slide.ctaHref || "#catalog") + '">' + escapeHtml(slide.cta) + '</a>' : '') +
            '</div>' +
          '</div>';
      }).join("");
      dots.innerHTML = slides.map(function (_, i) {
        return '<button type="button" class="' + (i === index ? "is-active" : "") + '" data-slide-index="' + i + '" aria-label="Promotion ' + (i + 1) + '"></button>';
      }).join("");
    }

    function goTo(i) {
      if (slides.length === 0) return;
      index = ((i % slides.length) + slides.length) % slides.length;
      var slideEls = track.querySelectorAll(".promo-slide");
      var dotEls = dots.querySelectorAll("button");
      slideEls.forEach(function (el, n) {
        el.classList.toggle("is-active", n === index);
      });
      dotEls.forEach(function (el, n) {
        el.classList.toggle("is-active", n === index);
      });
    }

    function start() {
      stop();
      timer = setInterval(function () { goTo(index + 1); }, 5500);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    dots.addEventListener("click", function (event) {
      var btn = event.target.closest("button[data-slide-index]");
      if (!btn) return;
      goTo(parseInt(btn.dataset.slideIndex, 10) || 0);
      start();
    });

    if (prev) prev.addEventListener("click", function () { goTo(index - 1); start(); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); start(); });

    track.parentElement.addEventListener("mouseenter", stop);
    track.parentElement.addEventListener("mouseleave", start);

    function refreshSlides() {
      slides = Shop.getSlides();
      index = Math.min(index, Math.max(0, slides.length - 1));
      render();
      start();
    }

    window.addEventListener("spectr-shop-change", function (event) {
      if (event.detail && event.detail.key === Shop.KEYS.slides) refreshSlides();
    });

    render();
    start();
  }

  /* ── Vehicle finder ──────────────────────────────────────── */
  function initFinder() {
    var brandSelect = $("finder-brand");
    var modelSelect = $("finder-model");
    var yearSelect = $("finder-year");
    var vinInput = $("finder-vin");
    var plateForm = $("finder-plate-form");
    var plateInput = $("finder-plate");
    var vehicleForm = $("finder-vehicle-form");
    var brandsFromDatabase = [];
    var modelsByMakeId = {};
    var modelRequestId = 0;

    if (!brandSelect || !modelSelect || !yearSelect) return;

    function populateBrands() {
      var brands = brandsFromDatabase;
      var current = brandSelect.value;
      brandSelect.innerHTML = '<option value="">Choose brand</option>' +
        brands.map(function (b) {
          return '<option value="' + escapeHtml(b.name) + '">' + escapeHtml(b.name) + '</option>';
        }).join("");
      if (current) brandSelect.value = current;
      onBrandChange();
    }

    function findBrand(name) {
      return brandsFromDatabase.find(function (b) { return b.name === name; });
    }

    function mapDatabaseMake(make) {
      return {
        databaseId: make.id,
        id: make.slug || make.name,
        name: make.name,
        slug: make.slug,
        logoText: make.logo_text,
        logoUrl: make.logo_url,
        country: make.country,
        region: make.region,
        models: []
      };
    }

    function currentBrandModels() {
      var brand = findBrand(brandSelect.value);
      return brand && Array.isArray(brand.models) ? brand.models : [];
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

    function renderModelOptions(models, selectedYear, selectedModel) {
      var compatibleModels = models.filter(function (model) {
        return modelSupportsYear(model, selectedYear);
      });

      if (!compatibleModels.length) {
        modelSelect.innerHTML = '<option value="">No supported models</option>';
        modelSelect.disabled = true;
        return;
      }

      modelSelect.disabled = false;
      modelSelect.innerHTML = '<option value="">Choose model</option>' +
        compatibleModels.map(function (m) {
          var years = m.year_from ? " (" + m.year_from + (m.year_to ? "-" + m.year_to : "-") + ")" : "";
          return '<option value="' + escapeHtml(m.name) + '"' +
            (selectedModel === m.name ? " selected" : "") + '>' +
            escapeHtml(m.name + years) +
            '</option>';
        }).join("");
    }

    function renderYearOptions(models, selectedModel, selectedYear) {
      var sourceModels = selectedModel
        ? models.filter(function (model) { return model.name === selectedModel; })
        : models;
      var years = supportedYears(sourceModels);

      if (!years.length) {
        yearSelect.innerHTML = '<option value="">No supported years</option>';
        yearSelect.disabled = true;
        return;
      }

      yearSelect.disabled = false;
      yearSelect.innerHTML = '<option value="">Choose year</option>' +
        years.map(function (year) {
          return '<option value="' + year + '"' +
            (String(selectedYear) === String(year) ? " selected" : "") + '>' +
            year +
            '</option>';
        }).join("");
    }

    function loadModelsForBrand(brand) {
      if (!brand || !brand.databaseId) return Promise.resolve([]);
      if (modelsByMakeId[brand.databaseId]) return Promise.resolve(modelsByMakeId[brand.databaseId]);

      return fetch("/api/models?make_id=" + encodeURIComponent(brand.databaseId), { headers: { Accept: "application/json" } })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.error || "Car models database unavailable.");
            modelsByMakeId[brand.databaseId] = Array.isArray(data.models) ? data.models : [];
            return modelsByMakeId[brand.databaseId];
          });
        });
    }

    function applyMakeFromUrl() {
      var params = new URLSearchParams(window.location.search);
      var requested = params.get("make");
      if (!requested) return;
      var match = brandsFromDatabase.find(function (brand) {
        return brand.slug === requested || brand.name.toLowerCase() === requested.toLowerCase();
      });
      if (!match) return;
      brandSelect.value = match.name;
      onBrandChange();
    }

    function onBrandChange() {
      var brand = findBrand(brandSelect.value);
      modelRequestId += 1;
      var requestId = modelRequestId;

      modelSelect.innerHTML = '<option value="">Choose model</option>';
      modelSelect.disabled = true;
      yearSelect.innerHTML = '<option value="">Choose year</option>';
      yearSelect.disabled = true;

      if (!brand) {
        return;
      }

      modelSelect.innerHTML = '<option value="">Loading models...</option>';
      loadModelsForBrand(brand)
        .then(function (models) {
          if (requestId !== modelRequestId) return;
          brand.models = models;
          renderModelOptions(models, "", "");
          renderYearOptions(models, "", "");
          var requestedModel = new URLSearchParams(window.location.search).get("model");
          if (requestedModel && models.some(function (model) { return model.name === requestedModel; })) {
            modelSelect.value = requestedModel;
            onModelChange();
          }
        })
        .catch(function () {
          if (requestId !== modelRequestId) return;
          modelSelect.innerHTML = '<option value="">Models unavailable</option>';
          modelSelect.disabled = true;
          yearSelect.innerHTML = '<option value="">Choose year</option>';
          yearSelect.disabled = true;
        });
    }

    function onModelChange() {
      var models = currentBrandModels();
      renderYearOptions(models, modelSelect.value, yearSelect.value);
    }

    function onYearChange() {
      var models = currentBrandModels();
      var selectedModel = modelSelect.value;
      renderModelOptions(models, yearSelect.value, selectedModel);
      if (selectedModel && !modelSelect.value) {
        renderYearOptions(models, "", yearSelect.value);
      }
    }

    brandSelect.addEventListener("change", onBrandChange);
    modelSelect.addEventListener("change", onModelChange);
    yearSelect.addEventListener("change", onYearChange);
    if (vinInput) {
      vinInput.addEventListener("input", function () {
        vinInput.value = vinInput.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 17);
      });
    }

    vehicleForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!brandSelect.value) {
        brandSelect.focus();
        return;
      }
      state.vehicle = {
        brand: brandSelect.value,
        model: modelSelect.value,
        year: yearSelect.value,
        vin: vinInput ? vinInput.value.trim().toUpperCase() : ""
      };
      state.activeCategory = null;
      renderCatalog();
      scrollToCatalog();
    });

    if (plateInput) {
      plateInput.addEventListener("input", function () {
        var raw = plateInput.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (raw.length > 2) {
          plateInput.value = raw.slice(0, 2) + " " + raw.slice(2, 7);
        } else {
          plateInput.value = raw;
        }
      });
    }

    if (plateForm) {
      plateForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var value = (plateInput.value || "").trim();
        if (!value) {
          plateInput.focus();
          return;
        }
        var pattern = /^[A-Z]{2}\s?\d{4,5}$/;
        if (!pattern.test(value.toUpperCase())) {
          plateInput.focus();
          plateInput.setCustomValidity("Use the format AB 12345");
          plateInput.reportValidity();
          setTimeout(function () { plateInput.setCustomValidity(""); }, 1500);
          return;
        }
        state.vehicle = { plate: value.toUpperCase() };
        state.activeCategory = null;
        renderCatalog();
        scrollToCatalog();
      });
    }

    brandSelect.innerHTML = '<option value="">Loading brands...</option>';
    brandSelect.disabled = true;
    fetch("/api/makes?active=1&with_models=1&limit=300", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || "Car makes database unavailable.");
          return Array.isArray(data.makes) ? data.makes : [];
        });
      })
      .then(function (makes) {
        brandsFromDatabase = makes.map(mapDatabaseMake);
        brandSelect.disabled = false;
        populateBrands();
        applyMakeFromUrl();
      })
      .catch(function () {
        brandsFromDatabase = [];
        brandSelect.innerHTML = '<option value="">No database brands available</option>';
        brandSelect.disabled = true;
        modelSelect.innerHTML = '<option value="">Choose model</option>';
        modelSelect.disabled = true;
        yearSelect.innerHTML = '<option value="">Choose year</option>';
        yearSelect.disabled = true;
      });
  }

  function scrollToCatalog() {
    var el = $("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function applyCategoryFromUrl() {
    var requested = new URLSearchParams(window.location.search).get("category");
    if (requested) state.activeCategory = requested;
  }

  function loadCatalogParts() {
    state.catalogStatus = "loading";
    renderCatalog();
    return Shop.fetchCatalogParts().then(function (parts) {
      state.catalogParts = parts;
      state.catalogStatus = "ready";
      renderCatalog();
      renderCart();
    });
  }

  /* ── Catalog grid ────────────────────────────────────────── */
  function productRank(part) {
    var stock = parseInt(part.stock, 10) || 0;
    return {
      inStock: stock > 0 ? 1 : 0,
      stock: stock,
      price: Number(part.price) || 0,
      name: String(part.name || "")
    };
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
    return '<span class="product-price">' + escapeHtml(Shop.formatNok(price)) + '</span>';
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

  function renderCatalog() {
    var grid = $("catalog-grid");
    var summary = $("catalog-summary");
    var clearBtn = $("clear-filter");
    if (!grid) return;

    if (state.catalogStatus === "loading") {
      grid.innerHTML = '<div class="catalog-empty"><strong>Loading parts from database...</strong></div>';
      if (summary) summary.textContent = "";
      return;
    }

    var allParts = state.catalogParts;
    var visibleParts = allParts;
    var availableCount = 0;

    if (state.vehicle) {
      if (state.vehicle.plate) {
        visibleParts = allParts;
      } else if (state.vehicle.brand) {
        visibleParts = Shop.partsForVehicle(allParts, {
          brand: state.vehicle.brand,
          model: state.vehicle.model
        });
      }
    }

    if (state.activeCategory && state.activeCategory !== DEALS_CATEGORY) {
      visibleParts = visibleParts.filter(function (p) { return p.category === state.activeCategory; });
    }

    availableCount = visibleParts.length;
    visibleParts = state.activeCategory === DEALS_CATEGORY
      ? dealProducts(visibleParts, DEALS_LIMIT)
      : featuredProducts(visibleParts, FEATURED_LIMIT);

    if (summary) {
      var parts = [];
      if (state.vehicle && state.vehicle.plate) {
        parts.push("Searching parts for plate " + state.vehicle.plate);
      } else if (state.vehicle && state.vehicle.brand) {
        var label = state.vehicle.brand;
        if (state.vehicle.model) label += " " + state.vehicle.model;
        if (state.vehicle.year) label += " " + state.vehicle.year;
        if (state.vehicle.vin) label += " · VIN " + state.vehicle.vin;
        parts.push("Showing parts for " + label);
      }
      if (state.activeCategory === DEALS_CATEGORY) {
        parts.push("Deals: " + DEALS_LIMIT + " best weekly picks");
      } else if (state.activeCategory) {
        parts.push("Category: " + state.activeCategory);
      }
      parts.push(visibleParts.length + " shown from " + availableCount);
      summary.textContent = parts.join(" · ");
    }

    if (clearBtn) {
      clearBtn.hidden = !state.vehicle && !state.activeCategory;
    }

    if (visibleParts.length === 0) {
      grid.innerHTML = '' +
        '<div class="catalog-empty">' +
          '<strong>' + (allParts.length === 0 ? "No parts in the catalog yet" : "No parts match your selection") + '</strong>' +
          '<span>' + (allParts.length === 0
            ? "Add parts in the admin panel to publish listings."
            : "Try another category or adjust the search.") + '</span>' +
        '</div>';
      return;
    }

    grid.innerHTML = visibleParts.map(function (part) {
      var description = previewDescription(part);
      var reviews = reviewCount(part);
      return '' +
        '<article class="product" data-product-id="' + escapeHtml(part.id) + '">' +
          productCardMedia(part) +
          '<div class="product-body">' +
            '<span class="product-category">' + categoryLabelHtml(part.category || "Car part") + '</span>' +
            continentalBadgeHtml(part) +
            '<h3 class="product-name">' + escapeHtml(part.name) + '</h3>' +
            (description ? '<p class="product-description">' + escapeHtml(description) + '</p>' : '') +
            '<span class="product-reviews">(' + escapeHtml(reviews || 0) + ' anmeldelser)</span>' +
            '<div class="product-foot">' +
              previewPriceHtml(part) +
            '</div>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  function initCatalogInteractions() {
    var grid = $("catalog-grid");
    var clearBtn = $("clear-filter");

    if (grid) {
      grid.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-add-part]");
        if (btn) {
          Shop.celebrateAddToCart(btn);
          Shop.addToCart(btn.dataset.addPart, 1);
          openCart();
          return;
        }
        var product = event.target.closest("[data-product-id]");
        if (product) {
          window.location.href = "product.html?id=" + encodeURIComponent(product.dataset.productId);
        }
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        state.vehicle = null;
        state.activeCategory = null;
        var brand = $("finder-brand");
        var model = $("finder-model");
        var year = $("finder-year");
        var vin = $("finder-vin");
        var plate = $("finder-plate");
        if (brand) brand.value = "";
        if (model) { model.innerHTML = '<option value="">Choose model</option>'; model.disabled = true; }
        if (year) { year.innerHTML = '<option value="">Choose year</option>'; year.disabled = true; }
        if (vin) vin.value = "";
        if (plate) plate.value = "";
        renderCatalog();
      });
    }
  }

  /* ── Cart drawer ─────────────────────────────────────────── */
  function findPart(id) {
    return state.catalogParts.find(function (p) { return p.id === id; });
  }

  function renderCart() {
    var body = $("cart-body");
    var total = $("cart-total");
    var count = $("cart-fab-count");
    var cart = Shop.cartForParts(state.catalogParts);

    if (count) count.textContent = Shop.cartItemCount(cart);

    if (cart.length === 0) {
      if (body) body.innerHTML = '<p class="cart-empty">Your cart is empty. Browse the catalog to add parts.</p>';
      if (total) total.textContent = Shop.formatNok(0);
      return;
    }

    var sum = 0;
    if (body) {
      body.innerHTML = cart.map(function (line) {
        var part = findPart(line.partId);
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
              '<button type="button" data-qty-dec aria-label="Minus">−</button>' +
              '<span>' + escapeHtml(line.qty) + '</span>' +
              '<button type="button" data-qty-inc aria-label="Plus">+</button>' +
              SpectrShop.cartRemoveButtonHtml() +
            '</div>' +
          '</div>';
      }).join("");
    }
    if (total) total.textContent = Shop.formatNok(sum);
  }

  function openCart() {
    var drawer = $("cart-drawer");
    var backdrop = $("cart-backdrop");
    var fab = $("cart-fab");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (backdrop) backdrop.hidden = false;
    if (fab) fab.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    var drawer = $("cart-drawer");
    var backdrop = $("cart-backdrop");
    var fab = $("cart-fab");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (backdrop) backdrop.hidden = true;
    if (fab) fab.setAttribute("aria-expanded", "false");
  }

  function initCart() {
    var fab = $("cart-fab");
    var close = $("cart-close");
    var backdrop = $("cart-backdrop");
    var body = $("cart-body");
    var checkout = $("cart-checkout");

    if (fab) fab.addEventListener("click", openCart);
    if (close) close.addEventListener("click", closeCart);
    if (backdrop) backdrop.addEventListener("click", closeCart);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeCart();
    });

    if (body) {
      body.addEventListener("click", function (event) {
        var line = event.target.closest("[data-line]");
        if (!line) return;
        var partId = line.dataset.line;
        var current = Shop.getCart().find(function (l) { return l.partId === partId; });
        if (!current) return;
        if (event.target.closest("[data-qty-inc]")) {
          Shop.updateCartQty(partId, current.qty + 1);
        } else if (event.target.closest("[data-qty-dec]")) {
          Shop.updateCartQty(partId, current.qty - 1);
        } else if (event.target.closest("[data-remove]")) {
          Shop.removeFromCart(partId);
        }
      });
    }

    if (checkout) {
      checkout.addEventListener("click", function () {
        if (Shop.getCart().length === 0) return;
        window.location.href = "checkout.html";
      });
    }
  }

  /* ── Wire reactive updates ──────────────────────────────── */
  function onStorageChange(event) {
    var key = event && event.detail && event.detail.key;
    if (!key) return;
    if (key === Shop.KEYS.brands || key === Shop.KEYS.cart) {
      renderCatalog();
      renderCart();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSlider();
    initFinder();
    applyCategoryFromUrl();
    initCatalogInteractions();
    initCart();
    loadCatalogParts();
    renderCart();
    window.addEventListener("spectr-shop-change", onStorageChange);
    window.addEventListener("storage", function (event) {
      if (!event.key || event.key.indexOf("spectr_shop_") !== 0) return;
      renderCart();
    });
  });
})();
