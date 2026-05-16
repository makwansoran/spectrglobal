(function (global) {
  "use strict";

  var STORAGE_KEY = "spectr_session";
  var listeners = [];

  function getApiRoot() {
    if (global.SPECTR_PLATFORM && global.SPECTR_PLATFORM.apiRoot) {
      return String(global.SPECTR_PLATFORM.apiRoot).replace(/\/$/, "");
    }
    return "";
  }

  function readSession() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s.token || !s.expires || Date.now() > s.expires) {
        clearSession();
        return null;
      }
      return s;
    } catch (e) {
      return null;
    }
  }

  function writeSession(data, remember) {
    var payload = JSON.stringify(data);
    sessionStorage.setItem(STORAGE_KEY, payload);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, payload);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    notify();
  }

  function clearSession() {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    notify();
  }

  function notify() {
    listeners.forEach(function (fn) {
      try {
        fn();
      } catch (e) {}
    });
  }

  var SpectrAuth = {
    isAuthenticated: function () {
      return !!readSession();
    },

    getToken: function () {
      var s = readSession();
      return s ? s.token : null;
    },

    getEmail: function () {
      var s = readSession();
      return s ? s.email : null;
    },

    onChange: function (fn) {
      listeners.push(fn);
      return function () {
        listeners = listeners.filter(function (f) {
          return f !== fn;
        });
      };
    },

    login: function (email, password, remember) {
      return fetch(getApiRoot() + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) {
            throw new Error(data.error || "Login failed");
          }
          writeSession(
            {
              token: data.token,
              expires: data.expires,
              email: data.email || email,
            },
            !!remember
          );
          return data;
        });
      });
    },

    logout: function () {
      clearSession();
    },

    verifySession: function () {
      var token = SpectrAuth.getToken();
      if (!token) return Promise.resolve(false);
      return fetch(getApiRoot() + "/api/auth/session", {
        headers: { Authorization: "Bearer " + token },
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (!data.authenticated) {
            clearSession();
            return false;
          }
          return true;
        })
        .catch(function () {
          return !!readSession();
        });
    },

    authHeaders: function () {
      var token = SpectrAuth.getToken();
      if (!token) return {};
      return { Authorization: "Bearer " + token };
    },

    /** Protected hedge fund API (same origin proxy). */
    hedgeFundBase: function () {
      return getApiRoot() + "/api/hedge-fund";
    },
  };

  global.SpectrAuth = SpectrAuth;
})(window);
