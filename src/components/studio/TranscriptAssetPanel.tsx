import React, { useState } from "react";
import { 
  FileText, 
  Film, 
  Sliders, 
  Scissors, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  Plus, 
  Volume2, 
  ExternalLink,
  ChevronDown,
  Layers,
  MessageSquare,
  Shield,
  Palette,
  AlertTriangle,
  Send,
  UserCheck,
  Check,
  Smartphone,
  Eye,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { 
  TimelineClip, 
  ReviewComment, 
  BrandKitConfig, 
  UserPersona 
} from "../../types";

interface TranscriptAssetPanelProps {
  currentTimeSec: number;
  onSeek: (timeSec: number) => void;
  selectedClip: TimelineClip | null;
  onRollbackAction?: (actionId: string) => void;
  // Frame.io / 分秒帧 协同审阅与品牌合规融合能力
  reviewComments?: ReviewComment[];
  activeCommentId?: string | null;
  onSelectComment?: (id: string) => void;
  onStatusChangeComment?: (id: string, newStatus: ReviewComment["status"]) => void;
  onApplyCommentAgentAction?: (comment: ReviewComment) => void;
  brandKit?: BrandKitConfig;
  onUpdateBrandKit?: (updated: BrandKitConfig) => void;
  activePersona?: UserPersona;
  onChangePersona?: (persona: UserPersona) => void;
  onOpenShareModal?: () => void;
}

export const TranscriptAssetPanel: React.FC<TranscriptAssetPanelProps> = ({
  currentTimeSec,
  onSeek,
  selectedClip,
  onRollbackAction,
  reviewComments = [],
  activeCommentId = null,
  onSelectComment,
  onStatusChangeComment,
  onApplyCommentAgentAction,
  brandKit = {
    brandName: "StoryFyco Studio",
    watermarkEnabled: true,
    watermarkText: "FRAMEAGENT · 内部审片禁止外传 · CC-BY-NC",
    watermarkPosition: "top-right",
    watermarkOpacity: 45,
    brandColor: "#6366F1",
    fontFamily: "Inter / 思源黑体",
    forbiddenWords: ["最强", "唯一", "遥遥领先", "绝对", "保本"],
    safeZoneRule: "douyin_tiktok"
  },
  onUpdateBrandKit,
  activePersona = "studio",
  onChangePersona,
  onOpenShareModal,
}) => {
  const [activeTab, setActiveTab] = useState<"transcript" | "comments" | "brand" | "assets" | "inspector">("comments");
  const [searchQuery, setSearchQuery] = useState("");
  const [commentFilterStatus, setCommentFilterStatus] = useState<"all" | "todo" | "resolved">("all");
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Local BrandKit editing state
  const [localBrandKit, setLocalBrandKit] = useState<BrandKitConfig>(brandKit);
  const [forbiddenScanStatus, setForbiddenScanStatus] = useState<"idle" | "scanned">("scanned");

  // Mock text-based editing transcript data
  const transcriptSegments = [
    {
      id: "seg_1",
      speaker: "主持人",
      speakerRole: "host",
      startSec: 0,
      endSec: 12.0,
      text: "今天非常荣幸邀请到 StoryFyco 联合创始人，深度探讨 AI 与 Agent 是如何重塑整个音视频剪辑生态的。",
      isHighlight: false,
      hasFiller: false,
    },
    {
      id: "seg_2",
      speaker: "陈博士",
      speakerRole: "guest",
      startSec: 12.0,
      endSec: 24.5,
      text: "我把剪辑工具演化分为三个阶段：阶段一是效率工具，Pr和达芬奇代表专业控制，剪映代表消费级降维；阶段二是 AI 辅助单点，图文成片与智能字幕。",
      isHighlight: true,
      highlightTag: "核心金句 · 行业演化三阶段",
      hasFiller: false,
    },
    {
      id: "seg_3",
      speaker: "陈博士",
      speakerRole: "guest",
      startSec: 24.5,
      endSec: 32.5,
      text: "阶段三则是 Agent 原生工作流。那个...其实...呃，通用大模型做一键成片容易，但专业后期创作者要的不是差不多。",
      isHighlight: false,
      hasFiller: true,
      fillerDetails: "已识别并无损切除 4 处口水词气口 (耗时 4.2s)",
    },
    {
      id: "seg_4",
      speaker: "陈博士",
      speakerRole: "guest",
      startSec: 32.5,
      endSec: 48.0,
      text: "专业创作者要的是每一帧可控、每一刀可编辑、每一个操作可回滚！把意图到工程文件的翻译成本降到接近零。",
      isHighlight: true,
      highlightTag: "核心主张 · 每一刀可回滚",
      hasFiller: false,
      brollSuggestion: "已插入 B-Roll 科技工作流动效覆盖跳切",
    },
    {
      id: "seg_5",
      speaker: "陈博士",
      speakerRole: "guest",
      startSec: 48.0,
      endSec: 60.0,
      text: "我们输出的是可继续在达芬奇和剪映里精调的多轨工程文件，而不是无法二次修改的死视频。",
      isHighlight: true,
      highlightTag: "交付标准 · OTIO/FCPXML",
      hasFiller: false,
    },
  ];

  // Mock Asset & B-Roll Bin data
  const mediaAssets = [
    {
      id: "asset_1",
      name: "访谈原片_机位A_4K.mp4",
      type: "video",
      resolution: "3840x2160",
      fps: "25 fps",
      duration: "01:00:00",
      tag: "主素材",
      color: "border-blue-500/40 bg-blue-950/20 text-blue-300",
    },
    {
      id: "asset_2",
      name: "B-Roll: AI工作流与时间轴控制演示.mov",
      type: "broll",
      resolution: "1920x1080",
      fps: "60 fps",
      duration: "00:08:00",
      tag: "Agent 生成 (Runway)",
      color: "border-purple-500/40 bg-purple-950/20 text-purple-300",
    },
    {
      id: "asset_3",
      name: "B-Roll: 达芬奇与Pr多轨工程时间线.mp4",
      type: "broll",
      resolution: "3840x2160",
      fps: "30 fps",
      duration: "00:12:30",
      tag: "本地素材库",
      color: "border-purple-500/40 bg-purple-950/20 text-purple-300",
    },
    {
      id: "asset_4",
      name: "Ambient_Tech_Pulse.wav",
      type: "audio",
      resolution: "48kHz 24bit",
      fps: "无损",
      duration: "02:15:00",
      tag: "商用免版权 BGM",
      color: "border-teal-500/40 bg-teal-950/20 text-teal-300",
    },
  ];

  // Filtered comments
  const filteredComments = reviewComments.filter((c) => {
    if (commentFilterStatus === "todo") return c.status === "todo" || c.status === "in_progress";
    if (commentFilterStatus === "resolved") return c.status === "resolved" || c.status === "approved";
    return true;
  });

  // Handle Agent Auto-Resolve
  const handleAutoResolve = (comment: ReviewComment) => {
    setResolvingId(comment.id);
    setTimeout(() => {
      onApplyCommentAgentAction?.(comment);
      onStatusChangeComment?.(comment.id, "resolved");
      setResolvingId(null);
    }, 800);
  };

  const handleBrandKitChange = (patch: Partial<BrandKitConfig>) => {
    const updated = { ...localBrandKit, ...patch };
    setLocalBrandKit(updated);
    onUpdateBrandKit?.(updated);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 select-none overflow-hidden">
      {/* Persona Mode Switcher Bar */}
      <div className="h-9 px-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0 no-scrollbar">
        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-medium hidden sm:inline">工作流：</span>
        </div>

        <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] shrink-0">
          <button
            onClick={() => onChangePersona?.("creator")}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activePersona === "creator"
                ? "bg-indigo-600 text-white font-medium shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="专业创作者：极简单兵流程，文字驱动粗剪与一键外审"
          >
            ⚡ 创作者
          </button>
          <button
            onClick={() => onChangePersona?.("studio")}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activePersona === "studio"
                ? "bg-indigo-600 text-white font-medium shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="制作工作室：导演、剪辑师与客户精确画笔批注与审批流"
          >
            👥 工作室
          </button>
          <button
            onClick={() => onChangePersona?.("brand")}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activePersona === "brand"
                ? "bg-indigo-600 text-white font-medium shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="品牌团队：VI 水印合规、敏感词风控与矩阵多画幅分发"
          >
            🏢 品牌
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Header with zero native scrollbar glitches */}
      <div className="h-10 px-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0 no-scrollbar overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0 no-scrollbar">
          {/* Comments & Review Tab (Frame.io / 分秒帧核心) */}
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-t-md transition-all cursor-pointer font-medium text-xs border-b-2 ${
              activeTab === "comments"
                ? "bg-slate-950 text-amber-300 border-amber-500"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850"
            }`}
            title="审阅批注 (Frame.io/分秒帧协同标注)"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>审阅批注</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
              {reviewComments.length}
            </span>
          </button>

          {/* Transcript tab */}
          <button
            onClick={() => setActiveTab("transcript")}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-t-md transition-all cursor-pointer font-medium text-xs border-b-2 ${
              activeTab === "transcript"
                ? "bg-slate-950 text-indigo-300 border-indigo-500"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850"
            }`}
            title="文稿粗剪与台词"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>文稿剪辑</span>
          </button>

          {/* Brand Kit tab */}
          <button
            onClick={() => setActiveTab("brand")}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-t-md transition-all cursor-pointer font-medium text-xs border-b-2 ${
              activeTab === "brand"
                ? "bg-slate-950 text-emerald-300 border-emerald-500"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850"
            }`}
            title="品牌合规与敏感词风控"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>品牌合规</span>
          </button>

          {/* Assets Tab */}
          <button
            onClick={() => setActiveTab("assets")}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-t-md transition-all cursor-pointer font-medium text-xs border-b-2 ${
              activeTab === "assets"
                ? "bg-slate-950 text-purple-300 border-purple-500"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850"
            }`}
            title="素材库与B-Roll仓"
          >
            <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>素材库</span>
          </button>

          {/* Inspector Tab */}
          <button
            onClick={() => setActiveTab("inspector")}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-t-md transition-all cursor-pointer font-medium text-xs border-b-2 ${
              activeTab === "inspector"
                ? "bg-slate-950 text-cyan-300 border-cyan-500"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850"
            }`}
            title="检查器与参数"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>检查器</span>
          </button>
        </div>

        {onOpenShareModal && (
          <button
            onClick={onOpenShareModal}
            className="text-[11px] text-indigo-300 hover:text-indigo-200 px-2 py-1 rounded bg-indigo-950/60 border border-indigo-800/60 flex items-center gap-1 cursor-pointer shrink-0 ml-1 hover:bg-indigo-900/60 transition-all"
            title="生成 Frame.io / 分秒帧免登录外审分享短链接"
          >
            <ExternalLink className="w-3 h-3 text-indigo-400" />
            <span>外审</span>
          </button>
        )}
      </div>

      {/* Tab 1: Review & Comments (Frame.io / 分秒帧的核心协同能力) */}
      {activeTab === "comments" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          {/* Sub-toolbar: Filters & Quick Actions */}
          <div className="h-9 px-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCommentFilterStatus("all")}
                className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  commentFilterStatus === "all"
                    ? "bg-slate-800 text-slate-100 font-medium"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                全部 ({reviewComments.length})
              </button>
              <button
                onClick={() => setCommentFilterStatus("todo")}
                className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  commentFilterStatus === "todo"
                    ? "bg-amber-950 text-amber-300 font-medium border border-amber-800/60"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                待处理 ({reviewComments.filter((c) => c.status === "todo" || c.status === "in_progress").length})
              </button>
              <button
                onClick={() => setCommentFilterStatus("resolved")}
                className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  commentFilterStatus === "resolved"
                    ? "bg-emerald-950 text-emerald-300 font-medium border border-emerald-800/60"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                已解决 ({reviewComments.filter((c) => c.status === "resolved" || c.status === "approved").length})
              </button>
            </div>

            <span className="text-[10px] text-slate-500 hidden sm:inline">
              点击卡片跳转到对应帧
            </span>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {filteredComments.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                暂无对应审阅批注
              </div>
            ) : (
              filteredComments.map((com) => {
                const isSelected = com.id === activeCommentId;
                const isCurrentFrame = Math.abs(currentTimeSec - com.timecodeSec) < 1.0;

                return (
                  <div
                    key={com.id}
                    onClick={() => {
                      onSeek(com.timecodeSec);
                      onSelectComment?.(com.id);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md"
                        : isCurrentFrame
                        ? "bg-slate-900/90 border-amber-500/60"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {/* Header: Author & Timecode */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={com.author.avatar}
                          alt={com.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-200 text-xs">
                              {com.author.name}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                              com.author.role === "client" 
                                ? "bg-amber-950 text-amber-300 border border-amber-800/60"
                                : com.author.role === "director"
                                ? "bg-purple-950 text-purple-300 border border-purple-800/60"
                                : com.author.role === "brand_manager"
                                ? "bg-rose-950 text-rose-300 border border-rose-800/60"
                                : "bg-blue-950 text-blue-300 border border-blue-800/60"
                            }`}>
                              {com.author.role === "client" ? "客户" : com.author.role === "director" ? "导演" : com.author.role === "brand_manager" ? "合规" : "剪辑师"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Timecode badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeek(com.timecodeSec);
                        }}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-indigo-300 hover:text-white transition-all"
                        title="跳转播放头到此帧"
                      >
                        ⏱️ {com.timecodeSec.toFixed(1)}s
                      </button>
                    </div>

                    {/* Markup Badge if exists */}
                    {com.markup && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: com.markup.color }} 
                        />
                        <span>
                          {com.markup.type === "box" ? "🔲 画面框选标注" : com.markup.type === "pin" ? "📍 图钉定位坐标" : "➡️ 箭头重点指向"}
                        </span>
                        <span className="text-slate-500">
                          ({com.markup.coords.x}%, {com.markup.coords.y}%)
                        </span>
                      </div>
                    )}

                    {/* Comment text */}
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/70">
                      {com.text}
                    </p>

                    {/* Agent action resolution card */}
                    {com.agentActionDescription && (
                      <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/50 flex flex-col gap-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-indigo-300 font-medium">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>AI 智能解析执行方案</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Review-to-Action</span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-normal">
                          {com.agentActionDescription}
                        </p>

                        {/* Agent Action Button */}
                        <div className="pt-1 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">状态：</span>
                            <select
                              value={com.status}
                              onChange={(e) => onStatusChangeComment?.(com.id, e.target.value as any)}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-200"
                            >
                              <option value="todo">待处理</option>
                              <option value="in_progress">处理中</option>
                              <option value="resolved">已解决</option>
                              <option value="approved">已批准</option>
                            </select>
                          </div>

                          {com.status !== "resolved" && com.status !== "approved" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoResolve(com);
                              }}
                              disabled={resolvingId === com.id}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-[11px] font-medium shadow-sm transition-all cursor-pointer disabled:opacity-50"
                              title="由 Agent 自动解析画笔选区与意图，直接修改时间线工程"
                            >
                              {resolvingId === com.id ? (
                                <>
                                  <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>处理中...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3" />
                                  <span>🤖 Agent 自动解决</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Brand Kit & Compliance (面向品牌内容团队与专业工作室) */}
      {activeTab === "brand" && (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-950 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>品牌资产与安全合规中心 (Brand Kit)</span>
              </h3>
              <p className="text-[11px] text-slate-400">对齐品牌内容团队：VI 水印规范、违禁词扫描、多画幅衍生合规</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              合规等级：AAA
            </span>
          </div>

          {/* Dynamic Watermark Control */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>防泄密明水印 (Anti-Leak Watermark)</span>
              </span>
              <input
                type="checkbox"
                checked={localBrandKit.watermarkEnabled}
                onChange={(e) => handleBrandKitChange({ watermarkEnabled: e.target.checked })}
                className="accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            {localBrandKit.watermarkEnabled && (
              <div className="space-y-2.5 pt-1 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">水印文字内容</label>
                  <input
                    type="text"
                    value={localBrandKit.watermarkText}
                    onChange={(e) => handleBrandKitChange({ watermarkText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="text-slate-400 block mb-1">位置</label>
                    <select
                      value={localBrandKit.watermarkPosition}
                      onChange={(e) => handleBrandKitChange({ watermarkPosition: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    >
                      <option value="top-right">右上角 (Top Right)</option>
                      <option value="top-left">左上角 (Top Left)</option>
                      <option value="bottom-right">右下角 (Bottom Right)</option>
                      <option value="bottom-left">左下角 (Bottom Left)</option>
                      <option value="center">画面居中倾斜 (Center Tilted)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>透明度</span>
                      <span>{localBrandKit.watermarkOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={localBrandKit.watermarkOpacity}
                      onChange={(e) => handleBrandKitChange({ watermarkOpacity: parseInt(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Compliance & Forbidden Word Guardrail */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>广告法绝对化与敏感词扫描</span>
              </span>
              <button
                onClick={() => setForbiddenScanStatus("scanned")}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                重新扫描台词
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-900/50 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-amber-300 font-medium">
                  <span>检测结果：发现 1 处表述待优化</span>
                  <span className="text-slate-500 font-mono">00:36.5</span>
                </div>
                <p className="text-slate-300 text-[10px]">
                  台词包含 <span className="text-rose-400 font-bold">"行业第一"</span> 潜质描述，可能违反新广告法第 9 条。
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-emerald-400 text-[10px]">AI 建议替代为：“行业领先的代表方案”</span>
                  <button 
                    onClick={() => alert("已将字幕自动替换为合规表述，并重新对齐时间码")}
                    className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] hover:bg-emerald-900"
                  >
                    一键合规修复
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Platform Delivery Matrix (跨平台一键衍生) */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>多平台衍生与安全区配置 (Multi-Platform Matrix)</span>
            </span>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-indigo-700/60">
                <div className="font-bold text-indigo-300">16:9 宽屏成片</div>
                <div className="text-[10px] text-slate-400 mt-0.5">官网 / B站 / YT</div>
                <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400">
                  主母版工程
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-300">9:16 竖屏精编</div>
                <div className="text-[10px] text-slate-400 mt-0.5">抖音 / 视频号</div>
                <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400">
                  安全区已校验
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-300">1:1 方形社交</div>
                <div className="text-[10px] text-slate-400 mt-0.5">小红书 / 微博</div>
                <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  一键裁切就绪
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Text-based Video Editing (Transcript) */}
      {activeTab === "transcript" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          <div className="min-h-8 py-1 px-2.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="搜索文稿、说话人或口水词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {transcriptSegments
              .filter(
                (seg) =>
                  seg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  seg.speaker.includes(searchQuery)
              )
              .map((seg) => {
                const isActive = currentTimeSec >= seg.startSec && currentTimeSec < seg.endSec;

                return (
                  <div
                    key={seg.id}
                    onClick={() => onSeek(seg.startSec)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isActive
                        ? "bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/40 shadow-sm"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                            seg.speakerRole === "guest"
                              ? "bg-purple-950 text-purple-300 border border-purple-800/60"
                              : "bg-blue-950 text-blue-300 border border-blue-800/60"
                          }`}
                        >
                          🎙️ {seg.speaker}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {seg.startSec.toFixed(1)}s - {seg.endSec.toFixed(1)}s
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                      {seg.text}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab 4: Assets & B-Roll Bin */}
      {activeTab === "assets" && (
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-slate-950">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mediaAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded border font-medium font-mono">
                      {asset.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {asset.duration}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-200 truncate mb-1">
                    {asset.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>{asset.resolution}</span>
                    <span>•</span>
                    <span>{asset.fps}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    已挂载时间轴
                  </span>
                  <button
                    onClick={() => onSeek(14.2)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-all cursor-pointer"
                  >
                    在监视器中定位
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Clip Inspector */}
      {activeTab === "inspector" && (
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-slate-950">
          {selectedClip ? (
            <div className="space-y-3 max-w-2xl">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    当前选中片段 (Selected Clip ID: {selectedClip.id})
                  </span>
                  <h3 className="font-bold text-sm text-slate-100">
                    {selectedClip.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs">
                  {selectedClip.type.toUpperCase()} 轨道
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-0.5">开始时间</span>
                  <span className="font-mono text-slate-200">{selectedClip.startSec.toFixed(2)}s</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-0.5">持续时长</span>
                  <span className="font-mono text-slate-200">{selectedClip.durationSec.toFixed(2)}s</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-0.5">源素材入点</span>
                  <span className="font-mono text-slate-200">{selectedClip.sourceStartSec.toFixed(2)}s</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-0.5">说话人</span>
                  <span className="text-slate-200">{selectedClip.speaker || "全景/素材"}</span>
                </div>
              </div>

              {selectedClip.isAgentGenerated && (
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-indigo-300 font-semibold block">
                      ⚡ Agent 智能生成/精修片段
                    </span>
                    <span className="text-[11px] text-slate-400">
                      操作事务 ID: {selectedClip.agentActionId || "action_auto_01"}
                    </span>
                  </div>
                  {selectedClip.agentActionId && onRollbackAction && (
                    <button
                      onClick={() => onRollbackAction(selectedClip.agentActionId!)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-medium transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>一刀回滚此片段</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8">
              <Sliders className="w-6 h-6 mb-2 text-slate-600" />
              <span>请在时间轴上点击选中任意片段查看属性</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
