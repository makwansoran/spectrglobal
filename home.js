(function () {
  "use strict";

  var navPanel = document.getElementById("plt-nav-panel");
  var navOpenBtn = document.getElementById("plt-nav-btn");
  var navCloseBtn = document.getElementById("plt-nav-close");
  var searchPanel = document.getElementById("plt-search-panel");
  var searchOpenBtns = document.querySelectorAll("[data-plt-search-open]");
  var searchCloseBtn = document.getElementById("plt-search-close");
  var searchInput = document.getElementById("plt-search-input");
  var cbSearch = document.getElementById("cb-search");
  var cbForm = document.getElementById("cb-search-form");
  var cbResults = document.getElementById("cb-search-results");

  var searchTimer = null;
  var searchRequestId = 0;

  var activeResultIndex = -1;
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

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeNav();
    closeSearch();
    hideResults();
  });

  function normalizeQuery(q) {
    return q.trim().toLowerCase();
  }

  function matchCompany(company, query) {
    if (!query) return false;
    var name = company.name.toLowerCase();
    var legal = company.legalName.toLowerCase();
    if (name.indexOf(query) === 0 || legal.indexOf(query) === 0) return true;
    var i;
    for (i = 0; i < company.terms.length; i++) {
      if (company.terms[i].indexOf(query) === 0) return true;
    }
    return false;
  }

  function fetchSearchResults(query, callback) {
    var q = normalizeQuery(query);
    if (!q) {
      callback([]);
      return;
    }
    var reqId = ++searchRequestId;
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
        if (reqId !== searchRequestId) return;
        callback(Array.isArray(data) ? data : []);
      })
      .catch(function (err) {
        if (reqId !== searchRequestId) return;
        if (err && err.status === 503 && err.payload && err.payload.hint && cbResults) {
          cbResults.innerHTML =
            '<p class="cb-search-results-empty">' +
            "Search is not connected to the database. Add Supabase keys in Vercel and redeploy." +
            "</p>";
          showResults();
          return;
        }
        callback([]);
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

  function showResults() {
    if (cbResults) cbResults.classList.add("is-open");
    if (cbSearch) cbSearch.setAttribute("aria-expanded", "true");
  }

  function hideResults() {
    if (!cbResults) return;
    cbResults.classList.remove("is-open");
    cbResults.innerHTML = "";
    currentResults = [];
    activeResultIndex = -1;
    if (cbSearch) {
      cbSearch.setAttribute("aria-expanded", "false");
      cbSearch.removeAttribute("aria-activedescendant");
    }
  }

  function goToCompany(company) {
    if (!company || !company.url) return;
    window.location.href = company.url;
  }

  function renderResults(results, query) {
    if (!cbResults) return;
    currentResults = results;
    activeResultIndex = results.length ? 0 : -1;
    var q = normalizeQuery(query);

    if (!results.length) {
      if (!q) {
        hideResults();
        return;
      }
      cbResults.innerHTML = '<p class="cb-search-results-empty">No matches</p>';
      showResults();
      return;
    }

    cbResults.innerHTML = results
      .map(function (company, i) {
        var active = i === activeResultIndex ? " is-active" : "";
        return (
          '<button type="button" class="cb-search-result' +
          active +
          '" role="option" id="cb-result-' +
          i +
          '" data-index="' +
          i +
          '">' +
          '<span class="cb-search-result-mark">' +
          company.initials +
          "</span>" +
          '<span class="cb-search-result-name">' +
          highlightName(company.name, q) +
          '</span><span class="cb-search-result-sub"> · ' +
          company.legalName +
          "</span>" +
          "</button>"
        );
      })
      .join("");

    showResults();

    if (cbSearch) {
      cbSearch.setAttribute("aria-activedescendant", "cb-result-0");
    }

    cbResults.querySelectorAll(".cb-search-result").forEach(function (btn) {
      btn.addEventListener("mousedown", function (e) {
        e.preventDefault();
      });
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-index"), 10);
        goToCompany(currentResults[idx]);
      });
    });
  }

  function setActiveResult(index) {
    if (!cbResults || !currentResults.length) return;
    var buttons = cbResults.querySelectorAll(".cb-search-result");
    if (!buttons.length) return;

    activeResultIndex = Math.max(0, Math.min(index, buttons.length - 1));
    buttons.forEach(function (btn, i) {
      btn.classList.toggle("is-active", i === activeResultIndex);
    });
    if (cbSearch) {
      cbSearch.setAttribute("aria-activedescendant", "cb-result-" + activeResultIndex);
    }
    var activeBtn = buttons[activeResultIndex];
    if (activeBtn && activeBtn.scrollIntoView) {
      activeBtn.scrollIntoView({ block: "nearest" });
    }
  }

  function onSearchInput() {
    if (!cbSearch) return;
    var value = cbSearch.value;
    var q = normalizeQuery(value);
    if (!q) {
      hideResults();
      return;
    }
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(function () {
      fetchSearchResults(value, function (results) {
        renderResults(results, value);
      });
    }, 200);
  }

  if (cbSearch) {
    cbSearch.addEventListener("input", onSearchInput);
    cbSearch.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        if (!currentResults.length) return;
        e.preventDefault();
        setActiveResult(activeResultIndex + 1);
      } else if (e.key === "ArrowUp") {
        if (!currentResults.length) return;
        e.preventDefault();
        setActiveResult(activeResultIndex - 1);
      } else if (e.key === "Enter" && currentResults.length && cbResults.classList.contains("is-open")) {
        e.preventDefault();
        var pick = activeResultIndex >= 0 ? activeResultIndex : 0;
        goToCompany(currentResults[pick]);
      } else if (e.key === "Escape") {
        hideResults();
      }
    });
  }

  document.addEventListener("click", function (e) {
    var wrap = document.querySelector(".cb-search-wrap");
    if (wrap && !wrap.contains(e.target)) hideResults();
  });

  document.querySelectorAll(".cb-suggestion").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var q = btn.getAttribute("data-query");
      if (cbSearch && q) {
        cbSearch.value = q;
        cbSearch.focus();
        onSearchInput();
      }
    });
  });

  if (cbForm) {
    cbForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = cbSearch && cbSearch.value.trim();
      if (!q) return;
      fetchSearchResults(q, function (results) {
        if (results.length) goToCompany(results[0]);
      });
    });
  }
})();
