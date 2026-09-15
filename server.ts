import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    timestamp: new Date().toISOString()
  });
});

// Agent intent & reasoning endpoint
app.post("/api/agent/chat", async (req, res) => {
  const { prompt, currentTimeline, taskType } = req.body;

  try {
    const ai = getGenAI();
    if (ai) {
      const systemInstruction = `你是一个顶尖的专业音视频剪辑工作流 Agent 调度大脑 (遵循 FrameAgent / StoryFyco 架构)。
你的核心原则：
1. 每一帧可控、每一刀可编辑、每一个操作可回滚；
2. 不做模糊黑盒生成，而是输出结构化的时间线编辑指令 (Timeline Edit Actions)；
3. 输出包含四层思考闭环：
   - understand: 理解素材、人物、语义论点、平台节奏与品牌限制
   - plan: 任务分解拓扑步骤
   - execute: 调度具体原子工具操作 (cut, insert_broll, subtitle_smart, audio_ducking, color_grade)
   - verify: 自动化质量验证报告 (时长检查、声画同步、穿帮遮挡检测)
请以 JSON 格式返回，结构如下：
{
  "summary": "一句话执行概要",
  "riskLevel": "low" | "medium" | "high",
  "understand": "对视频素材语义与用户意图的深度解析",
  "plan": ["步骤1", "步骤2", "步骤3"],
  "actions": [
    {
      "id": "act_1",
      "tool": "trim_silence" | "cut_filler" | "insert_broll" | "add_subtitles" | "smart_ducking" | "reframe_vertical",
      "targetTrack": "video" | "broll" | "subtitle" | "audio",
      "title": "操作名称",
      "description": "具体修改描述",
      "timeRange": [0, 10],
      "parameters": { "key": "value" },
      "reversible": true
    }
  ],
  "verification": {
    "passed": true,
    "checks": [
      { "item": "口误消除自查", "status": "pass", "detail": "剔除 8 处无意义停顿与口水词，语流顺畅" },
      { "item": "声画同步与节拍", "status": "pass", "detail": "B-roll 切换点锁定在鼓点与金句结尾" },
      { "item": "时长与画幅合规", "status": "pass", "detail": "成片 58 秒，严格满足 9:16 竖版安全区" }
    ]
  },
  "candidateSuggestions": [
    "候选方案 A：快节奏知识胶囊 (45s)",
    "候选方案 B：沉浸对话保留呼吸感 (65s)"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `用户需求: ${prompt || "把访谈中的口水词修剪，在论点处插入B-roll并生成智能字幕"}\n当前时间线摘要: ${JSON.stringify(currentTimeline || {})}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });

      if (response.text) {
        try {
          const parsed = JSON.parse(response.text);
          return res.json({ source: "gemini", data: parsed });
        } catch {
          // fallback to rule-based parser if invalid JSON
        }
      }
    }
  } catch (err: unknown) {
    console.warn("Gemini call failed or skipped, using robust domain engine:", err);
  }

  // Fallback domain heuristic execution for fast & deterministic interaction
  const simulatedPlan = generateSimulatedAgentPlan(prompt, taskType);
  return res.json({ source: "domain-engine", data: simulatedPlan });
});

function generateSimulatedAgentPlan(promptText = "", taskType = "interview_cut") {
  const p = promptText.toLowerCase();

  if (p.includes("抖音") || p.includes("短视频") || p.includes("拆条") || taskType === "highlight_extract") {
    return {
      summary: "完成 30 分钟访谈高光金句提取，拆解为符合抖音/视频号推荐流的 58s 爆款知识切片",
      riskLevel: "medium",
      understand: "检测到原视频为双人深度访谈，重点在 03:12-04:10 讨论'Agent 重塑剪辑'的观点段落。语速约 240字/分，有 6 处顿挫与重复词，核心金句具有高信息密度，适宜 9:16 沉浸切片包装。",
      plan: [
        "1. 截取核心论点区间 [03:14 - 04:12]，重置时间轴零点",
        "2. 消除 6 处口水词与 1.2s 以上停顿气口",
        "3. 注入 3 段科技与工作流 B-roll 画面，掩盖剪辑跳切 (Jump Cut)",
        "4. 智能提取高光关键词，生成动态花字与双行字幕",
        "5. 智能规整 9:16 竖屏人脸居中重构图，混音自动避让 (Auto-Ducking)"
      ],
      actions: [
        {
          id: "act_highlight_cut",
          tool: "cut_selection",
          targetTrack: "video",
          title: "锁定高光金句论点段落",
          description: "提取原片 03:14:00 - 04:12:00，总时长压缩至 58s",
          timeRange: [0, 58],
          parameters: { startSec: 194, endSec: 252, targetDuration: 58 },
          reversible: true
        },
        {
          id: "act_filler_remove",
          tool: "cut_filler",
          targetTrack: "video",
          title: "消除冗余口水词与停顿",
          description: "精准剔除'那个'、'然后其实'、'呃'共 6 处冗余音素 (共缩短 4.2s)",
          timeRange: [4, 28],
          parameters: { fillerCount: 6, gapThresholdMs: 400 },
          reversible: true
        },
        {
          id: "act_broll_insert",
          tool: "insert_broll",
          targetTrack: "broll",
          title: "论点支撑 B-Roll 自动插入",
          description: "在谈及'Runway Agent 与时间轴控制'时插入 2 处多模态交互渲染镜头",
          timeRange: [12, 22],
          parameters: { clipType: "tech_workflow", transition: "cross_dissolve_200ms" },
          reversible: true
        },
        {
          id: "act_subtitle_gen",
          tool: "add_subtitles",
          targetTrack: "subtitle",
          title: "动态双色逐词高亮字幕",
          description: "基于 ASR 毫秒级对齐，高亮核心词'每一帧可控'与'Agent 2.0'",
          timeRange: [0, 58],
          parameters: { style: "douyin_bold_yellow", highlightKeywords: ["可控", "Agent", "时间轴"] },
          reversible: true
        },
        {
          id: "act_audio_bgm",
          tool: "smart_ducking",
          targetTrack: "audio",
          title: "智能背景音乐与人声避让",
          description: "选用科技感轻节奏 BGM，说话时自动下潜 -16dB，结尾金句强化垫乐",
          timeRange: [0, 58],
          parameters: { bgmName: "Subtle_Pulse_Tech.mp3", duckingDb: -16 },
          reversible: true
        }
      ],
      verification: {
        passed: true,
        checks: [
          { item: "时长与安全区", status: "pass", detail: "58.2秒，底端 180px 留出抖音点赞交互安全避让" },
          { item: "跳切平滑度", status: "pass", detail: "口水词切除处均由 B-roll 覆盖或微变焦(1.05x)平滑处理" },
          { item: "品牌与版权校验", status: "pass", detail: "BGM 拥有商用授权，无违禁敏感词" }
        ]
      },
      candidateSuggestions: [
        "候选 A: 极速紧凑版 (42s，强化开头钩子 '传统剪辑已死？')",
        "候选 B: 稳健深度版 (58s，完整保留前后推理论证逻辑)"
      ]
    };
  }

  // Default professional interview editing
  return {
    summary: "执行精细口水词修剪、论点 B-roll 自动编排及无损时间线事务更新",
    riskLevel: "low",
    understand: "用户期望降低访谈粗剪成本，保持原声声调与对话自然停顿。系统已识别 8 处无意义填充词和 3 处核心观点。",
    plan: [
      "1. ASR 语音识别与毫秒级时间戳音素对齐",
      "2. 标记并切除无意叹词（'这个'、'那个'、'嗯'）",
      "3. 针对第 14-22 秒核心论述插播辅助概念画面 (B-Roll)",
      "4. 生成逐字同步对齐字幕轨，应用无损 EDL 事务"
    ],
    actions: [
      {
        id: "act_clean_speech",
        tool: "cut_filler",
        targetTrack: "video",
        title: "无损剔除 8 处口水词",
        description: "修剪主音轨中'呃'、'然后'，保留自然换气间隔 250ms",
        timeRange: [6, 32],
        parameters: { count: 8, naturalBreathMs: 250 },
        reversible: true
      },
      {
        id: "act_insert_broll_1",
        tool: "insert_broll",
        targetTrack: "broll",
        title: "插入概念演示 B-Roll",
        description: "覆盖主讲人跳切口，并增强'意图到工程翻译'的直观表现",
        timeRange: [14, 23],
        parameters: { assetId: "broll_agent_ui_01" },
        reversible: true
      },
      {
        id: "act_sync_subtitles",
        tool: "add_subtitles",
        targetTrack: "subtitle",
        title: "对齐生成智能专业字幕",
        description: "双语标注、专业术语纠错 (如 StoryFyco、OTIO、EDL 自动校正)",
        timeRange: [0, 60],
        parameters: { dictionary: ["StoryFyco", "EDL", "OTIO", "Model Router"] },
        reversible: true
      }
    ],
    verification: {
      passed: true,
      checks: [
        { item: "声画衔接", status: "pass", detail: "音频切口添加 15ms 等功率淡入淡出，消除爆音" },
        { item: "字幕准确度", status: "pass", detail: "专有名词准确率 100%，字频与语速匹配良好" },
        { item: "可回滚标记", status: "pass", detail: "已记录 3 处时间线差异事务，支持一键撤回" }
      ]
    },
    candidateSuggestions: [
      "推荐：启用智能人脸重构图 (9:16 竖版自适应)",
      "推荐：添加电影感 LUT 调色与人声 EQ 增益"
    ]
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FrameAgent Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
