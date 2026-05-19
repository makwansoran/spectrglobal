(function () {
  "use strict";

  var navPanel = document.getElementById("plt-nav-panel");
  var navOpenBtn = document.getElementById("plt-nav-btn");
  var navCloseBtn = document.getElementById("plt-nav-close");
  var searchPanel = document.getElementById("plt-search-panel");
  var searchOpenBtns = document.querySelectorAll("[data-plt-search-open]");
  var searchCloseBtn = document.getElementById("plt-search-close");
  var pltSearchInput = document.getElementById("plt-search-input");
  var pltSearchResults = document.getElementById("plt-search-results");
  var cbSearch = document.getElementById("cb-search");
  var cbForm = document.getElementById("cb-search-form");
  var cbResults = document.getElementById("cb-search-results");

  var globalSearchReqId = 0;
  var searchWidgets = [];

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
    if (pltSearchInput) {
      window.setTimeout(function () {
        pltSearchInput.focus();
        if (pltSearchInput.value.trim()) pltWidget.onInput();
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
      if (searchPanel && searchPanel.classList.contains("is-open")) {
        closeSearch();
      } else {
        openSearch();
      }
    });
  });

  if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);

  function hideAllResults() {
    searchWidgets.forEach(function (w) {
      w.hideResults();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeNav();
    closeSearch();
    hideAllResults();
  });

  function normalizeQuery(q) {
    return q.trim().toLowerCase();
  }

  function fetchSearchResults(query, callback) {
    var q = normalizeQuery(query);
    if (!q) {
      callback([]);
      return;
    }
    var reqId = ++globalSearchReqId;
    fetch("/api/companies?q=" + encodeURIComponent(query) + "&limit=25")
      .then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) {
            var err = new Error((data && data.error) || "API error");
            err.payload = data;
            err.status = r.status;
            throw err;
          }
          return data;
        });
      })
      .then(function (data) {
        if (reqId !== globalSearchReqId) return;
        var rows = Array.isArray(data) ? data : [];
        callback(rows, null);
      })
      .catch(function (err) {
        if (reqId !== globalSearchReqId) return;
        var message = null;
        if (err && err.status === 503 && err.payload && err.payload.hint) {
          message = "Search is not connected. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, run supabase/schema.sql, then redeploy.";
        }
        callback([], message);
      });
  }

  function highlightName(name, query) {
    if (!query) return name;
    var lower = name.toLowerCase();
    var idx = lower.indexOf(query);
    if (idx === -1) return name;
    return (
      name.slice(0, idx) +
      "<mark>" +
      name.slice(idx, idx + query.length) +
      "</mark>" +
      name.slice(idx + query.length)
    );
  }

  function goToResult(row) {
    if (!row || !row.url) return;
    window.location.href = row.url;
  }

  function resultSubtitle(row) {
    if (row.kind === "commodity") {
      return row.subtitle || row.meta || "Commodity";
    }
    if (row.kind === "waterway") {
      return row.subtitle || row.meta || "Maritime waterway";
    }
    return row.subtitle || row.ticker || row.meta || row.legalName;
  }

  function resultKindBadge(row) {
    if (row.kind === "waterway") {
      return '<span class="cb-search-kind cb-search-kind-waterway">Waterway</span>';
    }
    if (row.kind === "commodity") {
      return '<span class="cb-search-kind cb-search-kind-commodity">Commodity</span>';
    }
    return "";
  }

  function createSearchWidget(inputEl, resultsEl, options) {
    var opts = options || {};
    var idPrefix = opts.idPrefix || "search";
    var resultClass = opts.resultClass || "cb-search-result";
    var slideshowEl =
      idPrefix === "cb" ? document.getElementById("cb-hero-slideshow") : null;
    var timer = null;
    var currentResults = [];
    var activeResultIndex = -1;

    function showResults() {
      if (!resultsEl) return;
      resultsEl.classList.add("is-open");
      if (inputEl) inputEl.setAttribute("aria-expanded", "true");
      if (slideshowEl) slideshowEl.classList.add("is-hidden");
    }

    function hideResults() {
      if (!resultsEl) return;
      resultsEl.classList.remove("is-open");
      resultsEl.innerHTML = "";
      currentResults = [];
      activeResultIndex = -1;
      if (inputEl) {
        inputEl.setAttribute("aria-expanded", "false");
        inputEl.removeAttribute("aria-activedescendant");
      }
      if (slideshowEl) slideshowEl.classList.remove("is-hidden");
    }

    function renderResults(results, query, errorMessage) {
      if (!resultsEl) return;
      currentResults = results;
      activeResultIndex = results.length ? 0 : -1;
      var q = normalizeQuery(query);

      if (errorMessage) {
        resultsEl.innerHTML = '<p class="cb-search-results-empty">' + errorMessage + "</p>";
        showResults();
        return;
      }

      if (!results.length) {
        if (!q) {
          hideResults();
          return;
        }
        resultsEl.innerHTML = '<p class="cb-search-results-empty">No matches</p>';
        showResults();
        return;
      }

      resultsEl.innerHTML = results
        .map(function (company, i) {
          var active = i === activeResultIndex ? " is-active" : "";
          return (
            '<button type="button" class="' +
            resultClass +
            active +
            '" role="option" id="' +
            idPrefix +
            "-result-" +
            i +
            '" data-index="' +
            i +
            '">' +
            '<span class="cb-search-result-mark">' +
            company.initials +
            "</span>" +
            resultKindBadge(company) +
            '<span class="cb-search-result-name">' +
            highlightName(company.name, q) +
            '</span><span class="cb-search-result-sub"> · ' +
            resultSubtitle(company) +
            "</span>" +
            "</button>"
          );
        })
        .join("");

      showResults();

      if (inputEl) {
        inputEl.setAttribute("aria-activedescendant", idPrefix + "-result-0");
      }

      resultsEl.querySelectorAll("." + resultClass.split(" ")[0]).forEach(function (btn) {
        btn.addEventListener("mousedown", function (e) {
          e.preventDefault();
        });
        btn.addEventListener("click", function () {
          var idx = parseInt(btn.getAttribute("data-index"), 10);
          goToResult(currentResults[idx]);
        });
      });
    }

    function setActiveResult(index) {
      if (!resultsEl || !currentResults.length) return;
      var buttons = resultsEl.querySelectorAll("." + resultClass.split(" ")[0]);
      if (!buttons.length) return;

      activeResultIndex = Math.max(0, Math.min(index, buttons.length - 1));
      buttons.forEach(function (btn, i) {
        btn.classList.toggle("is-active", i === activeResultIndex);
      });
      if (inputEl) {
        inputEl.setAttribute("aria-activedescendant", idPrefix + "-result-" + activeResultIndex);
      }
      var activeBtn = buttons[activeResultIndex];
      if (activeBtn && activeBtn.scrollIntoView) {
        activeBtn.scrollIntoView({ block: "nearest" });
      }
    }

    function onInput() {
      if (!inputEl) return;
      var value = inputEl.value;
      var q = normalizeQuery(value);
      if (!q) {
        hideResults();
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fetchSearchResults(value, function (results, errorMessage) {
          renderResults(results, value, errorMessage);
        });
      }, 200);
    }

    function onSubmit() {
      if (!inputEl) return;
      var q = inputEl.value.trim();
      if (!q) return;
      fetchSearchResults(q, function (results) {
        if (results.length) goToResult(results[0]);
      });
    }

    if (inputEl) {
      inputEl.addEventListener("input", onInput);
      inputEl.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") {
          if (!currentResults.length) return;
          e.preventDefault();
          setActiveResult(activeResultIndex + 1);
        } else if (e.key === "ArrowUp") {
          if (!currentResults.length) return;
          e.preventDefault();
          setActiveResult(activeResultIndex - 1);
        } else if (
          e.key === "Enter" &&
          currentResults.length &&
          resultsEl &&
          resultsEl.classList.contains("is-open")
        ) {
          e.preventDefault();
          var pick = activeResultIndex >= 0 ? activeResultIndex : 0;
          goToResult(currentResults[pick]);
        } else if (e.key === "Escape") {
          hideResults();
        }
      });
    }

    return {
      onInput: onInput,
      onSubmit: onSubmit,
      hideResults: hideResults,
    };
  }

  var heroWidget = createSearchWidget(cbSearch, cbResults, { idPrefix: "cb" });
  var pltWidget = createSearchWidget(pltSearchInput, pltSearchResults, {
    idPrefix: "plt",
    resultClass: "cb-search-result plt-search-result",
  });

  searchWidgets.push(heroWidget, pltWidget);

  if (pltSearchInput && pltSearchInput.form) {
    pltSearchInput.form.addEventListener("submit", function (e) {
      e.preventDefault();
      pltWidget.onSubmit();
    });
  }

  if (cbForm) {
    cbForm.addEventListener("submit", function (e) {
      e.preventDefault();
      heroWidget.onSubmit();
    });
  }

  document.addEventListener("click", function (e) {
    var heroWrap = document.querySelector(".cb-search-wrap");
    var inHero = heroWrap && heroWrap.contains(e.target);
    var inPanel = searchPanel && searchPanel.contains(e.target);
    if (!inHero) heroWidget.hideResults();
    if (!inPanel) pltWidget.hideResults();
  });

})();
