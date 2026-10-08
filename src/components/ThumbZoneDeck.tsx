import React from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Sparkles, 
  Diamond, 
  FastForward, 
  Layers,
  Wand2
} from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface ThumbZoneDeckProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSplice: () => void;
  onAddKeyframe: () => void;
  onCycleSpeed: () => void;
  currentSpeed: number;
  onGenerateVideo: () => void;
  isGenerating: boolean;
  hasSelectedClip: boolean;
}

export const ThumbZoneDeck: React.FC<ThumbZoneDeckProps> = ({
  isPlaying,
  onTogglePlay,
  onSplice,
  onAddKeyframe,
  onCycleSpeed,
  currentSpeed,
  onGenerateVideo,
  isGenerating,
  hasSelectedClip,
}) => {
  return (
    <div className="h-16 w-full glass-panel border-t border-white/10 px-3 flex items-center justify-between gap-2 z-30 select-none shrink-0 safe-bottom">
      {/* Secondary Tool Buttons Group */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 1. Splice / Cut Tool */}
        <button
          onClick={() => {
            studioAudio.playCutSound();
            onSplice();
          }}
          disabled={!hasSelectedClip}
          className={`min-h-[44px] min-w-[44px] px-2.5 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 border ${
            hasSelectedClip
              ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-[#dde2f3] active:scale-95'
              : 'bg-white/[0.02] border-white/5 text-[#958ea0]/40 cursor-not-allowed'
          }`}
          title="Splice / Cut clip at current playhead"
        >
          <Scissors className="w-4 h-4 text-[#06b6d4]" />
          <span className="text-[9px] font-mono leading-none tracking-tight">Cut</span>
        </button>

        {/* 2. Keyframe Tool */}
        <button
          onClick={() => {
            studioAudio.playButtonTap();
            onAddKeyframe();
          }}
          className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#dde2f3] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
          title="Add Camera Motion Keyframe"
        >
          <Diamond className="w-4 h-4 text-[#8b5cf6]" />
          <span className="text-[9px] font-mono leading-none tracking-tight">Key</span>
        </button>

        {/* 3. Speed Ramp Cycle */}
        <button
          onClick={() => {
            studioAudio.playButtonTap();
            onCycleSpeed();
          }}
          className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#dde2f3] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
          title="Cycle playback speed: 0.5x, 1x, 2x"
        >
          <FastForward className="w-4 h-4 text-[#4cd7f6]" />
          <span className="text-[9px] font-mono leading-none tracking-tight tabular-nums">
            {currentSpeed}x
          </span>
        </button>

        {/* 4. Play / Pause Control */}
        <button
          onClick={() => {
            studioAudio.playButtonTap();
            onTogglePlay();
          }}
          className={`min-h-[44px] min-w-[44px] px-3 rounded-xl border transition-all flex items-center justify-center shadow-md active:scale-95 ${
            isPlaying
              ? 'bg-[#06b6d4]/20 border-[#06b6d4] text-[#06b6d4] shadow-[0_0_16px_rgba(6,182,212,0.4)]'
              : 'bg-white/[0.08] hover:bg-white/[0.15] border-white/20 text-white'
          }`}
          title={isPlaying ? 'Pause timeline' : 'Play timeline'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Primary Glowing Action Button: "Generate Video" / "Render" */}
      <button
        onClick={() => {
          studioAudio.playGenerateStart();
          onGenerateVideo();
        }}
        disabled={isGenerating}
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
          boxShadow: '0 0 24px rgba(139, 92, 246, 0.45)',
        }}
        className={`h-12 min-h-[48px] px-5 sm:px-6 rounded-full font-semibold text-white flex items-center justify-center gap-2 border border-white/30 text-xs sm:text-sm tracking-wide transition-all select-none active:scale-95 ${
          isGenerating ? 'opacity-80 cursor-wait' : 'hover:brightness-110'
        }`}
      >
        <Sparkles className={`w-4 h-4 text-white ${isGenerating ? 'animate-spin' : ''}`} />
        <span className="font-display font-bold">
          {isGenerating ? 'SYNTHESIZING...' : 'GENERATE VIDEO'}
        </span>
      </button>
    </div>
  );
};
