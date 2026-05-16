(function () {
  "use strict";

  var API_BASE =
    (window.SPECTR_PLATFORM && window.SPECTR_PLATFORM.apiBase) ||
    localStorage.getItem("spectr_api_base") ||
    "http://localhost:8000";

  var GRAPH_SUFFIX = "spctr01";
  var DEFAULT_AGENTS = [
    "warren_buffett",
    "fundamentals_analyst",
    "sentiment_analyst",
    "valuation_analyst",
  ];

  var state = {
    agents: [],
    running: false,
    abort: null,
    decisions: null,
    analystSignals: {},
    currentPrices: {},
    log: [],
    pipelineStatus: {},
    demo: false,
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function formatMoney(n) {
    if (n == null || isNaN(n)) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function formatPct(n) {
    if (n == null || isNaN(n)) return "—";
    return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysAgoISO(days) {
    var d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }

  function buildGraph(agentKeys) {
    var pmId = "portfolio_manager_" + GRAPH_SUFFIX;
    var nodes = agentKeys.map(function (key) {
      return {
        id: key + "_" + GRAPH_SUFFIX,
        type: "agent-node",
        data: { name: key },
      };
    });
    nodes.push({
      id: pmId,
      type: "portfolio-manager-node",
      data: { name: "Portfolio Manager" },
    });
    var edges = agentKeys.map(function (key, i) {
      return {
        id: "e" + i,
        source: key + "_" + GRAPH_SUFFIX,
        target: pmId,
      };
    });
    return { graph_nodes: nodes, graph_edges: edges };
  }

  function getSelectedAgents() {
    var boxes = document.querySelectorAll('[data-agent-key]:checked');
    var keys = [];
    boxes.forEach(function (b) {
      keys.push(b.getAttribute("data-agent-key"));
    });
    return keys.length ? keys : DEFAULT_AGENTS.slice();
  }

  function setApiHint() {
    var el = $("plt-api-hint");
    if (el) el.textContent = API_BASE;
  }

  function setBackendStatus(online, message) {
    var dot = $("plt-backend-dot");
    var label = $("plt-backend-label");
    if (!dot || !label) return;
    if (online) {
      dot.className = "plt-pill plt-pill--live";
      label.textContent = message || "Backend connected";
    } else {
      dot.className = "plt-pill";
      label.textContent = message || "Backend offline — demo data";
    }
  }

  async function pingBackend() {
    try {
      var res = await fetch(API_BASE + "/hedge-fund/agents", { method: "GET", signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error("agents failed");
      setBackendStatus(true);
      state.demo = false;
      return true;
    } catch (e) {
      setBackendStatus(false);
      state.demo = true;
      showBanner(
        "warn",
        "Cannot reach the AI Hedge Fund API at " +
          API_BASE +
          ". Start the backend (see integrations/SETUP.txt) or set window.SPECTR_PLATFORM.apiBase. Demo charts will still render."
      );
      return false;
    }
  }

  async function fetchAgents() {
    try {
      var res = await fetch(API_BASE + "/hedge-fund/agents");
      if (!res.ok) throw new Error("agents");
      var data = await res.json();
      state.agents = data.agents || [];
      renderAgentCheckboxes();
    } catch (e) {
      state.agents = DEFAULT_AGENTS.map(function (key, i) {
        return {
          key: key,
          display_name: key.replace(/_/g, " "),
          order: i,
        };
      });
      renderAgentCheckboxes();
    }
  }

  function renderAgentCheckboxes() {
    var wrap = $("plt-agent-grid");
    if (!wrap) return;
    wrap.innerHTML = "";
    var list = state.agents.slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
    list.forEach(function (agent) {
      var label = document.createElement("label");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.setAttribute("data-agent-key", agent.key);
      input.checked = DEFAULT_AGENTS.indexOf(agent.key) >= 0;
      label.appendChild(input);
      label.appendChild(document.createTextNode(agent.display_name || agent.key));
      wrap.appendChild(label);
    });
    renderPipeline(getSelectedAgents());
  }

  function renderPipeline(agentKeys) {
    var wrap = $("plt-pipeline");
    if (!wrap) return;
    wrap.innerHTML = "";
    var pmId = "portfolio_manager";
    agentKeys.forEach(function (key) {
      wrap.appendChild(pipelineNode(key.replace(/_/g, " "), state.pipelineStatus[key] || "idle"));
    });
    wrap.appendChild(pipelineNode("Risk", state.pipelineStatus.risk || "idle"));
    wrap.appendChild(pipelineNode("Portfolio mgr", state.pipelineStatus.portfolio_manager || "idle"));
  }

  function pipelineNode(label, status) {
    var el = document.createElement("span");
    el.className = "plt-pipeline-node";
    if (status === "running") el.classList.add("is-running");
    if (status === "done") el.classList.add("is-done");
    if (status === "error") el.classList.add("is-error");
    el.textContent = label;
    return el;
  }

  function showBanner(type, text) {
    var el = $("plt-banner");
    if (!el) return;
    el.hidden = !text;
    el.className = "plt-banner" + (type ? " plt-banner--" + type : "");
    el.textContent = text || "";
  }

  function appendLog(agent, status, ticker) {
    var line = { agent: agent, status: status, ticker: ticker, at: new Date().toLocaleTimeString() };
    state.log.unshift(line);
    if (state.log.length > 80) state.log.length = 80;
    renderLog();
  }

  function renderLog() {
    var ul = $("plt-log");
    if (!ul) return;
    if (!state.log.length) {
      ul.innerHTML = '<li class="plt-empty">Agent activity will stream here during a run.</li>';
      return;
    }
    ul.innerHTML = state.log
      .map(function (l) {
        var t = l.ticker ? " · " + l.ticker : "";
        return (
          '<li><span class="agent">' +
          escapeHtml(l.agent) +
          "</span> " +
          escapeHtml(l.status) +
          t +
          ' <span style="opacity:0.5">' +
          escapeHtml(l.at) +
          "</span></li>"
        );
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeAction(val) {
    if (!val) return "hold";
    var s = String(val).toLowerCase();
    if (s.indexOf("buy") >= 0 || s === "long") return "buy";
    if (s.indexOf("sell") >= 0 || s === "short") return "sell";
    return "hold";
  }

  function renderDecisions() {
    var tbody = $("plt-decisions-body");
    if (!tbody) return;
    var decisions = state.decisions;
    if (!decisions || typeof decisions !== "object") {
      tbody.innerHTML = '<tr><td colspan="4" class="plt-empty">Run an analysis to see portfolio decisions.</td></tr>';
      return;
    }

    var rows = [];
    Object.keys(decisions).forEach(function (ticker) {
      var d = decisions[ticker];
      if (typeof d === "string") {
        try {
          d = JSON.parse(d);
        } catch (e) {
          d = { action: d };
        }
      }
      var action = normalizeAction(d.action || d.signal || d.decision);
      var qty = d.quantity != null ? d.quantity : d.shares != null ? d.shares : "—";
      var conf = d.confidence != null ? (d.confidence * 100).toFixed(0) + "%" : "—";
      var price = state.currentPrices[ticker];
      rows.push(
        "<tr><td><strong>" +
          escapeHtml(ticker) +
          '</strong></td><td><span class="plt-signal plt-signal--' +
          action +
          '">' +
          action +
          "</span></td><td>" +
          escapeHtml(String(qty)) +
          "</td><td>" +
          (price != null ? formatMoney(price) : "—") +
          " · " +
          escapeHtml(String(conf)) +
          "</td></tr>"
      );
    });

    tbody.innerHTML = rows.length
      ? rows.join("")
      : '<tr><td colspan="4" class="plt-empty">No decisions returned.</td></tr>';
  }

  function renderSignals() {
    var tbody = $("plt-signals-body");
    if (!tbody) return;
    var signals = state.analystSignals;
    var rows = [];
    Object.keys(signals).forEach(function (agent) {
      var byTicker = signals[agent];
      if (typeof byTicker !== "object") return;
      Object.keys(byTicker).forEach(function (ticker) {
        var sig = byTicker[ticker];
        var action = "hold";
        var detail = "";
        if (typeof sig === "object" && sig !== null) {
          action = normalizeAction(sig.signal || sig.action || sig.recommendation);
          detail = sig.reasoning || sig.analysis || sig.summary || JSON.stringify(sig).slice(0, 120);
        } else {
          detail = String(sig).slice(0, 120);
          action = normalizeAction(detail);
        }
        rows.push(
          "<tr><td>" +
            escapeHtml(agent.replace(/_/g, " ")) +
            "</td><td>" +
            escapeHtml(ticker) +
            '</td><td><span class="plt-signal plt-signal--' +
            action +
            '">' +
            action +
            "</span></td><td>" +
            escapeHtml(detail) +
            "</td></tr>"
        );
      });
    });
    tbody.innerHTML = rows.length
      ? rows.join("")
      : '<tr><td colspan="4" class="plt-empty">Analyst signals appear after a successful run.</td></tr>';
  }

  function updateMetrics() {
    var cash = parseFloat($("plt-cash") && $("plt-cash").value) || 100000;
    var tickers = ($("plt-tickers") && $("plt-tickers").value) || "AAPL,MSFT,NVDA";
    var count = tickers.split(",").filter(Boolean).length;
    var exposure = Object.keys(state.currentPrices).length * (cash / Math.max(count, 1)) * 0.35;
    $("plt-metric-cash").textContent = formatMoney(cash);
    $("plt-metric-tickers").textContent = String(count);
    $("plt-metric-exposure").textContent = formatMoney(exposure || cash * 0.42);
  }

  var chartInstance = null;

  function renderChart() {
    var canvas = $("plt-chart");
    if (!canvas || typeof Chart === "undefined") return;

    var labels = [];
    var values = [];
    var cash = parseFloat($("plt-cash") && $("plt-cash").value) || 100000;

    if (state.decisions && Object.keys(state.decisions).length) {
      Object.keys(state.decisions).forEach(function (ticker) {
        labels.push(ticker);
        var p = state.currentPrices[ticker] || 100 + Math.random() * 200;
        values.push(p);
      });
    } else {
      labels = ["Cash", "Equities", "Hedges", "Other"];
      values = [cash * 0.22, cash * 0.58, cash * 0.12, cash * 0.08];
    }

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(canvas, {
      type: state.decisions ? "bar" : "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: state.decisions ? "Price (USD)" : "Allocation",
            data: values,
            backgroundColor: [
              "rgba(31, 111, 235, 0.75)",
              "rgba(13, 128, 80, 0.65)",
              "rgba(191, 115, 38, 0.65)",
              "rgba(92, 107, 122, 0.55)",
              "rgba(194, 48, 48, 0.55)",
              "rgba(31, 111, 235, 0.45)",
            ],
            borderColor: "#d8e0ea",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: !state.decisions, position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } },
        },
        scales: state.decisions
          ? {
              x: { grid: { color: "#eef2f6" }, ticks: { font: { family: "JetBrains Mono", size: 10 } } },
              y: { grid: { color: "#eef2f6" }, ticks: { font: { family: "JetBrains Mono", size: 10 } } },
            }
          : {},
      },
    });
  }

  function loadDemoResults() {
    state.decisions = {
      AAPL: { action: "buy", quantity: 120, confidence: 0.72 },
      MSFT: { action: "hold", quantity: 0, confidence: 0.61 },
      NVDA: { action: "buy", quantity: 45, confidence: 0.68 },
    };
    state.currentPrices = { AAPL: 198.4, MSFT: 428.1, NVDA: 124.7 };
    state.analystSignals = {
      warren_buffett: {
        AAPL: { signal: "buy", reasoning: "Wide moat, strong cash generation." },
        MSFT: { signal: "hold", reasoning: "Wonderful business at full price." },
      },
      fundamentals_analyst: {
        NVDA: { signal: "buy", reasoning: "Revenue growth supports premium multiple." },
      },
      sentiment_analyst: {
        AAPL: { signal: "hold", reasoning: "Neutral social and news flow." },
      },
    };
    appendLog("system", "Demo dataset loaded", null);
    renderDecisions();
    renderSignals();
    renderChart();
    updateMetrics();
    $("plt-metric-pnl").textContent = formatPct(4.2);
  }

  function setRunning(running) {
    state.running = running;
    var btn = $("plt-run-btn");
    var abort = $("plt-abort-btn");
    if (btn) btn.disabled = running;
    if (abort) abort.hidden = !running;
  }

  function runHedgeFund() {
    if (state.running) return;

    var tickersRaw = ($("plt-tickers") && $("plt-tickers").value) || "AAPL,MSFT,NVDA";
    var tickers = tickersRaw
      .split(",")
      .map(function (t) {
        return t.trim().toUpperCase();
      })
      .filter(Boolean);

    if (!tickers.length) {
      showBanner("error", "Enter at least one ticker symbol.");
      return;
    }

    var agentKeys = getSelectedAgents();
    var graph = buildGraph(agentKeys);
    var endDate = ($("plt-end-date") && $("plt-end-date").value) || todayISO();
    var startDate = ($("plt-start-date") && $("plt-start-date").value) || daysAgoISO(90);
    var cash = parseFloat($("plt-cash") && $("plt-cash").value) || 100000;

    var payload = {
      tickers: tickers,
      graph_nodes: graph.graph_nodes,
      graph_edges: graph.graph_edges,
      initial_cash: cash,
      margin_requirement: 0,
      start_date: startDate,
      end_date: endDate,
      model_name: ($("plt-model") && $("plt-model").value) || "gpt-4o-mini",
      model_provider: "OpenAI",
    };

    state.log = [];
    state.decisions = null;
    state.analystSignals = {};
    state.currentPrices = {};
    state.pipelineStatus = {};
    agentKeys.forEach(function (k) {
      state.pipelineStatus[k] = "running";
    });
    state.pipelineStatus.portfolio_manager = "idle";
    renderPipeline(agentKeys);
    renderLog();
    renderDecisions();
    renderSignals();
    showBanner("", "");
    setRunning(true);
    appendLog("system", "Starting run…", tickers.join(", "));

    if (state.demo) {
      setTimeout(function () {
        agentKeys.forEach(function (k) {
          state.pipelineStatus[k] = "done";
          appendLog(k, "Done", tickers[0]);
        });
        state.pipelineStatus.portfolio_manager = "done";
        renderPipeline(agentKeys);
        loadDemoResults();
        setRunning(false);
      }, 2200);
      return;
    }

    var controller = new AbortController();
    state.abort = function () {
      controller.abort();
      setRunning(false);
      appendLog("system", "Run cancelled", null);
    };

    fetch(API_BASE + "/hedge-fund/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        var reader = response.body.getReader();
        var decoder = new TextDecoder();
        var buffer = "";

        function pump() {
          return reader.read().then(function (result) {
            if (result.done) {
              setRunning(false);
              return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            var parts = buffer.split("\n\n");
            buffer = parts.pop() || "";
            parts.forEach(processSseBlock);
            return pump();
          });
        }

        function processSseBlock(block) {
          if (!block.trim()) return;
          var typeMatch = block.match(/^event:\s*(.+)$/m);
          var dataMatch = block.match(/^data:\s*(.+)$/m);
          if (!typeMatch || !dataMatch) return;
          var eventType = typeMatch[1].trim();
          var eventData;
          try {
            eventData = JSON.parse(dataMatch[1]);
          } catch (e) {
            return;
          }

          if (eventType === "progress" && eventData.agent) {
            var agent = String(eventData.agent).replace("_agent", "");
            appendLog(agent, eventData.status || "…", eventData.ticker);
            if (agent !== "backtest" && agent !== "system") {
              var base = agent.split("_").slice(0, -1).join("_") || agent;
              if (eventData.status === "Done") state.pipelineStatus[base] = "done";
              else state.pipelineStatus[base] = "running";
              renderPipeline(getSelectedAgents());
            }
          }

          if (eventType === "complete" && eventData.data) {
            state.decisions = eventData.data.decisions || {};
            state.analystSignals = eventData.data.analyst_signals || {};
            state.currentPrices = eventData.data.current_prices || {};
            agentKeys.forEach(function (k) {
              state.pipelineStatus[k] = "done";
            });
            state.pipelineStatus.portfolio_manager = "done";
            renderPipeline(agentKeys);
            renderDecisions();
            renderSignals();
            renderChart();
            updateMetrics();
            appendLog("system", "Run complete", null);
          }

          if (eventType === "error") {
            showBanner("error", eventData.message || "Run failed.");
            setRunning(false);
          }
        }

        return pump();
      })
      .catch(function (err) {
        if (err.name === "AbortError") return;
        showBanner("error", err.message || "Connection failed. Is the backend running?");
        setRunning(false);
        loadDemoResults();
      });
  }

  function initTabs() {
    document.querySelectorAll(".plt-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-tab");
        document.querySelectorAll(".plt-tab").forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        document.querySelectorAll(".plt-tab-panel").forEach(function (p) {
          p.classList.toggle("is-active", p.id === "plt-panel-" + target);
        });
      });
    });
  }

  function init() {
    els.apiHint = $("plt-api-hint");
    setApiHint();

    var endInput = $("plt-end-date");
    var startInput = $("plt-start-date");
    if (endInput) endInput.value = todayISO();
    if (startInput) startInput.value = daysAgoISO(90);

    initTabs();
    renderLog();
    renderDecisions();
    renderSignals();
    updateMetrics();
    renderChart();

    $("plt-run-btn") &&
      $("plt-run-btn").addEventListener("click", function () {
        runHedgeFund();
      });
    $("plt-abort-btn") &&
      $("plt-abort-btn").addEventListener("click", function () {
        if (state.abort) state.abort();
      });
    $("plt-demo-btn") &&
      $("plt-demo-btn").addEventListener("click", function () {
        loadDemoResults();
      });

    ["plt-tickers", "plt-cash"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("input", updateMetrics);
    });

    var apiInput = $("plt-api-base");
    if (apiInput) {
      apiInput.value = API_BASE;
      apiInput.addEventListener("change", function () {
        API_BASE = apiInput.value.replace(/\/$/, "");
        localStorage.setItem("spectr_api_base", API_BASE);
        setApiHint();
        pingBackend().then(fetchAgents);
      });
    }

    pingBackend().then(function () {
      fetchAgents();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
