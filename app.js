/* ============================================================
   AI Productivity Tools — Research & Competitive Landscape Demo
   Data + rendering. All dashboard figures are computed from
   CLEAN_DATA below, which mirrors cleaned_research_data.csv 1:1.
   ============================================================ */

"use strict";

/* ---------------- dataset (mirrors data/cleaned_research_data.csv) ---------------- */

const CLEAN_DATA = [
  { name: "TaskPilot Pro", site: "taskpilotpro.example", cat: "Project & Task Management", use: "Team to-do lists with AI-planned daily schedules", target: "Small Teams / SMB", free: "Yes", price: 9.99, billing: "Monthly (annual discount unconfirmed)", ai: "Yes - daily plan generator and smart prioritization", collab: "Yes - shared projects and comments", mobile: "Yes", platforms: "Web / iOS / Android / Windows / macOS", integr: "40+ (Slack, Google, Zapier)", diff: "AI daily plan generator", notes: "Duplicate directory listing (R21) merged during cleaning; price matched in both records", conf: "High", src: "Cross-checked (2 sources)", checked: "2026-08-15" },
  { name: "NoteNest", site: "notenest.example", cat: "Knowledge & Documents", use: "Personal notes and knowledge base with AI search", target: "Individuals & Freelancers", free: "Yes", price: 4.99, billing: "Per user / month", ai: "Yes - semantic search and auto-summaries", collab: "Yes - shared notebooks", mobile: "Yes", platforms: "iOS / Android (others not listed)", integr: "Google Drive and Notion-style embeds (count not stated)", diff: "Offline-first notes with AI backlinks", notes: "Duplicate review-site record (R22) merged during cleaning", conf: "High", src: "Cross-checked (2 sources)", checked: "2026-08-04" },
  { name: "FlowDesk", site: "flowdesk.example", cat: "All-in-One Workspaces", use: "Docs tasks and databases combined in one workspace", target: "Small Teams / SMB", free: "Yes (limited)", price: 12.0, billing: "Per user / month (billed annually)", ai: "Yes - workspace-wide AI assistant", collab: "Yes - real-time collaboration", mobile: "Yes", platforms: "Web / iOS / Android", integr: "30+ (names not listed)", diff: "Docs + tasks + databases in one hub", notes: "Source note: 'annual price confirmed on pricing page' - price shown is the annual-billing rate; source target: 'small-to-mid teams'", conf: "High", src: "Single source", checked: "2026-07-28" },
  { name: "MindMesh", site: "mindmesh.example", cat: "Knowledge & Documents", use: "Visual brainstorming and whiteboarding", target: "Individuals & Freelancers", free: "Trial only (14 days)", price: 8.0, billing: "Per seat / month", ai: "Yes - AI idea clustering (beta)", collab: "Yes - live boards", mobile: "Yes", platforms: "Web / iOS / Windows / macOS", integr: "Unknown (source: unsure)", diff: "AI-assisted idea clustering", notes: "Pricing from a single review-site source only; integrations unknown (source: unsure); source target: 'designers & consultants'", conf: "Medium", src: "Single source", checked: "2026-09-15" },
  { name: "Scheduly", site: "scheduly.example", cat: "Communication & Meetings", use: "Appointment scheduling with smart time suggestions", target: "Individuals & Freelancers", free: "Yes", price: 6.5, billing: "Per user / month", ai: "Yes - smart meeting-time suggestions", collab: "Yes - team availability pools", mobile: "Yes", platforms: "iOS / Android (web not stated)", integr: "Google Calendar, Outlook, Zoom (count not stated)", diff: "Availability pooling for small teams", notes: "Platforms per source: iOS and Android (web not stated)", conf: "High", src: "Single source", checked: "2026-06-30" },
  { name: "DocuFlow", site: "docuflow.example", cat: "Knowledge & Documents", use: "Collaborative documents with AI drafting support", target: "Mixed (Individuals to Enterprise)", free: "Yes", price: 7.0, billing: "Per user / month", ai: "Yes - draft generation and grammar", collab: "Yes - real-time co-editing and comments", mobile: "Yes", platforms: "Web / iOS / Android / Windows / macOS", integr: "35+ (Google Workspace, Slack)", diff: "AI drafting inside collaborative docs", notes: "Source reports a broad target range (Individuals to Enterprise)", conf: "High", src: "Single source", checked: "2026-07-22" },
  { name: "TeamSync", site: "teamsync.example", cat: "Communication & Meetings", use: "Team chat with AI thread summaries", target: "Small Teams / SMB", free: "Trial only (14 days)", price: 7.25, billing: "Per user / month", ai: "Yes - AI thread summaries", collab: "Yes - core chat product", mobile: "Yes", platforms: "Web / iOS / Android / Windows / macOS", integr: "50+ (names not listed)", diff: "AI summaries across chat threads", notes: "", conf: "High", src: "Single source", checked: "2026-05-19" },
  { name: "FocusForge", site: "focusforge.example", cat: "Time & Focus", use: "Focus timer with personal productivity analytics", target: "Individuals & Freelancers", free: "Yes (basic timer)", price: 5.0, billing: "Monthly (per-user basis not stated)", ai: "Yes - focus-pattern insights", collab: "Limited - shared reports only", mobile: "Yes", platforms: "Web / iOS / Android / macOS", integr: "Trello, Slack (count not stated)", diff: "Personal analytics from focus sessions", notes: "Price format unclear on source; monthly assumed; per-user basis not stated; directory-listing source", conf: "Medium", src: "Single source", checked: "2026-08-02" },
  { name: "InBoxZero", site: "inboxzero.example", cat: "Email & Automation", use: "AI email triage and shared-inbox management", target: "Small Teams / SMB", free: "No (14-day trial)", price: 10.0, billing: "Per user / month (annual discount available)", ai: "Yes - smart triage and reply drafts", collab: "Yes - shared inboxes", mobile: "Yes", platforms: "Web / iOS / Android", integr: "20 (Gmail, Outlook, Slack)", diff: "Shared-inbox AI triage", notes: "", conf: "High", src: "Single source", checked: "2026-09-01" },
  { name: "MeetMate", site: "meetmate.example", cat: "Communication & Meetings", use: "Meeting transcription with AI action items", target: "Mixed (Individuals to Enterprise)", free: "Yes (5 meetings/mo)", price: 15.0, billing: "Per user / month", ai: "Yes - transcription and action items", collab: "Yes - shared meeting notes", mobile: "Yes", platforms: "Web / iOS / Android / macOS", integr: "Zoom, Google Meet, Slack (count not stated)", diff: "Action items extracted from calls", notes: "", conf: "High", src: "Single source", checked: "2026-08-21" },
  { name: "PlanCraft", site: "plancraft.example", cat: "Project & Task Management", use: "Project planning with AI timeline forecasts", target: "Mid-Market", free: "No (demo on request)", price: 11.5, billing: "Per user / month", ai: "Yes - risk flags and timeline forecasts", collab: "Yes (details not stated)", mobile: "Yes", platforms: "Web / iOS / Android / Windows", integr: "45 (Jira import, Slack)", diff: "AI timeline risk forecasting", notes: "Source free-plan field says 'trial'; source notes: no free tier, demo on request", conf: "High", src: "Single source", checked: "2026-07-11" },
  { name: "WriteWise", site: "writewise.example", cat: "Writing & Content AI", use: "Long-form drafting with tone and rewrite tools", target: "Individuals & Freelancers", free: "Trial only", price: 12.99, billing: "Per user / month", ai: "Yes - core product (drafting and tone)", collab: "Limited - comments only", mobile: "Yes", platforms: "Web / iOS", integr: "Google Docs, WordPress (count not stated)", diff: "Tone control for long-form writing", notes: "", conf: "High", src: "Single source", checked: "2026-09-15" },
  { name: "ChronoBase", site: "chronobase.example", cat: "Time & Focus", use: "Time tracking with client invoicing", target: "Individuals & Freelancers", free: "Trial only", price: 9.0, billing: "Per user / month (annual billing only)", ai: "No (AI reporting on roadmap)", collab: "Limited (details not stated)", mobile: "Yes", platforms: "Web / iOS / Android / Windows / macOS", integr: "QuickBooks, FreshBooks (count not stated)", diff: "Time tracking tied to invoicing", notes: "Price derived: $108/user/year divided by 12; single source", conf: "Medium", src: "Single source", checked: "2026-06-05" },
  { name: "Kanbanly", site: "kanbanly.example", cat: "Project & Task Management", use: "Simple kanban boards for small teams", target: "Small Teams / SMB", free: "Yes", price: 5.5, billing: "Per user / month", ai: "No", collab: "Yes (details not stated)", mobile: "Yes", platforms: "Web / iOS / Android", integr: "Slack, Google Drive (count not stated)", diff: "Lowest-priced kanban board in the sample (derived from dataset)", notes: "Directory-listing source (secondhand)", conf: "Medium", src: "Single source", checked: "2026-08-30" },
  { name: "SummarEase", site: "summarease.example", cat: "Writing & Content AI", use: "Summarize documents links and transcripts", target: "Individuals & Freelancers", free: "Yes (daily cap)", price: 6.99, billing: "Flat monthly (not per user)", ai: "Yes - core product (summarization)", collab: "Limited (details not stated)", mobile: "No", platforms: "Web", integr: "Chrome extension, Zapier (count not stated)", diff: "Flat pricing regardless of seats", notes: "Web-only; no mobile app as of last check", conf: "High", src: "Single source", checked: "2026-09-09" },
  { name: "WorkWhale", site: "workwhale.example", cat: "All-in-One Workspaces", use: "Workspace combining docs tasks and chat", target: "Mid-Market", free: "Yes", price: 14.0, billing: "Per user / month (conflicting reports)", ai: "Yes - AI assistant (details unclear)", collab: "Yes (details not stated)", mobile: "Yes", platforms: "Web / iOS / Android", integr: "22 (names not listed)", diff: "Bundled docs tasks and chat in one workspace", notes: "CONFLICT: $14/user/mo (official pricing page) vs $12 (directory listing) - unresolved", conf: "Needs verification", src: "Single source - conflicting details", checked: "2026-09-20" },
  { name: "GoalGrid", site: "goalgrid.example", cat: "Client & Goal Management", use: "OKR tracking with AI goal-health signals", target: "Mid-Market", free: "Trial only (21 days)", price: 13.0, billing: "Per user / month", ai: "Yes - goal-health predictions", collab: "Yes (details not stated)", mobile: "Unclear", platforms: "Web (others unconfirmed)", integr: "Slack, Jira (count not stated)", diff: "Predictive goal-health scoring", notes: "Mobile uncertain in source ('yes?'); platforms: web confirmed only", conf: "Needs verification", src: "Single source", checked: "2026-07-19" },
  { name: "AutoMateHQ", site: "automatehq.example", cat: "Email & Automation", use: "No-code workflow automation with natural-language builder", target: "Small Teams / SMB", free: "Yes (limited runs)", price: 19.99, billing: "Per user / month", ai: "Yes - natural-language automation builder", collab: "Limited - shared workflows", mobile: "No", platforms: "Web", integr: "90+ (Slack, Gmail, Notion, HubSpot)", diff: "Largest integration catalog in the sample (derived from dataset)", notes: "", conf: "High", src: "Single source", checked: "2026-08-27" },
  { name: "ClientDesk", site: "clientdesk.example", cat: "Client & Goal Management", use: "Client pipeline and updates for solo consultants", target: "Individuals & Freelancers", free: "Yes", price: 16.0, billing: "Per user / month", ai: "Yes - client update drafts", collab: "Limited - team seats", mobile: "Yes", platforms: "Web / iOS / Android", integr: "Gmail, Stripe (count not stated)", diff: "Freelancer CRM with AI status updates", notes: "", conf: "High", src: "Single source", checked: "2026-09-25" },
  { name: "SprintBoard", site: "sprintboard.example", cat: "Project & Task Management", use: "Agile sprints and retrospectives for dev teams", target: "Mid-Market", free: "Yes (1 project)", price: 8.5, billing: "Per user / month", ai: "No", collab: "Yes - sprints retros and burndown charts", mobile: "Yes", platforms: "Web / iOS / Android / Windows", integr: "GitHub, GitLab, Slack (count not stated)", diff: "Built-in retros and burndown charts", notes: "", conf: "High", src: "Single source", checked: "2026-08-16" },
];

/* ---------------- raw sample (subset of raw_research_data.csv, as captured) ---------------- */

const RAW_SAMPLE = [
  { id: "R01", name: "TASKPILOT PRO", cat: "task manager", pricing: "$9.99 monthly / maybe annual discount", free: "Y", mobile: "yes / ios android probably", checked: "2026-08-14", note: "pricing page and review site agree" },
  { id: "R04", name: "MindMesh AI", cat: "whiteboard / mindmapping", pricing: "$8 per seat monthly", free: "N - 14 day trial", mobile: "iOS app - android ?", checked: "15 Sept 2026", note: "single source for price" },
  { id: "R08", name: "focusforge", cat: "time tracking / focus", pricing: "5 USD/mo", free: "basic free timer", mobile: "yes", checked: "2026-08-02", note: "price format unclear - monthly assumed" },
  { id: "R09", name: "INBOXZERO", cat: "Email", pricing: "$10 per user / month annual available", free: "No - 14 day trial only", mobile: "yes", checked: "2026-09-01", note: "" },
  { id: "R13", name: "ChronoBase", cat: "time tracking & invoicing", pricing: "$108 per user billed yearly", free: "no - trial", mobile: "yes", checked: "2026-06-05", note: "convert yearly price to monthly for comparison" },
  { id: "R16", name: "WorkWhale", cat: "all-in-one workspace", pricing: "$14/user/mo on pricing page - $12 listed on directory", free: "yes", mobile: "yes", checked: "2026-09-20", note: "CONFLICT - needs verification" },
  { id: "R17", name: "GoalGrid OKR", cat: "OKR software", pricing: "$13/user/mo", free: "21-day trial", mobile: "yes? platform list unclear", checked: "2026-07-19", note: "platforms unclear" },
  { id: "R21", name: "taskpilot", cat: "To-Do & Task Management", pricing: "9.99 USD monthly", free: "free", mobile: "ios android", checked: "2026-08-15", note: "possible duplicate of R01 - confirm" }
];

/* ---------------- before / after cleaning examples ---------------- */

const BA_EXAMPLES = [
  { title: "Pricing format", raw: 'R01 · TASKPILOT PRO — "$9.99 monthly / maybe annual discount"',
    clean: [["Starting Price", "$9.99 / month"], ["Billing Model", "Monthly — annual discount unconfirmed"], ["Second record (R21)", "Price matched: 9.99 USD monthly"]],
    rule: "Amount and billing cycle split into structured fields; the second record independently matched the price, while the unconfirmed discount stayed flagged.",
    conf: "Medium → High", confClass: "badge-med" },
  { title: "Mobile & platforms", raw: 'R01 — mobile: "yes / ios android probably"',
    clean: [["Mobile App", "Yes"], ["Platforms", "iOS, Android (both records); Web, Windows, macOS (listed once)"]],
    rule: "Vague wording was cross-checked: only iOS and Android are confirmed by both records; the remaining platforms stay single-source listings.",
    conf: "Medium → High", confClass: "badge-med" },
  { title: "Annual price conversion", raw: 'R13 · ChronoBase — "$108 per user billed yearly"',
    clean: [["Starting Price", "$9.00 / user / month"], ["Billing Model", "Per user / month (annual billing only)"]],
    rule: "Yearly price ÷ 12 for comparability; annual-only billing recorded; single source keeps confidence at Medium.",
    conf: "Medium", confClass: "badge-med" },
  { title: "Free plan vs free trial", raw: 'R09 · INBOXZERO — free plan: "No - 14 day trial only"',
    clean: [["Free Plan", "No (14-day trial)"]],
    rule: "A free plan and a free trial are different things — normalized to one consistent value set (Yes / Trial only / No).",
    conf: "High", confClass: "badge-high" },
  { title: "Conflicting sources", raw: 'R16 · WorkWhale — "$14/user/mo on pricing page - $12 listed on directory"',
    clean: [["Starting Price", "$14.00 (official pricing page figure)"], ["Directory figure", "Conflicting — unresolved"], ["Data Confidence", "Needs verification"]],
    rule: "The official pricing page outranks directory listings; conflicts are flagged for the client — never silently resolved.",
    conf: "Needs verification", confClass: "badge-low" },
  { title: "Date formats", raw: 'R04 "15 Sept 2026" · R06 "07/22/2026" · R03 "2026/07/28"',
    clean: [["Last checked (ISO 8601)", "2026-09-15 · 2026-07-22 · 2026-07-28"]],
    rule: "Every date converted to a single ISO format so records sort and age consistently.",
    conf: "High", confClass: "badge-high" },
  { title: "Integration counts", raw: 'R05 · Scheduly — integrations: "Google Calendar Outlook Zoom"',
    clean: [["Integrations", "Google Calendar, Outlook, Zoom (count not stated)"]],
    rule: "Named tools are preserved exactly; totals are never invented — rows whose source gives no count say so.",
    conf: "High", confClass: "badge-high" }
];

/* ---------------- helpers ---------------- */

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const usd = (n) => "$" + n.toFixed(2);
const pct = (n, total = CLEAN_DATA.length) => Math.round((n / total) * 100);
const median = (arr) => { const s = [...arr].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

function countBy(field) {
  const out = {};
  CLEAN_DATA.forEach((r) => { out[r[field]] = (out[r[field]] || 0) + 1; });
  return Object.entries(out).sort((a, b) => b[1] - a[1]);
}

function barRow(label, count, max, extraClass = "") {
  const width = Math.max(4, Math.round((count / max) * 100));
  return `<div class="bar-row"><span class="bar-label">${esc(label)}</span>` +
    `<div class="bar-track"><div class="bar-fill ${extraClass}" style="width:${width}%"><span>${count} · ${pct(count)}%</span></div></div></div>`;
}

function stackedBar(segments) {
  const total = segments.reduce((s, x) => s + x.count, 0);
  const segs = segments.map((s) =>
    `<div class="stack-seg" style="width:${(s.count / total) * 100}%;background:${s.color}" title="${esc(s.label)}: ${s.count}">${s.count}</div>`).join("");
  const legend = segments.map((s) =>
    `<span><span class="dot" style="background:${s.color}"></span>${esc(s.label)}: <strong>${s.count} (${pct(s.count)}%)</strong></span>`).join("");
  return `<div class="stack-track">${segs}</div><div class="stack-legend">${legend}</div>`;
}

/* ---------------- raw data sample ---------------- */

function renderRawSample() {
  $("#rawSampleBody").innerHTML = RAW_SAMPLE.map((r) => `
    <tr>
      <td>${esc(r.id)}</td>
      <td class="cell-name">${esc(r.name)}</td>
      <td>${esc(r.cat)}</td>
      <td>${esc(r.pricing)}</td>
      <td>${esc(r.free)}</td>
      <td>${esc(r.mobile)}</td>
      <td>${esc(r.checked)}</td>
      <td>${esc(r.note) || "—"}</td>
    </tr>`).join("");
}

/* ---------------- before / after ---------------- */

function renderBA() {
  $("#baGrid").innerHTML = BA_EXAMPLES.map((ex, i) => `
    <article class="ba-card">
      <div class="ba-head"><span class="ba-index">${i + 1}</span>${esc(ex.title)}</div>
      <div class="ba-body">
        <div class="ba-raw">${esc(ex.raw)}</div>
        <div class="ba-arrow">↓</div>
        <dl class="ba-clean">${ex.clean.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
      </div>
      <p class="ba-rule">${esc(ex.rule)}</p>
      <div class="ba-foot"><span class="badge ${ex.confClass}">Confidence: ${esc(ex.conf)}</span></div>
    </article>`).join("");
}

/* ---------------- clean table (search / filter / sort) ---------------- */

const tableState = { search: "", cat: "", conf: "", sortKey: null, sortDir: 1 };

function confBadge(conf) {
  const cls = conf === "High" ? "badge-high" : conf === "Medium" ? "badge-med" : "badge-low";
  return `<span class="badge ${cls}">${esc(conf)}</span>`;
}

function aiCell(ai) {
  const yes = ai.startsWith("Yes");
  const detail = ai.includes(" - ") ? ai.split(" - ").slice(1).join(" - ") : "";
  return `<span class="badge ${yes ? "badge-neutral" : "badge-med"}">${yes ? "Yes" : "No"}</span>` +
    (detail ? `<div class="cell-sub">${esc(detail)}</div>` : "");
}

function renderCleanTable() {
  let rows = CLEAN_DATA.filter((r) => {
    const q = tableState.search.toLowerCase();
    const matchQ = !q || [r.name, r.cat, r.use, r.diff, r.target].some((v) => v.toLowerCase().includes(q));
    const matchCat = !tableState.cat || r.cat === tableState.cat;
    const matchConf = !tableState.conf || r.conf === tableState.conf;
    return matchQ && matchCat && matchConf;
  });
  if (tableState.sortKey) {
    rows = [...rows].sort((a, b) => {
      const va = tableState.sortKey === "price" ? a.price : a.name.toLowerCase();
      const vb = tableState.sortKey === "price" ? b.price : b.name.toLowerCase();
      return (va < vb ? -1 : va > vb ? 1 : 0) * tableState.sortDir;
    });
  }
  const body = $("#cleanBody");
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--ink-mute);padding:28px">No products match the current filters.</td></tr>`;
  } else {
    body.innerHTML = rows.map((r) => `
      <tr>
        <td class="cell-name">${esc(r.name)}<a href="https://${esc(r.site)}" target="_blank" rel="noopener">${esc(r.site)}</a></td>
        <td>${esc(r.cat)}</td>
        <td>${esc(r.target)}</td>
        <td>${esc(r.free)}</td>
        <td class="cell-price">${usd(r.price)}</td>
        <td>${aiCell(r.ai)}</td>
        <td><span class="badge ${r.mobile === "Yes" ? "badge-neutral" : "badge-med"}">${esc(r.mobile)}</span></td>
        <td>${confBadge(r.conf)}</td>
        <td><span class="badge ${r.src.includes("conflicting") ? "badge-low" : "badge-neutral"}">${esc(r.src)}</span></td>
      </tr>`).join("");
  }
  $("#resultCount").textContent = `Showing ${rows.length} of ${CLEAN_DATA.length} products`;
}

function initTableControls() {
  const catSel = $("#categoryFilter");
  [...new Set(CLEAN_DATA.map((r) => r.cat))].sort().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    catSel.appendChild(opt);
  });
  $("#tableSearch").addEventListener("input", (e) => { tableState.search = e.target.value; renderCleanTable(); });
  catSel.addEventListener("change", (e) => { tableState.cat = e.target.value; renderCleanTable(); });
  $("#confidenceFilter").addEventListener("change", (e) => { tableState.conf = e.target.value; renderCleanTable(); });
  document.querySelectorAll("#cleanTable th.sortable").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (tableState.sortKey === key) { tableState.sortDir *= -1; } else { tableState.sortKey = key; tableState.sortDir = 1; }
      document.querySelectorAll("#cleanTable th.sortable").forEach((t) => t.classList.remove("sort-asc", "sort-desc"));
      th.classList.add(tableState.sortDir === 1 ? "sort-asc" : "sort-desc");
      renderCleanTable();
    });
  });
}

/* ---------------- dashboard ---------------- */

function renderDashboard() {
  const n = CLEAN_DATA.length;
  const prices = CLEAN_DATA.map((r) => r.price);
  const med = median(prices);
  const freeYes = CLEAN_DATA.filter((r) => r.free.startsWith("Yes")).length;
  const freeTrial = CLEAN_DATA.filter((r) => r.free.startsWith("Trial")).length;
  const freeNo = n - freeYes - freeTrial;
  const aiYes = CLEAN_DATA.filter((r) => r.ai.startsWith("Yes")).length;
  const confHigh = CLEAN_DATA.filter((r) => r.conf === "High").length;
  const confMed = CLEAN_DATA.filter((r) => r.conf === "Medium").length;
  const confLow = n - confHigh - confMed;

  $("#dashKpis").innerHTML = `
    <div class="kpi-card"><span class="kpi-number">${n}</span><span class="kpi-label">products analyzed</span></div>
    <div class="kpi-card"><span class="kpi-number">${usd(med)}</span><span class="kpi-label">median starting price · USD/month</span></div>
    <div class="kpi-card"><span class="kpi-number">${pct(freeYes)}%</span><span class="kpi-label">offer a free plan (${freeYes} of ${n})</span></div>
    <div class="kpi-card"><span class="kpi-number">${pct(aiYes)}%</span><span class="kpi-label">advertise AI features (${aiYes} of ${n})</span></div>`;

  // products by category
  const cats = countBy("cat");
  const catMax = Math.max(...cats.map(([, c]) => c));
  $("#chartCategory").innerHTML = cats.map(([c, k]) => barRow(c, k, catMax)).join("");

  // target customers
  const targets = countBy("target");
  const tMax = Math.max(...targets.map(([, c]) => c));
  $("#chartTarget").innerHTML = targets.map(([t, k]) => barRow(t, k, tMax)).join("");

  // price bands
  const bands = [
    ["Under $6", prices.filter((p) => p < 6).length],
    ["$6 – $9.99", prices.filter((p) => p >= 6 && p < 10).length],
    ["$10 – $14.99", prices.filter((p) => p >= 10 && p < 15).length],
    ["$15 and above", prices.filter((p) => p >= 15).length]
  ];
  const bMax = Math.max(...bands.map(([, c]) => c));
  $("#chartPrice").innerHTML = bands.map(([b, k]) => barRow(b, k, bMax)).join("");

  // stacked: free plan / AI / confidence
  $("#chartFree").innerHTML = stackedBar([
    { label: "Free plan", count: freeYes, color: "#16a34a" },
    { label: "Trial only", count: freeTrial, color: "#f59e0b" },
    { label: "No free access", count: freeNo, color: "#ef4444" }
  ]);
  $("#chartAi").innerHTML = stackedBar([
    { label: "AI features advertised", count: aiYes, color: "#0e7490" },
    { label: "None advertised", count: n - aiYes, color: "#94a3b8" }
  ]);
  $("#chartConf").innerHTML = stackedBar([
    { label: "High", count: confHigh, color: "#16a34a" },
    { label: "Medium", count: confMed, color: "#f59e0b" },
    { label: "Needs verification", count: confLow, color: "#ef4444" }
  ]);
}

/* ---------------- scroll spy ---------------- */

function initScrollSpy() {
  const links = [...document.querySelectorAll(".site-nav a")];
  const map = new Map(links.map((l) => [l.getAttribute("href").slice(1), l]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.remove("active"));
        const link = map.get(entry.target.id);
        if (link) { link.classList.add("active"); link.scrollIntoView({ block: "nearest", inline: "nearest" }); }
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  map.forEach((_, id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
}

/* ---------------- init ---------------- */

renderRawSample();
renderBA();
initTableControls();
renderCleanTable();
renderDashboard();
initScrollSpy();
