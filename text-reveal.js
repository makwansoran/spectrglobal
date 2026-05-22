(function () {
  "use strict";

  function revealElement(el) {
    var words = el.textContent.trim().split(/\s+/).filter(Boolean);

    el.innerHTML = words.map(function (word, i) {
      var delay = (i * 0.1).toFixed(2) + "s";
      return (
        '<span class="pln-text-reveal-word">' +
          '<span class="pln-text-reveal-inner" style="transition-delay:' + delay + '">' +
            word +
          "</span>" +
        "</span>"
      );
    }).join("");

    if (!("IntersectionObserver" in window)) {
      el.classList.add("pln-text-revealed");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            el.classList.add("pln-text-revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".pln-text-reveal").forEach(revealElement);
  });
})();
