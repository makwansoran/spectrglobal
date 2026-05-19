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
  var isPublicEl = document.getElementById("isPublic");
  var stockFields = document.getElementById("stock-fields");
  var previewLink = document.getElementById("preview-link");
  var slugEl = document.getElementById("slug");
  var nameEl = document.getElementById("name");

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
  }

  function showForm(user) {
    if (gateEl) gateEl.hidden = true;
    if (formWrap) formWrap.hidden = false;
    if (userBar) userBar.hidden = false;
    if (userLabel) {
      userLabel.textContent = user.username ? "@" + user.username : user.email || "Editor";
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
        showMessage(result.message || "Saved.", "success");
        if (previewLink && result.url) {
          previewLink.href = result.url;
          previewLink.hidden = false;
        }
      } catch (err) {
        showMessage(err.message || "Could not save company.", "error");
      } finally {
        setLoading(false);
      }
    });
  }

  ensureEditorSession();
})();
