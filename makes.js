(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function logoText(make) {
    return make.logo_text || String(make.name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase();
  }

  function logoMarkup(make) {
    var fallback = '<span class="make-logo-text">' + escapeHtml(logoText(make)) + "</span>";
    var url = String(make.logo_url || "").trim();
    if (!url) return '<span class="make-logo" aria-hidden="true">' + fallback + "</span>";

    return (
      '<span class="make-logo" aria-hidden="true">' +
        '<img src="' + escapeHtml(url) + '" alt="" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false">' +
        '<span class="make-logo-text" hidden>' + escapeHtml(logoText(make)) + "</span>" +
      "</span>"
    );
  }

  async function fetchMakes(limit) {
    var url = "/api/makes?active=1&limit=" + encodeURIComponent(String(limit || 200));
    var res = await fetch(url, { headers: { Accept: "application/json" } });
    var data = {};
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    if (!res.ok) throw new Error(data.error || "Car makes database unavailable.");
    return Array.isArray(data.makes) ? data.makes : [];
  }

  function makeHref(make) {
    return "index.html?make=" + encodeURIComponent(make.slug || make.name) + "#catalog";
  }

  function normalizeSearch(value) {
    return String(value || "").trim().toLowerCase();
  }

  function filterMakes(makes, query) {
    var q = normalizeSearch(query);
    if (!q) return makes;
    return makes.filter(function (make) {
      return normalizeSearch(make.name).indexOf(q) !== -1 ||
        normalizeSearch(make.country).indexOf(q) !== -1 ||
        normalizeSearch(make.region).indexOf(q) !== -1 ||
        normalizeSearch(make.slug).indexOf(q) !== -1;
    });
  }

  function renderTopGrid(node, makes) {
    if (!makes.length) {
      node.innerHTML = '<p class="make-grid-status">No car makes found in the database.</p>';
      return;
    }

    node.innerHTML = makes
      .map(function (make) {
        return (
          '<a class="top-brand-card" href="' + makeHref(make) + '" data-make-slug="' + escapeHtml(make.slug) + '">' +
            logoMarkup(make) +
            "<strong>" + escapeHtml(make.name) + "</strong>" +
            '<em>' + escapeHtml(make.country || make.region || "Parts catalog") + "</em>" +
          "</a>"
        );
      })
      .join("");
  }

  function renderAllGrid(node, makes, query) {
    var filteredMakes = filterMakes(makes, query);

    if (!filteredMakes.length) {
      node.innerHTML = query
        ? '<p class="make-grid-status">No car brands match "' + escapeHtml(query) + '".</p>'
        : '<p class="make-grid-status">No car makes found in the database.</p>';
      return;
    }

    node.innerHTML = filteredMakes
      .map(function (make) {
        return (
          '<a href="' + makeHref(make) + '" data-make-slug="' + escapeHtml(make.slug) + '">' +
            logoMarkup(make) +
            '<span class="make-name">' + escapeHtml(make.name) + "</span>" +
            '<small>' + escapeHtml(make.country || make.region || "") + "</small>" +
          "</a>"
        );
      })
      .join("");
  }

  function bindAllBrandSearch(node, makes) {
    var input = document.getElementById("all-brands-search-input");
    var clearButton = document.getElementById("all-brands-search-clear");
    var form = input && input.form;

    if (!input) return;

    function updateGrid() {
      var query = input.value;
      renderAllGrid(node, makes, query);
      if (clearButton) clearButton.hidden = !query;
    }

    input.addEventListener("input", updateGrid);

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        input.value = "";
        updateGrid();
        input.focus();
      });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
      });
    }
  }

  async function hydrateGrid(node, renderer, onHydrated) {
    var limit = parseInt(node.getAttribute("data-makes-limit") || "200", 10) || 200;
    try {
      var makes = await fetchMakes(limit);
      renderer(node, makes);
      if (onHydrated) onHydrated(makes);
    } catch (err) {
      node.innerHTML =
        '<p class="make-grid-status">Car makes are not available because the database is not connected.</p>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var topGrid = document.getElementById("top-brand-grid");
    var allGrid = document.getElementById("all-brands-grid");

    if (topGrid) hydrateGrid(topGrid, renderTopGrid);
    if (allGrid) hydrateGrid(allGrid, renderAllGrid, function (makes) {
      bindAllBrandSearch(allGrid, makes);
    });
  });
})();
