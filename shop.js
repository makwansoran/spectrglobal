/* Spectr Parts — shop landing logic.
 * Wires up vehicle finder, promo slideshow, catalog grid, and cart drawer. */
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

  function $(id) { return document.getElementById(id); }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
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
          '<p class="promo-eyebrow">Spectr Parts</p>' +
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
    var engineSelect = $("finder-engine");
    var plateForm = $("finder-plate-form");
    var plateInput = $("finder-plate");
    var vehicleForm = $("finder-vehicle-form");
    var brandsFromDatabase = [];

    if (!brandSelect || !modelSelect || !engineSelect) return;

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

    function mergeDatabaseMake(make) {
      var local = Shop.getBrands().find(function (b) { return b.name === make.name; });
      return {
        id: make.slug || make.name,
        name: make.name,
        slug: make.slug,
        logoText: make.logo_text,
        country: make.country,
        region: make.region,
        models: local ? local.models : []
      };
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
      if (!brand) {
        modelSelect.innerHTML = '<option value="">Choose model</option>';
        modelSelect.disabled = true;
        engineSelect.innerHTML = '<option value="">Choose engine</option>';
        engineSelect.disabled = true;
        return;
      }
      modelSelect.disabled = false;
      modelSelect.innerHTML = '<option value="">Choose model</option>' +
        brand.models.map(function (m) {
          return '<option value="' + escapeHtml(m.name) + '">' + escapeHtml(m.name) + '</option>';
        }).join("");
      engineSelect.innerHTML = '<option value="">Choose engine</option>';
      engineSelect.disabled = true;
    }

    function onModelChange() {
      var brand = findBrand(brandSelect.value);
      var model = brand && brand.models.find(function (m) { return m.name === modelSelect.value; });
      if (!model) {
        engineSelect.innerHTML = '<option value="">Choose engine</option>';
        engineSelect.disabled = true;
        return;
      }
      engineSelect.disabled = false;
      engineSelect.innerHTML = '<option value="">All engines</option>' +
        (model.engines || []).map(function (e) {
          return '<option value="' + escapeHtml(e) + '">' + escapeHtml(e) + '</option>';
        }).join("");
    }

    brandSelect.addEventListener("change", onBrandChange);
    modelSelect.addEventListener("change", onModelChange);

    vehicleForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!brandSelect.value) {
        brandSelect.focus();
        return;
      }
      state.vehicle = {
        brand: brandSelect.value,
        model: modelSelect.value,
        engine: engineSelect.value
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
    fetch("/api/makes?active=1&limit=300", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || "Car makes database unavailable.");
          return Array.isArray(data.makes) ? data.makes : [];
        });
      })
      .then(function (makes) {
        brandsFromDatabase = makes.map(mergeDatabaseMake);
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
        engineSelect.innerHTML = '<option value="">Choose engine</option>';
        engineSelect.disabled = true;
      });

    window.addEventListener("spectr-shop-change", function (event) {
      if (event.detail && event.detail.key === Shop.KEYS.brands) populateBrands();
    });
  }

  function scrollToCatalog() {
    var el = $("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
  function renderCatalog() {
    var grid = $("catalog-grid");
    var summary = $("catalog-summary");
    var clearBtn = $("clear-filter");
    var categoryList = $("category-list");
    if (!grid || !categoryList) return;

    if (state.catalogStatus === "loading") {
      grid.innerHTML = '<div class="catalog-empty"><strong>Loading parts from database...</strong></div>';
      if (summary) summary.textContent = "";
      categoryList.innerHTML = "";
      return;
    }

    var allParts = state.catalogParts;
    var visibleParts = allParts;

    if (state.vehicle) {
      if (state.vehicle.plate) {
        visibleParts = allParts;
      } else if (state.vehicle.brand) {
        visibleParts = Shop.partsForVehicle(allParts, {
          brand: state.vehicle.brand,
          model: state.vehicle.model,
          engine: state.vehicle.engine
        });
      }
    }

    if (state.activeCategory) {
      visibleParts = visibleParts.filter(function (p) { return p.category === state.activeCategory; });
    }

    if (summary) {
      var parts = [];
      if (state.vehicle && state.vehicle.plate) {
        parts.push("Searching parts for plate " + state.vehicle.plate);
      } else if (state.vehicle && state.vehicle.brand) {
        var label = state.vehicle.brand;
        if (state.vehicle.model) label += " " + state.vehicle.model;
        if (state.vehicle.engine) label += " · " + state.vehicle.engine;
        parts.push("Showing parts for " + label);
      }
      if (state.activeCategory) parts.push("Category: " + state.activeCategory);
      parts.push(visibleParts.length + " result" + (visibleParts.length === 1 ? "" : "s"));
      summary.textContent = parts.join(" · ");
    }

    if (clearBtn) {
      clearBtn.hidden = !state.vehicle && !state.activeCategory;
    }

    var categories = Array.from(new Set(allParts.map(function (p) { return p.category || "Other"; }))).sort();
    categoryList.innerHTML = '' +
      '<li><button type="button" class="' + (state.activeCategory == null ? "is-active" : "") + '" data-cat="">All categories <small>' + allParts.length + '</small></button></li>' +
      categories.map(function (cat) {
        var count = allParts.filter(function (p) { return (p.category || "Other") === cat; }).length;
        var active = state.activeCategory === cat ? "is-active" : "";
        return '<li><button type="button" class="' + active + '" data-cat="' + escapeHtml(cat) + '">' + escapeHtml(cat) + ' <small>' + count + '</small></button></li>';
      }).join("");

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

    var cart = Shop.getCart();
    grid.innerHTML = visibleParts.map(function (part) {
      var inCart = cart.find(function (l) { return l.partId === part.id; });
      var outOfStock = (part.stock || 0) <= 0;
      var stockLabel = outOfStock ? "Out of stock" : (part.stock || 0) + " in stock";
      return '' +
        '<article class="product">' +
          '<div class="product-image"><span>' + escapeHtml(initials(part.name)) + '</span></div>' +
          '<div class="product-body">' +
            '<span class="product-category">' + escapeHtml(part.category || "Car part") + '</span>' +
            '<h3 class="product-name">' + escapeHtml(part.name) + '</h3>' +
            '<span class="product-sku">' + escapeHtml(part.sku || part.id) + '</span>' +
            '<span class="product-stock ' + (outOfStock ? "is-out" : "") + '">' + stockLabel + '</span>' +
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

  function initCatalogInteractions() {
    var grid = $("catalog-grid");
    var categoryList = $("category-list");
    var clearBtn = $("clear-filter");

    if (grid) {
      grid.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-add-part]");
        if (!btn) return;
        Shop.addToCart(btn.dataset.addPart, 1);
        openCart();
      });
    }
    if (categoryList) {
      categoryList.addEventListener("click", function (event) {
        var btn = event.target.closest("button[data-cat]");
        if (!btn) return;
        var value = btn.dataset.cat || "";
        state.activeCategory = value || null;
        renderCatalog();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        state.vehicle = null;
        state.activeCategory = null;
        var brand = $("finder-brand");
        var model = $("finder-model");
        var engine = $("finder-engine");
        var plate = $("finder-plate");
        if (brand) brand.value = "";
        if (model) { model.innerHTML = '<option value="">Choose model</option>'; model.disabled = true; }
        if (engine) { engine.innerHTML = '<option value="">Choose engine</option>'; engine.disabled = true; }
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
    var cart = Shop.getCart();

    if (count) count.textContent = cart.reduce(function (sum, line) { return sum + (parseInt(line.qty, 10) || 0); }, 0);

    if (cart.length === 0) {
      if (body) body.innerHTML = '<p class="cart-empty">Your cart is empty. Search for your car or browse the catalog to add parts.</p>';
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
            '<div>' +
              '<h4>' + escapeHtml(part.name) + '</h4>' +
              '<small>' + escapeHtml(part.sku || part.id) + ' · ' + escapeHtml(part.category || "Car part") + '</small>' +
            '</div>' +
            '<span class="cart-line-price">' + escapeHtml(Shop.formatNok(lineTotal)) + '</span>' +
            '<div class="cart-line-controls">' +
              '<button type="button" data-qty-dec aria-label="Minus">−</button>' +
              '<span>' + escapeHtml(line.qty) + '</span>' +
              '<button type="button" data-qty-inc aria-label="Plus">+</button>' +
              '<button type="button" class="cart-line-remove" data-remove>Remove</button>' +
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
        alert("Thanks for your order! A checkout integration can be connected in the next step.");
        Shop.clearCart();
        closeCart();
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
