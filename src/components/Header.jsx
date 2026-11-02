import React, { useState, useEffect, useRef } from 'react';
import { 
  Keyboard, 
  BookOpen, 
  Calendar, 
  Map, 
  BarChart2, 
  Settings, 
  Volume2, 
  VolumeX, 
  Palette,
  HelpCircle,
  Flame,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { THEMES } from '../utils/themes';
import { TRANSLATIONS } from '../utils/translations';
import { KEYBOARD_LAYOUT_INFO } from '../utils/ethiopicTransliteration';

export default function Header({
  activeView,
  setActiveView,
  settings,
  updateSettings,
  openChapterDrawer,
  openProgressMap,
  openHistoryModal,
  openSettingsModal,
  openPhoneticGuide,
  openKeyboardMappingModal,
  startDailyReading,
  todayLiturgicalDay,
  completedCount,
  streak,
  isTyping
}) {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const themePickerRef = useRef(null);

  // Close the theme picker on outside click or Escape
  useEffect(() => {
    if (!showThemePicker) return;
    const onPointer = (e) => {
      if (themePickerRef.current && !themePickerRef.current.contains(e.target)) setShowThemePicker(false);
    };
    const onKey = (e) => e.key === 'Escape' && setShowThemePicker(false);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [showThemePicker]);
  const lang = settings.language || 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Sound toggle cycle
  const soundModes = ['begena', 'thock', 'cherry_blue', 'typewriter', 'off'];
  const soundLabels = {
    begena: lang === 'am' ? 'በገና (Begena Harp)' : 'Begena (Ethiopian Harp)',
    thock: 'Topre Thock',
    cherry_blue: 'Cherry MX Blue',
    typewriter: lang === 'am' ? 'መተየቢያ (Typewriter)' : 'Typewriter',
    off: lang === 'am' ? 'ድምፅ አልባ (Mute)' : 'Mute'
  };

  const cycleSound = () => {
    const currentIdx = soundModes.indexOf(settings.soundType);
    const nextIdx = (currentIdx + 1) % soundModes.length;
    updateSettings({ soundType: soundModes[nextIdx] });
  };

  // Toggle Language between Amharic and English
  const toggleLanguage = () => {
    const nextLang = lang === 'am' ? 'en' : 'am';
    updateSettings({ 
      language: nextLang,
      textLanguage: nextLang 
    });
  };

  const currentLayoutInfo = KEYBOARD_LAYOUT_INFO[settings.keyboardLayout] || KEYBOARD_LAYOUT_INFO.powergeez;

  return (
    <header className={`w-full max-w-6xl mx-auto px-4 pt-5 sm:pt-6 pb-2 flex flex-wrap items-center justify-center lg:justify-between gap-3 sm:gap-4 transition-opacity duration-300 ${isTyping ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setActiveView('typing')}
          className="flex items-center gap-3 group text-left"
          title={t.brandTagline}
        >
          {/* Orthodox Cross Emblem */}
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--main-color)] shadow-sm group-hover:border-[var(--main-color)] transition-all">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M11 2h2v7h7v2h-7v11h-2v-11H4V9h7V2z" />
              <circle cx="12" cy="10" r="1.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-color)] group-hover:text-[var(--main-color)] transition-colors">
                {t.brandTitle}<span className="text-[var(--main-color)]">{t.brandSub}</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--sub-alt-color)] text-[var(--sub-color)] border border-[var(--border-color)]">
                {lang === 'am' ? '፻፶፩' : '151'}
              </span>
            </div>
            <p className="text-xs text-[var(--sub-color)]">{t.brandTagline}</p>
          </div>
        </button>
      </div>

      {/* Navigation Icons (Monkeytype style) */}
      <nav aria-label="Primary" className="flex items-center gap-0.5 sm:gap-1 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-2 py-1 shadow-sm">
        <button
          onClick={() => setActiveView('typing')}
          className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${activeView === 'typing' ? 'bg-[var(--sub-alt-color)] text-[var(--main-color)]' : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
          title={t.navTyping}
          aria-label={t.navTyping}
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden 2xl:inline whitespace-nowrap">{t.navTyping}</span>
        </button>

        <button
          onClick={openChapterDrawer}
          className="p-2 rounded-lg text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={t.navChapters}
          aria-label={t.navChapters}
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden 2xl:inline whitespace-nowrap">{t.navChapters}</span>
        </button>

        <button
          onClick={startDailyReading}
          className="p-2 rounded-lg text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={`${t.navDaily} (${lang === 'am' ? todayLiturgicalDay.nameAm : todayLiturgicalDay.nameEn} ${todayLiturgicalDay.range})`}
          aria-label={`${t.navDaily} (${lang === 'am' ? todayLiturgicalDay.nameAm : todayLiturgicalDay.nameEn} ${todayLiturgicalDay.range})`}
        >
          <Calendar className="w-4 h-4 text-[var(--main-color)]" />
          <span className="hidden 2xl:inline whitespace-nowrap">{t.navDaily}</span>
        </button>

        <button
          onClick={openProgressMap}
          className="p-2 rounded-lg text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={t.navJourney}
          aria-label={t.navJourney}
        >
          <Map className="w-4 h-4" />
          <span className="hidden 2xl:inline whitespace-nowrap">{t.navJourney}</span>
          <span className="text-[10px] text-[var(--main-color)] font-mono">
            {completedCount}/151
          </span>
        </button>

        <button
          onClick={openHistoryModal}
          className="p-2 rounded-lg text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={t.navHistory}
          aria-label={t.navHistory}
        >
          <BarChart2 className="w-4 h-4" />
          <span className="hidden 2xl:inline whitespace-nowrap">{t.navHistory}</span>
        </button>

        {/* Keyboard Mapping Chooser Button */}
        <button
          onClick={openKeyboardMappingModal}
          className="p-2 rounded-lg text-[var(--sub-color)] hover:text-[var(--main-color)] hover:bg-[var(--sub-alt-color)] transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={lang === 'am' ? `የኪቦርድ አቀማመጥ ይምረጡ (${currentLayoutInfo.name})` : `Choose Keyboard Mapping (${currentLayoutInfo.nameEn})`}
          aria-label={lang === 'am' ? `የኪቦርድ አቀማመጥ ይምረጡ (${currentLayoutInfo.name})` : `Choose Keyboard Mapping (${currentLayoutInfo.nameEn})`}
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--main-color)]" />
          <span className="hidden 2xl:inline whitespace-nowrap">{lang === 'am' ? 'ኪቦርድ' : 'Keyboard'}</span>
        </button>

        {settings.textLanguage === 'am' && (
          <button
            onClick={openPhoneticGuide}
            className="p-2 rounded-lg text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors flex items-center gap-1.5 text-xs font-medium"
            title={t.navGuide}
            aria-label={t.navGuide}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden 2xl:inline whitespace-nowrap">{t.navGuide}</span>
          </button>
        )}
      </nav>

      {/* Quick Tools & Settings */}
      <div className="flex items-center gap-2">
        {/* Language Switcher Pill */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-[var(--main-color)] text-xs font-medium text-[var(--text-color)] transition-colors"
          title={lang === 'am' ? 'Switch to English version' : 'ወደ አማርኛ ቅጂ ቀይር'}
          aria-label={lang === 'am' ? 'Switch to English version' : 'ወደ አማርኛ ቅጂ ቀይር'}
        >
          <Globe className="w-3.5 h-3.5 text-[var(--main-color)]" />
          <span className="font-semibold text-xs">{lang === 'am' ? 'EN' : 'አማ'}</span>
        </button>

        {/* Streak badge */}
        {streak > 0 && (
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-color)] border border-[var(--border-color)] text-xs font-mono text-[var(--main-color)]"
            title={`${streak} ${t.streakDay}`}
            aria-label={`${streak} ${t.streakDay}`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{streak}d</span>
          </div>
        )}

        {/* Sound toggle button */}
        <button
          onClick={cycleSound}
          className="p-2 rounded-lg bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors flex items-center gap-1.5 text-xs"
          title={`${t.soundTitle}: ${soundLabels[settings.soundType]}`}
          aria-label={`${t.soundTitle}: ${soundLabels[settings.soundType]}`}
        >
          {settings.soundType === 'off' ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-[var(--main-color)]" />
          )}
          <span className="hidden lg:inline text-[11px] font-mono">
            {settings.soundType === 'begena' ? (lang === 'am' ? 'በገና' : 'Begena') : settings.soundType}
          </span>
        </button>

        {/* Theme Picker Dropdown */}
        <div className="relative" ref={themePickerRef}>
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            aria-expanded={showThemePicker}
            className="p-2 rounded-lg bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors flex items-center gap-1"
            title={t.themeTitle}
            aria-label={t.themeTitle}
          >
            <Palette className="w-4 h-4 text-[var(--main-color)]" />
          </button>

          {showThemePicker && (
            <div 
              className="absolute right-0 top-12 w-64 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right"
            >
              <div className="px-2 py-1.5 text-[11px] font-semibold text-[var(--sub-color)] uppercase tracking-wider">
                {t.themeTitle}
              </div>
              <div className="space-y-1">
                {Object.values(THEMES).map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      updateSettings({ theme: th.id });
                      setShowThemePicker(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${settings.theme === th.id ? 'bg-[var(--sub-alt-color)] text-[var(--main-color)] font-medium' : 'text-[var(--text-color)] hover:bg-[var(--sub-alt-color)]'}`}
                  >
                    <span>{th.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.colors.main }}></span>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.colors.bg, border: '1px solid #444' }}></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings gear */}
        <button
          onClick={openSettingsModal}
          className="p-2 rounded-lg bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors"
          title={t.settingsTitle}
          aria-label={t.settingsTitle}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
