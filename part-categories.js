(function () {
  "use strict";

  if (!window.SpectrShop) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeSearch(value) {
    return String(value || "").trim().toLowerCase();
  }

  function categorySlug(value) {
    return String(value || "Other")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "other";
  }

  function categoryIcon(category) {
    var value = normalizeSearch(category);
    if (value.indexOf("rim") !== -1 || value.indexOf("wheel") !== -1) return "◌";
    if (value.indexOf("tyre") !== -1 || value.indexOf("tire") !== -1) return "◉";
    if (value.indexOf("oil") !== -1) return "◍";
    if (value.indexOf("brake") !== -1) return "▣";
    if (value.indexOf("filter") !== -1) return "▤";
    if (value.indexOf("suspension") !== -1) return "⌁";
    if (value.indexOf("engine") !== -1) return "⚙";
    if (value.indexOf("body") !== -1) return "▰";
    return "+";
  }

  function buildCategories(parts) {
    var byName = new Map();

    parts.forEach(function (part) {
      var name = String(part.category || "Other").trim() || "Other";
      var key = name.toLowerCase();
      var current = byName.get(key) || {
        name: name,
        count: 0,
        inStock: 0,
        examples: []
      };

      current.count += 1;
      if ((parseInt(part.stock, 10) || 0) > 0) current.inStock += 1;
      if (part.name && current.examples.length < 2) current.examples.push(part.name);
      byName.set(key, current);
    });

    return Array.from(byName.values()).sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  function filterCategories(categories, query) {
    var q = normalizeSearch(query);
    if (!q) return categories;
    return categories.filter(function (category) {
      return normalizeSearch(category.name).indexOf(q) !== -1 ||
        normalizeSearch(category.examples.join(" ")).indexOf(q) !== -1;
    });
  }

  function renderCategories(node, categories, query) {
    var filtered = filterCategories(categories, query);

    if (!filtered.length) {
      node.innerHTML = query
        ? '<p class="make-grid-status">No part categories match "' + escapeHtml(query) + '".</p>'
        : '<p class="make-grid-status">No part categories are available in the database yet.</p>';
      return;
    }

    node.innerHTML = filtered.map(function (category) {
      var href = "part-category.html?category=" + encodeURIComponent(category.name);
      var details = category.count + " part" + (category.count === 1 ? "" : "s");
      if (category.inStock) {
        details += " · " + category.inStock + " in stock";
      }
      return (
        '<a class="part-category-list-card" href="' + href + '" data-category="' + escapeHtml(categorySlug(category.name)) + '">' +
          '<span class="part-category-icon" aria-hidden="true">' + escapeHtml(categoryIcon(category.name)) + "</span>" +
          '<span class="make-name">' + escapeHtml(category.name) + "</span>" +
          '<small>' + escapeHtml(details) + "</small>" +
        "</a>"
      );
    }).join("");
  }

  function bindSearch(node, categories) {
    var input = document.getElementById("part-categories-search-input");
    var clearButton = document.getElementById("part-categories-search-clear");
    var form = input && input.form;

    if (!input) return;

    function updateGrid() {
      var query = input.value;
      renderCategories(node, categories, query);
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

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("part-categories-grid");
    if (!grid) return;

    window.SpectrShop.fetchCatalogParts()
      .then(function (parts) {
        var categories = buildCategories(Array.isArray(parts) ? parts : []);
        renderCategories(grid, categories, "");
        bindSearch(grid, categories);
      })
      .catch(function () {
        grid.innerHTML =
          '<p class="make-grid-status">Part categories are not available because the database is not connected.</p>';
      });
  });
})();
