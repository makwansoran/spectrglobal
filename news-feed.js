(function () {
  "use strict";

  var CATEGORY_LABELS = {
    general: "Markets",
    forex: "Currencies",
    merger: "M&A",
    crypto: "Crypto",
  };

  function categoryLabel(cat) {
    if (!cat) return "News";
    return CATEGORY_LABELS[String(cat).toLowerCase()] || String(cat);
  }

  function formatWhen(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    var diff = Date.now() - d.getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + "m ago";
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    var days = Math.floor(hrs / 24);
    if (days < 7) return days + "d ago";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildArticle(item, index, opts) {
    var lead = opts.lead && index === 0;
    var compact = opts.compact;
    var title = escapeHtml(item.title);
    var summary = escapeHtml(item.summary);
    var source = escapeHtml(item.source || "Spectr");
    var cat = escapeHtml(categoryLabel(item.category));
    var when = formatWhen(item.publishedAt || item.date);
    var url = item.url ? String(item.url) : "";
    var safeUrl = url && /^https?:\/\//i.test(url) ? url : "";

    var headlineInner = safeUrl
      ? '<a href="' + escapeHtml(safeUrl) + '" target="_blank" rel="noopener noreferrer">' + title + "</a>"
      : title;

    var media = "";
    if (item.image && /^https?:\/\//i.test(item.image) && !compact) {
      media =
        '<figure class="nf-article-media"><img src="' +
        escapeHtml(item.image) +
        '" alt="" loading="lazy" decoding="async" /></figure>';
    }

    var dek = summary ? '<p class="nf-dek">' + summary + "</p>" : "";
    var whenHtml = when
      ? '<span class="nf-meta-sep" aria-hidden="true">·</span><time datetime="' +
        escapeHtml(item.publishedAt || item.date) +
        '">' +
        escapeHtml(when) +
        "</time>"
      : "";

    return (
      '<article class="nf-article' +
      (lead ? " nf-article--lead" : "") +
      '">' +
      '<div class="nf-article-body">' +
      '<div class="nf-meta"><span class="nf-cat">' +
      cat +
      '</span><span class="nf-meta-sep" aria-hidden="true">·</span><span>' +
      source +
      "</span>" +
      whenHtml +
      "</div>" +
      '<h3 class="nf-headline">' +
      headlineInner +
      "</h3>" +
      dek +
      "</div>" +
      media +
      "</article>"
    );
  }

  async function mountFeed(container) {
    var limit = parseInt(container.getAttribute("data-limit"), 10) || 12;
    var lead = container.getAttribute("data-lead") !== "false";
    var compact = container.classList.contains("nf-feed--compact");

    try {
      var res = await fetch("/api/news?limit=" + encodeURIComponent(String(limit)), {
        headers: { Accept: "application/json" },
      });
      var data = await res.json().catch(function () {
        return {};
      });

      if (!res.ok) {
        container.innerHTML = '<p class="nf-error">' + escapeHtml(data.error || "Could not load news.") + "</p>";
        return;
      }

      var items = data.news || [];
      if (!items.length) {
        container.innerHTML =
          '<p class="nf-empty">' +
          escapeHtml(data.message || "No headlines available right now.") +
          "</p>";
        return;
      }

      var html = items
        .map(function (item, i) {
          return buildArticle(item, i, { lead: lead, compact: compact });
        })
        .join("");
      container.innerHTML = html;
    } catch {
      container.innerHTML = '<p class="nf-error">Could not load news. Try again later.</p>';
    }
  }

  function init() {
    document.querySelectorAll("[data-nf-feed]").forEach(function (el) {
      if (el.getAttribute("data-nf-mounted") === "1") return;
      el.setAttribute("data-nf-mounted", "1");
      mountFeed(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
