export interface WireframeBlueprint {
  id: string;
  title: string;
  category: "布局线框" | "架构拓扑" | "状态流转";
  description: string;
  wireframeLayout: {
    areas: {
      name: string;
      role: string;
      dimensions: string;
      components: string[];
      notes: string;
    }[];
  };
  annotations: string[];
}

export const WIREFRAME_BLUEPRINTS: WireframeBlueprint[] = [
  {
    id: "wf_master_studio",
    title: "1. 核心工作台 (Studio Master) 高保真线框原型",
    category: "布局线框",
    description: "经典工业级三栏布局与非线性多轨时间轴结合，实现意图驱动、非破坏性编辑与即时视觉反馈。",
    wireframeLayout: {
      areas: [
        {
          name: "Top Navigation (顶栏)",
          role: "全局状态与项目切换",
          dimensions: "100% W x 54px H",
          components: ["项目名称", "视角切换(工作台/PRD/线框/评测)", "Model Router状态", "终审导出按钮"],
          notes: "保持极简，不打扰创作沉浸感。"
        },
        {
          name: "Left Panel: Assets & Presets (左栏)",
          role: "素材库与高频 L2 场景模板",
          dimensions: "260px W x calc(100vh - 54px)",
          components: ["原片镜头素材列表", "B-Roll智能库", "高频场景快捷卡片 (访谈拆条/口水词清洗/商品广告)", "音频/字幕预设"],
          notes: "一键拖拽进时间轴或直接触发 Agent 流程。"
        },
        {
          name: "Center-Top: Video Canvas (视窗播放区)",
          role: "实时画面渲染与画幅切换",
          dimensions: "Flex-1 W x 45% H",
          components: ["播放监视器 (16:9 / 9:16 自适应)", "A/B 分屏对比开关", "时间码显示 (00:00:14:08)", "安全区网格叠加层"],
          notes: "支持任意缩放与当前播放头画面精准渲染。"
        },
        {
          name: "Center-Bottom: Multi-Track Timeline (多轨时间轴)",
          role: "可控、可编辑、可回滚的核心交互介质",
          dimensions: "Flex-1 W x 55% H",
          components: ["时间标尺与播放头 (Playhead)", "视频主轨 (带口误切口与标记)", "B-Roll 叠加轨", "ASR 逐字字幕轨", "智能降鸭音频轨", "时间轴缩放滑块", "剪刀分割/撤销工具栏"],
          notes: "所有 Agent 动作直接在此以结构化 Clip 呈现，创作者可随时拖拽拉伸微调。"
        },
        {
          name: "Right Panel: Agent Copilot (智能副驾面板)",
          role: "意图解析与透明思考闭环呈现",
          dimensions: "380px W x calc(100vh - 54px)",
          components: ["自然语言对话输入", "4层思考折叠流 (理解→规划→执行→验证)", "动作执行卡片 (采纳/参数调优/一刀回滚)", "风险等级徽章", "人工干预率追踪"],
          notes: "绝不黑盒，展示透明调度步骤与自查质检通过清单。"
        }
      ]
    },
    annotations: [
      "所有卡片满足低对比灰度线框规范，重点呈现网格骨架与信息层级",
      "右侧 Agent 动作卡片对应时间轴高亮定位，悬浮即出现联动光标",
      "底部状态栏实时计算人工干预率 (Intervention Rate) 与回滚标记"
    ]
  },
  {
    id: "wf_thought_stream",
    title: "2. Agent 4层思维链展开态 (Reasoning & Action Stream)",
    category: "状态流转",
    description: "用户输入意图后，系统展示【理解 → 规划 → 执行 → 验证】全链路透明推理，并下发事务级操作包。",
    wireframeLayout: {
      areas: [
        {
          name: "Level 1: Understand (语义理解层)",
          role: "素材理解与意图提取",
          dimensions: "100% W x Auto",
          components: ["说话人分离标签", "论点情绪与节奏评级", "口误/停顿统计 (如: 识别 8 处口水词)"],
          notes: "输出机器理解结果，确保没有误解用户意图。"
        },
        {
          name: "Level 2: Plan (任务规划层)",
          role: "任务 DAG 拓扑拆解",
          dimensions: "100% W x Auto",
          components: ["步骤 1~4 进度流水线", "耗时预估", "依赖关系连线"],
          notes: "展示结构化步骤，用户可在执行前取消某个子任务。"
        },
        {
          name: "Level 3: Execute (工具调度与时间线事务)",
          role: "调用原子剪辑工具",
          dimensions: "100% W x Auto",
          components: ["工具名称 (cut_filler / insert_broll)", "目标轨道", "参数调节滑块", "Diff 对比按钮", "一刀回滚 (Rollback) 触发器"],
          notes: "直接生成时间线差异快照，非破坏性落地。"
        },
        {
          name: "Level 4: Verify (质检自查验证层)",
          role: "输出多模态质检报告",
          dimensions: "100% W x Auto",
          components: ["声画同步率检查 (±18ms)", "抖音安全区遮挡自查", "音量响度标准 (-14 LUFS)", "品牌敏感词排查"],
          notes: "保证交付给创作者的结果是高可用版本。"
        }
      ]
    },
    annotations: [
      "每个动作带风险标记：🟢 低风险(确定性直接应用) / 🟡 中风险(创意候选可重试) / 🔴 高风险(终审权需人点击确认)",
      "点击'一刀回滚'即可瞬时还原该动作对应的时间线剪切点，零延迟。"
    ]
  },
  {
    id: "wf_diff_rollback",
    title: "3. 时间轴事务差异对比 (Timeline Diff & Rollback)",
    category: "状态流转",
    description: "让专业剪辑师对 Agent 的每一次大刀阔斧有绝对安全感，支持双时间线 Diff 与回滚还原。",
    wireframeLayout: {
      areas: [
        {
          name: "Snapshot Selector (版本快照条)",
          role: "时间线快照切换",
          dimensions: "100% W x 40px H",
          components: ["原始录制版本 v1.0", "Agent 粗剪版本 v1.1", "插入B-roll版本 v1.2", "当前微调版本"],
          notes: "支持任意两点间的增量 Diff 对比。"
        },
        {
          name: "Diff Visualization (差量高亮图)",
          role: "轨道改动对照展示",
          dimensions: "100% W x 280px H",
          components: ["绿色条块：新增片段 (如 B-roll/字幕)", "红色虚线：剔除口水词与停顿", "黄色块：调参/重构图片段"],
          notes: "清晰展示修剪了哪几秒，新增了哪几段镜头。"
        },
        {
          name: "Action Operations (操作决策区)",
          role: "批量与单项决策",
          dimensions: "100% W x 60px H",
          components: ["全量采纳 (Accept All)", "选择性应用勾选框", "单刀回滚 (Revert Selected)", "退出对比"],
          notes: "操作历史记录同步存入飞轮数据池用于模型强化学习。"
        }
      ]
    },
    annotations: [
      "Diff 机制基于 OpenTimelineIO (OTIO) 数据结构序列化比对",
      "每一次回滚均带有原因标记 (误切论点 / 节奏太快 / 画面不搭)，直接反哺系统"
    ]
  },
  {
    id: "wf_system_architecture",
    title: "4. 系统全链路架构拓扑 (System Architecture Blueprint)",
    category: "架构拓扑",
    description: "从用户意图输入到工业级工程导出的五层纵深技术架构图解。",
    wireframeLayout: {
      areas: [
        {
          name: "1. 创作者交互层 (Creator Interaction Layer)",
          role: "多模态输入与交互介质",
          dimensions: "100% W x 70px H",
          components: ["自然语言 Prompt", "时间轴划选标注", "参数微调滑杆", "A/B 候选审查器"],
          notes: "支持对话式、时间轴标注式与混合式交互范式。"
        },
        {
          name: "2. Agent 决策中枢 (Agent Orchestration Engine)",
          role: "思维链循环与任务规划",
          dimensions: "100% W x 90px H",
          components: ["意图理解解析器", "长程上下文推理树", "剪辑规则与语法引擎", "质检验证守护进程"],
          notes: "自研纵深核心，将'意图'转化为'编辑指令'。"
        },
        {
          name: "3. 非线性编辑核心 (Non-destructive Timeline Core)",
          role: "工程与时间线状态机",
          dimensions: "100% W x 90px H",
          components: ["OTIO / EDL 状态管理器", "多轨道渲染管道", "事务日志与 Undo/Redo 栈", "毫秒级对齐引擎"],
          notes: "保障每一刀可编辑、每一帧可控、随时可回滚。"
        },
        {
          name: "4. 异构模型路由网关 (Model Router Gateway)",
          role: "自研核心与三方模型路由调度",
          dimensions: "100% W x 90px H",
          components: ["自研音视频理解控制模型", "Google Veo / Runway / Kling 视频生成", "Whisper ASR", "ElevenLabs 音频克隆"],
          notes: "按成本、延迟、质量三维权衡，动态下发任务。"
        },
        {
          name: "5. 评测与数据飞轮 (Evaluation & Data Flywheel)",
          role: "持续监控与闭环迭代",
          dimensions: "100% W x 70px H",
          components: ["三层指标仪表盘 (基础/任务/采纳率)", "人工接管率埋点 (Intervention Rate)", "用户修改行为回流洗标", "强化学习微调数据集"],
          notes: "将用户真实修改转化为模型进化的数据壁垒。"
        }
      ]
    },
    annotations: [
      "分层解耦：上层交互不依赖特定模型，底层模型替换无需重构工程内核",
      "全流程支持标准格式导入导出 (FCPXML / Premiere XML / OTIO / MP4)"
    ]
  }
];
