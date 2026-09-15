import React, { useState } from "react";
import { 
  BarChart3, 
  Cpu, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Database, 
  Zap, 
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { EVALUATION_METRICS, MODEL_ROUTER_DATA } from "../../data/mockData";
import { ModelRouteItem, EvalMetric } from "../../types";

export const EvalDashboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [routerModels, setRouterModels] = useState<ModelRouteItem[]>(MODEL_ROUTER_DATA);
  const [selectedVideoModel, setSelectedVideoModel] = useState<string>("Google Veo");

  const categories = ["全部", "基础能力评测", "任务级评测", "用户采纳率评测"];

  const filteredMetrics =
    activeCategory === "全部"
      ? EVALUATION_METRICS
      : EVALUATION_METRICS.filter((m) => m.category === activeCategory);

  const handleSelectVideoModel = (provider: string) => {
    setSelectedVideoModel(provider);
    setRouterModels((prev) =>
      prev.map((m) => {
        if (m.capability === "视频生成") {
          return { ...m, isRecommended: m.provider.includes(provider) };
        }
        return m;
      })
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 sm:p-8 text-slate-200 custom-scrollbar select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                三层评测体系 & 数据飞轮
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Real-time Quality Telemetry
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Agent 评测方法论与 Model Router 监控看板
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              "采纳率反映能力对不对，修改深度反映粒度对不对，回滚率反映稳定性对不对" —— 创业公司的核心技术与数据壁垒
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>数据飞轮已接管 14,280+ 剪辑事务</span>
            </div>
          </div>
        </div>

        {/* Section 1: Three-Tier Evaluation Metrics */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                三层闭环评测指标矩阵 (Three-Tier Evaluation Framework)
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white font-medium shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredMetrics.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {m.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      目标: {m.targetValue}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-200 text-xs mb-1">
                    {m.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-snug mb-3">
                    {m.description}
                  </p>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-xl font-bold font-mono text-slate-100">
                    {m.currentValue}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    {m.trend === "up" ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>达成基准</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Data Flywheel Diagram */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 border border-indigo-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-sm text-slate-100">
                  数据飞轮闭环机制 (Data Flywheel Architecture)
                </h3>
                <p className="text-[11px] text-slate-400">
                  用户的每一次手动二次微调、剪刀补刀与单项回滚，自动转化为强化学习 Pairwise 训练集
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              Day 1 埋点闭环
            </span>
          </div>

          {/* Workflow Steps Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="w-6 h-6 rounded bg-blue-900/60 text-blue-300 flex items-center justify-center font-bold text-[11px] mb-1">
                1
              </div>
              <span className="font-semibold text-slate-200">创作者意图与交互埋点</span>
              <p className="text-[10px] text-slate-400">
                捕获用户自然语言 Prompt、时间线原始视频、以及 Agent 初始生成的粗剪 EDL 事务。
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="w-6 h-6 rounded bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-[11px] mb-1">
                2
              </div>
              <span className="font-semibold text-slate-200">修改深度与回滚标签化</span>
              <p className="text-[10px] text-slate-400">
                对比用户手动微调前后差异 (Diff)，提取剪切点偏差值 (ms) 与用户标注的回滚原因。
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="w-6 h-6 rounded bg-purple-900/60 text-purple-300 flex items-center justify-center font-bold text-[11px] mb-1">
                3
              </div>
              <span className="font-semibold text-slate-200">DPO / PPO 偏好对齐蒸馏</span>
              <p className="text-[10px] text-slate-400">
                将 (Agent初始方案, 创作者最终确认方案) 构造成对偏好数据，反向微调自研控制大模型。
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="w-6 h-6 rounded bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-bold text-[11px] mb-1">
                4
              </div>
              <span className="font-semibold text-slate-200">线上自适应更新</span>
              <p className="text-[10px] text-slate-400">
                提升长程语义理解与时间戳切口准确率，接管率持续下降，形成正向增强滚雪球。
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Model Router & Heterogeneous Dispatching */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-100">
                  Model Router 模型调度中心 (自研核心 + 三方外围路由)
                </h3>
                <p className="text-[11px] text-slate-400">
                  差异化的理解与时间线控制自研保持纵深；视频/音频生成按成本、延迟、质量三维动态调度
                </p>
              </div>
            </div>

            {/* Quick Generator Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">主视频生成路由:</span>
              {["Google Veo", "Runway", "Kling (可灵)"].map((prov) => (
                <button
                  key={prov}
                  onClick={() => handleSelectVideoModel(prov)}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
                    selectedVideoModel === prov
                      ? "bg-cyan-600 text-white shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>

          {/* Model Router Specs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold">
                  <th className="p-3">模型名称</th>
                  <th className="p-3">提供方</th>
                  <th className="p-3">专业分工与能力</th>
                  <th className="p-3 font-mono">成本 (美元/分)</th>
                  <th className="p-3 font-mono">平均延迟</th>
                  <th className="p-3 font-mono">质量评分 (0-100)</th>
                  <th className="p-3">调度状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {routerModels.map((m) => (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      m.isRecommended ? "bg-cyan-950/20" : "hover:bg-slate-850"
                    }`}
                  >
                    <td className="p-3 font-medium text-slate-100 flex items-center gap-2">
                      <span>{m.name}</span>
                      {m.isRecommended && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          Active Route
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300">{m.provider}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px]">
                        {m.capability}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-200">
                      ${m.costPerMin.toFixed(3)}
                    </td>
                    <td className="p-3 font-mono text-slate-200">
                      {m.avgLatencySec}s
                    </td>
                    <td className="p-3 font-mono">
                      <span className="text-emerald-400 font-bold">
                        {m.qualityScore}
                      </span>
                      <span className="text-slate-500 text-[10px]"> / 100</span>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        在线
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
