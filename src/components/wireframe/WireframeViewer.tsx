import React, { useState } from "react";
import { 
  Layout, 
  Layers, 
  GitBranch, 
  Info, 
  Compass, 
  Maximize2, 
  MousePointer, 
  Workflow, 
  Sliders,
  CheckCircle2,
  Cpu,
  FileCode,
  Eye
} from "lucide-react";
import { WIREFRAME_BLUEPRINTS, WireframeBlueprint } from "../../data/wireframeContent";
import { MasterStudioWireframe } from "./MasterStudioWireframe";
import { ThoughtStreamWireframe } from "./ThoughtStreamWireframe";
import { TimelineDiffWireframe } from "./TimelineDiffWireframe";
import { ArchitectureWireframe } from "./ArchitectureWireframe";

export const WireframeViewer: React.FC = () => {
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(
    WIREFRAME_BLUEPRINTS[0].id
  );
  const [activeAreaIndex, setActiveAreaIndex] = useState<number>(0);

  const currentBp =
    WIREFRAME_BLUEPRINTS.find((b) => b.id === selectedBlueprintId) ||
    WIREFRAME_BLUEPRINTS[0];

  const activeArea =
    currentBp.wireframeLayout.areas[activeAreaIndex] ||
    currentBp.wireframeLayout.areas[0];

  return (
    <div className="flex h-[calc(100vh-56px)] bg-slate-950 text-slate-200 overflow-hidden select-none">
      {/* Blueprint Selector Left Sidebar */}
      <div className="w-64 sm:w-72 shrink-0 bg-slate-900/90 border-r border-slate-800 flex flex-col">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-xs text-slate-100">
              线框原型与架构设计图
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">4 套蓝图</span>
        </div>

        {/* Blueprint List */}
        <div className="p-2 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          {WIREFRAME_BLUEPRINTS.map((bp) => (
            <button
              key={bp.id}
              onClick={() => {
                setSelectedBlueprintId(bp.id);
                setActiveAreaIndex(0);
              }}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all cursor-pointer flex flex-col gap-1 border ${
                selectedBlueprintId === bp.id
                  ? "bg-indigo-950/80 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50"
                  : "bg-slate-900 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[11px] truncate">
                  {bp.title}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {bp.category}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {bp.description}
              </p>
            </button>
          ))}
        </div>

        {/* Quick Legend Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-cyan-400" />
            <span>线框交互说明</span>
          </div>
          <p>• 点击中间线框图内各功能区域，可同步联动右侧或下方的组件交互规范</p>
          <p>• 严格遵循非线性剪辑工业级标准与四层闭环流转</p>
        </div>
      </div>

      {/* Main Blueprint Stage */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Stage Header */}
        <div className="h-12 px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{currentBp.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                Wireframe Blueprint
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              热区联动：点击图示任意区块切换组件细查
            </span>
          </div>
        </div>

        {/* Center: Interactive Visual Wireframe Blueprint Canvas & Specs */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Visual Wireframe Diagram */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
                <span>对应高保真线框原型图 (可交互点选区域)：</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                当前选中区域: [{activeArea.name}]
              </span>
            </div>

            {/* Render the specific visual wireframe for the selected blueprint */}
            <div className="relative">
              {selectedBlueprintId === "wf_master_studio" && (
                <MasterStudioWireframe
                  activeAreaIndex={activeAreaIndex}
                  onSelectArea={(idx) => setActiveAreaIndex(idx)}
                />
              )}

              {selectedBlueprintId === "wf_thought_stream" && (
                <ThoughtStreamWireframe
                  activeAreaIndex={activeAreaIndex}
                  onSelectArea={(idx) => setActiveAreaIndex(idx)}
                />
              )}

              {selectedBlueprintId === "wf_diff_rollback" && (
                <TimelineDiffWireframe
                  activeAreaIndex={activeAreaIndex}
                  onSelectArea={(idx) => setActiveAreaIndex(idx)}
                />
              )}

              {selectedBlueprintId === "wf_system_architecture" && (
                <ArchitectureWireframe
                  activeAreaIndex={activeAreaIndex}
                  onSelectArea={(idx) => setActiveAreaIndex(idx)}
                />
              )}
            </div>
          </div>

          {/* Quick Area Pill Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 mr-1 font-mono">快速热区切换:</span>
            {currentBp.wireframeLayout.areas.map((area, idx) => (
              <button
                key={idx}
                onClick={() => setActiveAreaIndex(idx)}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium text-[11px] flex items-center gap-1.5 ${
                  activeAreaIndex === idx
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-[9px] flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span>{area.name}</span>
              </button>
            ))}
          </div>

          {/* Active Area Deep Dive Inspector */}
          {activeArea && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-xs font-bold">
                    {activeAreaIndex + 1}
                  </div>
                  <span className="font-bold text-slate-100 text-sm">
                    {activeArea.name} · 结构与交互设计规范
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  尺寸规格: {activeArea.dimensions}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-300 block mb-1">
                    🎯 功能定位与核心职责
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {activeArea.role}
                  </p>

                  <span className="font-semibold text-slate-300 block mt-3 mb-1">
                    💡 设计考量与交互体验 (UX Notes)
                  </span>
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                    {activeArea.notes}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-300 block mb-1">
                    🧩 关联组件清单 (Component Tree)
                  </span>
                  <div className="space-y-1">
                    {activeArea.components.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-slate-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blueprint Global Annotations */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Workflow className="w-3.5 h-3.5 text-indigo-400" />
              <span>蓝图工程约束与非线性剪辑准则 (Engineering Constraints)</span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              {currentBp.annotations.map((ann, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono">•</span>
                  <span>{ann}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
