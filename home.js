(function () {
  "use strict";

  var navPanel = document.getElementById("plt-nav-panel");
  var navOpenBtn = document.getElementById("plt-nav-btn");
  var navCloseBtn = document.getElementById("plt-nav-close");

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

  if (navOpenBtn) {
    navOpenBtn.addEventListener("click", function () {
      if (navPanel && navPanel.classList.contains("is-open")) closeNav();
      else openNav();
    });
  }

  if (navCloseBtn) navCloseBtn.addEventListener("click", closeNav);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
})();
