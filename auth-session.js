/**
 * Spectr client session — localStorage (remember me) or sessionStorage.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "spectr_auth_session";
  var REMEMBER_KEY = "spectr_auth_remember";

  function rememberEnabled() {
    try {
      return localStorage.getItem(REMEMBER_KEY) === "1";
    } catch {
      return false;
    }
  }

  function store() {
    return rememberEnabled() ? localStorage : sessionStorage;
  }

  function setRemember(on) {
    try {
      if (on) localStorage.setItem(REMEMBER_KEY, "1");
      else localStorage.removeItem(REMEMBER_KEY);
    } catch {
      /* ignore */
    }
  }

  function getSession() {
    var raw = null;
    try {
      raw = store().getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveSession(payload, remember) {
    if (remember !== undefined) setRemember(!!remember);
    var data = {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      expires_at: payload.expires_at,
      user: payload.user,
    };
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      store().setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
    return data;
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  function isExpired(session) {
    if (!session || !session.expires_at) return false;
    var expiresMs = Number(session.expires_at) * 1000;
    return Date.now() >= expiresMs - 60 * 1000;
  }

  function authHeaders(session) {
    session = session || getSession();
    if (!session || !session.access_token) return {};
    return { Authorization: "Bearer " + session.access_token };
  }

  global.SpectrAuth = {
    getSession: getSession,
    saveSession: saveSession,
    clearSession: clearSession,
    isExpired: isExpired,
    authHeaders: authHeaders,
    setRemember: setRemember,
    rememberEnabled: rememberEnabled,
  };
})(typeof window !== "undefined" ? window : globalThis);
