import React from "react";
import { 
  Workflow, 
  Cpu, 
  Database, 
  Layers, 
  ShieldCheck, 
  ArrowDown, 
  ArrowRight,
  Sparkles,
  GitBranch,
  RefreshCw
} from "lucide-react";

interface ArchitectureWireframeProps {
  activeAreaIndex: number;
  onSelectArea: (index: number) => void;
}

export const ArchitectureWireframe: React.FC<ArchitectureWireframeProps> = ({
  activeAreaIndex,
  onSelectArea,
}) => {
  return (
    <div className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-5 shadow-2xl font-mono select-none space-y-4">
      {/* Title */}
      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-xs font-bold text-slate-100">
              系统全链路架构拓扑与数据流向蓝图 (System Architecture Blueprint)
            </div>
            <div className="text-[10px] text-slate-400">
              意图驱动 · 事务级多轨控制 · Model Router 动态调度 · 数据飞轮对齐
            </div>
          </div>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          工业级架构规范
        </span>
      </div>

      {/* Layer 1: Creator Interaction Layer (Area 0) */}
      <div
        onClick={() => onSelectArea(0)}
        className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
          activeAreaIndex === 0
            ? "bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/40"
            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-900 text-indigo-200 flex items-center justify-center text-[10px] font-bold">
              L1
            </span>
            <span className="text-xs font-bold text-indigo-300">
              创作者交互与意图表达层 (Creator Interaction Layer)
            </span>
          </div>
          <span className="text-[9px] text-slate-400">Human Interface</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
            • 自然语言模糊意图输入 (Prompt)
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
            • 时间线打点与高光气泡标注
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
            • A/B 候选方案实时预览与对比
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center text-slate-600">
        <ArrowDown className="w-4 h-4 text-indigo-400" />
      </div>

      {/* Layer 2: Agent Orchestrator (Area 1) */}
      <div
        onClick={() => onSelectArea(1)}
        className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
          activeAreaIndex === 1
            ? "bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/40"
            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-900 text-indigo-200 flex items-center justify-center text-[10px] font-bold">
              L2
            </span>
            <span className="text-xs font-bold text-indigo-300">
              Agent 决策编排中枢 (Decision & Orchestration Engine)
            </span>
          </div>
          <span className="text-[9px] text-indigo-400">四层推理状态机</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px]">
          <div className="p-2 rounded bg-slate-950 border border-blue-800/80 text-blue-300 text-center font-bold">
            1. 理解 Understand
          </div>
          <div className="p-2 rounded bg-slate-950 border border-indigo-800/80 text-indigo-300 text-center font-bold">
            2. 规划 Plan (DAG)
          </div>
          <div className="p-2 rounded bg-slate-950 border border-cyan-800/80 text-cyan-300 text-center font-bold">
            3. 执行 Execute (事务)
          </div>
          <div className="p-2 rounded bg-slate-950 border border-emerald-800/80 text-emerald-300 text-center font-bold">
            4. 验证 Verify (质检)
          </div>
        </div>
      </div>

      {/* Arrow branching out */}
      <div className="flex justify-center text-slate-600">
        <ArrowDown className="w-4 h-4 text-cyan-400" />
      </div>

      {/* Layer 3: Dual Engine - Timeline Core (Area 2) + Model Router (Area 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Layer 3A: Non-Destructive Timeline Core */}
        <div
          onClick={() => onSelectArea(2)}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeAreaIndex === 2
              ? "bg-indigo-950/60 border-blue-400 ring-2 ring-blue-500/40"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-900 text-blue-200 flex items-center justify-center text-[9px] font-bold">
                3A
              </span>
              <span className="text-xs font-bold text-blue-300">
                非破坏性时间线核心 (OTIO Engine)
              </span>
            </div>
          </div>
          <div className="space-y-1 text-[9px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
            <div>• OpenTimelineIO (OTIO) 多轨工业标准</div>
            <div>• 事务性差量补丁 (JSON Transaction Diff)</div>
            <div>• 逐刀回滚栈 (Rollback Stack)</div>
            <div>• 毫秒级帧定位与实时音视频渲染</div>
          </div>
        </div>

        {/* Layer 3B: Model Router */}
        <div
          onClick={() => onSelectArea(3)}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeAreaIndex === 3
              ? "bg-indigo-950/60 border-cyan-400 ring-2 ring-cyan-500/40"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-900 text-cyan-200 flex items-center justify-center text-[9px] font-bold">
                3B
              </span>
              <span className="text-xs font-bold text-cyan-300">
                Model Router 异构多模型路由网关
              </span>
            </div>
          </div>
          <div className="space-y-1 text-[9px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
            <div>• <strong className="text-cyan-300">自研核心</strong>: 长视频语义理解 + 时间线控制</div>
            <div>• <strong className="text-slate-200">生成路由</strong>: Google Veo / Runway / Kling</div>
            <div>• <strong className="text-slate-200">语音路由</strong>: Whisper-v3 / ElevenLabs</div>
            <div>• 成本 ($/分) · 延迟 (s) · 质量 (Score) 动态权衡</div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center text-slate-600">
        <ArrowDown className="w-4 h-4 text-emerald-400" />
      </div>

      {/* Layer 4: Final Sign-off & Flywheel (Area 3) */}
      <div className="p-3.5 rounded-lg bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-emerald-300 text-xs">
              创作者终审签署与工业交付 (Human Final Approval & Export)
            </div>
            <div className="text-[10px] text-slate-400">
              终审权归人 · 导出 FCPXML / Premiere / OTIO / 4K MP4
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="text-right">
            <div className="text-indigo-300 font-bold text-[11px]">数据飞轮对齐闭环</div>
            <div className="text-[9px] text-slate-400">人工接管与回滚 ➔ Pairwise DPO 微调</div>
          </div>
        </div>
      </div>
    </div>
  );
};
