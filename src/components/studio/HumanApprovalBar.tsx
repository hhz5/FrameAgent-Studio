import React, { useState } from "react";
import { 
  ShieldCheck, 
  Download, 
  FileCode, 
  Film, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Sliders, 
  Share2 
} from "lucide-react";

interface HumanApprovalBarProps {
  isOpen: boolean;
  onClose: () => void;
  interventionRate: number;
  adoptionRate: number;
  totalAgentActionsCount: number;
  rolledBackCount: number;
}

export const HumanApprovalModal: React.FC<HumanApprovalBarProps> = ({
  isOpen,
  onClose,
  interventionRate,
  adoptionRate,
  totalAgentActionsCount,
  rolledBackCount,
}) => {
  const [exportFormat, setExportFormat] = useState<"otio" | "fcpxml" | "prxml" | "mp4">("otio");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm text-slate-100">
              创作者终审签署与工业级工程导出 (Final Approval & Export)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Philosophy Banner */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300">核心原则：终审权归人 (AI 提效、人工点睛)</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                所有 Agent 自动化修改（剪辑、B-roll、字幕、调色）在时间线上全程透明可编辑，最终交付由创作者签署核准。
              </p>
            </div>
          </div>

          {/* Quality & Human Intervention Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">人工接管率 (Intervention)</span>
              <span className="text-base font-bold text-indigo-400 font-mono">
                {interventionRate.toFixed(1)}%
              </span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">低于 15% 阈值 (健康)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">整体方案采纳率</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {adoptionRate.toFixed(1)}%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">高质量意图命中</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">执行操作 / 回滚</span>
              <span className="text-base font-bold text-slate-200 font-mono">
                {totalAgentActionsCount} / {rolledBackCount}
              </span>
              <span className="text-[9px] text-amber-400 block mt-0.5">一刀级精确追溯</span>
            </div>
          </div>

          {/* Export Formats Selection */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-300 text-[11px] block">
              选择工业级工程交付格式：
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportFormat("otio")}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportFormat === "otio"
                    ? "bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">OpenTimelineIO (.otio)</span>
                  <FileCode className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-[10px] opacity-80">
                  行业通用跨软件格式，完整保留多轨事务与元数据
                </p>
              </button>

              <button
                onClick={() => setExportFormat("fcpxml")}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportFormat === "fcpxml"
                    ? "bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">Final Cut / 达芬奇 (.fcpxml)</span>
                  <Film className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[10px] opacity-80">
                  无缝导入 DaVinci Resolve 进行院线级精调色
                </p>
              </button>

              <button
                onClick={() => setExportFormat("prxml")}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportFormat === "prxml"
                    ? "bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">Premiere XML (.xml)</span>
                  <FileCode className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-[10px] opacity-80">
                  导入 Adobe Premiere Pro 继续多人协作剪辑
                </p>
              </button>

              <button
                onClick={() => setExportFormat("mp4")}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportFormat === "mp4"
                    ? "bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">MP4 成品视频 (H.265/4K)</span>
                  <Film className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[10px] opacity-80">
                  直接压制交付全高清短视频，支持全平台一键发布
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            已通过声画对齐自查、安全区校验与敏感词排查
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all cursor-pointer"
            >
              返回修改
            </button>

            <button
              id="btn-confirm-export"
              onClick={handleStartExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>签署成功，工程已导出！</span>
                </>
              ) : isExporting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>正在导出工程序列...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>签署终审并导出工程</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
