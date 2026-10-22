/* Talents Scooper: app shell (sidebar + top bar) and page behaviour, following the current app screens. */
(function () {
  "use strict";

  var D = window.TS_DATA;
  var esc = function (v) { return NL.escape(v); };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var NAV = [
    { key: "dashboard", label: "Dashboard", icon: "layout-grid", href: "index.html" },
    { key: "banks", label: "Question Banks", icon: "bar-chart-3", href: "question-banks.html" },
    { key: "schedule", label: "Interview Schedule", icon: "mic", href: "interview-schedule.html" },
    { key: "usage", label: "Token Usage", icon: "circle-dollar-sign", href: "token-usage.html" }
  ];

  var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var USER = { name: "Mehek Doshi", email: "mehek.doshi@neuleap.ai" };

  function avatar(name) {
    return '<span class="avatar avatar--brand">' + esc(NL.initials(name)) + "</span>";
  }

  function person(name) {
    return '<div class="ts-person">' + avatar(name) + "<span>" + esc(name) + "</span></div>";
  }

  function sortIcon() {
    return '<i class="sort" data-lucide="arrow-down-up"></i>';
  }

  /* ---------- Shell ---------- */
  function renderShell() {
    var app = $(".app");
    var active = app.getAttribute("data-nav");
    var title = app.getAttribute("data-title");

    $("[data-sidebar]").innerHTML =
      '<div class="sidebar__brand ts-brand"><a class="logo" href="index.html"><span class="brand-tile"><img src="../shared/img/neuleap-mark.svg" alt=""></span>' +
      '<span class="logo__stack"><span class="logo__word">Talents Scooper</span><span class="logo__sub">@neuleap.ai</span></span></a>' +
      '<button class="icon-btn icon-btn--plain sidebar__collapse" data-collapse-toggle aria-label="Collapse sidebar"><i data-lucide="panel-left-close"></i></button></div>' +
      '<nav class="sidebar__nav" aria-label="Main">' + NAV.map(function (n) {
        var on = n.key === active;
        return '<a class="nav-item' + (on ? " is-active" : "") + '" href="' + n.href + '"' + (on ? ' aria-current="page"' : "") + ' title="' + n.label + '"><i data-lucide="' + n.icon + '"></i><span>' + n.label + "</span></a>";
      }).join("") + "</nav>" +
      '<div class="sidebar__footer">' +
      '<button class="signout" id="signout" title="Sign out"><i data-lucide="log-out"></i><span class="signout__text"><strong>Sign out</strong><span>' + esc(USER.email) + "</span></span></button>" +
      '<span class="version">Version v1.6.4</span></div>';

    if (app.hasAttribute("data-back")) {
      $("[data-topbar]").innerHTML =
        '<button class="icon-btn menu-toggle" data-nav-toggle aria-label="Open menu"><i data-lucide="menu"></i></button>' +
        '<a class="ts-back" href="' + app.getAttribute("data-back") + '"><i data-lucide="arrow-left"></i>Back</a>';
    } else {
      $("[data-topbar]").innerHTML =
        '<button class="icon-btn menu-toggle" data-nav-toggle aria-label="Open menu"><i data-lucide="menu"></i></button>' +
        '<h1 class="t-page-title">' + esc(title) + "</h1>" +
        '<button class="icon-btn" id="refresh" aria-label="Refresh"><i data-lucide="refresh-cw"></i></button>' +
        '<label class="search grow"><i data-lucide="search"></i><span class="sr-only">Search</span><input class="input" id="search" type="search" placeholder="Search"></label>' +
        '<div class="month-picker"><button class="select" id="month-btn" aria-haspopup="dialog" aria-expanded="false"><i data-lucide="calendar"></i><span id="month-label"></span><i data-lucide="chevron-down"></i></button>' +
        '<div class="date-pick" id="month-menu" role="dialog" aria-label="Choose month and year" hidden>' +
        '<label class="date-pick__field"><span class="t-overline">Month</span><span class="select"><select id="pick-month">' + MONTHS_LONG.map(function (m, i) { return '<option value="' + i + '">' + m + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></span></label>' +
        '<label class="date-pick__field"><span class="t-overline">Year</span><span class="select"><select id="pick-year">' + [2024, 2025, 2026, 2027].map(function (y) { return '<option value="' + y + '">' + y + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></span></label>' +
        "</div></div>" +
        '<span class="env-badge" title="Environment">PROD</span>' +
        '<button class="icon-btn" data-theme-toggle aria-label="Toggle theme"></button>' +
        '<button class="icon-btn" aria-label="Notifications (2)" id="notif-btn"><i data-lucide="bell"></i><span class="badge-count">2</span></button>' +
        avatar(USER.name);
      initTopbar(new Date(2026, 0, 1));
    }
    NL.syncTheme();

    $("#signout").addEventListener("click", function () { NL.toast("Signed out", "log-out"); });
  }

  function initTopbar(now) {
    var menu = $("#month-menu");
    var btn = $("#month-btn");
    var pickMonth = $("#pick-month");
    var pickYear = $("#pick-year");
    pickMonth.value = String(now.getMonth());
    pickYear.value = String(now.getFullYear());
    function showMonth() { $("#month-label").textContent = MONTHS_LONG[+pickMonth.value] + " " + pickYear.value; }
    function setOpen(open) {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    showMonth();
    btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(menu.hidden); });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });
    [pickMonth, pickYear].forEach(function (sel) {
      sel.addEventListener("change", function () {
        showMonth();
        NL.toast("Showing candidates for " + $("#month-label").textContent, "calendar");
      });
    });
    document.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

    $("#refresh").addEventListener("click", function () {
      var icon = this.querySelector("svg");
      if (icon) icon.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 600 });
      NL.toast("Data refreshed");
    });
    $("#notif-btn").addEventListener("click", function () { NL.toast("2 new candidates were added to the pipeline", "bell"); });
    $("#search").addEventListener("input", function () {
      var q = this.value.trim().toLowerCase();
      $all("table[data-searchable] tbody tr").forEach(function (tr) {
        tr.hidden = q && tr.textContent.toLowerCase().indexOf(q) === -1;
      });
    });
  }

  function closeMenus() {
    $all("[data-menu]").forEach(function (m) { m.hidden = true; });
  }

  /* ---------- Round history modal (View History) ---------- */
  function historyModal() {
    return '<div class="modal" id="history-modal" role="dialog" aria-labelledby="history-title" aria-hidden="true">' +
      '<div class="modal__header"><div class="grow"><h2 class="t-title" id="history-title">Round history</h2><p class="t-body text-muted" id="history-sub"></p></div>' +
      '<button class="icon-btn icon-btn--round" data-close aria-label="Close"><i data-lucide="x"></i></button></div>' +
      '<div class="modal__body"><ol class="timeline">' + D.history.map(function (h) {
        var pending = h.result === "Pending";
        return '<li><span class="timeline__dot' + (pending ? " timeline__dot--pending" : "") + '"><i data-lucide="' + (pending ? "clock" : "check") + '"></i></span>' +
          '<div class="col gap-4"><div class="row wrap"><strong class="t-body-strong text-strong">' + h.round + '</strong><span class="t-small text-muted">' + h.role + "</span>" +
          '<span class="spacer"></span><span class="chip ' + (pending ? "chip--amber" : "chip--success") + '">' + h.result + "</span></div>" +
          '<span class="t-small text-muted">' + esc(h.by) + " · " + h.date + "</span>" +
          (h.note ? '<p class="t-body">' + esc(h.note) + "</p>" : "") + "</div></li>";
      }).join("") + "</ol></div></div>";
  }

  function openHistory(name) {
    $("#history-sub").textContent = name;
    NL.open("history-modal");
  }

  /* ---------- Dashboard ---------- */
  var TABS = [
    { key: "new", label: "New Candidates" },
    { key: "processing", label: "Processing" },
    { key: "hired", label: "Hired" },
    { key: "rejected", label: "Rejected" },
    { key: "undecided", label: "Undecided" }
  ];

  function agingSort(a) { return parseFloat(a) * (/h/.test(a) ? 1 : 24); }

  function check(on, label) {
    return '<label class="check" title="' + label + '"><input type="checkbox"' + (on ? " checked" : "") + ' aria-label="' + label + '"></label>';
  }

  function dashboardTable(tab) {
    var rows = D.pipeline[tab];
    var head, body;
    var base = function (c) {
      return "<td>" + person(c.name) + '</td><td class="num" data-sort="' + agingSort(c.aging) + '">' + c.aging + '</td><td data-sort="' + Date.parse(c.received) + '">' + c.received + '</td><td class="num" data-sort="' + c.experience + '">' + c.experience + " y</td><td>" + esc(c.college) + "</td>";
    };
    var baseHead = '<th>Name</th><th class="num sortable">Aging' + sortIcon() + '</th><th class="sortable">Received' + sortIcon() + '</th><th class="num">Experience</th><th>College</th>';

    if (tab === "new") {
      head = baseHead + "<th>Status</th><th>Reason</th>";
      body = rows.map(function (c) {
        return '<tr class="is-clickable" data-id="' + c.id + '">' + base(c) + "<td" + (c.status === "Failed" ? ' class="text-error"' : "") + ">" + c.status + "</td><td>" + esc(c.reason) + "</td></tr>";
      }).join("");
    } else if (tab === "hired") {
      head = '<th>Name</th><th>Role</th><th>Joining Date</th><th>History</th><th class="center">Offer Letter</th><th class="wrap">Offer Reply</th><th class="center">IT Asset Allocated</th><th class="center">Induction Scheduled</th><th class="center">BG Verified</th><th class="center">Buddy Assigned</th>';
      body = rows.map(function (c) {
        var accepted = c.offerReply === "Accepted";
        var box = function (on, label) { return '<td class="center">' + (accepted ? check(on, label) : "-") + "</td>"; };
        return '<tr data-id="' + c.id + '"><td>' + person(c.name) + "</td>" +
          '<td><span class="inline-select"><select aria-label="Role for ' + esc(c.name) + '">' + ["Gen AI", "Data Engineer", "UX Designer"].map(function (r) { return "<option" + (r === c.role ? " selected" : "") + ">" + r + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></span></td>' +
          '<td><span class="cell-date">' + c.joining + '<i data-lucide="calendar"></i></span></td>' +
          '<td><button class="link-u" data-history="' + esc(c.name) + '">View History</button></td>' +
          '<td class="center">' + check(c.offerLetter, "Offer letter sent") + '</td><td class="center">' + c.offerReply + "</td>" +
          box(c.itAsset, "IT asset allocated") + box(c.induction, "Induction scheduled") + box(c.bgVerified, "BG verified") + box(c.buddy, "Buddy assigned") + "</tr>";
      }).join("");
    } else {
      head = baseHead + "<th>History</th>";
      body = rows.map(function (c) {
        return '<tr class="is-clickable" data-id="' + c.id + '">' + base(c) + '<td><button class="link-u" data-history="' + esc(c.name) + '">View History</button></td></tr>';
      }).join("");
    }
    return '<table class="ts-table" data-sortable data-searchable><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table>";
  }

  function initDashboard() {
    var tabsEl = $("#status-tabs");
    var panel = $("#status-panel");
    var current = (location.hash || "#new").slice(1);
    if (!D.pipeline[current]) current = "new";

    function render() {
      tabsEl.innerHTML = TABS.map(function (t) {
        var on = t.key === current;
        return '<button class="utab' + (on ? " is-active" : "") + '" role="tab" aria-selected="' + on + '" data-status-tab="' + t.key + '">' + t.label + " (" + D.pipeline[t.key].length + ")</button>";
      }).join("");
      panel.innerHTML = dashboardTable(current);
      NL.initSortable(panel);
      NL.icons();
      var q = $("#search");
      if (q && q.value) q.dispatchEvent(new Event("input"));
    }

    tabsEl.addEventListener("click", function (e) {
      var t = e.target.closest("[data-status-tab]");
      if (!t) return;
      current = t.getAttribute("data-status-tab");
      history.replaceState(null, "", "#" + current);
      render();
    });

    panel.addEventListener("click", function (e) {
      var h = e.target.closest("[data-history]");
      if (h) { e.stopPropagation(); openHistory(h.getAttribute("data-history")); return; }
      if (e.target.closest("input, label, select, button")) return;
      var row = e.target.closest("tr.is-clickable");
      if (row) location.href = "candidate.html?id=" + row.getAttribute("data-id");
    });

    panel.addEventListener("change", function (e) {
      if (e.target.type === "checkbox") NL.toast((e.target.checked ? "Marked: " : "Unmarked: ") + e.target.getAttribute("aria-label"));
      if (e.target.tagName === "SELECT") NL.toast("Role updated to " + e.target.value);
    });

    $("#run-pipeline").addEventListener("click", function () {
      var btn = this;
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-circle"></i>Running…';
      NL.icons();
      setTimeout(function () {
        D.pipeline.new.forEach(function (c) { c.status = "Success"; c.reason = "-"; });
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="play"></i>Run Pipeline';
        render();
        NL.toast("Pipeline finished — " + D.pipeline.new.length + " resumes processed");
      }, 1600);
    });

    window.addEventListener("hashchange", function () {
      var key = location.hash.slice(1);
      if (D.pipeline[key]) { current = key; render(); }
    });

    render();
  }

  /* ---------- Interview schedule ---------- */
  function slotChip(slot) {
    var cls = { Open: "chip--success", Confirmed: "chip--info", Busy: "chip--error", Tentative: "chip--warning", Pending: "" }[slot];
    return '<span class="chip ' + cls + '">' + slot + "</span>";
  }

  function initSchedule() {
    var body = $("#schedule-body");
    var activeRow = null;
    var choice = null;

    function render() {
      body.innerHTML = D.schedule.map(function (r, i) {
        var assign = r.slot === "Open" || r.slot === "Pending";
        return '<tr data-row="' + i + '"><td>' + person(r.name) + '</td><td class="num" data-sort="' + agingSort(r.aging) + '">' + r.aging + "</td><td>" + r.role + "</td><td>" + r.stage + "</td><td>" + esc(r.interviewer) + "</td><td>" + slotChip(r.slot) + "</td>" +
          '<td><button class="btn-assign' + (assign ? "" : " btn-assign--reassign") + '" data-assign="' + i + '">' + (assign ? "Assign" : "Reassign") + "</button></td></tr>";
      }).join("");
      NL.icons();
    }

    function renderOverlay() {
      var r = D.schedule[activeRow];
      $("#assign-sub").textContent = r.name + " · " + r.role + " · " + r.stage;
      $("#interviewer-list").innerHTML = D.interviewers.map(function (iv, i) {
        var selected = choice && choice.i === i;
        return '<div class="interviewer' + (selected ? " is-selected" : "") + '" data-iv="' + i + '">' +
          '<div class="row gap-12">' + avatar(iv.name) + '<div class="grow"><div class="t-body-strong text-strong">' + esc(iv.name) + '</div><div class="t-small text-muted">This week: ' + iv.load + " interview" + (iv.load === 1 ? "" : "s") + "</div></div>" +
          (iv.name === r.interviewer ? '<span class="chip chip--info">Suggested</span>' : "") + "</div>" +
          '<div class="slot-list">' + iv.slots.map(function (s, j) {
            return '<button class="slot' + (selected && choice.j === j ? " is-active" : "") + '" data-slot="' + j + '">' + s + "</button>";
          }).join("") + "</div></div>";
      }).join("");
      var confirm = $("#confirm-assign");
      confirm.disabled = !choice;
      confirm.textContent = choice ? "Confirm Assignment · " + D.interviewers[choice.i].name + ", " + D.interviewers[choice.i].slots[choice.j] : "Select an interviewer and slot";
    }

    body.addEventListener("click", function (e) {
      var b = e.target.closest("[data-assign]");
      if (!b) return;
      activeRow = +b.getAttribute("data-assign");
      var r = D.schedule[activeRow];
      var suggested = D.interviewers.findIndex(function (iv) { return iv.name === r.interviewer; });
      choice = suggested >= 0 ? { i: suggested, j: 0 } : null;
      renderOverlay();
      NL.open("assign-modal");
    });

    $("#interviewer-list").addEventListener("click", function (e) {
      var card = e.target.closest("[data-iv]");
      if (!card) return;
      var slot = e.target.closest("[data-slot]");
      choice = { i: +card.getAttribute("data-iv"), j: slot ? +slot.getAttribute("data-slot") : 0 };
      renderOverlay();
    });

    $("#confirm-assign").addEventListener("click", function () {
      if (!choice) return;
      var r = D.schedule[activeRow];
      var iv = D.interviewers[choice.i];
      r.interviewer = iv.name;
      r.slot = "Confirmed";
      iv.load += 1;
      NL.close("assign-modal");
      render();
      NL.toast(r.name + " assigned to " + iv.name + ", " + iv.slots[choice.j]);
    });

    render();
    NL.initSortable($(".ts-panel"));
  }

  /* ---------- Question banks ---------- */
  function initBanks() {
    var roleFilter = "All";
    var activeRow = null;
    var activeTag = null;
    var ROLES = ["Data Engineer", "Gen AI", "UX Designer"];

    function renderQueue() {
      var rows = D.banks.queue.map(function (q, i) { return { q: q, i: i }; }).filter(function (x) { return roleFilter === "All" || x.q.role === roleFilter; });
      $("#queue-body").innerHTML = rows.map(function (x) {
        var q = x.q;
        return '<tr><td class="ts-name">' + esc(q.name) + '</td><td class="num"><span class="inline-select"><select data-role="' + x.i + '" aria-label="Role for ' + esc(q.name) + '">' + ROLES.map(function (r) { return "<option" + (r === q.role ? " selected" : "") + ">" + r + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></span></td>' +
          '<td class="num">' + q.stage + "</td><td>" + esc(q.interviewer) + '</td><td class="center">' +
          (q.assigned ? '<button class="btn-assign is-assigned" data-bank="' + x.i + '">Assigned</button>' : '<button class="btn-assign" data-bank="' + x.i + '">Assign Bank</button>') + "</td></tr>";
      }).join("") || '<tr><td colspan="5" class="t-body text-muted" style="padding:24px 12px">No interviews for ' + roleFilter + "</td></tr>";
      NL.icons();
    }

    $("#role-filter").addEventListener("click", function (e) {
      e.stopPropagation();
      var menu = $("#role-menu");
      menu.hidden = !menu.hidden;
    });
    $("#role-menu").addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]");
      if (!b) return;
      roleFilter = b.getAttribute("data-filter");
      $("#role-filter").classList.toggle("text-link", roleFilter !== "All");
      this.hidden = true;
      renderQueue();
    });
    document.addEventListener("click", closeMenus);

    $("#queue-body").addEventListener("change", function (e) {
      var sel = e.target.closest("[data-role]");
      if (!sel) return;
      D.banks.queue[+sel.getAttribute("data-role")].role = sel.value;
      NL.toast("Role updated to " + sel.value);
    });

    $("#queue-body").addEventListener("click", function (e) {
      var b = e.target.closest("[data-bank]");
      if (!b) return;
      var q = D.banks.queue[+b.getAttribute("data-bank")];
      if (q.assigned) {
        q.assigned = false;
        renderQueue();
        NL.toast("Bank unassigned from " + q.name);
        return;
      }
      activeRow = +b.getAttribute("data-bank");
      $("#bank-sub").textContent = q.name + " · " + q.role + " · " + q.stage + " · " + q.interviewer;
      renderBank();
      NL.open("bank-modal");
    });

    function renderBank() {
      var counts = {};
      D.banks.questions.forEach(function (q) { counts[q.tag] = (counts[q.tag] || 0) + 1; });
      $("#tag-filter").innerHTML = '<button class="tag' + (!activeTag ? " is-active" : "") + '" data-tag="">All · ' + D.banks.questions.length + "</button>" +
        Object.keys(counts).map(function (t) { return '<button class="tag' + (activeTag === t ? " is-active" : "") + '" data-tag="' + esc(t) + '">' + esc(t) + " · " + counts[t] + "</button>"; }).join("");
      $("#question-list").innerHTML = D.banks.questions.map(function (q, i) {
        if (activeTag && q.tag !== activeTag) return "";
        var lvl = q.level === "Hard" ? "chip--error" : q.level === "Easy" ? "chip--success" : "chip--warning";
        return '<label class="question"><span class="check"><input type="checkbox" data-q="' + i + '"' + (q.off ? "" : " checked") + ' aria-label="Include question"></span><span class="col gap-8 grow"><span class="text-strong">' + esc(q.text) + '</span><span class="row wrap"><span class="chip chip--info">' + esc(q.tag) + '</span><span class="chip ' + lvl + '">' + q.level + "</span></span></span></label>";
      }).join("");
      updateSelected();
      NL.icons();
    }

    function updateSelected() {
      var n = D.banks.questions.filter(function (q) { return !q.off; }).length;
      $("#selected-count").textContent = n + " questions selected";
    }

    $("#tag-filter").addEventListener("click", function (e) {
      var t = e.target.closest("[data-tag]");
      if (!t) return;
      activeTag = t.getAttribute("data-tag") || null;
      renderBank();
    });
    $("#question-list").addEventListener("change", function (e) {
      var c = e.target.closest("[data-q]");
      if (!c) return;
      D.banks.questions[+c.getAttribute("data-q")].off = !c.checked;
      updateSelected();
    });
    $("#new-question-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var text = $("#new-question").value.trim();
      if (!text) return;
      D.banks.questions.push({ text: text, tag: $("#new-question-tag").value, level: "Medium" });
      $("#new-question").value = "";
      renderBank();
    });
    $("#new-question-tag").innerHTML = D.banks.tags.map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("");
    $("#bank-select").innerHTML = '<option value="">Assign Existing Bank</option>' + ["Gen AI · Round 1 bank", "Gen AI · Final round bank", "Data Engineering · Core", "UX Design · Portfolio review"].map(function (b) { return "<option>" + b + "</option>"; }).join("");
    $("#confirm-bank").addEventListener("click", function () {
      var q = D.banks.queue[activeRow];
      q.assigned = true;
      NL.close("bank-modal");
      renderQueue();
      var existing = $("#bank-select").value;
      NL.toast((existing || $("#selected-count").textContent) + " — assigned to " + q.name + "’s interview");
    });

    /* Upload modal */
    $("#topic-list").innerHTML = D.banks.topics.map(function (t, i) {
      return '<label class="radio"><input type="radio" name="topic" value="' + esc(t) + '"' + (i === 0 ? " checked" : "") + ">" + esc(t) + "</label>";
    }).join("");
    $("#add-topic").addEventListener("click", function () {
      var input = $("#new-topic");
      var name = input.value.trim();
      if (!name) { input.focus(); return; }
      D.banks.topics.push(name);
      $("#topic-list").insertAdjacentHTML("beforeend", '<label class="radio"><input type="radio" name="topic" checked value="' + esc(name) + '">' + esc(name) + "</label>");
      input.value = "";
    });
    var fileInput = $("#bank-file");
    var drop = $("#dropzone");
    function setFile(f) {
      $("#file-name").textContent = f ? f.name + " · " + Math.max(1, Math.round(f.size / 1024)) + " KB" : "CSV or XLSX, up to 5 MB";
      $("#upload-go").disabled = !f;
    }
    $("#pick-file").addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function () { setFile(fileInput.files[0]); });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-over"); }); });
    drop.addEventListener("drop", function (e) { setFile(e.dataTransfer.files[0]); });
    $("#upload-go").addEventListener("click", function () {
      var topic = ($("input[name=topic]:checked") || {}).value;
      NL.close("upload-modal");
      NL.toast("Uploaded to " + topic, "upload");
      setFile(null);
      fileInput.value = "";
    });

    renderQueue();
  }

  /* ---------- Candidate ---------- */
  function initCandidate() {
    var id = new URLSearchParams(location.search).get("id");
    var all = [].concat(D.candidates, D.pipeline.new, D.pipeline.processing, D.pipeline.hired, D.pipeline.rejected, D.pipeline.undecided);
    var c = all.find(function (x) { return x.id === id; }) || D.candidates[0];
    var P = D.profile;
    document.title = c.name + " · Talents Scooper";
    $all("[data-c-name]").forEach(function (el) { el.textContent = c.name; });
    $("#c-avatar").textContent = NL.initials(c.name);
    $("#c-id").textContent = c.id;
    $("#c-email").textContent = c.email;
    $("#c-phone").textContent = c.phone;
    $("#c-location").textContent = c.location;
    $("#c-summary").textContent = P.summary;
    $("#c-analysis").innerHTML = P.analysis.map(function (a, i) {
      return '<div class="analysis-item"><div class="analysis-item__head"><span class="num-tile">' + (i + 1) + "</span>" + a.title + "</div><p>" + esc(a.text) + "</p></div>";
    }).join("");
    var rounds = D.history.filter(function (h) { return h.result === "Pending"; }).concat(D.history.filter(function (h) { return h.result !== "Pending"; }));
    $("#c-rounds").innerHTML = rounds.map(function (h) {
      var pending = h.result === "Pending";
      return '<div class="item-box' + (pending ? " item-box--amber" : "") + '"><div class="col grow" style="gap:2px"><span><strong>' + h.round + '</strong> <span class="small">' + h.role + '</span></span><span class="small">' + h.date + (h.by !== "Not assigned" ? " · " + esc(h.by) : "") + "</span></div>" +
        '<span class="chip ' + (pending ? "chip--amber" : "chip--success") + '">' + h.result + "</span></div>";
    }).join("");
    $("#c-certs").innerHTML = P.certifications.map(function (t) {
      return '<div class="item-box item-box--amber"><span class="medal"><i data-lucide="award"></i></span><strong>' + esc(t) + "</strong></div>";
    }).join("");
    var edu = [["College", P.education.college, "school"], ["Highest Degree", P.education.degree, "graduation-cap"], ["Passout", P.education.passout, "calendar"], ["CGPA", P.education.cgpa, "award"]];
    $("#c-edu").innerHTML = edu.map(function (e) {
      return '<div class="item-box"><span class="edu-icon"><i data-lucide="' + e[2] + '"></i></span><div class="col" style="gap:2px"><span class="edu-label">' + e[0] + "</span><strong>" + esc(e[1]) + "</strong></div></div>";
    }).join("");

    function auditRow(a) {
      return '<div class="audit-row"><span class="text-muted">' + a.at + "</span><span>" + esc(a.by) + '</span><span class="text-strong">' + esc(a.text) + "</span></div>";
    }
    $("#c-audit").innerHTML = P.audit.map(auditRow).join("");
    function logAction(text) {
      $("#c-audit").insertAdjacentHTML("afterbegin", auditRow({ at: "Just now", by: USER.name, text: text }));
      $("#audit-card").open = true;
    }

    $("#update-menu").innerHTML = D.moveTo.map(function (m) { return '<button data-move-to="' + esc(m) + '"><i data-lucide="' + (m === "Directly Hire" ? "badge-check" : "arrow-right-circle") + '"></i>' + m + "</button>"; }).join("") +
      '<button data-move-to="Reject"><i data-lucide="x-circle"></i>Reject</button>';
    $("#update-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      var m = $("#update-menu");
      m.hidden = !m.hidden;
    });
    $("#update-menu").addEventListener("click", function (e) {
      var b = e.target.closest("[data-move-to]");
      if (!b) return;
      this.hidden = true;
      var to = b.getAttribute("data-move-to");
      var text = to === "Reject" ? "Rejected" : to;
      logAction(text);
      NL.toast(c.name + ": " + text);
    });
    document.addEventListener("click", closeMenus);

    $("#note-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var text = $("#note-text").value.trim();
      if (!text) return;
      logAction("Note: " + text);
      $("#note-text").value = "";
      NL.close("note-modal");
      NL.toast("Note saved");
    });
    $("#view-resume").addEventListener("click", function () { NL.toast("Opening resume in a new tab…", "file-text"); });
  }

  /* ---------- Token usage ---------- */
  function initUsage() {
    var rows = [
      { feature: "Resume parsing", model: "claude-sonnet-5-5", calls: 1284, tokens: 3.9, cost: 38.4 },
      { feature: "Analysis report", model: "claude-sonnet-5-5", calls: 1102, tokens: 5.2, cost: 51.0 },
      { feature: "One-line summary", model: "claude-haiku-5-5", calls: 1102, tokens: 0.6, cost: 1.9 },
      { feature: "Interviewer suggestions", model: "claude-haiku-5-5", calls: 412, tokens: 0.4, cost: 1.2 },
      { feature: "Question generation", model: "claude-sonnet-5-5", calls: 96, tokens: 0.9, cost: 8.7 }
    ];
    var total = rows.reduce(function (a, r) { return { calls: a.calls + r.calls, tokens: a.tokens + r.tokens, cost: a.cost + r.cost }; }, { calls: 0, tokens: 0, cost: 0 });
    $("#usage-kpis").innerHTML = [
      [total.tokens.toFixed(1) + "M", "Tokens this month"],
      ["$" + total.cost.toFixed(2), "Estimated cost"],
      [total.calls.toLocaleString(), "Requests"],
      ["$" + (total.cost / 1102).toFixed(3), "Cost per candidate"]
    ].map(function (k) { return '<div class="usage-kpi"><strong>' + k[0] + "</strong><span>" + k[1] + "</span></div>"; }).join("");
    $("#usage-body").innerHTML = rows.map(function (r) {
      return '<tr><td class="ts-name">' + r.feature + '</td><td class="text-muted">' + r.model + '</td><td class="num" data-sort="' + r.calls + '">' + r.calls.toLocaleString() + '</td><td class="num" data-sort="' + r.tokens + '">' + r.tokens.toFixed(1) + 'M</td><td class="num" data-sort="' + r.cost + '">$' + r.cost.toFixed(2) + "</td></tr>";
    }).join("");
    NL.initSortable($(".ts-panel"));
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderShell();
    document.body.insertAdjacentHTML("beforeend", historyModal());
    document.addEventListener("click", function (e) {
      var h = e.target.closest("[data-history]");
      if (h && !$("#status-panel")) openHistory(h.getAttribute("data-history"));
    });
    var page = $(".app").getAttribute("data-nav");
    ({ dashboard: initDashboard, schedule: initSchedule, banks: initBanks, candidates: initCandidate, usage: initUsage }[page] || function () {})();
    NL.icons();
  });
})();
