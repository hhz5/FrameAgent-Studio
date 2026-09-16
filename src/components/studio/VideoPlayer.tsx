import React, { useState, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Smartphone, 
  Monitor, 
  Layers, 
  ShieldAlert, 
  Volume2, 
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Rows3,
  Expand,
  ZoomIn,
  Pencil,
  Square,
  ArrowUpRight,
  MapPin,
  Share2,
  GitBranch,
  CheckCircle2,
  Clock,
  Send,
  X,
  Shield,
  Palette
} from "lucide-react";
import { 
  TimelineTrack, 
  ReviewComment, 
  VersionStackItem, 
  BrandKitConfig, 
  UserPersona 
} from "../../types";

interface VideoPlayerProps {
  currentTimeSec: number;
  durationSec: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onSeek: (timeSec: number) => void;
  tracks: TimelineTrack[];
  aspectRatio: "16:9" | "9:16";
  onAspectRatioToggle: () => void;
  isSplitView: boolean;
  onToggleSplitView: () => void;
  showSafeZone: boolean;
  onToggleSafeZone: () => void;
  layoutMode?: "three-column" | "stacked" | "focus-monitor";
  onLayoutModeChange?: (mode: "three-column" | "stacked" | "focus-monitor") => void;
  // Frame.io / 分秒帧 协同审阅与版本融合能力
  activePersona?: UserPersona;
  reviewComments?: ReviewComment[];
  activeCommentId?: string | null;
  onSelectComment?: (id: string) => void;
  onAddComment?: (comment: {
    text: string;
    category: ReviewComment["category"];
    markup?: ReviewComment["markup"];
  }) => void;
  versions?: VersionStackItem[];
  currentVersionId?: string;
  onSelectVersion?: (versionId: string) => void;
  brandKit?: BrandKitConfig;
  onOpenShareReview?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentTimeSec,
  durationSec,
  isPlaying,
  onPlayToggle,
  onSeek,
  tracks,
  aspectRatio,
  onAspectRatioToggle,
  isSplitView,
  onToggleSplitView,
  showSafeZone,
  onToggleSafeZone,
  layoutMode = "three-column",
  onLayoutModeChange,
  activePersona = "studio",
  reviewComments = [],
  activeCommentId = null,
  onSelectComment,
  onAddComment,
  versions = [],
  currentVersionId = "ver_4",
  onSelectVersion,
  brandKit,
  onOpenShareReview,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);

  // Canvas markup mode state
  const [isMarkupMode, setIsMarkupMode] = useState(false);
  const [markupTool, setMarkupTool] = useState<"box" | "pen" | "arrow" | "pin">("box");
  const [markupColor, setMarkupColor] = useState<string>("#f59e0b");
  const [draftMarkup, setDraftMarkup] = useState<ReviewComment["markup"] | null>(null);
  const [isNewCommentModalOpen, setIsNewCommentModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentCategory, setNewCommentCategory] = useState<ReviewComment["category"]>("cut");

  // Format time to 00:00:SS:FF
  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const f = Math.floor((sec % 1) * 25);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  };

  // Find active video clip
  const videoTrack = tracks.find((t) => t.type === "video");
  const activeVideoClip = videoTrack?.clips.find(
    (c) => currentTimeSec >= c.startSec && currentTimeSec < c.startSec + c.durationSec
  );

  // Find active B-roll clip
  const brollTrack = tracks.find((t) => t.type === "broll");
  const activeBrollClip = brollTrack?.clips.find(
    (c) => currentTimeSec >= c.startSec && currentTimeSec < c.startSec + c.durationSec
  );

  // Find active subtitle
  const subtitleTrack = tracks.find((t) => t.type === "subtitle");
  const activeSubtitle = subtitleTrack?.clips.find(
    (c) => currentTimeSec >= c.startSec && currentTimeSec < c.startSec + c.durationSec
  );

  // Active comments at current time (+/- 1.8s window)
  const nearbyComments = reviewComments.filter(
    (c) => Math.abs(c.timecodeSec - currentTimeSec) < 1.8
  );
  const activeSelectedComment = reviewComments.find((c) => c.id === activeCommentId);

  // Current version item
  const currentVersion = versions.find((v) => v.id === currentVersionId) || versions[versions.length - 1];

  // Handle canvas click to place a markup
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMarkupMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newMarkup: ReviewComment["markup"] = {
      type: markupTool,
      color: markupColor,
      coords: markupTool === "box" 
        ? { x: Math.max(10, x - 15), y: Math.max(10, y - 12), width: 30, height: 24 }
        : { x, y }
    };

    setDraftMarkup(newMarkup);
    setIsNewCommentModalOpen(true);
  };

  // Submit comment
  const handleSubmitNewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (onAddComment) {
      onAddComment({
        text: newCommentText.trim(),
        category: newCommentCategory,
        markup: draftMarkup || undefined,
      });
    }
    setNewCommentText("");
    setIsNewCommentModalOpen(false);
    setDraftMarkup(null);
    setIsMarkupMode(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-b border-slate-800/80 select-none relative">
      {/* Canvas Header & Toolbar */}
      <div className="h-10 px-3 bg-slate-900/95 border-b border-slate-800/90 flex items-center justify-between text-xs shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">主监视器</span>
          </span>

          {/* Timecode Badge */}
          <span className="text-indigo-300 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-medium">
            {formatTimecode(currentTimeSec)} / {formatTimecode(durationSec)}
          </span>

          {/* Version Stack Dropdown (Frame.io 经典版本堆栈) */}
          <div className="relative">
            <button
              onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800/90 border border-slate-700/80 text-[11px] text-slate-200 transition-all cursor-pointer"
              title="版本堆栈：切换历史工程版本与审阅快照"
            >
              <GitBranch className="w-3 h-3 text-cyan-400" />
              <span className="font-medium">{currentVersion?.version || "v2.1"}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded ${
                currentVersion?.status === "approved" 
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800" 
                  : currentVersion?.status === "reviewing"
                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                  : "bg-slate-800 text-slate-300"
              }`}>
                {currentVersion?.status === "approved" ? "已定稿" : currentVersion?.status === "reviewing" ? "审片中" : "初稿"}
              </span>
            </button>

            {isVersionDropdownOpen && (
              <div className="absolute top-8 left-0 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center justify-between border-b border-slate-800">
                  <span>版本堆栈 (Version Stacks)</span>
                  <span className="text-indigo-400">共 {versions.length} 个快照</span>
                </div>
                {versions.map((ver) => (
                  <button
                    key={ver.id}
                    onClick={() => {
                      onSelectVersion?.(ver.id);
                      setIsVersionDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex flex-col gap-0.5 cursor-pointer ${
                      ver.id === currentVersion?.id
                        ? "bg-indigo-950/80 border border-indigo-700 text-white"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-300">{ver.version} · {ver.label}</span>
                      <span className="text-[10px] text-slate-400">{ver.createdAt.slice(11)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{ver.changesSummary}</p>
                    <span className="text-[9px] text-slate-500">作者：{ver.author}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display modes & Review Markup Controls */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* 上下屏显示切换与多布局模式 (恢复并强化用户指定功能) */}
          <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800">
            <button
              id="btn-layout-toggle-stacked"
              onClick={() => {
                if (layoutMode === "stacked") {
                  onLayoutModeChange?.("three-column");
                } else {
                  onLayoutModeChange?.("stacked");
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === "stacked"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-amber-950/60 text-amber-300 border border-amber-800/80 hover:bg-amber-900/60"
              }`}
              title={
                layoutMode === "stacked"
                  ? "当前为上下屏模式，点击切回左右分栏"
                  : "点击切换为上下屏显示（上方大屏监视器，下方文稿剪辑与时间轴）"
              }
            >
              {layoutMode === "stacked" ? (
                <>
                  <Columns3 className="w-3.5 h-3.5 text-indigo-200" />
                  <span>切回左右分栏</span>
                </>
              ) : (
                <>
                  <Rows3 className="w-3.5 h-3.5 text-amber-300" />
                  <span>上下屏切换</span>
                </>
              )}
            </button>

            {/* Quick focus monitor mode */}
            <button
              id="btn-layout-focus-monitor"
              onClick={() => {
                if (layoutMode === "focus-monitor") {
                  onLayoutModeChange?.("three-column");
                } else {
                  onLayoutModeChange?.("focus-monitor");
                }
              }}
              className={`p-1 rounded text-xs transition-all cursor-pointer ${
                layoutMode === "focus-monitor"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
              title={layoutMode === "focus-monitor" ? "退出纯监视器全屏" : "全画幅焦点监视器模式"}
            >
              <Expand className="w-3 h-3" />
            </button>
          </div>

          {/* Canvas Markup Toggle (Frame.io / 分秒帧画笔) */}
          <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800">
            <button
              onClick={() => setIsMarkupMode(!isMarkupMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                isMarkupMode
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
              title="开启/关闭画面画笔与批注工具"
            >
              <Pencil className="w-3 h-3 text-amber-300" />
              <span>画笔批注</span>
            </button>

            {isMarkupMode && (
              <div className="flex items-center gap-1 pl-1 ml-1 border-l border-slate-800 animate-fade-in">
                <button
                  onClick={() => setMarkupTool("box")}
                  className={`p-1 rounded cursor-pointer ${markupTool === "box" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
                  title="矩形选框标注"
                >
                  <Square className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setMarkupTool("arrow")}
                  className={`p-1 rounded cursor-pointer ${markupTool === "arrow" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
                  title="指示箭头标注"
                >
                  <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setMarkupTool("pin")}
                  className={`p-1 rounded cursor-pointer ${markupTool === "pin" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
                  title="图钉坐标标注"
                >
                  <MapPin className="w-3 h-3" />
                </button>

                {/* Color swatches */}
                <div className="flex items-center gap-1 pl-1">
                  {["#f59e0b", "#a855f7", "#ef4444", "#10b981"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setMarkupColor(c)}
                      className={`w-2.5 h-2.5 rounded-full border ${markupColor === c ? "ring-2 ring-white scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* External Review Share Button */}
          {onOpenShareReview && (
            <button
              onClick={onOpenShareReview}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-xs text-indigo-200 font-medium transition-all cursor-pointer shadow-xs"
              title="生成 Frame.io / 分秒帧免登录外审分享短链接"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">外审分享</span>
            </button>
          )}

          {/* 16:9 / 9:16 Aspect Ratio */}
          <button
            id="btn-toggle-aspect"
            onClick={onAspectRatioToggle}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              aspectRatio === "9:16"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title="切换 16:9 横屏 4K / 9:16 竖屏短视频画幅"
          >
            {aspectRatio === "9:16" ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>9:16</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>16:9</span>
              </>
            )}
          </button>

          {/* A/B Split Comparison */}
          <button
            id="btn-toggle-split"
            onClick={onToggleSplitView}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              isSplitView
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-medium"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title="A/B 差异对比：原片 vs Agent 处理后"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">A/B对比</span>
          </button>

          {/* Safe Zone */}
          <button
            id="btn-toggle-safezone"
            onClick={onToggleSafeZone}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              showSafeZone
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title="抖音/视频号/TikTok UI 交互安全区遮挡校验网格"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">安全区</span>
          </button>

          {/* Zoom toggle button */}
          <button
            onClick={() => setIsEnlarged(!isEnlarged)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              isEnlarged
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/50 font-medium"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title="放大视窗"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{isEnlarged ? "标准" : "放大"}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div 
        className={`flex-1 min-h-[260px] flex items-center justify-center p-3 sm:p-5 relative bg-slate-950 overflow-hidden w-full ${isMarkupMode ? "cursor-crosshair" : ""}`}
      >
        {/* Dynamic Aspect Ratio Container */}
        <div
          onClick={handleCanvasClick}
          className={`relative transition-all duration-300 rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl flex items-center justify-center bg-slate-900 ${
            aspectRatio === "9:16"
              ? isEnlarged
                ? "h-full max-h-[580px] aspect-[9/16] w-auto max-w-[340px] min-w-[220px]"
                : "h-full max-h-[500px] aspect-[9/16] w-auto max-w-[290px] min-w-[200px]"
              : isEnlarged
                ? "w-full max-w-[1100px] 2xl:max-w-[1300px] aspect-video max-h-[calc(100%-8px)]"
                : "w-full max-w-[900px] xl:max-w-[1040px] aspect-video max-h-[calc(100%-8px)]"
          }`}
        >
          {/* Simulated Video Content Screen */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Background Studio Light Graphic */}
            <div className="absolute -top-10 -left-10 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl" />

            {/* Brand / Review Anti-Leak Watermark (分秒帧/Frame.io 经典安全明水印) */}
            {brandKit?.watermarkEnabled && (
              <div 
                className={`absolute z-20 pointer-events-none text-slate-400 font-mono tracking-wider select-none ${
                  brandKit.watermarkPosition === "top-right" ? "top-3 right-4 text-[11px]" :
                  brandKit.watermarkPosition === "top-left" ? "top-3 left-4 text-[11px]" :
                  brandKit.watermarkPosition === "bottom-right" ? "bottom-12 right-4 text-[11px]" :
                  brandKit.watermarkPosition === "center" ? "inset-0 flex items-center justify-center text-sm rotate-[-15deg]" :
                  "bottom-12 left-4 text-[11px]"
                }`}
                style={{ opacity: (brandKit.watermarkOpacity || 40) / 100 }}
              >
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/10 backdrop-blur-xs">
                  <Shield className="w-3 h-3 text-indigo-400" />
                  <span>{brandKit.watermarkText}</span>
                </div>
              </div>
            )}

            {/* Split Comparison Divider if enabled */}
            {isSplitView && (
              <div className="absolute inset-0 flex z-10 pointer-events-none">
                <div className="w-1/2 h-full border-r-2 border-amber-400 bg-slate-950/40 relative flex flex-col justify-between p-3 sm:p-4">
                  <span className="text-[11px] sm:text-xs font-bold text-amber-400 bg-amber-950/90 px-2.5 py-1 rounded-md border border-amber-800/70 self-start shadow-sm">
                    Original (原片)
                  </span>
                  <div className="text-xs sm:text-sm text-slate-300 text-center font-medium bg-slate-950/70 py-1.5 px-2 rounded backdrop-blur-sm border border-white/10">
                    原始粗剪：含口水词、无B-Roll覆盖
                  </div>
                </div>
                <div className="w-1/2 h-full bg-slate-900/20 relative flex flex-col justify-between p-3 sm:p-4">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/90 px-2.5 py-1 rounded-md border border-emerald-800/70 self-end shadow-sm">
                    Agent Processed (智能精修)
                  </span>
                  <div className="text-xs sm:text-sm text-emerald-300 text-center font-medium bg-slate-950/70 py-1.5 px-2 rounded backdrop-blur-sm border border-emerald-500/30">
                    精修：无口误、智能B-Roll、4K超分调色
                  </div>
                </div>
              </div>
            )}

            {/* Active Visual Scene */}
            {activeBrollClip ? (
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-indigo-950/50 border border-indigo-500/30 p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center mb-2 sm:mb-3 animate-pulse shadow-lg">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-300" />
                </div>
                <span className="text-xs sm:text-base font-semibold text-indigo-200">
                  {activeBrollClip.name}
                </span>
                <span className="text-[11px] sm:text-xs text-indigo-300 mt-1.5 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/60 font-medium">
                  🎬 B-Roll 视觉概念镜头覆盖中 (掩盖跳切口)
                </span>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800/95 border-2 border-slate-700/80 flex items-center justify-center text-slate-200 mb-2 sm:mb-3 shadow-2xl">
                  <span className="text-2xl sm:text-3xl">🎙️</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  {activeVideoClip ? activeVideoClip.name : "时间轴空隙 / 黑场"}
                </span>
                {activeVideoClip?.isCutPoint && (
                  <span className="text-[11px] sm:text-xs text-amber-300 mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60 font-mono shadow-sm">
                    ✂️ 口水词已修剪切除点
                  </span>
                )}
              </div>
            )}

            {/* Subtitles Overlay */}
            {activeSubtitle?.text && (
              <div className="absolute bottom-4 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-6 z-20 flex justify-center pointer-events-none">
                <div className="bg-black/85 backdrop-blur-md px-4 py-2 sm:py-2.5 rounded-lg border border-yellow-400/30 text-center max-w-[92%] shadow-2xl">
                  <p className="text-xs sm:text-base font-bold text-yellow-300 tracking-wide leading-relaxed drop-shadow">
                    {activeSubtitle.text}
                  </p>
                </div>
              </div>
            )}

            {/* Existing Frame Markups Rendered on Canvas */}
            {nearbyComments.map((com) => {
              if (!com.markup) return null;
              const isSelected = com.id === activeCommentId;
              const { coords, color, type } = com.markup;

              return (
                <div
                  key={com.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComment?.(com.id);
                  }}
                  className={`absolute z-30 transition-all pointer-events-auto cursor-pointer ${
                    isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : ""
                  }`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    width: coords.width ? `${coords.width}%` : "auto",
                    height: coords.height ? `${coords.height}%` : "auto",
                  }}
                  title={`[${com.author.name}]: ${com.text}`}
                >
                  {type === "box" && (
                    <div 
                      className="w-full h-full rounded border-2 border-dashed flex items-start justify-end p-1 animate-pulse"
                      style={{ borderColor: color, backgroundColor: `${color}15` }}
                    >
                      <span 
                        className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white shadow-xs"
                        style={{ backgroundColor: color }}
                      >
                        {com.author.role === "client" ? "客户" : com.author.role === "director" ? "导演" : "合规"}
                      </span>
                    </div>
                  )}

                  {type === "pin" && (
                    <div className="relative -translate-x-1/2 -translate-y-full flex flex-col items-center group">
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-white"
                        style={{ backgroundColor: color }}
                      >
                        📍
                      </div>
                      <div className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap mt-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {com.text}
                      </div>
                    </div>
                  )}

                  {type === "arrow" && (
                    <div className="relative flex items-center gap-1 font-bold text-xs" style={{ color }}>
                      <ArrowUpRight className="w-8 h-8 drop-shadow-md animate-bounce" />
                      <span className="bg-slate-950/90 px-2 py-0.5 rounded border border-white/20 text-[10px]">
                        {com.text.slice(0, 16)}...
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Draft Markup when user clicks canvas in Markup Mode */}
            {draftMarkup && (
              <div
                className="absolute z-40 pointer-events-none"
                style={{
                  left: `${draftMarkup.coords.x}%`,
                  top: `${draftMarkup.coords.y}%`,
                  width: draftMarkup.coords.width ? `${draftMarkup.coords.width}%` : "auto",
                  height: draftMarkup.coords.height ? `${draftMarkup.coords.height}%` : "auto",
                }}
              >
                <div 
                  className="w-full h-full rounded border-2 border-amber-400 bg-amber-400/20 flex items-center justify-center text-amber-200 text-xs font-semibold animate-pulse"
                >
                  📍 标注选区
                </div>
              </div>
            )}

            {/* Safe Zone Overlay Guideline for TikTok / Douyin */}
            {showSafeZone && aspectRatio === "9:16" && (
              <div className="absolute inset-0 pointer-events-none z-30 border-2 border-dashed border-emerald-500/50 flex flex-col justify-between p-3 text-[10px] text-emerald-400 font-mono">
                <div className="flex justify-between items-center opacity-85">
                  <span>TOP SAFE (顶端安全线)</span>
                  <span>1080x1920</span>
                </div>
                <div className="self-end flex flex-col gap-2 opacity-75 mr-1 text-center">
                  <div className="w-6 h-6 rounded-full border border-emerald-500 flex items-center justify-center text-xs">♥</div>
                  <div className="w-6 h-6 rounded-full border border-emerald-500 flex items-center justify-center text-xs">💬</div>
                  <div className="w-6 h-6 rounded-full border border-emerald-500 flex items-center justify-center text-xs">➔</div>
                </div>
                <div className="text-center opacity-85 bg-emerald-950/80 py-1 rounded border border-emerald-800/60 text-[10px]">
                  BOTTOM SAFE ZONE (避开文案与底栏 180px)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Modal: New Review Comment Prompt upon Canvas Click */}
      {isNewCommentModalOpen && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-fade-in text-slate-100">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-amber-300">
              <Pencil className="w-3.5 h-3.5" />
              <span>添加此帧 ({formatTimecode(currentTimeSec)}) 审阅批注</span>
            </span>
            <button
              onClick={() => {
                setIsNewCommentModalOpen(false);
                setDraftMarkup(null);
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleSubmitNewComment} className="mt-3 space-y-2.5">
            <input
              type="text"
              autoFocus
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="例如：这里人物口水词切除 / 替换科技感 B-Roll / 字幕调高避开安全区..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">类型:</span>
                <select
                  value={newCommentCategory}
                  onChange={(e) => setNewCommentCategory(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200"
                >
                  <option value="cut">✂️ 剪辑/气口</option>
                  <option value="broll">🎬 B-Roll画面</option>
                  <option value="audio">🎵 音效配乐</option>
                  <option value="subtitle">💬 花字字幕</option>
                  <option value="brand_vi">🏢 品牌VI规范</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>保存并提交给 Agent</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Media Playback & Scrubber Control Bar with Review Comment Marker Dots */}
      <div className="h-12 px-4 bg-slate-900 border-t border-slate-800 flex flex-col justify-center text-xs">
        {/* Scrubber track with markers */}
        <div className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer mb-2 group">
          {/* Progress bar */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
            style={{ width: `${(currentTimeSec / durationSec) * 100}%` }}
          />

          {/* Click to seek full overlay */}
          <input
            type="range"
            min={0}
            max={durationSec}
            step={0.04}
            value={currentTimeSec}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {/* Frame.io / 分秒帧 关键帧批注图钉 (Comment Pins on Timeline) */}
          {reviewComments.map((com) => {
            const leftPct = (com.timecodeSec / durationSec) * 100;
            const isSelected = com.id === activeCommentId;
            return (
              <div
                key={com.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(com.timecodeSec);
                  onSelectComment?.(com.id);
                }}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-2.5 h-2.5 rounded-full cursor-pointer transition-transform hover:scale-150 ${
                  isSelected ? "ring-2 ring-white scale-125" : ""
                }`}
                style={{ 
                  left: `${leftPct}%`,
                  backgroundColor: com.markup?.color || "#f59e0b"
                }}
                title={`[${com.author.name} ${com.timecodeSec.toFixed(1)}s]: ${com.text}`}
              />
            );
          })}
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Step 1 frame back */}
            <button
              onClick={() => onSeek(Math.max(0, currentTimeSec - 0.04))}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
              title="后退一帧 (1 Frame / 0.04s)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play/Pause toggle */}
            <button
              id="btn-play-toggle"
              onClick={onPlayToggle}
              className="w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              title={isPlaying ? "暂停 (空格键)" : "播放 (空格键)"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
            </button>

            {/* Step 1 frame forward */}
            <button
              onClick={() => onSeek(Math.min(durationSec, currentTimeSec + 0.04))}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
              title="前进一帧 (1 Frame / 0.04s)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Reset to Start */}
            <button
              onClick={() => onSeek(0)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
              title="跳至开头"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Time indicator */}
            <div className="font-mono text-slate-300 text-[11px] ml-1">
              <span className="text-indigo-400 font-medium">{currentTimeSec.toFixed(1)}s</span>
              <span className="text-slate-500"> / {durationSec.toFixed(0)}s</span>
            </div>

            {/* Comment counter indicator */}
            {reviewComments.length > 0 && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/50">
                💬 {reviewComments.length} 条批注
              </span>
            )}
          </div>

          {/* Right audio & fullscreen */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
              title={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
