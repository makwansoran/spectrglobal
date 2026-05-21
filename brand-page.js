(function () {
  "use strict";

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

  function logoText(make) {
    return make.logo_text || String(make.name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase();
  }

  function selectedMakeParam() {
    return new URLSearchParams(window.location.search).get("make") || "";
  }

  function cleanVin(value) {
    return String(value || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 17);
  }

  function findMake(makes, requested) {
    var q = normalize(requested);
    return makes.find(function (make) {
      return normalize(make.slug) === q || normalize(make.name) === q;
    });
  }

  function yearsLabel(model) {
    if (!model.year_from) return "";
    return model.year_from + "-" + (model.year_to || "present");
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

  function partFitsBrand(part, make) {
    var makeName = normalize(make.name);
    return (part.vehicles || []).some(function (fit) {
      return normalize(fit.brand) === makeName;
    });
  }

  function partFitsModel(part, make, modelName) {
    if (!modelName) return partFitsBrand(part, make);
    var makeName = normalize(make.name);
    var model = normalize(modelName);
    return (part.vehicles || []).some(function (fit) {
      return normalize(fit.brand) === makeName && (!fit.model || normalize(fit.model) === model);
    });
  }

  function renderLogo(make) {
    var node = $("brand-hero-logo");
    if (!node) return;
    var logoUrl = String(make.logo_url || "").trim();
    if (!logoUrl) {
      node.textContent = logoText(make);
      return;
    }
    node.innerHTML =
      '<img src="' + escapeHtml(logoUrl) + '" alt="" loading="eager" decoding="async" ' +
      'onerror="this.remove();this.parentElement.textContent=\'' + escapeHtml(logoText(make)) + '\'">';
  }

  function renderModelCards(make, models) {
    var modelGrid = $("brand-model-grid");
    if (!modelGrid) return;
    modelGrid.innerHTML = models.length
      ? models.map(function (model) {
          return (
            '<a class="brand-model-card" href="index.html?make=' + encodeURIComponent(make.slug || make.name) +
              '&model=' + encodeURIComponent(model.name) + '#finder-vehicle-form">' +
              '<strong>' + escapeHtml(model.name) + '</strong>' +
              '<span>' + escapeHtml([model.body_type, yearsLabel(model)].filter(Boolean).join(" · ")) + '</span>' +
            '</a>'
          );
        }).join("")
      : '<p class="make-grid-status">No supported models are listed for this brand yet.</p>';
  }

  function renderPartCards(parts) {
    var partsGrid = $("brand-parts-grid");
    if (!partsGrid) return;
    $("brand-part-count").textContent = String(parts.length);

    if (!parts.length) {
      partsGrid.innerHTML =
        '<p class="make-grid-status">No compatible parts are listed for this selection yet.</p>';
      return;
    }

    partsGrid.innerHTML = parts.map(function (part) {
      return (
        '<article class="brand-part-card">' +
          '<span>' + escapeHtml(part.category || "Car part") + '</span>' +
          '<strong>' + escapeHtml(part.name) + '</strong>' +
          '<small>' + escapeHtml(part.sku || part.id) + '</small>' +
          '<em>' + escapeHtml(window.SpectrShop.formatNok(part.price || 0)) + '</em>' +
        '</article>'
      );
    }).join("");
  }

  function populateModelSelect(models, selectedYear, selectedModel) {
    var modelSelect = $("brand-model-select");
    var compatibleModels = models.filter(function (model) {
      return modelSupportsYear(model, selectedYear);
    });

    modelSelect.disabled = !compatibleModels.length;
    modelSelect.innerHTML = '<option value="">Choose model</option>' +
      compatibleModels.map(function (model) {
        return '<option value="' + escapeHtml(model.name) + '"' +
          (selectedModel === model.name ? " selected" : "") + '>' +
          escapeHtml(model.name) +
          '</option>';
      }).join("");
  }

  function bindFitForm(make, models, parts) {
    var form = $("brand-fit-form");
    var yearSelect = $("brand-year-select");
    var modelSelect = $("brand-model-select");
    var vinInput = $("brand-vin-input");
    var resetButton = $("brand-fit-reset");
    var status = $("brand-fit-status");
    var years = supportedYears(models);
    var selectedVin = "";

    if (!form || !yearSelect || !modelSelect) return;

    yearSelect.disabled = !years.length;
    yearSelect.innerHTML = '<option value="">Choose year</option>' +
      years.map(function (year) {
        return '<option value="' + year + '">' + year + '</option>';
      }).join("");
    populateModelSelect(models, "", "");

    function applySelection() {
      var selectedYear = yearSelect.value;
      var selectedModel = modelSelect.value;
      var matchedModels = models.filter(function (model) {
        if (selectedModel && model.name !== selectedModel) return false;
        return modelSupportsYear(model, selectedYear);
      });
      var matchedParts = parts.filter(function (part) {
        return partFitsModel(part, make, selectedModel);
      });

      renderModelCards(make, matchedModels);
      renderPartCards(matchedParts);
      $("brand-model-count").textContent = String(matchedModels.length);
      resetButton.hidden = !selectedYear && !selectedModel && !selectedVin;
      status.textContent = selectedModel || selectedYear || selectedVin
        ? [make.name, selectedModel, selectedYear, selectedVin && "VIN " + selectedVin].filter(Boolean).join(" ") + " selected."
        : "";
    }

    yearSelect.addEventListener("change", function () {
      populateModelSelect(models, yearSelect.value, modelSelect.value);
      if (modelSelect.value && !modelSupportsYear(
        models.find(function (model) { return model.name === modelSelect.value; }) || {},
        yearSelect.value
      )) {
        modelSelect.value = "";
      }
      applySelection();
    });

    modelSelect.addEventListener("change", applySelection);

    if (vinInput) {
      vinInput.addEventListener("input", function () {
        selectedVin = cleanVin(vinInput.value);
        vinInput.value = selectedVin;
        applySelection();
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (vinInput) {
        selectedVin = cleanVin(vinInput.value);
        vinInput.value = selectedVin;
      }
      applySelection();
    });

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        yearSelect.value = "";
        populateModelSelect(models, "", "");
        modelSelect.value = "";
        selectedVin = "";
        if (vinInput) vinInput.value = "";
        status.textContent = "";
        resetButton.hidden = true;
        $("brand-model-count").textContent = String(models.length);
        renderModelCards(make, models);
        renderPartCards(parts);
      });
    }
  }

  function renderBrand(make, models, parts) {
    document.title = make.name + " Parts | Spectr";
    $("brand-title").textContent = make.name;
    $("brand-region").textContent = [make.country, make.region].filter(Boolean).join(" · ") || "Car brand";
    $("brand-summary").textContent =
      "Browse " + models.length + " supported " + make.name + " model" + (models.length === 1 ? "" : "s") +
      " and compatible parts.";
    $("brand-model-count").textContent = String(models.length);
    renderLogo(make);
    renderModelCards(make, models);
    renderPartCards(parts);
    bindFitForm(make, models, parts);
  }

  function renderError(message) {
    $("brand-title").textContent = "Brand not found";
    $("brand-summary").textContent = message;
    $("brand-model-grid").innerHTML =
      '<p class="make-grid-status"><a href="car-brands.html">Back to all car brands</a></p>';
    $("brand-parts-grid").innerHTML = '<p class="make-grid-status">No parts to show.</p>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    var requested = selectedMakeParam();
    if (!requested) {
      renderError("Choose a car brand to continue.");
      return;
    }

    fetch("/api/makes?active=1&limit=300", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || "Car brands are unavailable.");
          return Array.isArray(data.makes) ? data.makes : [];
        });
      })
      .then(function (makes) {
        var make = findMake(makes, requested);
        if (!make) throw new Error("We could not find that car brand.");

        return Promise.all([
          Promise.resolve(make),
          fetch("/api/models?make_id=" + encodeURIComponent(make.id), { headers: { Accept: "application/json" } })
            .then(function (res) {
              return res.json().then(function (data) {
                if (!res.ok) throw new Error(data.error || "Car models are unavailable.");
                return Array.isArray(data.models) ? data.models : [];
              });
            }),
          window.SpectrShop.fetchCatalogParts(),
        ]);
      })
      .then(function (results) {
        var make = results[0];
        var models = results[1];
        var parts = results[2].filter(function (part) {
          return partFitsBrand(part, make);
        });
        renderBrand(make, models, parts);
      })
      .catch(function (err) {
        renderError(err.message || "This brand page could not be loaded.");
      });
  });
})();
