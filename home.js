(function () {
  "use strict";

  var promo = document.getElementById("plt-promo");
  var promoClose = document.getElementById("plt-promo-close");
  var navPanel = document.getElementById("plt-nav-panel");
  var navOpenBtn = document.getElementById("plt-nav-btn");
  var navCloseBtn = document.getElementById("plt-nav-close");
  var searchPanel = document.getElementById("plt-search-panel");
  var searchOpenBtns = document.querySelectorAll("[data-plt-search-open]");
  var searchCloseBtn = document.getElementById("plt-search-close");
  var searchInput = document.getElementById("plt-search-input");
  var cbSearch = document.getElementById("cb-search");
  var cbForm = document.getElementById("cb-search-form");

  function setPromoVisible(visible) {
    document.body.classList.toggle("plt-promo-visible", visible);
    if (!visible) {
      document.documentElement.style.setProperty("--plt-promo-offset", "0px");
    }
  }

  if (promo && !promo.classList.contains("is-dismissed")) {
    setPromoVisible(true);
  }

  if (promoClose && promo) {
    promoClose.addEventListener("click", function () {
      promo.classList.add("is-dismissed");
      setPromoVisible(false);
      try {
        sessionStorage.setItem("spectr_promo_dismissed", "1");
      } catch (e) {}
    });
  }

  try {
    if (sessionStorage.getItem("spectr_promo_dismissed") === "1" && promo) {
      promo.classList.add("is-dismissed");
      setPromoVisible(false);
    }
  } catch (e) {}

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
  });

  document.querySelectorAll(".cb-suggestion").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var q = btn.getAttribute("data-query");
      if (cbSearch && q) {
        cbSearch.value = q;
        cbSearch.focus();
      }
    });
  });

  if (cbForm) {
    cbForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = cbSearch && cbSearch.value.trim();
      if (!q) return;
      /* Placeholder: wire to search API when available */
      console.info("[Spectr search]", q);
    });
  }
})();
