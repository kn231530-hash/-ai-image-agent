import React, { useState } from 'react';
import { CameraMotion, GenerativeParams } from '../types';
import { CAMERA_MOTIONS } from '../utils/presets';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Crosshair, 
  Zap, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Compass, 
  Maximize, 
  Shuffle, 
  Check, 
  Brush,
  Sliders,
  Layers
} from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface NeuralLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: GenerativeParams;
  onUpdateParams: (params: Partial<GenerativeParams>) => void;
  onApplyAndGenerate: () => void;
  previewImage: string;
}

export const NeuralLabModal: React.FC<NeuralLabModalProps> = ({
  isOpen,
  onClose,
  params,
  onUpdateParams,
  onApplyAndGenerate,
  previewImage,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'camera' | 'motion-brush' | 'physics'>('camera');
  const [brushVectors, setBrushVectors] = useState<{ x: number; y: number; dirX: number; dirY: number }[]>([
    { x: 30, y: 40, dirX: 20, dirY: -15 },
    { x: 65, y: 55, dirX: 25, dirY: 0 },
  ]);

  const handleRandomizeSeed = () => {
    studioAudio.playButtonTap();
    onUpdateParams({ seed: Math.floor(Math.random() * 9999999) });
  };

  const handleEnhancePrompt = () => {
    studioAudio.playButtonTap();
    const additions = [
      'anamorphic 2.39:1 aspect, Panavision C-Series lenses, subtle chromatic flare',
      'volumetric twilight haze, 8k raytraced specular reflections on wet asphalt',
      'ultra high-speed phantom flex 4k slow motion, bioluminescent rim glow',
      'shallow depth of field, f/1.4 aperture, cinematic atmospheric smoke',
    ];
    const picked = additions[Math.floor(Math.random() * additions.length)];
    const enhanced = params.prompt ? `${params.prompt}, ${picked}` : picked;
    onUpdateParams({ prompt: enhanced });
  };

  const getMotionIcon = (icon: string) => {
    switch (icon) {
      case 'zap': return <Zap className="w-4 h-4 text-[#8b5cf6]" />;
      case 'maximize': return <Maximize className="w-4 h-4 text-[#06b6d4]" />;
      case 'rotate-cw': return <RotateCw className="w-4 h-4 text-[#ec4899]" />;
      case 'arrow-left': return <ArrowLeft className="w-4 h-4 text-[#06b6d4]" />;
      case 'arrow-right': return <ArrowRight className="w-4 h-4 text-[#06b6d4]" />;
      case 'arrow-up': return <ArrowUp className="w-4 h-4 text-[#8b5cf6]" />;
      case 'arrow-down': return <ArrowDown className="w-4 h-4 text-[#8b5cf6]" />;
      case 'compass': return <Compass className="w-4 h-4 text-[#ec4899]" />;
      default: return <Crosshair className="w-4 h-4 text-[#958ea0]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-elevated rounded-2xl flex flex-col overflow-hidden border border-white/15 shadow-[0_16px_64px_rgba(0,0,0,0.9)]">
        {/* Modal Header */}
        <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-[#0e131f]/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#8b5cf6]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#dde2f3] tracking-wide">
                NEURAL ENGINE LAB
              </h2>
              <span className="font-mono text-[10px] text-[#4cd7f6]">
                MODEL: {params.modelVersion}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              studioAudio.playButtonTap();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#958ea0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#080e1a] px-4 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('camera')}
            className={`pb-2.5 px-3 text-xs font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-[#8b5cf6] text-white'
                : 'border-transparent text-[#958ea0] hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Camera Vectors</span>
          </button>
          <button
            onClick={() => setActiveTab('motion-brush')}
            className={`pb-2.5 px-3 text-xs font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'motion-brush'
                ? 'border-[#06b6d4] text-white'
                : 'border-transparent text-[#958ea0] hover:text-white'
            }`}
          >
            <Brush className="w-3.5 h-3.5" />
            <span>Motion Brush</span>
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={`pb-2.5 px-3 text-xs font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'physics'
                ? 'border-[#ec4899] text-white'
                : 'border-transparent text-[#958ea0] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Telemetry & Physics</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5 text-xs">
          {/* TAB 1: Camera Vectors */}
          {activeTab === 'camera' && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-display font-semibold text-sm text-white mb-1">
                  Kinematic Trajectory Vectors
                </h3>
                <p className="text-xs text-[#958ea0]">
                  Select the 3D optical movement curve applied during generative frame synthesis.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CAMERA_MOTIONS.map((motion) => {
                  const isSelected = params.cameraMotion === motion.label;
                  return (
                    <button
                      key={motion.label}
                      onClick={() => {
                        studioAudio.playButtonTap();
                        onUpdateParams({ cameraMotion: motion.label });
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 relative ${
                        isSelected
                          ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] shadow-[0_0_16px_rgba(139,92,246,0.3)] text-white'
                          : 'bg-white/[0.04] border-white/10 text-[#958ea0] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {getMotionIcon(motion.icon)}
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] shadow-[0_0_6px_#06b6d4]" />
                        )}
                      </div>
                      <span className="font-mono font-medium text-xs text-[#dde2f3]">
                        {motion.label}
                      </span>
                      <span className="text-[10px] text-[#958ea0] leading-snug line-clamp-2">
                        {motion.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Motion Brush */}
          {activeTab === 'motion-brush' && (
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-display font-semibold text-sm text-white mb-1">
                  Spatial Vector Masking
                </h3>
                <p className="text-xs text-[#958ea0]">
                  Tap and drag across the anchor frame to inject regional velocity vectors.
                </p>
              </div>

              {/* Interactive Vector Canvas Mockup */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/20 bg-black">
                <img
                  src={previewImage}
                  alt="Frame anchor"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-60"
                />

                {/* Drawn Vectors */}
                {brushVectors.map((vec, idx) => (
                  <div
                    key={idx}
                    className="absolute flex items-center"
                    style={{ left: `${vec.x}%`, top: `${vec.y}%` }}
                  >
                    <div className="w-3 h-3 rounded-full bg-[#06b6d4] shadow-[0_0_10px_#06b6d4] flex items-center justify-center text-[9px] font-mono text-black font-bold">
                      {idx + 1}
                    </div>
                    <div
                      className="h-0.5 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] shadow-[0_0_8px_#06b6d4] origin-left"
                      style={{
                        width: '45px',
                        transform: `rotate(${vec.dirY > 0 ? 30 : -25}deg)`,
                      }}
                    />
                  </div>
                ))}

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      studioAudio.playButtonTap();
                      setBrushVectors((prev) => [
                        ...prev,
                        { x: 20 + Math.random() * 60, y: 30 + Math.random() * 40, dirX: 20, dirY: -10 },
                      ]);
                    }}
                    className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] flex items-center gap-1 hover:border-[#06b6d4]"
                  >
                    <Brush className="w-3 h-3 text-[#06b6d4]" />
                    <span>+ Add Vector Pin</span>
                  </button>
                  <button
                    onClick={() => {
                      studioAudio.playButtonTap();
                      setBrushVectors([]);
                    }}
                    className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/20 text-[#958ea0] font-mono text-[10px] hover:text-white"
                  >
                    Reset Vectors
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Telemetry & Physics */}
          {activeTab === 'physics' && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-display font-semibold text-sm text-white mb-1">
                  Hyper-Parameter Telemetry
                </h3>
                <p className="text-xs text-[#958ea0]">
                  Calibrate generative fluid dynamics, seed consistency, and guidance tension.
                </p>
              </div>

              {/* Motion Intensity Tactile Slider */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col gap-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-[#dde2f3] text-xs">MOTION INTENSITY DYNAMICS</span>
                  <span className="text-[#06b6d4] font-bold text-sm">
                    {params.motionIntensity.toFixed(1)} / 10.0
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={params.motionIntensity}
                  onChange={(e) => {
                    studioAudio.playTick();
                    onUpdateParams({ motionIntensity: parseFloat(e.target.value) });
                  }}
                  className="tactile-slider w-full cursor-pointer"
                />
              </div>

              {/* CFG Guidance Scale Slider */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col gap-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-[#dde2f3] text-xs">CFG GUIDANCE TENSION</span>
                  <span className="text-[#8b5cf6] font-bold text-sm">
                    {params.guidanceScale.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="0.5"
                  value={params.guidanceScale}
                  onChange={(e) => {
                    studioAudio.playTick();
                    onUpdateParams({ guidanceScale: parseFloat(e.target.value) });
                  }}
                  className="tactile-slider w-full cursor-pointer"
                />
              </div>

              {/* Seed Randomizer */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-[#dde2f3] block">NEURAL SEED CODE</span>
                  <span className="font-mono text-[11px] text-[#958ea0]">
                    Deterministic generation lock
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[#4cd7f6]">
                    {params.seed}
                  </span>
                  <button
                    onClick={handleRandomizeSeed}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Roll new seed"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Prompt Booster Section */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#8b5cf6]/10 to-[#06b6d4]/10 border border-[#8b5cf6]/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#d0bcff] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d0bcff]" />
                PROMPT OPTIMIZER
              </span>
              <button
                onClick={handleEnhancePrompt}
                className="px-2 py-0.5 rounded bg-[#8b5cf6]/30 hover:bg-[#8b5cf6]/50 text-white font-mono text-[10px] transition-colors border border-[#8b5cf6]/50"
              >
                + Inject Cinematic Polish
              </button>
            </div>
            <p className="text-[#cbc3d7] font-sans text-xs italic">
              "{params.prompt || 'No prompt set'}"
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-16 px-4 border-t border-white/10 flex items-center justify-between bg-[#080e1a] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#958ea0] hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              studioAudio.playGenerateStart();
              onApplyAndGenerate();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply & Synthesize Clip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
