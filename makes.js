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

  function renderTopGrid(node, makes) {
    if (!makes.length) {
      node.innerHTML = '<p class="make-grid-status">No car makes found in the database.</p>';
      return;
    }

    node.innerHTML = makes
      .map(function (make) {
        return (
          '<a class="top-brand-card" href="' + makeHref(make) + '" data-make-slug="' + escapeHtml(make.slug) + '">' +
            '<span class="make-logo" aria-hidden="true">' + escapeHtml(logoText(make)) + "</span>" +
            "<strong>" + escapeHtml(make.name) + "</strong>" +
            '<em>' + escapeHtml(make.country || make.region || "Parts catalog") + "</em>" +
          "</a>"
        );
      })
      .join("");
  }

  function renderAllGrid(node, makes) {
    if (!makes.length) {
      node.innerHTML = '<p class="make-grid-status">No car makes found in the database.</p>';
      return;
    }

    node.innerHTML = makes
      .map(function (make) {
        return (
          '<a href="' + makeHref(make) + '" data-make-slug="' + escapeHtml(make.slug) + '">' +
            '<span class="make-logo" aria-hidden="true">' + escapeHtml(logoText(make)) + "</span>" +
            '<span class="make-name">' + escapeHtml(make.name) + "</span>" +
            '<small>' + escapeHtml(make.country || make.region || "") + "</small>" +
          "</a>"
        );
      })
      .join("");
  }

  async function hydrateGrid(node, renderer) {
    var limit = parseInt(node.getAttribute("data-makes-limit") || "200", 10) || 200;
    try {
      var makes = await fetchMakes(limit);
      renderer(node, makes);
    } catch (err) {
      node.innerHTML =
        '<p class="make-grid-status">Car makes are not available because the database is not connected.</p>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var topGrid = document.getElementById("top-brand-grid");
    var allGrid = document.getElementById("all-brands-grid");

    if (topGrid) hydrateGrid(topGrid, renderTopGrid);
    if (allGrid) hydrateGrid(allGrid, renderAllGrid);
  });
})();
