import React, { useState } from 'react';
import { AspectRatio, Resolution, Fps } from '../types';
import { 
  Sparkles, 
  Layers, 
  ChevronDown, 
  Cloud, 
  Film, 
  Volume2, 
  VolumeX, 
  Share2,
  Cpu
} from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface TopHudProps {
  projectName: string;
  onOpenProjectManager: () => void;
  aspectRatio: AspectRatio;
  onSelectAspectRatio: (ar: AspectRatio) => void;
  resolution: Resolution;
  onSelectResolution: (res: Resolution) => void;
  fps: Fps;
  onSelectFps: (fps: Fps) => void;
  isGenerating: boolean;
  onOpenRenderModal: () => void;
  onOpenNeuralLab: () => void;
  onOpenLibrary: () => void;
  activeScreen: 'studio' | 'neural-lab' | 'library';
  onChangeScreen: (screen: 'studio' | 'neural-lab' | 'library') => void;
  isMobileSimulator: boolean;
  onToggleMobileSimulator: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  projectName,
  onOpenProjectManager,
  aspectRatio,
  onSelectAspectRatio,
  resolution,
  onSelectResolution,
  fps,
  onSelectFps,
  isGenerating,
  onOpenRenderModal,
  activeScreen,
  onChangeScreen,
  isMobileSimulator,
  onToggleMobileSimulator,
}) => {
  const [showAspectMenu, setShowAspectMenu] = useState(false);
  const [showResMenu, setShowResMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    studioAudio.setMuted(next);
  };

  const aspectOptions: { label: string; value: AspectRatio }[] = [
    { label: '9:16 Reel', value: '9:16' },
    { label: '16:9 Cinema', value: '16:9' },
    { label: '1:1 Square', value: '1:1' },
    { label: '4:5 Social', value: '4:5' },
  ];

  const resOptions: { res: Resolution; fps: Fps; label: string }[] = [
    { res: '4K', fps: 60, label: '4K 60fps' },
    { res: '4K', fps: 24, label: '4K 24fps' },
    { res: '1080P', fps: 60, label: '1080P 60fps' },
    { res: '1080P', fps: 30, label: '1080P 30fps' },
  ];

  return (
    <header className="h-12 w-full glass-panel border-b border-white/10 px-3 flex items-center justify-between text-xs select-none z-30 shrink-0">
      {/* Zone 1: Project Selector & Brand Wordmark */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => {
            studioAudio.playButtonTap();
            onOpenProjectManager();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] transition-colors border border-white/10 max-w-[150px] sm:max-w-[200px] text-left group"
          title="Switch Project"
        >
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_#8b5cf6] shrink-0" />
          <span className="font-semibold text-[#dde2f3] truncate font-display tracking-tight text-[13px]">
            {projectName}
          </span>
          <ChevronDown className="w-3 h-3 text-[#958ea0] group-hover:text-white shrink-0 ml-0.5" />
        </button>

        {/* View / Screen Switcher pills */}
        <div className="hidden md:flex items-center gap-1 p-0.5 bg-black/40 rounded-lg border border-white/[0.08]">
          <button
            onClick={() => {
              studioAudio.playButtonTap();
              onChangeScreen('studio');
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeScreen === 'studio'
                ? 'bg-[#8b5cf6] text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                : 'text-[#958ea0] hover:text-[#dde2f3]'
            }`}
          >
            Studio Editor
          </button>
          <button
            onClick={() => {
              studioAudio.playButtonTap();
              onChangeScreen('neural-lab');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeScreen === 'neural-lab'
                ? 'bg-[#8b5cf6] text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                : 'text-[#958ea0] hover:text-[#dde2f3]'
            }`}
          >
            <Cpu className="w-3 h-3 text-[#4cd7f6]" />
            Neural Engine
          </button>
          <button
            onClick={() => {
              studioAudio.playButtonTap();
              onChangeScreen('library');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeScreen === 'library'
                ? 'bg-[#8b5cf6] text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                : 'text-[#958ea0] hover:text-[#dde2f3]'
            }`}
          >
            <Film className="w-3 h-3 text-[#ffb0cd]" />
            Magic Library
          </button>
        </div>
      </div>

      {/* Zone 2: Telemetry & Cloud Engine State */}
      <div className="flex items-center gap-2">
        {/* Aspect Ratio Selector */}
        <div className="relative">
          <button
            onClick={() => {
              studioAudio.playButtonTap();
              setShowAspectMenu(!showAspectMenu);
              setShowResMenu(false);
            }}
            className="px-2 py-1 rounded bg-black/40 hover:bg-black/60 border border-white/10 text-[11px] font-mono text-[#06b6d4] flex items-center gap-1 hover:border-[#06b6d4]/50 transition-colors"
          >
            <Layers className="w-3 h-3" />
            <span>{aspectRatio}</span>
          </button>

          {showAspectMenu && (
            <div className="absolute top-full mt-1 left-0 w-32 glass-elevated rounded-lg p-1 z-50 border border-white/20">
              {aspectOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    studioAudio.playButtonTap();
                    onSelectAspectRatio(opt.value);
                    setShowAspectMenu(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-[11px] transition-colors flex items-center justify-between ${
                    aspectRatio === opt.value
                      ? 'bg-[#8b5cf6]/30 text-white font-medium'
                      : 'text-[#958ea0] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{opt.label}</span>
                  {aspectRatio === opt.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resolution & FPS Selector */}
        <div className="relative">
          <button
            onClick={() => {
              studioAudio.playButtonTap();
              setShowResMenu(!showResMenu);
              setShowAspectMenu(false);
            }}
            className="px-2 py-1 rounded bg-black/40 hover:bg-black/60 border border-white/10 text-[11px] font-mono text-[#dde2f3] flex items-center gap-1 hover:border-[#8b5cf6]/50 transition-colors"
          >
            <span>{resolution} {fps}FPS</span>
          </button>

          {showResMenu && (
            <div className="absolute top-full mt-1 right-0 w-36 glass-elevated rounded-lg p-1 z-50 border border-white/20">
              {resOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    studioAudio.playButtonTap();
                    onSelectResolution(opt.res);
                    onSelectFps(opt.fps);
                    setShowResMenu(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-mono transition-colors flex items-center justify-between ${
                    resolution === opt.res && fps === opt.fps
                      ? 'bg-[#8b5cf6]/30 text-white font-medium'
                      : 'text-[#958ea0] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{opt.label}</span>
                  {resolution === opt.res && fps === opt.fps && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cloud Engine Telemetry State */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-black/30 border border-white/[0.08] text-[11px] text-[#958ea0]">
          <Cloud className={`w-3 h-3 ${isGenerating ? 'text-[#8b5cf6] animate-pulse' : 'text-[#06b6d4]'}`} />
          <span className="font-mono text-[10px]">
            {isGenerating ? 'SYNTHESIZING' : 'NEURAL READY'}
          </span>
        </div>
      </div>

      {/* Zone 3: Audio & Export Master Actions */}
      <div className="flex items-center gap-1.5">
        {/* Audio Mute toggle */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-md hover:bg-white/10 text-[#958ea0] hover:text-white transition-colors"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#06b6d4]" />
          )}
        </button>

        {/* Mobile simulator toggle button */}
        <button
          onClick={onToggleMobileSimulator}
          className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
            isMobileSimulator
              ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#d0bcff]'
              : 'bg-white/[0.04] border-white/10 text-[#958ea0] hover:text-white'
          }`}
          title="Toggle handheld phone simulator frame"
        >
          <span>{isMobileSimulator ? 'Phone Frame' : 'Full Canvas'}</span>
        </button>

        {/* Primary Glow Export Button */}
        <button
          onClick={() => {
            studioAudio.playButtonTap();
            onOpenRenderModal();
          }}
          className="px-3 py-1.5 rounded-full font-semibold text-white bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_16px_rgba(139,92,246,0.4)] flex items-center gap-1 text-[11px]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
