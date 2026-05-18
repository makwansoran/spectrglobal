(function () {
  function slugFromPath() {
    var parts = window.location.pathname.replace(/\/+$/, "").split("/");
    var i = parts.indexOf("commodity");
    if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
    return "";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function factRow(label, value) {
    return (
      "<div><dt>" +
      escapeHtml(label) +
      "</dt><dd>" +
      escapeHtml(value) +
      "</dd></div>"
    );
  }

  var slug = slugFromPath();
  var root = document.getElementById("commodity-root");

  if (!slug) {
    root.innerHTML = '<p class="commodity-error">Commodity not found.</p>';
    return;
  }

  fetch("/api/commodities/" + encodeURIComponent(slug))
    .then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error(data.error || "Not found");
        return data;
      });
    })
    .then(function (data) {
      var p = data.profile;
      document.title = p.name + " · Spectr";

      var facts = [
        { label: "Category", value: p.categoryLabel },
        { label: "Exchange", value: p.exchange },
        { label: "Symbol", value: p.symbol },
      ].filter(function (f) {
        return f.value;
      });

      if (p.alternateSymbols && p.alternateSymbols.length) {
        facts.push({ label: "Alt symbols", value: p.alternateSymbols.join(", ") });
      }

      var factHtml = facts.map(function (f) {
        return factRow(f.label, f.value);
      }).join("");

      root.innerHTML =
        '<article class="commodity-card">' +
        '<span class="commodity-badge">Commodity</span>' +
        "<h1 class=\"commodity-title\">" +
        escapeHtml(p.name) +
        "</h1>" +
        '<p class="commodity-meta">' +
        escapeHtml([p.categoryLabel, p.exchange, p.symbol].filter(Boolean).join(" · ")) +
        "</p>" +
        '<dl class="commodity-facts">' +
        factHtml +
        "</dl>" +
        '<p class="commodity-about">' +
        escapeHtml(p.about || "") +
        "</p>" +
        "</article>";
    })
    .catch(function () {
      root.innerHTML =
        '<p class="commodity-error">Commodity not found. <a href="index.html">Back to search</a></p>';
    });
})();
