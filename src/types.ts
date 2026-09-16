/**
 * Domain types for FrameAgent Studio
 */

export type AppViewMode = "studio" | "review_portal" | "prd" | "wireframes" | "evaluation";

export type RiskLevel = "low" | "medium" | "high";

export interface TimelineClip {
  id: string;
  trackId: string;
  name: string;
  startSec: number;
  durationSec: number;
  sourceStartSec: number;
  type: "video" | "broll" | "subtitle" | "audio" | "sticker";
  color: string;
  text?: string;
  speaker?: string;
  confidence?: number;
  isCutPoint?: boolean;
  isAgentGenerated?: boolean;
  agentActionId?: string;
  volume?: number;
  speed?: number;
  parameters?: Record<string, unknown>;
}

export interface TimelineTrack {
  id: string;
  type: "video" | "broll" | "subtitle" | "audio" | "sticker";
  name: string;
  height: number;
  muted?: boolean;
  locked?: boolean;
  hidden?: boolean;
  clips: TimelineClip[];
}

export interface AgentAction {
  id: string;
  tool: string;
  targetTrack: "video" | "broll" | "subtitle" | "audio";
  title: string;
  description: string;
  timeRange: [number, number];
  parameters: Record<string, any>;
  reversible: boolean;
  status: "applied" | "rolled_back" | "accepted";
  appliedAt: string;
  riskLevel: RiskLevel;
}

export interface VerificationCheck {
  item: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface AgentThought {
  summary: string;
  riskLevel: RiskLevel;
  understand: string;
  plan: string[];
  actions: AgentAction[];
  verification: {
    passed: boolean;
    checks: VerificationCheck[];
  };
  candidateSuggestions: string[];
}

export interface HistoryTransaction {
  id: string;
  title: string;
  timestamp: string;
  actions: AgentAction[];
  previousTracks: TimelineTrack[];
  newTracks: TimelineTrack[];
  userIntervention: "direct_adopt" | "minor_edit" | "major_edit" | "rolled_back";
}

export interface ModelRouteItem {
  id: string;
  name: string;
  provider: "Self-developed (自研)" | "Google Veo" | "Runway" | "Kling (可灵)" | "OpenAI Whisper" | "ElevenLabs";
  capability: "理解与长程控制" | "视频生成" | "语音识别ASR" | "音效与配乐" | "画质超分";
  costPerMin: number;
  avgLatencySec: number;
  qualityScore: number; // 0-100
  isRecommended?: boolean;
  status: "active" | "standby" | "degraded";
}

export interface EvalMetric {
  category: "基础能力评测" | "任务级评测" | "用户采纳率评测";
  name: string;
  currentValue: number | string;
  targetValue: number | string;
  unit?: string;
  trend: "up" | "down" | "neutral";
  description: string;
  status: "healthy" | "warning" | "optimal";
}

/**
 * 目标受众与业务角色模式 (Persona Workspaces)
 * 深度对齐 Frame.io / 分秒帧业务场景
 */
export type UserPersona = "creator" | "studio" | "brand";

export interface ReviewComment {
  id: string;
  timecodeSec: number;
  author: {
    name: string;
    avatar: string;
    role: "director" | "editor" | "client" | "brand_manager";
  };
  text: string;
  markup?: {
    type: "pen" | "arrow" | "box" | "pin";
    color: string;
    coords: { x: number; y: number; width?: number; height?: number };
  };
  status: "todo" | "in_progress" | "resolved" | "approved";
  category: "cut" | "broll" | "audio" | "subtitle" | "color" | "brand_vi";
  autoFixable: boolean;
  agentActionDescription?: string;
  createdAt: string;
}

export interface VersionStackItem {
  id: string;
  version: string; // "v1.0" | "v1.1" | "v2.0" | "v2.1"
  label: string;
  createdAt: string;
  author: string;
  status: "draft" | "reviewing" | "approved";
  changesSummary: string;
  tracksSnapshot: TimelineTrack[];
}

export interface BrandKitConfig {
  brandName: string;
  logoUrl?: string;
  watermarkEnabled: boolean;
  watermarkText: string;
  watermarkPosition: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
  watermarkOpacity: number;
  brandColor: string;
  fontFamily: string;
  forbiddenWords: string[];
  safeZoneRule: "douyin_tiktok" | "wechat_video" | "bilibili_youtube";
}

export interface ShareReviewConfig {
  shareUrl: string;
  title: string;
  hasPassword: boolean;
  password?: string;
  allowDownload: boolean;
  allowComments: boolean;
  watermarkEnabled: boolean;
  expiresAt: string;
}

