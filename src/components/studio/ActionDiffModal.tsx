import React, { useState } from "react";
import { X, Layers, RotateCcw, Check, Sparkles, AlertCircle } from "lucide-react";
import { AgentAction } from "../../types";

interface ActionDiffModalProps {
  action: AgentAction | null;
  onClose: () => void;
  onRollback: (actionId: string, feedbackReason?: string) => void;
}

export const ActionDiffModal: React.FC<ActionDiffModalProps> = ({
  action,
  onClose,
  onRollback,
}) => {
  const [selectedFeedback, setSelectedFeedback] = useState<string>("");

  if (!action) return null;

  const handleRollbackWithFlywheel = () => {
    onRollback(action.id, selectedFeedback || "用户手动微调回滚");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-sm text-slate-100">
              时间线事务增量差量 (Timeline Diff Inspection)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diff Content */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Action Overview Box */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-100">{action.title}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {action.tool}
                </span>
                <span className="text-[10px] text-slate-400">
                  目标轨道: {action.targetTrack}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{action.description}</p>
            </div>
            <div className="text-right font-mono text-[11px] text-indigo-400">
              影响范围: {action.timeRange[0]}s ~ {action.timeRange[1]}s
            </div>
          </div>

          {/* Visual Diff Comparison Tracks */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-slate-300">
              轨道结构差量对比 (Before vs After)
            </div>

            {/* Before */}
            <div className="p-3 rounded-lg bg-slate-950/70 border border-amber-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  变更前 (Previous Snapshot)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">原声声轨 / 未切分</span>
              </div>
              <div className="h-10 rounded bg-slate-900 border border-slate-800 relative flex items-center px-3 overflow-hidden">
                <div className="w-full h-4 bg-slate-700/40 rounded flex items-center justify-center text-[10px] text-slate-400">
                  原片连续音频段落 (含 8 处无意口水词与 1.2s 停顿)
                </div>
              </div>
            </div>

            {/* After */}
            <div className="p-3 rounded-lg bg-slate-950/70 border border-emerald-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  变更后 (Agent Applied Non-destructive)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">已优化切口 + 补充 B-Roll</span>
              </div>
              <div className="h-10 rounded bg-slate-900 border border-slate-800 relative flex items-center gap-1.5 px-2 overflow-hidden">
                <div className="w-[30%] h-6 bg-blue-600/40 border border-blue-500 rounded flex items-center justify-center text-[10px] text-blue-200">
                  有效说话语流 A
                </div>
                <div className="w-[8%] h-6 bg-rose-950/70 border border-rose-600/50 border-dashed rounded flex items-center justify-center text-[9px] text-rose-300">
                  已剔除
                </div>
                <div className="w-[35%] h-6 bg-purple-600/40 border border-purple-500 rounded flex items-center justify-center text-[10px] text-purple-200">
                  概念 B-Roll 覆盖
                </div>
                <div className="w-[27%] h-6 bg-blue-600/40 border border-blue-500 rounded flex items-center justify-center text-[10px] text-blue-200">
                  核心金句论点 B
                </div>
              </div>
            </div>
          </div>

          {/* Data Flywheel Tagging (Feedback for reinforcement) */}
          <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>数据飞轮与微调反馈 (Flywheel Labeling)</span>
            </div>
            <p className="text-[10px] text-slate-400">
              若执行回滚，系统将记录修改原因为偏好标注数据，持续反哺自研剪辑模型：
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "误切除了有效论点",
                "剪辑节奏过于仓促",
                "B-Roll 与文意不匹配",
                "字幕专有名词有误",
                "常规微调测试"
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedFeedback(reason)}
                  className={`px-2 py-1 rounded text-[10px] transition-all cursor-pointer ${
                    selectedFeedback === reason
                      ? "bg-indigo-600 text-white font-medium shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="h-14 px-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleRollbackWithFlywheel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800/80 font-medium transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>一刀回滚此项变更 (Revert)</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>保留并采纳</span>
          </button>
        </div>
      </div>
    </div>
  );
};
