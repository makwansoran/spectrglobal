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

  function selectedMakeParam() {
    return new URLSearchParams(window.location.search).get("make") || "";
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

  function partFitsBrand(part, make) {
    var makeName = normalize(make.name);
    return (part.vehicles || []).some(function (fit) {
      return normalize(fit.brand) === makeName;
    });
  }

  function modelImageUrl(model) {
    return String(model.image_url || model.profile_image_url || model.photo_url || "").trim();
  }

  function renderModelCards(make, models) {
    var modelGrid = $("brand-model-grid");
    if (!modelGrid) return;
    modelGrid.innerHTML = models.length
      ? models.map(function (model) {
          var imageUrl = modelImageUrl(model);
          return (
            '<a class="brand-model-card" href="index.html?make=' + encodeURIComponent(make.slug || make.name) +
              '&model=' + encodeURIComponent(model.name) + '#finder-vehicle-form">' +
              '<span class="brand-model-photo">' +
                (imageUrl
                  ? '<img src="' + escapeHtml(imageUrl) + '" alt="" loading="lazy" decoding="async">'
                  : '<span class="brand-model-photo-empty" aria-hidden="true"></span>') +
              '</span>' +
              '<span class="brand-model-copy">' +
                '<strong>' + escapeHtml(model.name) + '</strong>' +
              '</span>' +
            '</a>'
          );
        }).join("")
      : '<p class="make-grid-status">No supported models are listed for this brand yet.</p>';
  }

  function updateModelScrollButtons() {
    var modelGrid = $("brand-model-grid");
    var prev = document.querySelector('[data-model-scroll="prev"]');
    var next = document.querySelector('[data-model-scroll="next"]');
    if (!modelGrid || !prev || !next) return;

    var maxScroll = Math.max(0, modelGrid.scrollWidth - modelGrid.clientWidth);
    prev.disabled = modelGrid.scrollLeft <= 1;
    next.disabled = modelGrid.scrollLeft >= maxScroll - 1;
  }

  function bindModelScroller() {
    var modelGrid = $("brand-model-grid");
    var buttons = document.querySelectorAll("[data-model-scroll]");
    if (!modelGrid || !buttons.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var direction = button.getAttribute("data-model-scroll") === "prev" ? -1 : 1;
        modelGrid.scrollBy({
          left: direction * Math.max(modelGrid.clientWidth * 0.8, 220),
          behavior: "smooth",
        });
      });
    });

    modelGrid.addEventListener("scroll", updateModelScrollButtons);
    window.addEventListener("resize", updateModelScrollButtons);
    updateModelScrollButtons();
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

  function renderBrand(make, models, parts) {
    document.title = make.name + " Parts | Spectr";
    $("brand-model-count").textContent = String(models.length);
    renderModelCards(make, models);
    updateModelScrollButtons();
    renderPartCards(parts);
  }

  function renderError(message) {
    $("brand-model-count").textContent = "0";
    $("brand-part-count").textContent = "0";
    $("brand-model-grid").innerHTML =
      '<p class="make-grid-status">' + escapeHtml(message) + ' <a href="car-brands.html">Back to all car brands</a></p>';
    $("brand-parts-grid").innerHTML = '<p class="make-grid-status">No parts to show.</p>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindModelScroller();

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
