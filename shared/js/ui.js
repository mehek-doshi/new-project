/*
 * Shared UI behaviour for every Neuleap app:
 * theme (dark/light, remembered per browser), icons (Lucide), overlays, toasts, tabs, sortable tables.
 */
(function () {
  "use strict";

  var THEME_KEY = "neuleap-theme";

  function readTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* storage unavailable: theme still applies for this page */
    }
    syncThemeButtons();
  }

  function syncThemeButtons() {
    var theme = document.documentElement.getAttribute("data-theme");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.innerHTML = '<i data-lucide="' + (theme === "light" ? "moon" : "sun") + '"></i>';
      btn.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    });
    refreshIcons();
  }

  // Apply the saved theme as early as possible to avoid a flash.
  document.documentElement.setAttribute("data-theme", readTheme() || "dark");

  function refreshIcons() {
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initials(name) {
    return String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (part) { return part.charAt(0); })
      .join("")
      .toUpperCase();
  }

  /* ---- Overlays (modal / drawer) ---- */
  var scrim;

  function ensureScrim() {
    if (!scrim) {
      scrim = document.createElement("div");
      scrim.className = "scrim";
      scrim.addEventListener("click", closeAll);
      document.body.appendChild(scrim);
    }
    return scrim;
  }

  function open(id) {
    var el = typeof id === "string" ? document.getElementById(id) : id;
    if (!el) return;
    ensureScrim().classList.add("is-open");
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    var target = el.querySelector("[autofocus]") || el;
    if (target === el && !el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    setTimeout(function () { target.focus({ preventScroll: true }); }, 50);
  }

  function close(id) {
    var el = typeof id === "string" ? document.getElementById(id) : id;
    if (!el) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal.is-open, .drawer.is-open") && scrim) {
      scrim.classList.remove("is-open");
    }
  }

  function closeAll() {
    document.querySelectorAll(".modal.is-open, .drawer.is-open").forEach(close);
  }

  /* ---- Toast ---- */
  function toast(message, icon) {
    var stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("role", "status");
      document.body.appendChild(stack);
    }
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<i data-lucide="' + (icon || "check-circle-2") + '"></i><span>' + escapeHtml(message) + "</span>";
    stack.appendChild(el);
    refreshIcons();
    setTimeout(function () { el.remove(); }, 3200);
  }

  /* ---- Tabs: [data-tabs] container with .tab[data-tab] buttons and [data-panel] siblings ---- */
  function initTabs(root) {
    (root || document).querySelectorAll("[data-tabs]").forEach(function (group) {
      var scope = group.closest("[data-tabs-scope]") || document;
      group.addEventListener("click", function (event) {
        var tab = event.target.closest("[data-tab]");
        if (!tab || tab.disabled) return;
        group.querySelectorAll("[data-tab]").forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        scope.querySelectorAll("[data-panel]").forEach(function (panel) {
          panel.hidden = panel.getAttribute("data-panel") !== tab.getAttribute("data-tab");
        });
        group.dispatchEvent(new CustomEvent("tabchange", { detail: tab.getAttribute("data-tab") }));
      });
    });
  }

  /* ---- Sortable tables: th.sortable[data-key] inside table[data-sortable] ---- */
  function initSortable(root) {
    (root || document).querySelectorAll("table[data-sortable]").forEach(function (table) {
      table.querySelectorAll("th.sortable").forEach(function (th, index) {
        th.addEventListener("click", function () {
          var col = Array.prototype.indexOf.call(th.parentNode.children, th);
          var dir = th.getAttribute("data-dir") === "asc" ? "desc" : "asc";
          table.querySelectorAll("th.sortable").forEach(function (o) { o.removeAttribute("data-dir"); });
          th.setAttribute("data-dir", dir);
          var body = table.tBodies[0];
          var rows = Array.prototype.slice.call(body.rows);
          rows.sort(function (a, b) {
            var x = a.cells[col].getAttribute("data-sort") || a.cells[col].textContent.trim();
            var y = b.cells[col].getAttribute("data-sort") || b.cells[col].textContent.trim();
            var nx = parseFloat(x), ny = parseFloat(y);
            var cmp = !isNaN(nx) && !isNaN(ny) ? nx - ny : x.localeCompare(y);
            return dir === "asc" ? cmp : -cmp;
          });
          rows.forEach(function (r) { body.appendChild(r); });
        });
      });
    });
  }

  /* ---- Global wiring ---- */
  document.addEventListener("click", function (event) {
    var t = event.target;
    var toggle = t.closest("[data-theme-toggle]");
    if (toggle) {
      applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
      return;
    }
    var opener = t.closest("[data-open]");
    if (opener) {
      event.preventDefault();
      open(opener.getAttribute("data-open"));
      return;
    }
    var closer = t.closest("[data-close]");
    if (closer) {
      event.preventDefault();
      var target = closer.getAttribute("data-close");
      if (target) close(target);
      else close(closer.closest(".modal, .drawer"));
      return;
    }
    var navToggle = t.closest("[data-nav-toggle]");
    if (navToggle) {
      document.querySelector(".app").classList.toggle("is-nav-open");
      return;
    }
    var collapse = t.closest("[data-collapse-toggle]");
    if (collapse) {
      var app = document.querySelector(".app");
      app.classList.toggle("is-collapsed");
      collapse.innerHTML = '<i data-lucide="' + (app.classList.contains("is-collapsed") ? "panel-left-open" : "panel-left-close") + '"></i>';
      refreshIcons();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAll();
  });

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(document.documentElement.getAttribute("data-theme"));
    initTabs();
    initSortable();
    refreshIcons();
  });

  window.NL = {
    open: open,
    close: close,
    closeAll: closeAll,
    toast: toast,
    icons: refreshIcons,
    initTabs: initTabs,
    initSortable: initSortable,
    escape: escapeHtml,
    initials: initials,
    syncTheme: syncThemeButtons
  };
})();
