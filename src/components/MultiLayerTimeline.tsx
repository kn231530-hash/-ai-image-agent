import React, { useRef, useState, useEffect } from 'react';
import { TimelineTrack, TimelineClip } from '../types';
import { 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  GripVertical, 
  Plus, 
  Trash2, 
  Copy, 
  Scissors, 
  ZoomIn, 
  ZoomOut,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface MultiLayerTimelineProps {
  tracks: TimelineTrack[];
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clip: TimelineClip | null) => void;
  onSplitClip: (clipId: string, splitTime: number) => void;
  onDeleteClip: (clipId: string) => void;
  onDuplicateClip: (clipId: string) => void;
  onToggleMuteTrack: (trackId: string) => void;
  onToggleLockTrack: (trackId: string) => void;
  fps: number;
}

export const MultiLayerTimeline: React.FC<MultiLayerTimelineProps> = ({
  tracks,
  currentTime,
  totalDuration,
  onSeek,
  selectedClipId,
  onSelectClip,
  onSplitClip,
  onDeleteClip,
  onDuplicateClip,
  onToggleMuteTrack,
  onToggleLockTrack,
  fps,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomScale, setZoomScale] = useState(24); // pixels per second
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [collapsedTracks, setCollapsedTracks] = useState<Record<string, boolean>>({});

  const timelineWidth = Math.max(600, totalDuration * zoomScale + 120);

  // Compute time ruler markers
  const rulerTicks = [];
  const step = zoomScale > 30 ? 1 : zoomScale > 15 ? 2 : 5;
  for (let s = 0; s <= totalDuration + 2; s += step) {
    rulerTicks.push(s);
  }

  const handlePointerDownTimeline = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const clientX = e.clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(totalDuration, (clientX - 100) / zoomScale));
    onSeek(newTime);
    setIsDraggingPlayhead(true);
    studioAudio.playTick();
  };

  const handlePointerMoveTimeline = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingPlayhead || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const clientX = e.clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(totalDuration, (clientX - 100) / zoomScale));
    onSeek(newTime);
    studioAudio.playTick();
  };

  const handlePointerUpTimeline = () => {
    setIsDraggingPlayhead(false);
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => setIsDraggingPlayhead(false);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, []);

  const toggleCollapse = (trackId: string) => {
    setCollapsedTracks((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  const playheadPositionPx = 100 + currentTime * zoomScale;

  return (
    <div className="w-full h-[180px] sm:h-[210px] glass-panel border-t border-white/10 flex flex-col select-none relative z-20 shrink-0">
      {/* Timeline Quick Action Ribbon */}
      <div className="h-8 px-3 border-b border-white/[0.08] bg-[#0b0f19]/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#4cd7f6] font-semibold">
            TIMELINE
          </span>
          <span className="text-white/20">|</span>
          <span className="font-mono text-[10px] text-[#958ea0]">
            SCALE: {zoomScale}px/s
          </span>

          {selectedClipId && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => {
                  studioAudio.playCutSound();
                  onSplitClip(selectedClipId, currentTime);
                }}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#8b5cf6]/30 text-white text-[10px] flex items-center gap-1 border border-white/10"
                title="Split clip at playhead"
              >
                <Scissors className="w-2.5 h-2.5 text-[#4cd7f6]" />
                <span>Split</span>
              </button>
              <button
                onClick={() => {
                  studioAudio.playButtonTap();
                  onDuplicateClip(selectedClipId);
                }}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#8b5cf6]/30 text-white text-[10px] flex items-center gap-1 border border-white/10"
                title="Duplicate clip"
              >
                <Copy className="w-2.5 h-2.5 text-[#d0bcff]" />
                <span>Dupe</span>
              </button>
              <button
                onClick={() => {
                  studioAudio.playButtonTap();
                  onDeleteClip(selectedClipId);
                }}
                className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-[10px] flex items-center gap-1 border border-rose-500/30"
                title="Delete clip"
              >
                <Trash2 className="w-2.5 h-2.5" />
                <span>Del</span>
              </button>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              studioAudio.playButtonTap();
              setZoomScale((z) => Math.max(12, z - 6));
            }}
            className="p-1 rounded hover:bg-white/10 text-[#958ea0] hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              studioAudio.playButtonTap();
              setZoomScale((z) => Math.min(60, z + 6));
            }}
            className="p-1 rounded hover:bg-white/10 text-[#958ea0] hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Track Workspace (Dual-Axis Pan Scroller) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDownTimeline}
        onPointerMove={handlePointerMoveTimeline}
        className="flex-1 overflow-x-auto overflow-y-auto relative cursor-crosshair bg-[#030712]/90"
      >
        <div style={{ width: `${timelineWidth}px` }} className="relative min-h-full">
          {/* Time Ruler Bar */}
          <div className="h-6 border-b border-white/[0.08] sticky top-0 bg-[#080e1a] z-10 flex items-end">
            <div className="w-[100px] shrink-0 h-full border-r border-white/10 px-2 flex items-center text-[10px] font-mono text-[#958ea0] bg-[#0e131f]">
              TRACKS
            </div>
            <div className="relative flex-1 h-full">
              {rulerTicks.map((t) => {
                const pos = t * zoomScale;
                return (
                  <div
                    key={t}
                    className="absolute bottom-0 flex flex-col items-center"
                    style={{ left: `${pos}px` }}
                  >
                    <span className="text-[9px] font-mono text-[#958ea0] select-none -translate-x-1/2">
                      {t}s
                    </span>
                    <div className="w-[1px] h-2 bg-white/20" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stacked Layer Tracks */}
          <div className="flex flex-col divide-y divide-white/[0.06] pb-6">
            {tracks.map((track) => {
              const isCollapsed = collapsedTracks[track.id];
              return (
                <div key={track.id} className="flex relative group/track">
                  {/* Track Header (Fixed 100px) */}
                  <div className="w-[100px] shrink-0 sticky left-0 z-10 bg-[#0e131f]/95 backdrop-blur-md border-r border-white/10 p-1.5 flex items-center justify-between text-xs shadow-[2px_0_10px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-1 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCollapse(track.id);
                        }}
                        className="text-[#958ea0] hover:text-white"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                      <span className="font-mono text-[10px] text-[#dde2f3] truncate font-medium">
                        {track.label}
                      </span>
                    </div>

                    {/* Quick Track Controls: Mute & Lock */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          studioAudio.playButtonTap();
                          onToggleMuteTrack(track.id);
                        }}
                        className={`p-1 rounded hover:bg-white/10 ${
                          track.isMuted ? 'text-rose-400' : 'text-[#958ea0] hover:text-white'
                        }`}
                        title={track.isMuted ? 'Unmute' : 'Mute'}
                      >
                        {track.isMuted ? (
                          <VolumeX className="w-2.5 h-2.5" />
                        ) : (
                          <Volume2 className="w-2.5 h-2.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          studioAudio.playButtonTap();
                          onToggleLockTrack(track.id);
                        }}
                        className={`p-1 rounded hover:bg-white/10 ${
                          track.isLocked ? 'text-amber-400' : 'text-[#958ea0] hover:text-white'
                        }`}
                        title={track.isLocked ? 'Unlock' : 'Lock'}
                      >
                        {track.isLocked ? (
                          <Lock className="w-2.5 h-2.5" />
                        ) : (
                          <Unlock className="w-2.5 h-2.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Track Block Lane */}
                  <div
                    className={`relative flex-1 ${
                      isCollapsed ? 'h-5' : track.type === 'captions' ? 'h-7' : 'h-10'
                    } bg-[#0b0f19]/40 py-1 transition-all`}
                  >
                    {track.clips.map((clip) => {
                      const leftPx = clip.startTime * zoomScale;
                      const widthPx = clip.duration * zoomScale;
                      const isSelected = selectedClipId === clip.id;

                      return (
                        <div
                          key={clip.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            studioAudio.playButtonTap();
                            onSelectClip(clip);
                          }}
                          style={{
                            left: `${leftPx}px`,
                            width: `${Math.max(24, widthPx)}px`,
                          }}
                          className={`absolute inset-y-1 rounded-[6px] transition-all cursor-pointer overflow-hidden border ${
                            clip.isGenerating
                              ? 'ai-shimmer-bg border-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                              : isSelected
                              ? 'border-[#06b6d4] shadow-[0_0_14px_rgba(6,182,212,0.6)] bg-[#1e293b]'
                              : 'border-white/10 bg-[#1e293b]/70 hover:bg-[#1e293b]'
                          }`}
                        >
                          {/* Inner Content Representation */}
                          <div className="relative w-full h-full flex items-center px-1.5 gap-1.5 overflow-hidden">
                            {/* Tiny Thumbnail if video clip */}
                            {clip.imageUrl && (
                              <img
                                src={clip.imageUrl}
                                alt="thumb"
                                referrerPolicy="no-referrer"
                                className="w-5 h-5 rounded object-cover shrink-0 pointer-events-none"
                              />
                            )}

                            {/* Audio Waveform Bars if audio track */}
                            {track.type === 'audio-neural' && (
                              <div className="flex items-center gap-[2px] h-4 w-full opacity-60">
                                {[40, 70, 90, 50, 80, 60, 95, 45, 65, 85, 30, 75].map((h, idx) => (
                                  <div
                                    key={idx}
                                    className="w-[2px] bg-[#06b6d4] rounded-full"
                                    style={{ height: `${h}%` }}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Label & Duration counter */}
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-[9px] text-white truncate font-medium leading-none">
                                {clip.name}
                              </p>
                              <span className="font-mono text-[8px] text-[#958ea0] tabular-nums">
                                {clip.duration.toFixed(1)}s
                              </span>
                            </div>

                            {/* AI Generating Indicator */}
                            {clip.isGenerating && (
                              <div className="flex items-center gap-1 text-[#d0bcff] shrink-0 font-mono text-[8px]">
                                <Sparkles className="w-2.5 h-2.5 animate-spin" />
                                <span>AI</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Electric Cyan Playhead Needle (#06B6D4) with halo glow */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-30 transition-transform duration-75"
            style={{
              left: `${playheadPositionPx}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Draggable Teardrop Thumb Cap */}
            <div className="relative -top-1 flex flex-col items-center">
              <div className="w-3.5 h-3.5 rotate-45 rounded-sm bg-[#06b6d4] shadow-[0_0_12px_#06b6d4] border border-white" />
            </div>

            {/* Needle Line extending through stacked layers */}
            <div className="w-[2px] h-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4] mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
