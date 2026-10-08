import React, { useState, useEffect } from 'react';
import { Resolution, Fps, AspectRatio, RenderJob } from '../types';
import { LUT_GRADES } from '../utils/presets';
import { 
  X, 
  Sparkles, 
  Download, 
  CheckCircle, 
  Cpu, 
  Layers, 
  Film, 
  Share2, 
  Play,
  RotateCcw
} from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface RenderMasteringModalProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  fps: Fps;
  totalDuration: number;
  activeLut: string;
  onSelectLut: (lutId: string) => void;
  previewImage: string;
}

export const RenderMasteringModal: React.FC<RenderMasteringModalProps> = ({
  isOpen,
  onClose,
  aspectRatio,
  resolution,
  fps,
  totalDuration,
  activeLut,
  onSelectLut,
  previewImage,
}) => {
  if (!isOpen) return null;

  const totalFrames = Math.floor(totalDuration * fps);
  const [selectedFormat, setSelectedFormat] = useState<'MP4' | 'ProRes' | 'GIF' | 'WebM'>('MP4');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [renderDone, setRenderDone] = useState(false);

  // Simulated render loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRendering) {
      interval = setInterval(() => {
        setRenderProgress((prev) => {
          if (prev >= 100) {
            setIsRendering(false);
            setRenderDone(true);
            studioAudio.playRenderComplete();
            return 100;
          }
          const next = prev + Math.random() * 4 + 2;
          setCurrentFrame(Math.min(totalFrames, Math.floor((next / 100) * totalFrames)));
          return Math.min(100, next);
        });
      }, 90);
    }
    return () => clearInterval(interval);
  }, [isRendering, totalFrames]);

  const handleStartRender = () => {
    studioAudio.playGenerateStart();
    setRenderDone(false);
    setRenderProgress(0);
    setCurrentFrame(0);
    setIsRendering(true);
  };

  const handleDownload = () => {
    studioAudio.playButtonTap();
    // Simulate instantaneous client export file download
    const blob = new Blob(['Kinetix AI Generated Video Stream'], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kinetix-master-${resolution}-${fps}fps-${aspectRatio.replace(':', 'x')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] glass-elevated rounded-2xl flex flex-col overflow-hidden border border-white/15 shadow-[0_16px_64px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-[#0e131f]/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#dde2f3] tracking-wide">
                STUDIO MASTERING & EXPORT
              </h2>
              <span className="font-mono text-[10px] text-[#4cd7f6]">
                {resolution} · {fps}FPS · {aspectRatio}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5 text-xs">
          {/* Active Render Progress Console */}
          {isRendering || renderDone ? (
            <div className="p-4 rounded-xl bg-black/60 border border-[#8b5cf6]/40 flex flex-col gap-3 shadow-[0_0_24px_rgba(139,92,246,0.2)]">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#d0bcff] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#06b6d4] animate-spin" />
                  {renderDone ? 'MASTER ENCODE COMPLETED' : 'SYNTHESIZING NEURAL FRAMES...'}
                </span>
                <span className="font-mono text-xs text-[#06b6d4] font-bold">
                  {renderProgress.toFixed(0)}%
                </span>
              </div>

              {/* Progress Bar with Gradient */}
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] transition-all duration-100 shadow-[0_0_12px_#8b5cf6]"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>

              {/* Telemetry Readouts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono">
                <div>
                  <span className="text-[#958ea0] block">FRAME COUNT</span>
                  <span className="text-white font-medium">
                    {currentFrame} / {totalFrames}
                  </span>
                </div>
                <div>
                  <span className="text-[#958ea0] block">ESTIMATED BITRATE</span>
                  <span className="text-[#06b6d4] font-medium">85.4 Mbps</span>
                </div>
                <div>
                  <span className="text-[#958ea0] block">COLOR ENCODE</span>
                  <span className="text-[#ffb0cd] font-medium">10-Bit 4:2:2</span>
                </div>
                <div>
                  <span className="text-[#958ea0] block">OUTPUT ENGINE</span>
                  <span className="text-[#8b5cf6] font-medium">Metal RT-Core</span>
                </div>
              </div>

              {renderDone && (
                <div className="mt-2 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="font-sans text-xs text-emerald-200">
                      Master package ready for high-resolution distribution.
                    </span>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Color Grade LUT Selection */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-semibold text-xs text-white">
              Color Grading LUT Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LUT_GRADES.map((lut) => {
                const isSelected = activeLut === lut.id;
                return (
                  <button
                    key={lut.id}
                    onClick={() => {
                      studioAudio.playButtonTap();
                      onSelectLut(lut.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.3)] text-white'
                        : 'bg-white/[0.04] border-white/10 text-[#958ea0] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-3 h-3 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: lut.previewColor }}
                      />
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
                      )}
                    </div>
                    <span className="font-mono text-xs text-[#dde2f3] font-medium">
                      {lut.name}
                    </span>
                    <span className="text-[10px] text-[#958ea0] line-clamp-1">
                      {lut.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Codec & Packaging Format */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-semibold text-xs text-white">
              Encoding Codec & Container
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { format: 'MP4' as const, label: 'MP4 (H.265 / HEVC)', desc: 'Web & Mobile Ready' },
                { format: 'ProRes' as const, label: 'Apple ProRes 422 HQ', desc: 'Broadcast Grade' },
                { format: 'WebM' as const, label: 'WebM (VP9 Alpha)', desc: 'Ultra-compressed' },
                { format: 'GIF' as const, label: 'Animated 60fps GIF', desc: 'Social Loop' },
              ].map((fmt) => {
                const isSelected = selectedFormat === fmt.format;
                return (
                  <button
                    key={fmt.format}
                    onClick={() => {
                      studioAudio.playButtonTap();
                      setSelectedFormat(fmt.format);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#06b6d4]/20 border-[#06b6d4] text-white'
                        : 'bg-white/[0.04] border-white/10 text-[#958ea0] hover:text-white'
                    }`}
                  >
                    <span className="font-mono font-medium text-xs block text-[#dde2f3]">
                      {fmt.label}
                    </span>
                    <span className="text-[10px] text-[#958ea0]">{fmt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-16 px-4 border-t border-white/10 flex items-center justify-between bg-[#080e1a] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#958ea0] hover:text-white transition-colors"
          >
            Close
          </button>

          {!renderDone ? (
            <button
              onClick={handleStartRender}
              disabled={isRendering}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                boxShadow: '0 0 24px rgba(139, 92, 246, 0.4)',
              }}
              className="h-11 px-6 rounded-full font-bold text-xs text-white border border-white/30 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRendering ? 'ENCODING IN PROGRESS...' : 'START MASTER RENDER'}</span>
            </button>
          ) : (
            <button
              onClick={handleStartRender}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-encode</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
