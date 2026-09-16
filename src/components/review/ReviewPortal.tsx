import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Monitor, 
  Smartphone, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  Edit3, 
  Square, 
  ArrowUpRight, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  Send, 
  Download, 
  Share2, 
  UserCheck, 
  ArrowLeft, 
  ChevronRight, 
  Filter, 
  Trash2, 
  Sparkles, 
  Check, 
  X, 
  Eye, 
  FileText, 
  GitBranch,
  CornerDownRight,
  Shield,
  Film
} from "lucide-react";
import { 
  ReviewComment, 
  TimelineTrack, 
  VersionStackItem, 
  BrandKitConfig, 
  UserPersona 
} from "../../types";

interface ReviewPortalProps {
  currentTimeSec: number;
  durationSec: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onSeek: (timeSec: number) => void;
  tracks: TimelineTrack[];
  reviewComments: ReviewComment[];
  activeCommentId: string | null;
  onSelectComment: (id: string | null) => void;
  onAddComment: (comment: {
    text: string;
    category: ReviewComment["category"];
    markup?: ReviewComment["markup"];
    priority?: "normal" | "urgent";
    authorName?: string;
    authorRole?: ReviewComment["author"]["role"];
  }) => void;
  onStatusChangeComment: (id: string, status: ReviewComment["status"]) => void;
  versions: VersionStackItem[];
  currentVersionId: string;
  onSelectVersion: (id: string) => void;
  brandKit: BrandKitConfig;
  projectName: string;
  onSwitchToStudio: () => void;
}

export const ReviewPortal: React.FC<ReviewPortalProps> = ({
  currentTimeSec,
  durationSec,
  isPlaying,
  onPlayToggle,
  onSeek,
  tracks,
  reviewComments,
  activeCommentId,
  onSelectComment,
  onAddComment,
  onStatusChangeComment,
  versions,
  currentVersionId,
  onSelectVersion,
  brandKit,
  projectName,
  onSwitchToStudio,
}) => {
  // Reviewer identity
  const [reviewerName, setReviewerName] = useState("王客户 (甲方审片人)");
  const [reviewerRole, setReviewerRole] = useState<ReviewComment["author"]["role"]>("client");
  const [isSwitchingReviewer, setIsSwitchingReviewer] = useState(false);

  // Video presentation state
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [isSplitView, setIsSplitView] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Overall Approval status
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "changes_requested">("pending");
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Canvas markup state
  const [isMarkupActive, setIsMarkupActive] = useState(false);
  const [markupTool, setMarkupTool] = useState<"box" | "pen" | "arrow" | "pin">("box");
  const [markupColor, setMarkupColor] = useState<string>("#f59e0b");
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [currentDraftMarkup, setCurrentDraftMarkup] = useState<ReviewComment["markup"] | null>(null);

  // Comment input state
  const [commentText, setCommentText] = useState("");
  const [commentCategory, setCommentCategory] = useState<ReviewComment["category"]>("cut");
  const [commentPriority, setCommentPriority] = useState<"normal" | "urgent">("normal");
  const [commentFilter, setCommentFilter] = useState<"all" | "todo" | "resolved" | "mine">("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [repliesState, setRepliesState] = useState<Record<string, Array<{ author: string; text: string; time: string }>>>({
    rev_c1: [
      { author: "张剪辑师 (后期团队)", text: "已通过 Agent 自动识别定位气口，新版本中已完成无缝平滑跳剪！", time: "5分钟前" }
    ]
  });

  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Quick preset feedback chips
  const PRESET_FEEDBACKS = [
    { label: "🗣️ 口水词气口过长", category: "cut" as const, priority: "normal" as const },
    { label: "🎬 此处建议插入B-Roll", category: "broll" as const, priority: "normal" as const },
    { label: "🔤 字幕有错别字", category: "subtitle" as const, priority: "urgent" as const },
    { label: "🛡️ 违背品牌VI规范", category: "brand_vi" as const, priority: "urgent" as const },
    { label: "🎵 背景音乐遮挡人声", category: "audio" as const, priority: "normal" as const },
    { label: "🎨 整体画面偏暗需调色", category: "color" as const, priority: "normal" as const },
  ];

  // Helper timecode formatter: 00:00:SS:FF
  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const f = Math.floor((sec % 1) * 25);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Find active clips for video simulation
  const videoTrack = tracks.find((t) => t.type === "video");
  const activeVideoClip = videoTrack?.clips.find(
    (c) => currentTimeSec >= c.startSec && currentTimeSec < c.startSec + c.durationSec
  );

  const brollTrack = tracks.find((t) => t.type === "broll");
  const activeBrollClip = brollTrack?.clips.find(
    (c) => currentTimeSec >= c.startSec && currentTimeSec < c.startSec + c.durationSec
  );

  const subtitleTrack = tracks.find((t) => t.type === "subtitle");
  const activeSubtitle = subtitleTrack?.clips.find(
    (c) => currentTimeSec >= c.startSec && currentTimeSec < c.startSec + c.durationSec
  );

  // Comments nearby current time (+/- 1.8s) for canvas overlay
  const nearbyComments = reviewComments.filter(
    (c) => Math.abs(c.timecodeSec - currentTimeSec) < 1.8
  );

  // Current version object
  const currentVersion = versions.find((v) => v.id === currentVersionId) || versions[versions.length - 1];

  // Canvas click to annotate
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMarkupActive) {
      // If not in markup mode, clicking video can toggle play/pause
      onPlayToggle();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const markup: ReviewComment["markup"] = {
      type: markupTool,
      color: markupColor,
      coords: markupTool === "box" 
        ? { x: Math.max(8, x - 15), y: Math.max(8, y - 12), width: 30, height: 24 }
        : { x, y }
    };

    setCurrentDraftMarkup(markup);
    showToast(`已在当前帧 (${formatTimecode(currentTimeSec)}) 标记 ${markupTool === "box" ? "矩形选框" : markupTool === "arrow" ? "指示箭头" : markupTool === "pin" ? "图钉定位" : "画笔标记"}，请在右侧输入修改意见`);
  };

  // Submit comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment({
      text: commentText.trim(),
      category: commentCategory,
      markup: currentDraftMarkup || undefined,
      priority: commentPriority,
      authorName: reviewerName,
      authorRole: reviewerRole,
    });

    setCommentText("");
    setCurrentDraftMarkup(null);
    setIsMarkupActive(false);
    showToast("批注已成功提交，并实时同步回传至剪辑师 Agent 工作台！");
  };

  // Reply submit
  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;
    setRepliesState((prev) => ({
      ...prev,
      [commentId]: [
        ...(prev[commentId] || []),
        { author: reviewerName, text: replyText.trim(), time: "刚刚" }
      ]
    }));
    setReplyText("");
    setReplyInputId(null);
    showToast("回复已发布，剪辑师可在团队讨论栏查阅。");
  };

  // Filtered comments
  const filteredComments = reviewComments.filter((c) => {
    if (commentFilter === "todo" && (c.status === "resolved" || c.status === "approved")) return false;
    if (commentFilter === "resolved" && c.status !== "resolved" && c.status !== "approved") return false;
    if (commentFilter === "mine" && !c.author.name.includes(reviewerName.split(" ")[0])) return false;
    if (selectedCategoryFilter !== "all" && c.category !== selectedCategoryFilter) return false;
    return true;
  });

  // Step frames (-1 frame = -0.04s at 25fps)
  const stepFrame = (frames: number) => {
    const delta = frames * (1 / 25);
    const newTime = Math.max(0, Math.min(durationSec, currentTimeSec + delta));
    onSeek(newTime);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Top Banner: External Reviewer Portal Indicator & Switch Back Bar */}
      <header className="h-14 bg-slate-900/95 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 shadow-md">
        {/* Left info & Project details */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm font-bold">
              <Eye className="w-4.5 h-4.5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm tracking-tight">FrameAgent 外审协作门户</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                  免登录审片端 (Client Portal)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>项目：<b className="text-slate-200">{projectName}</b></span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  已与剪辑师工作台双向实时连通
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Version Switcher */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-400">当前成片版本：</span>
          <select
            value={currentVersionId}
            onChange={(e) => onSelectVersion(e.target.value)}
            className="bg-transparent text-xs font-semibold text-indigo-300 focus:outline-none cursor-pointer"
          >
            {versions.map((ver) => (
              <option key={ver.id} value={ver.id} className="bg-slate-900 text-slate-200">
                {ver.version} · {ver.label} ({ver.status === "approved" ? "已定稿" : ver.status === "reviewing" ? "外审中" : "初稿"})
              </option>
            ))}
          </select>
        </div>

        {/* Right: Reviewer Persona Switcher & Approval Decisions & Back to Studio */}
        <div className="flex items-center gap-2.5">
          {/* Switch Reviewer identity */}
          <div className="relative">
            <button
              onClick={() => setIsSwitchingReviewer(!isSwitchingReviewer)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-all cursor-pointer"
              title="切换外审人员身份（模拟甲方负责人、导演或法务）"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium hidden sm:inline">{reviewerName}</span>
              <span className="sm:hidden">审片人</span>
            </button>

            {isSwitchingReviewer && (
              <div className="absolute right-0 top-10 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                  模拟切换审片人身份
                </div>
                {[
                  { name: "王客户 (甲方负责人)", role: "client" as const, desc: "决定成片最终采纳与交付" },
                  { name: "李总监 (影视导演)", role: "director" as const, desc: "把控视听语言、镜头节奏" },
                  { name: "周经理 (品牌合规官)", role: "brand_manager" as const, desc: "审核VI规范、文字敏感词" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setReviewerName(item.name);
                      setReviewerRole(item.role);
                      setIsSwitchingReviewer(false);
                      showToast(`已切换为：${item.name}`);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all cursor-pointer ${
                      reviewerName === item.name
                        ? "bg-amber-950/80 border border-amber-700 text-amber-200"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Decision Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setApprovalStatus("approved");
                showToast("🎉 您已批准本版本成片！终审通过状态已同步至剪辑师端。");
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                approvalStatus === "approved"
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                  : "bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{approvalStatus === "approved" ? "已批准定稿" : "终审通过"}</span>
            </button>

            <button
              onClick={() => {
                setApprovalStatus("changes_requested");
                setShowDecisionModal(true);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                approvalStatus === "changes_requested"
                  ? "bg-amber-600 text-white ring-2 ring-amber-400"
                  : "bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-300"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{approvalStatus === "changes_requested" ? "已要求修改" : "提出修改意见"}</span>
            </button>
          </div>

          {/* Return to Editor Studio Button */}
          <button
            id="btn-return-studio"
            onClick={onSwitchToStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md cursor-pointer ml-1"
            title="返回剪辑师工作台，查看 Agent 实时接收修改建议"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">切回剪辑工作台</span>
            <span className="sm:hidden">剪辑台</span>
          </button>
        </div>
      </header>

      {/* Main Review Workplace: Cinema Stage (Left/Center) + Feedback Stream (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left / Center Section: Cinema Video Player & Review Scrubber */}
        <section className="flex-1 flex flex-col min-h-0 bg-slate-950 overflow-hidden relative">
          {/* Sub-Header: Reviewer Tools (Markup toolbar, Safe zone, Aspect ratio, A/B compare) */}
          <div className="h-10 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0 z-20">
            {/* Markup drawing controls (Frame.io / 分秒帧核心批注笔刷) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const next = !isMarkupActive;
                  setIsMarkupActive(next);
                  if (next) {
                    showToast("已激活画笔模式：请在视频画面上点击或框选需要修改的区域");
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  isMarkupActive
                    ? "bg-amber-500 text-slate-950 font-bold animate-pulse"
                    : "bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isMarkupActive ? "正在标注中 (点击画面画框)" : "开启画笔标注"}</span>
              </button>

              {isMarkupActive && (
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-md border border-slate-800">
                  <button
                    onClick={() => setMarkupTool("box")}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      markupTool === "box" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="矩形高亮框 (框选主体人脸/物品/Logo)"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMarkupTool("arrow")}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      markupTool === "arrow" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="指示箭头 (指定问题位置)"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMarkupTool("pin")}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      markupTool === "pin" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="坐标图钉 (标记固定锚点)"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-4 w-px bg-slate-800 mx-1" />

                  {/* Colors */}
                  {[
                    { color: "#f59e0b", name: "亮橙" },
                    { color: "#ef4444", name: "警示红" },
                    { color: "#10b981", name: "通过绿" },
                    { color: "#06b6d4", name: "荧光蓝" },
                    { color: "#a855f7", name: "品牌紫" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setMarkupColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                        markupColor === c.color ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Video preview configurations */}
            <div className="flex items-center gap-1.5">
              {/* Aspect Ratio */}
              <button
                onClick={() => setAspectRatio((prev) => (prev === "16:9" ? "9:16" : "16:9"))}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                  aspectRatio === "9:16"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title="切换横屏 16:9 或竖屏 9:16 模拟手机端显示"
              >
                {aspectRatio === "9:16" ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>9:16 手机竖屏</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5" />
                    <span>16:9 宽屏</span>
                  </>
                )}
              </button>

              {/* A/B Comparison */}
              <button
                onClick={() => setIsSplitView(!isSplitView)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                  isSplitView
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title="对比原片与最新修改后的画面差异"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">A/B差异对比</span>
              </button>

              {/* Safe Zone */}
              <button
                onClick={() => setShowSafeZone(!showSafeZone)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                  showSafeZone
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title="预览抖音/视频号右侧点赞栏与底部文字安全遮挡区"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">平台安全区</span>
              </button>
            </div>
          </div>

          {/* Main Cinema Viewport Stage */}
          <div
            ref={videoContainerRef}
            className={`flex-1 min-h-[300px] flex items-center justify-center p-4 sm:p-6 relative bg-slate-950 overflow-hidden ${
              isMarkupActive ? "cursor-crosshair" : ""
            }`}
          >
            {/* Aspect container */}
            <div
              onClick={handleCanvasClick}
              className={`relative transition-all duration-300 rounded-xl overflow-hidden border border-slate-700 shadow-2xl flex items-center justify-center bg-slate-900 ${
                aspectRatio === "9:16"
                  ? "h-full max-h-[580px] aspect-[9/16] w-auto max-w-[340px] min-w-[240px]"
                  : "w-full max-w-[1000px] aspect-video max-h-[calc(100%-12px)]"
              }`}
            >
              {/* Screen Content Graphic */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-850 via-slate-900 to-slate-950 flex flex-col items-center justify-center overflow-hidden">
                {/* Visual Ambient Glow */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl" />

                {/* Dynamic Anti-Leak Review Watermark (分秒帧/Frame.io 经典动态防录屏防泄露水印) */}
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 font-mono select-none opacity-30 text-slate-400">
                  <div className="flex justify-between text-[10px]">
                    <span>内部审片 · 严禁翻录</span>
                    <span>审片人：{reviewerName}</span>
                  </div>
                  <div className="self-center text-xs tracking-widest rotate-[-12deg] text-slate-300/40 font-bold border border-white/10 px-3 py-1 rounded">
                    FRAMEAGENT REVIEW · {reviewerName} · 2026-09-16
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>时间码：{formatTimecode(currentTimeSec)}</span>
                    <span>IP: 183.14.28.91 (上海电信)</span>
                  </div>
                </div>

                {/* Split comparison view */}
                {isSplitView && (
                  <div className="absolute inset-0 flex z-10 pointer-events-none">
                    <div className="w-1/2 h-full border-r-2 border-amber-400 bg-slate-950/40 relative flex flex-col justify-between p-4">
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/90 px-2.5 py-1 rounded-md border border-amber-800/70 self-start">
                        原始粗剪 (含气口/未调色)
                      </span>
                      <div className="text-xs text-slate-300 text-center font-medium bg-slate-950/70 py-1.5 px-2 rounded backdrop-blur-sm">
                        原始状态：口误停顿待修剪
                      </div>
                    </div>
                    <div className="w-1/2 h-full bg-slate-900/20 relative flex flex-col justify-between p-4">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/90 px-2.5 py-1 rounded-md border border-emerald-800/70 self-end">
                        当前最新剪辑 (v1.3 精修)
                      </span>
                      <div className="text-xs text-emerald-300 text-center font-medium bg-slate-950/70 py-1.5 px-2 rounded backdrop-blur-sm border border-emerald-500/30">
                        精修版：AI 消除气口 + 插入 B-Roll
                      </div>
                    </div>
                  </div>
                )}

                {/* Simulated Content Frame */}
                {activeBrollClip ? (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-indigo-950/50 border border-indigo-500/30 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center mb-3 animate-pulse shadow-lg">
                      <Film className="w-8 h-8 text-indigo-300" />
                    </div>
                    <span className="text-base font-semibold text-indigo-200">
                      {activeBrollClip.name}
                    </span>
                    <span className="text-xs text-indigo-300 mt-1.5 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/60 font-medium">
                      🎬 插入 B-Roll 覆盖画面中
                    </span>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-20 h-20 rounded-full bg-slate-800/95 border-2 border-slate-700 flex items-center justify-center text-slate-200 mb-3 shadow-2xl">
                      <span className="text-3xl">🎙️</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-100">
                      {activeVideoClip ? activeVideoClip.name : "访谈原画中景镜头"}
                    </span>
                    {activeVideoClip?.isCutPoint && (
                      <span className="text-xs text-amber-300 mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60 font-mono shadow-sm">
                        ✂️ 口水词已修剪切除
                      </span>
                    )}
                  </div>
                )}

                {/* Subtitle Rendering */}
                {activeSubtitle?.text && (
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-center pointer-events-none">
                    <div className="bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-lg border border-yellow-400/30 text-center max-w-[90%] shadow-2xl">
                      <p className="text-sm sm:text-base font-bold text-yellow-300 tracking-wide drop-shadow">
                        {activeSubtitle.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Canvas Markups Rendered directly over Video */}
                {nearbyComments.map((com) => {
                  if (!com.markup) return null;
                  const isSelected = com.id === activeCommentId;
                  const { coords, color, type } = com.markup;

                  return (
                    <div
                      key={com.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComment(com.id);
                      }}
                      className={`absolute z-30 transition-all cursor-pointer pointer-events-auto ${
                        isSelected ? "scale-105" : "hover:scale-105 opacity-90 hover:opacity-100"
                      }`}
                      style={{
                        left: `${coords.x}%`,
                        top: `${coords.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {type === "box" && coords.width && coords.height ? (
                        <div
                          style={{
                            width: `${coords.width * 3.5}px`,
                            height: `${coords.height * 2.2}px`,
                            borderColor: color,
                          }}
                          className={`border-2 border-dashed bg-black/25 rounded-md flex items-start justify-between p-1 ${
                            isSelected ? "ring-2 ring-white" : ""
                          }`}
                        >
                          <span
                            style={{ backgroundColor: color }}
                            className="text-[10px] text-black font-bold px-1 rounded shadow-xs"
                          >
                            批注 #{com.id.slice(-2)}
                          </span>
                        </div>
                      ) : type === "arrow" ? (
                        <div className="flex items-center gap-1">
                          <ArrowUpRight
                            style={{ color }}
                            className={`w-8 h-8 drop-shadow-lg ${isSelected ? "animate-bounce" : ""}`}
                          />
                          <span
                            style={{ backgroundColor: color }}
                            className="text-[10px] text-black font-bold px-1.5 py-0.5 rounded shadow-xs"
                          >
                            {com.author.name.split(" ")[0]}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <MapPin
                            style={{ color }}
                            className={`w-7 h-7 drop-shadow-lg ${isSelected ? "animate-bounce" : ""}`}
                          />
                          <span
                            style={{ backgroundColor: color }}
                            className="text-[10px] text-black font-bold px-1 rounded shadow-xs mt-0.5"
                          >
                            {com.author.name.split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Current In-Progress Draft Markup */}
                {currentDraftMarkup && (
                  <div
                    className="absolute z-30 pointer-events-none"
                    style={{
                      left: `${currentDraftMarkup.coords.x}%`,
                      top: `${currentDraftMarkup.coords.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      style={{ borderColor: currentDraftMarkup.color }}
                      className="w-28 h-20 border-2 border-amber-400 bg-amber-400/20 rounded-md flex items-center justify-center text-amber-200 text-xs font-bold animate-pulse"
                    >
                      新批注区域
                    </div>
                  </div>
                )}

                {/* Platform UI Safe Zone Overlay for Short Video Preview */}
                {showSafeZone && aspectRatio === "9:16" && (
                  <div className="absolute inset-0 pointer-events-none z-20 border-2 border-emerald-500/50 flex flex-col justify-between p-3 text-[10px] text-emerald-400">
                    <div className="bg-black/60 px-2 py-1 rounded self-center border border-emerald-500/30">
                      顶部状态栏/关注安全界线
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="bg-black/60 px-2 py-1 rounded max-w-[65%] border border-emerald-500/30">
                        底部标题/话题标签遮挡区 (需避开字幕)
                      </div>
                      <div className="bg-black/60 px-2 py-1 rounded border border-emerald-500/30">
                        右侧点赞/评论/转发栏
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Player Scrubber & Timeline Bar with Comment Markers */}
          <div className="h-20 bg-slate-900 border-t border-slate-800 px-4 py-2 flex flex-col justify-between shrink-0 z-20">
            {/* Timeline track with comment flag pins */}
            <div className="relative w-full h-5 flex items-center group">
              <input
                type="range"
                min={0}
                max={durationSec}
                step={0.04}
                value={currentTimeSec}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 z-10"
              />

              {/* Progress bar highlight */}
              <div
                className="absolute left-0 top-1.5 h-2 bg-gradient-to-r from-amber-600 to-amber-400 rounded-l-lg pointer-events-none"
                style={{ width: `${(currentTimeSec / durationSec) * 100}%` }}
              />

              {/* Comment Pins pinned at timestamps on the timeline bar */}
              {reviewComments.map((com) => {
                const leftPercent = (com.timecodeSec / durationSec) * 100;
                const isSelected = com.id === activeCommentId;
                const isResolved = com.status === "resolved" || com.status === "approved";

                return (
                  <button
                    key={com.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(com.timecodeSec);
                      onSelectComment(com.id);
                    }}
                    style={{ left: `${leftPercent}%` }}
                    className={`absolute -top-1 transform -translate-x-1/2 z-20 transition-all cursor-pointer group/pin ${
                      isSelected ? "scale-125 z-30" : "hover:scale-125"
                    }`}
                    title={`${com.author.name} (@ ${formatTimecode(com.timecodeSec)}): ${com.text}`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border shadow-md ${
                        isResolved
                          ? "bg-emerald-500 border-white text-slate-950"
                          : isSelected
                          ? "bg-amber-400 border-white ring-2 ring-amber-300"
                          : "bg-amber-500 border-slate-900"
                      }`}
                    >
                      <span className="text-[8px] font-bold">
                        {isResolved ? "✓" : "●"}
                      </span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover/pin:opacity-100 pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[10px] text-slate-200 px-2 py-1 rounded shadow-xl whitespace-nowrap z-40 transition-opacity">
                      <div className="font-bold text-amber-400">{formatTimecode(com.timecodeSec)} · {com.author.name}</div>
                      <div className="max-w-[180px] truncate text-slate-300">{com.text}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              {/* Playback buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-review-play"
                  onClick={onPlayToggle}
                  className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-all shadow-md cursor-pointer font-bold"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                {/* Step back 1 frame */}
                <button
                  onClick={() => stepFrame(-1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-all cursor-pointer font-mono"
                  title="逐帧后退 (-1 帧)"
                >
                  ◀ -1帧
                </button>

                {/* Step forward 1 frame */}
                <button
                  onClick={() => stepFrame(1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-all cursor-pointer font-mono"
                  title="逐帧前进 (+1 帧)"
                >
                  +1帧 ▶
                </button>

                {/* Timecode readout */}
                <div className="font-mono text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-amber-300 font-semibold ml-1">
                  {formatTimecode(currentTimeSec)} / {formatTimecode(durationSec)}
                </div>
              </div>

              {/* Speed, Volume, Fullscreen */}
              <div className="flex items-center gap-2">
                {/* Speed buttons */}
                <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
                  {[0.5, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        playbackRate === rate
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Volume */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      videoContainerRef.current?.requestFullscreen?.();
                      setIsFullscreen(true);
                    } else {
                      document.exitFullscreen?.();
                      setIsFullscreen(false);
                    }
                  }}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                  title="全屏监视"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section: Feedback Queue, Composer & Discussion Stream */}
        <aside className="w-full lg:w-[420px] xl:w-[450px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col min-h-0 bg-slate-950">
          {/* Right Header & Statistics */}
          <div className="h-11 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-200">审阅批注与修改需求</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                {reviewComments.length} 条
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-medium">
                {reviewComments.filter((c) => c.status === "resolved" || c.status === "approved").length} 已解决
              </span>
              <span>/</span>
              <span className="text-amber-400 font-medium">
                {reviewComments.filter((c) => c.status !== "resolved" && c.status !== "approved").length} 待修改
              </span>
            </div>
          </div>

          {/* New Comment Input Composer (固定在顶部，支持精准定位时间码) */}
          <div className="p-3.5 bg-slate-900/70 border-b border-slate-800 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-semibold text-slate-200">发表新批注</span>
                <span className="font-mono text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-bold text-[11px]">
                  @ {formatTimecode(currentTimeSec)}
                </span>
              </div>

              {/* Priority Toggle */}
              <button
                onClick={() => setCommentPriority((prev) => (prev === "normal" ? "urgent" : "normal"))}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                  commentPriority === "urgent"
                    ? "bg-rose-950 text-rose-300 border border-rose-700"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {commentPriority === "urgent" ? "🚨 紧急 P0 必须改" : "普通优化建议"}
              </button>
            </div>

            {/* Quick Preset Feedback Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {PRESET_FEEDBACKS.map((pf) => (
                <button
                  key={pf.label}
                  onClick={() => {
                    setCommentText(pf.label.replace(/^.*? /, ""));
                    setCommentCategory(pf.category);
                    setCommentPriority(pf.priority);
                  }}
                  className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-750 text-slate-300 text-[11px] whitespace-nowrap transition-all cursor-pointer border border-slate-700/60"
                >
                  {pf.label}
                </button>
              ))}
            </div>

            {/* Draft Markup Attached Indicator */}
            {currentDraftMarkup && (
              <div className="flex items-center justify-between px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/60 text-[11px] text-amber-300">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-amber-400" />
                  已绑定画面标注 ({currentDraftMarkup.type === "box" ? "矩形选区" : "箭头/图钉"})
                </span>
                <button
                  onClick={() => setCurrentDraftMarkup(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  清除标记
                </button>
              </div>
            )}

            {/* Comment Text Area */}
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment(e);
                  }
                }}
                rows={2}
                placeholder={`以【${reviewerName}】身份在 ${formatTimecode(currentTimeSec)} 发表批注（Enter 发送）...`}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
              />

              <div className="flex items-center justify-between">
                {/* Category select */}
                <select
                  value={commentCategory}
                  onChange={(e) => setCommentCategory(e.target.value as ReviewComment["category"])}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                >
                  <option value="cut">剪辑节奏与跳切</option>
                  <option value="broll">B-Roll 素材替换</option>
                  <option value="subtitle">字幕对齐与错别字</option>
                  <option value="brand_vi">品牌VI与合规</option>
                  <option value="audio">声音与背景配乐</option>
                  <option value="color">画质与调色</option>
                </select>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold shadow-md transition-all ${
                    commentText.trim()
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>提交并回传</span>
                </button>
              </div>
            </form>
          </div>

          {/* Filter Bar */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCommentFilter("all")}
                className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  commentFilter === "all" ? "bg-slate-800 text-white font-medium" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setCommentFilter("todo")}
                className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  commentFilter === "todo" ? "bg-amber-950 text-amber-300 font-medium" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                待修改
              </button>
              <button
                onClick={() => setCommentFilter("resolved")}
                className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  commentFilter === "resolved" ? "bg-emerald-950 text-emerald-300 font-medium" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                已解决
              </button>
              <button
                onClick={() => setCommentFilter("mine")}
                className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  commentFilter === "mine" ? "bg-indigo-950 text-indigo-300 font-medium" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                我的批注
              </button>
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-300 focus:outline-none"
            >
              <option value="all">全部分类</option>
              <option value="cut">剪辑</option>
              <option value="broll">B-Roll</option>
              <option value="subtitle">字幕</option>
              <option value="brand_vi">品牌</option>
              <option value="audio">音频</option>
            </select>
          </div>

          {/* Comments List Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {filteredComments.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
                <span>此筛选条件下暂无审阅批注</span>
              </div>
            ) : (
              filteredComments.map((comment) => {
                const isSelected = comment.id === activeCommentId;
                const isResolved = comment.status === "resolved" || comment.status === "approved";
                const replies = repliesState[comment.id] || [];

                return (
                  <div
                    key={comment.id}
                    onClick={() => {
                      onSeek(comment.timecodeSec);
                      onSelectComment(comment.id);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-slate-900 border-amber-500/80 shadow-lg"
                        : "bg-slate-900/50 hover:bg-slate-900 border-slate-800/80"
                    }`}
                  >
                    {/* Comment card top header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Timecode seek badge */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSeek(comment.timecodeSec);
                            onSelectComment(comment.id);
                          }}
                          className="flex items-center gap-1 font-mono text-[11px] font-bold text-amber-300 bg-slate-950 hover:bg-amber-950/40 px-2 py-0.5 rounded border border-slate-800 transition-all cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>{formatTimecode(comment.timecodeSec)}</span>
                        </button>

                        {/* Author info */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                          <span>{comment.author.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">
                            {comment.author.role === "client" ? "甲方" : comment.author.role === "director" ? "导演" : comment.author.role === "brand_manager" ? "风控" : "剪辑"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                        {/* Resolve toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChangeComment(comment.id, isResolved ? "todo" : "resolved");
                            showToast(isResolved ? "批注已标记为待修改" : "批注已标记为已解决！");
                          }}
                          className={`p-1 rounded transition-all cursor-pointer ${
                            isResolved
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                          }`}
                          title={isResolved ? "点击重新打开为待修改" : "点击确认已解决"}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {comment.text}
                    </p>

                    {/* Markup preview pill */}
                    {comment.markup && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/40 w-fit">
                        <Square className="w-3 h-3 text-amber-400" />
                        <span>已圈选画面区域 ({comment.markup.type})</span>
                      </div>
                    )}

                    {/* Agent Solution Tag if available */}
                    {comment.agentActionDescription && (
                      <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-[11px] text-indigo-300 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-indigo-200">剪辑端 AI 应对策略：</span>
                          <span>{comment.agentActionDescription}</span>
                        </div>
                      </div>
                    )}

                    {/* Replies Thread */}
                    {replies.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        {replies.map((rep, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800">
                            <CornerDownRight className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-300 mr-1">{rep.author}:</span>
                              <span className="text-slate-300">{rep.text}</span>
                              <span className="text-[9px] text-slate-500 ml-2">{rep.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply button / input */}
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      {replyInputId === comment.id ? (
                        <div className="w-full flex items-center gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddReply(comment.id);
                              }
                            }}
                            placeholder="回复修改进展或探讨..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs"
                          >
                            发送
                          </button>
                          <button
                            onClick={() => setReplyInputId(null)}
                            className="text-slate-400 hover:text-slate-200 text-xs px-1"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyInputId(comment.id);
                          }}
                          className="text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>回复 ({replies.length})</span>
                        </button>
                      )}

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          isResolved
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-amber-950 text-amber-300 border border-amber-800"
                        }`}
                      >
                        {isResolved ? "已解决" : "待剪辑师处理"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer of Right Panel: Export & Download */}
          <div className="h-12 px-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
            <button
              onClick={() => {
                showToast("已生成并导出审阅批注清单 (PDF / FCPXML 标记点)");
              }}
              className="flex items-center gap-1.5 text-slate-300 hover:text-slate-100 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>导出批注清单 (PDF)</span>
            </button>

            <span className="text-[11px] text-slate-500">
              数据经 AES-256 加密同步
            </span>
          </div>
        </aside>
      </div>

      {/* Decision Summary Modal when Reviewer Requests Changes */}
      {showDecisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-slate-100">
            <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-sm">提交外审修改意见清单</h3>
              </div>
              <button
                onClick={() => setShowDecisionModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-300">
                您当前的身份为 <b className="text-amber-300">{reviewerName}</b>。本次修改清单将包含当前存在的 <b className="text-amber-300">{reviewComments.filter(c => c.status !== "resolved").length} 条待修改项</b>。
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  总体修改寄语 / 交付时间期望：
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  rows={3}
                  placeholder="例如：请在今日 18:00 前完成口水词跳剪与品牌 Logo 安全区调整，期待下一版交付！"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>剪辑师端将收到系统弹窗通知，并可直接在时间线上唤起 Agent 一键批处理修复。</span>
              </div>
            </div>

            <div className="h-14 px-5 border-t border-slate-800 flex items-center justify-end gap-2.5 bg-slate-950">
              <button
                onClick={() => setShowDecisionModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs hover:bg-slate-800 text-slate-300"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowDecisionModal(false);
                  showToast("已向后期剪辑团队发送修改清单通知！");
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md"
              >
                确认提交修改清单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-500/80 text-amber-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
