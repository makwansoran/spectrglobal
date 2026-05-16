(function () {
  "use strict";

  var TICKER_META = {
    AAPL: { name: "Apple", domain: "apple.com" },
    MSFT: { name: "Microsoft", domain: "microsoft.com" },
    NVDA: { name: "NVIDIA", domain: "nvidia.com" },
    GOOGL: { name: "Alphabet", domain: "google.com" },
    AMZN: { name: "Amazon", domain: "amazon.com" },
    META: { name: "Meta", domain: "meta.com" },
  };

  var FUND = {
    asOf: "2026-05-16",
    performance: {
      ytd: 18.42,
      oneYear: 34.18,
      sharpe: 1.38,
      maxDrawdown: -8.24,
      winRate: 61.5,
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
      equity: [100, 101.2, 100.4, 103.8, 106.2, 104.9, 108.5, 112.1, 115.4, 118.2, 121.6, 118.4],
    },
    positions: [
      { ticker: "NVDA", shares: 185, avgCost: 92.4, price: 124.7, action: "long" },
      { ticker: "AAPL", shares: 420, avgCost: 178.2, price: 198.4, action: "long" },
      { ticker: "MSFT", shares: 210, avgCost: 385.1, price: 428.1, action: "long" },
      { ticker: "GOOGL", shares: 95, avgCost: 142.8, price: 171.2, action: "long" },
      { ticker: "META", shares: 60, avgCost: 488.0, price: 512.6, action: "long" },
      { ticker: "AMZN", shares: 88, avgCost: 168.5, price: 186.3, action: "hold" },
    ],
    cash: 42850,
  };

  var perfChart = null;

  function $(id) {
    return document.getElementById(id);
  }

  function logoUrl(ticker) {
    var meta = TICKER_META[ticker];
    if (meta && meta.domain) return "https://logo.clearbit.com/" + meta.domain + "?size=128";
    return "";
  }

  function companyName(ticker) {
    return (TICKER_META[ticker] && TICKER_META[ticker].name) || ticker;
  }

  function formatMoney(n) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  }

  function formatPct(n) {
    return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
  }

  function positionValue(p) {
    return p.shares * p.price;
  }

  function positionPnlPct(p) {
    return ((p.price - p.avgCost) / p.avgCost) * 100;
  }

  function totalNav() {
    var invested = FUND.positions.reduce(function (s, p) {
      return s + positionValue(p);
    }, 0);
    return invested + FUND.cash;
  }

  function renderMetrics() {
    var p = FUND.performance;
    if ($("land-ytd")) $("land-ytd").textContent = formatPct(p.ytd);
    if ($("land-1y")) $("land-1y").textContent = formatPct(p.oneYear);
    if ($("land-sharpe")) $("land-sharpe").textContent = p.sharpe.toFixed(2);
    if ($("land-dd")) $("land-dd").textContent = formatPct(p.maxDrawdown);
    if ($("land-win")) $("land-win").textContent = p.winRate.toFixed(1) + "%";
    if ($("land-nav")) $("land-nav").textContent = formatMoney(totalNav());
    if ($("land-asof")) $("land-asof").textContent = "As of " + FUND.asOf;
  }

  function renderPerfChart() {
    var canvas = $("land-perf-chart");
    if (!canvas || typeof Chart === "undefined") return;
    var p = FUND.performance;
    if (perfChart) perfChart.destroy();
    perfChart = new Chart(canvas, {
      type: "line",
      data: {
        labels: p.labels,
        datasets: [
          {
            label: "Fund (indexed 100)",
            data: p.equity,
            borderColor: "#1f6feb",
            backgroundColor: "rgba(31, 111, 235, 0.08)",
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "#eef2f6" }, ticks: { font: { size: 10, family: "JetBrains Mono" } } },
          y: { grid: { color: "#eef2f6" }, ticks: { font: { size: 10, family: "JetBrains Mono" } } },
        },
      },
    });
  }

  function addStat(dl, label, value, extraClass) {
    var row = document.createElement("div");
    var dt = document.createElement("dt");
    var dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    if (extraClass) dd.className = extraClass;
    row.appendChild(dt);
    row.appendChild(dd);
    dl.appendChild(row);
  }

  function renderPositions() {
    var grid = $("land-positions");
    if (!grid) return;
    var nav = totalNav();
    grid.innerHTML = "";

    FUND.positions.forEach(function (p) {
      var val = positionValue(p);
      var weight = (val / nav) * 100;
      var pnl = positionPnlPct(p);
      var card = document.createElement("article");
      card.className = "land-position";

      var head = document.createElement("div");
      head.className = "land-position-head";

      var img = document.createElement("img");
      img.className = "land-logo";
      img.width = 40;
      img.height = 40;
      img.alt = companyName(p.ticker);
      img.loading = "lazy";
      img.src = logoUrl(p.ticker);
      img.onerror = function () {
        var fb = document.createElement("span");
        fb.className = "land-logo-fallback";
        fb.textContent = p.ticker.slice(0, 1);
        img.replaceWith(fb);
      };

      var meta = document.createElement("div");
      var name = document.createElement("strong");
      name.textContent = companyName(p.ticker);
      var tick = document.createElement("span");
      tick.className = "mono land-ticker";
      tick.textContent = p.ticker;
      meta.appendChild(name);
      meta.appendChild(tick);

      var pnlEl = document.createElement("span");
      pnlEl.className = "land-position-pnl " + (pnl >= 0 ? "is-up" : "is-down");
      pnlEl.textContent = formatPct(pnl);

      head.appendChild(img);
      head.appendChild(meta);
      head.appendChild(pnlEl);

      var dl = document.createElement("dl");
      dl.className = "land-position-stats";
      addStat(dl, "Shares", p.shares.toLocaleString());
      addStat(dl, "Value", formatMoney(val));
      addStat(dl, "Weight", weight.toFixed(1) + "%");
      addStat(dl, "Stance", p.action, "mono");

      card.appendChild(head);
      card.appendChild(dl);
      grid.appendChild(card);
    });

    var cashCard = document.createElement("article");
    cashCard.className = "land-position land-position--cash";
    var cashHead = document.createElement("div");
    cashHead.className = "land-position-head";
    var cashFb = document.createElement("span");
    cashFb.className = "land-logo-fallback land-logo-fallback--cash";
    cashFb.textContent = "$";
    var cashMeta = document.createElement("div");
    var cName = document.createElement("strong");
    cName.textContent = "Cash";
    var cTick = document.createElement("span");
    cTick.className = "mono land-ticker";
    cTick.textContent = "USD";
    cashMeta.appendChild(cName);
    cashMeta.appendChild(cTick);
    cashHead.appendChild(cashFb);
    cashHead.appendChild(cashMeta);
    var cashDl = document.createElement("dl");
    cashDl.className = "land-position-stats";
    addStat(cashDl, "Balance", formatMoney(FUND.cash));
    addStat(cashDl, "Weight", ((FUND.cash / nav) * 100).toFixed(1) + "%");
    cashCard.appendChild(cashHead);
    cashCard.appendChild(cashDl);
    grid.appendChild(cashCard);
  }

  function init() {
    renderMetrics();
    renderPerfChart();
    renderPositions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
