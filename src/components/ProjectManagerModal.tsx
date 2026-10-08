import React, { useState } from 'react';
import { ProjectData, AspectRatio } from '../types';
import { 
  X, 
  FolderKanban, 
  Plus, 
  Check, 
  Film, 
  Clock, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectData[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, aspectRatio: AspectRatio) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
}) => {
  if (!isOpen) return null;

  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newAspectRatio, setNewAspectRatio] = useState<AspectRatio>('9:16');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    studioAudio.playButtonTap();
    onCreateProject(newProjectName.trim(), newAspectRatio);
    setNewProjectName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[85vh] glass-elevated rounded-2xl flex flex-col overflow-hidden border border-white/15 shadow-[0_16px_64px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-[#0e131f]/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-[#8b5cf6]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#dde2f3] tracking-wide">
                PROJECT REPOSITORIES
              </h2>
              <span className="font-mono text-[10px] text-[#958ea0]">
                Local & cloud synced timeline workspaces
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 text-xs">
          {/* Create New Project Trigger / Form */}
          {isCreating ? (
            <form onSubmit={handleCreateSubmit} className="p-4 rounded-xl bg-black/50 border border-[#8b5cf6]/40 flex flex-col gap-3">
              <span className="font-display font-semibold text-xs text-white">Create New Timeline</span>
              <input
                type="text"
                autoFocus
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project title (e.g. 'Cyber Horizon Clip')..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/15 text-white text-xs outline-none focus:border-[#8b5cf6]"
              />

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#958ea0]">Canvas Aspect:</span>
                {(['9:16', '16:9', '1:1', '4:5'] as AspectRatio[]).map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setNewAspectRatio(ar)}
                    className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                      newAspectRatio === ar
                        ? 'bg-[#8b5cf6] text-white font-bold'
                        : 'bg-white/5 text-[#958ea0] hover:text-white'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg text-[#958ea0] hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#8b5cf6] text-white font-bold text-xs disabled:opacity-40"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => {
                studioAudio.playButtonTap();
                setIsCreating(true);
              }}
              className="w-full py-3 rounded-xl border border-dashed border-white/20 hover:border-[#8b5cf6] text-[#958ea0] hover:text-white flex items-center justify-center gap-2 transition-all hover:bg-white/[0.02]"
            >
              <Plus className="w-4 h-4 text-[#8b5cf6]" />
              <span className="font-medium text-xs">Create New Project Timeline</span>
            </button>
          )}

          {/* Project List */}
          <div className="flex flex-col gap-2.5">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    studioAudio.playButtonTap();
                    onSelectProject(proj.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] shadow-[0_0_16px_rgba(139,92,246,0.25)]'
                      : 'bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0 relative">
                      {proj.thumbnail ? (
                        <img
                          src={proj.thumbnail}
                          alt={proj.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#958ea0]">
                          <Film className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-xs text-white">
                          {proj.name}
                        </h3>
                        {isActive && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4]/40 font-mono text-[9px] text-[#4cd7f6]">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-[#958ea0]">
                        <span>{proj.aspectRatio}</span>
                        <span>·</span>
                        <span>{proj.resolution}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {proj.totalDuration.toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <span className="text-[#958ea0] hover:text-white text-xs">Switch</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
