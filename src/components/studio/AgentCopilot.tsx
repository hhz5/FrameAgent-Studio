import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  SlidersHorizontal, 
  Layers, 
  Check, 
  ListOrdered, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { AgentThought, AgentAction, RiskLevel } from "../../types";
import { PRESET_SCENARIOS } from "../../data/mockData";

interface AgentCopilotProps {
  currentThought: AgentThought | null;
  isLoading: boolean;
  onExecutePrompt: (prompt: string, taskType?: string) => void;
  onRollbackAction: (actionId: string) => void;
  onOpenDiff: (action: AgentAction) => void;
  onAdoptAllActions: () => void;
}

export const AgentCopilot: React.FC<AgentCopilotProps> = ({
  currentThought,
  isLoading,
  onExecutePrompt,
  onRollbackAction,
  onOpenDiff,
  onAdoptAllActions,
}) => {
  const [inputText, setInputText] = useState("");
  const [isUnderstandExpanded, setIsUnderstandExpanded] = useState(true);
  const [isPlanExpanded, setIsPlanExpanded] = useState(true);
  const [isVerifyExpanded, setIsVerifyExpanded] = useState(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onExecutePrompt(inputText.trim());
    setInputText("");
  };

  const handleSelectPreset = (p: typeof PRESET_SCENARIOS[0]) => {
    setInputText(p.prompt);
    onExecutePrompt(p.prompt, p.taskType);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800 text-xs overflow-hidden">
      {/* Copilot Header */}
      <div className="h-10 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-indigo-400" />
          </div>
          <span className="font-semibold text-slate-200">Agent 剪辑智能副驾</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
            4-Stage Loop
          </span>
        </div>

        {currentThought && (
          <button
            onClick={onAdoptAllActions}
            className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-all cursor-pointer"
            title="采纳并应用当前 Agent 的全部时间线改动"
          >
            <Check className="w-3 h-3" />
            <span>全量采纳</span>
          </button>
        )}
      </div>

      {/* Preset High-frequency Scenarios */}
      <div className="p-3 bg-slate-900/50 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-400">
            高频 L2 标杆场景 (一键触发)
          </span>
          <span className="text-[10px] text-indigo-400 font-mono">可控 · 可编 · 可回滚</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {PRESET_SCENARIOS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              disabled={isLoading}
              className="text-left p-2 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-600/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-200 text-[11px] group-hover:text-indigo-300 transition-colors">
                  {p.title}
                </span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded border ${
                    p.riskLevel === "low"
                      ? "text-emerald-400 bg-emerald-950/60 border-emerald-800/50"
                      : p.riskLevel === "medium"
                      ? "text-amber-400 bg-amber-950/60 border-amber-800/50"
                      : "text-rose-400 bg-rose-950/60 border-rose-800/50"
                  }`}
                >
                  {p.riskLevel === "low" ? "确定性" : p.riskLevel === "medium" ? "候选创意" : "终审核准"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">
                {p.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Reasoning Stream & Actions */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {isLoading && (
          <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-800/60 text-center flex flex-col items-center justify-center gap-2 animate-pulse">
            <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-slate-200 font-medium text-xs">
              Agent 正在执行四层决策闭环...
            </span>
            <span className="text-[11px] text-indigo-300">
              [1.理解素材与论点 → 2.拓扑任务规划 → 3.时间线无损工具调度 → 4.多模态质量自查]
            </span>
          </div>
        )}

        {!isLoading && !currentThought && (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-lg text-slate-500">
            <Cpu className="w-8 h-8 text-slate-600 mb-2" />
            <p className="font-medium text-slate-400">等待创作者意图输入</p>
            <p className="text-[11px] mt-1 max-w-[240px]">
              输入诸如 "把访谈口水词修掉并在关键论点处插素材" 或选择上方场景
            </p>
          </div>
        )}

        {currentThought && (
          <>
            {/* Executive Summary Card */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-200">
                  执行概览 (Executive Summary)
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono font-bold ${
                    currentThought.riskLevel === "low"
                      ? "text-emerald-400 bg-emerald-950 border-emerald-800"
                      : currentThought.riskLevel === "medium"
                      ? "text-amber-400 bg-amber-950 border-amber-800"
                      : "text-rose-400 bg-rose-950 border-rose-800"
                  }`}
                >
                  风险等级: {currentThought.riskLevel}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {currentThought.summary}
              </p>
            </div>

            {/* 1. Understand (理解层) */}
            <div className="rounded-lg bg-slate-900/80 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setIsUnderstandExpanded(!isUnderstandExpanded)}
                className="w-full px-3 py-2 bg-slate-900 flex items-center justify-between text-left cursor-pointer hover:bg-slate-850"
              >
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  <span>理解层 (Understand)</span>
                </div>
                {isUnderstandExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>
              {isUnderstandExpanded && (
                <div className="p-2.5 pt-1.5 text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/40">
                  {currentThought.understand}
                </div>
              )}
            </div>

            {/* 2. Plan (规划层) */}
            <div className="rounded-lg bg-slate-900/80 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setIsPlanExpanded(!isPlanExpanded)}
                className="w-full px-3 py-2 bg-slate-900 flex items-center justify-between text-left cursor-pointer hover:bg-slate-850"
              >
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-indigo-900/60 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                  <span>规划层 (Plan: 任务 DAG 拆解)</span>
                </div>
                {isPlanExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>
              {isPlanExpanded && (
                <div className="p-2.5 pt-1.5 space-y-1.5 border-t border-slate-800/80 bg-slate-950/40">
                  {currentThought.plan.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Execute (执行层: 原子工具操作卡片) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-cyan-900/60 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                    3
                  </span>
                  <span>执行层 (Execute: 每一刀可回滚)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentThought.actions.length} 项事务
                </span>
              </div>

              {currentThought.actions.map((act) => (
                <div
                  key={act.id}
                  className={`p-2.5 rounded-lg border transition-all ${
                    act.status === "rolled_back"
                      ? "bg-slate-950/40 border-slate-800/40 opacity-60 line-through"
                      : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-200 text-xs">
                        {act.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {act.tool}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-indigo-400">
                      [{act.timeRange[0]}s - {act.timeRange[1]}s]
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-2 leading-snug">
                    {act.description}
                  </p>

                  {/* Operational Action Buttons: Rollback, Diff, Tweak */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      {/* Diff inspection */}
                      <button
                        onClick={() => onOpenDiff(act)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="查看前后时间线差量 Diff"
                      >
                        <Layers className="w-3 h-3 text-indigo-400" />
                        <span>查看 Diff</span>
                      </button>

                      {/* Tweak params */}
                      <button
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="微调此操作参数"
                      >
                        <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                        <span>微调参数</span>
                      </button>
                    </div>

                    {/* Rollback button */}
                    {act.status !== "rolled_back" ? (
                      <button
                        onClick={() => onRollbackAction(act.id)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/50 cursor-pointer font-medium"
                        title="一刀回滚：仅撤回此单项操作，不影响其他节点"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>一刀回滚</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 font-mono">已回滚还原</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Verify (验证质检层) */}
            <div className="rounded-lg bg-slate-900/80 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setIsVerifyExpanded(!isVerifyExpanded)}
                className="w-full px-3 py-2 bg-slate-900 flex items-center justify-between text-left cursor-pointer hover:bg-slate-850"
              >
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-emerald-900/60 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    4
                  </span>
                  <span>验证层 (Verify: 多模态自查质检)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    质检通过
                  </span>
                  {isVerifyExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </button>
              {isVerifyExpanded && (
                <div className="p-2.5 pt-1.5 space-y-2 border-t border-slate-800/80 bg-slate-950/40">
                  {currentThought.verification.checks.map((chk, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-slate-200">{chk.item}: </span>
                        <span className="text-slate-400">{chk.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Candidate Alternatives */}
            {currentThought.candidateSuggestions?.length > 0 && (
              <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/40">
                <span className="font-semibold text-indigo-300 text-[11px] block mb-1.5">
                  💡 候选分支方案 (选择权归人)
                </span>
                <div className="space-y-1">
                  {currentThought.candidateSuggestions.map((cand, i) => (
                    <button
                      key={i}
                      onClick={() => onExecutePrompt(`请切换为方案：${cand}`)}
                      className="w-full text-left p-1.5 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center justify-between cursor-pointer"
                    >
                      <span>{cand}</span>
                      <span className="text-indigo-400 font-mono">快速试算 ➔</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Natural Language Intent Input */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            id="input-agent-intent"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入剪辑意图（例如：把访谈里的口水词剪掉并在核心论点插素材）..."
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
          />
          <button
            id="btn-agent-send"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`px-3 py-2 rounded-lg flex items-center gap-1 font-medium transition-all ${
              inputText.trim() && !isLoading
                ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md shadow-indigo-600/30"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">执行意图</span>
          </button>
        </form>
      </div>
    </div>
  );
};
