(function () {
  "use strict";

  var SESSION_KEY = "spectr_shop_customer_v1";

  var state = {
    products: [],
    productsSummary: null,
    orders: [],
    ordersSummary: null,
    users: [],
    usersSummary: null,
    tab: "overview",
    filters: {
      products: { query: "", kind: "", stock: "", sort: "name" },
      orders: { query: "", status: "" },
      customers: { query: "", role: "" },
    },
    admin: null,
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
    } catch (_) {
      return null;
    }
  }

  function token() {
    var session = readSession();
    return session && session.accessToken ? session.accessToken : "";
  }

  function authHeaders(extra) {
    var headers = Object.assign({ Accept: "application/json" }, extra || {});
    var t = token();
    if (t) headers.Authorization = "Bearer " + t;
    return headers;
  }

  function toast(message, kind) {
    var node = document.querySelector(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.style.background = kind === "error" ? "#b3261e" : "#0b1726";
    requestAnimationFrame(function () {
      node.classList.add("is-visible");
    });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      node.classList.remove("is-visible");
    }, 2400);
  }

  function formatMoney(value) {
    var n = Number(value) || 0;
    return "€" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatNumber(value) {
    return (Number(value) || 0).toLocaleString();
  }

  function formatDate(value) {
    if (!value) return "—";
    try {
      var d = new Date(value);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch (_) {
      return "—";
    }
  }

  async function api(path, options) {
    var res = await fetch(path, Object.assign({ headers: authHeaders() }, options || {}));
    var data = {};
    try {
      data = await res.json();
    } catch (_) {
      data = {};
    }
    if (!res.ok) {
      var error = new Error(data.error || ("Request failed (" + res.status + ")"));
      error.status = res.status;
      throw error;
    }
    return data;
  }

  function setAdminPill(user) {
    state.admin = user;
    var pill = $("admin-pill");
    if (!pill) return;
    if (user && user.role === "admin") {
      pill.textContent = "Admin · " + (user.name || user.email);
      pill.classList.add("is-admin");
    } else if (user) {
      pill.textContent = "Signed in as " + (user.name || user.email);
      pill.classList.remove("is-admin");
    } else {
      pill.textContent = "Sign in to manage";
      pill.classList.remove("is-admin");
    }
  }

  async function loadAdminIdentity() {
    var session = readSession();
    if (!session || !session.accessToken) {
      setAdminPill(null);
      return null;
    }
    try {
      var data = await api("/api/admin/me");
      setAdminPill(data.admin);
      return data.admin;
    } catch (_) {
      setAdminPill(session);
      return null;
    }
  }

  function stockPill(stock) {
    if (stock <= 0) return '<span class="stock-pill stock-pill--out">Out</span>';
    if (stock <= 5) return '<span class="stock-pill stock-pill--low">Low</span>';
    return '<span class="stock-pill">In stock</span>';
  }

  function productDisplayName(item) {
    return [item.brand, item.name].filter(Boolean).join(" ") || "Untitled product";
  }

  function filterProducts() {
    var f = state.filters.products;
    var query = f.query.toLowerCase();
    var rows = state.products.filter(function (item) {
      var haystack = [item.name, item.brand, item.category, item.sku].join(" ").toLowerCase();
      if (f.kind && item.kind !== f.kind) return false;
      if (f.stock === "low" && !(item.stock > 0 && item.stock <= 5)) return false;
      if (f.stock === "out" && item.stock > 0) return false;
      if (f.stock === "ok" && item.stock <= 5) return false;
      if (query && haystack.indexOf(query) === -1) return false;
      return true;
    });

    rows.sort(function (a, b) {
      if (f.sort === "stock-asc") return a.stock - b.stock;
      if (f.sort === "stock-desc") return b.stock - a.stock;
      if (f.sort === "price-asc") return a.price - b.price;
      if (f.sort === "price-desc") return b.price - a.price;
      return productDisplayName(a).localeCompare(productDisplayName(b));
    });

    return rows;
  }

  function renderProductsTable() {
    var tbody = document.querySelector("#products-table tbody");
    if (!tbody) return;
    var rows = filterProducts();

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state">No products match this view.</div></td></tr>';
      return;
    }

    tbody.innerHTML = rows
      .map(function (item) {
        var key = item.kind + ":" + item.id;
        return (
          '<tr data-product="' + escapeHtml(key) + '">' +
          '<td><div class="col-name"><strong>' + escapeHtml(productDisplayName(item)) + '</strong><small>' + escapeHtml(item.category || "") + '</small></div></td>' +
          '<td><span class="kind-pill kind-' + escapeHtml(item.kind) + '">' + escapeHtml(item.kind) + '</span></td>' +
          '<td><code>' + escapeHtml(item.sku || "—") + '</code></td>' +
          '<td><input type="number" min="0" step="0.01" class="input-cell" data-field="price" value="' + escapeHtml(Number(item.price).toFixed(2)) + '" /></td>' +
          '<td><input type="number" min="0" step="1" class="input-cell" data-field="stock" value="' + escapeHtml(item.stock) + '" /></td>' +
          '<td>' + stockPill(item.stock) + '</td>' +
          '<td><label class="toggle-switch"><input type="checkbox" data-field="active"' + (item.active ? " checked" : "") + ' /><span class="slider"></span></label></td>' +
          '<td><button type="button" class="table-action" data-product-edit="' + escapeHtml(key) + '">Details</button></td>' +
          '</tr>'
        );
      })
      .join("");
  }

  function renderProductsSummary() {
    var summary = state.productsSummary || {};
    $("stat-products").textContent = formatNumber(summary.products);
    $("stat-stock").textContent = formatNumber(summary.totalStock);
    $("stat-low").textContent = formatNumber(summary.lowStock);
    $("stat-out").textContent = formatNumber(summary.outOfStock);
    $("stat-value").textContent = formatMoney(summary.inventoryValue);
  }

  function renderOverviewLowStock() {
    var list = $("overview-low-stock");
    if (!list) return;
    var rows = state.products
      .filter(function (item) { return item.stock <= 5; })
      .sort(function (a, b) { return a.stock - b.stock; })
      .slice(0, 8);

    if (!rows.length) {
      list.innerHTML = '<li class="empty-state">Everything looks stocked.</li>';
      return;
    }

    list.innerHTML = rows.map(function (item) {
      return (
        '<li>' +
        '<div class="list-meta">' +
          '<span class="list-title">' + escapeHtml(productDisplayName(item)) + '</span>' +
          '<span class="list-sub">' + escapeHtml(item.category || "") + ' · ' + escapeHtml(item.kind) + '</span>' +
        '</div>' +
        '<span class="list-value">' + escapeHtml(item.stock) + ' left ' + stockPill(item.stock) + '</span>' +
        '</li>'
      );
    }).join("");
  }

  function renderOverviewOrders() {
    var list = $("overview-orders");
    if (!list) return;
    var rows = state.orders.slice(0, 6);
    if (!rows.length) {
      list.innerHTML = '<li class="empty-state">No orders yet.</li>';
      return;
    }
    list.innerHTML = rows.map(function (order) {
      return (
        '<li>' +
        '<div class="list-meta">' +
          '<span class="list-title">' + escapeHtml(order.number || order.id) + '</span>' +
          '<span class="list-sub">' + escapeHtml(order.customer_name || order.customer_email || "Guest") + ' · ' + formatDate(order.created_at) + '</span>' +
        '</div>' +
        '<span class="list-value">' + formatMoney(order.total) + ' <span class="status-pill status-' + escapeHtml(order.status) + '">' + escapeHtml(order.status) + '</span></span>' +
        '</li>'
      );
    }).join("");
  }

  function renderOrdersSummary() {
    var summary = state.ordersSummary || {};
    $("stat-pending").textContent = formatNumber(summary.pending);
    $("stat-revenue").textContent = formatMoney(summary.revenue);
  }

  function renderUsersSummary() {
    var summary = state.usersSummary || {};
    $("stat-customers").textContent = formatNumber(summary.users);
  }

  function filterOrders() {
    var f = state.filters.orders;
    var query = f.query.toLowerCase();
    return state.orders.filter(function (order) {
      if (f.status && order.status !== f.status) return false;
      if (!query) return true;
      var haystack = [order.number, order.customer_email, order.customer_name, order.id].join(" ").toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  }

  function renderOrdersTable() {
    var tbody = document.querySelector("#orders-table tbody");
    if (!tbody) return;
    var rows = filterOrders();
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state">No orders to show.</div></td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(function (order) {
      var itemsCount = (order.items || []).reduce(function (sum, line) {
        return sum + (Number(line && line.qty) || 0);
      }, 0);
      return (
        '<tr data-order="' + escapeHtml(order.id) + '">' +
        '<td><strong>' + escapeHtml(order.number || order.id.slice(0, 8)) + '</strong></td>' +
        '<td><div class="col-name"><strong>' + escapeHtml(order.customer_name || "Guest") + '</strong><small>' + escapeHtml(order.customer_email || "—") + '</small></div></td>' +
        '<td>' + escapeHtml(itemsCount || (order.items || []).length) + '</td>' +
        '<td>' + formatMoney(order.total) + '</td>' +
        '<td>' +
          '<select class="status-select" data-order-status="' + escapeHtml(order.id) + '">' +
            ["pending","confirmed","shipped","delivered","cancelled"].map(function (s) {
              return '<option value="' + s + '"' + (order.status === s ? " selected" : "") + '>' + s + '</option>';
            }).join("") +
          '</select>' +
        '</td>' +
        '<td>' + formatDate(order.created_at) + '</td>' +
        '<td><button type="button" class="table-action" data-order-view="' + escapeHtml(order.id) + '">View</button></td>' +
        '</tr>'
      );
    }).join("");
  }

  function filterUsers() {
    var f = state.filters.customers;
    var query = f.query.toLowerCase();
    return state.users.filter(function (user) {
      if (f.role && user.role !== f.role) return false;
      if (!query) return true;
      var haystack = [user.email, user.name, user.role].join(" ").toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  }

  function renderUsersTable() {
    var tbody = document.querySelector("#customers-table tbody");
    if (!tbody) return;
    var rows = filterUsers();
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state">No customers match this view.</div></td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(function (user) {
      var canDelete = !state.admin || state.admin.id !== user.id;
      return (
        '<tr data-user="' + escapeHtml(user.id) + '">' +
        '<td><div class="col-name"><strong>' + escapeHtml(user.name || "—") + '</strong><small>' + (user.confirmed ? "Confirmed" : "Pending confirmation") + '</small></div></td>' +
        '<td>' + escapeHtml(user.email) + '</td>' +
        '<td>' +
          '<select class="role-select" data-user-role="' + escapeHtml(user.id) + '">' +
            ["customer","editor","admin"].map(function (r) {
              return '<option value="' + r + '"' + (user.role === r ? " selected" : "") + '>' + r + '</option>';
            }).join("") +
          '</select>' +
        '</td>' +
        '<td>' + formatDate(user.created_at) + '</td>' +
        '<td>' + formatDate(user.last_sign_in_at) + '</td>' +
        '<td>' +
          (canDelete
            ? '<button type="button" class="table-action table-action-danger" data-user-delete="' + escapeHtml(user.id) + '">Delete</button>'
            : '<span class="list-sub">You</span>') +
        '</td>' +
        '</tr>'
      );
    }).join("");
  }

  async function loadProducts() {
    try {
      var data = await api("/api/admin/supply");
      state.products = (data.items || []).map(function (item) {
        item.price = Number(item.price) || 0;
        item.stock = Number(item.stock) || 0;
        return item;
      });
      state.productsSummary = data.summary || null;
      renderProductsSummary();
      renderProductsTable();
      renderOverviewLowStock();
    } catch (err) {
      toast(err.message || "Could not load products.", "error");
    }
  }

  async function loadOrders() {
    try {
      var data = await api("/api/admin/orders");
      state.orders = data.orders || [];
      state.ordersSummary = data.summary || null;
      renderOrdersSummary();
      renderOrdersTable();
      renderOverviewOrders();
    } catch (err) {
      state.orders = [];
      state.ordersSummary = null;
      $("stat-pending").textContent = err.status === 401 || err.status === 403 ? "—" : "0";
      $("stat-revenue").textContent = err.status === 401 || err.status === 403 ? "—" : "€0.00";
      var tbody = document.querySelector("#orders-table tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state">' + escapeHtml(err.message || "Could not load orders.") + '</div></td></tr>';
      }
      var overview = $("overview-orders");
      if (overview) overview.innerHTML = '<li class="empty-state">' + escapeHtml(err.message || "Sign in as admin to view orders.") + '</li>';
    }
  }

  async function loadUsers() {
    try {
      var data = await api("/api/admin/users");
      state.users = data.users || [];
      state.usersSummary = data.summary || null;
      renderUsersSummary();
      renderUsersTable();
    } catch (err) {
      state.users = [];
      state.usersSummary = null;
      $("stat-customers").textContent = "—";
      var tbody = document.querySelector("#customers-table tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state">' + escapeHtml(err.message || "Sign in as admin to view customers.") + '</div></td></tr>';
      }
    }
  }

  async function saveProductField(kind, id, field, value, input) {
    var body = {};
    body[field] = value;
    if (input) input.classList.add("is-saving");
    try {
      var data = await api("/api/admin/products/" + encodeURIComponent(kind) + "/" + encodeURIComponent(id), {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
      });
      var updated = data.item;
      var idx = state.products.findIndex(function (p) { return p.kind === kind && p.id === id; });
      if (idx >= 0 && updated) state.products[idx] = updated;
      if (input) {
        input.classList.remove("is-saving");
        input.classList.add("is-saved");
        setTimeout(function () { input.classList.remove("is-saved"); }, 900);
      }
      recomputeProductsSummary();
      renderProductsSummary();
      renderProductsTable();
      renderOverviewLowStock();
      toast("Saved");
    } catch (err) {
      if (input) {
        input.classList.remove("is-saving");
        input.classList.add("is-error");
        setTimeout(function () { input.classList.remove("is-error"); }, 1400);
      }
      toast(err.message || "Could not save.", "error");
    }
  }

  function recomputeProductsSummary() {
    var totalStock = 0, lowStock = 0, outOfStock = 0, value = 0;
    state.products.forEach(function (item) {
      totalStock += item.stock;
      if (item.stock > 0 && item.stock <= 5) lowStock++;
      if (item.stock <= 0) outOfStock++;
      value += item.stock * item.price;
    });
    state.productsSummary = {
      products: state.products.length,
      totalStock: totalStock,
      lowStock: lowStock,
      outOfStock: outOfStock,
      inventoryValue: Number(value.toFixed(2)),
    };
  }

  function openOrderDrawer(order) {
    var drawer = $("order-drawer");
    var body = $("order-drawer-body");
    if (!drawer || !body) return;
    var items = Array.isArray(order.items) ? order.items : [];
    var rows = items.length
      ? items.map(function (line) {
          var qty = Number(line && line.qty) || 1;
          var price = Number(line && line.price) || 0;
          return (
            '<li><div class="list-meta"><span class="list-title">' + escapeHtml(line.name || line.partId || "Item") + '</span><span class="list-sub">Qty ' + qty + ' · ' + formatMoney(price) + ' each</span></div><span class="list-value">' + formatMoney(qty * price) + '</span></li>'
          );
        }).join("")
      : '<li class="empty-state">No line items captured.</li>';

    $("order-drawer-title").textContent = "Order " + (order.number || order.id);
    body.innerHTML =
      '<dl class="management-list" style="gap:6px;">' +
        '<li><div class="list-meta"><span class="list-sub">Customer</span><span class="list-title">' + escapeHtml(order.customer_name || "Guest") + '</span></div><span class="list-value">' + escapeHtml(order.customer_email || "—") + '</span></li>' +
        '<li><div class="list-meta"><span class="list-sub">Status</span><span class="list-title"><span class="status-pill status-' + escapeHtml(order.status) + '">' + escapeHtml(order.status) + '</span></span></div><span class="list-value">' + formatDate(order.created_at) + '</span></li>' +
        '<li><div class="list-meta"><span class="list-sub">Subtotal</span><span class="list-title">' + formatMoney(order.subtotal) + '</span></div><span class="list-value">Total ' + formatMoney(order.total) + '</span></li>' +
      '</dl>' +
      '<h3 style="margin-top:8px;">Items</h3>' +
      '<ul class="management-list">' + rows + '</ul>' +
      (order.notes ? '<h3 style="margin-top:8px;">Notes</h3><p>' + escapeHtml(order.notes) + '</p>' : "");

    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeOrderDrawer() {
    var drawer = $("order-drawer");
    if (!drawer) return;
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
  }

  async function saveOrderStatus(id, status) {
    try {
      var data = await api("/api/admin/orders/" + encodeURIComponent(id), {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status: status }),
      });
      var idx = state.orders.findIndex(function (o) { return o.id === id; });
      if (idx >= 0 && data.order) state.orders[idx] = data.order;
      recomputeOrdersSummary();
      renderOrdersSummary();
      renderOrdersTable();
      renderOverviewOrders();
      toast("Order updated");
    } catch (err) {
      toast(err.message || "Could not update order.", "error");
      loadOrders();
    }
  }

  function recomputeOrdersSummary() {
    var counts = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    var total = 0;
    state.orders.forEach(function (order) {
      if (counts[order.status] != null) counts[order.status]++;
      if (order.status !== "cancelled") total += Number(order.total) || 0;
    });
    state.ordersSummary = {
      orders: state.orders.length,
      pending: counts.pending,
      confirmed: counts.confirmed,
      shipped: counts.shipped,
      delivered: counts.delivered,
      cancelled: counts.cancelled,
      revenue: Number(total.toFixed(2)),
    };
  }

  async function saveUserRole(id, role) {
    try {
      var data = await api("/api/admin/users/" + encodeURIComponent(id), {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ role: role }),
      });
      var idx = state.users.findIndex(function (u) { return u.id === id; });
      if (idx >= 0 && data.user) state.users[idx] = data.user;
      renderUsersTable();
      toast("Role updated");
    } catch (err) {
      toast(err.message || "Could not update user.", "error");
      loadUsers();
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await api("/api/admin/users/" + encodeURIComponent(id), { method: "DELETE" });
      state.users = state.users.filter(function (u) { return u.id !== id; });
      state.usersSummary = {
        users: state.users.length,
        admins: state.users.filter(function (u) { return u.role === "admin"; }).length,
        customers: state.users.filter(function (u) { return u.role !== "admin"; }).length,
      };
      renderUsersSummary();
      renderUsersTable();
      toast("User deleted");
    } catch (err) {
      toast(err.message || "Could not delete user.", "error");
    }
  }

  function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll(".management-tab").forEach(function (btn) {
      var active = btn.dataset.tab === tab;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll(".management-section").forEach(function (section) {
      var active = section.dataset.panel === tab;
      section.classList.toggle("is-active", active);
      section.hidden = !active;
    });
  }

  function bindEvents() {
    document.querySelectorAll(".management-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchTab(btn.dataset.tab);
      });
    });

    document.querySelectorAll("[data-jump]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchTab(btn.dataset.jump);
      });
    });

    $("products-search").addEventListener("input", function (e) {
      state.filters.products.query = e.target.value || "";
      renderProductsTable();
    });
    $("products-kind").addEventListener("change", function (e) {
      state.filters.products.kind = e.target.value || "";
      renderProductsTable();
    });
    $("products-stock").addEventListener("change", function (e) {
      state.filters.products.stock = e.target.value || "";
      renderProductsTable();
    });
    $("products-sort").addEventListener("change", function (e) {
      state.filters.products.sort = e.target.value || "name";
      renderProductsTable();
    });
    $("products-refresh").addEventListener("click", loadProducts);

    var productsTable = $("products-table");
    productsTable.addEventListener("change", function (e) {
      var input = e.target.closest("input[data-field]");
      if (!input) return;
      var row = input.closest("tr");
      if (!row) return;
      var key = row.dataset.product || "";
      var sep = key.indexOf(":");
      var kind = key.slice(0, sep);
      var id = key.slice(sep + 1);
      var field = input.dataset.field;
      var value;
      if (field === "price") value = Math.max(0, Number(input.value) || 0);
      else if (field === "stock") value = Math.max(0, parseInt(input.value, 10) || 0);
      else if (field === "active") value = input.checked;
      else return;
      saveProductField(kind, id, field, value, input.tagName === "INPUT" && input.type !== "checkbox" ? input : null);
    });

    $("orders-search").addEventListener("input", function (e) {
      state.filters.orders.query = e.target.value || "";
      renderOrdersTable();
    });
    $("orders-status").addEventListener("change", function (e) {
      state.filters.orders.status = e.target.value || "";
      renderOrdersTable();
    });
    $("orders-refresh").addEventListener("click", loadOrders);

    var ordersTable = $("orders-table");
    ordersTable.addEventListener("change", function (e) {
      var select = e.target.closest("[data-order-status]");
      if (!select) return;
      saveOrderStatus(select.dataset.orderStatus, select.value);
    });
    ordersTable.addEventListener("click", function (e) {
      var view = e.target.closest("[data-order-view]");
      if (!view) return;
      var order = state.orders.find(function (o) { return o.id === view.dataset.orderView; });
      if (order) openOrderDrawer(order);
    });

    $("customers-search").addEventListener("input", function (e) {
      state.filters.customers.query = e.target.value || "";
      renderUsersTable();
    });
    $("customers-role").addEventListener("change", function (e) {
      state.filters.customers.role = e.target.value || "";
      renderUsersTable();
    });
    $("customers-refresh").addEventListener("click", loadUsers);

    var usersTable = $("customers-table");
    usersTable.addEventListener("change", function (e) {
      var select = e.target.closest("[data-user-role]");
      if (!select) return;
      saveUserRole(select.dataset.userRole, select.value);
    });
    usersTable.addEventListener("click", function (e) {
      var del = e.target.closest("[data-user-delete]");
      if (del) deleteUser(del.dataset.userDelete);
    });

    document.querySelectorAll("[data-drawer-close]").forEach(function (el) {
      el.addEventListener("click", closeOrderDrawer);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeOrderDrawer();
    });
  }

  document.addEventListener("DOMContentLoaded", async function () {
    bindEvents();
    await loadAdminIdentity();
    await loadProducts();
    await Promise.all([loadOrders(), loadUsers()]);
  });
})();
