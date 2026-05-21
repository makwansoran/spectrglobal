/* Spectr Parts — shared data + storage layer (LocalStorage based).
 * Exposes window.SpectrShop with read/write helpers used by shop.js and admin-parts.js. */
(function () {
  "use strict";

  var KEYS = {
    brands: "spectr_shop_brands_v1",
    parts: "spectr_shop_parts_v1",
    slides: "spectr_shop_slides_v1",
    cart: "spectr_shop_cart_v1",
    seeded: "spectr_shop_seeded_v1",
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

  function defaultParts() {
    return [
      {
        id: "part-brake-pads-front",
        name: "Bremseklosser foran (sett)",
        category: "Bremser",
        sku: "SP-BR-001",
        price: 749,
        stock: 32,
        description: "Keramiske bremseklosser for personbiler, lavt støvavtrykk og lang levetid.",
        vehicles: [
          { brand: "Volkswagen", model: "Golf VII", engine: "" },
          { brand: "Audi", model: "A4 B9", engine: "" }
        ]
      },
      {
        id: "part-brake-disc-front",
        name: "Bremseskive foran (par)",
        category: "Bremser",
        sku: "SP-BR-014",
        price: 1290,
        stock: 18,
        description: "Ventilerte bremseskiver med korrosjonsbeskyttelse, leveres parvis.",
        vehicles: [
          { brand: "BMW", model: "3-serie F30", engine: "320d" },
          { brand: "Volkswagen", model: "Passat B8", engine: "" }
        ]
      },
      {
        id: "part-oil-filter",
        name: "Oljefilter",
        category: "Filter",
        sku: "SP-FL-202",
        price: 119,
        stock: 124,
        description: "Originaltilpasset oljefilter for forbrennings- og hybridmotorer.",
        vehicles: [
          { brand: "Toyota", model: "RAV4 V", engine: "2.5 Hybrid" },
          { brand: "Volvo", model: "XC60 II", engine: "B4 mild hybrid" }
        ]
      },
      {
        id: "part-air-filter",
        name: "Luftfilter",
        category: "Filter",
        sku: "SP-FL-204",
        price: 199,
        stock: 86,
        description: "Høyytelses luftfilter for optimal innsugsluftkvalitet.",
        vehicles: [
          { brand: "Audi", model: "A4 B9", engine: "" },
          { brand: "BMW", model: "X3 G01", engine: "" }
        ]
      },
      {
        id: "part-spark-plug-set",
        name: "Tennpluggsett (4 stk)",
        category: "Tenning",
        sku: "SP-TN-088",
        price: 349,
        stock: 58,
        description: "Iridium tennplugger for stabil tenning og redusert forbruk.",
        vehicles: [
          { brand: "Ford", model: "Focus IV", engine: "1.0 EcoBoost" },
          { brand: "Volkswagen", model: "Golf VII", engine: "1.4 TSI" }
        ]
      },
      {
        id: "part-engine-oil-5w30",
        name: "Motorolje 5W-30 (5L)",
        category: "Olje og væsker",
        sku: "SP-OL-501",
        price: 549,
        stock: 73,
        description: "Fullsyntetisk motorolje for moderne diesel- og bensinmotorer.",
        vehicles: []
      },
      {
        id: "part-wiper-blades",
        name: "Vindusviskerblader (par)",
        category: "Eksteriør",
        sku: "SP-EK-310",
        price: 289,
        stock: 41,
        description: "Aerodynamiske flatbladsviskere med jevn renspyling.",
        vehicles: []
      },
      {
        id: "part-battery-12v-72ah",
        name: "Startbatteri 12V 72Ah",
        category: "Elektro",
        sku: "SP-EL-720",
        price: 1990,
        stock: 9,
        description: "AGM-batteri klar for start-stopp-system og elektronisk last.",
        vehicles: []
      },
      {
        id: "part-cabin-filter",
        name: "Kupéfilter med kullag",
        category: "Filter",
        sku: "SP-FL-330",
        price: 279,
        stock: 64,
        description: "Aktivt kullfilter mot pollen, sot og lukt i kupéen.",
        vehicles: [
          { brand: "Mercedes-Benz", model: "C-klasse W205", engine: "" }
        ]
      },
      {
        id: "part-shock-absorber",
        name: "Støtdemper bak",
        category: "Understell",
        sku: "SP-US-450",
        price: 1490,
        stock: 14,
        description: "Gass-trykk støtdemper, leveres enkeltvis.",
        vehicles: [
          { brand: "Volkswagen", model: "Tiguan II", engine: "" },
          { brand: "Volvo", model: "V60 II", engine: "" }
        ]
      },
      {
        id: "part-timing-belt-kit",
        name: "Registerreimsett",
        category: "Motor",
        sku: "SP-MO-820",
        price: 2790,
        stock: 6,
        description: "Komplett registerreimsett med remskiver og vannpumpe.",
        vehicles: [
          { brand: "Audi", model: "A4 B9", engine: "2.0 TDI quattro" }
        ]
      },
      {
        id: "part-tesla-cabin-filter",
        name: "Kupéfilter EV",
        category: "Filter",
        sku: "SP-FL-901",
        price: 459,
        stock: 22,
        description: "HEPA-filter for elbiler, fanger små partikler og pollen.",
        vehicles: [
          { brand: "Tesla", model: "Model 3", engine: "" },
          { brand: "Tesla", model: "Model Y", engine: "" }
        ]
      }
    ];
  }

  function defaultSlides() {
    return [
      {
        id: "slide-winter",
        eyebrow: "Vinterkampanje",
        title: "Spar opptil 30 % på bremseutstyr",
        body: "Skift bremseklosser og skiver før vinteren. Originale og likeverdige deler på lager.",
        cta: "Se bremsedeler",
        ctaHref: "#catalog",
        accent: "#0a0c10",
        gradient: "linear-gradient(135deg, #1f2937 0%, #0a0c10 70%)"
      },
      {
        id: "slide-ev",
        eyebrow: "Nyhet — Elbiler",
        title: "Bildeler for Tesla og Volvo Recharge",
        body: "Vi har utvidet sortimentet med kupéfiltre, vindusviskere og bremser for elbiler.",
        cta: "Se elbildeler",
        ctaHref: "#catalog",
        accent: "#1f6feb",
        gradient: "linear-gradient(135deg, #1f6feb 0%, #102a4a 70%)"
      },
      {
        id: "slide-service",
        eyebrow: "Servicepakke",
        title: "Servicepakke fra kr 899",
        body: "Olje, oljefilter, luftfilter og kupéfilter i én leveranse — tilpasset bilen din.",
        cta: "Bygg servicepakke",
        ctaHref: "#catalog",
        accent: "#c2410c",
        gradient: "linear-gradient(135deg, #c2410c 0%, #6b1b07 70%)"
      }
    ];
  }

  function ensureSeed() {
    if (localStorage.getItem(KEYS.seeded) === "1") return;
    if (!localStorage.getItem(KEYS.brands)) writeJSON(KEYS.brands, defaultBrands());
    if (!localStorage.getItem(KEYS.parts)) writeJSON(KEYS.parts, defaultParts());
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
    return readJSON(KEYS.slides, []);
  }

  function setSlides(list) {
    writeJSON(KEYS.slides, list || []);
  }

  function getCart() {
    return readJSON(KEYS.cart, []);
  }

  function setCart(list) {
    writeJSON(KEYS.cart, list || []);
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

  function partsForVehicle(criteria) {
    var brand = (criteria && criteria.brand) || "";
    var model = (criteria && criteria.model) || "";
    var engine = (criteria && criteria.engine) || "";
    var parts = getParts();
    if (!brand && !model && !engine) return parts;
    return parts.filter(function (part) {
      if (!part.vehicles || part.vehicles.length === 0) return false;
      return part.vehicles.some(function (fit) {
        if (brand && fit.brand !== brand) return false;
        if (model && fit.model && fit.model !== model) return false;
        if (engine && fit.engine && fit.engine !== engine) return false;
        return true;
      });
    });
  }

  function nextId(prefix) {
    return id(prefix);
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
    addToCart: addToCart,
    updateCartQty: updateCartQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    formatNok: formatNok,
    partsForVehicle: partsForVehicle,
    nextId: nextId,
    resetToDefaults: function () {
      writeJSON(KEYS.brands, defaultBrands());
      writeJSON(KEYS.parts, defaultParts());
      writeJSON(KEYS.slides, defaultSlides());
      writeJSON(KEYS.cart, []);
    }
  };
})();
