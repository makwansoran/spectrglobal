/* Spectr — shared data + storage layer (LocalStorage based).
 * Exposes window.SpectrShop with read/write helpers used by shop.js and admin-parts.js. */
(function () {
  "use strict";

  var KEYS = {
    brands: "spectr_shop_brands_v2",
    parts: "spectr_shop_parts_v2",
    slides: "spectr_shop_slides_v2",
    cart: "spectr_shop_cart_v2",
    seeded: "spectr_shop_seeded_v2",
  };

  function id(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10);
  }

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      var value = JSON.parse(raw);
      return value == null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent("spectr-shop-change", { detail: { key: key } }));
    } catch (e) {
      console.warn("Spectr shop: storage write failed", e);
    }
  }

  function defaultBrands() {
    return [
      {
        id: "brand-volkswagen",
        name: "Volkswagen",
        models: [
          { name: "Golf VII", engines: ["1.4 TSI", "2.0 TDI", "1.6 TDI"] },
          { name: "Passat B8", engines: ["2.0 TDI", "1.4 TSI"] },
          { name: "Tiguan II", engines: ["2.0 TDI 4Motion", "1.5 TSI"] }
        ]
      },
      {
        id: "brand-audi",
        name: "Audi",
        models: [
          { name: "A4 B9", engines: ["2.0 TDI quattro", "2.0 TFSI"] },
          { name: "Q5 FY", engines: ["2.0 TDI quattro", "55 TFSI e"] }
        ]
      },
      {
        id: "brand-bmw",
        name: "BMW",
        models: [
          { name: "3-serie F30", engines: ["320d", "330e", "318i"] },
          { name: "X3 G01", engines: ["xDrive20d", "xDrive30e"] }
        ]
      },
      {
        id: "brand-mercedes",
        name: "Mercedes-Benz",
        models: [
          { name: "C-klasse W205", engines: ["C220d", "C300e"] },
          { name: "GLC X253", engines: ["GLC220d", "GLC300e"] }
        ]
      },
      {
        id: "brand-toyota",
        name: "Toyota",
        models: [
          { name: "RAV4 V", engines: ["2.5 Hybrid", "2.5 Plug-in Hybrid"] },
          { name: "Corolla E210", engines: ["1.8 Hybrid", "2.0 Hybrid"] }
        ]
      },
      {
        id: "brand-volvo",
        name: "Volvo",
        models: [
          { name: "XC60 II", engines: ["B4 mild hybrid", "T6 Recharge"] },
          { name: "V60 II", engines: ["B4", "T8 Recharge"] }
        ]
      },
      {
        id: "brand-ford",
        name: "Ford",
        models: [
          { name: "Focus IV", engines: ["1.0 EcoBoost", "1.5 EcoBlue"] },
          { name: "Kuga III", engines: ["2.5 PHEV", "1.5 EcoBlue"] }
        ]
      },
      {
        id: "brand-tesla",
        name: "Tesla",
        models: [
          { name: "Model 3", engines: ["Standard Range+", "Long Range", "Performance"] },
          { name: "Model Y", engines: ["Long Range", "Performance"] }
        ]
      }
    ];
  }

  function defaultSlides() {
    return [
      {
        id: "slide-continental",
        eyebrow: "Continental tyres",
        title: "Engineered in Germany. Driven everywhere.",
        body: "",
        cta: "",
        ctaHref: "part-category.html?category=Tires",
        image: "assets/hero/continental-engineered-germany.png",
        imagePosition: "center",
        hideCopy: true
      },
      {
        id: "slide-winter",
        eyebrow: "Winter campaign",
        title: "Save up to 30% on brake parts",
        body: "Replace brake pads and discs before winter. OEM and equivalent parts in stock.",
        cta: "Shop brake parts",
        ctaHref: "#catalog",
        accent: "#0a0c10",
        gradient: "linear-gradient(135deg, #1f2937 0%, #0a0c10 70%)"
      },
      {
        id: "slide-ev",
        eyebrow: "New — EV parts",
        title: "Car parts for Tesla and Volvo Recharge",
        body: "We have expanded the range with cabin filters, wipers and brakes for electric vehicles.",
        cta: "Shop EV parts",
        ctaHref: "#catalog",
        accent: "#1f6feb",
        gradient: "linear-gradient(135deg, #1f6feb 0%, #102a4a 70%)"
      },
      {
        id: "slide-service",
        eyebrow: "Service kit",
        title: "Service kits from kr 899",
        body: "Oil, oil filter, air filter and cabin filter in one delivery — matched to your car.",
        cta: "Build service kit",
        ctaHref: "#catalog",
        accent: "#c2410c",
        gradient: "linear-gradient(135deg, #c2410c 0%, #6b1b07 70%)"
      }
    ];
  }

  function ensureSeed() {
    if (localStorage.getItem(KEYS.seeded) === "1") return;
    if (!localStorage.getItem(KEYS.brands)) writeJSON(KEYS.brands, defaultBrands());
    if (!localStorage.getItem(KEYS.parts)) writeJSON(KEYS.parts, []);
    if (!localStorage.getItem(KEYS.slides)) writeJSON(KEYS.slides, defaultSlides());
    if (!localStorage.getItem(KEYS.cart)) writeJSON(KEYS.cart, []);
    localStorage.setItem(KEYS.seeded, "1");
  }

  ensureSeed();

  function getBrands() {
    return readJSON(KEYS.brands, []);
  }

  function setBrands(list) {
    writeJSON(KEYS.brands, list || []);
  }

  function getParts() {
    return readJSON(KEYS.parts, []);
  }

  function setParts(list) {
    writeJSON(KEYS.parts, list || []);
  }

  function getSlides() {
    var slides = readJSON(KEYS.slides, []);
    var continentalSlide = defaultSlides()[0];
    if (!slides.some(function (slide) { return slide && slide.id === continentalSlide.id; })) {
      return [continentalSlide].concat(slides);
    }
    return slides;
  }

  function setSlides(list) {
    writeJSON(KEYS.slides, list || []);
  }

  function normalizeCart(list) {
    if (!Array.isArray(list)) return [];
    return list.reduce(function (lines, line) {
      var partId = String(line && line.partId || "").trim();
      var qty = Math.max(0, parseInt(line && line.qty, 10) || 0);
      if (!partId || qty < 1) return lines;
      lines.push({ partId: partId, qty: qty });
      return lines;
    }, []);
  }

  function cartItemCount(list) {
    return normalizeCart(list).reduce(function (sum, line) {
      return sum + line.qty;
    }, 0);
  }

  function getCart() {
    var raw = readJSON(KEYS.cart, []);
    var cart = normalizeCart(raw);
    if (JSON.stringify(raw) !== JSON.stringify(cart)) writeJSON(KEYS.cart, cart);
    return cart;
  }

  function setCart(list) {
    writeJSON(KEYS.cart, normalizeCart(list));
  }

  function cartForParts(parts) {
    var cart = getCart();
    if (!Array.isArray(parts) || parts.length === 0) return cart;
    var knownParts = parts.reduce(function (set, part) {
      if (part && part.id) set[String(part.id)] = true;
      return set;
    }, {});
    var visibleCart = cart.filter(function (line) { return knownParts[line.partId]; });
    if (visibleCart.length !== cart.length) setCart(visibleCart);
    return visibleCart;
  }

  function addToCart(partId, qty) {
    var amount = Math.max(1, parseInt(qty, 10) || 1);
    var cart = getCart();
    var existing = cart.find(function (line) { return line.partId === partId; });
    if (existing) {
      existing.qty = Math.max(1, (parseInt(existing.qty, 10) || 0) + amount);
    } else {
      cart.push({ partId: partId, qty: amount });
    }
    setCart(cart);
    return cart;
  }

  function updateCartQty(partId, qty) {
    var cart = getCart();
    var line = cart.find(function (line) { return line.partId === partId; });
    if (!line) return cart;
    var next = Math.max(0, parseInt(qty, 10) || 0);
    if (next === 0) {
      cart = cart.filter(function (l) { return l.partId !== partId; });
    } else {
      line.qty = next;
    }
    setCart(cart);
    return cart;
  }

  function removeFromCart(partId) {
    var cart = getCart().filter(function (line) { return line.partId !== partId; });
    setCart(cart);
    return cart;
  }

  function clearCart() {
    setCart([]);
  }

  function celebrateAddToCart(button) {
    var cartFab = document.getElementById("cart-fab");
    var rect = button && button.getBoundingClientRect ? button.getBoundingClientRect() : null;
    var originX = rect ? rect.left + rect.width / 2 : window.innerWidth - 80;
    var originY = rect ? rect.top + rect.height / 2 : window.innerHeight - 80;
    var burst = document.createElement("div");
    var symbols = ["✓", "+1", "★", "♥", "✓", "+1"];

    burst.className = "cart-joy-burst";
    burst.setAttribute("aria-hidden", "true");
    burst.style.left = originX + "px";
    burst.style.top = originY + "px";

    symbols.forEach(function (symbol, index) {
      var particle = document.createElement("span");
      var angle = (-70 + index * 28) * Math.PI / 180;
      var distance = 42 + (index % 3) * 14;

      particle.className = "cart-joy-particle";
      particle.textContent = symbol;
      particle.style.setProperty("--tx", Math.cos(angle) * distance + "px");
      particle.style.setProperty("--ty", Math.sin(angle) * distance - 18 + "px");
      particle.style.animationDelay = (index * 28) + "ms";
      burst.appendChild(particle);
    });

    document.body.appendChild(burst);
    window.setTimeout(function () { burst.remove(); }, 900);

    if (cartFab) {
      cartFab.classList.remove("is-celebrating");
      void cartFab.offsetWidth;
      cartFab.classList.add("is-celebrating");
      window.setTimeout(function () {
        cartFab.classList.remove("is-celebrating");
      }, 650);
    }
  }

  function formatNok(value) {
    var num = parseFloat(value);
    if (!isFinite(num)) num = 0;
    try {
      return new Intl.NumberFormat("nb-NO", {
        style: "currency",
        currency: "NOK",
        maximumFractionDigits: 0
      }).format(num);
    } catch (e) {
      return "kr " + Math.round(num);
    }
  }

  function svgText(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function compactLabel(value, max) {
    var text = String(value || "").replace(/\s+/g, " ").trim();
    if (!max || text.length <= max) return text;
    return text.slice(0, max - 1).trim() + "…";
  }

  function productVisualType(part) {
    var source = String(((part && part.category) || "") + " " + ((part && part.name) || "")).toLowerCase();
    if (source.indexOf("oil") !== -1 || source.indexOf("5w") !== -1 || source.indexOf("0w") !== -1) return "oil";
    if (source.indexOf("brake") !== -1 || source.indexOf("disc") !== -1 || source.indexOf("pad") !== -1) return "brake";
    if (source.indexOf("tire") !== -1 || source.indexOf("tyre") !== -1 || /\b\d{3}\/\d{2}\s*r\d{2}\b/i.test(source)) return "tire";
    return "part";
  }

  function generatedProductSvg(part) {
    var type = productVisualType(part || {});
    var title = compactLabel((part && part.name) || "Spectr part", 34);
    var code = compactLabel((part && (part.article_number || part.sku || part.id)) || "", 22);
    var category = compactLabel((part && part.category) || "Auto part", 20);
    var illustration = "";

    if (type === "oil") {
      illustration =
        '<g transform="translate(236 70)">' +
          '<rect x="78" y="0" width="92" height="44" rx="10" fill="#111827"/>' +
          '<path d="M52 42h144l24 72v218c0 42-30 78-72 78H98c-42 0-72-36-72-78V114L52 42Z" fill="#f8fafc" stroke="#111827" stroke-width="10"/>' +
          '<path d="M26 114h194v218c0 42-30 78-72 78H98c-42 0-72-36-72-78V114Z" fill="#ffffff"/>' +
          '<rect x="54" y="152" width="138" height="150" rx="18" fill="#f97316"/>' +
          '<text x="123" y="204" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="800" fill="#fff">SPECTR</text>' +
          '<text x="123" y="244" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="900" fill="#fff">' + svgText(compactLabel(((part && part.name) || "").match(/\b\d+w-?\d+\b/i), 8) || "OIL") + '</text>' +
        '</g>';
    } else if (type === "brake") {
      illustration =
        '<g transform="translate(184 86)">' +
          '<circle cx="176" cy="170" r="132" fill="#f8fafc" stroke="#111827" stroke-width="12"/>' +
          '<circle cx="176" cy="170" r="64" fill="#ffffff" stroke="#cbd5e1" stroke-width="12"/>' +
          '<circle cx="176" cy="170" r="18" fill="#111827"/>' +
          '<g fill="#cbd5e1">' +
            '<circle cx="176" cy="70" r="13"/><circle cx="176" cy="270" r="13"/><circle cx="76" cy="170" r="13"/><circle cx="276" cy="170" r="13"/>' +
          '</g>' +
          '<rect x="272" y="82" width="72" height="176" rx="22" fill="#f97316" stroke="#111827" stroke-width="8"/>' +
        '</g>';
    } else if (type === "tire") {
      illustration =
        '<g transform="translate(180 70)">' +
          '<circle cx="180" cy="180" r="150" fill="#111827"/>' +
          '<circle cx="180" cy="180" r="102" fill="#f8fafc"/>' +
          '<circle cx="180" cy="180" r="58" fill="#ffffff" stroke="#94a3b8" stroke-width="10"/>' +
          '<g stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".9">' +
            '<path d="M180 40v54M180 266v54M40 180h54M266 180h54M82 82l38 38M240 240l38 38M278 82l-38 38M120 240l-38 38"/>' +
          '</g>' +
        '</g>';
    } else {
      illustration =
        '<g transform="translate(210 92)">' +
          '<rect x="20" y="64" width="260" height="196" rx="34" fill="#f8fafc" stroke="#111827" stroke-width="10"/>' +
          '<path d="M78 64V36c0-20 16-36 36-36h72c20 0 36 16 36 36v28" fill="none" stroke="#111827" stroke-width="10"/>' +
          '<rect x="58" y="112" width="184" height="52" rx="14" fill="#f97316"/>' +
          '<circle cx="96" cy="216" r="18" fill="#111827"/><circle cx="204" cy="216" r="18" fill="#111827"/>' +
        '</g>';
    }

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="520" viewBox="0 0 720 520" role="img" aria-label="' + svgText(title) + '">' +
        '<rect width="720" height="520" rx="34" fill="#ffffff"/>' +
        '<rect x="18" y="18" width="684" height="484" rx="28" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>' +
        illustration +
        '<text x="360" y="438" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="27" font-weight="800" fill="#111827">' + svgText(title) + '</text>' +
        '<text x="360" y="474" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700" fill="#64748b">' + svgText([category, code].filter(Boolean).join(" · ")) + '</text>' +
      '</svg>'
    );
  }

  function productImageUrl(part) {
    if (part && part.image_url) return part.image_url;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(generatedProductSvg(part || {}));
  }

  function partsForVehicle(parts, criteria) {
    var list = Array.isArray(parts) ? parts : [];
    var brand = (criteria && criteria.brand) || "";
    var model = (criteria && criteria.model) || "";
    var engine = (criteria && criteria.engine) || "";
    if (!brand && !model && !engine) return list;
    return list.filter(function (part) {
      if (!part.vehicles || part.vehicles.length === 0) return false;
      return part.vehicles.some(function (fit) {
        if (brand && fit.brand !== brand) return false;
        if (model && fit.model && fit.model !== model) return false;
        if (engine && fit.engine && fit.engine !== engine) return false;
        return true;
      });
    });
  }

  var catalogPartsPromise = null;

  function fetchCatalogParts() {
    if (catalogPartsPromise) return catalogPartsPromise;
    catalogPartsPromise = fetch("/api/parts?active=1&limit=500", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error((data && data.error) || "Parts database unavailable.");
          return Array.isArray(data.parts) ? data.parts : [];
        });
      })
      .catch(function () {
        return [];
      });
    return catalogPartsPromise;
  }

  function resetCatalogPartsCache() {
    catalogPartsPromise = null;
  }

  function nextId(prefix) {
    return id(prefix);
  }

  function cartRemoveButtonHtml() {
    return (
      '<button type="button" class="cart-line-remove" data-remove aria-label="Remove item" title="Remove">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          '<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>' +
        '</svg>' +
      '</button>'
    );
  }

  window.SpectrShop = {
    KEYS: KEYS,
    getBrands: getBrands,
    setBrands: setBrands,
    getParts: getParts,
    setParts: setParts,
    getSlides: getSlides,
    setSlides: setSlides,
    getCart: getCart,
    setCart: setCart,
    cartForParts: cartForParts,
    cartItemCount: cartItemCount,
    addToCart: addToCart,
    updateCartQty: updateCartQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    celebrateAddToCart: celebrateAddToCart,
    formatNok: formatNok,
    productImageUrl: productImageUrl,
    partsForVehicle: partsForVehicle,
    fetchCatalogParts: fetchCatalogParts,
    resetCatalogPartsCache: resetCatalogPartsCache,
    nextId: nextId,
    cartRemoveButtonHtml: cartRemoveButtonHtml,
    resetToDefaults: function () {
      writeJSON(KEYS.brands, defaultBrands());
      writeJSON(KEYS.parts, []);
      writeJSON(KEYS.slides, defaultSlides());
      writeJSON(KEYS.cart, []);
      resetCatalogPartsCache();
    }
  };
})();
