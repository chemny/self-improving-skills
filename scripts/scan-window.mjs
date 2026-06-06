#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

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
const end = args.has("end") ? new Date(args.get("end")) : new Date();
const hours = Number(args.get("hours") || 6);
const start = args.has("start") ? new Date(args.get("start")) : new Date(end.getTime() - hours * 60 * 60 * 1000);

if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
  console.error("Usage: scan-window.mjs [--codex-home PATH] [--hours 6] [--start ISO] [--end ISO]");
  process.exit(2);
}

const roots = [
  path.join(codexHome, "sessions"),
  path.join(codexHome, "archived_sessions"),
].filter((root) => fs.existsSync(root));

function findJsonl(root) {
  try {
    return execFileSync("find", [root, "-type", "f", "-name", "*.jsonl"], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
  } catch {
    return [];
  }
}

function textOf(message) {
  return (message.content || [])
    .map((part) => part.text || part.input_text || "")
    .join("\n")
    .trim();
}

function isLowSignalUserText(text) {
  const value = text.trim();
  if (!value) return true;
  if (value.startsWith("<environment_context>")) return true;
  if (value.startsWith("<codex_internal_context")) return true;
  if (value.startsWith("<turn_aborted>")) return true;
  if (value.startsWith("<codex_delegation>")) return true;
  if (value.startsWith("Automation:")) return true;
  if (value.startsWith("# AGENTS.md instructions")) return true;
  return /^(可以|好的|好|嗯|暂停|继续|请修改。?|确认执行)$/i.test(value);
}

function redact(text) {
  return text
    .replace(/\b(tvly|sk|ghp|github_pat|xox[baprs]|AKIA|AIza)[A-Za-z0-9_\-]{8,}\b/g, "[REDACTED_SECRET]")
    .replace(/\b[A-Za-z0-9_\-]{32,}\b/g, "[REDACTED_TOKEN]")
    .replace(/\s+/g, " ")
    .trim();
}

function signalTypes(text) {
  const out = [];
  const checks = [
    ["preference", /(我希望|我觉得|以后|不要|不用|默认|优先|风格|习惯|更喜欢|不喜欢)/],
    ["correction", /(不对|错了|不是|应该|怎么又|你这个|有问题|跑不通|不合理|撤回|删除|修复|优化)/],
    ["workflow", /(流程|步骤|机制|工作流|管线|先.*再|跑通|测试|验证|报告|总结)/],
    ["skill_rule", /(skill|skills|SKILL|MCP|cmm-|发布|搜索|图卡|视频|TTS|小红书|抖音)/i],
    ["tool_gotcha", /(API key|密钥|报错|权限|路径|线程|automation|Codex|Claude|OpenClaw|GitHub)/i],
    ["safety", /(删除|覆盖|同步|发布|推送|凭证|密钥|封号|安全|权限)/],
  ];
  for (const [name, re] of checks) {
    if (re.test(text)) out.push(name);
  }
  return out;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function classifyProjectText(text) {
  const tags = [];
  const checks = [
    ["skill_building", /(skill|skills|SKILL|插件|能力|安装|发布|README|GitHub)/i],
    ["content_media", /(视频|音频|旁白|MP3|PPT|课件|图卡|小红书|抖音|NotebookLM|播客|封面)/i],
    ["workflow_design", /(流程|工作流|机制|步骤|方案|链路|Mermaid|架构|规划|主干|跑通)/i],
    ["debug_or_fix", /(报错|失败|修复|测试|验证|检查|核实|不对|问题|跑不通)/i],
    ["automation", /(automation|自动化|定时|扫描|report|报告|cron)/i],
    ["research", /(搜索|查一下|研究|资料|开源|仓库|原理|对比|评测)/i],
    ["desktop_operation", /(电脑|浏览器|点击|窗口|游戏|红色|返回|computer-use)/i],
  ];
  for (const [tag, re] of checks) {
    if (re.test(text)) tags.push(tag);
  }
  return tags;
}

function inferTitle(samples, cwd) {
  const text = samples.join(" ");
  const titleChecks = [
    ["NotebookLM courseware workflow", /(NotebookLM|课件|PPT|播客)/i],
    ["Agent Evolution tuning", /(Agent Evolution|agent-evolution|进化|沉淀|长期记忆)/i],
    ["Skill publishing or GitHub workflow", /(GitHub|README|发布|同步|仓库)/i],
    ["Skill design or installation", /(skill|skills|SKILL|安装|创建)/i],
    ["Media extraction or production", /(视频|音频|MP3|旁白|Remotion|TTS)/i],
    ["Desktop/browser operation", /(computer-use|电脑|浏览器|点击|窗口|游戏)/i],
    ["Research and comparison", /(搜索|查一下|开源|对比|评测|原理)/i],
  ];
  for (const [title, re] of titleChecks) {
    if (re.test(text)) return title;
  }
  const cwdName = cwd ? path.basename(cwd) : "unknown";
  return `Session work in ${cwdName || "unknown"}`;
}

function extractDecisions(samples) {
  const out = [];
  const patterns = [
    /(就按[^。！？\n]{2,80})/,
    /(先[^。！？\n]{2,80})/,
    /(不要[^。！？\n]{2,80})/,
    /(默认[^。！？\n]{2,80})/,
    /(核心[^。！？\n]{2,80})/,
  ];
  for (const sample of samples) {
    for (const re of patterns) {
      const match = sample.match(re);
      if (match) out.push(match[1]);
    }
  }
  return unique(out).slice(0, 5);
}

function buildProjectLedger(sessions, candidateSignals) {
  const signalsBySession = new Map();
  for (const signal of candidateSignals) {
    const key = signal.session_id || signal.cwd || "unknown";
    if (!signalsBySession.has(key)) signalsBySession.set(key, []);
    signalsBySession.get(key).push(signal);
  }

  return sessions
    .filter((session) => session.meaningful_user_messages > 0)
    .map((session) => {
      const key = session.id || session.cwd || "unknown";
      const signals = signalsBySession.get(key) || [];
      const allText = [...(session.samples || []), ...signals.map((s) => s.text)].join(" ");
      const activityTypes = unique([
        ...classifyProjectText(allText),
        ...signals.flatMap((s) => s.signal_types || []),
      ]).slice(0, 10);
      const likelyOutputs = unique([
        /README|GitHub|仓库|发布/i.test(allText) ? "repo_or_readme_update" : "",
        /skill|skills|SKILL/i.test(allText) ? "skill_change_or_design" : "",
        /PPT|课件|NotebookLM|播客/i.test(allText) ? "courseware_or_presentation_workflow" : "",
        /视频|音频|MP3|旁白/i.test(allText) ? "media_artifact" : "",
        /流程|机制|工作流|Mermaid|方案/i.test(allText) ? "workflow_spec_or_diagram" : "",
        /测试|验证|核实|检查/i.test(allText) ? "verification_result" : "",
      ]).slice(0, 8);

      return {
        session_id: session.id,
        cwd: session.cwd,
        title: inferTitle(session.samples || [], session.cwd),
        first_event: session.first_event,
        last_event: session.last_event,
        activity_types: activityTypes,
        evidence_counts: {
          events: session.events,
          user_messages: session.user_messages,
          meaningful_user_messages: session.meaningful_user_messages,
          assistant_messages: session.assistant_messages,
          tool_events: session.tool_events,
          candidate_signals: signals.length,
        },
        user_goal_sample: (session.samples || [])[0] || "",
        decisions_or_preferences: extractDecisions(session.samples || []),
        likely_outputs: likelyOutputs,
        reusable_learning_hints: unique(signals
          .filter((signal) => (signal.signal_types || []).some((type) => ["preference", "correction", "workflow", "skill_rule"].includes(type)))
          .map((signal) => signal.text.slice(0, 180)))
          .slice(0, 6),
        memory_review_status: signals.length > 0
          ? "review_for_project_lesson_or_candidate"
          : "inventory_only",
      };
    });
}

const files = roots.flatMap(findJsonl);
const sessions = [];
const candidateSignals = [];

for (const file of files) {
  let meta = null;
  let first = Infinity;
  let last = -Infinity;
  let events = 0;
  let userMessages = 0;
  let meaningfulUserMessages = 0;
  let assistantMessages = 0;
  let toolEvents = 0;
  const samples = [];

  const lines = fs.readFileSync(file, "utf8").split(/\n/).filter(Boolean);
  for (const line of lines) {
    let item;
    try {
      item = JSON.parse(line);
    } catch {
      continue;
    }
    if (item.type === "session_meta") meta = item.payload || null;
    const ts = Date.parse(item.timestamp);
    if (Number.isNaN(ts) || ts < start.getTime() || ts > end.getTime()) continue;

    events += 1;
    first = Math.min(first, ts);
    last = Math.max(last, ts);

    const payload = item.payload || {};
    if (item.type === "response_item" && payload.type === "message") {
      if (payload.role === "user") {
        userMessages += 1;
        const raw = textOf(payload);
        if (!isLowSignalUserText(raw)) {
          meaningfulUserMessages += 1;
          const safe = redact(raw);
          const types = signalTypes(safe);
          if (types.length > 0) {
            candidateSignals.push({
              session_id: meta?.id || null,
              cwd: meta?.cwd || null,
              timestamp: new Date(ts).toISOString(),
              signal_types: types,
              text: safe.slice(0, 280),
            });
          }
          if (samples.length < 8) samples.push(safe.slice(0, 280));
        }
      } else if (payload.role === "assistant") {
        assistantMessages += 1;
      }
    }

    if (item.type === "response_item" && (
      payload.type === "function_call" ||
      payload.type === "function_call_output" ||
      payload.type === "tool_call"
    )) {
      toolEvents += 1;
    }
  }

  if (events > 0) {
    sessions.push({
      id: meta?.id || null,
      cwd: meta?.cwd || null,
      file,
      first_event: new Date(first).toISOString(),
      last_event: new Date(last).toISOString(),
      events,
      user_messages: userMessages,
      meaningful_user_messages: meaningfulUserMessages,
      assistant_messages: assistantMessages,
      tool_events: toolEvents,
      samples,
    });
  }
}

sessions.sort((a, b) => a.first_event.localeCompare(b.first_event));

const totals = sessions.reduce((acc, session) => {
  acc.events += session.events;
  acc.user_messages += session.user_messages;
  acc.meaningful_user_messages += session.meaningful_user_messages;
  acc.assistant_messages += session.assistant_messages;
  acc.tool_events += session.tool_events;
  return acc;
}, { events: 0, user_messages: 0, meaningful_user_messages: 0, assistant_messages: 0, tool_events: 0 });

const output = {
  window: {
    start: start.toISOString(),
    end: end.toISOString(),
    hours: (end.getTime() - start.getTime()) / 3_600_000,
  },
  roots,
  counts: {
    sessions_with_events: sessions.length,
    sessions_with_meaningful_user_messages: sessions.filter((s) => s.meaningful_user_messages > 0).length,
    candidate_signals_detected: candidateSignals.length,
    ...totals,
  },
  sessions,
  candidate_signals: candidateSignals,
  project_ledger: buildProjectLedger(sessions, candidateSignals),
};

console.log(JSON.stringify(output, null, 2));
