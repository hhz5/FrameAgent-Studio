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
  Layers
} from "lucide-react";
import { TimelineClip } from "../../types";

interface TranscriptAssetPanelProps {
  currentTimeSec: number;
  onSeek: (timeSec: number) => void;
  selectedClip: TimelineClip | null;
  onRollbackAction?: (actionId: string) => void;
}

export const TranscriptAssetPanel: React.FC<TranscriptAssetPanelProps> = ({
  currentTimeSec,
  onSeek,
  selectedClip,
  onRollbackAction,
}) => {
  const [activeTab, setActiveTab] = useState<"transcript" | "assets" | "inspector">("transcript");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 select-none overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="h-9 px-2 sm:px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveTab("transcript")}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-t-md transition-all cursor-pointer font-medium text-xs border-b-2 ${
              activeTab === "transcript"
                ? "bg-slate-950 text-indigo-300 border-indigo-500"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>文稿剪辑</span>
            <span className="text-[10px] px-1 py-0.2 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
              5
            </span>
          </button>

          <button
            onClick={() => setActiveTab("assets")}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-t-md transition-all cursor-pointer font-medium text-xs border-b-2 ${
              activeTab === "assets"
                ? "bg-slate-950 text-indigo-300 border-indigo-500"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850"
            }`}
          >
            <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>素材库</span>
            <span className="text-[10px] px-1 py-0.2 rounded-full bg-slate-800 text-slate-400">
              4
            </span>
          </button>

          <button
            onClick={() => setActiveTab("inspector")}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-t-md transition-all cursor-pointer font-medium text-xs border-b-2 ${
              activeTab === "inspector"
                ? "bg-slate-950 text-indigo-300 border-indigo-500"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>检查器</span>
            {selectedClip && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
          <span>文字驱动 · 点击跳转</span>
        </div>
      </div>

      {/* Tab Content 1: Text-based Video Editing (Transcript) */}
      {activeTab === "transcript" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          {/* Search / Filter Sub-bar */}
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

            <div className="flex items-center gap-1 text-[10px] shrink-0">
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
                ★ 金句
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/50">
                ✂️ 剔除
              </span>
            </div>
          </div>

          {/* Transcript Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {transcriptSegments
              .filter(
                (seg) =>
                  seg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  seg.speaker.includes(searchQuery)
              )
              .map((seg) => {
                const isActive =
                  currentTimeSec >= seg.startSec && currentTimeSec < seg.endSec;

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
                    {/* Speaker Header */}
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
                        {isActive && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[9px] font-bold animate-pulse">
                            当前播放
                          </span>
                        )}
                      </div>

                      {/* Tag badges */}
                      <div className="flex items-center gap-1.5">
                        {seg.isHighlight && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            {seg.highlightTag}
                          </span>
                        )}
                        {seg.hasFiller && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/50 flex items-center gap-1">
                            <Scissors className="w-3 h-3 text-rose-400" />
                            口水词已处理
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dialogue Text */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                      {seg.text}
                    </p>

                    {/* Meta info / Action Hints */}
                    {(seg.fillerDetails || seg.brollSuggestion) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-[10px]">
                        {seg.fillerDetails && (
                          <span className="text-rose-400/90 font-mono">
                            ⚡ {seg.fillerDetails}
                          </span>
                        )}
                        {seg.brollSuggestion && (
                          <span className="text-indigo-400/90 font-mono">
                            🎬 {seg.brollSuggestion}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab Content 2: Assets & B-Roll Bin */}
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

      {/* Tab Content 3: Clip Inspector */}
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

              {/* Inspector Attributes Grid */}
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

              {/* Agent Attribution & Rollback */}
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
              <span>请在时间轴上点击选中任意视频、字幕或音频片段查看精细属性</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
