/* Shared shop category subnav + sidebar (counts from parts + category DB). */
(function () {
  "use strict";

  var DEALS_LIMIT = 12;
  var DEALS_LABEL = "Deals";

  var NAV_ITEMS = [
    { key: "wheels", label: "Wheels & Tyres", icon: "◉", href: "part-categories.html?section=wheels-tyres", sectionSlug: "wheels-tyres" },
    { key: "brakes", label: "Braking", icon: "▣", href: "part-categories.html?section=braking-system", sectionSlug: "braking-system" },
    { key: "suspension", label: "Suspension", icon: "⌁", href: "part-categories.html?section=suspension-steering", sectionSlug: "suspension-steering" },
    { key: "transmission", label: "Transmission", icon: "▱", href: "part-categories.html?section=transmission-drive", sectionSlug: "transmission-drive" },
    { key: "engine", label: "Engine", icon: "⚙", href: "part-categories.html?section=engine-performance", sectionSlug: "engine-performance" },
    { key: "cooling", label: "Cooling", icon: "▤", href: "part-categories.html?section=cooling-system", sectionSlug: "cooling-system" },
    { key: "fuel-exhaust", label: "Fuel & Exhaust", icon: "◍", href: "part-categories.html?section=fuel-exhaust", sectionSlug: "fuel-exhaust" },
    { key: "body", label: "Body & Interior", icon: "▰", href: "part-categories.html?section=body-interior-accessories", sectionSlug: "body-interior-accessories" }
  ];

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

  function syncSubnav() {
    var nav = document.querySelector(".shop-subnav");
    if (!nav) return;

    nav.innerHTML = NAV_ITEMS.map(function (item) {
      return '<a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + "</a>";
    }).join("");
  }

  function countPartsByCategory(parts, categoryName) {
    var target = normalize(categoryName);
    return parts.filter(function (part) {
      return normalize(part.category) === target;
    }).length;
  }

  function countDbCategoriesBySection(categories, sectionSlug) {
    return categories.filter(function (category) {
      return category.sectionSlug === sectionSlug;
    }).length;
  }

  function itemCount(item, parts, categories) {
    if (item.partCategory) {
      var partCount = countPartsByCategory(parts, item.partCategory);
      if (partCount) return partCount;
    }
    if (item.sectionSlug) {
      return countDbCategoriesBySection(categories, item.sectionSlug);
    }
    return 0;
  }

  function buildSidebarEntries(parts, categories) {
    var allCount = categories.length;
    var dealsCount = Math.min(DEALS_LIMIT, parts.length);

    var entries = [
      {
        key: "all",
        label: "All categories",
        href: "part-categories.html",
        count: allCount
      },
      {
        key: "deals",
        label: DEALS_LABEL,
        href: "part-category.html?category=" + encodeURIComponent(DEALS_LABEL),
        count: dealsCount
      }
    ];

    NAV_ITEMS.forEach(function (item) {
      entries.push({
        key: item.key,
        label: item.label,
        href: item.href,
        count: itemCount(item, parts, categories)
      });
    });

    return entries;
  }

  function isActiveEntry(entry, activeKey, activeCategory, activeSection) {
    if (activeKey && entry.key === activeKey) return true;
    if (activeCategory && normalize(entry.label) === normalize(activeCategory)) return true;
    if (activeSection && entry.href.indexOf("section=" + encodeURIComponent(activeSection)) !== -1) return true;
    if (!activeKey && !activeCategory && !activeSection && entry.key === "all") {
      return (window.location.pathname || "").indexOf("part-categories.html") !== -1 &&
        !activeSection;
    }
    return false;
  }

  function catalogFilterValue(entry) {
    if (entry.key === "all") return "";
    if (entry.key === "deals") return "__deals";
    var navItem = NAV_ITEMS.find(function (item) { return item.key === entry.key; });
    return navItem && navItem.partCategory ? navItem.partCategory : null;
  }

  function renderSidebar(container, options) {
    if (!container) return;

    var parts = (options && options.parts) || [];
    var categories = (options && options.categories) || [];
    var activeKey = options && options.activeKey;
    var activeCategory = options && options.activeCategory;
    var activeSection = options && options.activeSection;
    var useLinks = options && options.useLinks;
    var catalogMode = options && options.catalogMode;
    var activeCatalogCategory = options && options.activeCatalogCategory;

    var entries = buildSidebarEntries(parts, categories);

    container.innerHTML = entries.map(function (entry) {
      var active = isActiveEntry(entry, activeKey, activeCategory, activeSection) ? " is-active" : "";
      var label = escapeHtml(entry.label) + " <small>" + escapeHtml(entry.count) + "</small>";
      var filterValue = catalogMode ? catalogFilterValue(entry) : null;

      if (catalogMode) {
        if (filterValue !== null) {
          if (activeCatalogCategory === filterValue || (filterValue === "" && activeCatalogCategory == null)) {
            active = " is-active";
          }
          return '<li><button type="button" class="' + active + '" data-cat="' + escapeHtml(filterValue) + '">' + label + "</button></li>";
        }
        return '<li><button type="button" class="' + active + '" data-href="' + escapeHtml(entry.href) + '">' + label + "</button></li>";
      }

      if (useLinks) {
        return '<li><a class="' + active + '" href="' + escapeHtml(entry.href) + '">' + label + "</a></li>";
      }

      return '<li><button type="button" class="' + active + '" data-sidebar-key="' + escapeHtml(entry.key) + '" data-href="' + escapeHtml(entry.href) + '">' + label + "</button></li>";
    }).join("") +
      '<li class="category-sidebar-more"><a class="category-sidebar-more-link" href="part-categories.html">More+</a></li>';

    if (!useLinks && !catalogMode) {
      container.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-href]");
        if (!button) return;
        window.location.href = button.getAttribute("data-href");
      });
    }
  }

  function enrichCategories(rows) {
    var byId = new Map();
    rows.forEach(function (category) {
      byId.set(category.id, category);
    });

    return rows
      .filter(function (category) {
        return Number(category.level) === 2;
      })
      .map(function (category) {
        var section = byId.get(category.parent_id);
        return {
          name: category.name,
          slug: category.slug,
          group: "",
          section: (section && section.name) || "",
          sectionSlug: (section && section.slug) || ""
        };
      });
  }

  function fetchCategories() {
    return fetch("/api/categories?limit=600", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || "Categories database unavailable.");
          return enrichCategories(Array.isArray(data.categories) ? data.categories : []);
        });
      });
  }

  function loadSidebarData() {
    var partsPromise = window.SpectrShop
      ? window.SpectrShop.fetchCatalogParts().catch(function () { return []; })
      : Promise.resolve([]);

    return Promise.all([fetchCategories(), partsPromise]).then(function (results) {
      return { categories: results[0], parts: results[1] || [] };
    });
  }

  function mountSidebar(containerId, options) {
    var container = document.getElementById(containerId);
    if (!container) return Promise.resolve();

    return loadSidebarData()
      .then(function (data) {
        var opts = Object.assign({}, options, data);
        renderSidebar(container, opts);
      })
      .catch(function () {
        container.innerHTML = '<li><span class="make-grid-status">Categories unavailable</span></li>';
      });
  }

  window.SpectrShopNav = {
    DEALS_LIMIT: DEALS_LIMIT,
    DEALS_LABEL: DEALS_LABEL,
    NAV_ITEMS: NAV_ITEMS,
    syncSubnav: syncSubnav,
    renderSidebar: renderSidebar,
    buildSidebarEntries: buildSidebarEntries,
    enrichCategories: enrichCategories,
    fetchCategories: fetchCategories,
    loadSidebarData: loadSidebarData,
    mountSidebar: mountSidebar
  };

  document.addEventListener("DOMContentLoaded", syncSubnav);
})();
