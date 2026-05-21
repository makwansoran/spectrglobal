/* Spectr Parts admin */
(function () {
  "use strict";

  if (!window.SpectrShop) {
    console.warn("SpectrShop data layer missing — admin disabled.");
    return;
  }

  var Shop = window.SpectrShop;
  var state = {
    selectedBrandId: null,
    partFilter: ""
  };

  function $(id) { return document.getElementById(id); }
  function $$(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toast(message) {
    var node = document.querySelector(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      document.body.appendChild(node);
    }
    node.textContent = message;
    requestAnimationFrame(function () { node.classList.add("is-visible"); });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { node.classList.remove("is-visible"); }, 1800);
  }

  function setActiveTab(name) {
    $$(".admin-tabs button").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.tab === name);
    });
    $$(".admin-tab").forEach(function (panel) {
      panel.classList.toggle("is-active", panel.dataset.tabPanel === name);
    });
    if (history.replaceState) {
      history.replaceState(null, "", "#" + name);
    }
  }

  function initTabs() {
    $$(".admin-tabs button").forEach(function (btn) {
      btn.addEventListener("click", function () { setActiveTab(btn.dataset.tab); });
    });
    var hash = (location.hash || "").replace(/^#/, "");
    if (hash === "parts" || hash === "vehicles" || hash === "slides") setActiveTab(hash);
  }

  /* ── Parts ───────────────────────────────────────────────── */
  function renderCategoryOptions() {
    var datalist = $("category-options");
    if (!datalist) return;
    var categories = Array.from(new Set(Shop.getParts().map(function (p) { return p.category || ""; }).filter(Boolean))).sort();
    datalist.innerHTML = categories.map(function (c) { return '<option value="' + escapeHtml(c) + '"></option>'; }).join("");
  }

  function buildFitRow(fit) {
    var brands = Shop.getBrands();
    var brandOptions = '<option value="">— Bilmerke —</option>' + brands.map(function (b) {
      return '<option value="' + escapeHtml(b.name) + '"' + (fit && fit.brand === b.name ? " selected" : "") + '>' + escapeHtml(b.name) + '</option>';
    }).join("");

    var brand = brands.find(function (b) { return fit && b.name === fit.brand; });
    var models = brand ? brand.models : [];
    var modelOptions = '<option value="">— Modell —</option>' + models.map(function (m) {
      return '<option value="' + escapeHtml(m.name) + '"' + (fit && fit.model === m.name ? " selected" : "") + '>' + escapeHtml(m.name) + '</option>';
    }).join("");

    var model = models.find(function (m) { return fit && m.name === fit.model; });
    var engines = model ? (model.engines || []) : [];
    var engineOptions = '<option value="">— Alle motorer —</option>' + engines.map(function (e) {
      return '<option value="' + escapeHtml(e) + '"' + (fit && fit.engine === e ? " selected" : "") + '>' + escapeHtml(e) + '</option>';
    }).join("");

    var div = document.createElement("div");
    div.className = "fit-row";
    div.innerHTML =
      '<select data-fit-brand>' + brandOptions + '</select>' +
      '<select data-fit-model>' + modelOptions + '</select>' +
      '<select data-fit-engine>' + engineOptions + '</select>' +
      '<button type="button" class="fit-remove" data-fit-remove>Fjern</button>';
    return div;
  }

  function refreshFitRow(row) {
    var brandSel = row.querySelector("[data-fit-brand]");
    var modelSel = row.querySelector("[data-fit-model]");
    var engineSel = row.querySelector("[data-fit-engine]");
    var brand = Shop.getBrands().find(function (b) { return b.name === brandSel.value; });
    var models = brand ? brand.models : [];
    modelSel.innerHTML = '<option value="">— Modell —</option>' + models.map(function (m) {
      return '<option value="' + escapeHtml(m.name) + '">' + escapeHtml(m.name) + '</option>';
    }).join("");
    engineSel.innerHTML = '<option value="">— Alle motorer —</option>';
  }

  function initPartFitsEvents() {
    var container = $("part-fits");
    var addBtn = $("add-fit");
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        container.appendChild(buildFitRow(null));
      });
    }
    if (container) {
      container.addEventListener("click", function (event) {
        if (event.target.closest("[data-fit-remove]")) {
          event.target.closest(".fit-row").remove();
        }
      });
      container.addEventListener("change", function (event) {
        var row = event.target.closest(".fit-row");
        if (!row) return;
        if (event.target.matches("[data-fit-brand]")) {
          refreshFitRow(row);
        } else if (event.target.matches("[data-fit-model]")) {
          var brand = Shop.getBrands().find(function (b) { return b.name === row.querySelector("[data-fit-brand]").value; });
          var model = brand && brand.models.find(function (m) { return m.name === row.querySelector("[data-fit-model]").value; });
          var engines = model ? (model.engines || []) : [];
          row.querySelector("[data-fit-engine]").innerHTML = '<option value="">— Alle motorer —</option>' + engines.map(function (e) {
            return '<option value="' + escapeHtml(e) + '">' + escapeHtml(e) + '</option>';
          }).join("");
        }
      });
    }
  }

  function resetPartForm() {
    $("part-id").value = "";
    $("part-name").value = "";
    $("part-category").value = "";
    $("part-sku").value = "";
    $("part-price").value = "";
    $("part-stock").value = "";
    $("part-description").value = "";
    $("part-fits").innerHTML = "";
    $("parts-form-title").textContent = "Ny del";
  }

  function loadPartIntoForm(part) {
    $("part-id").value = part.id;
    $("part-name").value = part.name || "";
    $("part-category").value = part.category || "";
    $("part-sku").value = part.sku || "";
    $("part-price").value = part.price || 0;
    $("part-stock").value = part.stock || 0;
    $("part-description").value = part.description || "";
    var fits = $("part-fits");
    fits.innerHTML = "";
    (part.vehicles || []).forEach(function (fit) {
      fits.appendChild(buildFitRow(fit));
    });
    $("parts-form-title").textContent = "Rediger del";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function collectFits() {
    var rows = $$("#part-fits .fit-row");
    return rows.map(function (row) {
      return {
        brand: row.querySelector("[data-fit-brand]").value || "",
        model: row.querySelector("[data-fit-model]").value || "",
        engine: row.querySelector("[data-fit-engine]").value || ""
      };
    }).filter(function (fit) { return fit.brand || fit.model || fit.engine; });
  }

  function savePart(event) {
    event.preventDefault();
    var id = $("part-id").value || Shop.nextId("part");
    var parts = Shop.getParts();
    var existingIndex = parts.findIndex(function (p) { return p.id === id; });
    var record = {
      id: id,
      name: $("part-name").value.trim(),
      category: $("part-category").value.trim() || "Annet",
      sku: $("part-sku").value.trim(),
      price: parseFloat($("part-price").value) || 0,
      stock: parseInt($("part-stock").value, 10) || 0,
      description: $("part-description").value.trim(),
      vehicles: collectFits()
    };
    if (!record.name) { toast("Navn mangler"); return; }

    if (existingIndex >= 0) {
      parts[existingIndex] = record;
      toast("Del oppdatert");
    } else {
      parts.push(record);
      toast("Del lagt til");
    }
    Shop.setParts(parts);
    resetPartForm();
    renderPartsTable();
    renderCategoryOptions();
  }

  function renderPartsTable() {
    var tbody = document.querySelector("#parts-table tbody");
    if (!tbody) return;
    var parts = Shop.getParts();
    var filter = state.partFilter.toLowerCase();
    var filtered = filter
      ? parts.filter(function (p) {
          return [p.name, p.sku, p.category, p.description].some(function (v) {
            return (v || "").toLowerCase().indexOf(filter) >= 0;
          });
        })
      : parts;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state">Ingen deler registrert ennå.</div></td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function (part) {
      var fits = (part.vehicles || []).map(function (f) {
        var label = f.brand || "";
        if (f.model) label += " " + f.model;
        if (f.engine) label += " · " + f.engine;
        return escapeHtml(label.trim());
      }).join("<br>");
      return '' +
        '<tr data-part-id="' + escapeHtml(part.id) + '">' +
          '<td><strong>' + escapeHtml(part.name) + '</strong><br><small>' + escapeHtml(part.description || "") + '</small></td>' +
          '<td>' + escapeHtml(part.category || "Annet") + '</td>' +
          '<td>' + escapeHtml(part.sku || "") + '</td>' +
          '<td>' + escapeHtml(Shop.formatNok(part.price || 0)) + '</td>' +
          '<td>' + escapeHtml(String(part.stock || 0)) + '</td>' +
          '<td>' + (fits || '<span style="color:var(--shop-muted)">Universal</span>') + '</td>' +
          '<td><div class="row-actions">' +
            '<button type="button" data-edit-part>Rediger</button>' +
            '<button type="button" class="danger" data-delete-part>Slett</button>' +
          '</div></td>' +
        '</tr>';
    }).join("");
  }

  function initPartsTable() {
    var tbody = document.querySelector("#parts-table tbody");
    var search = $("part-search");
    if (tbody) {
      tbody.addEventListener("click", function (event) {
        var row = event.target.closest("tr[data-part-id]");
        if (!row) return;
        var partId = row.dataset.partId;
        if (event.target.closest("[data-edit-part]")) {
          var part = Shop.getParts().find(function (p) { return p.id === partId; });
          if (part) loadPartIntoForm(part);
        } else if (event.target.closest("[data-delete-part]")) {
          if (!confirm("Slette denne delen?")) return;
          Shop.setParts(Shop.getParts().filter(function (p) { return p.id !== partId; }));
          toast("Del slettet");
          renderPartsTable();
          renderCategoryOptions();
        }
      });
    }
    if (search) {
      search.addEventListener("input", function () {
        state.partFilter = search.value || "";
        renderPartsTable();
      });
    }
  }

  /* ── Vehicles ────────────────────────────────────────────── */
  function renderBrands() {
    var list = $("brand-list");
    if (!list) return;
    var brands = Shop.getBrands();
    if (brands.length === 0) {
      list.innerHTML = '<li class="empty-state">Legg til ditt første bilmerke for å komme i gang.</li>';
      hideModelPanel();
      return;
    }
    list.innerHTML = brands.map(function (b) {
      var active = state.selectedBrandId === b.id ? " is-selected" : "";
      return '' +
        '<li class="' + active.trim() + '" data-brand-id="' + escapeHtml(b.id) + '">' +
          '<div class="brand-meta">' +
            '<strong>' + escapeHtml(b.name) + '</strong>' +
            '<small>' + b.models.length + ' modeller</small>' +
          '</div>' +
          '<div class="row-actions">' +
            '<button type="button" data-edit-brand>Modeller</button>' +
            '<button type="button" data-rename-brand>Rediger</button>' +
            '<button type="button" class="danger" data-delete-brand>Slett</button>' +
          '</div>' +
        '</li>';
    }).join("");
  }

  function hideModelPanel() {
    var panel = $("model-panel");
    if (panel) panel.hidden = true;
    state.selectedBrandId = null;
    renderBrands();
  }

  function showModelPanelForBrand(brandId) {
    var brand = Shop.getBrands().find(function (b) { return b.id === brandId; });
    if (!brand) return;
    state.selectedBrandId = brandId;
    var panel = $("model-panel");
    if (!panel) return;
    panel.hidden = false;
    $("model-panel-title").textContent = "Modeller for " + brand.name;
    renderModels();
    renderBrands();
  }

  function renderModels() {
    var list = $("model-list");
    if (!list) return;
    var brand = Shop.getBrands().find(function (b) { return b.id === state.selectedBrandId; });
    if (!brand) { list.innerHTML = ""; return; }
    if (!brand.models.length) {
      list.innerHTML = '<li class="empty-state">Ingen modeller registrert ennå.</li>';
      return;
    }
    list.innerHTML = brand.models.map(function (model) {
      var engines = (model.engines || []).join(", ");
      return '' +
        '<li data-model-name="' + escapeHtml(model.name) + '">' +
          '<div class="brand-meta">' +
            '<strong>' + escapeHtml(model.name) + '</strong>' +
            '<small>' + (engines ? escapeHtml(engines) : "Ingen motorer registrert") + '</small>' +
          '</div>' +
          '<div class="row-actions">' +
            '<button type="button" data-edit-model>Rediger</button>' +
            '<button type="button" class="danger" data-delete-model>Slett</button>' +
          '</div>' +
        '</li>';
    }).join("");
  }

  function resetBrandForm() {
    $("brand-id").value = "";
    $("brand-name").value = "";
  }

  function resetModelForm() {
    $("model-original-name").value = "";
    $("model-name").value = "";
    $("model-engines").value = "";
  }

  function initVehicleEvents() {
    var brandForm = $("brand-form");
    if (brandForm) {
      brandForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var name = $("brand-name").value.trim();
        if (!name) return;
        var brands = Shop.getBrands();
        var id = $("brand-id").value;
        if (id) {
          var existing = brands.find(function (b) { return b.id === id; });
          if (!existing) return;
          existing.name = name;
          toast("Merke oppdatert");
        } else {
          if (brands.some(function (b) { return b.name.toLowerCase() === name.toLowerCase(); })) {
            toast("Merket finnes allerede");
            return;
          }
          brands.push({ id: Shop.nextId("brand"), name: name, models: [] });
          toast("Merke lagt til");
        }
        Shop.setBrands(brands);
        resetBrandForm();
        renderBrands();
      });
    }
    var brandReset = $("brand-reset");
    if (brandReset) brandReset.addEventListener("click", resetBrandForm);

    var brandList = $("brand-list");
    if (brandList) {
      brandList.addEventListener("click", function (event) {
        var li = event.target.closest("li[data-brand-id]");
        if (!li) return;
        var brandId = li.dataset.brandId;
        if (event.target.closest("[data-edit-brand]")) {
          showModelPanelForBrand(brandId);
        } else if (event.target.closest("[data-rename-brand]")) {
          var brand = Shop.getBrands().find(function (b) { return b.id === brandId; });
          if (!brand) return;
          $("brand-id").value = brand.id;
          $("brand-name").value = brand.name;
          $("brand-name").focus();
        } else if (event.target.closest("[data-delete-brand]")) {
          if (!confirm("Slette dette merket og alle modeller?")) return;
          Shop.setBrands(Shop.getBrands().filter(function (b) { return b.id !== brandId; }));
          if (state.selectedBrandId === brandId) hideModelPanel();
          toast("Merke slettet");
          renderBrands();
        }
      });
    }

    var modelForm = $("model-form");
    if (modelForm) {
      modelForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var brands = Shop.getBrands();
        var brand = brands.find(function (b) { return b.id === state.selectedBrandId; });
        if (!brand) return;
        var name = $("model-name").value.trim();
        if (!name) return;
        var engines = ($("model-engines").value || "")
          .split(",")
          .map(function (e) { return e.trim(); })
          .filter(Boolean);
        var originalName = $("model-original-name").value;
        if (originalName) {
          var model = brand.models.find(function (m) { return m.name === originalName; });
          if (!model) return;
          model.name = name;
          model.engines = engines;
          toast("Modell oppdatert");
        } else {
          if (brand.models.some(function (m) { return m.name.toLowerCase() === name.toLowerCase(); })) {
            toast("Modellen finnes allerede");
            return;
          }
          brand.models.push({ name: name, engines: engines });
          toast("Modell lagt til");
        }
        Shop.setBrands(brands);
        resetModelForm();
        renderModels();
        renderBrands();
      });
    }
    var modelReset = $("model-reset");
    if (modelReset) modelReset.addEventListener("click", resetModelForm);

    var modelList = $("model-list");
    if (modelList) {
      modelList.addEventListener("click", function (event) {
        var li = event.target.closest("li[data-model-name]");
        if (!li) return;
        var brands = Shop.getBrands();
        var brand = brands.find(function (b) { return b.id === state.selectedBrandId; });
        if (!brand) return;
        var modelName = li.dataset.modelName;
        if (event.target.closest("[data-edit-model]")) {
          var model = brand.models.find(function (m) { return m.name === modelName; });
          if (!model) return;
          $("model-original-name").value = model.name;
          $("model-name").value = model.name;
          $("model-engines").value = (model.engines || []).join(", ");
          $("model-name").focus();
        } else if (event.target.closest("[data-delete-model]")) {
          if (!confirm("Slette denne modellen?")) return;
          brand.models = brand.models.filter(function (m) { return m.name !== modelName; });
          Shop.setBrands(brands);
          toast("Modell slettet");
          renderModels();
          renderBrands();
        }
      });
    }
  }

  /* ── Slides ──────────────────────────────────────────────── */
  function resetSlideForm() {
    $("slide-id").value = "";
    $("slide-eyebrow").value = "";
    $("slide-title").value = "";
    $("slide-body").value = "";
    $("slide-cta").value = "";
    $("slide-href").value = "";
    $("slide-gradient").value = "";
    $("slide-form-title").textContent = "Ny kampanje";
  }

  function renderSlides() {
    var list = $("slide-list");
    if (!list) return;
    var slides = Shop.getSlides();
    if (slides.length === 0) {
      list.innerHTML = '<li class="empty-state">Ingen kampanjer publisert. Legg til den første over.</li>';
      return;
    }
    list.innerHTML = slides.map(function (slide) {
      return '' +
        '<li data-slide-id="' + escapeHtml(slide.id) + '">' +
          '<div class="slide-meta">' +
            '<strong>' + escapeHtml(slide.title || "Uten tittel") + '</strong>' +
            '<small>' + escapeHtml(slide.eyebrow || "") + (slide.cta ? " · " + escapeHtml(slide.cta) : "") + '</small>' +
          '</div>' +
          '<div class="row-actions">' +
            '<button type="button" data-edit-slide>Rediger</button>' +
            '<button type="button" class="danger" data-delete-slide>Slett</button>' +
          '</div>' +
        '</li>';
    }).join("");
  }

  function initSlideEvents() {
    var form = $("slide-form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var slides = Shop.getSlides();
        var id = $("slide-id").value || Shop.nextId("slide");
        var record = {
          id: id,
          eyebrow: $("slide-eyebrow").value.trim(),
          title: $("slide-title").value.trim(),
          body: $("slide-body").value.trim(),
          cta: $("slide-cta").value.trim(),
          ctaHref: $("slide-href").value.trim() || "#catalog",
          gradient: $("slide-gradient").value.trim() || ""
        };
        if (!record.title) { toast("Tittel mangler"); return; }
        var idx = slides.findIndex(function (s) { return s.id === id; });
        if (idx >= 0) {
          slides[idx] = record;
          toast("Kampanje oppdatert");
        } else {
          slides.push(record);
          toast("Kampanje lagt til");
        }
        Shop.setSlides(slides);
        resetSlideForm();
        renderSlides();
      });
    }
    var reset = $("slide-reset");
    if (reset) reset.addEventListener("click", resetSlideForm);
    var list = $("slide-list");
    if (list) {
      list.addEventListener("click", function (event) {
        var li = event.target.closest("li[data-slide-id]");
        if (!li) return;
        var slides = Shop.getSlides();
        var slide = slides.find(function (s) { return s.id === li.dataset.slideId; });
        if (!slide) return;
        if (event.target.closest("[data-edit-slide]")) {
          $("slide-id").value = slide.id;
          $("slide-eyebrow").value = slide.eyebrow || "";
          $("slide-title").value = slide.title || "";
          $("slide-body").value = slide.body || "";
          $("slide-cta").value = slide.cta || "";
          $("slide-href").value = slide.ctaHref || "";
          $("slide-gradient").value = slide.gradient || "";
          $("slide-form-title").textContent = "Rediger kampanje";
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (event.target.closest("[data-delete-slide]")) {
          if (!confirm("Slette denne kampanjen?")) return;
          Shop.setSlides(Shop.getSlides().filter(function (s) { return s.id !== slide.id; }));
          toast("Kampanje slettet");
          renderSlides();
        }
      });
    }
  }

  /* ── Header actions ──────────────────────────────────────── */
  function initHeaderActions() {
    var exportBtn = $("export-data");
    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        var payload = {
          brands: Shop.getBrands(),
          parts: Shop.getParts(),
          slides: Shop.getSlides()
        };
        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "spectr-parts-katalog.json";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        toast("Eksport lastet ned");
      });
    }
    var resetBtn = $("reset-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (!confirm("Tilbakestille deler, biler og kampanjer til standardinnholdet?")) return;
        Shop.resetToDefaults();
        renderEverything();
        toast("Dataene er tilbakestilt");
      });
    }
  }

  function renderEverything() {
    renderCategoryOptions();
    renderPartsTable();
    renderBrands();
    renderModels();
    renderSlides();
    // refresh footer year if needed
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTabs();
    initPartFitsEvents();
    initPartsTable();
    initVehicleEvents();
    initSlideEvents();
    initHeaderActions();
    renderEverything();

    var partForm = $("part-form");
    if (partForm) partForm.addEventListener("submit", savePart);
    var partReset = $("part-reset");
    if (partReset) partReset.addEventListener("click", resetPartForm);

    window.addEventListener("spectr-shop-change", renderEverything);
    window.addEventListener("storage", function (event) {
      if (event.key && event.key.indexOf("spectr_shop_") === 0) renderEverything();
    });
  });
})();
