import { ProjectData, TimelineClip, CameraMotion, FilterEffect } from '../types';

export const INITIAL_IMAGES = {
  tokyo: '/src/assets/images/cyber_tokyo_night_1791439052261.jpg',
  hypercar: '/src/assets/images/hyperion_cyber_car_1791439068580.jpg',
  solaris: '/src/assets/images/solaris_orbit_station_1791439087207.jpg',
  cyborg: '/src/assets/images/neural_avatar_cyborg_1791439103192.jpg',
};

export const INITIAL_CLIPS: TimelineClip[] = [
  {
    id: 'clip-1',
    trackId: 'track-v1',
    name: 'Neo-Tokyo Rainy Flight',
    startTime: 0,
    duration: 3.5,
    prompt: 'Cinematic vertical drone flight through rain-soaked Neo Tokyo, neon violet signs reflecting on asphalt, hypercar zooming past with cyan light streaks, 8k hyperrealism',
    imageUrl: INITIAL_IMAGES.tokyo,
    speed: 1.0,
    effect: 'cyberpunk-neon',
    cameraMotion: 'FPV Drone',
    color: '#8b5cf6',
  },
  {
    id: 'clip-2',
    trackId: 'track-v1',
    name: 'Hyperion Mach Speed',
    startTime: 3.5,
    duration: 4.0,
    prompt: 'Obsidian electric hypercar accelerating through subterranean hyperloop tunnel, neon cyan speed trails, anamorphic lens glare, cinematic 60fps motion blur',
    imageUrl: INITIAL_IMAGES.hypercar,
    speed: 1.0,
    effect: 'anamorphic-flare',
    cameraMotion: 'Zoom In',
    color: '#06b6d4',
  },
  {
    id: 'clip-3',
    trackId: 'track-v1',
    name: 'Solaris Orbit Arrival',
    startTime: 7.5,
    duration: 4.5,
    prompt: 'Deep space mega-structure orbiting bioluminescent ring planet, ultraviolet solar arrays gleaming, cinematic sci-fi film capture',
    imageUrl: INITIAL_IMAGES.solaris,
    speed: 1.0,
    effect: 'neural-upscale',
    cameraMotion: 'Orbit 360°',
    color: '#a855f7',
  },
];

export const INITIAL_OVERLAYS: TimelineClip[] = [
  {
    id: 'clip-ov-1',
    trackId: 'track-v2',
    name: 'HUD Telemetry Grid',
    startTime: 1.0,
    duration: 5.0,
    imageUrl: INITIAL_IMAGES.cyborg,
    speed: 1.0,
    effect: 'vhs-glitch',
    cameraMotion: 'Static',
    color: '#ec4899',
  },
];

export const INITIAL_AUDIO_CLIPS: TimelineClip[] = [
  {
    id: 'clip-a-1',
    trackId: 'track-a1',
    name: 'Cyber Horizon Pulse (128 BPM)',
    startTime: 0,
    duration: 6.0,
    imageUrl: '',
    speed: 1.0,
    effect: 'none',
    cameraMotion: 'Static',
    color: '#06b6d4',
  },
  {
    id: 'clip-a-2',
    trackId: 'track-a1',
    name: 'Hyperdrive Sub-Bass Drop',
    startTime: 6.0,
    duration: 6.0,
    imageUrl: '',
    speed: 1.0,
    effect: 'none',
    cameraMotion: 'Static',
    color: '#8b5cf6',
  },
];

export const INITIAL_CAPTION_CLIPS: TimelineClip[] = [
  {
    id: 'clip-cap-1',
    trackId: 'track-cap',
    name: '"PROJECT 2099 // ACTIVATED"',
    startTime: 0.5,
    duration: 2.5,
    imageUrl: '',
    speed: 1.0,
    effect: 'none',
    cameraMotion: 'Static',
    color: '#ffffff',
  },
  {
    id: 'clip-cap-2',
    trackId: 'track-cap',
    name: '"VELOCITY EXCEEDING HYPER-LIMIT"',
    startTime: 4.0,
    duration: 3.0,
    imageUrl: '',
    speed: 1.0,
    effect: 'none',
    cameraMotion: 'Static',
    color: '#ffffff',
  },
];

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-1',
    name: 'Neo-Tokyo Velocity Reel',
    aspectRatio: '9:16',
    resolution: '4K',
    fps: 60,
    totalDuration: 12.0,
    thumbnail: INITIAL_IMAGES.tokyo,
    tracks: [
      {
        id: 'track-v1',
        type: 'video-primary',
        label: 'V1: Neural Video',
        isMuted: false,
        isLocked: false,
        clips: [...INITIAL_CLIPS],
      },
      {
        id: 'track-v2',
        type: 'video-fx',
        label: 'V2: Hologram FX',
        isMuted: false,
        isLocked: false,
        clips: [...INITIAL_OVERLAYS],
      },
      {
        id: 'track-a1',
        type: 'audio-neural',
        label: 'A1: Cyber Stems',
        isMuted: false,
        isLocked: false,
        clips: [...INITIAL_AUDIO_CLIPS],
      },
      {
        id: 'track-cap',
        type: 'captions',
        label: 'T1: Kinetic Type',
        isMuted: false,
        isLocked: false,
        clips: [...INITIAL_CAPTION_CLIPS],
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'Hyperion Cybercar Teaser',
    aspectRatio: '16:9',
    resolution: '4K',
    fps: 60,
    totalDuration: 10.0,
    thumbnail: INITIAL_IMAGES.hypercar,
    tracks: [
      {
        id: 'track-v1',
        type: 'video-primary',
        label: 'V1: Neural Video',
        isMuted: false,
        isLocked: false,
        clips: [
          {
            id: 'clip-hyp-1',
            trackId: 'track-v1',
            name: 'Sub-Zero Tunnel Run',
            startTime: 0,
            duration: 6.0,
            prompt: 'Hypercar racing through illuminated neon tunnel',
            imageUrl: INITIAL_IMAGES.hypercar,
            speed: 1.0,
            effect: 'anamorphic-flare',
            cameraMotion: 'Zoom In',
            color: '#06b6d4',
          },
          {
            id: 'clip-hyp-2',
            trackId: 'track-v1',
            name: 'Cyborg Pilot Sync',
            startTime: 6.0,
            duration: 4.0,
            prompt: 'Futuristic pilot HUD telemetry sync',
            imageUrl: INITIAL_IMAGES.cyborg,
            speed: 1.0,
            effect: 'vhs-glitch',
            cameraMotion: 'Tilt Down',
            color: '#8b5cf6',
          },
        ],
      },
      {
        id: 'track-v2',
        type: 'video-fx',
        label: 'V2: Hologram FX',
        isMuted: false,
        isLocked: false,
        clips: [],
      },
      {
        id: 'track-a1',
        type: 'audio-neural',
        label: 'A1: Cyber Stems',
        isMuted: false,
        isLocked: false,
        clips: [
          {
            id: 'clip-a-hyp',
            trackId: 'track-a1',
            name: 'Sub-Bass Nitro Surge',
            startTime: 0,
            duration: 10.0,
            imageUrl: '',
            speed: 1.0,
            effect: 'none',
            cameraMotion: 'Static',
            color: '#06b6d4',
          },
        ],
      },
      {
        id: 'track-cap',
        type: 'captions',
        label: 'T1: Kinetic Type',
        isMuted: false,
        isLocked: false,
        clips: [],
      },
    ],
  },
  {
    id: 'proj-3',
    name: 'Solaris Ring Station',
    aspectRatio: '16:9',
    resolution: '4K',
    fps: 24,
    totalDuration: 14.0,
    thumbnail: INITIAL_IMAGES.solaris,
    tracks: [
      {
        id: 'track-v1',
        type: 'video-primary',
        label: 'V1: Neural Video',
        isMuted: false,
        isLocked: false,
        clips: [
          {
            id: 'clip-sol-1',
            trackId: 'track-v1',
            name: 'Deep Orbit Drift',
            startTime: 0,
            duration: 14.0,
            prompt: 'Deep space mega-structure orbiting bioluminescent ring planet',
            imageUrl: INITIAL_IMAGES.solaris,
            speed: 1.0,
            effect: 'neural-upscale',
            cameraMotion: 'Orbit 360°',
            color: '#a855f7',
          },
        ],
      },
      {
        id: 'track-v2',
        type: 'video-fx',
        label: 'V2: Hologram FX',
        isMuted: false,
        isLocked: false,
        clips: [],
      },
      {
        id: 'track-a1',
        type: 'audio-neural',
        label: 'A1: Cyber Stems',
        isMuted: false,
        isLocked: false,
        clips: [],
      },
      {
        id: 'track-cap',
        type: 'captions',
        label: 'T1: Kinetic Type',
        isMuted: false,
        isLocked: false,
        clips: [],
      },
    ],
  },
];

export const MAGIC_PROMPT_PILLS = [
  'Cyberpunk Neon Rain',
  'Anamorphic Lens Flare',
  'FPV Drone Hyperlapse',
  'Bioluminescent Sci-Fi',
  'Hypercar Speed Trails',
  'Neural Cyborg Portrait',
  'Solar Array Deep Orbit',
  'Volumetric Fog 8K',
];

export const CAMERA_MOTIONS: { label: CameraMotion; desc: string; icon: string }[] = [
  { label: 'Static', desc: 'Locked studio tripod, zero jitter', icon: 'crosshair' },
  { label: 'FPV Drone', desc: 'Aggressive sweeping high-velocity pass', icon: 'zap' },
  { label: 'Zoom In', desc: 'Dolly in with dramatic focal compression', icon: 'maximize' },
  { label: 'Orbit 360°', desc: 'Smooth revolving continuous circular orbit', icon: 'rotate-cw' },
  { label: 'Pan Left', desc: 'Horizontal tracking glide from right to left', icon: 'arrow-left' },
  { label: 'Pan Right', desc: 'Horizontal tracking glide from left to right', icon: 'arrow-right' },
  { label: 'Tilt Up', desc: 'Vertical architectural gaze upwards', icon: 'arrow-up' },
  { label: 'Tilt Down', desc: 'Downward crane descent into subject', icon: 'arrow-down' },
  { label: 'Roll', desc: 'Kinetic 15-degree Dutch barrel roll', icon: 'compass' },
];

export const LUT_GRADES = [
  { id: 'tokyo-noir', name: 'Tokyo Noir', previewColor: '#8b5cf6', desc: 'Deep violet shadows with electric cyan neon bloom' },
  { id: 'blade-gold', name: 'Blade Runner', previewColor: '#f59e0b', desc: 'Atmospheric amber haze and sodium-vapor highlights' },
  { id: 'matrix-emerald', name: 'Matrix Emerald', previewColor: '#10b981', desc: 'Digital phosphorus green cast with slate blacks' },
  { id: 'obsidian-cool', name: 'Obsidian 709', previewColor: '#38bdf8', desc: 'Crisp cinematic neutral tones with punchy contrast' },
  { id: 'cyber-rose', name: 'Cyber Rose', previewColor: '#ec4899', desc: 'Vibrant neon magenta saturation for music reels' },
];

export function formatSMPTE(seconds: number, fps: number = 60): string {
  const safeSec = Math.max(0, seconds);
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = Math.floor(safeSec % 60);
  const frames = Math.floor((safeSec % 1) * fps);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}
