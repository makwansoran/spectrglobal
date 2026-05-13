(function setCurrentYear() {
  var y = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = y;
  });
})();

(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

(function heroVideoBg() {
  var root = document.querySelector(".hero-bg");
  if (!root) return;

  var vA = root.querySelector(".hero-video--a");
  var vB = root.querySelector(".hero-video--b");
  if (!vA || !vB) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  function tryPlay(v) {
    var p = v.play();
    if (p && typeof p.then === "function") {
      p.catch(function () {});
    }
  }

  tryPlay(vA);
  tryPlay(vB);

  var showB = false;
  window.setInterval(function () {
    showB = !showB;
    root.classList.toggle("hero-bg--b", showB);
  }, 11000);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      vA.pause();
      vB.pause();
    } else {
      tryPlay(vA);
      tryPlay(vB);
    }
  });
})();
