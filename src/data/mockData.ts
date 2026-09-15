import { TimelineTrack, ModelRouteItem, EvalMetric } from "../types";

export const INITIAL_TRACKS: TimelineTrack[] = [
  {
    id: "track_video_main",
    type: "video",
    name: "主视频轨 (A-Roll 4K)",
    height: 64,
    clips: [
      {
        id: "clip_v1",
        trackId: "track_video_main",
        name: "访谈序言_人物全景",
        startSec: 0,
        durationSec: 12,
        sourceStartSec: 0,
        type: "video",
        color: "bg-blue-600/30 border-blue-500",
        speaker: "主持人 (林晓)",
        confidence: 0.98
      },
      {
        id: "clip_v2",
        trackId: "track_video_main",
        name: "嘉宾论点: 剪辑三阶段演化",
        startSec: 12,
        durationSec: 24,
        sourceStartSec: 12,
        type: "video",
        color: "bg-blue-600/30 border-blue-500",
        speaker: "嘉宾 (陈博士)",
        confidence: 0.95
      },
      {
        id: "clip_v3",
        trackId: "track_video_main",
        name: "口水词气口段落 (待清洗)",
        startSec: 36,
        durationSec: 8,
        sourceStartSec: 36,
        type: "video",
        color: "bg-amber-600/30 border-amber-500",
        speaker: "嘉宾 (陈博士)",
        confidence: 0.88,
        text: "呃...就是说...然后其实那个..."
      },
      {
        id: "clip_v4",
        trackId: "track_video_main",
        name: "核心总结: 可控可编辑可回滚",
        startSec: 44,
        durationSec: 16,
        sourceStartSec: 44,
        type: "video",
        color: "bg-blue-600/30 border-blue-500",
        speaker: "嘉宾 (陈博士)",
        confidence: 0.99
      }
    ]
  },
  {
    id: "track_broll",
    type: "broll",
    name: "B-Roll 辅助画轨 (智能覆盖)",
    height: 52,
    clips: [
      {
        id: "clip_b1",
        trackId: "track_broll",
        name: "B-Roll: AI 工作流界面演示",
        startSec: 18,
        durationSec: 8,
        sourceStartSec: 0,
        type: "broll",
        color: "bg-purple-600/30 border-purple-500"
      }
    ]
  },
  {
    id: "track_subtitle",
    type: "subtitle",
    name: "智能字幕轨 (ASR 毫秒级对齐)",
    height: 44,
    clips: [
      {
        id: "clip_sub1",
        trackId: "track_subtitle",
        name: "欢迎来到本期深度访谈",
        startSec: 0,
        durationSec: 5,
        sourceStartSec: 0,
        type: "subtitle",
        color: "bg-emerald-600/30 border-emerald-500",
        text: "欢迎大家，今天我们聊聊 Agent 怎么重塑剪辑。"
      },
      {
        id: "clip_sub2",
        trackId: "track_subtitle",
        name: "剪辑演化分三阶段",
        startSec: 12,
        durationSec: 9,
        sourceStartSec: 12,
        type: "subtitle",
        color: "bg-emerald-600/30 border-emerald-500",
        text: "阶段一是效率工具，阶段二是单点AI，阶段三是Agent原生。"
      },
      {
        id: "clip_sub3",
        trackId: "track_subtitle",
        name: "核心主张金句",
        startSec: 44,
        durationSec: 10,
        sourceStartSec: 44,
        type: "subtitle",
        color: "bg-emerald-600/30 border-emerald-500",
        text: "每一帧可控、每一刀可编辑、每一个操作可回滚！"
      }
    ]
  },
  {
    id: "track_audio_bgm",
    type: "audio",
    name: "配乐与音效 (智能降鸭 Auto-Ducking)",
    height: 48,
    clips: [
      {
        id: "clip_bgm1",
        trackId: "track_audio_bgm",
        name: "BGM: Ambient_Tech_Pulse.wav",
        startSec: 0,
        durationSec: 60,
        sourceStartSec: 0,
        type: "audio",
        color: "bg-teal-600/30 border-teal-500",
        volume: 0.3
      }
    ]
  }
];

export const PRESET_SCENARIOS = [
  {
    id: "preset_interview_split",
    title: "30分钟访谈拆条为抖音爆款",
    desc: "高光论点识别 → 自动剪切 → 9:16竖屏居中 → 逐字双色花字 → 智能配乐",
    taskType: "highlight_extract",
    riskLevel: "medium" as const,
    prompt: "把 30 分钟访谈剪成 1 条 58 秒抖音爆款知识短视频，提取核心金句论点，剔除无意口水词并插入概念 B-roll，输出 9:16 竖版并带自动配乐。"
  },
  {
    id: "preset_filler_broll",
    title: "无损消除口水词 + 论点插入B-roll",
    desc: "ASR 毫秒级音素定位 → 自动剔除停顿与'那个/呃' → 跳切处智能覆盖概念素材",
    taskType: "interview_cut",
    riskLevel: "low" as const,
    prompt: "把访谈里的口水词和叹气停顿无损剪掉，在核心论点处自动插入科技工作流 B-roll 画面，保持每一刀可回滚。"
  },
  {
    id: "preset_ecommerce_ad",
    title: "商品资料一键生成高转化广告",
    desc: "产品图解/卖点提炼 → 黄金3秒钩子脚本 → 动效卡点 → 商用授权配音",
    taskType: "ecommerce_ad",
    riskLevel: "medium" as const,
    prompt: "根据输入的产品参数提炼卖点，自动编排前 3 秒钩子画面，匹配快节奏转场与商用授权卡点配乐。"
  },
  {
    id: "preset_brand_compliance",
    title: "全片品牌合规与终审质检",
    desc: "安全区扫描 → 敏感词/违禁词排查 → 字幕声画节拍校正 → 输出质检报告",
    taskType: "brand_check",
    riskLevel: "high" as const,
    prompt: "进行全片综合自查：核对字音同步时间戳精度、检验 9:16 抖音安全区遮挡、排查商标侵权风险并生成终审报告。"
  }
];

export const MODEL_ROUTER_DATA: ModelRouteItem[] = [
  {
    id: "mod_self_core",
    name: "StoryFyco Core (自研理解与时间线控制)",
    provider: "Self-developed (自研)",
    capability: "理解与长程控制",
    costPerMin: 0.008,
    avgLatencySec: 0.42,
    qualityScore: 96,
    isRecommended: true,
    status: "active"
  },
  {
    id: "mod_whisper_large",
    name: "Whisper-v3 + 专有词库对齐引擎",
    provider: "OpenAI Whisper",
    capability: "语音识别ASR",
    costPerMin: 0.004,
    avgLatencySec: 0.65,
    qualityScore: 98,
    isRecommended: true,
    status: "active"
  },
  {
    id: "mod_veo3",
    name: "Google Veo 3.1",
    provider: "Google Veo",
    capability: "视频生成",
    costPerMin: 0.12,
    avgLatencySec: 4.8,
    qualityScore: 94,
    status: "active"
  },
  {
    id: "mod_runway_gen3",
    name: "Runway Gen-3 Alpha Turbo",
    provider: "Runway",
    capability: "视频生成",
    costPerMin: 0.15,
    avgLatencySec: 5.2,
    qualityScore: 92,
    status: "active"
  },
  {
    id: "mod_kling",
    name: "Kling 1.5 Pro (可灵)",
    provider: "Kling (可灵)",
    capability: "视频生成",
    costPerMin: 0.09,
    avgLatencySec: 3.9,
    qualityScore: 93,
    status: "active"
  },
  {
    id: "mod_eleven_labs",
    name: "ElevenLabs Voice Multilingual v2",
    provider: "ElevenLabs",
    capability: "音效与配乐",
    costPerMin: 0.02,
    avgLatencySec: 0.85,
    qualityScore: 97,
    status: "active"
  }
];

export const EVALUATION_METRICS: EvalMetric[] = [
  // Tier 1
  {
    category: "基础能力评测",
    name: "ASR 语音转写字准率 (CER/WER)",
    currentValue: "98.4%",
    targetValue: "≥ 98.0%",
    trend: "up",
    description: "专有名词(如 StoryFyco、OTIO、LUT)自动词库校准后准确度",
    status: "optimal"
  },
  {
    category: "基础能力评测",
    name: "时间戳定位对齐精度 (Timestamp Tolerance)",
    currentValue: "±18 ms",
    targetValue: "< 30 ms",
    unit: "ms",
    trend: "up",
    description: "剪辑 Agent 的核心命门：错一秒整段废。基于音素边界检测",
    status: "optimal"
  },
  {
    category: "基础能力评测",
    name: "长视频镜头切分与语义分段准确率",
    currentValue: "94.2%",
    targetValue: "≥ 92.0%",
    trend: "up",
    description: "30分钟以上多机位及说话人语义焦点识别成功率",
    status: "optimal"
  },
  // Tier 2
  {
    category: "任务级评测",
    name: "端到端任务执行成功率 (Task Success Rate)",
    currentValue: "92.8%",
    targetValue: "≥ 90.0%",
    trend: "up",
    description: "完整执行口水词清除、B-roll匹配、多版本导出的无错跑通率",
    status: "optimal"
  },
  {
    category: "任务级评测",
    name: "工具调用与参数契合度 (Tool Invocation Accuracy)",
    currentValue: "96.5%",
    targetValue: "≥ 95.0%",
    trend: "up",
    description: "调度 cut, trim, insert_broll, ducking 参数的结构化无歧义调用率",
    status: "optimal"
  },
  {
    category: "任务级评测",
    name: "人工接管率 (Intervention Rate)",
    currentValue: "11.4%",
    targetValue: "< 15.0%",
    trend: "down",
    description: "生成后用户发生重大人工覆写或手动介入的比例 (越低越好)",
    status: "optimal"
  },
  // Tier 3
  {
    category: "用户采纳率评测",
    name: "Agent 方案整体采纳率 (Adoption Rate)",
    currentValue: "81.6%",
    targetValue: "≥ 75.0%",
    trend: "up",
    description: "直接采纳(46.2%) + 轻微调整(35.4%)，反映 Agent 能力契合度",
    status: "optimal"
  },
  {
    category: "用户采纳率评测",
    name: "平均修改深度 (Modification Depth)",
    currentValue: "1.4 刀/分",
    targetValue: "< 2.5 刀/分",
    trend: "down",
    description: "用户采纳后手动二次调整的时长与关键帧数量，反映粒度契合度",
    status: "optimal"
  },
  {
    category: "用户采纳率评测",
    name: "操作回滚率 (Rollback Rate)",
    currentValue: "3.8%",
    targetValue: "< 5.0%",
    trend: "down",
    description: "用户执行 Undo / Rollback 撤回 Agent 决策的比率，反映稳定性",
    status: "optimal"
  }
];
