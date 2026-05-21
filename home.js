(function () {
  "use strict";

  var navPanel = document.getElementById("plt-nav-panel");
  var navOpenBtn = document.getElementById("plt-nav-btn");
  var navCloseBtn = document.getElementById("plt-nav-close");
  var searchPanel = document.getElementById("plt-search-panel");
  var searchOpenBtns = document.querySelectorAll("[data-plt-search-open]");
  var searchCloseBtn = document.getElementById("plt-search-close");
  var searchInput = document.getElementById("plt-search-input");
  var searchResults = document.getElementById("plt-search-results");
  var makesPromise = null;
  var partsPromise = null;
  var searchTimer = null;
  var activeIndex = -1;
  var currentResults = [];

  function openNav() {
    if (!navPanel) return;
    navPanel.classList.add("is-open");
    navPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("plt-nav-open");
    if (navOpenBtn) navOpenBtn.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    if (!navPanel) return;
    navPanel.classList.remove("is-open");
    navPanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("plt-nav-open");
    if (navOpenBtn) navOpenBtn.setAttribute("aria-expanded", "false");
  }

  function openSearch() {
    closeNav();
    if (!searchPanel) return;
    searchPanel.classList.add("is-open");
    searchPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("plt-nav-open");
    searchOpenBtns.forEach(function (btn) {
      btn.setAttribute("aria-expanded", "true");
    });
    if (searchInput) {
      window.setTimeout(function () {
        searchInput.focus();
        if (searchInput.value.trim()) runSearch(searchInput.value);
      }, 80);
    }
  }

  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.classList.remove("is-open");
    searchPanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("plt-nav-open");
    searchOpenBtns.forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  if (navOpenBtn) {
    navOpenBtn.addEventListener("click", function () {
      if (navPanel && navPanel.classList.contains("is-open")) {
        closeNav();
      } else {
        closeSearch();
        openNav();
      }
    });
  }

  if (navCloseBtn) navCloseBtn.addEventListener("click", closeNav);

  searchOpenBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (searchPanel && searchPanel.classList.contains("is-open")) closeSearch();
      else openSearch();
    });
  });

  if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeNav();
    closeSearch();
    hideResults();
  });

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initials(name) {
    return String(name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) { return word.charAt(0).toUpperCase(); })
      .join("") || "SP";
  }

  function generatedResultImage(label) {
    var text = escapeHtml(initials(label));
    return (
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">' +
          '<rect width="72" height="72" rx="18" fill="#f3f4f6"/>' +
          '<rect x="0.5" y="0.5" width="71" height="71" rx="17.5" fill="none" stroke="#d1d5db"/>' +
          '<text x="36" y="42" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#111827">' +
          text +
          "</text></svg>"
      )
    );
  }

  function partImage(part) {
    if (window.SpectrShop && window.SpectrShop.productImageUrl) {
      return window.SpectrShop.productImageUrl(part);
    }
    return (part && part.image_url) || generatedResultImage(part && part.name);
  }

  function makeImage(make) {
    return String((make && make.logo_url) || "").trim() || generatedResultImage(make && make.name);
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function loadMakes() {
    if (makesPromise) return makesPromise;
    makesPromise = fetch("/api/makes?active=1&limit=300", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) return [];
          return Array.isArray(data.makes) ? data.makes : [];
        });
      })
      .catch(function () {
        return [];
      });
    return makesPromise;
  }

  function loadParts() {
    if (partsPromise) return partsPromise;
    if (window.SpectrShop && window.SpectrShop.fetchCatalogParts) {
      partsPromise = window.SpectrShop.fetchCatalogParts();
      return partsPromise;
    }
    partsPromise = Promise.resolve([]);
    return partsPromise;
  }

  function localShopResults(query, parts) {
    var q = normalize(query);
    return (parts || [])
      .filter(function (part) {
        return normalize(part.name).indexOf(q) !== -1 ||
          normalize(part.category).indexOf(q) !== -1 ||
          normalize(part.sku).indexOf(q) !== -1;
      })
      .slice(0, 8)
      .map(function (part) {
        return {
          name: part.name,
          image: partImage(part),
          url: "index.html#catalog",
        };
      });
  }

  function makeResults(makes, query) {
    var q = normalize(query);
    return makes
      .filter(function (make) {
        return normalize(make.name).indexOf(q) !== -1 ||
          normalize(make.country).indexOf(q) !== -1 ||
          normalize(make.region).indexOf(q) !== -1;
      })
      .slice(0, 10)
      .map(function (make) {
        var href = "car-brand.html?make=" + encodeURIComponent(make.slug || make.name);
        return {
          name: make.name,
          image: makeImage(make),
          url: href,
        };
      });
  }

  function hideResults() {
    if (!searchResults) return;
    searchResults.classList.remove("is-open");
    searchResults.innerHTML = "";
    currentResults = [];
    activeIndex = -1;
    if (searchInput) {
      searchInput.setAttribute("aria-expanded", "false");
      searchInput.removeAttribute("aria-activedescendant");
    }
  }

  function setActive(index) {
    if (!searchResults || !currentResults.length) return;
    var buttons = searchResults.querySelectorAll(".plt-search-result");
    activeIndex = Math.max(0, Math.min(index, buttons.length - 1));
    buttons.forEach(function (btn, i) {
      btn.classList.toggle("is-active", i === activeIndex);
    });
    if (searchInput) searchInput.setAttribute("aria-activedescendant", "plt-result-" + activeIndex);
  }

  function goToResult(result) {
    if (!result || !result.url) return;
    window.location.href = result.url;
  }

  function renderResults(results) {
    if (!searchResults) return;
    currentResults = results;
    activeIndex = results.length ? 0 : -1;

    if (!results.length) {
      searchResults.innerHTML = '<p class="cb-search-results-empty">No matches</p>';
      searchResults.classList.add("is-open");
      return;
    }

    searchResults.innerHTML = results.map(function (result, i) {
      return (
        '<button type="button" class="cb-search-result plt-search-result' + (i === 0 ? " is-active" : "") + '" role="option" id="plt-result-' + i + '" data-index="' + i + '">' +
          '<span class="cb-search-result-media" aria-hidden="true"><img src="' + escapeHtml(result.image || generatedResultImage(result.name)) + '" alt="" loading="lazy" decoding="async"></span>' +
          '<span class="cb-search-result-name">' + escapeHtml(result.name) + '</span>' +
        '</button>'
      );
    }).join("");

    searchResults.classList.add("is-open");
    if (searchInput) {
      searchInput.setAttribute("aria-expanded", "true");
      searchInput.setAttribute("aria-activedescendant", "plt-result-0");
    }

    searchResults.querySelectorAll(".plt-search-result").forEach(function (btn) {
      btn.addEventListener("mousedown", function (event) {
        event.preventDefault();
      });
      btn.addEventListener("click", function () {
        var index = parseInt(btn.getAttribute("data-index"), 10);
        goToResult(currentResults[index]);
      });
    });
  }

  function runSearch(query) {
    var q = normalize(query);
    if (!q) {
      hideResults();
      return;
    }
    Promise.all([loadMakes(), loadParts()]).then(function (results) {
      var makes = results[0];
      var parts = results[1];
      renderResults(makeResults(makes, q).concat(localShopResults(q, parts)).slice(0, 12));
    });
  }

  if (searchInput) {
    searchInput.addEventListener("focus", function () {
      if (searchInput.value.trim()) runSearch(searchInput.value);
    });

    searchInput.addEventListener("input", function () {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        runSearch(searchInput.value);
      }, 160);
    });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        if (!currentResults.length) return;
        event.preventDefault();
        setActive(activeIndex + 1);
      } else if (event.key === "ArrowUp") {
        if (!currentResults.length) return;
        event.preventDefault();
        setActive(activeIndex - 1);
      } else if (event.key === "Enter") {
        if (!currentResults.length) return;
        event.preventDefault();
        goToResult(currentResults[activeIndex >= 0 ? activeIndex : 0]);
      }
    });
  }

  document.addEventListener("mousedown", function (event) {
    if (!searchResults || !searchInput) return;
    if (searchInput.contains(event.target) || searchResults.contains(event.target)) return;
    hideResults();
  });

  if (searchInput && searchInput.form) {
    searchInput.form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (currentResults.length) goToResult(currentResults[activeIndex >= 0 ? activeIndex : 0]);
      else runSearch(searchInput.value);
    });
  }
})();
