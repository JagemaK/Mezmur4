import React from 'react';
import { X, Settings as SettingsIcon, Globe, BookOpen } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  updateSettings,
  onResetAllData
}) {
  if (!isOpen) return null;

  const lang = settings.language || 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isEnglish = lang === 'en';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--surface-color)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 md:p-8 my-6 relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--main-color)]/10 border border-[var(--main-color)]/30 flex items-center justify-center text-[var(--main-color)]">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-color)]">
                {t.settingsTitle}
              </h2>
              <p className="text-xs text-[var(--sub-color)]">
                {isEnglish ? 'Interface & Typing Preferences' : 'የጽሕፈት መልክና የድምፅ ማስተካከያዎች'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto my-4 space-y-5 pr-1 text-xs">
          
          {/* Interface Language & Psalm Text Language */}
          <div className="p-4 rounded-2xl bg-[var(--bg-color)]/50 border border-[var(--border-color)] space-y-3">
            <div>
              <div className="font-semibold text-[var(--text-color)] mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--main-color)]" />
                <span>{isEnglish ? 'Interface Language' : 'የመተግበሪያው ቋንቋ'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSettings({ language: 'en' })}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${settings.language === 'en' ? 'bg-[var(--main-color)] text-black font-bold border-[var(--main-color)]' : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
                >
                  English
                </button>
                <button
                  onClick={() => updateSettings({ language: 'am' })}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${settings.language === 'am' ? 'bg-[var(--main-color)] text-black font-bold border-[var(--main-color)]' : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
                >
                  አማርኛ (Amharic)
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-color)]/50">
              <div className="font-semibold text-[var(--text-color)] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[var(--main-color)]" />
                <span>{isEnglish ? 'Psalm Scripture Version' : 'የመዝሙረ ዳዊት ቅጂ'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSettings({ textLanguage: 'en' })}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${settings.textLanguage === 'en' ? 'bg-[var(--main-color)] text-black font-bold border-[var(--main-color)]' : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
                >
                  English Psalms (1-151)
                </button>
                <button
                  onClick={() => updateSettings({ textLanguage: 'am' })}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${settings.textLanguage === 'am' ? 'bg-[var(--main-color)] text-black font-bold border-[var(--main-color)]' : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
                >
                  የአማርኛ ዳዊት (1-151)
                </button>
              </div>
            </div>
          </div>

          {/* Caret Style */}
          <div className="p-4 rounded-2xl bg-[var(--bg-color)]/50 border border-[var(--border-color)]">
            <div className="font-semibold text-[var(--text-color)] mb-2.5">
              {isEnglish ? 'Caret Style' : 'የጠቋሚ ቅርጽ (Caret Style)'}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'smooth', label: 'Smooth' },
                { id: 'block', label: 'Block' },
                { id: 'underline', label: 'Underline' },
                { id: 'off', label: 'Off' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => updateSettings({ caretStyle: c.id })}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${settings.caretStyle === c.id ? 'bg-[var(--main-color)] text-black font-bold border-[var(--main-color)]' : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="p-4 rounded-2xl bg-[var(--bg-color)]/50 border border-[var(--border-color)]">
            <div className="font-semibold text-[var(--text-color)] mb-2.5">
              {isEnglish ? 'Font Size' : 'የፊደል መጠን (Font Size)'}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'text-xl', label: isEnglish ? 'Small' : 'አነስተኛ' },
                { id: 'text-2xl', label: isEnglish ? 'Medium' : 'መደበኛ' },
                { id: 'text-3xl', label: isEnglish ? 'Large' : 'ትልቅ' },
                { id: 'text-4xl', label: isEnglish ? 'X-Large' : 'እጅግ ትልቅ' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => updateSettings({ fontSize: f.id })}
                  className={`py-2 px-2 rounded-xl border text-center transition-all ${settings.fontSize === f.id ? 'bg-[var(--main-color)] text-black font-bold border-[var(--main-color)]' : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Type & Volume */}
          <div className="p-4 rounded-2xl bg-[var(--bg-color)]/50 border border-[var(--border-color)] space-y-3">
            <div className="font-semibold text-[var(--text-color)]">
              {isEnglish ? 'Keyboard Sound Synthesis' : 'የቁልፍ ድምፅ (Key Sound)'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'begena', label: 'Begena (Harp)' },
                { id: 'thock', label: 'Topre Thock' },
                { id: 'cherry_blue', label: 'Cherry MX Blue' },
                { id: 'typewriter', label: 'Typewriter' },
                { id: 'off', label: isEnglish ? 'Mute' : 'ድምፅ አልባ' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => updateSettings({ soundType: s.id })}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${settings.soundType === s.id ? 'bg-[var(--main-color)] text-black font-bold border-[var(--main-color)]' : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Volume slider */}
            {settings.soundType !== 'off' && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] text-[var(--sub-color)] mb-1">
                  <span>{isEnglish ? 'Volume' : 'የድምፅ መጠን'}</span>
                  <span className="font-mono">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--main-color)]"
                />
              </div>
            )}
          </div>

          {/* Reset all progress */}
          <div className="pt-2 flex justify-between items-center text-xs text-[var(--sub-color)]">
            <span>{isEnglish ? 'Clear all local data and progress' : 'ሁሉንም የተመዘገቡ መረጃዎች ለማጥፋት'}</span>
            <button
              onClick={() => {
                if (window.confirm(isEnglish ? 'Are you sure you want to reset all your progress data?' : 'እርግጠኛ ነዎት ሁሉንም የተመዘገቡ የጽሕፈት መረጃዎችን ማጥፋት ይፈልጋሉ?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              {isEnglish ? 'Reset Data' : 'መረጃዎችን አጥፋ'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
