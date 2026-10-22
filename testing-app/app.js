/*
 * Testing App behaviour. Each page sets <body data-page="..."> and this file wires that page.
 * Candidate session state lives in sessionStorage so the flow works page to page.
 */
(function () {
  "use strict";

  var STATE_KEY = "ta-session";
  var TEST_SECONDS = 45 * 60;
  var MAX_FLAGS = 3;

  function load() {
    try {
      return JSON.parse(sessionStorage.getItem(STATE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
      /* private mode: the flow still works within a page */
    }
  }

  var state = load();
  if (!state.name) state.name = "Aarav Mehta";
  if (!state.candidateId) state.candidateId = "NL-APT-26-0148";

  function firstName() {
    return state.name.split(" ")[0];
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function fmtTime(seconds) {
    seconds = Math.max(0, Math.round(seconds));
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function clock(date) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function fillNames() {
    $all("[data-first-name]").forEach(function (el) { el.textContent = firstName(); });
    $all("[data-full-name]").forEach(function (el) { el.textContent = state.name; });
    $all("[data-candidate-id]").forEach(function (el) { el.textContent = state.candidateId; });
  }

  /* Camera helper: real camera when the browser allows it, placeholder otherwise. */
  function attachCamera(container) {
    if (!container || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.resolve(false);
    return navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function (stream) {
      var video = document.createElement("video");
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      container.insertBefore(video, container.firstChild);
      return true;
    }).catch(function () { return false; });
  }

  /* ---------------- 01 · Login ---------------- */
  function initLogin() {
    var form = $("#login-form");
    var pwd = $("#password");
    $("#toggle-password").addEventListener("click", function () {
      var show = pwd.type === "password";
      pwd.type = show ? "text" : "password";
      this.innerHTML = '<i data-lucide="' + (show ? "eye-off" : "eye") + '"></i>';
      this.setAttribute("aria-label", show ? "Hide password" : "Show password");
      NL.icons();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var ok = true;
      $all(".field", form).forEach(function (field) {
        var input = $("input", field);
        var hint = $(".field__hint", field);
        var valid = input.checkValidity() && input.value.trim() !== "";
        if (input.id === "dob") valid = /^\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}$/.test(input.value.trim());
        field.classList.toggle("is-error", !valid);
        if (hint) hint.hidden = valid;
        if (!valid) ok = false;
      });
      if (!ok) return;
      state = {
        name: $("#full-name").value.trim(),
        candidateId: $("#candidate-id").value.trim().toUpperCase(),
        email: $("#email").value.trim()
      };
      save(state);
      var btn = $("button[type=submit]", form);
      btn.disabled = true;
      btn.innerHTML = "Signing in…";
      setTimeout(function () { location.href = "permissions.html"; }, 600);
    });
  }

  /* ---------------- 02 · System permissions ---------------- */
  var PERM_STEPS = [
    {
      key: "screen",
      title: "Allow screen recording",
      body: "We record your screen for the length of the test so the hiring team can review your session. Choose “Entire screen” when your browser asks.",
      icon: "monitor",
      verifying: "Checking screen share…",
      request: function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return Promise.reject();
        return navigator.mediaDevices.getDisplayMedia({ video: true }).then(function (s) {
          s.getTracks().forEach(function (t) { t.stop(); });
        });
      }
    },
    {
      key: "camera",
      title: "Allow camera access",
      body: "Your camera stays on during the test. Make sure your face is well lit and fully inside the frame.",
      icon: "video",
      verifying: "Looking for your camera…",
      request: function (visual) {
        return attachCamera(visual).then(function (ok) { if (!ok) throw new Error("camera"); });
      }
    },
    {
      key: "mic",
      title: "Allow microphone access",
      body: "We listen for background voices. Sit somewhere quiet and keep your microphone unmuted.",
      icon: "mic",
      verifying: "Testing your microphone…",
      request: function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject();
        return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
          s.getTracks().forEach(function (t) { t.stop(); });
        });
      }
    }
  ];

  function initPermissions() {
    var current = 0;
    var flow = $("#perm-flow");

    function stepper() {
      var labels = ["Screen", "Camera", "Microphone"];
      return '<div class="stepper" aria-label="Progress">' + labels.map(function (label, i) {
        var cls = i < current ? "is-done" : i === current ? "is-active" : "";
        var dot = i < current ? '<i data-lucide="check"></i>' : i + 1;
        return (i ? '<span class="stepper__line"></span>' : "") +
          '<div class="stepper__item ' + cls + '"><span class="stepper__dot">' + dot + "</span>" + label + "</div>";
      }).join("") + "</div>";
    }

    function render(phase, error) {
      if (current >= PERM_STEPS.length) {
        flow.innerHTML = stepper() +
          '<div class="perm-visual is-done"><div class="perm-visual__icon"><i data-lucide="shield-check"></i></div></div>' +
          '<div class="col gap-12"><h2 class="t-page-title">You’re all set</h2>' +
          '<p class="t-body-lg text-muted">Screen recording, camera and microphone are ready. Next, we’ll verify your identity.</p></div>' +
          '<ul class="checklist"><li><i data-lucide="check-circle-2"></i>Screen recording enabled</li><li><i data-lucide="check-circle-2"></i>Camera connected</li><li><i data-lucide="check-circle-2"></i>Microphone connected</li></ul>' +
          '<a class="btn btn--primary btn--xl" href="verify.html" style="margin-top:auto">Continue to identity check <i data-lucide="arrow-right"></i></a>';
        NL.icons();
        return;
      }
      var step = PERM_STEPS[current];
      var verifying = phase === "verifying";
      flow.innerHTML = stepper() +
        '<div class="perm-visual ' + (verifying ? "is-verifying" : "") + '" id="perm-visual"><div class="perm-visual__icon"><i data-lucide="' + step.icon + '"></i></div></div>' +
        '<div class="col gap-12"><p class="t-overline">Step ' + (current + 1) + " of 3</p>" +
        '<h2 class="t-page-title">' + step.title + "</h2>" +
        '<p class="t-body-lg text-muted">' + step.body + "</p></div>" +
        (error ? '<div class="callout callout--error"><i data-lucide="alert-triangle"></i><div>Your browser blocked this request. Allow access in the address bar and try again, or continue in demo mode.</div></div>' : "") +
        '<div class="row gap-16 wrap" style="margin-top:auto">' +
        (verifying
          ? '<button class="btn btn--primary btn--xl" disabled><span class="meter" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></span>' + step.verifying + "</button>"
          : '<button class="btn btn--primary btn--xl" data-action="allow">Allow access</button>' +
            (error ? '<button class="btn btn--secondary btn--xl" data-action="skip">Continue in demo mode</button>' : "")) +
        "</div>";
      NL.icons();
    }

    flow.addEventListener("click", function (event) {
      var action = event.target.closest("[data-action]");
      if (!action) return;
      if (action.getAttribute("data-action") === "skip") {
        current += 1;
        render();
        return;
      }
      var step = PERM_STEPS[current];
      render("verifying");
      var started = Date.now();
      Promise.resolve()
        .then(function () { return step.request($("#perm-visual")); })
        .then(function () {
          setTimeout(function () {
            current += 1;
            render();
          }, Math.max(0, 1200 - (Date.now() - started)));
        })
        .catch(function () { render(null, true); });
    });

    render();
  }

  /* ---------------- 03 · Identity verification ---------------- */
  function initVerify() {
    var steps = [
      { key: "id", title: "Capture your ID", body: "Hold a government-issued photo ID (Aadhaar, PAN, passport or driving licence) inside the frame.", frame: "id", cta: "Capture ID" },
      { key: "face", title: "Capture your face", body: "Look straight at the camera, remove glasses or caps and keep your face inside the oval.", frame: "face", cta: "Capture photo" }
    ];
    var current = 0;
    var verified = false;
    var capture = $("#capture");
    attachCamera(capture);

    function render() {
      var step = steps[current];
      var frame = $(".capture__frame", capture);
      frame.className = "capture__frame capture__frame--" + step.frame;
      capture.classList.toggle("is-ok", verified);
      $("#capture-badge").innerHTML = verified
        ? '<span class="chip chip--success chip--lg"><i data-lucide="check"></i>' + (step.key === "id" ? "ID verified" : "Face matched") + "</span>"
        : '<span class="live-chip">LIVE</span>';
      $("#capture-label").innerHTML = verified ? "" : '<span class="chip chip--outline chip--lg">' + (step.key === "id" ? "Align your ID within the frame" : "Center your face in the oval") + "</span>";
      $("#v-title").textContent = verified ? (step.key === "id" ? "ID verified" : "Identity confirmed") : step.title;
      $("#v-body").textContent = verified
        ? (step.key === "id" ? "We could read your ID clearly. Next, take a quick photo so we can match it." : "Your face matches the photo on your ID. You’re ready to read the test instructions.")
        : step.body;
      $all(".vstep").forEach(function (el, i) {
        el.classList.toggle("is-active", i === current);
        el.classList.toggle("is-done", i < current || (i === current && verified));
        $(".icon-tile", el).innerHTML = '<i data-lucide="' + ((i < current || (i === current && verified)) ? "check" : i === 0 ? "id-card" : "scan-face") + '"></i>';
      });
      var btn = $("#v-action");
      btn.disabled = false;
      if (!verified) btn.innerHTML = '<i data-lucide="camera"></i>' + step.cta;
      else if (current === 0) btn.innerHTML = "Continue to face capture <i data-lucide=\"arrow-right\"></i>";
      else btn.innerHTML = "Continue <i data-lucide=\"arrow-right\"></i>";
      $("#v-retake").hidden = !verified;
      NL.icons();
    }

    $("#v-action").addEventListener("click", function () {
      var btn = this;
      if (verified) {
        if (current === steps.length - 1) {
          location.href = "intro.html";
          return;
        }
        current += 1;
        verified = false;
        render();
        return;
      }
      btn.disabled = true;
      btn.innerHTML = "Verifying…";
      capture.classList.add("is-checking");
      setTimeout(function () {
        verified = true;
        render();
      }, 1400);
    });

    $("#v-retake").addEventListener("click", function () {
      verified = false;
      render();
    });

    render();
  }

  /* ---------------- 04 · Test introduction ---------------- */
  function initIntro() {
    var consent = $("#consent");
    var begin = $("#begin");
    consent.addEventListener("change", function () { begin.disabled = !consent.checked; });
    begin.addEventListener("click", function () {
      state.startedAt = Date.now();
      state.answers = {};
      state.submitted = {};
      state.flags = [];
      save(state);
      location.href = "test.html";
    });
  }

  /* ---------------- 05–09 · Test ---------------- */
  function initTest() {
    var sections = window.TA_SECTIONS;
    if (!state.startedAt) {
      state.startedAt = Date.now();
      state.answers = {};
      state.submitted = {};
      state.flags = [];
      save(state);
    }
    state.answers = state.answers || {};
    state.submitted = state.submitted || {};
    state.flags = state.flags || [];

    var flat = [];
    sections.forEach(function (sec, s) {
      sec.questions.forEach(function (q, i) {
        flat.push({ sec: s, idx: i, num: flat.length + 1, q: q });
      });
    });

    function sectionDone(s) {
      return sections[s].questions.every(function (_, i) { return state.submitted[s * 10 + i + 1]; });
    }

    function activeSection() {
      for (var s = 0; s < sections.length; s++) if (!sectionDone(s)) return s;
      return sections.length - 1;
    }

    function firstOpen(s) {
      for (var i = 0; i < 10; i++) if (!state.submitted[s * 10 + i + 1]) return s * 10 + i + 1;
      return s * 10 + 1;
    }

    var current = state.current || firstOpen(activeSection());
    if (flat[current - 1].sec !== activeSection()) current = firstOpen(activeSection());

    function answeredCount() {
      return Object.keys(state.submitted).length;
    }

    /* Palette */
    function renderPalette() {
      var active = activeSection();
      $("#palette").innerHTML = sections.map(function (sec, s) {
        var locked = s > active;
        var done = sec.questions.filter(function (_, i) { return state.submitted[s * 10 + i + 1]; }).length;
        return '<div class="palette-section ' + (locked ? "is-locked" : "") + '">' +
          '<div class="row"><span class="palette-section__title t-body-medium grow">' + sec.id + " · " + sec.name + "</span>" +
          (locked ? '<i data-lucide="lock" style="width:18px;height:18px;color:var(--text-disabled)"></i>' : '<span class="chip ' + (done === 10 ? "chip--success" : "chip--info") + '">' + done + "/10</span>") +
          "</div>" +
          '<div class="palette">' + sec.questions.map(function (_, i) {
            var n = s * 10 + i + 1;
            var cls = locked || (s < active) ? "is-locked" : n === current ? "is-current" : state.submitted[n] ? "is-answered" : "";
            if (s < active) cls = "is-answered";
            return '<button class="qbtn ' + cls + '" data-q="' + n + '"' + (locked ? " disabled" : "") + ' aria-label="Question ' + n + '">' + n + "</button>";
          }).join("") + "</div></div>";
      }).join('<hr class="divider">');
      NL.icons();
    }

    $("#palette").addEventListener("click", function (event) {
      var b = event.target.closest("[data-q]");
      if (!b || b.disabled) return;
      var n = +b.getAttribute("data-q");
      if (flat[n - 1].sec !== activeSection()) return;
      go(n);
    });

    /* Question rendering */
    function pie(slices) {
      var total = slices.reduce(function (a, s) { return a + s.value; }, 0);
      var r = 15.9155;
      var offset = 25;
      return '<svg viewBox="0 0 42 42" role="img" aria-label="Pie chart">' + slices.map(function (s) {
        var pct = (s.value / total) * 100;
        var seg = '<circle cx="21" cy="21" r="' + r + '" fill="transparent" stroke="' + s.color + '" stroke-width="10" stroke-dasharray="' + pct + " " + (100 - pct) + '" stroke-dashoffset="' + offset + '"></circle>';
        offset -= pct;
        return seg;
      }).join("") + "</svg>";
    }

    function highlight(line) {
      return NL.escape(line)
        .replace(/(&quot;.*?&quot;)/g, '<span class="tok-s">$1</span>')
        .replace(/\b(int|return|using|namespace)\b/g, '<span class="tok-k">$1</span>')
        .replace(/(#include|cout|main)/g, '<span class="tok-t">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="tok-n">$1</span>');
    }

    function optionsHtml(n, q) {
      var chosen = state.answers[n];
      var locked = !!state.submitted[n];
      return '<div class="options ' + (locked ? "is-locked" : "") + '" role="radiogroup" aria-label="Answer options">' + q.options.map(function (opt, i) {
        var letter = "ABCD".charAt(i);
        return '<label class="option ' + (chosen === i ? "is-selected" : "") + '">' +
          '<input type="radio" name="answer" value="' + i + '"' + (chosen === i ? " checked" : "") + (locked ? " disabled" : "") + ">" +
          '<span class="option__radio"></span><span class="option__letter">' + letter + '</span><span class="option__label">' + NL.escape(opt) + "</span></label>";
      }).join("") + "</div>";
    }

    function renderQuestion() {
      var item = flat[current - 1];
      var sec = sections[item.sec];
      var q = item.q;
      var locked = !!state.submitted[current];
      $("#q-section").textContent = "Section " + sec.id + " · " + sec.name;
      $("#q-number").textContent = "Question " + (item.idx + 1) + " of 10";
      $("#q-type").textContent = q.type === "code" ? "Code output" : q.type === "chart" ? "Data interpretation" : "Single choice";

      var clear = '<button class="btn btn--ghost btn--sm" data-clear' + (locked ? " disabled" : "") + '><i data-lucide="x"></i>Clear selection</button>';
      var body;
      if (q.type === "chart") {
        body = '<div class="qcard__body is-split"><div class="col gap-24">' +
          '<p class="t-body-lg">' + NL.escape(q.lead) + "</p>" +
          '<div class="chart-card"><p class="t-body-medium text-strong">' + NL.escape(q.chart.title) + '</p><div class="chart">' + pie(q.chart.slices) +
          '<div class="chart-legend">' + q.chart.slices.map(function (s) {
            return '<i style="background:' + s.color + '"></i><span>' + s.label + '</span><span class="t-body-medium text-strong">' + s.value + "%</span>";
          }).join("") + "</div></div></div>" +
          '<p class="qcard__text">' + NL.escape(q.text) + "</p></div>" +
          '<div class="col gap-16"><div class="row"><span class="t-subhead grow">Select an option</span>' + clear + "</div>" + optionsHtml(current, q) + "</div></div>";
      } else if (q.type === "code") {
        body = '<div class="qcard__body is-split"><div class="col gap-24">' +
          '<p class="qcard__text">' + NL.escape(q.text) + "</p>" +
          '<div class="code"><span class="chip code__lang">' + q.language + '</span><div class="code__gutter">' + q.code.map(function (_, i) { return i + 1; }).join("<br>") + "</div><pre>" + q.code.map(highlight).join("\n") + "</pre></div>" +
          '<div class="row text-muted"><i data-lucide="info" style="width:16px;height:16px"></i><span class="t-small">' + NL.escape(q.hint) + "</span></div></div>" +
          '<div class="col gap-16"><div class="row"><span class="t-subhead grow">Select an option</span>' + clear + "</div>" + optionsHtml(current, q) + "</div></div>";
      } else {
        body = '<div class="qcard__body"><p class="qcard__text">' + NL.escape(q.text) + "</p>" +
          '<p class="t-body-medium text-muted">Choose one answer</p>' + optionsHtml(current, q) + "<div>" + clear + "</div></div>";
      }
      $("#q-body").innerHTML = body;

      var first = item.idx === 0;
      var last = item.idx === 9;
      $("#prev").disabled = first;
      $("#next").disabled = last;
      $("#submit").disabled = locked || state.answers[current] == null;
      $("#submit").innerHTML = locked ? 'Submitted <i data-lucide="lock"></i>' : 'Submit <i data-lucide="check"></i>';
      NL.icons();
    }

    $("#q-body").addEventListener("change", function (event) {
      if (event.target.name !== "answer") return;
      state.answers[current] = +event.target.value;
      save(state);
      $all(".option", this).forEach(function (o) { o.classList.toggle("is-selected", $("input", o).checked); });
      $("#submit").disabled = false;
    });

    $("#q-body").addEventListener("click", function (event) {
      if (!event.target.closest("[data-clear]")) return;
      delete state.answers[current];
      save(state);
      renderQuestion();
    });

    function go(n) {
      current = n;
      state.current = n;
      save(state);
      renderPalette();
      renderQuestion();
      $(".qcard").scrollTop = 0;
    }

    $("#prev").addEventListener("click", function () { go(current - 1); });
    $("#next").addEventListener("click", function () { go(current + 1); });
    $("#submit").addEventListener("click", function () {
      if (state.answers[current] == null) return;
      state.submitted[current] = true;
      save(state);
      var s = flat[current - 1].sec;
      if (sectionDone(s)) {
        if (s === sections.length - 1) {
          renderPalette();
          renderQuestion();
          openFinish();
          return;
        }
        NL.toast("Section " + (s + 1) + " complete — " + sections[s + 1].name + " is now unlocked", "unlock");
        go(firstOpen(s + 1));
        return;
      }
      var next = firstOpen(s);
      go(next);
    });

    /* Timer */
    var timerEl = $("#timer-value");
    var bar = $("#timer-bar");
    function tick() {
      var left = TEST_SECONDS - (Date.now() - state.startedAt) / 1000;
      timerEl.textContent = fmtTime(left);
      bar.style.width = Math.max(0, (left / TEST_SECONDS) * 100) + "%";
      $(".timer").classList.toggle("is-low", left < 300);
      $("#drawer-time").textContent = fmtTime(left);
      if (left <= 0) finish();
    }
    tick();
    setInterval(tick, 1000);

    /* Finish drawer (06) */
    function openFinish() {
      var total = flat.length;
      var done = answeredCount();
      var pct = (done / total) * 100;
      $("#sum-answered").textContent = done + "/" + total;
      $("#sum-review").textContent = "0/" + total;
      $("#sum-open").textContent = (total - done) + "/" + total;
      $("#donut-label").textContent = done + "/" + total;
      $("#donut-arc").setAttribute("stroke-dasharray", pct + " " + (100 - pct));
      $("#donut-arc").setAttribute("stroke-linecap", done ? "round" : "butt");
      var active = activeSection();
      $("#sum-sections").innerHTML = sections.map(function (sec, s) {
        var n = sec.questions.filter(function (_, i) { return state.submitted[s * 10 + i + 1]; }).length;
        var status = s < active || sectionDone(s) ? "Completed" : s === active ? "Active · " + sec.minutes + " min" : s === active + 1 ? "Locked · unlocks next" : "Locked";
        return "<tr><td>" + (s + 1) + '.</td><td><div class="text-strong t-body-medium">' + sec.name + '</div><div class="t-small text-muted">' + status + "</div></td>" +
          '<td style="width:300px"><div class="progress"><span style="width:' + n * 10 + '%"></span></div><div class="t-small text-muted" style="margin-top:6px">' + n + " of 10 answered</div></td></tr>";
      }).join("");
      NL.open("finish-drawer");
    }
    $("#open-finish").addEventListener("click", openFinish);

    function finish(reason) {
      state.finishedAt = Date.now();
      state.result = reason || "submitted";
      save(state);
      location.href = reason === "disqualified" ? "disqualified.html" : "submitted.html";
    }
    $("#finish-test").addEventListener("click", function () { finish(); });

    /* Proctoring (09) */
    var popup = $("#motion-popup");
    function flag(kind, message) {
      state.flags.push({ at: Date.now(), kind: kind, message: message });
      save(state);
      var count = state.flags.length;
      if (count >= MAX_FLAGS) {
        finish("disqualified");
        return;
      }
      $("#motion-title").textContent = kind === "tab" ? "Tab switch detected" : "Motion detected";
      $("#motion-tag").textContent = "Warning " + count + " of " + MAX_FLAGS;
      $("#motion-text").textContent = message;
      $("#proctor").classList.add("is-flagged");
      $("#proctor-text").textContent = "Flagged · " + (kind === "tab" ? "Tab switch" : "Motion");
      $("#webcam-flag").hidden = false;
      $("#webcam-flag-text").textContent = kind === "tab" ? "Tab" : "Motion";
      popup.classList.add("is-open");
    }
    $("#motion-ok").addEventListener("click", function () {
      popup.classList.remove("is-open");
      $("#proctor").classList.remove("is-flagged");
      $("#proctor-text").textContent = "Proctoring active";
      $("#webcam-flag").hidden = true;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) flag("tab", "You left the test window. Stay on this tab until you finish — switching tabs, windows or apps counts as a violation.");
    });

    // Demo of the AI motion check: one simulated motion flag 45 seconds in (or immediately with ?demo=motion).
    var demo = /demo=motion/.test(location.search);
    if (!state.motionDemoShown) {
      setTimeout(function () {
        state.motionDemoShown = true;
        flag("motion", "Our AI proctor noticed you moving away from the screen. Stay seated with your face in frame — further movement may lead to disqualification.");
      }, demo ? 600 : 45000);
    }

    attachCamera($("#webcam")).then(function (ok) {
      $("#webcam-placeholder").hidden = ok;
    });

    renderPalette();
    renderQuestion();
  }

  /* ---------------- 10 · Submitted / 11 · Disqualified ---------------- */
  function initResult() {
    var finished = state.finishedAt ? new Date(state.finishedAt) : new Date();
    var started = state.startedAt || finished.getTime() - 41 * 60 * 1000 - 18000;
    var answered = state.submitted ? Object.keys(state.submitted).length : 28;
    var session = "TS-APT-" + state.candidateId.replace(/\D/g, "").slice(-4).padStart(4, "0") + "-2611";
    $all("[data-attempted]").forEach(function (el) { el.textContent = answered + " / 30"; });
    $all("[data-time-taken]").forEach(function (el) { el.textContent = fmtTime((finished.getTime() - started) / 1000); });
    $all("[data-finished-at]").forEach(function (el) { el.textContent = clock(finished); });
    $all("[data-session-id]").forEach(function (el) { el.textContent = session; });
    var log = $("#flag-log");
    if (log && state.flags && state.flags.length) {
      log.innerHTML = state.flags.map(function (f, i) {
        var last = i === state.flags.length - 1;
        return (i ? '<hr class="divider">' : "") + '<div class="flag-log__row"><span class="t-small text-muted">' + clock(new Date(f.at)) + "</span>" +
          '<span class="t-body">' + (f.kind === "tab" ? "Tab switch — left the test window" : "Motion detected — moved away from the screen") + "</span>" +
          '<span class="chip ' + (last ? "chip--error" : "chip--warning") + '">' + (last ? "Final" : "Warning " + (i + 1)) + "</span></div>";
      }).join("");
    }
    $all("[data-exit]").forEach(function (b) {
      b.addEventListener("click", function () {
        try { sessionStorage.removeItem(STATE_KEY); } catch (e) { /* ignore */ }
        location.href = "index.html";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillNames();
    var page = document.body.getAttribute("data-page");
    ({
      login: initLogin,
      permissions: initPermissions,
      verify: initVerify,
      intro: initIntro,
      test: initTest,
      result: initResult
    }[page] || function () {})();
  });
})();
