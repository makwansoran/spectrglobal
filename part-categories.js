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

  var WHEELS_TYRES_SECTION = {
    name: "Wheels & Tyres",
    slug: "wheels-tyres"
  };

  var WHEELS_TYRES_OPTIONS = [
    {
      name: "Tyres",
      slug: "tyres",
      aliases: ["tyres", "tires"],
      hrefCategory: "Tires",
      image: "assets/categories/tyres.png",
      sortOrder: 10
    },
    {
      name: "Rims",
      slug: "rims",
      aliases: ["rims", "wheels"],
      hrefCategory: "Rims",
      image: "assets/categories/rims.png",
      sortOrder: 20
    },
    {
      name: "Other",
      slug: "wheels-tyres-other",
      aliases: ["wheels-tyres-other", "wheel-accessories-tpms", "other"],
      hrefCategory: "Other",
      image: "assets/categories/wheels-other.png",
      sortOrder: 30
    }
  ];

  function categoryNameHtml(label) {
    return '<span class="make-name">' + escapeHtml(label) + "</span>";
  }

  function fallbackImage(category) {
    var value = normalizeSearch([
      category && category.name,
      category && category.group,
      category && category.section
    ].filter(Boolean).join(" "));
    var art = '<path d="M224 146h192l42 72v72H182v-72l42-72Z" fill="#f8fafc" stroke="#cfd6df" stroke-width="14" stroke-linejoin="round"/><circle cx="234" cy="302" r="34" fill="#fff" stroke="#cfd6df" stroke-width="14"/><circle cx="406" cy="302" r="34" fill="#fff" stroke="#cfd6df" stroke-width="14"/>';

    if (value.indexOf("brake") !== -1 || value.indexOf("abs") !== -1) {
      art = '<circle cx="300" cy="220" r="86" fill="#f8fafc" stroke="#cfd6df" stroke-width="18"/><circle cx="300" cy="220" r="26" fill="#fff" stroke="#cfd6df" stroke-width="12"/><path d="M388 152c38 32 52 82 34 129l-58-23c9-24 2-50-18-67l42-39Z" fill="#e7ecf3" stroke="#cfd6df" stroke-width="12" stroke-linejoin="round"/>';
    } else if (value.indexOf("oil") !== -1 || value.indexOf("fluid") !== -1 || value.indexOf("coolant") !== -1 || value.indexOf("additive") !== -1) {
      art = '<path d="M262 112h112v42l48 58v118H214V212l48-58v-42Z" fill="#f8fafc" stroke="#cfd6df" stroke-width="14" stroke-linejoin="round"/><path d="M260 250h116" stroke="#cfd6df" stroke-width="14" stroke-linecap="round"/><path d="M288 112h58" stroke="#cfd6df" stroke-width="22" stroke-linecap="round"/>';
    } else if (value.indexOf("tyre") !== -1 || value.indexOf("tire") !== -1 || value.indexOf("wheel") !== -1 || value.indexOf("rim") !== -1) {
      art = '<circle cx="320" cy="220" r="116" fill="#f8fafc" stroke="#cfd6df" stroke-width="24"/><circle cx="320" cy="220" r="58" fill="#fff" stroke="#cfd6df" stroke-width="14"/><path d="M320 162v116M262 220h116M278 178l84 84M362 178l-84 84" stroke="#cfd6df" stroke-width="10" stroke-linecap="round"/>';
    } else if (value.indexOf("filter") !== -1) {
      art = '<rect x="198" y="128" width="244" height="184" rx="24" fill="#f8fafc" stroke="#cfd6df" stroke-width="14"/><path d="M240 150v140M280 150v140M320 150v140M360 150v140M400 150v140" stroke="#cfd6df" stroke-width="10" stroke-linecap="round"/>';
    } else if (value.indexOf("spring") !== -1 || value.indexOf("shock") !== -1 || value.indexOf("strut") !== -1 || value.indexOf("suspension") !== -1) {
      art = '<path d="M320 98v244" stroke="#cfd6df" stroke-width="16" stroke-linecap="round"/><path d="M258 130c72 0 124 24 124 52s-124 28-124 56 52 52 124 52" fill="none" stroke="#cfd6df" stroke-width="16" stroke-linecap="round"/><path d="M280 96h80M280 344h80" stroke="#cfd6df" stroke-width="18" stroke-linecap="round"/>';
    } else if (value.indexOf("battery") !== -1 || value.indexOf("alternator") !== -1 || value.indexOf("starter") !== -1 || value.indexOf("fuse") !== -1 || value.indexOf("relay") !== -1 || value.indexOf("wiring") !== -1) {
      art = '<rect x="194" y="150" width="252" height="142" rx="20" fill="#f8fafc" stroke="#cfd6df" stroke-width="14"/><path d="M248 128h46M346 128h46M258 220h54M285 193v54M352 220h54" stroke="#cfd6df" stroke-width="14" stroke-linecap="round"/>';
    } else if (value.indexOf("light") !== -1 || value.indexOf("bulb") !== -1 || value.indexOf("lamp") !== -1) {
      art = '<path d="M248 198c0-52 34-92 72-92s72 40 72 92c0 34-18 58-38 78H286c-20-20-38-44-38-78Z" fill="#f8fafc" stroke="#cfd6df" stroke-width="14" stroke-linejoin="round"/><path d="M286 304h68M296 334h48M222 180h-42M460 180h-42M242 116l-30-30M398 116l30-30" stroke="#cfd6df" stroke-width="14" stroke-linecap="round"/>';
    } else if (value.indexOf("exhaust") !== -1 || value.indexOf("muffler") !== -1 || value.indexOf("catalytic") !== -1 || value.indexOf("dpf") !== -1) {
      art = '<path d="M156 232h126" stroke="#cfd6df" stroke-width="18" stroke-linecap="round"/><rect x="282" y="172" width="148" height="120" rx="52" fill="#f8fafc" stroke="#cfd6df" stroke-width="14"/><path d="M430 232h62M492 216h42M492 248h42" stroke="#cfd6df" stroke-width="18" stroke-linecap="round"/>';
    } else if (value.indexOf("wiper") !== -1 || value.indexOf("washer") !== -1) {
      art = '<path d="M168 292h304" stroke="#cfd6df" stroke-width="16" stroke-linecap="round"/><path d="M320 292l114-138" stroke="#cfd6df" stroke-width="18" stroke-linecap="round"/><path d="M410 150l64 54" stroke="#cfd6df" stroke-width="14" stroke-linecap="round"/><path d="M198 170c44-42 98-62 162-58" fill="none" stroke="#e7ecf3" stroke-width="14" stroke-linecap="round"/>';
    } else if (value.indexOf("sensor") !== -1 || value.indexOf("switch") !== -1 || value.indexOf("module") !== -1 || value.indexOf("camera") !== -1) {
      art = '<rect x="230" y="136" width="180" height="168" rx="24" fill="#f8fafc" stroke="#cfd6df" stroke-width="14"/><circle cx="320" cy="220" r="42" fill="#fff" stroke="#cfd6df" stroke-width="12"/><path d="M196 172h34M196 220h34M196 268h34M410 172h34M410 220h34M410 268h34" stroke="#cfd6df" stroke-width="12" stroke-linecap="round"/>';
    } else if (value.indexOf("seat") !== -1 || value.indexOf("interior") !== -1 || value.indexOf("airbag") !== -1 || value.indexOf("dashboard") !== -1) {
      art = '<path d="M242 120h112c30 0 46 20 40 50l-28 138H214l28-188Z" fill="#f8fafc" stroke="#cfd6df" stroke-width="14" stroke-linejoin="round"/><path d="M210 308h170l38 46" stroke="#cfd6df" stroke-width="16" stroke-linecap="round"/>';
    }

    return (
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">' +
          '<rect width="640" height="420" fill="#ffffff"/>' +
          art +
          "</svg>"
      )
    );
  }

  function categoryImageUrl(category) {
    return (category && category.image_url) || fallbackImage(category);
  }

  function wheelsTyresOption(category) {
    var key = categorySlug((category && category.slug) || (category && category.name));
    return WHEELS_TYRES_OPTIONS.find(function (option) {
      return option.aliases.indexOf(key) !== -1;
    }) || null;
  }

  function wheelsTyresCategory(option) {
    return {
      name: option.name,
      slug: option.slug,
      hrefCategory: option.hrefCategory,
      image: option.image,
      fallbackImage: fallbackImage({
        name: option.name,
        section: WHEELS_TYRES_SECTION.name
      }),
      group: "",
      section: WHEELS_TYRES_SECTION.name,
      sectionSlug: WHEELS_TYRES_SECTION.slug,
      sortKey: [
        "0070",
        String(option.sortOrder).padStart(4, "0"),
        option.name
      ].join("|")
    };
  }

  function ensureWheelsTyresOptions(categories) {
    var existing = new Set();
    var normalized = categories.map(function (category) {
      if (normalizeSearch(category.sectionSlug) !== WHEELS_TYRES_SECTION.slug) return category;
      var option = wheelsTyresOption(category);
      if (!option) return category;
      existing.add(option.slug);
      return wheelsTyresCategory(option);
    });

    WHEELS_TYRES_OPTIONS.forEach(function (option) {
      if (!existing.has(option.slug)) normalized.push(wheelsTyresCategory(option));
    });

    return normalized;
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

    return ensureWheelsTyresOptions(rows
      .filter(function (category) {
        return Number(category.level) === 2;
      })
      .map(function (category) {
        var section = byId.get(category.parent_id);
        return {
          name: category.name,
          slug: category.slug,
          image: categoryImageUrl({
            name: category.name,
            group: "",
            section: (section && section.name) || "",
            image_url: category.image_url
          }),
          fallbackImage: fallbackImage(category),
          group: "",
          section: (section && section.name) || "",
          sectionSlug: (section && section.slug) || "",
          sortKey: [
            section ? String(section.sort_order).padStart(4, "0") : "9999",
            String(category.sort_order || 0).padStart(4, "0"),
            category.name
          ].join("|")
        };
      }))
      .sort(function (a, b) {
        return a.sortKey.localeCompare(b.sortKey);
      });
  }

  function selectedSection() {
    return new URLSearchParams(window.location.search).get("section") || "";
  }

  function filterCategories(categories, query, sectionSlug) {
    var q = normalizeSearch(query);
    var section = normalizeSearch(sectionSlug);
    return categories.filter(function (category) {
      if (section && normalizeSearch(category.sectionSlug) !== section) return false;
      if (!q) return true;
      return normalizeSearch(category.name).indexOf(q) !== -1 ||
        normalizeSearch(category.group).indexOf(q) !== -1 ||
        normalizeSearch(category.section).indexOf(q) !== -1;
    });
  }

  function renderCategories(node, categories, query, sectionSlug) {
    var filtered = filterCategories(categories, query, sectionSlug);

    if (!filtered.length) {
      node.innerHTML = query
        ? '<p class="make-grid-status">No part categories match "' + escapeHtml(query) + '".</p>'
        : '<p class="make-grid-status">No part categories are available in the database yet.</p>';
      return;
    }

    node.innerHTML = filtered.map(function (category) {
      var href = "part-category.html?category=" + encodeURIComponent(category.hrefCategory || category.name);
      var details = [category.section, category.group].filter(Boolean).join(" · ") || "Parts category";
      var detailsHtml = '<small>' + escapeHtml(details) + "</small>";
      return (
        '<a class="part-category-list-card" href="' + href + '" data-category="' + escapeHtml(category.slug || categorySlug(category.name)) + '">' +
          '<img class="part-category-image" src="' + escapeHtml(category.image) + '" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'' + escapeHtml(category.fallbackImage) + '\'">' +
          '<span class="part-category-image-copy">' +
            categoryNameHtml(category.name) +
            detailsHtml +
          "</span>" +
        "</a>"
      );
    }).join("");
  }

  function bindSearch(node, categories, sectionSlug) {
    var input = document.getElementById("part-categories-search-input");
    var clearButton = document.getElementById("part-categories-search-clear");
    var form = input && input.form;

    if (!input) return;

    function updateGrid() {
      var query = input.value;
      renderCategories(node, categories, query, sectionSlug);
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

    var sectionSlug = selectedSection();

    fetchCategories()
      .then(function (rows) {
        var categories = buildCategories(rows);
        renderCategories(grid, categories, "", sectionSlug);
        bindSearch(grid, categories, sectionSlug);
      })
      .catch(function () {
        grid.innerHTML =
          '<p class="make-grid-status">Part categories are not available because the database is not connected.</p>';
      });
  });
})();
