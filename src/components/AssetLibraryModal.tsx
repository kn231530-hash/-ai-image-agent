import React, { useState } from 'react';
import { TimelineClip } from '../types';
import { INITIAL_IMAGES } from '../utils/presets';
import { 
  X, 
  Film, 
  Sparkles, 
  Layers, 
  Volume2, 
  Plus, 
  Check, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface AssetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClipToTimeline: (clip: Partial<TimelineClip>, trackType: 'video-primary' | 'video-fx' | 'audio-neural') => void;
}

export const AssetLibraryModal: React.FC<AssetLibraryModalProps> = ({
  isOpen,
  onClose,
  onAddClipToTimeline,
}) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState<'all' | 'video' | 'vfx' | 'audio'>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const libraryItems = [
    {
      id: 'lib-1',
      title: 'Neo-Tokyo Rainy Flight',
      category: 'video' as const,
      trackType: 'video-primary' as const,
      duration: 4.0,
      image: INITIAL_IMAGES.tokyo,
      prompt: 'Cinematic vertical drone flight through rain-soaked Neo Tokyo',
      effect: 'cyberpunk-neon' as const,
      cameraMotion: 'FPV Drone' as const,
    },
    {
      id: 'lib-2',
      title: 'Hyperion Sub-Zero Run',
      category: 'video' as const,
      trackType: 'video-primary' as const,
      duration: 3.5,
      image: INITIAL_IMAGES.hypercar,
      prompt: 'Obsidian electric hypercar accelerating through subterranean hyperloop tunnel',
      effect: 'anamorphic-flare' as const,
      cameraMotion: 'Zoom In' as const,
    },
    {
      id: 'lib-3',
      title: 'Solaris Deep Orbit Ring',
      category: 'video' as const,
      trackType: 'video-primary' as const,
      duration: 5.0,
      image: INITIAL_IMAGES.solaris,
      prompt: 'Deep space mega-structure orbiting bioluminescent ring planet',
      effect: 'neural-upscale' as const,
      cameraMotion: 'Orbit 360°' as const,
    },
    {
      id: 'lib-4',
      title: 'Cyborg Interface Matrix',
      category: 'vfx' as const,
      trackType: 'video-fx' as const,
      duration: 4.0,
      image: INITIAL_IMAGES.cyborg,
      prompt: 'Futuristic android face with subtle glowing violet and cyan circuits',
      effect: 'vhs-glitch' as const,
      cameraMotion: 'Static' as const,
    },
    {
      id: 'lib-5',
      title: 'Cyber Horizon Pulse (128 BPM)',
      category: 'audio' as const,
      trackType: 'audio-neural' as const,
      duration: 6.0,
      image: '',
      prompt: 'Neuro-synth beat sequence with 808 sub bass and sidechain compression',
      effect: 'none' as const,
      cameraMotion: 'Static' as const,
    },
    {
      id: 'lib-6',
      title: 'Hyperdrive Sub-Bass Drop',
      category: 'audio' as const,
      trackType: 'audio-neural' as const,
      duration: 5.0,
      image: '',
      prompt: 'Deep cinematic impact sub-bass riser for trailer drops',
      effect: 'none' as const,
      cameraMotion: 'Static' as const,
    },
  ];

  const filteredItems = libraryItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleAdd = (item: typeof libraryItems[0]) => {
    studioAudio.playButtonTap();
    onAddClipToTimeline(
      {
        name: item.title,
        duration: item.duration,
        imageUrl: item.image,
        prompt: item.prompt,
        effect: item.effect,
        cameraMotion: item.cameraMotion,
        speed: 1.0,
        color: item.category === 'audio' ? '#06b6d4' : item.category === 'vfx' ? '#ec4899' : '#8b5cf6',
      },
      item.trackType
    );
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-elevated rounded-2xl flex flex-col overflow-hidden border border-white/15 shadow-[0_16px_64px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-[#0e131f]/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#06b6d4]/20 border border-[#06b6d4]/40 flex items-center justify-center">
              <Film className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#dde2f3] tracking-wide">
                MAGIC CLIP VAULT
              </h2>
              <span className="font-mono text-[10px] text-[#958ea0]">
                Curated neural video stems & VFX
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

        {/* Categories Tab Bar */}
        <div className="flex border-b border-white/10 bg-[#080e1a] px-4 gap-2 pt-2">
          {(['all', 'video', 'vfx', 'audio'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                studioAudio.playButtonTap();
                setActiveCategory(cat);
              }}
              className={`pb-2.5 px-3 text-xs font-medium transition-colors border-b-2 capitalize flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'border-[#06b6d4] text-white'
                  : 'border-transparent text-[#958ea0] hover:text-white'
              }`}
            >
              {cat === 'all' && <Layers className="w-3.5 h-3.5" />}
              {cat === 'video' && <Film className="w-3.5 h-3.5 text-[#8b5cf6]" />}
              {cat === 'vfx' && <Sparkles className="w-3.5 h-3.5 text-[#ec4899]" />}
              {cat === 'audio' && <Volume2 className="w-3.5 h-3.5 text-[#06b6d4]" />}
              <span>{cat === 'all' ? 'All Assets' : cat.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Asset Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl glass-panel border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              {/* Media Preview */}
              {item.image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2.5 border border-white/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur font-mono text-[9px] text-white flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#06b6d4]" />
                    <span>{item.duration.toFixed(1)}s</span>
                  </div>
                </div>
              ) : (
                /* Audio Card Graphic */
                <div className="relative aspect-[3/1] rounded-lg bg-gradient-to-r from-[#0e131f] to-[#161c28] border border-[#06b6d4]/20 mb-2.5 flex items-center justify-center p-3">
                  <div className="flex items-center gap-1 w-full justify-center">
                    {[30, 60, 90, 45, 80, 100, 70, 50, 85, 40, 65, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-[#06b6d4]/60"
                        style={{ height: `${h * 0.3}px` }}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur font-mono text-[9px] text-[#06b6d4]">
                    {item.duration.toFixed(1)}s STEM
                  </div>
                </div>
              )}

              {/* Title & Metadata */}
              <div className="mb-3">
                <h3 className="font-display font-semibold text-xs text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] text-[#958ea0] line-clamp-1 mt-0.5 font-sans">
                  {item.prompt}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAdd(item)}
                className={`w-full py-2 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1.5 ${
                  justAddedId === item.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/[0.08] hover:bg-[#8b5cf6]/30 text-white border border-white/10 active:scale-95'
                }`}
              >
                {justAddedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added to Timeline</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-[#06b6d4]" />
                    <span>Insert to Track</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
