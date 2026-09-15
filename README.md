# FrameAgent Studio - Agent 原生音视频智能剪辑平台

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg?logo=express)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-API_v2.4-orange.svg?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<p align="center">
  <b>面向专业与商业创作者的 Agent 原生音视频剪辑平台</b><br/>
  突破黑盒生成局限，实现「<b>每一帧可控、每一刀可编辑、每一个动作可回滚</b>」的结构化时间线智能工作流与工业级评测体系。
</p>

</div>

---

## 📖 核心设计理念 (Core Vision)

在传统的 AI 视频生成方案中，“黑盒式端到端生成”往往面临无法局部微调、渲染极慢、无法满足商业化精度要求的痛点。

**FrameAgent Studio** 提出了 **Agent 原生音视频剪辑新范式**：
1. **拒绝黑盒生成，坚持结构化时间线**：LLM / 多模态模型不直接盲盒生成不可分割的视频流，而是输出严格结构化、具备事务原子性的 **时间线编辑指令集（Timeline Edit Actions）**。
2. **三维联动**：声（Audio Waveform）、画（Video Monitor Canvas）、文（Transcript Text）全局双向同步，像修改 Word 文档一样剪辑视频。
3. **确定性与人类可控（Human-in-the-Loop）**：每一个 Agent 提出的修改均支持 **版本对比（Timeline Diff）** 与 **一键回滚（One-Click Rollback）**，高风险操作需人工审批确认。

---

## 🧠 四层思考闭环架构 (4-Stage Cognitive Loop)

平台驱动的核心 Agent 严格遵循四层认知决策流，透明呈现于右侧智能副驾（Thought Stream）中：

```text
  ┌────────────────────────────────────────────────────────┐
  │                 1. Understand (素材深度感知)            │
  │  • 多模态音视频解构 • 说话人分离 (Diarization) • 爆款节奏识别 │
  └───────────────────────────┬────────────────────────────┘
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 2. Plan (拓扑任务分解)                  │
  │  • DAG 任务规划 • 时序依赖解析 • 风险分级评估 (Low/Med/High)│
  └───────────────────────────┬────────────────────────────┘
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 3. Execute (原子工具调度)               │
  │  • 无缝粗剪 • B-Roll 遮盖跳切 • 智能花字 • 伴奏避让 Ducking │
  └───────────────────────────┬────────────────────────────┘
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 4. Verify (确定性闭环质检)              │
  │  • 声画对齐检测 • 平台安全区校验 • 时长公差校验 • 穿帮告警 │
  └────────────────────────────────────────────────────────┘
```

---

## ✨ 核心功能特性 (Key Features)

### 1. 🎛️ 专业剪辑主工作台 (Master Studio Workspace)
- **宽幅三栏排布 / 灵活切换**：
  - **左侧文稿与资产面板**：集成文字驱动剪辑、B-Roll 候选素材池、片段属性检查器（Inspector）。
  - **中间高保真监视器**：支持 16:9 横屏 4K / 9:16 竖屏短视频一键切换，内置抖音/TikTok 界面安全区（Safe Zone）遮罩与原片对比（A/B Split View）。
  - **右侧 Agent 智能副驾**：实时输出结构化思考流、风险预警与原子操作清单。
- **专业多轨时间轴 (Multi-Track Timeline)**：
  - A-Roll 视频主轨、B-Roll 画面轨、智能字幕花字轨、背景音乐与音效轨（支持波形渲染）。
  - 支持多倍率缩放（`0.5x ~ 3.0x`）、磁吸对齐（Magnetic Snapping）、播放头毫秒级精确定位。
- **文字驱动视频剪辑 (Text-Driven Editing)**：
  - 自动高亮识别“呃、啊、其实”等无意义气口与口水词，支持一键剔除。
  - 金句与核心论点星标标记，点击文字段落即刻将播放头跳转至对应视频帧。

### 2. 🛡️ 动作对比、审核与一键回滚 (Action Diff & Rollback)
- **事务级变更记录**：每一次 Agent 操作均生成快照历史。
- **差异可视化（Visual Timeline Diff）**：清晰展现当前版本与前一版本之间的音视频轨增删、切片位移与参数变化。
- **无损一键回滚**：支持随时随地撤销单次操作或回退至历史任意安全节点。

### 3. 📑 完整系统架构与交互原型规范 (PRD & Wireframes)
- **内置工业级 PRD 文档**：涵盖业务痛点、系统全景、功能需求矩阵、数据流与风控机制。
- **交互线框图画板 (Interactive Wireframes)**：直观展现系统拓扑、工作台空间划分、思考流交互与回滚工作流。

### 4. 📊 Agent 效能与评测体系仪表盘 (Evaluation & Benchmark)
- **核心指标量化看板**：
  - **直接采纳率 (Direct Adoption Rate)**：衡量 Agent 建议无需修改直接应用的比例。
  - **微调率 (Minor Edit Ratio) & 重剪率 (Major Edit Ratio)**：反映人工接管深度。
  - **回滚率 (Rollback Rate)**：精准监控 Agent 幻觉与不当剪辑。
  - **确定性质检合规率 (Guardrail Pass Rate)**：声画同步、时长容差与安全区合规统计。
- **任务维度多维雷达图与耗时耗损分析**：清晰对比不同剪辑任务类型的质量与执行延迟。

---

## 🛠️ 技术栈 (Technology Stack)

| 领域 | 核心技术选型 | 说明 |
| :--- | :--- | :--- |
| **前端框架** | **React 19** + **TypeScript 5.8** | 保证严谨的类型系统与最新的并发渲染特性 |
| **样式与动画**| **Tailwind CSS v4** + **Motion** | 纯实用类高精排版、优雅过渡与微交互 |
| **构建工具** | **Vite 6** + **esbuild** | 秒级 HMR 极速响应，生产环境打包单文件 CommonJS 服务端 |
| **后端服务** | **Node.js** + **Express** + **tsx** | 提供安全代理 API 与服务端音视频智能任务调度 |
| **AI 认知引擎**| **@google/genai** (Google Gemini) | 驱动多模态理解、剪辑意图解析与结构化 JSON Schema 生成 |
| **图标库** | **lucide-react** | 统一、专业的工业软件风格图标库 |

---

## 📂 项目结构指南 (Directory Structure)

```text
├── server.ts                       # Express 后端服务 (集成 Gemini API 代理与 Fallback 调度)
├── index.html                      # 应用入口 HTML
├── metadata.json                   # 应用元数据配置
├── package.json                    # 依赖清单与脚本配置
├── src/
│   ├── main.tsx                    # React 应用挂载入口
│   ├── App.tsx                     # 根组件：视图导航、状态调度与回滚控制器
│   ├── index.css                   # Tailwind CSS v4 入口
│   ├── types.ts                    # 核心领域实体类型定义 (Tracks, Clips, AgentThought, Actions)
│   ├── data/
│   │   ├── mockData.ts             # 初始多轨时间线数据、评测指标与模型路由方案
│   │   ├── prdContent.ts           # 完整的系统 PRD 规范文档内容
│   │   └── wireframeContent.ts     # 系统交互线框图布局规范
│   └── components/
│       ├── Navbar.tsx              # 顶栏导航与工作区视图切换 (Studio/PRD/原型/评测)
│       ├── studio/                 # 主剪辑工作台模块
│       │   ├── VideoPlayer.tsx     # 高保真大监视器 (16:9 / 9:16 / 安全区 / A-B对比)
│       │   ├── TimelineEditor.tsx  # 多轨时间线编辑器 (音视频/字幕轨、刻度尺、缩放磁吸)
│       │   ├── TranscriptAssetPanel.tsx # 文稿剪辑、素材池与片段属性检查器
│       │   ├── AgentCopilot.tsx    # 智能副驾：四层思考流展示与一键快捷动作
│       │   ├── ActionDiffModal.tsx # 时间线变更差异比对与回滚弹窗
│       │   └── HumanApprovalBar.tsx# 人工确认与审批条
│       ├── prd/                    # PRD 体系视图
│       │   └── PrdViewer.tsx       # 交互式 PRD 规范阅读器
│       ├── wireframe/              # 交互线框图与原型展示模块
│       │   ├── WireframeViewer.tsx
│       │   ├── ArchitectureWireframe.tsx
│       │   ├── MasterStudioWireframe.tsx
│       │   ├── ThoughtStreamWireframe.tsx
│       │   └── TimelineDiffWireframe.tsx
│       └── eval/                   # 评测体系看板
│           └── EvalDashboard.tsx   # 采纳率/回滚率/耗时/雷达图多维效能评估
```

---

## 🚀 快速上手 (Quick Start)

### 1. 环境准备
- Node.js `18.0.0` 或更高版本
- npm `9.0.0` 或更高版本

### 2. 获取代码与安装依赖
```bash
# 克隆仓库
git clone https://github.com/your-username/frameagent-studio.git
cd frameagent-studio

# 安装依赖项
npm install
```

### 3. 配置环境变量
复制根目录下的 `.env.example` 并重命名为 `.env`：
```bash
cp .env.example .env
```
配置你的 Google Gemini API Key（可选；如不填写，系统将自动使用内置的确定性智能推理调度引擎）：
```env
GEMINI_API_KEY="your_google_gemini_api_key"
```

### 4. 启动本地开发服务
```bash
npm run dev
```
启动成功后，在浏览器中访问：`http://localhost:3000`

### 5. 生产环境构建与启动
```bash
# 构建前端静态文件与打包服务端 bundle
npm run build

# 启动生产服务
npm start
```

---

## 🔌 API 接口规范 (API Overview)

| 路径 | 方法 | 功能描述 | 核心入参 / 返回 |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | 检查后端健康状态与 Gemini API Key 状态 | 返回服务状态与时间戳 |
| `/api/agent/chat` | `POST` | Agent 意图推理与时间线编辑操作生成 | `{ prompt, currentTimeline, taskType }` -> 返回结构化 `AgentThought` |
| `/api/agent/quick-action` | `POST` | 预设高频原子剪辑动作执行（如清洗口水词、匹配 B-Roll） | `{ actionType, currentTracks }` -> 返回包含修改后时间线的 `AgentThought` |

---

## 🤝 参与贡献 (Contributing)

欢迎任何形式的贡献！请遵循以下流程：

1. **Fork** 本仓库
2. 创建您的功能特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的修改 (`git commit -m 'feat: add amazing new timeline track'`)
4. 推送分支至您的远程仓库 (`git push origin feature/amazing-feature`)
5. 新建一个 **Pull Request**

---

## 📄 开源许可证 (License)

本项目基于 [MIT License](LICENSE) 开源协议分发与使用。
