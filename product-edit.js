(function () {
  "use strict";

  var SESSION_KEY = "spectr_shop_customer_v1";
  var state = { product: null };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function params() {
    var search = new URLSearchParams(window.location.search);
    return {
      kind: search.get("kind") || "",
      id: search.get("id") || "",
    };
  }

  function readSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function authHeaders(extra) {
    var headers = Object.assign({ Accept: "application/json" }, extra || {});
    var session = readSession();
    if (session && session.accessToken) headers.Authorization = "Bearer " + session.accessToken;
    return headers;
  }

  async function api(path, options) {
    var res = await fetch(path, Object.assign({ headers: authHeaders() }, options || {}));
    var data = {};
    try {
      data = await res.json();
    } catch (_) {
      data = {};
    }
    if (!res.ok) {
      var message = data && data.error && typeof data.error === "object"
        ? (data.error.message || JSON.stringify(data.error))
        : data.error;
      throw new Error(message || "Request failed.");
    }
    return data;
  }

  function formatMoney(value) {
    return "€" + (Number(value) || 0).toFixed(2);
  }

  function stockLabel(stock) {
    var count = Number(stock) || 0;
    if (count <= 0) return "Out of stock";
    return count > 99 ? "99+ in stock" : count + " in stock";
  }

  function initials(name) {
    return String(name || "SP")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) { return word.charAt(0).toUpperCase(); })
      .join("") || "SP";
  }

  function toast(message, kind) {
    var node = document.querySelector(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.style.background = kind === "error" ? "#b3261e" : "#0b1726";
    requestAnimationFrame(function () { node.classList.add("is-visible"); });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { node.classList.remove("is-visible"); }, 2400);
  }

  function field(name, label, value, type, attrs) {
    return (
      '<label class="edit-field">' +
      '<span>' + escapeHtml(label) + '</span>' +
      '<input name="' + escapeHtml(name) + '" type="' + escapeHtml(type || "text") + '" value="' + escapeHtml(value == null ? "" : value) + '" ' + (attrs || "") + " />" +
      "</label>"
    );
  }

  function fileField(name, label, attrs) {
    return (
      '<label class="edit-field">' +
      '<span>' + escapeHtml(label) + '</span>' +
      '<input name="' + escapeHtml(name) + '" type="file" ' + (attrs || "") + " />" +
      "</label>"
    );
  }

  function textarea(name, label, value, attrs) {
    return (
      '<label class="edit-field edit-field-wide">' +
      '<span>' + escapeHtml(label) + '</span>' +
      '<textarea name="' + escapeHtml(name) + '" ' + (attrs || "") + ">" + escapeHtml(value == null ? "" : value) + "</textarea>" +
      "</label>"
    );
  }

  function checkbox(name, label, checked) {
    return (
      '<label class="edit-check">' +
      '<input name="' + escapeHtml(name) + '" type="checkbox"' + (checked ? " checked" : "") + " />" +
      '<span>' + escapeHtml(label) + '</span>' +
      "</label>"
    );
  }

  function select(name, label, value, options) {
    return (
      '<label class="edit-field">' +
      '<span>' + escapeHtml(label) + '</span>' +
      '<select name="' + escapeHtml(name) + '">' +
      options.map(function (option) {
        return '<option value="' + escapeHtml(option) + '"' + (String(value || "") === option ? " selected" : "") + ">" + escapeHtml(option || "Choose...") + "</option>";
      }).join("") +
      "</select>" +
      "</label>"
    );
  }

  function stringifySpecifications(specs) {
    return (Array.isArray(specs) ? specs : []).map(function (spec) {
      if (spec && typeof spec === "object") {
        return [spec.label || spec.name || "", spec.value || ""].filter(Boolean).join(": ");
      }
      return String(spec || "");
    }).filter(Boolean).join("\n");
  }

  function parseSpecifications(value) {
    return String(value || "")
      .split("\n")
      .map(function (line) { return line.trim(); })
      .filter(Boolean)
      .map(function (line) {
        var sep = line.indexOf(":");
        if (sep === -1) return { label: "Detail", value: line };
        return {
          label: line.slice(0, sep).trim(),
          value: line.slice(sep + 1).trim(),
        };
      })
      .filter(function (spec) { return spec.label && spec.value; });
  }

  function productDescription(product) {
    var e = product.editable || {};
    if (product.kind === "brake") {
      return [
        e.type === "disc" ? "Brake disc" : e.type === "pad" ? "Brake pad" : "Brake part",
        e.position ? e.position + " axle" : "",
        e.disc_diameter_mm ? e.disc_diameter_mm + "mm" : "",
        e.disc_thickness_mm ? e.disc_thickness_mm + "mm thick" : "",
        e.pad_material || "",
        e.pad_with_sensor ? "with sensor" : "",
      ].filter(Boolean).join(" · ");
    }
    if (product.kind === "oil") {
      return [e.base_type, e.viscosity, e.volume_liters ? e.volume_liters + "L" : "", (e.approvals || []).join(", ")].filter(Boolean).join(" · ");
    }
    return e.description || product.details.description || "No description yet.";
  }

  function usesGenericPrice(kind) {
    return kind === "parts" || kind === "continental-tyre" || kind === "gmp-wheel";
  }

  function usesPartsFields(kind) {
    return kind === "parts" || kind === "continental-tyre" || kind === "gmp-wheel";
  }

  function continentalBrand(product) {
    return product.brand || "Continental";
  }

  function continentalProductName(product) {
    var brand = continentalBrand(product);
    var name = String((product.editable && product.editable.name) || product.name || "").trim();
    if (name.toLowerCase().indexOf(brand.toLowerCase() + " ") === 0) {
      return name.slice(brand.length).trim();
    }
    return name === brand ? "" : name;
  }

  function renderPreview(product) {
    var e = product.editable || {};
    var image = e.image_url || product.image_url || "";
    var features = Array.isArray(e.features) ? e.features : [];
    var reviews = Array.isArray(e.reviews) ? e.reviews : [];
    var title = product.brand && String(product.name || "").toLowerCase().indexOf(String(product.brand).toLowerCase()) !== 0
      ? [product.brand, product.name].filter(Boolean).join(" ")
      : product.name;
    return (
      '<aside class="product-edit-preview">' +
      '<div class="product-edit-preview-media">' +
        (image
          ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(product.name) + '" />'
          : '<span>' + escapeHtml(initials(product.name)) + '</span>') +
      '</div>' +
      '<p class="shop-eyebrow">' + escapeHtml(product.category || product.kind) + '</p>' +
      '<h1>' + escapeHtml(title) + '</h1>' +
      '<p class="product-detail-sku">' + escapeHtml(e.article_number || product.article_number || product.sku || product.id) + '</p>' +
      '<p class="product-detail-description">' + escapeHtml(productDescription(product)) + '</p>' +
      (features.length
        ? '<ul class="product-edit-preview-features">' + features.slice(0, 5).map(function (feature) { return '<li>' + escapeHtml(feature) + '</li>'; }).join("") + '</ul>'
        : '') +
      '<div class="product-detail-buy">' +
      '<strong>' + escapeHtml(formatMoney(product.price)) + '</strong>' +
      '<span class="' + (product.stock <= 0 ? "is-out" : "") + '">' + escapeHtml(stockLabel(product.stock)) + '</span>' +
      "</div>" +
      '<div class="product-edit-preview-reviews">' +
        '<strong>' + escapeHtml(reviews.length || 0) + ' review' + (reviews.length === 1 ? '' : 's') + '</strong>' +
        '<span>Displayed on product page</span>' +
      '</div>' +
      '<p class="management-note">Preview of how this product information appears to customers.</p>' +
      "</aside>"
    );
  }

  function commonFields(product) {
    var e = product.editable || {};
    return [
      product.kind === "continental-tyre" ? "" : field("name", "Product name", e.name),
      field(usesGenericPrice(product.kind) ? "price" : "price_eur", "Price (€)", usesGenericPrice(product.kind) ? e.price : e.price_eur, "number", 'min="0" step="0.01"'),
      field("stock", "Inventory stock", e.stock, "number", 'min="0" step="1"'),
      field("article_number", "Article number", e.article_number || product.article_number || "", "text", 'placeholder="15F928"'),
      field("ean_code", "EAN code", e.ean_code || product.ean_code || "", "text", 'placeholder="400817715..."'),
      field("delivery_time", "Delivery time", e.delivery_time || product.delivery_time || "2-5 days", "text", 'placeholder="2-5 days"'),
      field("image_url", "Product image URL", e.image_url || "", "url", 'placeholder="https://..."'),
      fileField("image_file", "Upload image file", 'accept="image/*"'),
      textarea("description", "Product description", e.description || productDescription(product), 'rows="5"'),
      textarea("features", "Key features (one per line)", (e.features || []).join("\n"), 'rows="5"'),
      textarea("specifications", "Specifications (Label: value, one per line)", stringifySpecifications(e.specifications || product.specifications), 'rows="6" placeholder="SAE viscosity: 5W-30\nCapacity: 5L\nManufacturer approval: VW 504 00"'),
      textarea("reviews", "Reviews JSON", JSON.stringify(e.reviews || [], null, 2), 'rows="8" spellcheck="false"'),
      checkbox("active", "Visible on website", e.active !== false),
    ].join("");
  }

  function partsFields(product) {
    var e = product.editable || {};
    if (product.kind === "continental-tyre") {
      return (
        select("brand", "Brand name", continentalBrand(product), ["Continental"]) +
        field("product_name", "Product name", continentalProductName(product), "text", 'placeholder="PremiumContact 7"') +
        commonFields(product) +
        field("sku", "SKU", e.sku) +
        textarea("vehicles", "Compatible vehicles JSON", JSON.stringify(e.vehicles || [], null, 2), 'rows="8" spellcheck="false"')
      );
    }
    return (
      commonFields(product) +
      field("category", "Category", e.category) +
      field("sku", "SKU", e.sku) +
      textarea("vehicles", "Compatible vehicles JSON", JSON.stringify(e.vehicles || [], null, 2), 'rows="8" spellcheck="false"')
    );
  }

  function oilFields(product) {
    var e = product.editable || {};
    return (
      commonFields(product) +
      field("brand", "Brand", product.brand || "", "text", "readonly") +
      field("viscosity", "Viscosity", e.viscosity, "text", 'placeholder="5W-30"') +
      field("base_type", "Base type", e.base_type, "text", 'placeholder="Full synthetic"') +
      field("volume_liters", "Volume (liters)", e.volume_liters, "number", 'min="0" step="0.1"') +
      textarea("approvals", "Approvals (comma separated)", (e.approvals || []).join(", "), 'rows="4"')
    );
  }

  function brakeFields(product) {
    var e = product.editable || {};
    return (
      commonFields(product) +
      field("brand", "Brand", product.brand || "", "text", "readonly") +
      select("type", "Type", e.type, ["", "disc", "pad"]) +
      select("position", "Position", e.position, ["", "front", "rear"]) +
      field("ean", "EAN / SKU", e.ean) +
      '<h2 class="edit-subtitle">Disc details</h2>' +
      field("disc_diameter_mm", "Disc diameter (mm)", e.disc_diameter_mm, "number", 'min="0" step="1"') +
      field("disc_thickness_mm", "Disc thickness (mm)", e.disc_thickness_mm, "number", 'min="0" step="0.1"') +
      field("disc_min_thickness_mm", "Minimum thickness (mm)", e.disc_min_thickness_mm, "number", 'min="0" step="0.1"') +
      '<div class="edit-check-grid">' +
      checkbox("disc_ventilated", "Ventilated", e.disc_ventilated) +
      checkbox("disc_drilled", "Drilled", e.disc_drilled) +
      checkbox("disc_slotted", "Slotted", e.disc_slotted) +
      checkbox("disc_coated", "Coated", e.disc_coated) +
      "</div>" +
      '<h2 class="edit-subtitle">Pad details</h2>' +
      field("pad_height_mm", "Pad height (mm)", e.pad_height_mm, "number", 'min="0" step="0.1"') +
      field("pad_width_mm", "Pad width (mm)", e.pad_width_mm, "number", 'min="0" step="0.1"') +
      field("pad_thickness_mm", "Pad thickness (mm)", e.pad_thickness_mm, "number", 'min="0" step="0.1"') +
      field("pad_material", "Pad material", e.pad_material) +
      checkbox("pad_with_sensor", "With sensor", e.pad_with_sensor)
    );
  }

  function renderForm(product) {
    var fields = usesPartsFields(product.kind) ? partsFields(product) : product.kind === "oil" ? oilFields(product) : brakeFields(product);
    return (
      '<section class="product-edit-card">' +
      '<div class="product-edit-card-head">' +
      '<div><p class="shop-eyebrow">Edit ' + escapeHtml(product.kind) + '</p><h1>' + escapeHtml(product.name || "Product") + '</h1><p class="management-note">Changes save directly to Supabase and update the website catalog.</p></div>' +
      '<a class="table-action" href="supply.html">Back</a>' +
      "</div>" +
      '<form id="product-edit-form" class="product-edit-form">' +
      fields +
      '<div class="product-edit-actions"><button type="submit" class="btn btn-primary">Save changes</button><a class="btn btn-secondary" href="supply.html">Cancel</a></div>' +
      "</form>" +
      "</section>"
    );
  }

  function render() {
    var product = state.product;
    var shell = $("product-edit-shell");
    if (!product) {
      shell.innerHTML = '<div class="empty-state">Product not found.</div>';
      return;
    }
    document.title = "Edit " + product.name + " | Spectr";
    shell.innerHTML = renderPreview(product) + renderForm(product);
    $("product-edit-form").addEventListener("submit", save);
  }

  function imageFileDataUrl(file) {
    return new Promise(function (resolve, reject) {
      if (!file) {
        resolve("");
        return;
      }
      if (!/^image\//i.test(file.type || "")) {
        reject(new Error("Image upload must be an image file."));
        return;
      }
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || "")); };
      reader.onerror = function () { reject(new Error("Could not read image file.")); };
      reader.readAsDataURL(file);
    });
  }

  async function formPayload(form, kind) {
    var data = new FormData(form);
    var imageFile = data.get("image_file");
    var payload = {
      name: String(data.get("name") || "").trim(),
      stock: Math.max(0, parseInt(data.get("stock"), 10) || 0),
      image_url: String(data.get("image_url") || "").trim(),
      article_number: String(data.get("article_number") || "").trim(),
      ean_code: String(data.get("ean_code") || "").trim(),
      delivery_time: String(data.get("delivery_time") || "2-5 days").trim() || "2-5 days",
      description: String(data.get("description") || "").trim(),
      features: String(data.get("features") || "").split("\n").map(function (item) { return item.trim(); }).filter(Boolean),
      specifications: parseSpecifications(data.get("specifications")),
      active: data.get("active") === "on",
    };

    if (imageFile && imageFile.size > 0) {
      payload.image_url = await imageFileDataUrl(imageFile);
    }

    try {
      payload.reviews = JSON.parse(String(data.get("reviews") || "[]"));
      if (!Array.isArray(payload.reviews)) throw new Error("Reviews must be an array.");
    } catch (_) {
      throw new Error('Reviews must be valid JSON, for example [{"name":"Customer","rating":5,"text":"Great quality"}].');
    }

    if (usesGenericPrice(kind)) {
      payload.price = Math.max(0, Number(data.get("price")) || 0);
      if (kind === "continental-tyre") {
        var brand = String(data.get("brand") || "Continental").trim() || "Continental";
        var productName = String(data.get("product_name") || "").trim();
        if (!productName) throw new Error("Product name is required.");
        payload.name = [brand, productName].filter(Boolean).join(" ");
      } else {
        payload.category = String(data.get("category") || "").trim();
      }
      payload.sku = String(data.get("sku") || "").trim();
      try {
        payload.vehicles = JSON.parse(String(data.get("vehicles") || "[]"));
        if (!Array.isArray(payload.vehicles)) throw new Error("Vehicles must be an array.");
      } catch (err) {
        throw new Error("Compatible vehicles must be valid JSON array.");
      }
    } else if (kind === "oil") {
      payload.price_eur = Math.max(0, Number(data.get("price_eur")) || 0);
      payload.viscosity = String(data.get("viscosity") || "").trim();
      payload.base_type = String(data.get("base_type") || "").trim();
      payload.volume_liters = Math.max(0, Number(data.get("volume_liters")) || 0);
      payload.approvals = String(data.get("approvals") || "").split(",").map(function (item) { return item.trim(); }).filter(Boolean);
    } else {
      payload.price_eur = Math.max(0, Number(data.get("price_eur")) || 0);
      payload.type = String(data.get("type") || "").trim();
      payload.position = String(data.get("position") || "").trim();
      payload.ean = String(data.get("ean") || "").trim();
      [
        "disc_diameter_mm",
        "disc_thickness_mm",
        "disc_min_thickness_mm",
        "pad_height_mm",
        "pad_width_mm",
        "pad_thickness_mm",
      ].forEach(function (name) {
        var value = String(data.get(name) || "").trim();
        payload[name] = value === "" ? "" : Number(value);
      });
      payload.disc_ventilated = data.get("disc_ventilated") === "on";
      payload.disc_drilled = data.get("disc_drilled") === "on";
      payload.disc_slotted = data.get("disc_slotted") === "on";
      payload.disc_coated = data.get("disc_coated") === "on";
      payload.pad_material = String(data.get("pad_material") || "").trim();
      payload.pad_with_sensor = data.get("pad_with_sensor") === "on";
    }

    return payload;
  }

  async function save(event) {
    event.preventDefault();
    var product = state.product;
    var submit = event.currentTarget.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = "Saving...";
    try {
      var payload = await formPayload(event.currentTarget, product.kind);
      var data = await api("/api/admin/products/" + encodeURIComponent(product.kind) + "/" + encodeURIComponent(product.id), {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      state.product = data.product || product;
      toast("Product saved");
      render();
    } catch (err) {
      toast(err.message || "Could not save product.", "error");
    } finally {
      var btn = document.querySelector('#product-edit-form button[type="submit"]');
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Save changes";
      }
    }
  }

  async function init() {
    var p = params();
    if (!p.kind || !p.id) {
      $("product-edit-shell").innerHTML = '<div class="empty-state">Missing product kind or id.</div>';
      return;
    }
    try {
      var data = await api("/api/admin/products/" + encodeURIComponent(p.kind) + "/" + encodeURIComponent(p.id));
      state.product = data.product;
      render();
    } catch (err) {
      $("product-edit-shell").innerHTML = '<div class="empty-state"><strong>Could not load product</strong><span>' + escapeHtml(err.message) + "</span></div>";
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
