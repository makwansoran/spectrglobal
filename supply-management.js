(function () {
  "use strict";

  var SESSION_KEY = "spectr_shop_customer_v1";
  var state = {
    items: [],
    selected: null,
    query: "",
    kind: "",
    stockFilter: "",
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function token() {
    var session = readSession();
    return session && session.accessToken ? session.accessToken : "";
  }

  function authHeaders(extra) {
    return Object.assign(
      {
        Accept: "application/json",
        Authorization: "Bearer " + token(),
      },
      extra || {}
    );
  }

  function showLocked(message) {
    $("admin-lock-message").textContent = message || "Sign in with an admin account to manage inventory.";
    $("admin-lock").hidden = false;
    $("supply-app").hidden = true;
  }

  function showApp() {
    $("admin-lock").hidden = true;
    $("supply-app").hidden = false;
  }

  function formatMoney(value) {
    return "€" + (Number(value) || 0).toFixed(2);
  }

  function toast(message) {
    var node = document.querySelector(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      document.body.appendChild(node);
    }
    node.textContent = message;
    requestAnimationFrame(function () {
      node.classList.add("is-visible");
    });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      node.classList.remove("is-visible");
    }, 2000);
  }

  async function api(path, options) {
    var res = await fetch(path, Object.assign({ headers: authHeaders() }, options || {}));
    var data = {};
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    if (!res.ok) {
      var error = new Error(data.error || "Request failed.");
      error.status = res.status;
      throw error;
    }
    return data;
  }

  async function verifyAdmin() {
    if (!token()) {
      showLocked("Sign in with Makwan's admin account to manage supply.");
      return false;
    }

    try {
      await api("/api/admin/me");
      showApp();
      return true;
    } catch (err) {
      showLocked(err.message || "Admin access required.");
      return false;
    }
  }

  function renderStats(summary) {
    $("stat-products").textContent = String(summary.products || 0);
    $("stat-stock").textContent = String(summary.totalStock || 0);
    $("stat-low").textContent = String(summary.lowStock || 0);
    $("stat-out").textContent = String(summary.outOfStock || 0);
    $("stat-value").textContent = formatMoney(summary.inventoryValue || 0);
  }

  function stockLabel(item) {
    if (item.stock <= 0) return '<span class="stock-pill stock-pill--out">Out</span>';
    if (item.stock <= 5) return '<span class="stock-pill stock-pill--low">Low</span>';
    return '<span class="stock-pill stock-pill--ok">In stock</span>';
  }

  function filteredItems() {
    var query = state.query.toLowerCase();
    return state.items.filter(function (item) {
      var haystack = [item.name, item.brand, item.category, item.sku].join(" ").toLowerCase();
      if (state.kind && item.kind !== state.kind) return false;
      if (state.stockFilter === "low" && !(item.stock > 0 && item.stock <= 5)) return false;
      if (state.stockFilter === "out" && item.stock > 0) return false;
      if (query && haystack.indexOf(query) === -1) return false;
      return true;
    });
  }

  function renderTable() {
    var tbody = document.querySelector("#supply-table tbody");
    var items = filteredItems();
    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state">No products match this view.</div></td></tr>';
      return;
    }

    tbody.innerHTML = items
      .map(function (item) {
        var active = item.active ? "Active" : "Hidden";
        var selected = state.selected && state.selected.kind === item.kind && state.selected.id === item.id ? " is-selected" : "";
        return (
          '<tr class="' + selected + '">' +
          '<td><strong>' + escapeHtml([item.brand, item.name].filter(Boolean).join(" ")) + '</strong><small>' + escapeHtml(item.category) + '</small></td>' +
          '<td>' + escapeHtml(item.kind) + '</td>' +
          '<td>' + escapeHtml(item.sku || "-") + '</td>' +
          '<td>' + formatMoney(item.price) + '</td>' +
          '<td><strong>' + escapeHtml(item.stock) + '</strong> ' + stockLabel(item) + '</td>' +
          '<td>' + escapeHtml(active) + '</td>' +
          '<td><button type="button" class="table-action" data-edit="' + escapeHtml(item.kind + ":" + item.id) + '">Edit</button></td>' +
          '</tr>'
        );
      })
      .join("");
  }

  function setEditorEnabled(item) {
    var isParts = item.kind === "parts";
    $("editor-category").disabled = !isParts;
    $("editor-sku").disabled = !isParts;
    $("editor-description").disabled = !isParts;
  }

  function openEditor(item) {
    state.selected = item;
    $("editor-title").textContent = [item.brand, item.name].filter(Boolean).join(" ");
    $("editor-note").textContent = item.kind === "parts"
      ? "Editing a general parts catalog record."
      : "Editing stock, price, status, and name for a derived catalog product.";
    $("editor-kind").value = item.kind;
    $("editor-id").value = item.id;
    $("editor-name").value = item.name || "";
    $("editor-category").value = item.category || "";
    $("editor-sku").value = item.sku || "";
    $("editor-price").value = Number(item.price) || 0;
    $("editor-stock").value = Number(item.stock) || 0;
    $("editor-description").value = (item.details && item.details.description) || "";
    $("editor-active").checked = item.active !== false;
    $("supply-form").hidden = false;
    setEditorEnabled(item);
    renderTable();
  }

  function closeEditor() {
    state.selected = null;
    $("editor-title").textContent = "Select a product";
    $("editor-note").textContent = "Choose a product from the table to edit it.";
    $("supply-form").hidden = true;
    renderTable();
  }

  async function loadSupply() {
    var tbody = document.querySelector("#supply-table tbody");
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state">Loading supply database...</div></td></tr>';
    var data = await api("/api/admin/supply");
    state.items = Array.isArray(data.items) ? data.items : [];
    renderStats(data.summary || {});
    renderTable();
  }

  async function saveEditor(event) {
    event.preventDefault();
    var kind = $("editor-kind").value;
    var id = $("editor-id").value;
    var payload = {
      name: $("editor-name").value.trim(),
      category: $("editor-category").value.trim(),
      sku: $("editor-sku").value.trim(),
      price: Number($("editor-price").value) || 0,
      stock: parseInt($("editor-stock").value, 10) || 0,
      description: $("editor-description").value.trim(),
      active: $("editor-active").checked,
    };

    var data = await api("/api/admin/products/" + encodeURIComponent(kind) + "/" + encodeURIComponent(id), {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });

    var index = state.items.findIndex(function (item) {
      return item.kind === kind && item.id === id;
    });
    if (index >= 0 && data.item) state.items[index] = data.item;
    toast("Product updated");
    openEditor(data.item || state.items[index]);
    renderStats({
      products: state.items.length,
      totalStock: state.items.reduce(function (sum, item) { return sum + item.stock; }, 0),
      lowStock: state.items.filter(function (item) { return item.stock > 0 && item.stock <= 5; }).length,
      outOfStock: state.items.filter(function (item) { return item.stock <= 0; }).length,
      inventoryValue: state.items.reduce(function (sum, item) { return sum + item.stock * item.price; }, 0),
    });
  }

  function bindEvents() {
    $("supply-refresh").addEventListener("click", function () {
      loadSupply().catch(function (err) {
        toast(err.message || "Could not refresh supply.");
      });
    });
    $("supply-search").addEventListener("input", function (event) {
      state.query = event.target.value || "";
      renderTable();
    });
    $("supply-kind").addEventListener("change", function (event) {
      state.kind = event.target.value || "";
      renderTable();
    });
    $("supply-stock-filter").addEventListener("change", function (event) {
      state.stockFilter = event.target.value || "";
      renderTable();
    });
    $("supply-table").addEventListener("click", function (event) {
      var button = event.target.closest("[data-edit]");
      if (!button) return;
      var parts = button.dataset.edit.split(":");
      var item = state.items.find(function (candidate) {
        return candidate.kind === parts[0] && candidate.id === parts.slice(1).join(":");
      });
      if (item) openEditor(item);
    });
    $("supply-form").addEventListener("submit", function (event) {
      saveEditor(event).catch(function (err) {
        toast(err.message || "Could not save product.");
      });
    });
    $("editor-cancel").addEventListener("click", closeEditor);
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindEvents();
    verifyAdmin().then(function (ok) {
      if (!ok) return;
      return loadSupply();
    }).catch(function (err) {
      showLocked(err.message || "Admin access required.");
    });
  });
})();
