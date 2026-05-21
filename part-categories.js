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
    if (value.indexOf("deal") !== -1) return "%";
    if (value.indexOf("tyre") !== -1 || value.indexOf("tire") !== -1) return "◉";
    if (value.indexOf("oil") !== -1) return "◍";
    if (value.indexOf("brake") !== -1) return "▣";
    if (value.indexOf("filter") !== -1) return "▤";
    if (value.indexOf("suspension") !== -1) return "⌁";
    if (value.indexOf("engine") !== -1) return "⚙";
    if (value.indexOf("body") !== -1) return "▰";
    return "+";
  }

  function fetchCategories() {
    return fetch("/api/categories?limit=600", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || "Categories database unavailable.");
          return Array.isArray(data.categories) ? data.categories : [];
        });
      });
  }

  function buildCategories(rows) {
    var byId = new Map();
    rows.forEach(function (category) {
      byId.set(category.id, category);
    });

    return rows
      .filter(function (category) {
        return Number(category.level) === 3;
      })
      .map(function (category) {
        var group = byId.get(category.parent_id);
        var section = group && byId.get(group.parent_id);
        return {
          name: category.name,
          slug: category.slug,
          icon: (section && section.icon) || categoryIcon(category.name),
          group: (group && group.name) || "",
          section: (section && section.name) || "",
          sortKey: [
            section ? String(section.sort_order).padStart(4, "0") : "9999",
            group ? String(group.sort_order).padStart(4, "0") : "9999",
            String(category.sort_order || 0).padStart(4, "0"),
            category.name
          ].join("|")
        };
      })
      .sort(function (a, b) {
        return a.sortKey.localeCompare(b.sortKey);
      });
  }

  function filterCategories(categories, query) {
    var q = normalizeSearch(query);
    if (!q) return categories;
    return categories.filter(function (category) {
      return normalizeSearch(category.name).indexOf(q) !== -1 ||
        normalizeSearch(category.group).indexOf(q) !== -1 ||
        normalizeSearch(category.section).indexOf(q) !== -1;
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
      var details = [category.section, category.group].filter(Boolean).join(" · ") || "Parts category";
      return (
        '<a class="part-category-list-card" href="' + href + '" data-category="' + escapeHtml(category.slug || categorySlug(category.name)) + '">' +
          '<span class="part-category-icon" aria-hidden="true">' + escapeHtml(category.icon || categoryIcon(category.name)) + "</span>" +
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

    fetchCategories()
      .then(function (rows) {
        var categories = buildCategories(rows);
        renderCategories(grid, categories, "");
        bindSearch(grid, categories);
      })
      .catch(function () {
        grid.innerHTML =
          '<p class="make-grid-status">Part categories are not available because the database is not connected.</p>';
      });
  });
})();
