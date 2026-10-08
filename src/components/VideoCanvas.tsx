import React, { useState, useEffect } from 'react';
import { AspectRatio, TimelineClip, FilterEffect, CameraMotion } from '../types';
import { formatSMPTE } from '../utils/presets';
import { 
  Maximize2, 
  SplitSquareVertical, 
  Grid, 
  Sparkles, 
  Play, 
  Pause, 
  Zap,
  Sliders,
  Eye,
  Camera
} from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface VideoCanvasProps {
  aspectRatio: AspectRatio;
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeClip?: TimelineClip;
  overlayClip?: TimelineClip;
  activeCaption?: string;
  fps: number;
  activeLut?: string;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  aspectRatio,
  currentTime,
  totalDuration,
  isPlaying,
  onTogglePlay,
  activeClip,
  overlayClip,
  activeCaption,
  fps,
  activeLut = 'tokyo-noir',
}) => {
  const [showGrid, setShowGrid] = useState(false);
  const [splitCompare, setSplitCompare] = useState(false);
  const [controlsHovered, setControlsHovered] = useState(false);
  const [audioBars, setAudioBars] = useState<number[]>([40, 65, 30, 85, 55, 90, 45, 70]);

  // Audio visualizer animation during playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAudioBars(prev => prev.map(() => Math.floor(20 + Math.random() * 80)));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Compute camera motion transform based on current clip & elapsed time in that clip
  const clipProgress = activeClip
    ? Math.max(0, Math.min(1, (currentTime - activeClip.startTime) / Math.max(0.1, activeClip.duration)))
    : 0;

  const getCameraStyle = (motion?: CameraMotion) => {
    if (!motion || !isPlaying) return { transform: 'scale(1.02)' };

    switch (motion) {
      case 'Zoom In':
        return {
          transform: `scale(${1 + clipProgress * 0.16})`,
          transition: 'transform 0.1s linear',
        };
      case 'Pan Left':
        return {
          transform: `scale(1.1) translateX(${(clipProgress - 0.5) * -40}px)`,
          transition: 'transform 0.1s linear',
        };
      case 'Pan Right':
        return {
          transform: `scale(1.1) translateX(${(clipProgress - 0.5) * 40}px)`,
          transition: 'transform 0.1s linear',
        };
      case 'Tilt Up':
        return {
          transform: `scale(1.1) translateY(${(clipProgress - 0.5) * -35}px)`,
          transition: 'transform 0.1s linear',
        };
      case 'Tilt Down':
        return {
          transform: `scale(1.1) translateY(${(clipProgress - 0.5) * 35}px)`,
          transition: 'transform 0.1s linear',
        };
      case 'Orbit 360°':
        return {
          transform: `scale(1.12) rotate(${(clipProgress - 0.5) * 6}deg)`,
          transition: 'transform 0.1s linear',
        };
      case 'FPV Drone':
        return {
          transform: `scale(${1.08 + clipProgress * 0.12}) rotate(${Math.sin(clipProgress * Math.PI * 2) * 2}deg) translateY(${Math.cos(clipProgress * Math.PI * 2) * 5}px)`,
          transition: 'transform 0.1s linear',
        };
      case 'Roll':
        return {
          transform: `scale(1.15) rotate(${(clipProgress - 0.5) * 12}deg)`,
          transition: 'transform 0.1s linear',
        };
      default:
        return { transform: 'scale(1.02)' };
    }
  };

  // Determine aspect ratio class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[58vh] sm:max-h-[62vh]';
      case '16:9':
        return 'aspect-[16/9] w-full max-h-[55vh]';
      case '1:1':
        return 'aspect-square max-h-[55vh]';
      case '4:5':
        return 'aspect-[4/5] max-h-[58vh]';
      default:
        return 'aspect-[9/16] max-h-[60vh]';
    }
  };

  const getLutFilter = () => {
    switch (activeLut) {
      case 'blade-gold':
        return 'sepia(30%) saturate(140%) contrast(115%) hue-rotate(-15deg)';
      case 'matrix-emerald':
        return 'hue-rotate(50deg) saturate(120%) contrast(120%) brightness(95%)';
      case 'cyber-rose':
        return 'hue-rotate(320deg) saturate(150%) contrast(110%)';
      case 'obsidian-cool':
        return 'contrast(125%) saturate(105%) brightness(98%)';
      case 'tokyo-noir':
      default:
        return 'contrast(120%) saturate(130%) hue-rotate(5deg)';
    }
  };

  return (
    <div 
      className="relative flex-1 min-h-[220px] flex items-center justify-center p-2 sm:p-3 overflow-hidden bg-[#030712]"
      onMouseEnter={() => setControlsHovered(true)}
      onMouseLeave={() => setControlsHovered(false)}
    >
      {/* Dynamic Viewport Container */}
      <div 
        className={`relative ${getAspectClass()} max-w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.85)] border border-white/10 bg-[#080e1a] flex items-center justify-center group`}
      >
        {/* Live Canvas Visual Content */}
        {activeClip ? (
          <div className="relative w-full h-full overflow-hidden select-none">
            {/* Split Screen compare if enabled */}
            {splitCompare ? (
              <div className="relative w-full h-full flex">
                {/* Left: Raw initial */}
                <div className="w-1/2 h-full overflow-hidden relative border-r border-[#06b6d4]">
                  <img
                    src={activeClip.imageUrl}
                    alt="Raw Frame"
                    referrerPolicy="no-referrer"
                    className="w-[200%] max-w-none h-full object-cover grayscale contrast-90"
                  />
                  <div className="absolute top-3 left-3 px-1.5 py-0.5 rounded bg-black/60 font-mono text-[9px] text-[#958ea0]">
                    RAW INPUT
                  </div>
                </div>
                {/* Right: AI Enhanced */}
                <div className="w-1/2 h-full overflow-hidden relative">
                  <img
                    src={activeClip.imageUrl}
                    alt={activeClip.name}
                    referrerPolicy="no-referrer"
                    className="w-[200%] max-w-none -ml-[100%] h-full object-cover"
                    style={{
                      ...getCameraStyle(activeClip.cameraMotion),
                      filter: getLutFilter(),
                    }}
                  />
                  <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded bg-[#8b5cf6]/80 font-mono text-[9px] text-white">
                    NEURAL 4K
                  </div>
                </div>
              </div>
            ) : (
              /* Single Viewport with Cinematic Transformations */
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={activeClip.imageUrl}
                  alt={activeClip.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover will-change-transform"
                  style={{
                    ...getCameraStyle(activeClip.cameraMotion),
                    filter: getLutFilter(),
                  }}
                />

                {/* Second Video Layer: Overlay Clip if active */}
                {overlayClip && overlayClip.imageUrl && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70">
                    <img
                      src={overlayClip.imageUrl}
                      alt="Overlay"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter contrast-125"
                    />
                  </div>
                )}

                {/* Filter Effect Overlays */}
                {activeClip.effect === 'vhs-glitch' && (
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06b6d4]/10 to-transparent animate-pulse" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
                  </div>
                )}

                {activeClip.effect === 'cyberpunk-neon' && (
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(139,92,246,0.35)] mix-blend-screen">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#8b5cf6]/10 via-transparent to-[#06b6d4]/15" />
                  </div>
                )}

                {activeClip.effect === 'anamorphic-flare' && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-screen flex items-center justify-center">
                    <div className="w-[120%] h-1 bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent opacity-80 blur-[1px]" />
                    <div className="w-[80%] h-3 bg-gradient-to-r from-transparent via-[#8b5cf6]/60 to-transparent blur-sm" />
                  </div>
                )}

                {activeClip.effect === 'neural-upscale' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-[#06b6d4]/40 text-[9px] font-mono text-[#06b6d4]">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>NEURAL 4K 60FPS</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Empty Stage */
          <div className="flex flex-col items-center justify-center text-center p-6 text-[#958ea0]">
            <Sparkles className="w-10 h-10 text-[#8b5cf6] mb-3 animate-pulse" />
            <p className="font-display font-medium text-sm text-[#dde2f3]">Stage Ready for Synthesis</p>
            <p className="text-xs text-[#958ea0] mt-1">Tap Generate Video or drag a clip to timeline</p>
          </div>
        )}

        {/* 3x3 Composition Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-20">
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-white/20" />
            <div className="border-r border-white/20" />
            <div />
          </div>
        )}

        {/* Active Captions Overlay */}
        {activeCaption && (
          <div className="absolute bottom-12 inset-x-4 flex justify-center z-20 pointer-events-none">
            <span className="px-3 py-1 rounded bg-black/85 backdrop-blur-md text-white font-display font-bold text-xs sm:text-sm tracking-wide text-center border border-white/10 shadow-lg">
              {activeCaption}
            </span>
          </div>
        )}

        {/* Floating Top In-Viewport Overlays */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
          {/* Left: SMPTE Timecode HUD */}
          <div className="pointer-events-auto flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 font-mono text-[11px] text-[#06b6d4] shadow-md">
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-rose-500 animate-ping' : 'bg-[#06b6d4]'}`} />
            <span className="tabular-nums font-semibold">
              {formatSMPTE(currentTime, fps)}
            </span>
            <span className="text-[#958ea0]">/</span>
            <span className="text-[#958ea0] tabular-nums">
              {formatSMPTE(totalDuration, fps)}
            </span>
          </div>

          {/* Right: Quick Viewport Controls */}
          <div className="pointer-events-auto flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-md p-0.5 border border-white/10 shadow-md">
            {/* Split Screen compare button */}
            <button
              onClick={() => {
                studioAudio.playButtonTap();
                setSplitCompare(!splitCompare);
              }}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${splitCompare ? 'text-[#06b6d4]' : 'text-[#958ea0]'}`}
              title="Compare Before/After"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
            </button>

            {/* Grid toggle */}
            <button
              onClick={() => {
                studioAudio.playButtonTap();
                setShowGrid(!showGrid);
              }}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${showGrid ? 'text-[#8b5cf6]' : 'text-[#958ea0]'}`}
              title="Rule of Thirds Grid"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Floating Bottom In-Viewport Overlays */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
          {/* Active Camera Motion Badge */}
          {activeClip && (
            <div className="pointer-events-auto flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-[#dde2f3]">
              <Camera className="w-3 h-3 text-[#06b6d4]" />
              <span className="font-mono">{activeClip.cameraMotion}</span>
            </div>
          )}

          {/* Audio Visualizer Mini Bar */}
          <div className="pointer-events-auto flex items-end gap-0.5 h-4 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10">
            {audioBars.map((height, i) => (
              <div
                key={i}
                className="w-1 rounded-t bg-gradient-to-t from-[#06b6d4] to-[#8b5cf6] transition-all duration-75"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Center Tap to Play/Pause overlay */}
        <button
          onClick={onTogglePlay}
          className={`absolute inset-0 w-full h-full flex items-center justify-center z-10 transition-opacity duration-200 ${
            isPlaying && !controlsHovered ? 'opacity-0' : 'opacity-100 hover:bg-black/20'
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-[0_0_24px_rgba(0,0,0,0.6)] transform active:scale-95 transition-transform">
            {isPlaying ? (
              <Pause className="w-5 h-5 text-[#06b6d4]" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
