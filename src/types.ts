export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
export type Resolution = '4K' | '1080P' | '720P';
export type Fps = 24 | 30 | 60;
export type CameraMotion = 'Static' | 'Pan Left' | 'Pan Right' | 'Tilt Up' | 'Tilt Down' | 'Orbit 360°' | 'FPV Drone' | 'Zoom In' | 'Roll';
export type FilterEffect = 'none' | 'cyberpunk-neon' | 'film-grain' | 'vhs-glitch' | 'anamorphic-flare' | 'neural-upscale';

export interface TimelineClip {
  id: string;
  trackId: string;
  name: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  prompt?: string;
  imageUrl: string;
  isGenerating?: boolean;
  speed: number;
  effect: FilterEffect;
  cameraMotion: CameraMotion;
  volume?: number;
  color: string;
}

export interface TimelineTrack {
  id: string;
  type: 'video-primary' | 'video-fx' | 'audio-neural' | 'captions';
  label: string;
  isMuted: boolean;
  isLocked: boolean;
  clips: TimelineClip[];
}

export interface ProjectData {
  id: string;
  name: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  fps: Fps;
  totalDuration: number;
  tracks: TimelineTrack[];
  thumbnail: string;
}

export interface GenerativeParams {
  prompt: string;
  negativePrompt: string;
  stylePreset: string;
  cameraMotion: CameraMotion;
  motionIntensity: number; // 1 - 10
  seed: number;
  guidanceScale: number; // 1.0 - 20.0
  modelVersion: string;
  fps: Fps;
}

export interface RenderJob {
  isRendering: boolean;
  progress: number; // 0 - 100
  currentFrame: number;
  totalFrames: number;
  bitrate: string;
  elapsedTime: number;
  lutGrade: string;
  outputFormat: 'MP4' | 'ProRes' | 'GIF' | 'WebM';
  completedUrl?: string;
}
