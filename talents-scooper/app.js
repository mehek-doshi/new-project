/* Talents Scooper: app shell (sidebar + top bar) and page behaviour. */
(function () {
  "use strict";

  var D = window.TS_DATA;
  var esc = function (v) { return NL.escape(v); };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var NAV = [
    { key: "dashboard", label: "Dashboard", icon: "layout-dashboard", href: "index.html" },
    { key: "schedule", label: "Interview Schedule", icon: "calendar-clock", href: "interview-schedule.html" },
    { key: "banks", label: "Question Banks", icon: "library-big", href: "question-banks.html" },
    { key: "candidates", label: "Candidate Nest", icon: "users", href: "candidate.html" }
  ];

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function avatar(name, size) {
    return '<span class="avatar' + (size ? " avatar--" + size : "") + '">' + esc(NL.initials(name)) + "</span>";
  }

  function person(name) {
    return '<div class="cell-person">' + avatar(name) + "<span>" + esc(name) + "</span></div>";
  }

  /* ---------- Shell ---------- */
  function renderShell() {
    var app = $(".app");
    var active = app.getAttribute("data-nav");
    var title = app.getAttribute("data-title");

    $("[data-sidebar]").innerHTML =
      '<div class="sidebar__brand"><a class="logo" href="index.html"><img src="../shared/img/neuleap-mark.svg" alt=""><span class="logo__word">Talents Scooper</span></a></div>' +
      '<nav class="sidebar__nav" aria-label="Main">' + NAV.map(function (n) {
        return '<a class="nav-item' + (n.key === active ? " is-active" : "") + '" href="' + n.href + '"' + (n.key === active ? ' aria-current="page"' : "") + ' title="' + n.label + '"><i data-lucide="' + n.icon + '"></i><span>' + n.label + "</span></a>";
      }).join("") + "</nav>" +
      '<div class="sidebar__footer">' +
      '<a class="nav-item" href="../index.html" title="All apps"><i data-lucide="layout-grid"></i><span>All Neuleap apps</span></a>' +
      '<button class="icon-btn icon-btn--plain sidebar__collapse" data-collapse-toggle aria-label="Collapse sidebar"><i data-lucide="panel-left-close"></i></button>' +
      "</div>";

    var now = new Date(2026, 7, 1);
    $("[data-topbar]").innerHTML =
      '<button class="icon-btn menu-toggle" data-nav-toggle aria-label="Open menu"><i data-lucide="menu"></i></button>' +
      '<h1 class="t-page-title">' + esc(title) + "</h1>" +
      '<button class="icon-btn icon-btn--plain" id="refresh" aria-label="Refresh"><i data-lucide="refresh-cw"></i></button>' +
      '<label class="search grow"><i data-lucide="search"></i><span class="sr-only">Search</span><input class="input" id="search" type="search" placeholder="Search"></label>' +
      '<div class="month-picker"><button class="select" id="month-btn" aria-haspopup="dialog" aria-expanded="false"><i data-lucide="calendar"></i><span id="month-label"></span><i data-lucide="chevron-down"></i></button>' +
      '<div class="date-pick" id="month-menu" role="dialog" aria-label="Choose month and year" hidden>' +
      '<label class="date-pick__field"><span class="t-overline">Month</span><span class="select"><select id="pick-month">' + MONTHS_LONG.map(function (m, i) { return '<option value="' + i + '">' + m + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></span></label>' +
      '<label class="date-pick__field"><span class="t-overline">Year</span><span class="select"><select id="pick-year">' + [2024, 2025, 2026, 2027].map(function (y) { return '<option value="' + y + '">' + y + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></span></label>' +
      "</div></div>" +
      '<span class="env-badge" title="Environment">PROD</span>' +
      '<button class="icon-btn" data-theme-toggle aria-label="Toggle theme"></button>' +
      '<button class="icon-btn" aria-label="Notifications (2)" id="notif-btn"><i data-lucide="bell"></i><span class="dot"></span></button>' +
      avatar("Mehek Doshi", 40);

    var menu = $("#month-menu");
    var btn = $("#month-btn");
    var pickMonth = $("#pick-month");
    var pickYear = $("#pick-year");
    pickMonth.value = String(now.getMonth());
    pickYear.value = String(now.getFullYear());
    function showMonth() {
      $("#month-label").textContent = MONTHS_LONG[+pickMonth.value] + " " + pickYear.value;
    }
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
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    document.addEventListener("click", function () { setOpen(false); closeMenus(); });

    $("#refresh").addEventListener("click", function () {
      var icon = this.querySelector("svg");
      if (icon) icon.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 600 });
      NL.toast("Data refreshed");
    });
    $("#notif-btn").addEventListener("click", function () {
      NL.toast("2 new candidates were added to the pipeline", "bell");
    });

    NL.syncTheme();

    $("#search").addEventListener("input", function () {
      var q = this.value.trim().toLowerCase();
      $all("table[data-searchable] tbody tr").forEach(function (tr) {
        tr.hidden = q && tr.textContent.toLowerCase().indexOf(q) === -1;
      });
    });
  }

  function closeMenus() {
    $all(".row-actions .menu").forEach(function (m) { m.hidden = true; });
  }

  /* ---------- Round history modal (shared) ---------- */
  function historyModal() {
    return '<div class="modal" id="history-modal" role="dialog" aria-labelledby="history-title" aria-hidden="true">' +
      '<div class="modal__header"><div class="grow"><h2 class="t-title" id="history-title">Round history</h2><p class="t-body text-muted" id="history-sub"></p></div>' +
      '<button class="icon-btn icon-btn--round" data-close aria-label="Close"><i data-lucide="x"></i></button></div>' +
      '<div class="modal__body"><ol class="timeline">' + D.history.map(function (h) {
        var pending = h.result === "Pending";
        return '<li><span class="timeline__dot' + (pending ? " timeline__dot--pending" : "") + '"><i data-lucide="' + (pending ? "clock" : "check") + '"></i></span>' +
          '<div class="col gap-4"><div class="row wrap"><strong class="t-body-strong text-strong">' + h.round + '</strong><span class="chip">' + h.role + "</span>" +
          '<span class="chip ' + (pending ? "" : "chip--success") + '">' + h.result + "</span></div>" +
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
    { key: "new", label: "New" },
    { key: "processing", label: "Processing" },
    { key: "hired", label: "Hired" },
    { key: "undecided", label: "Undecided" },
    { key: "rejected", label: "Rejected" }
  ];

  function statusChip(status) {
    if (status === "Success") return '<span class="chip chip--success">Success</span>';
    if (status === "Failed") return '<span class="chip chip--error">Failed</span>';
    if (status === "Running") return '<span class="chip chip--info">Running…</span>';
    return '<span class="chip">Queued</span>';
  }

  function replyChip(reply) {
    var cls = reply === "Accepted" ? "chip--success" : reply === "Rejected" ? "chip--error" : "";
    return '<span class="chip ' + cls + '">' + reply + "</span>";
  }

  function check(on, label) {
    return '<label class="check" title="' + label + '"><input type="checkbox"' + (on ? " checked" : "") + ' aria-label="' + label + '"></label>';
  }

  function sortTh(label, key) {
    return '<th class="sortable">' + label + '<i data-lucide="arrow-up-down"></i></th>';
  }

  function dashboardTable(tab) {
    var rows = D.pipeline[tab];
    if (!rows.length) {
      return '<div class="empty"><i data-lucide="inbox"></i><p class="t-subhead">No undecided candidates</p><p class="t-body">Candidates you put on hold after an interview will show up here.</p></div>';
    }
    var head, body;
    var base = function (c) {
      return "<td>" + person(c.name) + '</td><td data-sort="' + parseFloat(c.aging) * (/h/.test(c.aging) ? 1 : 24) + '">' + c.aging + '</td><td data-sort="' + Date.parse(c.received) + '">' + c.received + '</td><td data-sort="' + c.experience + '">' + c.experience + " y</td><td>" + esc(c.college) + "</td>";
    };
    var history = function (c) { return '<td><button class="btn btn--ghost btn--sm" data-history="' + esc(c.name) + '"><i data-lucide="history"></i>View History</button></td>'; };

    if (tab === "new") {
      head = "<th>Name</th>" + sortTh("Aging") + sortTh("Received") + sortTh("Experience") + "<th>College</th><th>Status</th><th>Reason</th>";
      body = rows.map(function (c) {
        return '<tr class="is-clickable" data-id="' + c.id + '">' + base(c) + '<td data-status="' + c.id + '">' + statusChip(c.status) + '</td><td class="text-muted">' + esc(c.reason) + "</td></tr>";
      }).join("");
    } else if (tab === "processing") {
      head = "<th>Name</th>" + sortTh("Aging") + sortTh("Received") + sortTh("Experience") + "<th>College</th><th>Stage</th><th>History</th><th>Action</th>";
      body = rows.map(function (c) {
        return '<tr data-id="' + c.id + '">' + base(c) + '<td><span class="chip chip--info">' + c.stage + "</span></td>" + history(c) +
          '<td><div class="row-actions"><button class="btn btn--outline btn--sm" data-move>Move to<i data-lucide="chevron-down"></i></button>' +
          '<div class="menu" hidden>' + D.moveTo.map(function (m) { return '<button data-move-to="' + esc(m) + '"><i data-lucide="' + (m === "Directly Hire" ? "badge-check" : "arrow-right-circle") + '"></i>' + m + "</button>"; }).join("") +
          '<hr class="divider" style="margin:6px 0"><button data-move-to="Reject"><i data-lucide="x-circle" style="color:var(--status-error-text)"></i>Reject</button></div></div></td></tr>';
      }).join("");
    } else if (tab === "hired") {
      head = "<th>Name</th><th>Role</th>" + sortTh("Joining date") + "<th>Offer letter</th><th>Offer reply</th><th>BG verified</th><th>IT asset allocated</th><th>Buddy assigned</th><th>Induction scheduled</th><th>History</th>";
      body = rows.map(function (c) {
        return '<tr data-id="' + c.id + '"><td>' + person(c.name) + "</td><td>" + c.role + '</td><td data-sort="' + Date.parse(c.joining) + '">' + c.joining + "</td>" +
          "<td>" + (c.offerLetter ? '<span class="bool bool--yes"><i data-lucide="check"></i></span>' : '<button class="btn btn--outline btn--sm" data-send-offer>Send</button>') + "</td>" +
          "<td>" + replyChip(c.offerReply) + "</td><td>" + check(c.bgVerified, "BG verified") + "</td><td>" + check(c.itAsset, "IT asset allocated") + "</td><td>" + check(c.buddy, "Buddy assigned") + "</td><td>" + check(c.induction, "Induction scheduled") + "</td>" + history(c) + "</tr>";
      }).join("");
    } else {
      head = "<th>Name</th>" + sortTh("Aging") + sortTh("Received") + sortTh("Experience") + "<th>College</th><th>History</th>";
      body = rows.map(function (c) { return '<tr data-id="' + c.id + '">' + base(c) + history(c) + "</tr>"; }).join("");
    }
    return '<div class="table-wrap"><table class="table" data-sortable data-searchable><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>";
  }

  function initDashboard() {
    var tabsEl = $("#status-tabs");
    var panel = $("#status-panel");
    var current = (location.hash || "#new").slice(1);
    if (!D.pipeline[current]) current = "new";

    function renderTabs() {
      tabsEl.innerHTML = TABS.map(function (t) {
        return '<button class="tab' + (t.key === current ? " is-active" : "") + '" role="tab" aria-selected="' + (t.key === current) + '" data-status-tab="' + t.key + '">' + t.label + '<span class="count">' + D.pipeline[t.key].length + "</span></button>";
      }).join("");
    }

    function render() {
      renderTabs();
      panel.innerHTML = dashboardTable(current);
      $("#run-pipeline").hidden = current !== "new";
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
      var move = e.target.closest("[data-move]");
      if (move) {
        e.stopPropagation();
        var menu = move.nextElementSibling;
        var wasHidden = menu.hidden;
        closeMenus();
        menu.hidden = !wasHidden;
        return;
      }
      var to = e.target.closest("[data-move-to]");
      if (to) {
        e.stopPropagation();
        var tr = to.closest("tr");
        var id = tr.getAttribute("data-id");
        var target = to.getAttribute("data-move-to");
        var idx = D.pipeline.processing.findIndex(function (c) { return c.id === id; });
        var c = D.pipeline.processing.splice(idx, 1)[0];
        if (target === "Directly Hire") {
          D.pipeline.hired.push(Object.assign({}, c, { joining: "To be decided", offerLetter: false, offerReply: "No Response", bgVerified: false, itAsset: false, buddy: false, induction: false }));
        } else if (target === "Reject") {
          D.pipeline.rejected.push(c);
        } else {
          c.stage = target.replace("Move to ", "").replace(" Round", "") === "Screening" ? "Screening" : target.replace("Move to ", "");
          D.pipeline.processing.splice(idx, 0, c);
        }
        render();
        NL.toast(c.name + (target === "Reject" ? " moved to Rejected" : target === "Directly Hire" ? " moved to Hired" : " → " + target.replace("Move to ", "")));
        return;
      }
      var offer = e.target.closest("[data-send-offer]");
      if (offer) {
        e.stopPropagation();
        offer.outerHTML = '<span class="bool bool--yes"><i data-lucide="check"></i></span>';
        NL.icons();
        NL.toast("Offer letter sent", "mail-check");
        return;
      }
      if (e.target.closest("input, label, button")) return;
      var row = e.target.closest("tr[data-id]");
      if (row) location.href = "candidate.html?id=" + row.getAttribute("data-id");
    });

    panel.addEventListener("change", function (e) {
      if (e.target.type === "checkbox") NL.toast((e.target.checked ? "Marked: " : "Unmarked: ") + e.target.getAttribute("aria-label"));
    });

    $("#run-pipeline").addEventListener("click", function () {
      var btn = this;
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-circle"></i>Running…';
      NL.icons();
      var queued = D.pipeline.new.filter(function (c) { return c.status !== "Success"; });
      queued.forEach(function (c) { c.status = "Running"; });
      render();
      setTimeout(function () {
        queued.forEach(function (c) { c.status = "Success"; c.reason = "-"; });
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="play"></i>Run Pipeline';
        render();
        NL.toast("Pipeline finished — " + queued.length + " resumes processed");
      }, 1800);
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
    return '<span class="chip chip--dot ' + cls + '">' + slot + "</span>";
  }

  function initSchedule() {
    var body = $("#schedule-body");
    var activeRow = null;
    var choice = null;

    function render() {
      body.innerHTML = D.schedule.map(function (r, i) {
        var assign = r.slot === "Open" || r.slot === "Pending";
        return '<tr data-row="' + i + '"><td>' + person(r.name) + '</td><td data-sort="' + parseFloat(r.aging) * (/h/.test(r.aging) ? 1 : 24) + '">' + r.aging + "</td><td>" + r.role + "</td><td>" + r.stage + "</td><td>" + esc(r.interviewer) + "</td><td>" + slotChip(r.slot) + "</td>" +
          '<td><button class="btn btn--sm ' + (assign ? "btn--outline" : "btn--destructive") + '" data-assign="' + i + '">' + (assign ? "Assign" : "Reassign") + "</button></td></tr>";
      }).join("");
      NL.icons();
    }

    function renderOverlay() {
      var r = D.schedule[activeRow];
      $("#assign-sub").textContent = r.name + " · " + r.role + " · " + r.stage;
      $("#interviewer-list").innerHTML = D.interviewers.map(function (iv, i) {
        var selected = choice && choice.i === i;
        return '<div class="interviewer' + (selected ? " is-selected" : "") + '" data-iv="' + i + '">' +
          '<div class="row gap-12">' + avatar(iv.name, 40) + '<div class="grow"><div class="t-body-strong text-strong">' + esc(iv.name) + '</div><div class="t-small text-muted">This week: ' + iv.load + " interview" + (iv.load === 1 ? "" : "s") + "</div></div>" +
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
      var i = +card.getAttribute("data-iv");
      var slot = e.target.closest("[data-slot]");
      choice = { i: i, j: slot ? +slot.getAttribute("data-slot") : 0 };
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
  }

  /* ---------- Question banks ---------- */
  function initBanks() {
    var role = D.banks.roles[0];
    var activeTag = null;

    $("#role-tabs").innerHTML = D.banks.roles.map(function (r, i) {
      return '<button class="tab' + (i === 0 ? " is-active" : "") + '" data-role="' + r + '">' + r + "</button>";
    }).join("");
    $("#role-tabs").addEventListener("click", function (e) {
      var t = e.target.closest("[data-role]");
      if (!t) return;
      role = t.getAttribute("data-role");
      $all("[data-role]", this).forEach(function (b) { b.classList.toggle("is-active", b === t); });
      renderQueue();
    });

    function renderQueue() {
      var key = role === "Data Engineering" ? "Data Engineer" : role === "UX Design" ? "UX Designer" : role;
      var rows = D.banks.queue.filter(function (q) { return q.role === key; });
      $("#queue-body").innerHTML = rows.length ? rows.map(function (q) {
        var i = D.banks.queue.indexOf(q);
        return "<tr><td>" + person(q.name) + "</td><td>" + q.role + "</td><td>" + q.stage + "</td><td>" + esc(q.interviewer) + "</td><td>" +
          (q.assigned
            ? '<button class="btn btn--sm btn--ghost" data-bank="' + i + '" style="color:var(--status-success-text)"><i data-lucide="check"></i>Bank assigned</button>'
            : '<button class="btn btn--sm btn--outline" data-bank="' + i + '">Assign bank</button>') + "</td></tr>";
      }).join("") : '<tr><td colspan="5" class="table-empty">No queued interviews for ' + role + "</td></tr>";
      NL.icons();
    }

    $("#queue-body").addEventListener("click", function (e) {
      var b = e.target.closest("[data-bank]");
      if (!b) return;
      var q = D.banks.queue[+b.getAttribute("data-bank")];
      q.assigned = !q.assigned;
      renderQueue();
      if (q.assigned) NL.toast("Question bank assigned to " + q.name + "’s interview");
    });

    function renderTags() {
      var counts = {};
      D.banks.questions.forEach(function (q) { counts[q.tag] = (counts[q.tag] || 0) + 1; });
      $("#tag-filter").innerHTML = '<button class="tag' + (!activeTag ? " is-active" : "") + '" data-tag="">All · ' + D.banks.questions.length + "</button>" +
        Object.keys(counts).map(function (t) {
          return '<button class="tag' + (activeTag === t ? " is-active" : "") + '" data-tag="' + esc(t) + '">' + esc(t) + " · " + counts[t] + "</button>";
        }).join("");
    }

    function renderQuestions() {
      var list = D.banks.questions.filter(function (q) { return !activeTag || q.tag === activeTag; });
      $("#question-list").innerHTML = list.map(function (q) {
        var n = D.banks.questions.indexOf(q) + 1;
        var lvl = q.level === "Hard" ? "chip--error" : q.level === "Easy" ? "chip--success" : "chip--warning";
        return '<div class="question"><span class="question__num">' + n + '.</span><div class="col grow"><p class="t-body-lg text-strong">' + esc(q.text) + '</p><div class="row wrap"><span class="chip chip--info">' + esc(q.tag) + '</span><span class="chip ' + lvl + '">' + q.level + "</span></div></div>" +
          '<button class="icon-btn icon-btn--plain" data-remove="' + (n - 1) + '" aria-label="Remove question"><i data-lucide="trash-2"></i></button></div>';
      }).join("");
      $("#selected-count").textContent = D.banks.questions.length;
      renderTags();
      NL.icons();
    }

    $("#tag-filter").addEventListener("click", function (e) {
      var t = e.target.closest("[data-tag]");
      if (!t) return;
      activeTag = t.getAttribute("data-tag") || null;
      renderQuestions();
    });

    $("#question-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      D.banks.questions.splice(+b.getAttribute("data-remove"), 1);
      renderQuestions();
      NL.toast("Question removed from bank", "trash-2");
    });

    $("#new-question-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var text = $("#new-question").value.trim();
      if (!text) return;
      D.banks.questions.push({ text: text, tag: $("#new-question-tag").value, level: "Medium" });
      $("#new-question").value = "";
      renderQuestions();
      NL.toast("Question added");
    });
    $("#new-question-tag").innerHTML = D.banks.tags.map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("");
    $("#bank-select").innerHTML = ["Gen AI · Round 1 bank", "Gen AI · Final round bank", "Data Engineering · Core", "UX Design · Portfolio review"].map(function (b) { return "<option>" + b + "</option>"; }).join("");
    $("#bank-select").addEventListener("change", function () { NL.toast("Existing bank selected: " + this.value); });
    $("#random-send").addEventListener("change", function () {
      NL.toast(this.checked ? "Random question sets will be sent to interviewers" : "Random send turned off");
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
      var label = document.createElement("label");
      label.className = "radio";
      label.innerHTML = '<input type="radio" name="topic" checked value="' + esc(name) + '">' + esc(name);
      $("#topic-list").appendChild(label);
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
    renderQuestions();
  }

  /* ---------- Candidate nest ---------- */
  function initCandidate() {
    var id = new URLSearchParams(location.search).get("id");
    var c = D.candidates.find(function (x) { return x.id === id; }) || D.candidates[1];
    var P = D.profile;
    $all("[data-c-name]").forEach(function (el) { el.textContent = c.name; });
    $("#c-avatar").textContent = NL.initials(c.name);
    $("#c-id").textContent = c.id;
    $("#c-email").textContent = c.email;
    $("#c-phone").textContent = c.phone;
    $("#c-location").textContent = c.location;
    $("#c-role").textContent = c.role;
    $("#c-summary").textContent = P.summary;
    document.title = c.name + " · Talents Scooper";

    $("#c-analysis").innerHTML = P.analysis.map(function (a) {
      return '<div class="analysis__item"><span class="score score--' + a.score + '">' + a.score + '</span><div class="col"><strong class="t-body-strong text-strong">' + a.title + '</strong><p class="t-body text-muted">' + esc(a.text) + "</p></div></div>";
    }).join("");
    var avg = P.analysis.reduce(function (s, a) { return s + a.score; }, 0) / P.analysis.length;
    $("#c-score").textContent = avg.toFixed(1) + " / 5";
    $("#c-certs").innerHTML = P.certifications.map(function (t) { return '<span class="chip chip--purple chip--lg"><i data-lucide="award"></i>' + esc(t) + "</span>"; }).join("");
    $("#c-college").textContent = P.education.college;
    $("#c-degree").textContent = P.education.degree;
    $("#c-cgpa").textContent = P.education.cgpa;
    $("#c-passout").textContent = P.education.passout;
    $("#c-rounds").innerHTML = D.history.map(function (h) {
      var pending = h.result === "Pending";
      return '<li><span class="timeline__dot' + (pending ? " timeline__dot--pending" : "") + '"><i data-lucide="' + (pending ? "clock" : "check") + '"></i></span>' +
        '<div class="col gap-4"><div class="row wrap"><strong class="t-body-strong text-strong">' + h.round + '</strong><span class="t-small text-muted">' + esc(h.by) + " · " + h.date + "</span></div>" +
        (h.note ? '<p class="t-body">' + esc(h.note) + "</p>" : '<p class="t-body text-muted">Interviewer not assigned yet.</p>') + "</div></li>";
    }).join("");
    $("#audit-list").innerHTML = P.audit.map(function (a) {
      return '<li><span class="timeline__dot"><i data-lucide="activity"></i></span><div class="col gap-4"><strong class="t-body-medium text-strong">' + esc(a.text) + '</strong><span class="t-small text-muted">' + esc(a.by) + " · " + a.at + "</span></div></li>";
    }).join("");

    $("#note-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var text = $("#note-text").value.trim();
      if (!text) return;
      var li = document.createElement("li");
      li.innerHTML = '<span class="timeline__dot"><i data-lucide="sticky-note"></i></span><div class="col gap-4"><strong class="t-body-medium text-strong">Note added</strong><p class="t-body">' + esc(text) + '</p><span class="t-small text-muted">You · just now</span></div>';
      $("#audit-list").prepend(li);
      $("#note-text").value = "";
      NL.close("note-modal");
      NL.icons();
      NL.toast("Note saved");
    });
    $("#view-resume").addEventListener("click", function () {
      NL.toast("Resume preview opens in the document viewer", "file-text");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderShell();
    document.body.insertAdjacentHTML("beforeend", historyModal());
    document.addEventListener("click", function (e) {
      var h = e.target.closest("[data-history]");
      if (h && !$("#status-panel")) openHistory(h.getAttribute("data-history"));
    });
    var page = $(".app").getAttribute("data-nav");
    ({ dashboard: initDashboard, schedule: initSchedule, banks: initBanks, candidates: initCandidate }[page] || function () {})();
    NL.icons();
  });
})();
