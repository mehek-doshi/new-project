/* Tech Radar: shell (sidebar + header + profile panel) and page renderers. */
(function () {
  "use strict";

  var D = window.TR_DATA;
  var A = D.admin;
  var esc = function (v) { return NL.escape(v); };
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var USER_NAV = [
    { key: "dashboard", label: "Dashboard", icon: "layout-dashboard", href: "dashboard.html" },
    { key: "new-use-case", label: "New Use Case", icon: "file-plus-2", href: "new-use-case.html" },
    { key: "artifacts", label: "Project Artifacts", icon: "folder-kanban", href: "artifacts.html" }
  ];

  var ADMIN_NAV = [
    { key: "admin-overview", label: "Overview", icon: "gauge", href: "admin-overview.html" },
    { key: "admin-discovery", label: "Discovery Agent", icon: "radar", href: "admin-discovery.html" },
    { key: "admin-volunteers", label: "Volunteers", icon: "hand-heart", href: "admin-volunteers.html" },
    { key: "admin-schedule", label: "Schedule", icon: "calendar-days", href: "admin-schedule.html" },
    { key: "admin-moderation", label: "Moderation", icon: "shield-check", href: "admin-moderation.html" },
    { key: "admin-users", label: "Users & Roles", icon: "users", href: "admin-users.html" },
    { key: "admin-badges", label: "Badges & Certificates", icon: "award", href: "admin-badges.html" },
    { key: "admin-settings", label: "Settings & Audit", icon: "settings", href: "admin-settings.html" }
  ];

  var PAGES = {
    dashboard: { title: "Discoveries", subtitle: "New technology topics picked for you by the discovery agent", action: '<a class="btn btn--primary" href="new-use-case.html"><i data-lucide="plus"></i>New use case</a>' },
    "new-use-case": { title: "New use case", subtitle: "Turn a topic you explored into a proposal the team can act on", crumb: ["Tech Radar", "Model Context Protocol", "New use case"] },
    artifacts: { title: "Project artifacts", subtitle: "Everything you and your team produced while exploring topics", action: '<button class="btn btn--primary" data-open="upload-modal"><i data-lucide="upload"></i>Upload artifact</button>' },
    "admin-overview": { title: "Admin overview", subtitle: "How Tech Radar is doing across the organisation", action: '<a class="btn btn--primary" href="admin-discovery.html"><i data-lucide="radar"></i>Run discovery</a>' },
    "admin-discovery": { title: "Discovery agent", subtitle: "Where the agent looks for new topics and how it filters them", action: '<button class="btn btn--primary" id="run-now"><i data-lucide="play"></i>Run now</button>' },
    "admin-volunteers": { title: "Volunteers", subtitle: "People exploring topics and how far along they are", action: '<button class="btn btn--primary" id="invite-btn"><i data-lucide="user-plus"></i>Invite volunteers</button>' },
    "admin-schedule": { title: "Schedule", subtitle: "Tech Talk sessions where volunteers present what they found", action: '<button class="btn btn--primary" data-open="session-modal"><i data-lucide="calendar-plus"></i>New session</button>' },
    "admin-moderation": { title: "Moderation", subtitle: "Review use cases and artifacts before they’re published" },
    "admin-users": { title: "Users & roles", subtitle: "Who can contribute, moderate or administer Tech Radar" },
    "admin-badges": { title: "Badges & certificates", subtitle: "Recognition rules for contributors", action: '<button class="btn btn--primary" id="new-badge"><i data-lucide="plus"></i>New badge</button>' },
    "admin-settings": { title: "Settings & audit log", subtitle: "Integrations, defaults and a record of every admin action" }
  };

  function avatar(name, size) {
    return '<span class="avatar' + (size ? " avatar--" + size : "") + '">' + esc(NL.initials(name)) + "</span>";
  }

  function badgeIcon(b, locked) {
    return '<span class="badge-icon' + (locked ? " badge-icon--locked" : b.tone ? " badge-icon--" + b.tone : "") + '"><i data-lucide="' + (locked ? "lock" : b.icon) + '"></i></span>';
  }

  function chip(text, tone) {
    return '<span class="chip' + (tone ? " chip--" + tone : "") + '">' + esc(text) + "</span>";
  }

  function ringTone(ring) {
    return { Adopt: "success", Trial: "info", Assess: "warning", Hold: "error" }[ring];
  }

  /* ---------- Shell ---------- */
  function renderShell(page) {
    var admin = page.indexOf("admin") === 0;
    var nav = admin ? ADMIN_NAV : USER_NAV;
    var meta = PAGES[page];

    $("[data-sidebar]").innerHTML =
      '<div class="sidebar__brand"><a class="logo" href="dashboard.html"><img src="../shared/img/neuleap-mark.svg" alt=""><span class="logo__word">Tech Radar</span></a></div>' +
      (admin ? '<p class="t-overline sidebar__section">Admin console</p>' : "") +
      '<nav class="sidebar__nav" aria-label="Main">' + nav.map(function (n) {
        var active = n.key === page;
        return '<a class="nav-item' + (active ? " is-active" : "") + '" href="' + n.href + '"' + (active ? ' aria-current="page"' : "") + ' title="' + n.label + '"><i data-lucide="' + n.icon + '"></i><span>' + n.label + "</span></a>";
      }).join("") + "</nav>" +
      '<div class="sidebar__footer">' +
      (admin
        ? '<a class="nav-item" href="dashboard.html" title="Back to Tech Radar"><i data-lucide="arrow-left"></i><span>Back to Tech Radar</span></a>'
        : '<a class="nav-item" href="admin-overview.html" title="Admin console"><i data-lucide="shield"></i><span>Admin console</span></a>') +
      '<a class="nav-item" href="../index.html" title="All apps"><i data-lucide="layout-grid"></i><span>All Neuleap apps</span></a>' +
      '<button class="icon-btn icon-btn--plain sidebar__collapse" data-collapse-toggle aria-label="Collapse sidebar"><i data-lucide="panel-left-close"></i></button>' +
      "</div>";

    $("[data-topbar]").innerHTML =
      '<button class="icon-btn menu-toggle" data-nav-toggle aria-label="Open menu"><i data-lucide="menu"></i></button>' +
      '<div class="topbar__title">' +
      (meta.crumb ? '<nav class="breadcrumb" aria-label="Breadcrumb">' + meta.crumb.map(function (c, i) {
        return (i ? '<i data-lucide="chevron-right"></i>' : "") + (i < meta.crumb.length - 1 ? '<a href="dashboard.html">' + esc(c) + "</a>" : "<span>" + esc(c) + "</span>");
      }).join("") + "</nav>" : "") +
      '<h1 class="t-page-title">' + esc(meta.title) + '</h1><p class="t-body text-muted">' + esc(meta.subtitle) + "</p></div>" +
      (meta.action || "") +
      '<button class="icon-btn" data-theme-toggle aria-label="Toggle theme"></button>' +
      '<button class="icon-btn" id="bell" aria-label="Notifications"><i data-lucide="bell"></i><span class="dot"></span></button>' +
      '<button class="profile-btn" data-open="profile-panel" aria-label="Open your profile">' + avatar(D.user.name, 40) + "</button>";
    NL.syncTheme();

    $("#bell").addEventListener("click", function () { NL.toast("You have " + D.invitations.length + " new invitations", "bell"); });

    document.body.insertAdjacentHTML("beforeend", profilePanel());
  }

  function profilePanel() {
    return '<div class="modal profile-panel" id="profile-panel" role="dialog" aria-labelledby="profile-title" aria-hidden="true">' +
      '<div class="modal__header">' + avatar(D.user.name, 64) +
      '<div class="col gap-4 grow"><h2 class="t-title" id="profile-title">' + esc(D.user.name) + '</h2><p class="t-body text-muted">' + esc(D.user.email) + " · " + esc(D.user.team) + "</p>" +
      '<div class="row">' + chip("3 badges", "info") + chip("2 certificates", "purple") + "</div></div>" +
      '<button class="icon-btn icon-btn--round" data-close aria-label="Close"><i data-lucide="x"></i></button></div>' +
      '<div class="modal__body">' +
      '<p class="t-overline">Badges</p><div class="badge-grid">' + D.badges.map(function (b) {
        return '<div class="badge-cell">' + badgeIcon(b, !b.earned) + '<span class="t-small-medium text-strong">' + b.name + '</span><span class="t-caption text-muted">' + (b.earned ? "Earned" : "Locked") + "</span></div>";
      }).join("") + "</div>" +
      '<p class="t-overline" style="margin-top:8px">Certificates</p>' + D.certificates.map(function (c) {
        return '<div class="cert"><span class="icon-tile icon-tile--purple"><i data-lucide="award"></i></span><div class="col gap-4 grow"><strong class="t-body-medium text-strong">' + esc(c.title) + '</strong><span class="t-small text-muted">' + esc(c.meta) + '</span></div><button class="btn btn--outline btn--sm" data-download="' + esc(c.title) + '"><i data-lucide="download"></i>Download</button></div>';
      }).join("") + "</div></div>";
  }

  /* ---------- User pages ---------- */
  function topicCard(t, i, open) {
    return '<article class="card topic' + (open ? " is-open" : "") + '" data-topic="' + i + '">' +
      '<button class="topic__header" aria-expanded="' + !!open + '">' +
      '<span class="icon-tile"><i data-lucide="' + ({ "AI & ML": "brain-circuit", Platforms: "blocks", Data: "database", Security: "shield-check", Frontend: "monitor-smartphone" }[t.category] || "sparkles") + '"></i></span>' +
      '<span class="col gap-4 grow"><span class="row wrap">' + chip(t.ring, ringTone(t.ring)) + chip(t.category) + '<span class="t-small text-muted">Found ' + t.found + "</span></span>" +
      '<span class="t-title">' + esc(t.title) + '</span><span class="t-body text-muted">' + esc(t.summary) + "</span></span>" +
      '<span class="row" style="white-space:nowrap"><i data-lucide="users" style="width:16px;height:16px;color:var(--text-muted)"></i><span class="t-small text-muted">' + t.volunteers + ' volunteers</span><i class="topic__chevron" data-lucide="chevron-down"></i></span></button>' +
      '<div class="topic__body"><hr class="divider">' +
      '<div class="link-tiles"><div class="link-tile"><span class="t-overline">Articles · ' + t.articles.length + "</span>" + t.articles.map(function (a) { return '<a href="#" data-soon>' + esc(a) + '<i data-lucide="external-link"></i></a>'; }).join("") + "</div>" +
      '<div class="link-tile"><span class="t-overline">Test cases · ' + t.tests.length + "</span>" + t.tests.map(function (a) { return '<span class="row t-body"><i data-lucide="flask-conical" style="width:14px;height:14px;color:var(--text-muted)"></i>' + esc(a) + "</span>"; }).join("") + "</div></div>" +
      '<div class="suggestion"><i data-lucide="sparkles"></i><div class="col gap-4"><span class="t-overline">Suggested use case</span><p class="t-body-lg">' + esc(t.suggestion) + "</p></div></div>" +
      '<div class="row wrap" style="justify-content:flex-end"><button class="btn btn--ghost" data-not-interested="' + i + '">Not interested</button><button class="btn btn--outline" data-volunteer="' + i + '"><i data-lucide="hand-heart"></i>Volunteer</button><a class="btn btn--primary" href="new-use-case.html"><i data-lucide="file-plus-2"></i>Write use case</a></div>' +
      "</div></article>";
  }

  function pageDashboard(main) {
    var filter = "All";
    main.innerHTML = '<div class="grid grid-main-aside">' +
      '<section class="col gap-16"><div class="toolbar row wrap gap-16"><div class="segmented" id="ring-filter">' + ["All", "Adopt", "Trial", "Assess", "Hold"].map(function (r, i) { return '<button class="' + (i ? "" : "is-active") + '" data-ring="' + r + '">' + r + "</button>"; }).join("") + '</div><span class="spacer"></span>' +
      '<label class="select select--square"><i data-lucide="filter"></i><span class="sr-only">Category</span><select id="cat-filter"><option>All categories</option><option>AI & ML</option><option>Platforms</option><option>Data</option><option>Security</option><option>Frontend</option></select><i data-lucide="chevron-down"></i></label></div>' +
      '<div class="col gap-16" id="topics"></div></section>' +
      '<aside class="col gap-24"><section class="card gap-16"><div class="card__header"><span class="icon-tile icon-tile--sm"><i data-lucide="bell"></i></span><div class="grow"><h2 class="t-subhead" style="font-weight:500">Invitations</h2><p class="t-small text-muted">Teammates asking for your help</p></div></div>' +
      '<div class="col gap-12" id="invites"></div></section>' +
      '<section class="card gap-16"><h2 class="t-subhead" style="font-weight:500">Your progress</h2>' +
      '<div class="row gap-16">' + D.badges.slice(0, 3).map(function (b) { return badgeIcon(b); }).join("") + "</div>" +
      '<div class="col gap-8"><div class="row"><span class="t-body grow">Next badge: Presenter</span><span class="t-small text-muted">0 / 1 session</span></div><div class="progress"><span style="width:10%"></span></div></div>' +
      '<button class="btn btn--ghost" data-open="profile-panel" style="align-self:flex-start;margin-left:-16px">View profile <i data-lucide="arrow-right"></i></button></section></aside></div>';

    function renderTopics() {
      var cat = $("#cat-filter").value;
      var list = D.topics.map(function (t, i) { return { t: t, i: i }; }).filter(function (x) {
        return (filter === "All" || x.t.ring === filter) && (cat === "All categories" || x.t.category === cat);
      });
      $("#topics").innerHTML = list.length ? list.map(function (x, n) { return topicCard(x.t, x.i, n === 0); }).join("") : '<div class="card empty"><i data-lucide="radar"></i><p>No topics match these filters yet.</p></div>';
      NL.icons();
    }

    function renderInvites() {
      $("#invites").innerHTML = D.invitations.length ? D.invitations.map(function (v, i) {
        return '<div class="invite"><div class="row gap-12">' + avatar(v.from) + '<div class="col gap-4 grow"><span class="t-body"><strong class="text-strong">' + esc(v.from) + "</strong> invited you to <strong class=\"text-strong\">" + esc(v.role.toLowerCase()) + '</strong></span><span class="t-small text-muted">' + esc(v.topic) + " · " + v.due + '</span></div></div><div class="row"><button class="btn btn--primary btn--sm" data-accept="' + i + '">Accept</button><button class="btn btn--secondary btn--sm" data-decline="' + i + '">Decline</button></div></div>';
      }).join("") : '<div class="empty" style="padding:24px"><i data-lucide="inbox"></i><p class="t-body">You’re all caught up.</p></div>';
      NL.icons();
    }

    $("#ring-filter").addEventListener("click", function (e) {
      var b = e.target.closest("[data-ring]");
      if (!b) return;
      filter = b.getAttribute("data-ring");
      $all("[data-ring]", this).forEach(function (x) { x.classList.toggle("is-active", x === b); });
      renderTopics();
    });
    $("#cat-filter").addEventListener("change", renderTopics);

    $("#topics").addEventListener("click", function (e) {
      var head = e.target.closest(".topic__header");
      if (head) {
        var card = head.parentNode;
        card.classList.toggle("is-open");
        head.setAttribute("aria-expanded", card.classList.contains("is-open"));
        return;
      }
      var v = e.target.closest("[data-volunteer]");
      if (v) {
        var t = D.topics[+v.getAttribute("data-volunteer")];
        if (v.classList.contains("btn--outline")) {
          t.volunteers += 1;
          v.className = "btn btn--ghost";
          v.innerHTML = '<i data-lucide="check"></i>Volunteered';
          NL.icons();
          NL.toast("You volunteered for “" + t.title + "”", "hand-heart");
        }
        return;
      }
      var n = e.target.closest("[data-not-interested]");
      if (n) {
        n.closest(".topic").remove();
        NL.toast("Topic hidden. We’ll show fewer like this.", "eye-off");
      }
    });

    $("#invites").addEventListener("click", function (e) {
      var a = e.target.closest("[data-accept]");
      var d = e.target.closest("[data-decline]");
      if (!a && !d) return;
      var i = +(a || d).getAttribute(a ? "data-accept" : "data-decline");
      var inv = D.invitations.splice(i, 1)[0];
      renderInvites();
      NL.toast(a ? "Accepted — " + inv.topic : "Invitation declined", a ? "check-circle-2" : "x-circle");
    });

    renderTopics();
    renderInvites();
  }

  function pageNewUseCase(main) {
    var field = function (id, label, control, hint) {
      return '<div class="field"><label class="field__label" for="' + id + '">' + label + (hint ? '<span class="field__hint">' + hint + "</span>" : "") + "</label>" + control + '<span class="field__hint" data-error hidden>This field is required.</span></div>';
    };
    var section = function (n, title, sub, body) {
      return '<section class="card form-section"><div class="form-section__head"><span class="num-badge" style="width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:var(--brand-tint);color:var(--text-link);font-weight:700">' + n + '</span><div class="col gap-4"><h2 class="t-title">' + title + '</h2><p class="t-body text-muted">' + sub + "</p></div></div>" + body + "</section>";
    };
    main.innerHTML = '<form class="form-layout" id="uc-form" novalidate><div class="col gap-24">' +
      section(1, "Topic & project", "What did you explore, and where would it be used?",
        '<div class="form-grid">' + field("uc-topic", "Topic", '<label class="select select--square" style="width:100%"><select id="uc-topic" style="width:100%">' + D.topics.map(function (t, i) { return "<option" + (i === 1 ? " selected" : "") + ">" + esc(t.title) + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></label>') +
        field("uc-project", "Project or team", '<input class="input" id="uc-project" placeholder="e.g. Talents Scooper" value="Talents Scooper" required>') + "</div>" +
        '<div class="form-grid">' + field("uc-owner", "Owner", '<input class="input" id="uc-owner" value="' + esc(D.user.name) + '" required>') +
        field("uc-ring", "Recommended ring", '<label class="select select--square" style="width:100%"><select id="uc-ring" style="width:100%"><option>Adopt</option><option selected>Trial</option><option>Assess</option><option>Hold</option></select><i data-lucide="chevron-down"></i></label>') + "</div>") +
      section(2, "Problem & approach", "Describe the problem in plain words and how the technology helps.",
        field("uc-title", "Use case title", '<input class="input" id="uc-title" placeholder="A short, specific name" value="MCP wrapper for candidate search" required>') +
        field("uc-problem", "Problem", '<textarea class="input" id="uc-problem" maxlength="600" required placeholder="Who has the problem and what does it cost today?">Recruiters switch between four tools to answer simple questions like “who is free for a Round 2 this week?”</textarea>', '<span data-count="uc-problem"></span>') +
        field("uc-approach", "Approach", '<textarea class="input" id="uc-approach" maxlength="900" style="min-height:140px" required placeholder="How would you build it? What would a first version include?"></textarea>', '<span data-count="uc-approach"></span>')) +
      section(3, "Evidence & artifacts", "Link the test cases and files that back up your proposal.",
        field("uc-results", "Test results", '<textarea class="input" id="uc-results" style="min-height:140px" placeholder="What did you try, and what happened?">Exposed candidate search as an MCP server behind Entra ID. 18 of 20 recruiter questions answered correctly from Copilot and Claude.</textarea>') +
        field("uc-link", "Repository or demo link", '<input class="input" id="uc-link" type="url" placeholder="https://" value="https://dev.azure.com/neuleap/tech-radar/mcp-candidate-search">') +
        '<div class="col gap-12" id="files"><div class="file-row"><i data-lucide="file-code-2"></i><div class="col grow"><span class="t-body-medium text-strong">mcp-server.zip</span><span class="t-small text-muted">48 KB · uploaded to SharePoint</span></div><button type="button" class="icon-btn icon-btn--plain" data-remove-file aria-label="Remove file"><i data-lucide="trash-2"></i></button></div>' +
        '<div class="file-row"><i data-lucide="file-bar-chart"></i><div class="col grow"><span class="t-body-medium text-strong">recruiter-eval.xlsx</span><span class="t-small text-muted">22 KB · uploaded to SharePoint</span></div><button type="button" class="icon-btn icon-btn--plain" data-remove-file aria-label="Remove file"><i data-lucide="trash-2"></i></button></div></div>' +
        '<div><button type="button" class="btn btn--secondary btn--sm" id="add-file"><i data-lucide="paperclip"></i>Attach file</button><input type="file" id="file-input" hidden multiple></div>') +
      section(4, "Impact", "Help reviewers understand why this matters.",
        '<div class="form-grid">' + field("uc-effort", "Estimated effort", '<label class="select select--square" style="width:100%"><select id="uc-effort" style="width:100%"><option>Less than 2 weeks</option><option selected>2–6 weeks</option><option>More than 6 weeks</option></select><i data-lucide="chevron-down"></i></label>') +
        field("uc-users", "People affected", '<input class="input" id="uc-users" type="number" min="1" value="35">') + "</div>" +
        field("uc-impact", "Expected impact", '<textarea class="input" id="uc-impact" placeholder="Time saved, risk reduced, revenue…">Cuts scheduling lookups from ~6 minutes to under 1 minute per candidate.</textarea>')) +
      '<div class="form-actions"><a class="btn btn--ghost" href="dashboard.html">Cancel</a><button type="button" class="btn btn--secondary" id="save-draft"><i data-lucide="save"></i>Save draft</button><button type="submit" class="btn btn--primary"><i data-lucide="send"></i>Submit use case</button></div>' +
      "</div>" +
      '<aside class="rail"><section class="card gap-12" style="background:var(--status-purple-tint);border-color:transparent"><div class="row"><i data-lucide="sparkles" style="width:20px;height:20px;color:var(--status-purple)"></i><strong class="t-body-medium text-strong">Agent suggestion</strong></div>' +
      '<p class="t-body">Start the approach with a read-only MCP server over the candidate index, scoped to recruiters through Entra ID groups, then add write tools for scheduling.</p>' +
      '<button type="button" class="btn btn--outline btn--sm" id="use-suggestion" style="align-self:flex-start"><i data-lucide="wand-sparkles"></i>Use this suggestion</button></section>' +
      '<section class="card gap-12"><strong class="t-body-medium text-strong">Where this is saved</strong>' +
      '<div class="row gap-12" style="align-items:flex-start"><span class="icon-tile icon-tile--sm"><i data-lucide="cloud"></i></span><div class="col gap-4"><span class="t-body-medium text-strong">SharePoint · Tech Radar</span><span class="t-small text-muted">/Use cases/Model Context Protocol/. Files sync automatically.</span></div></div>' +
      '<div class="row gap-12" style="align-items:flex-start"><span class="icon-tile icon-tile--sm icon-tile--success"><i data-lucide="shield-check"></i></span><div class="col gap-4"><span class="t-body-medium text-strong">Visible to moderators</span><span class="t-small text-muted">Published after review, usually within 2 days.</span></div></div>' +
      '<p class="t-small text-muted" id="draft-state">Not saved yet</p></section></aside></form>';

    function count(id) {
      var el = $("#" + id);
      var out = $('[data-count="' + id + '"]');
      out.textContent = el.value.length + " / " + el.maxLength;
    }
    ["uc-problem", "uc-approach"].forEach(function (id) {
      count(id);
      $("#" + id).addEventListener("input", function () { count(id); });
    });

    $("#use-suggestion").addEventListener("click", function () {
      var a = $("#uc-approach");
      a.value = "Start with a read-only MCP server over the candidate index, scoped to recruiters through Entra ID groups. Phase 2 adds write tools for scheduling interviews and moving candidates between rounds.";
      count("uc-approach");
      a.focus();
    });
    $("#add-file").addEventListener("click", function () { $("#file-input").click(); });
    $("#file-input").addEventListener("change", function () {
      Array.prototype.forEach.call(this.files, function (f) {
        $("#files").insertAdjacentHTML("beforeend", '<div class="file-row"><i data-lucide="file"></i><div class="col grow"><span class="t-body-medium text-strong">' + esc(f.name) + '</span><span class="t-small text-muted">' + Math.max(1, Math.round(f.size / 1024)) + ' KB · ready to upload</span></div><button type="button" class="icon-btn icon-btn--plain" data-remove-file aria-label="Remove file"><i data-lucide="trash-2"></i></button></div>');
      });
      this.value = "";
      NL.icons();
    });
    $("#files").addEventListener("click", function (e) {
      var r = e.target.closest("[data-remove-file]");
      if (r) r.closest(".file-row").remove();
    });
    $("#save-draft").addEventListener("click", function () {
      $("#draft-state").textContent = "Draft saved at " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      NL.toast("Draft saved", "save");
    });
    $("#uc-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var first = null;
      $all("[required]", this).forEach(function (el) {
        var f = el.closest(".field");
        var bad = !el.value.trim();
        f.classList.toggle("is-error", bad);
        $("[data-error]", f).hidden = !bad;
        if (bad && !first) first = el;
      });
      if (first) { first.focus(); first.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
      NL.toast("Use case submitted for review", "send");
      setTimeout(function () { location.href = "dashboard.html"; }, 1200);
    });
  }

  function pageArtifacts(main) {
    var type = "All";
    main.innerHTML = '<section class="card sync-strip"><span class="icon-tile icon-tile--sm"><i data-lucide="cloud"></i></span><div class="col gap-4 grow"><strong class="t-body-medium text-strong">Synced with SharePoint</strong><span class="t-small text-muted" id="sync-meta">/sites/TechRadar/Artifacts · last synced 4 minutes ago</span></div><button class="btn btn--secondary btn--sm" id="sync-now"><i data-lucide="refresh-cw"></i>Sync now</button></section>' +
      '<div class="toolbar row wrap gap-16" style="margin:24px 0 16px"><div class="segmented" id="mine">' + ["All", "Mine", "Shared with me"].map(function (s, i) { return '<button class="' + (i ? "" : "is-active") + '" data-scope="' + s + '">' + s + "</button>"; }).join("") + '</div><span class="spacer"></span>' +
      '<label class="search" style="width:280px"><i data-lucide="search"></i><input class="input" id="art-search" type="search" placeholder="Search artifacts" aria-label="Search artifacts"></label>' +
      '<label class="select select--square"><i data-lucide="filter"></i><span class="sr-only">Type</span><select id="art-type"><option>All types</option><option>Code</option><option>Report</option><option>Document</option><option>Notebook</option><option>Slides</option></select><i data-lucide="chevron-down"></i></label></div>' +
      '<div class="artifact-grid" id="art-grid"></div>' +
      '<div class="modal" id="upload-modal" role="dialog" aria-labelledby="up-title" aria-hidden="true"><div class="modal__header"><div class="grow"><h2 class="t-title" id="up-title">Upload artifact</h2><p class="t-body text-muted">Files are stored in SharePoint and linked to the topic.</p></div><button class="icon-btn icon-btn--round" data-close aria-label="Close"><i data-lucide="x"></i></button></div>' +
      '<form class="col gap-16" id="up-form"><div class="field"><label class="field__label" for="up-name">Title</label><input class="input" id="up-name" required placeholder="e.g. RAG evaluation notebook"></div>' +
      '<div class="field"><label class="field__label" for="up-topic">Topic</label><label class="select select--square"><select id="up-topic" style="width:100%">' + D.topics.map(function (t) { return "<option>" + esc(t.title) + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></label></div>' +
      '<div class="field"><label class="field__label" for="up-type">Type</label><label class="select select--square"><select id="up-type" style="width:100%"><option>Code</option><option>Report</option><option>Document</option><option>Notebook</option><option>Slides</option></select><i data-lucide="chevron-down"></i></label></div>' +
      '<div class="row gap-12" style="justify-content:flex-end"><button type="button" class="btn btn--secondary" data-close>Cancel</button><button class="btn btn--primary" type="submit">Upload</button></div></form></div>';

    var scope = "All";
    function render() {
      var q = $("#art-search").value.trim().toLowerCase();
      var t = $("#art-type").value;
      var list = D.artifacts.filter(function (a) {
        return (t === "All types" || a.type === t) &&
          (scope === "All" || (scope === "Mine" ? a.author === D.user.name : a.author !== D.user.name)) &&
          (!q || (a.title + a.topic + a.author).toLowerCase().indexOf(q) > -1);
      });
      var tone = { Published: "success", "In review": "warning", Draft: "", Archived: "error" };
      $("#art-grid").innerHTML = list.length ? list.map(function (a) {
        var i = D.artifacts.indexOf(a);
        return '<article class="card artifact"><div class="artifact__top"><span class="icon-tile"><i data-lucide="' + a.icon + '"></i></span><div class="col gap-4 grow"><h3 class="t-subhead" style="font-weight:500">' + esc(a.title) + '</h3><span class="t-small text-muted">' + esc(a.topic) + " · " + esc(a.author) + " · " + a.updated + "</span></div>" + chip(a.status, tone[a.status]) + "</div>" +
          '<div class="row wrap">' + chip(a.type, "info") + '<span class="spacer"></span><button class="btn btn--ghost btn--sm" data-share="' + i + '"><i data-lucide="share-2"></i>Share</button><button class="btn btn--outline btn--sm" data-open-art="' + i + '"><i data-lucide="external-link"></i>Open in SharePoint</button></div></article>';
      }).join("") : '<div class="card empty" style="grid-column:1/-1"><i data-lucide="folder-search"></i><p>No artifacts match your filters.</p></div>';
      NL.icons();
    }
    $("#art-search").addEventListener("input", render);
    $("#art-type").addEventListener("change", render);
    $("#mine").addEventListener("click", function (e) {
      var b = e.target.closest("[data-scope]");
      if (!b) return;
      scope = b.getAttribute("data-scope");
      $all("[data-scope]", this).forEach(function (x) { x.classList.toggle("is-active", x === b); });
      render();
    });
    $("#art-grid").addEventListener("click", function (e) {
      var s = e.target.closest("[data-share]");
      var o = e.target.closest("[data-open-art]");
      if (s) {
        var link = "https://neuleap.sharepoint.com/sites/TechRadar/Artifacts/" + encodeURIComponent(D.artifacts[+s.getAttribute("data-share")].title);
        if (navigator.clipboard) navigator.clipboard.writeText(link).catch(function () {});
        NL.toast("Link copied to clipboard", "link");
      }
      if (o) NL.toast("Opening in SharePoint…", "external-link");
    });
    $("#sync-now").addEventListener("click", function () {
      $("#sync-meta").textContent = "/sites/TechRadar/Artifacts · last synced just now";
      NL.toast("SharePoint sync complete", "cloud");
    });
    $("#up-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#up-name").value.trim();
      if (!name) { $("#up-name").focus(); return; }
      var type = $("#up-type").value;
      D.artifacts.unshift({ title: name, type: type, icon: { Code: "code-xml", Report: "file-bar-chart", Document: "file-text", Notebook: "notebook-pen", Slides: "presentation" }[type], topic: $("#up-topic").value, author: D.user.name, updated: "Updated just now", status: "Draft" });
      this.reset();
      NL.close("upload-modal");
      render();
      NL.toast("Artifact uploaded", "upload");
    });
    render();
  }

  /* ---------- Admin pages ---------- */
  function radarSvg() {
    var rings = ["Adopt", "Trial", "Assess", "Hold"];
    var quads = ["AI & ML", "Platforms", "Data", "Security"];
    var colors = ["var(--blue-100)", "var(--violet-100)", "var(--green-100)", "var(--amber-100)"];
    var blips = [
      ["MCP", 1, 0.5, 1], ["SLMs on-device", 0, 1.3, 0.6], ["RAG evals", 0, 0.6, 1.2], ["Agents SDK", 0, 1.6, 1.3],
      ["DuckDB", 2, 2.4, 0.5], ["Iceberg", 2, 2.2, 1.1], ["dbt", 2, 0.7, 0.8],
      ["Passkeys", 3, 1.4, 0.7], ["SBOMs", 3, 2.5, 1.2], ["WebGPU", 1, 3.4, 0.9], ["Wasm components", 1, 2.6, 1.3]
    ];
    var c = 200, R = 180;
    var s = '<svg class="radar" viewBox="0 0 400 400" role="img" aria-label="Technology radar">';
    for (var i = 4; i >= 1; i--) s += '<circle class="ring" cx="' + c + '" cy="' + c + '" r="' + (R * i / 4) + '"></circle>';
    s += '<line x1="20" y1="200" x2="380" y2="200" stroke="var(--border-strong)"></line><line x1="200" y1="20" x2="200" y2="380" stroke="var(--border-strong)"></line>';
    rings.forEach(function (r, i) { s += '<text x="' + (c + 4) + '" y="' + (c - R * (i + 1) / 4 + 14) + '">' + r + "</text>"; });
    blips.forEach(function (b) {
      var q = b[1], rr = (b[2] / 4) * R, ang = (q * 90 + 12 + (b[3] / 1.4) * 66) * Math.PI / 180;
      var x = c + rr * Math.cos(ang), y = c - rr * Math.sin(ang);
      s += '<circle class="blip" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="7" fill="' + colors[q] + '"><title>' + b[0] + " · " + quads[q] + " · " + rings[Math.floor(b[2])] + "</title></circle>";
    });
    return s + "</svg>" + '<div class="radar-legend">' + quads.map(function (q, i) { return '<span class="row t-small"><i style="width:10px;height:10px;border-radius:50%;background:' + colors[i] + '"></i>' + q + "</span>"; }).join("") + "</div>";
  }

  function pageAdminOverview(main) {
    main.innerHTML = '<div class="kpis">' + A.kpis.map(function (k) {
      return '<div class="card kpi"><span class="t-small text-muted">' + k.label + '</span><span class="stat__value">' + k.value + '</span><span class="kpi__delta ' + (k.up ? "text-success" : "text-error") + '">' + k.delta + "</span></div>";
    }).join("") + "</div>" +
      '<div class="grid grid-2" style="margin-top:24px;align-items:start"><section class="card gap-8"><h2 class="card__title">Needs attention</h2><div>' + A.attention.map(function (a) {
        return '<div class="attention"><span class="icon-tile icon-tile--sm' + (a.tone ? " icon-tile--" + a.tone : "") + '"><i data-lucide="' + a.icon + '"></i></span><div class="col gap-4 grow"><strong class="t-body-medium text-strong">' + a.title + '</strong><span class="t-small text-muted">' + a.meta + '</span></div><a class="btn btn--outline btn--sm" href="' + a.href + '">' + a.cta + "</a></div>";
      }).join("") + "</div></section>" +
      '<section class="card gap-16"><div class="card__header"><h2 class="card__title grow">Radar snapshot</h2>' + chip("48 topics", "info") + "</div>" + radarSvg() + "</section></div>";
  }

  function toggle(on, label, attrs) {
    return '<label class="switch"><input type="checkbox"' + (on ? " checked" : "") + ' aria-label="' + esc(label) + '"' + (attrs || "") + "></label>";
  }

  function pageAdminDiscovery(main) {
    main.innerHTML = '<div class="grid grid-main-aside"><div class="col gap-24">' +
      '<section class="card card--flush"><div class="card__header" style="padding:24px 24px 16px"><h2 class="card__title grow">Sources</h2><button class="btn btn--ghost btn--sm" id="add-source"><i data-lucide="plus"></i>Add source</button></div>' +
      '<div class="table-wrap" style="border-radius:0;border-left:0;border-right:0;border-bottom:0"><table class="table"><thead><tr><th>Source</th><th>Type</th><th>Items scanned</th><th>Last run</th><th>Enabled</th></tr></thead><tbody>' + A.sources.map(function (s) {
        return '<tr><td class="text-strong t-body-medium">' + s.name + "</td><td>" + chip(s.kind) + "</td><td>" + s.items + '</td><td class="text-muted">' + s.last + "</td><td>" + toggle(s.on, s.name, " data-source") + "</td></tr>";
      }).join("") + "</tbody></table></div></section>" +
      '<section class="card gap-8"><h2 class="card__title">Recent runs</h2><div id="runs">' + runsHtml() + "</div></section></div>" +
      '<aside class="col gap-24"><section class="card gap-8"><h2 class="card__title">Categories</h2>' + A.categories.map(function (c) {
        return '<div class="setting-row"><span class="t-body grow">' + c.name + "</span>" + toggle(c.on, c.name) + "</div>";
      }).join("") + "</section>" +
      '<section class="card gap-16"><h2 class="card__title">Relevance</h2>' +
      '<div class="field"><label class="field__label" for="threshold">Threshold <span class="text-link" id="th-val">0.72</span></label><input class="range" id="threshold" type="range" min="0.5" max="0.95" step="0.01" value="0.72"><span class="field__hint">Only topics scoring above this are shown to employees.</span></div>' +
      '<div class="field"><span class="field__label">Include keywords</span><div class="chip-input" data-kw="include">' + A.include.map(kwChip).join("") + '<input placeholder="Add keyword" aria-label="Add include keyword"></div></div>' +
      '<div class="field"><span class="field__label">Exclude keywords</span><div class="chip-input" data-kw="exclude">' + A.exclude.map(kwChip).join("") + '<input placeholder="Add keyword" aria-label="Add exclude keyword"></div></div>' +
      '<button class="btn btn--primary" id="save-relevance">Save changes</button></section></aside></div>';

    $("#threshold").addEventListener("input", function () { $("#th-val").textContent = (+this.value).toFixed(2); });
    $all(".chip-input").forEach(function (box) {
      var input = $("input", box);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && input.value.trim()) {
          e.preventDefault();
          input.insertAdjacentHTML("beforebegin", kwChip(input.value.trim()));
          input.value = "";
          NL.icons();
        } else if (e.key === "Backspace" && !input.value) {
          var last = input.previousElementSibling;
          if (last) last.remove();
        }
      });
      box.addEventListener("click", function (e) {
        var rm = e.target.closest("[data-rm]");
        if (rm) rm.closest(".chip").remove();
        else input.focus();
      });
    });
    $("#save-relevance").addEventListener("click", function () { NL.toast("Relevance settings saved"); });
    $("#add-source").addEventListener("click", function () { NL.toast("Source connectors: RSS, GitHub and Teams channels", "plug"); });
    main.addEventListener("change", function (e) {
      if (e.target.matches("[data-source]")) NL.toast((e.target.checked ? "Enabled " : "Disabled ") + e.target.getAttribute("aria-label"));
    });
    $("#run-now").addEventListener("click", function () {
      var b = this;
      b.disabled = true;
      b.innerHTML = '<i data-lucide="loader-circle"></i>Running…';
      NL.icons();
      setTimeout(function () {
        A.runs.unshift({ at: "Just now", found: 9, kept: 4, status: "Completed" });
        $("#runs").innerHTML = runsHtml();
        b.disabled = false;
        b.innerHTML = '<i data-lucide="play"></i>Run now';
        NL.icons();
        NL.toast("Discovery run complete — 4 new topics");
      }, 1600);
    });
  }

  function runsHtml() {
    return A.runs.map(function (r) {
      var ok = r.status === "Completed";
      return '<div class="attention"><span class="icon-tile icon-tile--sm ' + (ok ? "icon-tile--success" : "icon-tile--error") + '"><i data-lucide="' + (ok ? "check" : "x") + '"></i></span><div class="col gap-4 grow"><strong class="t-body-medium text-strong">' + r.at + '</strong><span class="t-small text-muted">' + (ok ? r.found + " candidates found · " + r.kept + " kept after relevance filter" : r.status) + "</span></div>" + chip(ok ? "Completed" : "Failed", ok ? "success" : "error") + "</div>";
    }).join("");
  }

  function kwChip(k) {
    return '<span class="chip chip--info">' + esc(k) + '<button type="button" data-rm aria-label="Remove ' + esc(k) + '"><i data-lucide="x"></i></button></span>';
  }

  function pageAdminVolunteers(main) {
    var counts = { Active: 0, Pending: 0, Overdue: 0, Completed: 0 };
    A.volunteers.forEach(function (v) { counts[v.status] += 1; });
    var tone = { Active: "info", Pending: "", Overdue: "error", Completed: "success" };
    main.innerHTML = '<div class="grid grid-4">' + Object.keys(counts).map(function (k) {
      return '<div class="card kpi"><span class="row t-small text-muted"><span class="chip chip--dot chip--' + (tone[k] || "") + '" style="padding:0;background:none"></span>' + k + '</span><span class="stat__value">' + counts[k] + "</span></div>";
    }).join("") + "</div>" +
      '<div class="toolbar row wrap gap-16" style="margin:24px 0 16px"><label class="search" style="width:320px"><i data-lucide="search"></i><input class="input" id="v-search" type="search" placeholder="Search volunteers" aria-label="Search volunteers"></label><span class="spacer"></span>' +
      '<label class="select select--square"><i data-lucide="filter"></i><span class="sr-only">Status</span><select id="v-status"><option>All statuses</option><option>Active</option><option>Pending</option><option>Overdue</option><option>Completed</option></select><i data-lucide="chevron-down"></i></label></div>' +
      '<div class="table-wrap"><table class="table" data-sortable><thead><tr><th>Volunteer</th><th>Topic</th><th>Status</th><th class="sortable">Progress<i data-lucide="arrow-up-down"></i></th><th>Due</th><th></th></tr></thead><tbody id="v-body"></tbody></table></div>';
    function render() {
      var q = $("#v-search").value.trim().toLowerCase();
      var st = $("#v-status").value;
      $("#v-body").innerHTML = A.volunteers.filter(function (v) {
        return (st === "All statuses" || v.status === st) && (!q || (v.name + v.topic).toLowerCase().indexOf(q) > -1);
      }).map(function (v) {
        return '<tr><td><div class="cell-person">' + avatar(v.name) + v.name + "</div></td><td>" + esc(v.topic) + "</td><td>" + chip(v.status, tone[v.status]) + '</td><td data-sort="' + v.progress + '" style="width:200px"><div class="row gap-12"><div class="progress grow' + (v.status === "Overdue" ? " progress--warning" : v.progress === 100 ? " progress--success" : "") + '"><span style="width:' + v.progress + '%"></span></div><span class="t-small text-muted">' + v.progress + "%</span></div></td><td>" + v.due + "</td>" +
          '<td style="text-align:right">' + (v.status === "Completed" ? '<button class="btn btn--ghost btn--sm" data-thank="' + esc(v.name) + '"><i data-lucide="party-popper"></i>Thank</button>' : '<button class="btn btn--outline btn--sm" data-nudge="' + esc(v.name) + '"><i data-lucide="bell-ring"></i>Nudge</button>') + "</td></tr>";
      }).join("") || '<tr><td colspan="6" class="table-empty">No volunteers match.</td></tr>';
      NL.icons();
    }
    $("#v-search").addEventListener("input", render);
    $("#v-status").addEventListener("change", render);
    $("#v-body").addEventListener("click", function (e) {
      var n = e.target.closest("[data-nudge]");
      var t = e.target.closest("[data-thank]");
      if (n) { n.disabled = true; n.textContent = "Nudged"; NL.toast("Reminder sent to " + n.getAttribute("data-nudge") + " on Teams", "bell-ring"); }
      if (t) NL.toast("Kudos sent to " + t.getAttribute("data-thank"), "party-popper");
    });
    $("#invite-btn").addEventListener("click", function () { NL.toast("Invitations sent to 12 past contributors", "send"); });
    render();
    NL.initSortable(main);
  }

  function pageAdminSchedule(main) {
    main.innerHTML = '<div class="grid grid-main-aside"><section class="card gap-16"><div class="card__header"><h2 class="card__title grow">Upcoming</h2><div class="segmented"><button class="is-active">List</button><button data-soon>Calendar</button></div></div><div class="col gap-12" id="sessions"></div></section>' +
      '<aside class="card gap-16"><h2 class="card__title">Awaiting a slot</h2><div class="col gap-12" id="awaiting"></div></aside></div>' +
      '<div class="modal" id="session-modal" role="dialog" aria-labelledby="s-title" aria-hidden="true"><div class="modal__header"><div class="grow"><h2 class="t-title" id="s-title">New session</h2><p class="t-body text-muted">Invites are sent from Outlook to everyone in the topic.</p></div><button class="icon-btn icon-btn--round" data-close aria-label="Close"><i data-lucide="x"></i></button></div>' +
      '<form class="col gap-16" id="s-form"><div class="field"><label class="field__label" for="s-name">Title</label><input class="input" id="s-name" required placeholder="What will be presented?"></div>' +
      '<div class="field"><label class="field__label" for="s-who">Presenter</label><input class="input" id="s-who" required placeholder="Name"></div>' +
      '<div class="row gap-16 wrap"><div class="field grow"><label class="field__label" for="s-date">Date</label><input class="input" id="s-date" type="date" required value="2026-11-18"></div><div class="field grow"><label class="field__label" for="s-time">Time</label><input class="input" id="s-time" type="time" value="16:00"></div></div>' +
      '<div class="row gap-12" style="justify-content:flex-end"><button type="button" class="btn btn--secondary" data-close>Cancel</button><button class="btn btn--primary" type="submit">Schedule</button></div></form></div>';

    function render() {
      $("#sessions").innerHTML = A.sessions.map(function (s, i) {
        return '<div class="session"><div class="date-tile"><div><strong>' + s.day + "</strong><span>" + s.month + '</span></div></div><div class="col gap-4 grow"><strong class="t-body-medium text-strong">' + esc(s.title) + '</strong><span class="t-small text-muted">' + esc(s.who) + " · " + s.time + '</span></div><button class="btn btn--secondary btn--sm" data-resched="' + i + '">Reschedule</button><button class="btn btn--destructive btn--sm" data-cancel="' + i + '">Cancel</button></div>';
      }).join("") || '<div class="empty"><i data-lucide="calendar-x"></i><p>No sessions scheduled.</p></div>';
      $("#awaiting").innerHTML = A.awaiting.map(function (a, i) {
        return '<div class="invite"><div class="row gap-12">' + avatar(a.name) + '<div class="col gap-4 grow"><strong class="t-body-medium text-strong">' + esc(a.name) + '</strong><span class="t-small text-muted">' + esc(a.topic) + " · " + a.length + '</span></div></div><button class="btn btn--outline btn--sm" data-slot="' + i + '" style="align-self:flex-start"><i data-lucide="calendar-plus"></i>Schedule</button></div>';
      }).join("") || '<p class="t-body text-muted">Everyone has a slot.</p>';
      NL.icons();
    }
    main.addEventListener("click", function (e) {
      var c = e.target.closest("[data-cancel]");
      var r = e.target.closest("[data-resched]");
      var sl = e.target.closest("[data-slot]");
      if (c) { var s = A.sessions.splice(+c.getAttribute("data-cancel"), 1)[0]; render(); NL.toast("Cancelled “" + s.title + "”", "calendar-x"); }
      if (r) NL.toast("Pick a new time in Outlook — attendees will be updated", "calendar-clock");
      if (sl) {
        var a = A.awaiting[+sl.getAttribute("data-slot")];
        $("#s-name").value = a.topic;
        $("#s-who").value = a.name;
        $("#s-form").setAttribute("data-from", sl.getAttribute("data-slot"));
        NL.open("session-modal");
      }
    });
    $("#s-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new Date($("#s-date").value + "T" + ($("#s-time").value || "16:00"));
      if (isNaN(d)) return;
      A.sessions.push({ day: String(d.getDate()), month: d.toLocaleString("en", { month: "short" }), title: $("#s-name").value, who: $("#s-who").value, time: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + " · Teams" });
      var from = this.getAttribute("data-from");
      if (from !== null) { A.awaiting.splice(+from, 1); this.removeAttribute("data-from"); }
      this.reset();
      NL.close("session-modal");
      render();
      NL.toast("Session scheduled", "calendar-check");
    });
    render();
  }

  function pageAdminModeration(main) {
    main.innerHTML = '<div class="info-strip"><i data-lucide="shield-check"></i><div class="col gap-4 grow"><strong class="t-body-medium text-strong"><span id="mod-count">' + A.moderation.length + '</span> items waiting for review</strong><span class="t-small text-muted">Approved items are published to everyone and synced to SharePoint.</span></div><button class="btn btn--secondary btn--sm" id="approve-all">Approve all use cases</button><button class="btn btn--ghost btn--sm" data-soon>Review guidelines</button></div>' +
      '<div class="toolbar row wrap gap-16" style="margin-bottom:16px"><label class="select select--square"><span class="sr-only">Type</span><select id="m-type"><option>All types</option><option>Use case</option><option>Artifact</option></select><i data-lucide="chevron-down"></i></label>' +
      '<label class="select select--square"><span class="sr-only">Topic</span><select id="m-topic"><option>All topics</option>' + Array.from(new Set(A.moderation.map(function (m) { return m.topic; }))).map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></label></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th>Type</th><th>Author</th><th>Topic</th><th>Submitted</th><th style="text-align:right">Actions</th></tr></thead><tbody id="m-body"></tbody></table></div>';
    function render() {
      var t = $("#m-type").value, tp = $("#m-topic").value;
      $("#m-body").innerHTML = A.moderation.map(function (m, i) { return { m: m, i: i }; }).filter(function (x) {
        return (t === "All types" || x.m.type === t) && (tp === "All topics" || x.m.topic === tp);
      }).map(function (x) {
        var m = x.m;
        return '<tr><td class="text-strong t-body-medium">' + esc(m.title) + "</td><td>" + chip(m.type, m.type === "Use case" ? "purple" : "info") + '</td><td><div class="cell-person" style="font-weight:400">' + avatar(m.author) + esc(m.author) + "</div></td><td>" + esc(m.topic) + '</td><td class="text-muted">' + m.submitted + '</td><td><div class="row" style="justify-content:flex-end"><button class="btn btn--ghost btn--sm" data-preview>Preview</button><button class="btn btn--destructive btn--sm" data-reject="' + x.i + '">Reject</button><button class="btn btn--primary btn--sm" data-approve="' + x.i + '">Approve</button></div></td></tr>';
      }).join("") || '<tr><td colspan="6"><div class="empty"><i data-lucide="check-check"></i><p>Nothing to review — nice work.</p></div></td></tr>';
      $("#mod-count").textContent = A.moderation.length;
      NL.icons();
    }
    $("#m-type").addEventListener("change", render);
    $("#m-topic").addEventListener("change", render);
    main.addEventListener("click", function (e) {
      var a = e.target.closest("[data-approve]");
      var r = e.target.closest("[data-reject]");
      if (a || r) {
        var item = A.moderation.splice(+(a || r).getAttribute(a ? "data-approve" : "data-reject"), 1)[0];
        render();
        NL.toast((a ? "Approved: " : "Rejected: ") + item.title, a ? "check-circle-2" : "x-circle");
      }
      if (e.target.closest("[data-preview]")) NL.toast("Opening preview…", "eye");
      if (e.target.closest("#approve-all")) {
        var n = A.moderation.filter(function (m) { return m.type === "Use case"; }).length;
        A.moderation = A.moderation.filter(function (m) { return m.type !== "Use case"; });
        render();
        NL.toast("Approved " + n + " use cases");
      }
    });
    render();
  }

  function pageAdminUsers(main) {
    main.innerHTML = '<div class="info-strip"><i data-lucide="refresh-cw"></i><div class="col gap-4 grow"><strong class="t-body-medium text-strong">Users sync from Microsoft Entra ID</strong><span class="t-small text-muted">Everyone in the “Neuleap — All Employees” group can sign in. Roles here only control what they can do in Tech Radar.</span></div><button class="btn btn--secondary btn--sm" id="sync-users"><i data-lucide="refresh-cw"></i>Sync now</button></div>' +
      '<div class="toolbar row wrap gap-16" style="margin-bottom:16px"><label class="search" style="width:320px"><i data-lucide="search"></i><input class="input" id="u-search" type="search" placeholder="Search people" aria-label="Search people"></label><span class="spacer"></span>' +
      '<label class="select select--square"><span class="sr-only">Role</span><select id="u-role"><option>All roles</option><option>Admin</option><option>Moderator</option><option>Contributor</option><option>Viewer</option></select><i data-lucide="chevron-down"></i></label>' +
      '<label class="select select--square"><span class="sr-only">Status</span><select id="u-status"><option>All statuses</option><option>Active</option><option>Invited</option><option>Suspended</option></select><i data-lucide="chevron-down"></i></label></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>User</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody id="u-body"></tbody></table></div>';
    var tone = { Active: "success", Invited: "warning", Suspended: "error" };
    function render() {
      var q = $("#u-search").value.trim().toLowerCase(), r = $("#u-role").value, s = $("#u-status").value;
      $("#u-body").innerHTML = A.users.map(function (u, i) { return { u: u, i: i }; }).filter(function (x) {
        return (r === "All roles" || x.u.role === r) && (s === "All statuses" || x.u.status === s) && (!q || (x.u.name + x.u.email).toLowerCase().indexOf(q) > -1);
      }).map(function (x) {
        var u = x.u;
        return '<tr><td><div class="cell-person">' + avatar(u.name) + '<div class="col" style="gap:0"><span>' + esc(u.name) + '</span><span class="t-small text-muted" style="font-weight:400">' + esc(u.email) + "</span></div></div></td>" +
          '<td><label class="select select--square" style="height:36px"><span class="sr-only">Role for ' + esc(u.name) + '</span><select data-role="' + x.i + '">' + ["Admin", "Moderator", "Contributor", "Viewer"].map(function (r) { return "<option" + (r === u.role ? " selected" : "") + ">" + r + "</option>"; }).join("") + '</select><i data-lucide="chevron-down"></i></label></td>' +
          "<td>" + chip(u.status, tone[u.status]) + '</td><td style="text-align:right">' + (u.status === "Suspended" ? '<button class="btn btn--outline btn--sm" data-restore="' + x.i + '">Restore</button>' : u.status === "Invited" ? '<button class="btn btn--ghost btn--sm" data-resend="' + x.i + '">Resend invite</button>' : '<button class="btn btn--destructive btn--sm" data-suspend="' + x.i + '"' + (u.name === D.user.name ? " disabled" : "") + ">Suspend</button>") + "</td></tr>";
      }).join("");
      NL.icons();
    }
    ["u-search", "u-role", "u-status"].forEach(function (id) { $("#" + id).addEventListener(id === "u-search" ? "input" : "change", render); });
    main.addEventListener("change", function (e) {
      var sel = e.target.closest("[data-role]");
      if (!sel) return;
      var u = A.users[+sel.getAttribute("data-role")];
      u.role = sel.value;
      NL.toast(u.name + " is now " + u.role);
    });
    main.addEventListener("click", function (e) {
      var b = e.target.closest("[data-suspend],[data-restore],[data-resend]");
      if (e.target.closest("#sync-users")) NL.toast("Synced 214 users from Entra ID", "refresh-cw");
      if (!b) return;
      var key = b.hasAttribute("data-suspend") ? "data-suspend" : b.hasAttribute("data-restore") ? "data-restore" : "data-resend";
      var u = A.users[+b.getAttribute(key)];
      if (key === "data-suspend") u.status = "Suspended";
      if (key === "data-restore") u.status = "Active";
      render();
      NL.toast(key === "data-resend" ? "Invite resent to " + u.email : u.name + (key === "data-suspend" ? " suspended" : " restored"));
    });
    render();
  }

  function pageAdminBadges(main) {
    main.innerHTML = '<div class="grid grid-main-aside"><section class="card gap-8"><div class="col gap-4"><h2 class="card__title">Badges</h2><p class="t-body text-muted">Badges are awarded automatically when someone reaches the threshold.</p></div><div id="badge-rows"></div></section>' +
      '<aside class="card gap-16"><h2 class="card__title">Certificates</h2><p class="t-body text-muted">Issued each quarter to contributors who earned at least two badges.</p>' +
      '<div class="cert"><span class="icon-tile icon-tile--purple"><i data-lucide="award"></i></span><div class="col gap-4 grow"><strong class="t-body-medium text-strong">Tech Radar Contributor · Q4 2026</strong><span class="t-small text-muted">14 people eligible · issues 2 Jan 2027</span></div></div>' +
      '<div class="setting-row"><span class="t-body grow">Email certificates automatically</span>' + toggle(true, "Email certificates automatically") + "</div>" +
      '<div class="setting-row"><span class="t-body grow">Share wins in #tech-radar</span>' + toggle(true, "Share wins in #tech-radar") + "</div>" +
      '<button class="btn btn--outline" id="issue-now"><i data-lucide="send"></i>Issue Q4 certificates now</button></aside></div>';
    function render() {
      $("#badge-rows").innerHTML = A.badgeRules.map(function (b, i) {
        return '<div class="attention">' + badgeIcon(b) + '<div class="col gap-4 grow"><strong class="t-body-medium text-strong">' + b.name + '</strong><span class="t-small text-muted">' + b.rule + " · earned by " + b.earned + ' people</span></div><label class="row gap-8 t-small text-muted">Threshold<input class="input" type="number" min="1" value="' + b.threshold + '" data-threshold="' + i + '" style="width:72px;height:36px;padding:0 10px" aria-label="Threshold for ' + b.name + '">' + b.unit + '</label><button class="btn btn--ghost btn--sm" data-edit="' + i + '"><i data-lucide="pencil"></i>Edit</button></div>';
      }).join("");
      NL.icons();
    }
    main.addEventListener("change", function (e) {
      var t = e.target.closest("[data-threshold]");
      if (t) { A.badgeRules[+t.getAttribute("data-threshold")].threshold = +t.value; NL.toast("Threshold updated"); }
    });
    main.addEventListener("click", function (e) {
      if (e.target.closest("[data-edit]")) NL.toast("Badge artwork and copy are edited in the brand library", "pencil");
      if (e.target.closest("#issue-now")) NL.toast("14 certificates issued", "award");
    });
    $("#new-badge").addEventListener("click", function () {
      A.badgeRules.push({ name: "Mentor", icon: "graduation-cap", tone: "amber", rule: "Pair with a first-time volunteer", threshold: 1, unit: "pairing", earned: 0 });
      render();
      NL.toast("Badge “Mentor” created");
    });
    render();
  }

  function pageAdminSettings(main) {
    var tone = function (s) { return s === "Connected" ? "success" : s === "Not connected" ? "" : "warning"; };
    main.innerHTML = '<div class="grid grid-2" style="align-items:start"><div class="col gap-24">' +
      '<section class="card gap-8"><h2 class="card__title">Integrations</h2><div id="integrations"></div></section>' +
      '<section class="card gap-8"><h2 class="card__title">Default invitation rules</h2>' + A.rules.map(function (r) { return '<div class="setting-row"><span class="t-body grow">' + r.name + "</span>" + toggle(r.on, r.name) + "</div>"; }).join("") + "</section>" +
      '<section class="card gap-8"><h2 class="card__title">Data retention</h2><div class="setting-row"><div class="col gap-4 grow"><span class="t-body">Delete discovery candidates that were never published after</span><span class="t-small text-muted">Published topics and artifacts are never deleted.</span></div><label class="select select--square"><span class="sr-only">Retention period</span><select id="retention"><option>30 days</option><option selected>90 days</option><option>1 year</option></select><i data-lucide="chevron-down"></i></label></div></section></div>' +
      '<section class="card card--flush"><div class="card__header" style="padding:24px 24px 16px;flex-wrap:wrap"><div class="col gap-4 grow"><h2 class="card__title">Audit log</h2><p class="t-small text-muted">Every admin and system action from the last 90 days</p></div>' +
      '<label class="select select--square"><span class="sr-only">Actor</span><select id="a-who"><option>Everyone</option><option>Mehek Doshi</option><option>Ananya Iyer</option><option>System</option></select><i data-lucide="chevron-down"></i></label><button class="btn btn--secondary btn--sm" id="export"><i data-lucide="download"></i>Export CSV</button></div>' +
      '<div class="table-wrap" style="border-radius:0;border-left:0;border-right:0;border-bottom:0"><table class="table table--compact"><thead><tr><th>When</th><th>Who</th><th>Action</th></tr></thead><tbody id="audit"></tbody></table></div></section></div>';
    function renderInt() {
      $("#integrations").innerHTML = A.integrations.map(function (g, i) {
        var connected = g.status === "Connected";
        return '<div class="setting-row"><span class="icon-tile icon-tile--sm"><i data-lucide="' + g.icon + '"></i></span><div class="col gap-4 grow"><strong class="t-body-medium text-strong">' + g.name + '</strong><span class="t-small text-muted">' + g.desc + "</span></div>" + chip(g.status, tone(g.status)) +
          '<button class="btn btn--sm ' + (connected ? "btn--ghost" : "btn--outline") + '" data-int="' + i + '">' + (connected ? "Manage" : g.status === "Not connected" ? "Connect" : "Reconnect") + "</button></div>";
      }).join("");
      NL.icons();
    }
    function renderAudit() {
      var who = $("#a-who").value;
      $("#audit").innerHTML = A.audit.filter(function (a) { return who === "Everyone" || a.who === who; }).map(function (a) {
        return '<tr><td class="text-muted">' + a.at + '</td><td>' + esc(a.who) + '</td><td style="white-space:normal"><span class="text-strong">' + esc(a.action) + '</span><div class="t-small text-muted">' + esc(a.target) + "</div></td></tr>";
      }).join("");
    }
    $("#integrations").addEventListener("click", function (e) {
      var b = e.target.closest("[data-int]");
      if (!b) return;
      var g = A.integrations[+b.getAttribute("data-int")];
      if (g.status !== "Connected") { g.status = "Connected"; renderInt(); NL.toast(g.name + " connected", "plug-zap"); }
      else NL.toast("Opening " + g.name + " settings…", "settings");
    });
    $("#a-who").addEventListener("change", renderAudit);
    $("#retention").addEventListener("change", function () { NL.toast("Retention set to " + this.value); });
    $("#export").addEventListener("click", function () {
      var csv = "When,Who,Action,Target\n" + A.audit.map(function (a) { return [a.at, a.who, a.action, a.target].map(function (v) { return '"' + v.replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
      var url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      var link = document.createElement("a");
      link.href = url;
      link.download = "tech-radar-audit-log.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
    main.addEventListener("change", function (e) {
      if (e.target.closest(".switch")) NL.toast("Setting saved");
    });
    renderInt();
    renderAudit();
  }

  /* ---------- Sign in ---------- */
  function initSignin() {
    $("#ms-signin").addEventListener("click", function () {
      this.disabled = true;
      this.innerHTML = '<i data-lucide="loader-circle"></i>Signing in…';
      NL.icons();
      setTimeout(function () { location.href = "dashboard.html"; }, 700);
    });
  }

  var RENDER = {
    dashboard: pageDashboard,
    "new-use-case": pageNewUseCase,
    artifacts: pageArtifacts,
    "admin-overview": pageAdminOverview,
    "admin-discovery": pageAdminDiscovery,
    "admin-volunteers": pageAdminVolunteers,
    "admin-schedule": pageAdminSchedule,
    "admin-moderation": pageAdminModeration,
    "admin-users": pageAdminUsers,
    "admin-badges": pageAdminBadges,
    "admin-settings": pageAdminSettings
  };

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    if (page === "signin") { initSignin(); return; }
    renderShell(page);
    RENDER[page]($("#page"));
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-soon]")) { e.preventDefault(); NL.toast("Not part of this prototype yet", "info"); }
      var dl = e.target.closest("[data-download]");
      if (dl) NL.toast("Downloading “" + dl.getAttribute("data-download") + "” (PDF)", "download");
    });
    NL.icons();
  });
})();
