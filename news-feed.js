(function () {
  "use strict";

  var CATEGORY_LABELS = {
    general: "Markets",
    forex: "Currencies",
    merger: "M&A",
    crypto: "Crypto",
  };

  var PLACEHOLDER_HUES = {
    general: "220, 38, 58",
    forex: "31, 111, 235",
    merger: "16, 120, 90",
    crypto: "124, 58, 237",
  };

  function categoryLabel(cat) {
    if (!cat) return "News";
    return CATEGORY_LABELS[String(cat).toLowerCase()] || String(cat);
  }

  function placeholderHue(cat) {
    return PLACEHOLDER_HUES[String(cat || "general").toLowerCase()] || "27, 40, 56";
  }

  function formatWhen(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    var diff = Date.now() - d.getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + " min ago";
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + " hr ago";
    var days = Math.floor(hrs / 24);
    if (days < 7) return days + " d ago";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildMedia(item, variant) {
    var cat = categoryLabel(item.category);
    var hue = placeholderHue(item.category);
    var mediaClass = "nf-article-media nf-article-media--" + variant;

    var imgUrl = item.image && /^https?:\/\//i.test(item.image) ? String(item.image) : "";

    if (imgUrl) {
      return (
        '<figure class="' +
        mediaClass +
        '">' +
        '<img src="' +
        escapeHtml(imgUrl) +
        '" alt="" loading="lazy" decoding="async" ' +
        "onerror=\"this.closest('figure').classList.add('is-fallback');this.remove();\" />" +
        '<span class="nf-media-fallback" style="--nf-hue:' +
        hue +
        '" aria-hidden="true">' +
        escapeHtml(cat) +
        "</span></figure>"
      );
    }

    return (
      '<figure class="' +
      mediaClass +
      ' nf-article-media--placeholder" style="--nf-hue:' +
      hue +
      '">' +
      '<span class="nf-placeholder-label">' +
      escapeHtml(cat) +
      "</span></figure>"
    );
  }

  function metaHtml(item, opts) {
    var cat = escapeHtml(categoryLabel(item.category));
    var source = escapeHtml(item.source || "Spectr");
    var when = formatWhen(item.publishedAt || item.date);
    var whenPart = when
      ? '<span class="nf-meta-sep" aria-hidden="true">·</span><time datetime="' +
        escapeHtml(item.publishedAt || item.date) +
        '">' +
        escapeHtml(when) +
        "</time>"
      : "";

    if (opts.side) {
      return '<div class="nf-meta"><span class="nf-cat">' + cat + "</span>" + whenPart + "</div>";
    }

    return (
      '<div class="nf-meta"><span class="nf-cat">' +
      cat +
      '</span><span class="nf-meta-sep" aria-hidden="true">·</span><span class="nf-source">' +
      source +
      "</span>" +
      whenPart +
      "</div>"
    );
  }

  function wrapArticle(className, inner, url) {
    if (url) {
      return (
        '<article class="' +
        className +
        '"><a class="nf-article-link" href="' +
        escapeHtml(url) +
        '" target="_blank" rel="noopener noreferrer">' +
        inner +
        "</a></article>"
      );
    }
    return '<article class="' + className + '">' + inner + "</article>";
  }

  function articleUrl(item) {
    var url = item.url ? String(item.url) : "";
    return url && /^https?:\/\//i.test(url) ? url : "";
  }

  function buildLeadArticle(item) {
    var title = escapeHtml(item.title);
    var summary = escapeHtml(item.summary);
    var dek = summary ? '<p class="nf-dek">' + summary + "</p>" : "";
    var meta = metaHtml(item, {});

    var inner =
      '<div class="nf-article-inner">' +
      buildMedia(item, "lead") +
      '<div class="nf-article-body">' +
      meta +
      '<h2 class="nf-headline"><span class="nf-headline-text">' +
      title +
      "</span></h2>" +
      dek +
      "</div></div>";

    return wrapArticle("nf-article nf-article--lead", inner, articleUrl(item));
  }

  function buildSideArticle(item) {
    var title = escapeHtml(item.title);
    var meta = metaHtml(item, { side: true });

    var inner =
      '<div class="nf-article-inner">' +
      '<div class="nf-article-body">' +
      meta +
      '<h3 class="nf-headline"><span class="nf-headline-text">' +
      title +
      "</span></h3>" +
      "</div>" +
      buildMedia(item, "side") +
      "</div>";

    return wrapArticle("nf-article nf-article--side", inner, articleUrl(item));
  }

  function buildTileArticle(item) {
    var title = escapeHtml(item.title);
    var summary = escapeHtml(item.summary);
    var dek = summary ? '<p class="nf-dek">' + summary + "</p>" : "";
    var meta = metaHtml(item, {});

    var inner =
      '<div class="nf-article-inner">' +
      buildMedia(item, "tile") +
      '<div class="nf-article-body">' +
      meta +
      '<h3 class="nf-headline"><span class="nf-headline-text">' +
      title +
      "</span></h3>" +
      dek +
      "</div></div>";

    return wrapArticle("nf-article nf-article--tile", inner, articleUrl(item));
  }

  function renderLayout(items, layout) {
    if (!items.length) return "";

    var sideCount = layout === "home" ? 5 : 6;
    var sideItems = items.slice(1, 1 + sideCount);
    var moreItems = items.slice(1 + sideCount);

    var html =
      '<div class="nf-layout nf-layout--reuters">' +
      '<div class="nf-reuters-row">' +
      '<div class="nf-main-col">' +
      buildLeadArticle(items[0]) +
      "</div>" +
      '<aside class="nf-side-col" aria-label="Headlines">' +
      '<h3 class="nf-side-heading">Top stories</h3>' +
      '<div class="nf-side-list">' +
      sideItems.map(buildSideArticle).join("") +
      "</div></aside></div>";

    if (layout === "newsroom" && moreItems.length) {
      html +=
        '<section class="nf-more-block" aria-labelledby="nf-more-heading">' +
        '<h3 id="nf-more-heading" class="nf-more-heading">More stories</h3>' +
        '<div class="nf-more-grid">' +
        moreItems.map(buildTileArticle).join("") +
        "</div></section>";
    }

    html += "</div>";
    return html;
  }

  async function mountFeed(container) {
    var limit = parseInt(container.getAttribute("data-limit"), 10) || 12;
    var layout = container.getAttribute("data-layout") || "newsroom";

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

      container.innerHTML = renderLayout(items, layout);
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
