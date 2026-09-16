import React, { useState } from "react";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  Download, 
  MessageSquare, 
  QrCode, 
  Globe, 
  Eye, 
  Sparkles,
  Smartphone,
  ExternalLink
} from "lucide-react";
import { ShareReviewConfig, UserPersona } from "../../types";

interface ShareReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona?: UserPersona;
  projectName: string;
  durationSec?: number;
  currentVersion?: string;
  brandKit?: any;
  onOpenPortal?: () => void;
}

export const ShareReviewModal: React.FC<ShareReviewModalProps> = ({
  isOpen,
  onClose,
  activePersona = "studio",
  projectName,
  durationSec = 60,
  currentVersion,
  brandKit,
  onOpenPortal,
}) => {
  const [copied, setCopied] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [password, setPassword] = useState("FA-9821");
  const [allowDownload, setAllowDownload] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkContent, setWatermarkContent] = useState("内部审片 · 严禁外泄 · hhz5@163.com");
  const [expireOption, setExpireOption] = useState("7天有效");

  if (!isOpen) return null;

  const shareUrl = `https://frameagent.studio/review/${encodeURIComponent(projectName.replace(/\s+/g, "_"))}_share8f2`;

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-sm">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-100">外审协作与交付分享 (Review Share)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {activePersona === "creator" ? "创作者轻量外审" : activePersona === "brand" ? "品牌合规外审" : "制片与客户协同"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">对标 Frame.io / 分秒帧免登录安全审片，支持画笔标注与修改意见回传</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Share Link Card */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>免登审片安全链接</span>
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                即刻可访问
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-indigo-200 focus:outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "已复制" : "复制链接"}</span>
              </button>

              {onOpenPortal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPortal();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md"
                  title="直接打开并体验客户外审批注页面"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>立即进入外审端</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>项目：{projectName}（时长 {Math.floor(durationSec / 60)}分{durationSec % 60}秒）</span>
              <span className="text-indigo-400 flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                微信 / 飞书 / 手机浏览器免登录秒开
              </span>
            </div>
          </div>

          {/* Security & Access Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>审阅权限与安全控制 (Access & Security)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password Protection */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>访问密码保护</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={hasPassword}
                    onChange={(e) => setHasPassword(e.target.checked)}
                    className="accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
                {hasPassword && (
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="设置4-8位审片密码"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-md px-2.5 py-1 text-xs font-mono text-amber-300 focus:outline-none"
                  />
                )}
                <p className="text-[10px] text-slate-400">开启后访客输入密码才能进入审阅</p>
              </div>

              {/* Comment / Annotation Permission */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>允许在线精确画笔批注</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={(e) => setAllowComments(e.target.checked)}
                    className="accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">访客可在任意帧画圈、打字，意见实时回传至剪辑台</p>
              </div>

              {/* Dynamic Anti-Leak Watermark */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-rose-400" />
                    <span>防泄密动态明水印</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={watermarkEnabled}
                    onChange={(e) => setWatermarkEnabled(e.target.checked)}
                    className="accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
                {watermarkEnabled && (
                  <input
                    type="text"
                    value={watermarkContent}
                    onChange={(e) => setWatermarkContent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-md px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none"
                  />
                )}
                <p className="text-[10px] text-slate-400">在画面中全屏浮现审阅人身份标识，保护成片隐私</p>
              </div>

              {/* Download Permission */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>允许下载 4K 成片原文件</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">有效期：</span>
                  <select
                    value={expireOption}
                    onChange={(e) => setExpireOption(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 rounded px-2 py-0.5 text-[11px] text-slate-200"
                  >
                    <option value="24小时">24 小时</option>
                    <option value="7天有效">7 天有效</option>
                    <option value="30天有效">30 天有效</option>
                    <option value="永久有效">永久有效</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-400">默认关闭以防未结清款项前被提走成片</p>
              </div>
            </div>
          </div>

          {/* Value Proposition for Target Audiences */}
          <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl flex items-start gap-2.5 text-xs text-indigo-200">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-300">Agent 闭环优势：</span>
              <span>
                客户在分享链接中提交的画笔标记和文字意见，将直接进入工作台的
                <b className="text-amber-300">「审阅批注」</b>队列，剪辑师点击
                <b className="text-emerald-300">「🤖 Agent 自动解决」</b>
                即可一键自动剪切、替换素材与调整时间线，告别微信沟通零散截图痛点。
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <span className="text-xs text-slate-400">
            安全协议：TLS 1.3 · AES-256 加密存储
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-all cursor-pointer"
            >
              关闭
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-700 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-200 text-xs font-medium transition-all shadow-sm cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>仅复制链接</span>
            </button>
            {onOpenPortal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPortal();
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>进入外审模拟页面</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
