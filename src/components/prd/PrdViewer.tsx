import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  Share2,
  Copy,
  Check
} from "lucide-react";
import { PRD_SECTIONS, PrdSection } from "../../data/prdContent";

export const PrdViewer: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(PRD_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredSections = PRD_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keyPoints?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeSection = PRD_SECTIONS.find((s) => s.id === activeSectionId) || PRD_SECTIONS[0];

  const handleCopySection = () => {
    const textToCopy = `# ${activeSection.title}\n${activeSection.subtitle}\n\n${activeSection.content}\n\n## 核心要点:\n${activeSection.keyPoints?.join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-slate-950 text-slate-200 overflow-hidden select-text">
      {/* Left Sidebar Table of Contents */}
      <div className="w-72 sm:w-80 shrink-0 bg-slate-900/90 border-r border-slate-800 flex flex-col">
        <div className="p-3 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-xs text-slate-100">
              PRD 目录导航 (Table of Contents)
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索 PRD 章节或核心词..."
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredSections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer flex flex-col gap-1 ${
                activeSectionId === sec.id
                  ? "bg-indigo-600 text-white shadow-md font-medium"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold truncate">
                  {sec.title}
                </span>
                <span className="text-[10px] opacity-70 font-mono">0{idx + 1}</span>
              </div>
              <span className={`text-[11px] truncate ${activeSectionId === sec.id ? "text-indigo-100" : "text-slate-500"}`}>
                {sec.subtitle}
              </span>
            </button>
          ))}
        </div>

        {/* Document Info Card */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>版本号</span>
            <span className="font-mono text-slate-300">v2.4 (2026 Release)</span>
          </div>
          <div className="flex justify-between">
            <span>文档状态</span>
            <span className="text-emerald-400 font-medium">评审已通过 · 研发中</span>
          </div>
          <div className="flex justify-between">
            <span>设计原则</span>
            <span className="text-indigo-300">每一帧可控 · 每一刀可回滚</span>
          </div>
        </div>
      </div>

      {/* Main Document Content Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                  产品设计需求文档 (PRD)
                </span>
                <span className="text-xs text-slate-500">
                  FrameAgent Studio · 音视频智能剪辑平台系统
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                {activeSection.title}
              </h1>
              <p className="text-sm text-indigo-400 mt-1 font-medium">
                {activeSection.subtitle}
              </p>
            </div>

            <button
              onClick={handleCopySection}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-all cursor-pointer"
              title="复制当前章节 Markdown"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制章节</span>
                </>
              )}
            </button>
          </div>

          {/* Main Description */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            {activeSection.content}
          </div>

          {/* Key Strategic Points */}
          {activeSection.keyPoints && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>核心设计决策与落地要求 (Core Requirements)</span>
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {activeSection.keyPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800/90 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80 shrink-0 flex items-center justify-center font-mono text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="flex-1">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Tables */}
          {activeSection.tables && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>对比与指标矩阵 (Specifications Matrix)</span>
              </h3>

              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-semibold">
                      {activeSection.tables.headers.map((h, i) => (
                        <th key={i} className="p-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/70">
                    {activeSection.tables.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`p-3 text-slate-300 ${
                              cIdx === 0
                                ? "font-semibold text-slate-200 whitespace-nowrap"
                                : ""
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
