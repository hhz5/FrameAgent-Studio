import React from "react";
import { 
  Sparkles, 
  ArrowDown, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  Sliders,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

interface ThoughtStreamWireframeProps {
  activeAreaIndex: number;
  onSelectArea: (index: number) => void;
}

export const ThoughtStreamWireframe: React.FC<ThoughtStreamWireframeProps> = ({
  activeAreaIndex,
  onSelectArea,
}) => {
  return (
    <div className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-5 shadow-2xl font-mono select-none space-y-4">
      {/* Top Title & User Intent Header */}
      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
            AI
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">
              Agent 4层思维链展开态线框图 (4-Stage Reasoning Stream)
            </div>
            <div className="text-[10px] text-slate-400">
              意图输入: "把 30 分钟访谈剪成 1 条 58 秒抖音爆款知识切片，剔除口水词并在核心论点插 B-roll"
            </div>
          </div>
        </div>

        <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
          全链路透明决策
        </span>
      </div>

      {/* 4 Levels Vertical Pipeline Layout */}
      <div className="space-y-3 relative">
        {/* Step 1: Understand */}
        <div
          onClick={() => onSelectArea(0)}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeAreaIndex === 0
              ? "bg-indigo-950/60 border-blue-400 ring-2 ring-blue-500/40"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-200 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span className="text-xs font-bold text-blue-300">
                理解层 (Understand: 素材理解与意图提取)
              </span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800">
              置信度: 98.2%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] bg-slate-950 p-2.5 rounded border border-slate-800/80">
            <div>
              <span className="text-slate-500 block">说话人声学分析:</span>
              <span className="text-slate-200">双人深度访谈 · 语速 240字/分</span>
            </div>
            <div>
              <span className="text-slate-500 block">口误与停顿检测:</span>
              <span className="text-amber-400 font-bold">检测到 8 处无意词 (耗时 6.4s)</span>
            </div>
            <div>
              <span className="text-slate-500 block">核心论点区间:</span>
              <span className="text-indigo-300">03:14:00 - 04:12:00 (高密度)</span>
            </div>
          </div>
        </div>

        {/* Connector Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-4 h-4 text-indigo-400" />
        </div>

        {/* Step 2: Plan */}
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
                2
              </span>
              <span className="text-xs font-bold text-indigo-300">
                规划层 (Plan: 任务 DAG 拓扑拆解)
              </span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
              5 项原子拓扑
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-[9px]">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <span>① 粗剪论点区间</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <span>② 消除口水词气口</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <span>③ 插入科技 B-Roll</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <span>④ 逐字花字字幕</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-1 text-slate-300">
              <span>⑤ 智能降鸭配乐</span>
            </div>
          </div>
        </div>

        {/* Connector Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Step 3: Execute */}
        <div
          onClick={() => onSelectArea(2)}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeAreaIndex === 2
              ? "bg-indigo-950/60 border-cyan-400 ring-2 ring-cyan-500/40"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-900 text-cyan-200 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span className="text-xs font-bold text-cyan-300">
                执行层 (Execute: 工具调度与时间线事务 · 每一刀可回滚)
              </span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              非破坏性落地
            </span>
          </div>

          <div className="space-y-2 text-[10px]">
            {/* Action card 1 */}
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-bold text-slate-200">cut_filler (修剪口水词与空白)</span>
                  <span className="text-[9px] text-slate-500">[00:04 - 00:28]</span>
                </div>
                <span className="text-slate-400 text-[9px]">
                  剔除'那个'、'其实'、'呃'共 6 处无意音素 (缩短 4.2s)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-slate-850 border border-slate-700 text-indigo-300">
                  [查看 Diff]
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold flex items-center gap-1">
                  <RotateCcw className="w-2.5 h-2.5" />
                  一刀回滚
                </span>
              </div>
            </div>

            {/* Action card 2 */}
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-bold text-slate-200">insert_broll (论点支撑 B-Roll 自动插入)</span>
                  <span className="text-[9px] text-slate-500">[00:14 - 00:22]</span>
                </div>
                <span className="text-slate-400 text-[9px]">
                  插入工作流动态镜头覆盖主讲人跳切口 (Jump Cut Masking)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-slate-850 border border-slate-700 text-indigo-300">
                  [查看 Diff]
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold flex items-center gap-1">
                  <RotateCcw className="w-2.5 h-2.5" />
                  一刀回滚
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Connector Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Step 4: Verify */}
        <div
          onClick={() => onSelectArea(3)}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeAreaIndex === 3
              ? "bg-indigo-950/60 border-emerald-400 ring-2 ring-emerald-500/40"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center text-[10px] font-bold">
                4
              </span>
              <span className="text-xs font-bold text-emerald-300">
                验证层 (Verify: 多模态质检自查报告)
              </span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              全项通过 (Pass)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[9px] bg-slate-950 p-2.5 rounded border border-slate-800">
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>时长与安全区: 58.2s · 避让底部 180px</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>声画节拍同步: 误差 ±18ms · 呼吸感自然</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>商用合规: BGM已获授权 · 无违禁敏感词</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
