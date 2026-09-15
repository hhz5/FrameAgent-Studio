import React, { useState, useEffect } from "react";
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
  ZoomIn
} from "lucide-react";
import { TimelineTrack } from "../../types";

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
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);

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

  return (
    <div className="flex flex-col h-full bg-slate-950 border-b border-slate-800/80 select-none">
      {/* Canvas Header & Toolbar */}
      <div className="h-10 px-3 bg-slate-900/95 border-b border-slate-800/90 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span>主监视器</span>
          </span>
          <span className="text-indigo-300 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-medium">
            {formatTimecode(currentTimeSec)} / {formatTimecode(durationSec)}
          </span>
          {activeVideoClip?.speaker && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
              🎙️ {activeVideoClip.speaker}
            </span>
          )}
        </div>

        {/* Display modes & layout toggles */}
        <div className="flex items-center gap-1.5">
          {/* Workspace Layout Mode Switcher */}
          {onLayoutModeChange && (
            <div className="hidden sm:flex items-center bg-slate-950 rounded p-0.5 border border-slate-800 mr-1">
              <button
                onClick={() => onLayoutModeChange("three-column")}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  layoutMode === "three-column"
                    ? "bg-indigo-600 text-white font-medium shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="三栏专业剪辑台（左侧文稿 + 中间大监视器 + 右侧智能副驾）"
              >
                <Columns3 className="w-3 h-3" />
                <span className="hidden md:inline">三栏</span>
              </button>

              <button
                onClick={() => onLayoutModeChange("stacked")}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  layoutMode === "stacked"
                    ? "bg-indigo-600 text-white font-medium shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="上下分栏（大监视器居上 + 文稿居下）"
              >
                <Rows3 className="w-3 h-3" />
                <span className="hidden md:inline">上下</span>
              </button>

              <button
                onClick={() => onLayoutModeChange("focus-monitor")}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  layoutMode === "focus-monitor"
                    ? "bg-indigo-600 text-white font-medium shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="纯大监视器（最大化显示视频画面，收起文稿）"
              >
                <Expand className="w-3 h-3" />
                <span className="hidden md:inline">大屏</span>
              </button>
            </div>
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
                <span>9:16 竖版</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>16:9 横版</span>
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
            title="A/B 差异对比：原片 vs Agent 处理后 (调色/裁切/超分)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">A/B 对比</span>
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
            <span className="hidden lg:inline">{isEnlarged ? "标准尺寸" : "放大视窗"}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport Canvas (Enlarged & Responsively Scaled) */}
      <div className="flex-1 min-h-[260px] flex items-center justify-center p-3 sm:p-5 relative bg-slate-950 overflow-hidden w-full">
        {/* Dynamic Aspect Ratio Container */}
        <div
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

            {/* Split Comparison Divider if enabled */}
            {isSplitView && (
              <div className="absolute inset-0 flex z-10 pointer-events-none">
                <div className="w-1/2 h-full border-r-2 border-amber-400 bg-slate-950/40 relative flex flex-col justify-between p-3 sm:p-4">
                  <span className="text-[11px] sm:text-xs font-bold text-amber-400 bg-amber-950/90 px-2.5 py-1 rounded-md border border-amber-800/70 self-start shadow-sm">
                    Original (原片)
                  </span>
                  <div className="text-xs sm:text-sm text-slate-300 text-center font-medium bg-slate-950/70 py-1.5 px-2 rounded backdrop-blur-sm border border-white/10">
                    原始录制：含口水词、无B-Roll、平淡色彩
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
              // B-Roll is actively showing
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
              // Main Video Clip Visual
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

            {/* Subtitles Overlay - Generous typography & clean spacing */}
            {activeSubtitle?.text && (
              <div className="absolute bottom-4 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-6 z-20 flex justify-center pointer-events-none">
                <div className="bg-black/85 backdrop-blur-md px-4 py-2 sm:py-2.5 rounded-lg border border-yellow-400/30 text-center max-w-[92%] shadow-2xl">
                  <p className="text-xs sm:text-base font-bold text-yellow-300 tracking-wide leading-relaxed drop-shadow">
                    {activeSubtitle.text}
                  </p>
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
                {/* Right side interaction buttons representation */}
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

      {/* Media Playback Control Bar */}
      <div className="h-11 px-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
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
            className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            title={isPlaying ? "暂停 (空格键)" : "播放 (空格键)"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
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
  );
};
