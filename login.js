(function () {
  "use strict";

  var yearEl = document.getElementById("login-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "index.html";
    });
  }

  var mesh = document.querySelector(".login-mesh");
  if (mesh && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var tx = 0;
    var ty = 0;
    window.addEventListener(
      "pointermove",
      function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;
        tx += (x * 12 - tx) * 0.06;
        ty += (y * 10 - ty) * 0.06;
        mesh.style.setProperty("--mx", tx.toFixed(2) + "%");
        mesh.style.setProperty("--my", ty.toFixed(2) + "%");
      },
      { passive: true }
    );
  }
})();
