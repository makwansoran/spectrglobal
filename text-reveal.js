(function () {
  "use strict";

  var CHAR_DELAY = 0.032; // seconds between each letter

  function revealElement(el) {
    var text = el.textContent;
    var charIndex = 0;

    el.innerHTML = text.split("").map(function (char) {
      if (char === " ") {
        return '<span class="pln-char pln-char--space"> </span>';
      }
      var delay = (charIndex * CHAR_DELAY).toFixed(3) + "s";
      charIndex++;
      return (
        '<span class="pln-char" style="transition-delay:' + delay + '">' +
          char +
        "</span>"
      );
    }).join("");

    // Double rAF ensures styles are applied before class triggers transition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add("pln-text-revealed");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".pln-text-reveal").forEach(revealElement);
  });
})();
