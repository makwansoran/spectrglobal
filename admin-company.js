(function () {
  "use strict";

  var yearEl = document.getElementById("admin-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var messageEl = document.getElementById("admin-message");
  var gateEl = document.getElementById("admin-gate");
  var formWrap = document.getElementById("admin-form-wrap");
  var userBar = document.getElementById("admin-user-bar");
  var userLabel = document.getElementById("admin-user-label");
  var signoutBtn = document.getElementById("admin-signout");
  var form = document.getElementById("company-form");
  var formTitle = document.getElementById("form-title");
  var isPublicEl = document.getElementById("isPublic");
  var stockFields = document.getElementById("stock-fields");
  var previewLink = document.getElementById("preview-link");
  var slugEl = document.getElementById("slug");
  var nameEl = document.getElementById("name");
  var catalogMeta = document.getElementById("catalog-meta");
  var catalogFilter = document.getElementById("catalog-filter");
  var catalogTabs = document.getElementById("catalog-tabs");
  var catalogList = document.getElementById("catalog-list");
  var newCompanyBtn = document.getElementById("new-company-btn");
  var mainEl = document.querySelector(".admin-main");

  var catalogData = { sections: [], counts: {} };
  var activeSectionId = "companies";
  var selectedCompanySlug = "";

  function showMessage(text, type) {
    if (!messageEl) return;
    messageEl.textContent = text || "";
    messageEl.hidden = !text;
    messageEl.classList.remove("is-error", "is-success");
    if (type === "error") messageEl.classList.add("is-error");
    if (type === "success") messageEl.classList.add("is-success");
  }

  function setLoading(loading) {
    if (!form) return;
    form.querySelectorAll("button, input, select, textarea").forEach(function (el) {
      if (el.id === "catalog-filter") return;
      el.disabled = !!loading;
    });
    var submit = document.getElementById("submit-btn");
    if (submit && submit.dataset.label == null) submit.dataset.label = submit.textContent;
    if (submit && loading) submit.textContent = "Saving…";
    else if (submit && submit.dataset.label) submit.textContent = submit.dataset.label;
  }

  function normalizeSlug(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function slugFromName(name) {
    return normalizeSlug(name);
  }

  function authHeaders() {
    var session = window.SpectrAuth && SpectrAuth.getSession();
    return session ? SpectrAuth.authHeaders(session) : {};
  }

  function apiErrorMessage(data, fallback) {
    if (window.SpectrAuth && SpectrAuth.formatApiError) {
      return SpectrAuth.formatApiError(data, fallback);
    }
    var err = data && data.error;
    if (typeof err === "string" && err) return err;
    if (err && typeof err.message === "string") return err.message;
    return (data && data.message) || fallback || "Request failed";
  }

  async function apiGet(path) {
    var res = await fetch(path, { headers: Object.assign({ Accept: "application/json" }, authHeaders()) });
    var data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (!res.ok) {
      var err = new Error(apiErrorMessage(data, "Request failed"));
      err.status = res.status;
      throw err;
    }
    return data;
  }

  async function apiSend(method, path, body) {
    var res = await fetch(path, {
      method: method,
      headers: Object.assign({ "Content-Type": "application/json", Accept: "application/json" }, authHeaders()),
      body: JSON.stringify(body || {}),
    });
    var data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (!res.ok) {
      var err = new Error(apiErrorMessage(data, "Request failed"));
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function showGate() {
    if (gateEl) gateEl.hidden = false;
    if (formWrap) formWrap.hidden = true;
    if (userBar) userBar.hidden = true;
    if (mainEl) mainEl.classList.add("admin-main--gate");
  }

  function showForm(user) {
    if (gateEl) gateEl.hidden = true;
    if (formWrap) formWrap.hidden = false;
    if (userBar) userBar.hidden = false;
    if (mainEl) mainEl.classList.remove("admin-main--gate");
    if (userLabel) {
      userLabel.textContent = user.username ? "@" + user.username : user.email || "Editor";
    }
  }

  function getSection(id) {
    return catalogData.sections.find(function (s) {
      return s.id === id;
    });
  }

  function totalCatalogCount() {
    var n = 0;
    catalogData.sections.forEach(function (s) {
      n += (s.items && s.items.length) || 0;
    });
    return n;
  }

  function updateCatalogMeta() {
    if (!catalogMeta) return;
    var section = getSection(activeSectionId);
    var sectionCount = section && section.items ? section.items.length : 0;
    catalogMeta.textContent =
      totalCatalogCount() + " records · " + (section ? section.label : "") + ": " + sectionCount;
  }

  function renderCatalogTabs() {
    if (!catalogTabs) return;
    catalogTabs.innerHTML = "";
    catalogData.sections.forEach(function (section) {
      var count = (catalogData.counts && catalogData.counts[section.id]) || (section.items && section.items.length) || 0;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "admin-catalog-tab" + (section.id === activeSectionId ? " is-active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", section.id === activeSectionId ? "true" : "false");
      btn.textContent = section.label + " (" + count + ")";
      btn.dataset.sectionId = section.id;
      btn.addEventListener("click", function () {
        activeSectionId = section.id;
        renderCatalogTabs();
        renderCatalogList();
        updateCatalogMeta();
      });
      catalogTabs.appendChild(btn);
    });
  }

  function matchesFilter(item, q) {
    if (!q) return true;
    var hay = (item.name + " " + item.slug + " " + (item.meta || "")).toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function renderCatalogList() {
    if (!catalogList) return;
    var section = getSection(activeSectionId);
    var q = catalogFilter && catalogFilter.value ? catalogFilter.value.trim().toLowerCase() : "";
    catalogList.innerHTML = "";

    if (!section || !section.items || !section.items.length) {
      var empty = document.createElement("li");
      empty.className = "admin-catalog-empty";
      empty.textContent = "No items in this category.";
      catalogList.appendChild(empty);
      return;
    }

    var items = section.items.filter(function (item) {
      return matchesFilter(item, q);
    });

    if (!items.length) {
      var none = document.createElement("li");
      none.className = "admin-catalog-empty";
      none.textContent = "No matches for your filter.";
      catalogList.appendChild(none);
      return;
    }

    items.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "admin-catalog-item";

      if (section.editable) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "admin-catalog-link" + (item.slug === selectedCompanySlug ? " is-selected" : "");
        btn.innerHTML =
          '<span class="admin-catalog-name">' +
          escapeHtml(item.name) +
          '</span><span class="admin-catalog-slug">' +
          escapeHtml(item.slug) +
          (item.meta ? " · " + escapeHtml(item.meta) : "") +
          "</span>";
        btn.addEventListener("click", function () {
          loadCompanyIntoForm(item.slug);
        });
        li.appendChild(btn);
      } else {
        var a = document.createElement("a");
        a.className = "admin-catalog-link";
        a.href = item.url || "#";
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML =
          '<span class="admin-catalog-name">' +
          escapeHtml(item.name) +
          '</span><span class="admin-catalog-slug">' +
          escapeHtml(item.slug) +
          (item.meta ? " · " + escapeHtml(item.meta) : "") +
          "</span>";
        li.appendChild(a);
      }

      catalogList.appendChild(li);
    });
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value == null ? "" : String(value);
  }

  function clearCompanyForm() {
    if (!form) return;
    form.reset();
    setField("countryCode", "NO");
    setField("countryName", "Norway");
    setField("founded", "2000");
    setField("exchange", "OSL");
    setField("currency", "NOK");
    if (isPublicEl) isPublicEl.checked = false;
    if (stockFields) stockFields.hidden = true;
    var updateExisting = document.getElementById("updateExisting");
    if (updateExisting) updateExisting.checked = false;
    selectedCompanySlug = "";
    if (formTitle) formTitle.textContent = "Add company profile";
    if (previewLink) previewLink.hidden = true;
    renderCatalogList();
  }

  function fillFormFromProfile(profile) {
    if (!profile) return;
    var slug = profile.id || "";
    selectedCompanySlug = slug;
    setField("slug", slug);
    setField("name", profile.name);
    setField("legalName", profile.legalName || profile.name);
    setField("logoInitials", profile.logoInitials || "");
    setField("countryCode", profile.countryCode || "NO");
    setField("countryName", profile.countryName || "Norway");
    setField("headquarters", profile.headquarters || "");
    setField("founded", profile.founded || "2000");
    setField("industry", profile.industry || "energy");
    setField(
      "industryTags",
      Array.isArray(profile.industryTags) ? profile.industryTags.join(", ") : ""
    );
    setField("about", profile.about || "");
    setField("website", profile.website || "");

    var isPublic = !!(profile.isPublic || (profile.stock && profile.stock.ticker));
    if (isPublicEl) isPublicEl.checked = isPublic;
    if (stockFields) stockFields.hidden = !isPublic;
    if (profile.stock) {
      setField("ticker", profile.stock.ticker || "");
      setField("exchange", profile.stock.exchange || "OSL");
      setField("currency", profile.stock.currency || "NOK");
    }

    var updateExisting = document.getElementById("updateExisting");
    if (updateExisting) updateExisting.checked = true;

    if (formTitle) formTitle.textContent = "Edit company";
    if (previewLink && slug) {
      previewLink.href = "/company/" + encodeURIComponent(slug);
      previewLink.hidden = false;
    }
    renderCatalogList();
  }

  async function loadCompanyIntoForm(slug) {
    if (!slug) return;
    showMessage("");
    try {
      var data = await apiGet("/api/companies/" + encodeURIComponent(slug));
      fillFormFromProfile(data.profile);
      showMessage("Loaded " + (data.profile && data.profile.name ? data.profile.name : slug) + ".", "success");
    } catch (err) {
      showMessage(err.message || "Could not load company.", "error");
    }
  }

  async function loadCatalog() {
    if (catalogMeta) catalogMeta.textContent = "Loading catalog…";
    try {
      var data = await apiGet("/api/admin/catalog");
      catalogData = { sections: data.sections || [], counts: data.counts || {} };
      renderCatalogTabs();
      renderCatalogList();
      updateCatalogMeta();
    } catch (err) {
      if (catalogMeta) catalogMeta.textContent = "Could not load catalog.";
      showMessage(err.message || "Catalog unavailable.", "error");
    }
  }

  async function ensureEditorSession() {
    var session = window.SpectrAuth && SpectrAuth.getSession();
    if (!session || !session.access_token) {
      showGate();
      return;
    }

    if (SpectrAuth.isExpired(session) && session.refresh_token) {
      try {
        var refreshed = await apiSend("POST", "/api/auth/refresh", { refresh_token: session.refresh_token });
        SpectrAuth.saveSession(refreshed, SpectrAuth.rememberEnabled());
        session = SpectrAuth.getSession();
      } catch {
        SpectrAuth.clearSession();
        showGate();
        return;
      }
    }

    try {
      var me = await apiGet("/api/admin/me");
      showForm(me.user || {});
      await loadCatalog();

      var params = new URLSearchParams(window.location.search);
      var editSlug = params.get("slug") || params.get("company");
      if (editSlug) loadCompanyIntoForm(normalizeSlug(editSlug));
    } catch (err) {
      if (err && err.status === 403) {
        showMessage(err.message || "Editor access required.", "error");
      }
      showGate();
    }
  }

  if (isPublicEl && stockFields) {
    isPublicEl.addEventListener("change", function () {
      stockFields.hidden = !isPublicEl.checked;
    });
  }

  if (nameEl && slugEl) {
    nameEl.addEventListener("blur", function () {
      if (!slugEl.value.trim() && nameEl.value.trim()) {
        slugEl.value = slugFromName(nameEl.value);
      }
    });
  }

  if (catalogFilter) {
    catalogFilter.addEventListener("input", function () {
      renderCatalogList();
    });
  }

  if (newCompanyBtn) {
    newCompanyBtn.addEventListener("click", function () {
      clearCompanyForm();
      showMessage("");
    });
  }

  if (signoutBtn) {
    signoutBtn.addEventListener("click", function () {
      if (window.SpectrAuth) SpectrAuth.clearSession();
      window.location.href = "login.html?next=/admin-company.html";
    });
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      showMessage("");
      setLoading(true);

      var fd = new FormData(form);
      var slug = normalizeSlug(fd.get("slug"));
      var body = {
        slug: slug,
        name: String(fd.get("name") || "").trim(),
        legalName: String(fd.get("legalName") || "").trim(),
        logoInitials: String(fd.get("logoInitials") || "").trim(),
        countryCode: String(fd.get("countryCode") || "NO").trim(),
        countryName: String(fd.get("countryName") || "Norway").trim(),
        headquarters: String(fd.get("headquarters") || "").trim(),
        founded: fd.get("founded"),
        industry: fd.get("industry"),
        industryTags: fd.get("industryTags"),
        about: fd.get("about"),
        website: fd.get("website"),
        searchTerms: fd.get("searchTerms"),
        isPublic: fd.get("isPublic") === "1",
        ticker: fd.get("ticker"),
        exchange: fd.get("exchange"),
        currency: fd.get("currency"),
      };

      var updateExisting = document.getElementById("updateExisting");
      var method = updateExisting && updateExisting.checked ? "PUT" : "POST";
      var path = method === "PUT" ? "/api/admin/companies/" + encodeURIComponent(slug) : "/api/admin/companies";

      try {
        var result = await apiSend(method, path, body);
        selectedCompanySlug = slug;
        showMessage(result.message || "Saved.", "success");
        if (previewLink && result.url) {
          previewLink.href = result.url;
          previewLink.hidden = false;
        }
        if (formTitle) formTitle.textContent = "Edit company";
        var updateCb = document.getElementById("updateExisting");
        if (updateCb) updateCb.checked = true;
        await loadCatalog();
      } catch (err) {
        showMessage(err.message || "Could not save company.", "error");
      } finally {
        setLoading(false);
      }
    });
  }

  ensureEditorSession();
})();
