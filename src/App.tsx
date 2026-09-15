/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { VideoPlayer } from "./components/studio/VideoPlayer";
import { TranscriptAssetPanel } from "./components/studio/TranscriptAssetPanel";
import { TimelineEditor } from "./components/studio/TimelineEditor";
import { AgentCopilot } from "./components/studio/AgentCopilot";
import { ActionDiffModal } from "./components/studio/ActionDiffModal";
import { HumanApprovalModal } from "./components/studio/HumanApprovalBar";
import { PrdViewer } from "./components/prd/PrdViewer";
import { WireframeViewer } from "./components/wireframe/WireframeViewer";
import { EvalDashboard } from "./components/eval/EvalDashboard";
import { INITIAL_TRACKS } from "./data/mockData";
import { 
  AppViewMode, 
  TimelineTrack, 
  TimelineClip, 
  AgentThought, 
  AgentAction 
} from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewMode>("studio");
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Playback & Timeline State
  const [tracks, setTracks] = useState<TimelineTrack[]>(INITIAL_TRACKS);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(14.2);
  const durationSec = 60;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>("clip_v2");
  const [studioLayout, setStudioLayout] = useState<"three-column" | "stacked" | "focus-monitor">("three-column");

  // Agent State
  const [currentThought, setCurrentThought] = useState<AgentThought | null>(null);
  const [isLoadingAgent, setIsLoadingAgent] = useState<boolean>(false);
  const [rolledBackCount, setRolledBackCount] = useState<number>(0);
  const [manualEditsCount, setManualEditsCount] = useState<number>(0);

  // Modals
  const [diffAction, setDiffAction] = useState<AgentAction | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);

  // Timer loop for video playback
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    // Check server health
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTimeSec((prev) => {
        const next = prev + deltaSec;
        if (next >= durationSec) {
          return 0; // loop back
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, durationSec]);

  // Handle timeline clip selection
  const handleSelectClip = (clip: TimelineClip | null) => {
    setSelectedClipId(clip ? clip.id : null);
  };

  // Handle split clip at current playhead
  const handleSplitClip = (clipId: string, splitTimeSec: number) => {
    setManualEditsCount((c) => c + 1);
    setTracks((prev) =>
      prev.map((track) => {
        const clipIdx = track.clips.findIndex((c) => c.id === clipId);
        if (clipIdx === -1) return track;

        const clip = track.clips[clipIdx];
        const firstHalfDuration = splitTimeSec - clip.startSec;
        const secondHalfDuration = clip.durationSec - firstHalfDuration;

        if (firstHalfDuration <= 0.5 || secondHalfDuration <= 0.5) return track;

        const clip1: TimelineClip = {
          ...clip,
          id: `${clip.id}_part1`,
          durationSec: firstHalfDuration,
          name: `${clip.name} (前段)`,
        };

        const clip2: TimelineClip = {
          ...clip,
          id: `${clip.id}_part2`,
          startSec: splitTimeSec,
          durationSec: secondHalfDuration,
          sourceStartSec: clip.sourceStartSec + firstHalfDuration,
          name: `${clip.name} (后段)`,
        };

        const newClips = [...track.clips];
        newClips.splice(clipIdx, 1, clip1, clip2);
        return { ...track, clips: newClips };
      })
    );
  };

  // Handle delete clip
  const handleDeleteClip = (clipId: string) => {
    setManualEditsCount((c) => c + 1);
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.filter((c) => c.id !== clipId),
      }))
    );
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  // Handle execute prompt with Agent Copilot
  const handleExecutePrompt = async (promptText: string, taskType?: string) => {
    setIsLoadingAgent(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          taskType,
          currentTimeline: {
            durationSec,
            trackCount: tracks.length,
            clipCount: tracks.reduce((acc, t) => acc + t.clips.length, 0),
          },
        }),
      });

      const json = await res.json();
      const thoughtData: AgentThought = json.data;
      setCurrentThought(thoughtData);

      // Apply changes non-destructively to the tracks
      applyAgentActionsToTimeline(thoughtData);
    } catch (err) {
      console.error("Agent execution error:", err);
    } finally {
      setIsLoadingAgent(false);
    }
  };

  // Apply Agent Actions to Timeline
  const applyAgentActionsToTimeline = (thought: AgentThought) => {
    setTracks((prevTracks) => {
      const updated = prevTracks.map((t) => ({ ...t, clips: [...t.clips] }));

      // 1. If filler removal is present: trim the filler clip or mark it
      const fillerAction = thought.actions.find((a) => a.tool === "cut_filler");
      if (fillerAction) {
        const videoTrack = updated.find((t) => t.type === "video");
        if (videoTrack) {
          videoTrack.clips = videoTrack.clips.map((c) => {
            if (c.id === "clip_v3") {
              return {
                ...c,
                name: "口水词气口 (AI 已无损剔除)",
                color: "bg-emerald-700/30 border-emerald-500",
                isCutPoint: true,
                isAgentGenerated: true,
                agentActionId: fillerAction.id,
                durationSec: 3.5, // trimmed from 8s
              };
            }
            return c;
          });
        }
      }

      // 2. If B-roll is inserted: inject B-roll clip into track_broll
      const brollAction = thought.actions.find((a) => a.tool === "insert_broll");
      if (brollAction) {
        const brollTrack = updated.find((t) => t.type === "broll");
        if (brollTrack) {
          const newBrollClip: TimelineClip = {
            id: `clip_broll_${Date.now()}`,
            trackId: "track_broll",
            name: "B-Roll: AI工作流与时间轴控制演示",
            startSec: brollAction.timeRange[0] || 14,
            durationSec: (brollAction.timeRange[1] - brollAction.timeRange[0]) || 8,
            sourceStartSec: 0,
            type: "broll",
            color: "bg-purple-600/40 border-purple-400",
            isAgentGenerated: true,
            agentActionId: brollAction.id,
          };

          // Avoid duplicate insertion
          if (!brollTrack.clips.some((c) => c.name.includes("时间轴控制演示"))) {
            brollTrack.clips.push(newBrollClip);
          }
        }
      }

      // 3. If subtitles are generated: inject dynamic subtitles
      const subAction = thought.actions.find((a) => a.tool === "add_subtitles");
      if (subAction) {
        const subTrack = updated.find((t) => t.type === "subtitle");
        if (subTrack) {
          const newSubClip: TimelineClip = {
            id: `clip_sub_${Date.now()}`,
            trackId: "track_subtitle",
            name: "AI智能逐字花字字幕",
            startSec: 22,
            durationSec: 14,
            sourceStartSec: 0,
            type: "subtitle",
            color: "bg-emerald-600/40 border-emerald-400",
            text: "专业后期 Agent 把意图到工程翻译成本降到接近零！",
            isAgentGenerated: true,
            agentActionId: subAction.id,
          };
          if (!subTrack.clips.some((c) => c.text?.includes("专业后期 Agent"))) {
            subTrack.clips.push(newSubClip);
          }
        }
      }

      return updated;
    });
  };

  // Rollback a single action (Core principle: 每一刀可回滚)
  const handleRollbackAction = (actionId: string, feedbackReason?: string) => {
    setRolledBackCount((r) => r + 1);

    // Update thought status
    if (currentThought) {
      setCurrentThought({
        ...currentThought,
        actions: currentThought.actions.map((act) =>
          act.id === actionId ? { ...act, status: "rolled_back" } : act
        ),
      });
    }

    // Revert the timeline tracks for this specific action
    setTracks((prev) =>
      prev.map((track) => {
        return {
          ...track,
          clips: track.clips
            .filter((c) => c.agentActionId !== actionId)
            .map((c) => {
              if (c.id === "clip_v3" && c.agentActionId === actionId) {
                return {
                  ...c,
                  name: "口水词气口段落 (待清洗)",
                  color: "bg-amber-600/30 border-amber-500",
                  durationSec: 8,
                  isCutPoint: false,
                  isAgentGenerated: false,
                  agentActionId: undefined,
                };
              }
              return c;
            }),
        };
      })
    );
  };

  // Adopt all actions
  const handleAdoptAllActions = () => {
    if (currentThought) {
      setCurrentThought({
        ...currentThought,
        actions: currentThought.actions.map((a) => ({ ...a, status: "accepted" })),
      });
    }
  };

  // Update clip metadata
  const handleUpdateClip = (updatedClip: TimelineClip) => {
    setManualEditsCount((c) => c + 1);
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.map((c) => (c.id === updatedClip.id ? updatedClip : c)),
      }))
    );
  };

  // Calculate dynamic intervention rate based on user interactions
  const totalActionsCount = currentThought?.actions.length || 3;
  const calculatedInterventionRate = Math.max(
    5.2,
    Math.min(25, 11.4 + rolledBackCount * 3.2 + manualEditsCount * 0.8)
  );

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenExport={() => setIsApprovalModalOpen(true)}
        hasGeminiKey={hasGeminiKey}
        activeProjectName="StoryFyco_访谈拆条_EP01"
      />

      {/* View 1: Master Studio Workspace */}
      {currentView === "studio" && (
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Upper Studio Area: Video Canvas + Transcript + Agent Copilot */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {studioLayout === "three-column" ? (
              <>
                {/* Column 1: Text-based Transcript & Asset Bin & Inspector Panel (Left) */}
                <div className="w-full md:w-[320px] lg:w-[350px] xl:w-[380px] shrink-0 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col min-h-0 bg-slate-950">
                  <TranscriptAssetPanel
                    currentTimeSec={currentTimeSec}
                    onSeek={(timeSec) => setCurrentTimeSec(timeSec)}
                    selectedClip={tracks.flatMap((t) => t.clips).find((c) => c.id === selectedClipId) || null}
                    onRollbackAction={handleRollbackAction}
                  />
                </div>

                {/* Column 2: Video Player Monitor (Center - Large & Expansive) */}
                <section className="flex-1 min-w-0 flex flex-col min-h-0 bg-slate-950 overflow-hidden">
                  <VideoPlayer
                    currentTimeSec={currentTimeSec}
                    durationSec={durationSec}
                    isPlaying={isPlaying}
                    onPlayToggle={() => setIsPlaying(!isPlaying)}
                    onSeek={(timeSec) => setCurrentTimeSec(timeSec)}
                    tracks={tracks}
                    aspectRatio={aspectRatio}
                    onAspectRatioToggle={() =>
                      setAspectRatio((prev) => (prev === "16:9" ? "9:16" : "16:9"))
                    }
                    isSplitView={isSplitView}
                    onToggleSplitView={() => setIsSplitView(!isSplitView)}
                    showSafeZone={showSafeZone}
                    onToggleSafeZone={() => setShowSafeZone(!showSafeZone)}
                    layoutMode={studioLayout}
                    onLayoutModeChange={setStudioLayout}
                  />
                </section>
              </>
            ) : studioLayout === "stacked" ? (
              /* Stacked Mode: Monitor (Top, 65% height) + Transcript (Bottom, 35% height) */
              <section className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-950">
                {/* Video Player Monitor (Enlarged with flex-[1.6]) */}
                <div className="flex-[1.6] min-h-[380px] border-b border-slate-800 overflow-hidden">
                  <VideoPlayer
                    currentTimeSec={currentTimeSec}
                    durationSec={durationSec}
                    isPlaying={isPlaying}
                    onPlayToggle={() => setIsPlaying(!isPlaying)}
                    onSeek={(timeSec) => setCurrentTimeSec(timeSec)}
                    tracks={tracks}
                    aspectRatio={aspectRatio}
                    onAspectRatioToggle={() =>
                      setAspectRatio((prev) => (prev === "16:9" ? "9:16" : "16:9"))
                    }
                    isSplitView={isSplitView}
                    onToggleSplitView={() => setIsSplitView(!isSplitView)}
                    showSafeZone={showSafeZone}
                    onToggleSafeZone={() => setShowSafeZone(!showSafeZone)}
                    layoutMode={studioLayout}
                    onLayoutModeChange={setStudioLayout}
                  />
                </div>

                {/* Text-based Transcript & Asset Bin & Inspector Panel */}
                <div className="flex-1 min-h-[180px] max-h-[320px] overflow-hidden">
                  <TranscriptAssetPanel
                    currentTimeSec={currentTimeSec}
                    onSeek={(timeSec) => setCurrentTimeSec(timeSec)}
                    selectedClip={tracks.flatMap((t) => t.clips).find((c) => c.id === selectedClipId) || null}
                    onRollbackAction={handleRollbackAction}
                  />
                </div>
              </section>
            ) : (
              /* Focus Monitor Mode: Video Player occupies 100% of space */
              <section className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-950">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <VideoPlayer
                    currentTimeSec={currentTimeSec}
                    durationSec={durationSec}
                    isPlaying={isPlaying}
                    onPlayToggle={() => setIsPlaying(!isPlaying)}
                    onSeek={(timeSec) => setCurrentTimeSec(timeSec)}
                    tracks={tracks}
                    aspectRatio={aspectRatio}
                    onAspectRatioToggle={() =>
                      setAspectRatio((prev) => (prev === "16:9" ? "9:16" : "16:9"))
                    }
                    isSplitView={isSplitView}
                    onToggleSplitView={() => setIsSplitView(!isSplitView)}
                    showSafeZone={showSafeZone}
                    onToggleSafeZone={() => setShowSafeZone(!showSafeZone)}
                    layoutMode={studioLayout}
                    onLayoutModeChange={setStudioLayout}
                  />
                </div>
              </section>
            )}

            {/* Right Side: Agent Copilot Reasoning & Action Stream */}
            <aside className="w-full md:w-[360px] lg:w-[400px] shrink-0 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col min-h-0 bg-slate-950">
              <AgentCopilot
                currentThought={currentThought}
                isLoading={isLoadingAgent}
                onExecutePrompt={handleExecutePrompt}
                onRollbackAction={handleRollbackAction}
                onOpenDiff={(action) => setDiffAction(action)}
                onAdoptAllActions={handleAdoptAllActions}
              />
            </aside>
          </div>

          {/* Bottom Area: Multi-Track Timeline Editor */}
          <section className="h-64 sm:h-72 shrink-0 border-t border-slate-800 bg-slate-950">
            <TimelineEditor
              tracks={tracks}
              currentTimeSec={currentTimeSec}
              durationSec={durationSec}
              onSeek={(timeSec) => setCurrentTimeSec(timeSec)}
              selectedClipId={selectedClipId}
              onSelectClip={handleSelectClip}
              onSplitClip={handleSplitClip}
              onDeleteClip={handleDeleteClip}
              onRollbackAction={handleRollbackAction}
              onUpdateClip={handleUpdateClip}
            />
          </section>
        </main>
      )}

      {/* View 2: Product Requirements Document (PRD) */}
      {currentView === "prd" && (
        <main className="flex-1 overflow-hidden">
          <PrdViewer />
        </main>
      )}

      {/* View 3: Interactive Wireframes & Architecture Blueprints */}
      {currentView === "wireframes" && (
        <main className="flex-1 overflow-hidden">
          <WireframeViewer />
        </main>
      )}

      {/* View 4: Evaluation Metrics & Model Router Telemetry */}
      {currentView === "evaluation" && (
        <main className="flex-1 overflow-hidden">
          <EvalDashboard />
        </main>
      )}

      {/* Action Diff & Rollback Inspection Modal */}
      <ActionDiffModal
        action={diffAction}
        onClose={() => setDiffAction(null)}
        onRollback={handleRollbackAction}
      />

      {/* Human Final Approval & Multi-Format Export Modal */}
      <HumanApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        interventionRate={calculatedInterventionRate}
        adoptionRate={81.6}
        totalAgentActionsCount={totalActionsCount}
        rolledBackCount={rolledBackCount}
      />
    </div>
  );
}
