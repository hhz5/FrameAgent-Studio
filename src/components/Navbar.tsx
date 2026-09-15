import React from "react";
import { 
  Film, 
  FileText, 
  Layout, 
  BarChart3, 
  Cpu, 
  Download, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { AppViewMode } from "../types";

interface NavbarProps {
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  onOpenExport: () => void;
  hasGeminiKey: boolean;
  activeProjectName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenExport,
  hasGeminiKey,
  activeProjectName,
}) => {
  return (
    <header id="app-header" className="h-14 bg-slate-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      {/* Brand & Project */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-sm shadow-indigo-500/20 text-white font-bold">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-sm tracking-tight">FrameAgent</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
                Agent 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">音视频智能剪辑平台 · 意图到工程</p>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden md:block" />

        {/* Current Project Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-200">{activeProjectName}</span>
          <span className="text-slate-500 text-[10px]">4K 25fps · 00:01:00</span>
        </div>
      </div>

      {/* Main Mode Navigation */}
      <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800/80 text-xs">
        <button
          id="nav-tab-studio"
          onClick={() => onViewChange("studio")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            currentView === "studio"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>剪辑工作台</span>
        </button>

        <button
          id="nav-tab-prd"
          onClick={() => onViewChange("prd")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            currentView === "prd"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>产品需求文档 (PRD)</span>
        </button>

        <button
          id="nav-tab-wireframes"
          onClick={() => onViewChange("wireframes")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            currentView === "wireframes"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>交互线框原型</span>
        </button>

        <button
          id="nav-tab-evaluation"
          onClick={() => onViewChange("evaluation")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            currentView === "evaluation"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>评测与模型路由</span>
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Model Router Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>自研控制 + Router 就绪</span>
        </div>

        {/* Gemini status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-[11px]">
          {hasGeminiKey ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Gemini 3.8 AI
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400" title="可配置 GEMINI_API_KEY 开启云端真实大模型推理">
              <Sparkles className="w-3 h-3 text-amber-400" />
              智能推理引擎
            </span>
          )}
        </div>

        {/* Export Button */}
        <button
          id="btn-nav-export"
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-medium shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>终审导出</span>
        </button>
      </div>
    </header>
  );
};
