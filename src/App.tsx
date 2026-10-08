/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ProjectData, 
  TimelineClip, 
  TimelineTrack, 
  AspectRatio, 
  Resolution, 
  Fps, 
  GenerativeParams 
} from './types';
import { DEFAULT_PROJECTS, INITIAL_IMAGES } from './utils/presets';
import { TopHud } from './components/TopHud';
import { VideoCanvas } from './components/VideoCanvas';
import { MidTierControls } from './components/MidTierControls';
import { MultiLayerTimeline } from './components/MultiLayerTimeline';
import { ThumbZoneDeck } from './components/ThumbZoneDeck';
import { NeuralLabModal } from './components/NeuralLabModal';
import { AssetLibraryModal } from './components/AssetLibraryModal';
import { RenderMasteringModal } from './components/RenderMasteringModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { studioAudio } from './utils/audio';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Project & Timeline State
  const [projects, setProjects] = useState<ProjectData[]>(DEFAULT_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-1');
  const [currentSpeed, setCurrentSpeed] = useState<number>(1.0);
  const [activeLut, setActiveLut] = useState<string>('tokyo-noir');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Active Screen mode & Mobile Simulator Frame
  const [activeScreen, setActiveScreen] = useState<'studio' | 'neural-lab' | 'library'>('studio');
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);

  // Modals
  const [isNeuralLabOpen, setIsNeuralLabOpen] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isRenderOpen, setIsRenderOpen] = useState<boolean>(false);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState<boolean>(false);

  // AI Prompt Engine State
  const [prompt, setPrompt] = useState<string>('Cinematic cyberpunk drone shot, neon violet reflections, anamorphic flare 8k');
  const [negativePrompt, setNegativePrompt] = useState<string>('blurry, oversaturated, deformed geometry');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generativeParams, setGenerativeParams] = useState<GenerativeParams>({
    prompt: 'Cinematic cyberpunk drone shot, neon violet reflections, anamorphic flare 8k',
    negativePrompt: 'blurry, oversaturated, deformed geometry',
    stylePreset: 'cyberpunk-neon',
    cameraMotion: 'FPV Drone',
    motionIntensity: 7.5,
    seed: 8492041,
    guidanceScale: 8.5,
    modelVersion: 'Kinetix HyperV-4.2',
    fps: 60,
  });

  // Current Project
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Playback timer loop
  const lastTimeRef = useRef<number>(performance.now());
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      studioAudio.startPlaybackHum();
      lastTimeRef.current = performance.now();

      const loop = (now: number) => {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta * currentSpeed;
          if (next >= currentProject.totalDuration) {
            // Loop back to start
            return 0;
          }
          return next;
        });
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    } else {
      studioAudio.stopPlaybackHum();
    }

    return () => {
      cancelAnimationFrame(animId);
      studioAudio.stopPlaybackHum();
    };
  }, [isPlaying, currentSpeed, currentProject.totalDuration]);

  // Find active clips based on currentTime
  const primaryTrack = currentProject.tracks.find((t) => t.type === 'video-primary');
  const activeClip = primaryTrack?.clips.find(
    (c) => c.startTime <= currentTime && currentTime < c.startTime + c.duration
  ) || primaryTrack?.clips[0];

  const fxTrack = currentProject.tracks.find((t) => t.type === 'video-fx');
  const activeOverlayClip = fxTrack && !fxTrack.isMuted
    ? fxTrack.clips.find((c) => c.startTime <= currentTime && currentTime < c.startTime + c.duration)
    : undefined;

  const captionTrack = currentProject.tracks.find((t) => t.type === 'captions');
  const activeCaptionClip = captionTrack && !captionTrack.isMuted
    ? captionTrack.clips.find((c) => c.startTime <= currentTime && currentTime < c.startTime + c.duration)
    : undefined;

  // Actions
  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleSelectAspectRatio = (ar: AspectRatio) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, aspectRatio: ar } : p))
    );
  };

  const handleSelectResolution = (res: Resolution) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, resolution: res } : p))
    );
  };

  const handleSelectFps = (newFps: Fps) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, fps: newFps } : p))
    );
  };

  const handleCycleSpeed = () => {
    const speeds = [0.5, 1.0, 2.0];
    const nextIdx = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
    setCurrentSpeed(speeds[nextIdx]);
  };

  // Timeline Editing Actions
  const handleSplitClip = (clipId: string, splitTime: number) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        return {
          ...proj,
          tracks: proj.tracks.map((track) => {
            const clipIdx = track.clips.findIndex((c) => c.id === clipId);
            if (clipIdx === -1) return track;
            const clip = track.clips[clipIdx];
            if (splitTime <= clip.startTime || splitTime >= clip.startTime + clip.duration) {
              return track;
            }
            const firstDur = splitTime - clip.startTime;
            const secondDur = clip.duration - firstDur;
            const clip1: TimelineClip = { ...clip, duration: firstDur };
            const clip2: TimelineClip = {
              ...clip,
              id: `${clip.id}-split-${Date.now()}`,
              name: `${clip.name} (Part 2)`,
              startTime: splitTime,
              duration: secondDur,
            };
            const updated = [...track.clips];
            updated.splice(clipIdx, 1, clip1, clip2);
            return { ...track, clips: updated };
          }),
        };
      })
    );
  };

  const handleDeleteClip = (clipId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        return {
          ...proj,
          tracks: proj.tracks.map((track) => ({
            ...track,
            clips: track.clips.filter((c) => c.id !== clipId),
          })),
        };
      })
    );
    if (selectedClipId === clipId) setSelectedClipId(null);
  };

  const handleDuplicateClip = (clipId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        return {
          ...proj,
          tracks: proj.tracks.map((track) => {
            const clip = track.clips.find((c) => c.id === clipId);
            if (!clip) return track;
            const newClip: TimelineClip = {
              ...clip,
              id: `dupe-${Date.now()}`,
              name: `${clip.name} (Copy)`,
              startTime: clip.startTime + clip.duration,
            };
            return { ...track, clips: [...track.clips, newClip] };
          }),
        };
      })
    );
  };

  const handleToggleMuteTrack = (trackId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        return {
          ...proj,
          tracks: proj.tracks.map((track) =>
            track.id === trackId ? { ...track, isMuted: !track.isMuted } : track
          ),
        };
      })
    );
  };

  const handleToggleLockTrack = (trackId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        return {
          ...proj,
          tracks: proj.tracks.map((track) =>
            track.id === trackId ? { ...track, isLocked: !track.isLocked } : track
          ),
        };
      })
    );
  };

  // AI Generative Synthesis Action
  const handleGenerateVideo = () => {
    if (isGenerating) return;
    setIsGenerating(true);

    const generatedClipId = `gen-${Date.now()}`;
    const startTime = currentTime;
    const duration = 3.5;

    // Pick an image based on prompt keywords or cyclic
    const imagesList = [
      INITIAL_IMAGES.tokyo,
      INITIAL_IMAGES.hypercar,
      INITIAL_IMAGES.solaris,
      INITIAL_IMAGES.cyborg,
    ];
    const pickedImage = imagesList[Math.floor(Math.random() * imagesList.length)];

    // 1. Insert shimmering placeholder clip into V1
    const newClipPlaceholder: TimelineClip = {
      id: generatedClipId,
      trackId: 'track-v1',
      name: prompt.slice(0, 24) || 'Neural Synthesis',
      startTime,
      duration,
      prompt,
      imageUrl: pickedImage,
      isGenerating: true,
      speed: 1.0,
      effect: generativeParams.stylePreset as any || 'cyberpunk-neon',
      cameraMotion: generativeParams.cameraMotion,
      color: '#8b5cf6',
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        const newDuration = Math.max(proj.totalDuration, startTime + duration);
        return {
          ...proj,
          totalDuration: newDuration,
          tracks: proj.tracks.map((track) => {
            if (track.type === 'video-primary') {
              return { ...track, clips: [...track.clips, newClipPlaceholder] };
            }
            return track;
          }),
        };
      })
    );
    setSelectedClipId(generatedClipId);

    // 2. Complete generation after 2.4s simulation
    setTimeout(() => {
      setIsGenerating(false);
      studioAudio.playRenderComplete();

      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== activeProjectId) return proj;
          return {
            ...proj,
            tracks: proj.tracks.map((track) => {
              if (track.type === 'video-primary') {
                return {
                  ...track,
                  clips: track.clips.map((c) =>
                    c.id === generatedClipId ? { ...c, isGenerating: false } : c
                  ),
                };
              }
              return track;
            }),
          };
        })
      );
    }, 2400);
  };

  // Add Clip from Library
  const handleAddClipFromLibrary = (
    clipData: Partial<TimelineClip>,
    trackType: 'video-primary' | 'video-fx' | 'audio-neural'
  ) => {
    const newId = `lib-clip-${Date.now()}`;
    const newClip: TimelineClip = {
      id: newId,
      trackId: trackType === 'video-primary' ? 'track-v1' : trackType === 'video-fx' ? 'track-v2' : 'track-a1',
      name: clipData.name || 'Library Clip',
      startTime: currentTime,
      duration: clipData.duration || 4.0,
      imageUrl: clipData.imageUrl || '',
      prompt: clipData.prompt,
      effect: clipData.effect || 'none',
      cameraMotion: clipData.cameraMotion || 'Static',
      speed: 1.0,
      color: clipData.color || '#8b5cf6',
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        const newDuration = Math.max(proj.totalDuration, currentTime + (clipData.duration || 4.0));
        return {
          ...proj,
          totalDuration: newDuration,
          tracks: proj.tracks.map((track) => {
            if (track.type === trackType) {
              return { ...track, clips: [...track.clips, newClip] };
            }
            return track;
          }),
        };
      })
    );
    setSelectedClipId(newId);
  };

  // Create New Project
  const handleCreateProject = (name: string, aspectRatio: AspectRatio) => {
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      name,
      aspectRatio,
      resolution: '4K',
      fps: 60,
      totalDuration: 10.0,
      thumbnail: INITIAL_IMAGES.tokyo,
      tracks: [
        {
          id: `track-v1-${Date.now()}`,
          type: 'video-primary',
          label: 'V1: Neural Video',
          isMuted: false,
          isLocked: false,
          clips: [
            {
              id: `clip-init-${Date.now()}`,
              trackId: `track-v1-${Date.now()}`,
              name: 'Scene Master',
              startTime: 0,
              duration: 5.0,
              imageUrl: INITIAL_IMAGES.tokyo,
              speed: 1.0,
              effect: 'cyberpunk-neon',
              cameraMotion: 'FPV Drone',
              color: '#8b5cf6',
            },
          ],
        },
        {
          id: `track-v2-${Date.now()}`,
          type: 'video-fx',
          label: 'V2: Hologram FX',
          isMuted: false,
          isLocked: false,
          clips: [],
        },
        {
          id: `track-a1-${Date.now()}`,
          type: 'audio-neural',
          label: 'A1: Cyber Stems',
          isMuted: false,
          isLocked: false,
          clips: [],
        },
        {
          id: `track-cap-${Date.now()}`,
          type: 'captions',
          label: 'T1: Kinetic Type',
          isMuted: false,
          isLocked: false,
          clips: [],
        },
      ],
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    setCurrentTime(0);
  };

  const selectedClip = currentProject.tracks
    .flatMap((t) => t.clips)
    .find((c) => c.id === selectedClipId);

  return (
    <div className="min-h-screen w-full bg-[#030712] text-[#dde2f3] flex flex-col items-center justify-start overflow-hidden">
      {/* Container wrapper: either mobile simulated frame or full viewport */}
      <div
        className={`w-full flex-1 flex flex-col transition-all duration-300 ${
          isMobileSimulator
            ? 'max-w-[430px] my-2 sm:my-4 border border-white/20 rounded-[44px] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden bg-[#080e1a] relative ring-1 ring-white/10'
            : 'max-w-full h-screen'
        }`}
      >
        {/* Mobile Simulator Device Dynamic Island / Speaker notch */}
        {isMobileSimulator && (
          <div className="w-full h-7 bg-black flex items-center justify-between px-6 pt-1 select-none z-40 shrink-0">
            <span className="font-mono text-[11px] text-white font-semibold">9:41</span>
            <div className="w-24 h-4 bg-black rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
              <div className="w-2 h-2 rounded-full bg-[#06b6d4]/40" />
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] text-white">
              <span>5G</span>
              <div className="w-4 h-2 rounded border border-white/80 p-[1px] flex items-center">
                <div className="h-full w-full bg-[#06b6d4] rounded-sm" />
              </div>
            </div>
          </div>
        )}

        {/* 1. Top HUD (48px height) */}
        <TopHud
          projectName={currentProject.name}
          onOpenProjectManager={() => setIsProjectManagerOpen(true)}
          aspectRatio={currentProject.aspectRatio}
          onSelectAspectRatio={handleSelectAspectRatio}
          resolution={currentProject.resolution}
          onSelectResolution={handleSelectResolution}
          fps={currentProject.fps}
          onSelectFps={handleSelectFps}
          isGenerating={isGenerating}
          onOpenRenderModal={() => setIsRenderOpen(true)}
          onOpenNeuralLab={() => setIsNeuralLabOpen(true)}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          activeScreen={activeScreen}
          onChangeScreen={(scr) => {
            setActiveScreen(scr);
            if (scr === 'neural-lab') setIsNeuralLabOpen(true);
            if (scr === 'library') setIsLibraryOpen(true);
          }}
          isMobileSimulator={isMobileSimulator}
          onToggleMobileSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        />

        {/* 2. Primary Viewport Canvas Player */}
        <VideoCanvas
          aspectRatio={currentProject.aspectRatio}
          currentTime={currentTime}
          totalDuration={currentProject.totalDuration}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          activeClip={activeClip}
          overlayClip={activeOverlayClip}
          activeCaption={activeCaptionClip?.name}
          fps={currentProject.fps}
          activeLut={activeLut}
        />

        {/* 3. Mid-tier Controls (44px height prompt bar & chips) */}
        <MidTierControls
          prompt={prompt}
          onChangePrompt={setPrompt}
          negativePrompt={negativePrompt}
          onChangeNegativePrompt={setNegativePrompt}
          onGenerateClip={handleGenerateVideo}
          isGenerating={isGenerating}
          selectedFilter={selectedFilter}
          onSelectFilter={(f) => {
            setSelectedFilter(f);
            if (selectedClip) {
              setProjects((prev) =>
                prev.map((proj) =>
                  proj.id === activeProjectId
                    ? {
                        ...proj,
                        tracks: proj.tracks.map((tr) => ({
                          ...tr,
                          clips: tr.clips.map((c) =>
                            c.id === selectedClip.id ? { ...c, effect: f as any } : c
                          ),
                        })),
                      }
                    : proj
                )
              );
            }
          }}
          onOpenNeuralLab={() => setIsNeuralLabOpen(true)}
        />

        {/* 4. Multi-layer Timeline Area (140px-220px dynamic drawer) */}
        <MultiLayerTimeline
          tracks={currentProject.tracks}
          currentTime={currentTime}
          totalDuration={currentProject.totalDuration}
          onSeek={handleSeek}
          selectedClipId={selectedClipId}
          onSelectClip={(c) => setSelectedClipId(c ? c.id : null)}
          onSplitClip={handleSplitClip}
          onDeleteClip={handleDeleteClip}
          onDuplicateClip={handleDuplicateClip}
          onToggleMuteTrack={handleToggleMuteTrack}
          onToggleLockTrack={handleToggleLockTrack}
          fps={currentProject.fps}
        />

        {/* 5. Thumb-Zone Deck (64px height) */}
        <ThumbZoneDeck
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onSplice={() => {
            if (selectedClipId) handleSplitClip(selectedClipId, currentTime);
          }}
          onAddKeyframe={() => {
            studioAudio.playButtonTap();
            if (selectedClip) {
              const motions: typeof generativeParams.cameraMotion[] = [
                'FPV Drone',
                'Zoom In',
                'Orbit 360°',
                'Pan Left',
                'Pan Right',
                'Tilt Up',
              ];
              const nextMotion = motions[(motions.indexOf(selectedClip.cameraMotion) + 1) % motions.length];
              setProjects((prev) =>
                prev.map((proj) =>
                  proj.id === activeProjectId
                    ? {
                        ...proj,
                        tracks: proj.tracks.map((tr) => ({
                          ...tr,
                          clips: tr.clips.map((c) =>
                            c.id === selectedClip.id ? { ...c, cameraMotion: nextMotion } : c
                          ),
                        })),
                      }
                    : proj
                )
              );
            }
          }}
          onCycleSpeed={handleCycleSpeed}
          currentSpeed={currentSpeed}
          onGenerateVideo={handleGenerateVideo}
          isGenerating={isGenerating}
          hasSelectedClip={!!selectedClipId}
        />
      </div>

      {/* Screen Modals */}
      <NeuralLabModal
        isOpen={isNeuralLabOpen}
        onClose={() => {
          setIsNeuralLabOpen(false);
          setActiveScreen('studio');
        }}
        params={generativeParams}
        onUpdateParams={(p) => setGenerativeParams((prev) => ({ ...prev, ...p }))}
        onApplyAndGenerate={handleGenerateVideo}
        previewImage={activeClip?.imageUrl || INITIAL_IMAGES.tokyo}
      />

      <AssetLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => {
          setIsLibraryOpen(false);
          setActiveScreen('studio');
        }}
        onAddClipToTimeline={handleAddClipFromLibrary}
      />

      <RenderMasteringModal
        isOpen={isRenderOpen}
        onClose={() => setIsRenderOpen(false)}
        aspectRatio={currentProject.aspectRatio}
        resolution={currentProject.resolution}
        fps={currentProject.fps}
        totalDuration={currentProject.totalDuration}
        activeLut={activeLut}
        onSelectLut={setActiveLut}
        previewImage={activeClip?.imageUrl || INITIAL_IMAGES.tokyo}
      />

      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          setCurrentTime(0);
        }}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
