import React, { useRef, useState } from "react";
import { 
  Scissors, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  Lock, 
  Eye, 
  Sparkles, 
  Sliders, 
  Undo2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { TimelineTrack, TimelineClip } from "../../types";

interface TimelineEditorProps {
  tracks: TimelineTrack[];
  currentTimeSec: number;
  durationSec: number;
  onSeek: (timeSec: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clip: TimelineClip | null) => void;
  onSplitClip: (clipId: string, splitTimeSec: number) => void;
  onDeleteClip: (clipId: string) => void;
  onRollbackAction: (actionId: string) => void;
  onUpdateClip: (updatedClip: TimelineClip) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  tracks,
  currentTimeSec,
  durationSec,
  onSeek,
  selectedClipId,
  onSelectClip,
  onSplitClip,
  onDeleteClip,
  onRollbackAction,
  onUpdateClip,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1); // 1 to 3
  const timelineRef = useRef<HTMLDivElement>(null);

  // Calculate pixel position per second
  // Base 100% width maps to durationSec
  const basePixelsPerSec = 14 * zoomLevel; // scale factor

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const totalWidth = timelineRef.current.scrollWidth;
    const newTime = Math.max(0, Math.min(durationSec, (clickX / totalWidth) * durationSec));
    onSeek(newTime);
  };

  // Find currently selected clip object
  let selectedClip: TimelineClip | null = null;
  for (const t of tracks) {
    const found = t.clips.find((c) => c.id === selectedClipId);
    if (found) {
      selectedClip = found;
      break;
    }
  }

  // Handle split selected clip
  const handleSplitCurrent = () => {
    if (selectedClip && currentTimeSec > selectedClip.startSec && currentTimeSec < selectedClip.startSec + selectedClip.durationSec) {
      onSplitClip(selectedClip.id, currentTimeSec);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t border-slate-800 select-none overflow-hidden">
      {/* Timeline Controls Header */}
      <div className="h-10 px-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between text-xs">
        {/* Left tools: Split, Delete, Select */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-timeline-split"
            onClick={handleSplitCurrent}
            disabled={!selectedClip}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
              selectedClip
                ? "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer"
                : "text-slate-600 bg-slate-900/50 cursor-not-allowed"
            }`}
            title="在播放头位置执行剪刀分割 (Split Clip)"
          >
            <Scissors className="w-3.5 h-3.5 text-indigo-400" />
            <span>分割刀</span>
          </button>

          <button
            id="btn-timeline-delete"
            onClick={() => selectedClip && onDeleteClip(selectedClip.id)}
            disabled={!selectedClip}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
              selectedClip
                ? "bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40 cursor-pointer"
                : "text-slate-600 cursor-not-allowed"
            }`}
            title="删除选中的片段"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>删除</span>
          </button>

          {selectedClip && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-[11px] text-slate-400">
              <span className="text-slate-200 font-medium truncate max-w-[140px]">
                选中: {selectedClip.name}
              </span>
              <span>
                [{selectedClip.startSec.toFixed(1)}s - {(selectedClip.startSec + selectedClip.durationSec).toFixed(1)}s]
              </span>
              {selectedClip.agentActionId && (
                <button
                  onClick={() => onRollbackAction(selectedClip!.agentActionId!)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 hover:bg-amber-900 text-[10px] cursor-pointer"
                >
                  <Undo2 className="w-3 h-3" />
                  回滚该刀
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right tools: Zoom & Rule notes */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 hidden md:inline">
            💡 原则：每一刀可编辑 · 每一帧可控 · 每一操作可回滚
          </span>

          <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
              title="缩小时间轴"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 w-8 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
              title="放大时间轴"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Track Workspace Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Headers (Static) */}
        <div className="w-48 sm:w-56 shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col z-20">
          {/* Ruler spacer */}
          <div className="h-7 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center text-[11px] font-medium text-slate-400">
            轨道名称 (5轨工程)
          </div>

          {/* Track Labels */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {tracks.map((track) => (
              <div
                key={track.id}
                style={{ height: `${track.height}px` }}
                className="px-3 border-b border-slate-800/70 flex items-center justify-between bg-slate-950 hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      track.type === "video"
                        ? "bg-blue-500"
                        : track.type === "broll"
                        ? "bg-purple-500"
                        : track.type === "subtitle"
                        ? "bg-emerald-500"
                        : "bg-teal-500"
                    }`}
                  />
                  <span className="text-xs text-slate-300 font-medium truncate">
                    {track.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-500">
                  <Eye className="w-3 h-3 hover:text-slate-300 cursor-pointer" />
                  <Lock className="w-3 h-3 hover:text-slate-300 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Track Area */}
        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-slate-950/60 custom-scrollbar cursor-pointer"
        >
          {/* Inner content sized by duration and zoom factor */}
          <div
            style={{ width: `${Math.max(800, durationSec * basePixelsPerSec)}px` }}
            className="relative h-full flex flex-col"
          >
            {/* Top Time Ruler */}
            <div className="h-7 bg-slate-900/80 border-b border-slate-800 relative flex items-center select-none pointer-events-none">
              {Array.from({ length: Math.ceil(durationSec / 5) + 1 }).map((_, idx) => {
                const sec = idx * 5;
                const leftPct = (sec / durationSec) * 100;
                return (
                  <div
                    key={idx}
                    style={{ left: `${leftPct}%` }}
                    className="absolute top-0 bottom-0 flex flex-col justify-between items-start pl-1 border-l border-slate-700/60"
                  >
                    <span className="text-[10px] font-mono text-slate-400">
                      {sec}s
                    </span>
                    <div className="h-1.5 w-px bg-slate-600" />
                  </div>
                );
              })}
            </div>

            {/* Playhead Red Needle Indicator */}
            <div
              style={{
                left: `${(currentTimeSec / durationSec) * 100}%`,
              }}
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-30 pointer-events-none transition-all duration-75 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
            >
              {/* Playhead top marker handle */}
              <div className="w-3 h-3 bg-rose-500 rounded-b-sm -ml-[5px] shadow-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Tracks Body */}
            <div className="flex-1 flex flex-col relative">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  style={{ height: `${track.height}px` }}
                  className="border-b border-slate-800/60 relative bg-slate-900/10 hover:bg-slate-900/20 transition-colors"
                >
                  {/* Render Clips on Track */}
                  {track.clips.map((clip) => {
                    const leftPct = (clip.startSec / durationSec) * 100;
                    const widthPct = (clip.durationSec / durationSec) * 100;
                    const isSelected = selectedClipId === clip.id;

                    return (
                      <div
                        key={clip.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClip(clip);
                        }}
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          top: "4px",
                          bottom: "4px",
                        }}
                        className={`absolute rounded px-2 flex flex-col justify-center text-xs overflow-hidden border cursor-pointer transition-all ${clip.color} ${
                          isSelected
                            ? "ring-2 ring-white border-white shadow-lg z-20"
                            : "opacity-90 hover:opacity-100 z-10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-slate-100 truncate text-[11px]">
                            {clip.name}
                          </span>

                          {clip.isAgentGenerated && (
                            <span className="shrink-0 flex items-center gap-0.5 text-[9px] px-1 rounded bg-indigo-900/90 text-indigo-200 border border-indigo-700">
                              <Sparkles className="w-2.5 h-2.5 text-indigo-300" />
                              Agent
                            </span>
                          )}
                        </div>

                        {/* Details text (subtitles or metadata) */}
                        {clip.text && (
                          <span className="text-[10px] text-slate-300 truncate opacity-90">
                            "{clip.text}"
                          </span>
                        )}

                        {track.type === "audio" && (
                          <div className="h-2 mt-1 w-full bg-teal-900/40 rounded flex items-center gap-0.5 overflow-hidden px-0.5 opacity-70">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div
                                key={i}
                                style={{ height: `${(i % 5) * 20 + 20}%` }}
                                className="w-1 bg-teal-400 rounded-xs"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
