(function () {
  "use strict";

  var host = window.location.hostname;
  var isLocal = host === "localhost" || host === "127.0.0.1";
  var script = document.createElement("script");
  script.defer = true;
  script.src = isLocal
    ? "https://cdn.vercel-insights.com/v1/script.debug.js"
    : "/_vercel/insights/script.js";
  document.head.appendChild(script);
})();
