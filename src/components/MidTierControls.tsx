import React, { useState } from 'react';
import { Sparkles, Mic, Sliders, Plus, X, Wand2, ShieldAlert } from 'lucide-react';
import { MAGIC_PROMPT_PILLS } from '../utils/presets';
import { studioAudio } from '../utils/audio';

interface MidTierControlsProps {
  prompt: string;
  onChangePrompt: (text: string) => void;
  negativePrompt: string;
  onChangeNegativePrompt: (text: string) => void;
  onGenerateClip: () => void;
  isGenerating: boolean;
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
  onOpenNeuralLab: () => void;
}

export const MidTierControls: React.FC<MidTierControlsProps> = ({
  prompt,
  onChangePrompt,
  negativePrompt,
  onChangeNegativePrompt,
  onGenerateClip,
  isGenerating,
  selectedFilter,
  onSelectFilter,
  onOpenNeuralLab,
}) => {
  const [showNegative, setShowNegative] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const styleChips = [
    { id: 'all', label: 'Raw Lens' },
    { id: 'cyberpunk-neon', label: 'Neon Cyber' },
    { id: 'anamorphic-flare', label: 'Anamorphic' },
    { id: 'vhs-glitch', label: 'VHS Glitch' },
    { id: 'film-grain', label: '35mm Film' },
    { id: 'neural-upscale', label: 'Neural 8K' },
  ];

  const handleVoiceToggle = () => {
    studioAudio.playButtonTap();
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate quick voice dictation input
      setTimeout(() => {
        onChangePrompt(prompt ? `${prompt}, cinematic volumetric lighting` : 'Anamorphic wide tracking shot of cyberpunk city');
        setIsListening(false);
      }, 1500);
    }
  };

  const handleAddPromptPill = (pill: string) => {
    studioAudio.playButtonTap();
    if (prompt.includes(pill)) {
      onChangePrompt(prompt.replace(pill, '').replace(/,\s*,/g, ',').trim());
    } else {
      onChangePrompt(prompt ? `${prompt}, ${pill}` : pill);
    }
  };

  return (
    <div className="w-full px-3 py-2 flex flex-col gap-2 shrink-0 z-20">
      {/* 1. Floating Capsule Prompt Bar */}
      <div 
        className={`w-full rounded-full transition-all duration-300 relative flex items-center p-1 px-3 bg-[#111827]/85 backdrop-blur-xl border ${
          isFocused 
            ? 'border-[#8b5cf6] shadow-[0_0_20px_rgba(139,92,246,0.4)]' 
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center text-[#8b5cf6] mr-2 shrink-0">
          <Wand2 className="w-4 h-4" />
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isGenerating && prompt.trim()) {
              onGenerateClip();
            }
          }}
          placeholder="Describe scene, camera path, or lighting (e.g. 'Neon rain, FPV drone')..."
          className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[#dde2f3] placeholder:text-[#958ea0] tracking-tight font-sans min-w-0"
        />

        {/* Clear prompt button if non-empty */}
        {prompt && (
          <button
            onClick={() => onChangePrompt('')}
            className="p-1 rounded-full hover:bg-white/10 text-[#958ea0] hover:text-white transition-colors mr-1"
            title="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Inset action: Negative prompt toggle */}
        <button
          onClick={() => {
            studioAudio.playButtonTap();
            setShowNegative(!showNegative);
          }}
          className={`px-2 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 transition-colors mr-1 ${
            showNegative || negativePrompt
              ? 'bg-[#ec4899]/20 text-[#ffb0cd] border border-[#ec4899]/40'
              : 'text-[#958ea0] hover:text-[#dde2f3] bg-white/[0.04]'
          }`}
          title="Negative Prompt"
        >
          <ShieldAlert className="w-3 h-3" />
          <span className="hidden sm:inline">Neg</span>
        </button>

        {/* Inset action: Voice dictation */}
        <button
          onClick={handleVoiceToggle}
          className={`p-1.5 rounded-full transition-all mr-1 ${
            isListening 
              ? 'bg-rose-500 text-white animate-pulse' 
              : 'text-[#958ea0] hover:text-[#06b6d4] hover:bg-white/10'
          }`}
          title="Voice Dictation"
        >
          <Mic className="w-3.5 h-3.5" />
        </button>

        {/* Inset action: Neural Engine parameters drawer */}
        <button
          onClick={() => {
            studioAudio.playButtonTap();
            onOpenNeuralLab();
          }}
          className="p-1.5 rounded-full text-[#958ea0] hover:text-[#8b5cf6] hover:bg-white/10 transition-colors"
          title="Camera & Neural Parameters"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Negative Prompt Drawer if opened */}
      {showNegative && (
        <div className="w-full flex items-center gap-2 p-1.5 px-3 rounded-lg bg-black/50 border border-[#ec4899]/30 text-xs">
          <span className="text-[10px] font-mono text-[#ffb0cd] shrink-0">AVOID:</span>
          <input
            type="text"
            value={negativePrompt}
            onChange={(e) => onChangeNegativePrompt(e.target.value)}
            placeholder="blurry, distorted anatomy, text artifacts, oversaturated..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-[#ffdad6] placeholder:text-[#958ea0] font-sans"
          />
          <button
            onClick={() => setShowNegative(false)}
            className="text-[#958ea0] hover:text-white text-xs"
          >
            Done
          </button>
        </div>
      )}

      {/* 2. Magic Prompt Pills Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 select-none">
        <span className="text-[10px] font-mono text-[#06b6d4] shrink-0 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Sparkles className="w-2.5 h-2.5" />
          Magic:
        </span>
        {MAGIC_PROMPT_PILLS.map((pill) => {
          const isActive = prompt.toLowerCase().includes(pill.toLowerCase());
          return (
            <button
              key={pill}
              onClick={() => handleAddPromptPill(pill)}
              className={`h-6 px-2.5 rounded-full text-[11px] whitespace-nowrap shrink-0 transition-all flex items-center gap-1 ${
                isActive
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white font-medium shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                  : 'bg-white/[0.05] border border-white/10 text-[#cbc3d7] hover:border-white/25 hover:text-white'
              }`}
            >
              <span>{pill}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-white animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* 3. Filter & Preset Chips (32px height according to spec) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
        {styleChips.map((chip) => {
          const isActive = selectedFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => {
                studioAudio.playButtonTap();
                onSelectFilter(chip.id);
              }}
              className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'border border-[#8b5cf6] bg-gradient-to-r from-[#8b5cf6]/25 to-[#06b6d4]/25 text-white font-semibold shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'bg-transparent border border-white/10 text-[#958ea0] hover:text-[#dde2f3] hover:border-white/20'
              }`}
            >
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] shadow-[0_0_6px_#06b6d4]" />
              )}
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
