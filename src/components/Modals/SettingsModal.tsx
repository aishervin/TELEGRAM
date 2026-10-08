import React, { useState } from 'react';
import { 
  X, 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Database, 
  Check, 
  Sparkles,
  Cloud,
  Save
} from 'lucide-react';
import { CurrentUser, ThemeType } from '../../types/telegram';

interface SettingsModalProps {
  isOpen: boolean;
  currentUser: CurrentUser;
  currentTheme: ThemeType;
  onClose: () => void;
  onUpdateProfile: (updated: Partial<CurrentUser>) => void;
  onSetTheme: (theme: ThemeType) => void;
}

const THEMES: { id: ThemeType; name: string; bg: string; accent: string }[] = [
  { id: 'default', name: 'Telegram Dark', bg: '#0e1621', accent: '#2aabee' },
  { id: 'midnight', name: 'Midnight OLED', bg: '#000000', accent: '#38bdf8' },
  { id: 'emerald', name: 'Emerald Green', bg: '#061412', accent: '#10b981' },
  { id: 'cyber', name: 'Cyber Violet', bg: '#0d091a', accent: '#a855f7' },
  { id: 'light', name: 'Clean Light', bg: '#f0f2f5', accent: '#2481cc' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentUser,
  currentTheme,
  onClose,
  onUpdateProfile,
  onSetTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'cloud'>('profile');
  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle);
  const [bio, setBio] = useState(currentUser.bio);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, handle, bio });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="font-semibold text-slate-100 text-base">
            Settings
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-800 px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'appearance'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme & Colors</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'cloud'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud Sync</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-200">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-sky-500" 
                />
                <div>
                  <div className="font-semibold text-sm text-white">{currentUser.name}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{currentUser.phone}</div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Username Handle</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-emerald-400 text-xs font-medium">
                  {isSaved && '✓ Profile updated successfully!'}
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-white mb-1">Color Theme</h4>
                <p className="text-slate-400 text-xs mb-3">
                  Select a theme for TELESHΞN™ Web Client.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {THEMES.map((t) => {
                    const isSelected = currentTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => onSetTheme(t.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-sky-400 bg-slate-800 shadow-md ring-1 ring-sky-400'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: t.accent }}
                          />
                          <span className="font-medium text-xs text-slate-200">
                            {t.name}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1">
                  <Cloud className="w-4 h-4" />
                  <span>Cloudflare & GitHub Synchronization</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  TELESHΞN™ is connected to your primary GitHub repo <code>aishervin/teleshen</code> and Cloudflare Workers runtime. Local state is cached in persistent browser memory and synchronizes with edge nodes.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Target Repository:</span>
                  <span className="font-mono text-sky-300">github.com/aishervin/teleshen</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Cloudflare Account:</span>
                  <span className="font-mono text-slate-300">95db3c31158d3696452081a727e1104a</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Edge Gateway Status:</span>
                  <span className="font-mono text-emerald-400">Connected (12ms)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
