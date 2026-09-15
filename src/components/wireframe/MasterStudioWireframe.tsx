import React from "react";
import { 
  Play, 
  Scissors, 
  Layers, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  ShieldCheck, 
  Volume2, 
  Maximize2,
  FileCode,
  Download,
  CheckCircle2
} from "lucide-react";

interface MasterStudioWireframeProps {
  activeAreaIndex: number;
  onSelectArea: (index: number) => void;
}

export const MasterStudioWireframe: React.FC<MasterStudioWireframeProps> = ({
  activeAreaIndex,
  onSelectArea,
}) => {
  return (
    <div className="w-full bg-slate-950 border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl font-mono select-none">
      {/* Top Header Bar Wireframe (Area 0) */}
      <div 
        onClick={() => onSelectArea(0)}
        className={`h-11 px-3 border-b flex items-center justify-between transition-all cursor-pointer ${
          activeAreaIndex === 0
            ? "bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/50"
            : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
            FA
          </div>
          <span className="text-xs font-bold text-slate-200">FrameAgent Studio · [Master Studio]</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
            100% W x 54px H
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
            <span>视图: [工作台] [PRD] [线框图] [评测]</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-[10px] text-emerald-400 font-medium">
            [终审导出 OTIO/MP4]
          </div>
          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
            ①
          </span>
        </div>
      </div>

      {/* Middle Section: Left Assets (Area 1) + Center Video Canvas (Area 2) + Right Copilot (Area 4) */}
      <div className="flex flex-col lg:flex-row border-b border-slate-800 min-h-[300px]">
        {/* Left: Asset Library & Presets (Area 1) */}
        <div 
          onClick={() => onSelectArea(1)}
          className={`w-full lg:w-56 p-2.5 border-b lg:border-b-0 lg:border-r flex flex-col justify-between transition-all cursor-pointer ${
            activeAreaIndex === 1
              ? "bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/40"
              : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-300">素材与场景预设库</span>
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                ②
              </span>
            </div>

            {/* Mock clip files */}
            <div className="space-y-1.5 text-[10px]">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-blue-900/60 border border-blue-700 flex items-center justify-center text-[8px] text-blue-300">V</div>
                <span className="text-slate-300 truncate">访谈原片_4K_EP01.mp4</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-purple-900/60 border border-purple-700 flex items-center justify-center text-[8px] text-purple-300">B</div>
                <span className="text-slate-300 truncate">科技工作流_Broll_01.mov</span>
              </div>
            </div>

            {/* Presets List */}
            <div className="mt-3">
              <span className="text-[9px] text-slate-500 block mb-1">L2 场景一键卡片:</span>
              <div className="space-y-1 text-[9px]">
                <div className="p-1 rounded bg-slate-850 border border-slate-700/80 text-indigo-300">
                  ⚡ 30分钟访谈拆5条抖音爆款
                </div>
                <div className="p-1 rounded bg-slate-850 border border-slate-700/80 text-emerald-300">
                  ✂️ 无损消除口水词+插B-Roll
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 mt-2 border-t border-slate-800 pt-1">
            260px W · 拖拽上轨
          </div>
        </div>

        {/* Center: Video Canvas Monitor (Area 2) */}
        <div 
          onClick={() => onSelectArea(2)}
          className={`flex-1 p-3 flex flex-col justify-between transition-all cursor-pointer ${
            activeAreaIndex === 2
              ? "bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/40"
              : "bg-slate-950 hover:bg-slate-900/30"
          }`}
        >
          {/* Monitor Top Controls */}
          <div className="flex items-center justify-between text-[10px] pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">视频播放监视器 (Video Canvas)</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">00:00:14:08</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 text-[9px]">
                [16:9 / 9:16 自适应]
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 text-[9px]">
                [A/B 分屏对比]
              </span>
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                ③
              </span>
            </div>
          </div>

          {/* Canvas Viewport Wireframe drawing */}
          <div className="my-2 h-44 rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/80 relative flex items-center justify-center overflow-hidden">
            {/* Split comparison wireframe */}
            <div className="absolute inset-0 flex text-[9px]">
              <div className="w-1/2 border-r border-amber-500/60 bg-amber-950/10 p-2 flex flex-col justify-between text-amber-400/80">
                <span>[原片画面：口误未剪]</span>
                <span className="text-center opacity-50">原始素材视窗 (A)</span>
              </div>
              <div className="w-1/2 bg-emerald-950/10 p-2 flex flex-col justify-between text-emerald-400/80">
                <span className="self-end">[Agent精修：插B-Roll+4K超分]</span>
                <span className="text-center opacity-50">智能时间线视窗 (B)</span>
              </div>
            </div>

            {/* Safe zone wireframe overlay */}
            <div className="absolute inset-x-8 inset-y-3 border border-dashed border-emerald-500/40 rounded flex flex-col justify-between p-1 pointer-events-none text-[8px] text-emerald-400/70">
              <div className="flex justify-between">
                <span>顶端安全界限</span>
                <span>9:16 安全区</span>
              </div>
              <div className="text-center bg-black/60 py-0.5 rounded">
                底部 180px 避让文字与点赞组件
              </div>
            </div>
          </div>

          {/* Monitor Footer Transport controls */}
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white">▶ 播放</span>
              <span className="text-slate-400">0.04s 逐帧</span>
            </div>
            <span className="text-[9px] text-slate-500">Flex-1 W x 45% H</span>
          </div>
        </div>

        {/* Right: Agent Copilot Panel (Area 4) */}
        <div 
          onClick={() => onSelectArea(4)}
          className={`w-full lg:w-72 p-2.5 border-t lg:border-t-0 lg:border-l flex flex-col justify-between transition-all cursor-pointer ${
            activeAreaIndex === 4
              ? "bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/40"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-bold text-slate-200">Agent 智能副驾</span>
              </div>
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                ⑤
              </span>
            </div>

            {/* Wireframe Reasoning 4-step accordion */}
            <div className="space-y-1.5 text-[9px]">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center text-blue-300">
                <span>[1] 理解层: 识别8处口水词与停顿</span>
                <span>✓</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center text-indigo-300">
                <span>[2] 规划层: 5步 DAG 拓扑执行图</span>
                <span>✓</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-indigo-800 space-y-1">
                <div className="flex justify-between text-slate-200 font-bold">
                  <span>[3] 执行层: cut_filler + B-Roll</span>
                  <span className="text-amber-400">[可回滚]</span>
                </div>
                <div className="flex gap-1">
                  <span className="px-1 bg-slate-800 text-slate-400 rounded">[Diff对比]</span>
                  <span className="px-1 bg-amber-950 text-amber-300 rounded border border-amber-800">[一刀回滚]</span>
                </div>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center text-emerald-300">
                <span>[4] 验证层: 声画同步自查通过 (±18ms)</span>
                <span>✓</span>
              </div>
            </div>
          </div>

          {/* Wireframe Prompt input */}
          <div className="mt-2 pt-2 border-t border-slate-800">
            <div className="p-1.5 rounded bg-slate-950 border border-slate-700 text-[9px] text-slate-400 flex justify-between">
              <span>输入意图 (把访谈口水词剪掉...)</span>
              <span className="text-indigo-400">[发送]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Multi-Track Timeline Editor Wireframe (Area 3) */}
      <div 
        onClick={() => onSelectArea(3)}
        className={`p-3 transition-all cursor-pointer ${
          activeAreaIndex === 3
            ? "bg-indigo-950/70 border-t-2 border-indigo-500 ring-2 ring-indigo-500/40"
            : "bg-slate-950 border-t border-slate-800 hover:bg-slate-900/40"
        }`}
      >
        {/* Timeline Control Toolbar */}
        <div className="flex items-center justify-between text-[10px] pb-2 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">
              多轨非线性时间轴 (Multi-Track Timeline Core)
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-indigo-300">
              [剪刀分割] [删除] [缩放滑杆 100%] [单刀回滚]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400">
              每一刀可编辑 · 每一帧可控 · 每一操作可回滚
            </span>
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
              ④
            </span>
          </div>
        </div>

        {/* Timeline Ruler & Playhead Needle */}
        <div className="h-4 bg-slate-900/80 rounded border border-slate-800 relative flex items-center px-2 mb-1.5 text-[8px] text-slate-400 justify-between">
          <span>00:00:00</span>
          <span>00:00:15</span>
          <span className="text-rose-400 font-bold">▼ 00:00:24 (播放头)</span>
          <span>00:00:35</span>
          <span>00:00:45</span>
          <span>00:00:60</span>
        </div>

        {/* 4 Tracks Blueprint blocks */}
        <div className="space-y-1 text-[9px] relative">
          {/* Vertical playhead red line indicator across tracks */}
          <div className="absolute top-0 bottom-0 left-[42%] w-0.5 bg-rose-500 z-20 pointer-events-none opacity-80" />

          {/* Track 1: Video */}
          <div className="h-6 rounded bg-slate-900 border border-slate-800 flex items-center px-2 gap-1 overflow-hidden">
            <span className="w-18 shrink-0 text-slate-400 text-[8px] font-bold">主视频轨:</span>
            <div className="w-[30%] h-4 rounded bg-blue-900/50 border border-blue-600 flex items-center justify-center text-blue-200 truncate px-1">
              [访谈镜头 A]
            </div>
            <div className="w-[10%] h-4 rounded bg-rose-950/80 border border-rose-600 border-dashed flex items-center justify-center text-rose-300 text-[8px]">
              [已剔除口误]
            </div>
            <div className="w-[25%] h-4 rounded bg-blue-900/50 border border-blue-600 flex items-center justify-center text-blue-200 truncate px-1">
              [论点论述 B]
            </div>
            <div className="w-[28%] h-4 rounded bg-blue-900/50 border border-blue-600 flex items-center justify-center text-blue-200 truncate px-1">
              [核心总结 C]
            </div>
          </div>

          {/* Track 2: B-Roll */}
          <div className="h-6 rounded bg-slate-900 border border-slate-800 flex items-center px-2 gap-1 overflow-hidden">
            <span className="w-18 shrink-0 text-slate-400 text-[8px] font-bold">B-Roll 轨:</span>
            <div className="w-[38%] h-4 opacity-0" />
            <div className="w-[28%] h-4 rounded bg-purple-900/60 border border-purple-500 flex items-center justify-center text-purple-200 truncate px-1">
              ★ [科技工作流演示 B-Roll]
            </div>
          </div>

          {/* Track 3: Subtitles */}
          <div className="h-6 rounded bg-slate-900 border border-slate-800 flex items-center px-2 gap-1 overflow-hidden">
            <span className="w-18 shrink-0 text-slate-400 text-[8px] font-bold">智能字幕:</span>
            <div className="w-full h-4 rounded bg-emerald-950/60 border border-emerald-700 flex items-center px-2 text-emerald-300 text-[8px]">
              "每一帧可控、每一刀可编辑、每一个操作可回滚！" (ASR 毫秒级对齐)
            </div>
          </div>

          {/* Track 4: Audio */}
          <div className="h-6 rounded bg-slate-900 border border-slate-800 flex items-center px-2 gap-1 overflow-hidden">
            <span className="w-18 shrink-0 text-slate-400 text-[8px] font-bold">配乐音频:</span>
            <div className="w-full h-4 rounded bg-teal-950/60 border border-teal-700 flex items-center justify-between px-2 text-teal-300 text-[8px]">
              <span>BGM: Ambient_Pulse.wav (说话时自动避让 -16dB Ducking)</span>
              <span>|||||||..|||||||</span>
            </div>
          </div>
        </div>

        <div className="text-[8px] text-slate-500 mt-2 flex justify-between">
          <span>高可编辑性：支持拖拽拉伸片段边界、右键参数面板</span>
          <span>Flex-1 W x 55% H</span>
        </div>
      </div>
    </div>
  );
};
