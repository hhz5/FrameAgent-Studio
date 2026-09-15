import React from "react";
import { 
  GitCompare, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Database,
  ArrowRight,
  Sliders
} from "lucide-react";

interface TimelineDiffWireframeProps {
  activeAreaIndex: number;
  onSelectArea: (index: number) => void;
}

export const TimelineDiffWireframe: React.FC<TimelineDiffWireframeProps> = ({
  activeAreaIndex,
  onSelectArea,
}) => {
  return (
    <div className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-5 shadow-2xl font-mono select-none space-y-4">
      {/* Header Info */}
      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-xs font-bold text-slate-100">
              时间轴事务差异对比与单刀回滚线框图 (Timeline Diff & Rollback Inspector)
            </div>
            <div className="text-[10px] text-slate-400">
              目标动作: action_cut_003 · 无损剔除 8 处口水词与停顿 + 自动覆盖跳切
            </div>
          </div>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
          事务已挂起待签署
        </span>
      </div>

      {/* Before / After Dual Timeline Tracks Inspector (Area 0 & 1) */}
      <div 
        onClick={() => onSelectArea(0)}
        className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-3 ${
          activeAreaIndex === 0
            ? "bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/40"
            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span>时间轴变更前后微观差量可视化 (Visual Track Diff)</span>
          <span className="text-[9px] text-indigo-400 font-normal">毫秒级剪切点对比 (00:14.200 - 00:22.800)</span>
        </div>

        {/* 1. Track Before */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>[变更前 / Original Track v1.0] 原始连续音画素材</span>
            <span className="text-rose-400">8 处冗余气口 (总计耗时 6.4s)</span>
          </div>
          <div className="h-7 rounded bg-slate-950 border border-slate-800 flex items-center px-2 gap-1 text-[9px] overflow-hidden">
            <div className="w-[20%] h-4.5 rounded bg-slate-800 flex items-center justify-center text-slate-300">
              有效论述 A
            </div>
            <div className="w-[12%] h-4.5 rounded bg-rose-950/90 border border-rose-600 border-dashed flex items-center justify-center text-rose-300 text-[8px] animate-pulse">
              [停顿 1.2s]
            </div>
            <div className="w-[25%] h-4.5 rounded bg-slate-800 flex items-center justify-center text-slate-300">
              论述阐释 B
            </div>
            <div className="w-[10%] h-4.5 rounded bg-rose-950/90 border border-rose-600 border-dashed flex items-center justify-center text-rose-300 text-[8px] animate-pulse">
              [那个... 0.9s]
            </div>
            <div className="w-[33%] h-4.5 rounded bg-slate-800 flex items-center justify-center text-slate-300">
              有效论述 C
            </div>
          </div>
        </div>

        {/* 2. Track After */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>[变更后 / Agent Applied Track v1.1] 剔除口误并插入科技 B-Roll</span>
            <span className="text-emerald-400">紧凑语流 (压缩至 2.2s + 覆盖跳切)</span>
          </div>
          <div className="h-7 rounded bg-slate-950 border border-slate-800 flex items-center px-2 gap-1 text-[9px] overflow-hidden">
            <div className="w-[20%] h-4.5 rounded bg-blue-900/60 border border-blue-600 flex items-center justify-center text-blue-200">
              有效论述 A
            </div>
            <div className="w-[22%] h-4.5 rounded bg-purple-900/80 border border-purple-500 flex items-center justify-center text-purple-200 text-[8px] font-bold">
              ★ [B-Roll覆盖跳切]
            </div>
            <div className="w-[25%] h-4.5 rounded bg-blue-900/60 border border-blue-600 flex items-center justify-center text-blue-200">
              论述阐释 B
            </div>
            <div className="w-[33%] h-4.5 rounded bg-blue-900/60 border border-blue-600 flex items-center justify-center text-blue-200">
              有效论述 C
            </div>
          </div>
        </div>
      </div>

      {/* Flywheel Feedback Widget (Area 2) */}
      <div 
        onClick={() => onSelectArea(2)}
        className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-2 ${
          activeAreaIndex === 2
            ? "bg-indigo-950/60 border-amber-500 ring-2 ring-amber-500/40"
            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>数据飞轮回滚与调优标签 (Flywheel Feedback Capture)</span>
          </div>
          <span className="text-[9px] text-slate-400">若回滚，自动沉淀为 Pairwise 偏好训练集</span>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:border-amber-500">
            [标签: 误切了有效论点 (False Positive)]
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:border-amber-500">
            [标签: 语流节奏太快、缺少气口呼吸感]
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:border-amber-500">
            [标签: B-Roll 画面风格与演讲内容不搭]
          </span>
        </div>
      </div>

      {/* Transaction Actions Bar (Area 3) */}
      <div 
        onClick={() => onSelectArea(3)}
        className={`p-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
          activeAreaIndex === 3
            ? "bg-indigo-950/60 border-emerald-500 ring-2 ring-emerald-500/40"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>每一刀精准逆转：仅恢复此 8 处剪切，不影响后续字幕与调色工程</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded bg-amber-950/80 border border-amber-700 text-amber-300 font-bold flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
            一刀回滚此变更 (Revert)
          </div>
          <div className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            签署并采纳变更
          </div>
        </div>
      </div>
    </div>
  );
};
