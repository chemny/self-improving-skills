#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i];
  const next = process.argv[i + 1];
  if (key.startsWith("--")) {
    args.set(key.slice(2), next && !next.startsWith("--") ? next : "true");
    if (next && !next.startsWith("--")) i += 1;
  }
}

const codexHome = args.get("codex-home") || process.env.CODEX_HOME || path.join(process.env.HOME || "", ".codex");
const memoryDir = args.get("memory-dir") || path.join(codexHome, "memories");
const outPath = args.get("out") || path.join(memoryDir, "self-improving-skills-dashboard.html");

const files = {
  evolution: path.join(memoryDir, "evolution.md"),
  candidates: path.join(memoryDir, "evolution-candidates.md"),
  promotions: path.join(memoryDir, "evolution-promotions.md"),
  reports: path.join(memoryDir, "evolution-scan-reports.md"),
};

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function firstMatch(text, re, fallback = "") {
  const match = text.match(re);
  return match ? match[1].trim() : fallback;
}

function splitEntries(markdown) {
  const starts = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  return starts
    .map((match, index) => {
      const start = match.index;
      const end = index + 1 < starts.length ? starts[index + 1].index : markdown.length;
      const body = markdown.slice(start, end).trim();
      return { title: match[1].trim(), body };
    })
    .filter((entry) => /\d{4}-\d{2}-\d{2}/.test(entry.title));
}

function dateFromTitle(title) {
  const match = title.match(/(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2}))?/);
  return match ? `${match[1]} ${match[2] || "00:00"}` : "";
}

function parseActiveRules(markdown) {
  return splitEntries(markdown).map((entry) => ({
    date: dateFromTitle(entry.title),
    title: entry.title.replace(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}\s+-\s+/, ""),
    status: firstMatch(entry.body, /^Status:\s*(.+)$/m),
    risk: firstMatch(entry.body, /^Risk:\s*(.+)$/m),
    confidence: firstMatch(entry.body, /^Confidence:\s*(.+)$/m),
    scope: firstMatch(entry.body, /^Scope:\s*(.+)$/m),
    rule: firstMatch(entry.body, /^Rule:\n- ([\s\S]*?)(?:\n\n|$)/m).replace(/\n- /g, " "),
  })).filter((item) => item.status === "active");
}

function parseCandidates(markdown) {
  return splitEntries(markdown).map((entry) => {
    const appLog = firstMatch(entry.body, /^Application log:\n([\s\S]*?)(?:\n\n|$)/m);
    const evidence = Number(firstMatch(entry.body, /^- Evidence count:\s*(\d+)/m, "0"));
    const current = firstMatch(entry.body, /^- Current:\s*(.+)$/m);
    const status = firstMatch(entry.body, /^Status:\s*(.+)$/m);
    const risk = firstMatch(entry.body, /^Risk:\s*(.+)$/m);
    const destination = firstMatch(entry.body, /^Suggested destination:\n- (.+)$/m);
    return {
      date: dateFromTitle(entry.title),
      title: entry.title.replace(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}\s+-\s+Candidate\s+-\s+/, ""),
      status,
      type: firstMatch(entry.body, /^Type:\s*(.+)$/m),
      risk,
      confidence: firstMatch(entry.body, /^Confidence:\s*(.+)$/m),
      scope: firstMatch(entry.body, /^Scope:\s*(.+)$/m),
      observation: firstMatch(entry.body, /^Observation:\n- ([\s\S]*?)(?:\n\n|$)/m).replace(/\n- /g, " "),
      proposed: firstMatch(entry.body, /^Proposed rule:\n- ([\s\S]*?)(?:\n\n|$)/m).replace(/\n- /g, " "),
      current,
      evidence,
      appLog,
      destination,
      decision: firstMatch(entry.body, /^Decision needed:\n- (.+)$/m),
      queue: classifyCandidate({ status, risk, destination, current, evidence, appLog }),
    };
  });
}

function classifyCandidate(item) {
  if (item.status === "requires_confirmation" || item.risk === "high") return "requires_confirmation";
  if (/^skill:/.test(item.destination)) return "route_to_skill";
  if (/applied_twice|eval_passed|confirmed_by_user/.test(item.current) || item.evidence >= 2) return "ready_to_promote";
  if (/applied_once/.test(item.current) || /-\s+\d{4}-\d{2}-\d{2}/.test(item.appLog || "")) return "needs_one_more_use";
  if (/archive/.test(item.decision || "")) return "archive";
  return "pending_review";
}

function parsePromotions(markdown) {
  return splitEntries(markdown).map((entry) => ({
    date: dateFromTitle(entry.title),
    title: firstMatch(entry.body, /^Promoted item:\n- (.+)$/m, entry.title),
    why: firstMatch(entry.body, /^Why eligible:\n- ([\s\S]*?)(?:\n\n|$)/m),
  }));
}

function parseReports(markdown) {
  return splitEntries(markdown).map((entry) => {
    const ledger = [...entry.body.matchAll(/^- Project \/ task:\s+(.+)$/gm)].map((m) => m[1].trim());
    const kind = /manual/i.test(entry.body) ? "manual" : /duplicate-only|duplicate/i.test(entry.body) ? "duplicate_or_retry" : "primary";
    return {
      date: dateFromTitle(entry.title),
      title: entry.title,
      kind,
      sessions: Number(firstMatch(entry.body, /^- Sessions with events:\s*(\d+)/m, "0")),
      meaningful: Number(firstMatch(entry.body, /^- Meaningful user messages:\s*(\d+)/m, "0")),
      signals: Number(firstMatch(entry.body, /^- Candidate signals detected:\s*(\d+)/m, "0")),
      ledgerItems: Number(firstMatch(entry.body, /^- Project ledger items:\s*(\d+)/m, String(ledger.length || 0))),
      effective: Number(firstMatch(entry.body, /^- Effective information identified:\s*(\d+)/m, "0")),
      promoted: Number(firstMatch(entry.body, /^- Promoted to durable memory:\s*(\d+)/m, "0")),
      candidates: Number(firstMatch(entry.body, /^- Written as candidates:\s*(\d+)/m, "0")),
      ledger,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

function countBy(items, key) {
  const out = {};
  for (const item of items) {
    const value = item[key] || "unknown";
    out[value] = (out[value] || 0) + 1;
  }
  return out;
}

function sum(items, key) {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function dateOnly(value) {
  return String(value || "").slice(0, 10);
}

function ensureDay(map, date) {
  if (!date) return null;
  if (!map.has(date)) {
    map.set(date, {
      date,
      activeRules: 0,
      candidates: 0,
      promotions: 0,
      scanReports: 0,
      ledgerItems: 0,
      effectiveInfo: 0,
      sessions: 0,
      signals: 0,
    });
  }
  return map.get(date);
}

function buildDailyData() {
  const days = new Map();
  for (const item of activeRules) {
    const day = ensureDay(days, dateOnly(item.date));
    if (day) day.activeRules += 1;
  }
  for (const item of candidates) {
    const day = ensureDay(days, dateOnly(item.date));
    if (day) day.candidates += 1;
  }
  for (const item of promotions) {
    const day = ensureDay(days, dateOnly(item.date));
    if (day) day.promotions += 1;
  }
  for (const item of reports) {
    const day = ensureDay(days, dateOnly(item.date));
    if (!day) continue;
    day.scanReports += 1;
    day.ledgerItems += Number(item.ledgerItems || 0);
    day.effectiveInfo += Number(item.effective || 0);
    day.sessions += Number(item.sessions || 0);
    day.signals += Number(item.signals || 0);
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const activeRules = parseActiveRules(read(files.evolution));
const candidates = parseCandidates(read(files.candidates));
const promotions = parsePromotions(read(files.promotions));
const reports = parseReports(read(files.reports));
const recentReports = reports.slice(0, 20);
const recentLedger = reports.flatMap((report) => report.ledger.map((title) => ({ report: report.date, title, kind: report.kind }))).slice(0, 60);
const queueCounts = countBy(candidates, "queue");
const reportCounts = countBy(reports, "kind");
const dailyData = buildDailyData();
const firstDataDate = dailyData[0]?.date || "";
const lastDataDate = dailyData[dailyData.length - 1]?.date || "";
const generatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
const ui = {
  title: ["Self-Improving Skills 仪表盘", "Self-Improving Skills Dashboard"],
  subtitle: ["只读运行视图", "Read-only runtime view"],
  generatedAt: ["生成时间", "Generated"],
  memory: ["记忆目录", "Memory"],
  activeRules: ["已采用规则", "Adopted Rules"],
  candidates: ["处理记录", "Processing Records"],
  promotions: ["采纳记录", "Adoption Records"],
  scanReports: ["扫描报告", "Scan Reports"],
  ledgerItems: ["项目记录", "Work Records"],
  effectiveInfo: ["有价值信息", "Useful Info"],
  sessions: ["会话数", "Sessions"],
  dataOverview: ["数据总览", "Data Overview"],
  dataOverviewDesc: ["用时间区间筛选核心数据。小方格展示这段时间里新增了多少。", "Filter core data by date range. Tiles show additions inside the selected range."],
  dateRange: ["时间区间", "Date Range"],
  startDate: ["开始日期", "Start"],
  endDate: ["结束日期", "End"],
  last7Days: ["最近 7 天", "Last 7 Days"],
  last30Days: ["最近 30 天", "Last 30 Days"],
  allDates: ["全部", "All"],
  globalTrend: ["全局数据图", "Global Data Trend"],
  globalTrendDesc: ["按天查看每类数据新增了多少。可以勾选想看的数据，也可以切换某一天或一段时间。", "See daily additions by metric. Toggle dimensions and switch between one day or a date range."],
  selectedTotal: ["选中区间合计", "Selected Total"],
  noDataInRange: ["当前时间区间没有数据", "No data in the selected range"],
  collapse: ["折叠", "Collapse"],
  expand: ["展开", "Expand"],
  showMore: ["展开全部", "Show all"],
  showLess: ["收起", "Collapse"],
  hiddenItems: ["条已隐藏", "hidden"],
  workflowTitle: ["运行流程", "Workflow"],
  workflowIntro: ["运行流程和下面 5 个模块一一对应：先看信息收集，再看项目记录、处理记录、已采用规则，最后看系统检查。", "The workflow matches the five modules below: collect info, review work records, processing records, adopted rules, and system checks."],
  moduleCapture: ["信息收集", "Collect Info"],
  moduleCaptureDesc: ["看系统有没有真的扫描会话，以及这段时间找到了多少有价值的信息。", "Check whether sessions were actually scanned and how many useful items were extracted."],
  moduleLedger: ["项目记录", "Work Records"],
  moduleLedgerDesc: ["把最近做过的项目、产出和成果先记清楚，避免只留下零散规则。", "Make recent projects, outputs, and outcomes visible before turning anything into rules."],
  moduleTriage: ["处理记录", "Processing Records"],
  moduleTriageDesc: ["这里展示系统如何处理发现的经验：自动采用、继续观察、放到技能里、忽略，或在规则不足时标记为需要人工处理。", "Shows how the system handles learnings: auto-adopt, keep observing, route to a skill, ignore, or mark for human handling only when rules are insufficient."],
  modulePromote: ["已采用规则", "Adopted Rules"],
  modulePromoteDesc: ["只展示已经被正式采用的内容，用来判断它是否真的能影响后续工作。", "Show durable memories/rules that can actually affect future work."],
  moduleHealth: ["系统检查", "System Check"],
  moduleHealthDesc: ["检查这套自动总结机制是否正常运行，是否有重复扫描、信息堆积，或者需要人工处理的问题。", "Check whether the scan system is running, duplicating work, piling up items, or needing human handling."],
  candidateQueue: ["系统处理状态", "Processing Status"],
  reportHealth: ["扫描情况", "Scan Status"],
  currentReading: ["如何阅读当前状态", "Current Reading"],
  isRunning: ["系统是否在运行？", "Is the system running?"],
  isRunningText: ["看最近扫描报告是否持续增长，以及项目记录里是否出现真实项目。", "Check whether recent reports keep growing and whether work records contain real project items."],
  producesCapability: ["是否产生能力？", "Is it producing capabilities?"],
  producesCapabilityText: ["看已采用规则、可自动采用记录、放到技能里的记录，而不是只看扫描次数。", "Look at adopted rules, auto-adoptable records, and skill-routed records, not just scan count."],
  noisy: ["是否噪声过多？", "Is there too much noise?"],
  noisyText: ["看重复/补跑报告和系统待处理内容是否持续堆积。", "Watch whether duplicate/retry reports and pending system-handled items keep piling up."],
  recentLedger: ["最近项目记录", "Recent Work Records"],
  candidateDetails: ["经验处理记录", "Learning Processing Records"],
  recentReports: ["最近扫描报告", "Recent Scan Reports"],
  queue: ["处理状态", "Status"],
  candidate: ["经验内容", "Learning"],
  scope: ["范围", "Scope"],
  destination: ["去向", "Destination"],
  state: ["状态", "State"],
  date: ["日期", "Date"],
  kind: ["类型", "Kind"],
  sessions: ["会话", "Sessions"],
  signals: ["信号", "Signals"],
  ledger: ["记录", "Records"],
  effective: ["有价值", "Useful"],
  writes: ["写入", "Writes"],
  sourceFiles: ["来源文件", "Source files"],
  noActiveRule: ["暂无已采用规则", "No adopted rules"],
  noLedgerItem: ["暂无项目记录", "No work records"],
  noCandidate: ["暂无处理记录", "No processing records"],
  noReport: ["暂无报告", "No reports"],
  promoted: ["已采用", "adopted"],
  queueReady: ["可自动采用", "Ready for auto-adoption"],
  queueOneMore: ["继续观察", "Keep observing"],
  queueSkill: ["放到技能里", "Route to skill"],
  queueConfirm: ["需要人工处理", "Needs human handling"],
  queuePending: ["系统待处理", "Pending system handling"],
  queueArchive: ["已忽略", "Ignored"],
  reportPrimary: ["正常扫描", "Primary scan"],
  reportManual: ["手动扫描", "Manual scan"],
  reportDuplicate: ["重复/补跑", "Duplicate/retry"],
  stateObserved: ["已发现一次", "Observed once"],
  stateApplied: ["已用过一次", "Used once"],
  stateAppliedTwice: ["已用过两次", "Used twice"],
  stateReviewed: ["已查看", "Reviewed"],
  typeSkillRule: ["技能规则", "Skill rule"],
  typeWorkflow: ["流程经验", "Workflow lesson"],
  typeToolGotcha: ["工具问题", "Tool gotcha"],
  typePreference: ["用户偏好", "User preference"],
  typeCorrection: ["纠错经验", "Correction"],
  typeGlobal: ["全局经验", "Global learning"],
  riskHigh: ["高", "High"],
  riskMedium: ["中", "Medium"],
  riskLow: ["低", "Low"],
};

function uiText(key, langIndex = 0) {
  return ui[key]?.[langIndex] || key;
}

function i18n(key) {
  return `<span data-i18n="${esc(key)}">${esc(uiText(key))}</span>`;
}

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Self-Improving Skills Dashboard</title>
  <style>
    :root { color-scheme: light; --bg:#f6f7f9; --panel:#fff; --line:#d9dee7; --text:#1f2937; --muted:#667085; --blue:#2364aa; --green:#287d4f; --red:#b42318; --amber:#a15c07; --violet:#6d4aff; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    header { padding:22px 28px 14px; background:#111827; color:white; }
    .topbar { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
    .lang-toggle { display:inline-flex; gap:4px; padding:3px; border:1px solid #374151; border-radius:8px; background:#1f2937; flex:0 0 auto; }
    .lang-toggle button { border:0; border-radius:6px; padding:6px 10px; background:transparent; color:#cbd5e1; cursor:pointer; font:12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    .lang-toggle button.active { background:#f9fafb; color:#111827; }
    h1 { margin:0 0 6px; font-size:24px; letter-spacing:0; }
    h2 { margin:0 0 12px; font-size:17px; letter-spacing:0; }
    h3 { margin:0 0 6px; font-size:14px; letter-spacing:0; }
    .sub { color:#cbd5e1; }
    main { padding:20px 28px 32px; max-width:1440px; margin:0 auto; }
    .grid { display:grid; gap:14px; }
    .metrics { grid-template-columns: repeat(6, minmax(0, 1fr)); }
    .two { grid-template-columns: 1fr 1fr; }
    .three { grid-template-columns: 1.05fr .95fr .95fr; }
    .module-grid { grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr); align-items:start; }
    .module-stack { display:grid; gap:14px; }
    .compact-metrics { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .panel { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:16px; min-width:0; }
    .module { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:18px; min-width:0; }
    .module-head { display:flex; gap:12px; align-items:flex-start; margin-bottom:14px; }
    .module-head.split { justify-content:space-between; }
    .module-head-main { display:flex; gap:12px; align-items:flex-start; min-width:0; }
    .module-index { flex:0 0 auto; width:34px; height:34px; border-radius:8px; display:grid; place-items:center; background:#111827; color:#fff; font-weight:700; }
    .module-title { margin:0; font-size:18px; }
    .module-desc { color:var(--muted); margin-top:2px; }
    .icon-btn { border:1px solid var(--line); border-radius:8px; padding:7px 10px; background:#fff; color:var(--text); cursor:pointer; font:12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    .icon-btn:hover { background:#f8fafc; }
    .flow { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .flow-step { border:1px solid var(--line); border-radius:8px; background:#fff; padding:12px; min-width:0; }
    .flow-kicker { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
    .flow-num { width:24px; height:24px; display:grid; place-items:center; border-radius:7px; background:#eef2ff; color:#3046a2; font-weight:700; font-size:12px; }
    .flow-step p { margin:0; color:var(--muted); font-size:12px; }
    .module.collapsed .collapsible-body { display:none; }
    .toolbar { display:flex; align-items:end; justify-content:space-between; gap:14px; flex-wrap:wrap; margin-bottom:14px; }
    .date-controls { display:flex; align-items:end; gap:10px; flex-wrap:wrap; }
    .field { display:grid; gap:4px; }
    .field label { color:var(--muted); font-size:12px; }
    input[type="date"] { height:34px; border:1px solid var(--line); border-radius:8px; padding:0 9px; background:#fff; color:var(--text); font:13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    .quick-actions { display:flex; gap:6px; flex-wrap:wrap; }
    .stat-grid { display:grid; grid-template-columns: repeat(6, minmax(0, 1fr)); border:1px solid var(--line); border-radius:8px; overflow:hidden; background:#fff; }
    .stat-tile { min-height:86px; padding:12px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); background:#fff; }
    .stat-tile:nth-child(6n) { border-right:0; }
    .stat-label { color:var(--muted); font-size:12px; }
    .stat-value { font-size:26px; line-height:1.1; font-weight:750; margin-top:8px; }
    .stat-note { color:var(--muted); font-size:11px; margin-top:4px; }
    .dimension-controls { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
    .check-pill { display:inline-flex; align-items:center; gap:6px; border:1px solid var(--line); border-radius:999px; padding:6px 9px; background:#fff; font-size:12px; cursor:pointer; }
    .check-pill input { margin:0; }
    .chart-wrap { position:relative; border:1px solid var(--line); border-radius:8px; padding:12px; background:#fff; min-height:330px; }
    .chart-empty { height:300px; display:grid; place-items:center; color:var(--muted); }
    .chart-svg { width:100%; height:300px; display:block; }
    .chart-dot { transition:r .14s ease, stroke-width .14s ease, opacity .14s ease; cursor:pointer; }
    .chart-dot:hover { r:6; stroke-width:3; opacity:.96; }
    .chart-tooltip { position:absolute; z-index:3; pointer-events:none; min-width:150px; border:1px solid #cfd6e4; border-radius:8px; background:#111827; color:#fff; padding:8px 10px; box-shadow:0 10px 28px rgba(15,23,42,.18); opacity:0; transform:translate(-50%, -110%); transition:opacity .12s ease; font-size:12px; }
    .chart-tooltip.visible { opacity:1; }
    .chart-tooltip strong { display:block; font-size:13px; margin-bottom:3px; }
    .chart-tooltip span { color:#d1d5db; }
    .chart-legend { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; color:var(--muted); font-size:12px; }
    .legend-dot { width:9px; height:9px; border-radius:50%; display:inline-block; margin-right:5px; }
    .metric { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:14px; }
    .metric .label { color:var(--muted); font-size:12px; }
    .metric .value { font-size:28px; font-weight:700; margin-top:4px; }
    .pill { display:inline-flex; align-items:center; gap:6px; border:1px solid var(--line); border-radius:999px; padding:2px 8px; font-size:12px; color:var(--muted); background:#f9fafb; white-space:nowrap; }
    .pill.green { color:var(--green); border-color:#b7dfc8; background:#eefaf3; }
    .pill.red { color:var(--red); border-color:#f4b8b0; background:#fff1f0; }
    .pill.amber { color:var(--amber); border-color:#f2d09d; background:#fff8eb; }
    .pill.blue { color:var(--blue); border-color:#bad4ef; background:#eef6ff; }
    .pill.violet { color:var(--violet); border-color:#d4caff; background:#f5f2ff; }
    table { width:100%; border-collapse:collapse; }
    th,td { text-align:left; padding:9px 8px; border-bottom:1px solid #eef1f5; vertical-align:top; }
    th { color:var(--muted); font-size:12px; font-weight:600; }
    td small { color:var(--muted); display:block; margin-top:2px; }
    .list { display:grid; gap:10px; }
    .item { border:1px solid #edf0f5; border-radius:8px; padding:10px; background:#fcfcfd; }
    .item p { margin:4px 0 0; color:var(--muted); }
    .fold-extra { display:none; }
    .foldable.expanded .fold-extra { display:revert; }
    .list.foldable.expanded .fold-extra { display:block; }
    .fold-actions { display:flex; justify-content:center; margin-top:10px; }
    .bars { display:grid; gap:9px; }
    .bar { display:grid; grid-template-columns:145px 1fr 34px; align-items:center; gap:8px; }
    .track { height:9px; background:#edf1f7; border-radius:999px; overflow:hidden; }
    .fill { height:100%; background:var(--blue); }
    .muted { color:var(--muted); }
    .mono { font-family: ui-monospace,SFMono-Regular,Menlo,monospace; font-size:12px; }
    footer { padding:0 28px 24px; color:var(--muted); max-width:1440px; margin:0 auto; }
    @media (max-width: 980px) { .metrics,.two,.three,.flow,.module-grid,.compact-metrics,.stat-grid { grid-template-columns:1fr; } .stat-tile,.stat-tile:nth-child(6n) { border-right:0; } main,header,footer { padding-left:16px; padding-right:16px; } .topbar { align-items:stretch; flex-direction:column; } .lang-toggle { align-self:flex-start; } }
  </style>
</head>
<body>
  <header>
    <div class="topbar">
      <div>
        <h1>${i18n("title")}</h1>
        <div class="sub">${i18n("subtitle")} · ${i18n("generatedAt")} ${esc(generatedAt)} · ${i18n("memory")} ${esc(memoryDir)}</div>
      </div>
      <div class="lang-toggle" aria-label="Language">
        <button type="button" class="active" data-lang-button="zh">中文</button>
        <button type="button" data-lang-button="en">English</button>
      </div>
    </div>
  </header>
  <main class="grid" style="gap:18px">
    <section class="module">
      <div class="module-head split">
        <div class="module-head-main">
          <div class="module-index">总</div>
          <div>
            <h2 class="module-title">${i18n("dataOverview")}</h2>
            <div class="module-desc">${i18n("dataOverviewDesc")}</div>
          </div>
        </div>
        <div class="date-controls" aria-label="Date range">
          <div class="field">
            <label for="rangeStart">${i18n("startDate")}</label>
            <input type="date" id="rangeStart" min="${esc(firstDataDate)}" max="${esc(lastDataDate)}" value="${esc(firstDataDate)}">
          </div>
          <div class="field">
            <label for="rangeEnd">${i18n("endDate")}</label>
            <input type="date" id="rangeEnd" min="${esc(firstDataDate)}" max="${esc(lastDataDate)}" value="${esc(lastDataDate)}">
          </div>
          <div class="quick-actions">
            <button type="button" class="icon-btn" data-range="7">${i18n("last7Days")}</button>
            <button type="button" class="icon-btn" data-range="30">${i18n("last30Days")}</button>
            <button type="button" class="icon-btn" data-range="all">${i18n("allDates")}</button>
          </div>
        </div>
      </div>
      <div class="stat-grid">
        ${statTile("scanReports")}
        ${statTile("sessions")}
        ${statTile("effectiveInfo")}
        ${statTile("ledgerItems")}
        ${statTile("candidates")}
        ${statTile("promotions")}
      </div>
    </section>

    <section class="module">
      <div class="module-head">
        <div class="module-index">图</div>
        <div>
          <h2 class="module-title">${i18n("globalTrend")}</h2>
          <div class="module-desc">${i18n("globalTrendDesc")}</div>
        </div>
      </div>
      <div class="dimension-controls">
        ${dimensionToggle("scanReports", true)}
        ${dimensionToggle("sessions", true)}
        ${dimensionToggle("effectiveInfo", true)}
        ${dimensionToggle("ledgerItems", true)}
        ${dimensionToggle("candidates", false)}
        ${dimensionToggle("promotions", false)}
        ${dimensionToggle("activeRules", false)}
      </div>
      <div class="chart-wrap">
        <div id="globalChart"></div>
        <div id="chartTooltip" class="chart-tooltip"></div>
        <div id="chartLegend" class="chart-legend"></div>
      </div>
    </section>

    <section class="module" id="workflowModule">
      <div class="module-head split">
        <div class="module-head-main">
          <div class="module-index">流</div>
          <div>
            <h2 class="module-title">${i18n("workflowTitle")}</h2>
            <div class="module-desc">${i18n("workflowIntro")}</div>
          </div>
        </div>
        <button type="button" class="icon-btn" id="workflowToggle" data-expanded="true">${i18n("collapse")}</button>
      </div>
      <div class="grid flow collapsible-body">
        ${flowStep(1, "moduleCapture", "moduleCaptureDesc")}
        ${flowStep(2, "moduleLedger", "moduleLedgerDesc")}
        ${flowStep(3, "moduleTriage", "moduleTriageDesc")}
        ${flowStep(4, "modulePromote", "modulePromoteDesc")}
        ${flowStep(5, "moduleHealth", "moduleHealthDesc")}
      </div>
    </section>

    <section class="module">
      <div class="module-head">
        <div class="module-index">收</div>
        <div>
          <h2 class="module-title">${i18n("moduleCapture")}</h2>
          <div class="module-desc">${i18n("moduleCaptureDesc")}</div>
        </div>
      </div>
      <div class="module-stack">
        <div class="grid compact-metrics">
          ${metric("scanReports", reports.length)}
          ${metric("effectiveInfo", sum(reports, "effective"))}
          ${metric("candidates", candidates.length)}
        </div>
        <div>
          <h2>${i18n("recentReports")}</h2>
          <div data-fold-root>
            <table>
              <thead><tr><th>${i18n("date")}</th><th>${i18n("kind")}</th><th>${i18n("sessions")}</th><th>${i18n("signals")}</th><th>${i18n("effective")}</th><th>${i18n("writes")}</th></tr></thead>
              <tbody class="foldable">${foldableRows(recentReports, reportRow, "noReport", 6)}</tbody>
            </table>
            ${foldButton(recentReports.length)}
          </div>
        </div>
      </div>
    </section>

    <section class="module">
      <div class="module-head">
        <div class="module-index">记</div>
        <div>
          <h2 class="module-title">${i18n("moduleLedger")}</h2>
          <div class="module-desc">${i18n("moduleLedgerDesc")}</div>
        </div>
      </div>
      <div class="module-stack">
        <div class="grid compact-metrics">
          ${metric("ledgerItems", sum(reports, "ledgerItems"))}
          ${metric("scanReports", reports.length)}
          ${metric("effectiveInfo", sum(reports, "effective"))}
        </div>
        <div>
          <h2>${i18n("recentLedger")}</h2>
          ${foldableCards(recentLedger, ledgerCard, "noLedgerItem")}
        </div>
      </div>
    </section>

    <section class="module">
      <div class="module-head">
        <div class="module-index">确</div>
        <div>
          <h2 class="module-title">${i18n("moduleTriage")}</h2>
          <div class="module-desc">${i18n("moduleTriageDesc")}</div>
        </div>
      </div>
      <div class="module-stack">
        <div>
          <h2>${i18n("candidateQueue")}</h2>
          ${bars(queueCounts, ["ready_to_promote","needs_one_more_use","route_to_skill","requires_confirmation","pending_review","archive"])}
        </div>
        <div>
          <h2>${i18n("candidateDetails")}</h2>
          <div data-fold-root>
            <table>
              <thead><tr><th>${i18n("queue")}</th><th>${i18n("candidate")}</th><th>${i18n("destination")}</th><th>${i18n("state")}</th></tr></thead>
              <tbody class="foldable">${foldableRows(candidates, candidateRow, "noCandidate", 4)}</tbody>
            </table>
            ${foldButton(candidates.length)}
          </div>
        </div>
      </div>
    </section>

    <section class="module">
      <div class="module-head">
        <div class="module-index">采</div>
        <div>
          <h2 class="module-title">${i18n("modulePromote")}</h2>
          <div class="module-desc">${i18n("modulePromoteDesc")}</div>
        </div>
      </div>
      <div class="module-stack">
        <div class="grid compact-metrics">
          ${metric("activeRules", activeRules.length)}
          ${metric("promotions", promotions.length)}
          ${metric("candidates", queueCounts.ready_to_promote || 0)}
        </div>
        <div>
          <h2>${i18n("activeRules")}</h2>
          ${foldableCards(activeRules.slice().reverse(), ruleCard, "noActiveRule")}
        </div>
      </div>
    </section>

    <section class="module">
      <div class="module-head">
        <div class="module-index">查</div>
        <div>
          <h2 class="module-title">${i18n("moduleHealth")}</h2>
          <div class="module-desc">${i18n("moduleHealthDesc")}</div>
        </div>
      </div>
      <div class="grid three">
        <div>
          <h2>${i18n("reportHealth")}</h2>
          ${bars(reportCounts, ["primary","manual","duplicate_or_retry"])}
        </div>
        <div class="item"><h3>${i18n("isRunning")}</h3><p>${i18n("isRunningText")}</p></div>
        <div class="item"><h3>${i18n("producesCapability")}</h3><p>${i18n("producesCapabilityText")}</p><p>${i18n("noisyText")}</p></div>
      </div>
    </section>
  </main>
  <footer>
    ${i18n("sourceFiles")}: <span class="mono">${Object.values(files).map(esc).join(" · ")}</span>
  </footer>
  <script>
    const translations = ${JSON.stringify(Object.fromEntries(Object.entries(ui).map(([key, value]) => [key, { zh: value[0], en: value[1] }])) )};
    const dailyData = ${JSON.stringify(dailyData)};
    const metricKeys = ["scanReports", "sessions", "effectiveInfo", "ledgerItems", "candidates", "promotions", "activeRules"];
    const metricColors = {
      scanReports: "#2364aa",
      sessions: "#287d4f",
      effectiveInfo: "#a15c07",
      ledgerItems: "#6d4aff",
      candidates: "#b42318",
      promotions: "#0f766e",
      activeRules: "#475467"
    };
    let currentLang = "zh";

    function currentRange() {
      const start = document.getElementById("rangeStart")?.value || "";
      const end = document.getElementById("rangeEnd")?.value || "";
      return start && end && start > end ? { start: end, end: start } : { start, end };
    }

    function filteredDailyData() {
      const { start, end } = currentRange();
      return dailyData.filter((item) => (!start || item.date >= start) && (!end || item.date <= end));
    }

    function sumMetric(items, key) {
      return items.reduce((total, item) => total + Number(item[key] || 0), 0);
    }

    function updateStats(items) {
      document.querySelectorAll("[data-stat]").forEach((node) => {
        const key = node.getAttribute("data-stat");
        const value = sumMetric(items, key);
        node.querySelector("[data-stat-value]").textContent = value;
      });
    }

    function selectedMetrics() {
      const checked = [...document.querySelectorAll("[data-dimension]:checked")].map((node) => node.value);
      return checked.length ? checked : ["scanReports"];
    }

    function renderChart(items) {
      const target = document.getElementById("globalChart");
      const legend = document.getElementById("chartLegend");
      if (!target || !legend) return;
      const keys = selectedMetrics();
      if (!items.length) {
        target.innerHTML = '<div class="chart-empty">' + (translations.noDataInRange?.[currentLang] || "No data") + '</div>';
        legend.innerHTML = "";
        return;
      }
      const width = 960;
      const height = 300;
      const pad = { top: 18, right: 20, bottom: 42, left: 42 };
      const chartW = width - pad.left - pad.right;
      const chartH = height - pad.top - pad.bottom;
      const maxValue = Math.max(1, ...items.flatMap((item) => keys.map((key) => Number(item[key] || 0))));
      const x = (index) => pad.left + (items.length === 1 ? chartW / 2 : (index / (items.length - 1)) * chartW);
      const y = (value) => pad.top + chartH - (Number(value || 0) / maxValue) * chartH;
      const grid = [0, .25, .5, .75, 1].map((ratio) => {
        const gy = pad.top + chartH - ratio * chartH;
        const label = Math.round(ratio * maxValue);
        return '<line x1="' + pad.left + '" y1="' + gy + '" x2="' + (width - pad.right) + '" y2="' + gy + '" stroke="#eef1f5"/><text x="8" y="' + (gy + 4) + '" fill="#667085" font-size="11">' + label + '</text>';
      }).join("");
      const dateLabels = items.map((item, index) => {
        if (items.length > 12 && index % Math.ceil(items.length / 8) !== 0 && index !== items.length - 1) return "";
        const tx = x(index);
        return '<text x="' + tx + '" y="' + (height - 12) + '" text-anchor="middle" fill="#667085" font-size="10">' + item.date.slice(5) + '</text>';
      }).join("");
      const lines = keys.map((key) => {
        const points = items.map((item, index) => x(index) + "," + y(item[key])).join(" ");
        const dots = items.map((item, index) => '<circle class="chart-dot" cx="' + x(index) + '" cy="' + y(item[key]) + '" r="3.5" fill="' + metricColors[key] + '" stroke="#fff" stroke-width="1.5" data-date="' + item.date + '" data-key="' + key + '" data-value="' + Number(item[key] || 0) + '"></circle>').join("");
        return '<polyline fill="none" stroke="' + metricColors[key] + '" stroke-width="2.5" points="' + points + '"/>' + dots;
      }).join("");
      target.innerHTML = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img">' + grid + dateLabels + lines + '</svg>';
      legend.innerHTML = keys.map((key) => '<span><i class="legend-dot" style="background:' + metricColors[key] + '"></i>' + (translations[key]?.[currentLang] || key) + ' · ' + (translations.selectedTotal?.[currentLang] || "Total") + ' ' + sumMetric(items, key) + '</span>').join("");
      bindChartTooltips();
    }

    function bindChartTooltips() {
      const wrap = document.querySelector(".chart-wrap");
      const tooltip = document.getElementById("chartTooltip");
      if (!wrap || !tooltip) return;
      wrap.querySelectorAll(".chart-dot").forEach((dot) => {
        dot.addEventListener("mouseenter", () => {
          const key = dot.getAttribute("data-key");
          const date = dot.getAttribute("data-date");
          const value = dot.getAttribute("data-value");
          tooltip.innerHTML = '<strong>' + date + '</strong><span>' + (translations[key]?.[currentLang] || key) + ': ' + value + '</span>';
          tooltip.classList.add("visible");
        });
        dot.addEventListener("mousemove", (event) => {
          const rect = wrap.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          tooltip.style.left = x + "px";
          tooltip.style.top = y + "px";
        });
        dot.addEventListener("mouseleave", () => {
          tooltip.classList.remove("visible");
        });
      });
    }

    function renderDashboard() {
      const items = filteredDailyData();
      updateStats(items);
      renderChart(items);
    }

    function setRange(days) {
      const startInput = document.getElementById("rangeStart");
      const endInput = document.getElementById("rangeEnd");
      if (!startInput || !endInput || !dailyData.length) return;
      const last = dailyData[dailyData.length - 1].date;
      if (days === "all") {
        startInput.value = dailyData[0].date;
        endInput.value = last;
      } else {
        const date = new Date(last + "T00:00:00");
        date.setDate(date.getDate() - Number(days) + 1);
        const start = date.toISOString().slice(0, 10);
        startInput.value = start < dailyData[0].date ? dailyData[0].date : start;
        endInput.value = last;
      }
      renderDashboard();
    }

    function updateWorkflowToggleLabel() {
      const button = document.getElementById("workflowToggle");
      if (!button) return;
      const expanded = button.getAttribute("data-expanded") === "true";
      button.innerHTML = expanded
        ? '<span data-i18n="collapse">' + (translations.collapse?.[currentLang] || "Collapse") + '</span>'
        : '<span data-i18n="expand">' + (translations.expand?.[currentLang] || "Expand") + '</span>';
    }

    function updateFoldToggleLabel(button) {
      const expanded = button.getAttribute("data-expanded") === "true";
      const count = button.getAttribute("data-hidden-count") || "0";
      const label = expanded ? translations.showLess?.[currentLang] : translations.showMore?.[currentLang];
      const suffix = expanded ? "" : " · " + count + " " + (translations.hiddenItems?.[currentLang] || "hidden");
      button.innerHTML = (label || (expanded ? "Collapse" : "Show all")) + suffix;
    }

    function setLang(lang) {
      currentLang = lang === "en" ? "en" : "zh";
      document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
      document.querySelectorAll("[data-i18n]").forEach((node) => {
        const key = node.getAttribute("data-i18n");
        node.textContent = translations[key]?.[lang] || node.textContent;
      });
      document.querySelectorAll("[data-lang-button]").forEach((button) => {
        button.classList.toggle("active", button.getAttribute("data-lang-button") === lang);
      });
      localStorage.setItem("agentEvolutionDashboardLang", lang);
      updateWorkflowToggleLabel();
      document.querySelectorAll("[data-fold-toggle]").forEach(updateFoldToggleLabel);
      renderDashboard();
    }
    document.getElementById("workflowToggle")?.addEventListener("click", () => {
      const module = document.getElementById("workflowModule");
      const button = document.getElementById("workflowToggle");
      const expanded = button.getAttribute("data-expanded") === "true";
      button.setAttribute("data-expanded", expanded ? "false" : "true");
      module.classList.toggle("collapsed", expanded);
      updateWorkflowToggleLabel();
    });
    document.getElementById("rangeStart")?.addEventListener("change", renderDashboard);
    document.getElementById("rangeEnd")?.addEventListener("change", renderDashboard);
    document.querySelectorAll("[data-range]").forEach((button) => {
      button.addEventListener("click", () => setRange(button.getAttribute("data-range")));
    });
    document.querySelectorAll("[data-dimension]").forEach((input) => {
      input.addEventListener("change", renderDashboard);
    });
    document.querySelectorAll("[data-fold-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const root = button.closest("[data-fold-root]");
        const list = root?.querySelector(".foldable");
        const expanded = button.getAttribute("data-expanded") === "true";
        button.setAttribute("data-expanded", expanded ? "false" : "true");
        list?.classList.toggle("expanded", !expanded);
        updateFoldToggleLabel(button);
      });
      updateFoldToggleLabel(button);
    });
    document.querySelectorAll("[data-lang-button]").forEach((button) => {
      button.addEventListener("click", () => setLang(button.getAttribute("data-lang-button")));
    });
    setLang(localStorage.getItem("agentEvolutionDashboardLang") || "zh");
  </script>
</body>
</html>`;

function metric(label, value) {
  return `<div class="metric"><div class="label">${i18n(label)}</div><div class="value">${esc(value)}</div></div>`;
}

function foldableRows(items, render, emptyKey, colspan, limit = 10) {
  if (!items.length) return `<tr><td colspan="${colspan}">${empty(emptyKey)}</td></tr>`;
  return items.map((item, index) => render(item, index >= limit ? "fold-extra" : "")).join("");
}

function foldableCards(items, render, emptyKey, limit = 10) {
  if (!items.length) return `<div class="list">${empty(emptyKey)}</div>`;
  return `<div data-fold-root><div class="list foldable">${items.map((item, index) => render(item, index >= limit ? "fold-extra" : "")).join("")}</div>${foldButton(items.length, limit)}</div>`;
}

function foldButton(total, limit = 10) {
  const hidden = Math.max(0, total - limit);
  if (!hidden) return "";
  return `<div class="fold-actions"><button type="button" class="icon-btn" data-fold-toggle data-expanded="false" data-hidden-count="${hidden}">${i18n("showMore")}</button></div>`;
}

function statTile(label) {
  return `<div class="stat-tile" data-stat="${esc(label)}"><div class="stat-label">${i18n(label)}</div><div class="stat-value" data-stat-value>0</div><div class="stat-note">${i18n("selectedTotal")}</div></div>`;
}

function dimensionToggle(label, checked) {
  return `<label class="check-pill"><input type="checkbox" data-dimension value="${esc(label)}"${checked ? " checked" : ""}> ${i18n(label)}</label>`;
}

function flowStep(number, title, desc) {
  return `<div class="flow-step"><div class="flow-kicker"><h3>${i18n(title)}</h3></div><p>${i18n(desc)}</p></div>`;
}

function bars(counts, order) {
  const max = Math.max(1, ...Object.values(counts));
  return `<div class="bars">${order.map((key) => {
    const value = counts[key] || 0;
    const width = Math.round((value / max) * 100);
    return `<div class="bar"><span>${labelFor(key)}</span><div class="track"><div class="fill" style="width:${width}%"></div></div><strong>${value}</strong></div>`;
  }).join("")}</div>`;
}

function queuePill(queue) {
  const color = {
    ready_to_promote: "green",
    needs_one_more_use: "blue",
    route_to_skill: "violet",
    requires_confirmation: "red",
    pending_review: "amber",
    archive: "",
  }[queue] || "";
  return `<span class="pill ${color}">${labelFor(queue)}</span>`;
}

function ruleCard(item, className = "") {
  return `<div class="item ${className}"><h3>${esc(item.title)}</h3><div>${esc(item.date)} · ${pill(item.scope, "blue")} ${pill(item.risk, "green")} ${pill(item.confidence, "")}</div><p>${esc(item.rule)}</p></div>`;
}

function ledgerCard(item, className = "") {
  return `<div class="item ${className}"><h3>${esc(item.title)}</h3><div>${esc(item.report)} · ${pillHtml(labelFor(item.kind), item.kind === "primary" ? "green" : item.kind === "manual" ? "blue" : "amber")}</div></div>`;
}

function candidateRow(item, className = "") {
  return `<tr class="${className}"><td>${queuePill(item.queue)}</td><td><strong>${esc(item.title)}</strong><small>${esc(item.observation || item.proposed)}</small><small>${esc(item.scope)} · ${labelFor(item.type)} · ${labelFor(item.risk)} · ${labelFor(item.confidence)}</small></td><td>${esc(item.destination)}</td><td>${labelFor(item.current)}<small>证据 ${esc(item.evidence)} · ${labelFor(item.status)}</small></td></tr>`;
}

function reportRow(item, className = "") {
  return `<tr class="${className}"><td>${esc(item.date)}</td><td>${pillHtml(labelFor(item.kind), item.kind === "primary" ? "green" : item.kind === "manual" ? "blue" : "amber")}</td><td>${esc(item.sessions)}</td><td>${esc(item.signals)}</td><td>${esc(item.effective)}</td><td>${esc(item.promoted)} ${i18n("promoted")} / ${esc(item.candidates)} ${i18n("candidates")}</td></tr>`;
}

function pill(text, color) {
  return `<span class="pill ${color || ""}">${esc(text)}</span>`;
}

function pillHtml(html, color) {
  return `<span class="pill ${color || ""}">${html}</span>`;
}

function labelFor(value) {
  const map = {
    ready_to_promote: "queueReady",
    needs_one_more_use: "queueOneMore",
    route_to_skill: "queueSkill",
    requires_confirmation: "queueConfirm",
    pending_review: "queuePending",
    archive: "queueArchive",
    primary: "reportPrimary",
    manual: "reportManual",
    duplicate_or_retry: "reportDuplicate",
    observed_once: "stateObserved",
    applied_once: "stateApplied",
    applied_twice: "stateAppliedTwice",
    reviewed: "stateReviewed",
    skill_rule: "typeSkillRule",
    workflow: "typeWorkflow",
    tool_gotcha: "typeToolGotcha",
    preference: "typePreference",
    correction: "typeCorrection",
    global: "typeGlobal",
    high: "riskHigh",
    medium: "riskMedium",
    low: "riskLow",
  };
  return map[value] ? i18n(map[value]) : esc(value);
}

function empty(text) {
  return `<div class="muted">${i18n(text)}</div>`;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, "utf8");
console.log(outPath);
