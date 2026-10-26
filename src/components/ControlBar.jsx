import React from 'react';
import { 
  FileText, 
  ListOrdered, 
  Clock, 
  ChevronRight, 
  Globe, 
  Hash, 
  Type,
  BookOpen,
  Keyboard as KeyboardIcon
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';
import { KEYBOARD_LAYOUT_INFO } from '../utils/ethiopicTransliteration';

export default function ControlBar({
  currentPsalm,
  settings,
  updateSettings,
  openChapterDrawer,
  openKeyboardMappingModal,
  isTyping
}) {
  const lang = settings.language || 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isEnglishText = settings.textLanguage === 'en';

  const chapterDisplay = isEnglishText
    ? `Psalm ${currentPsalm.chapter}`
    : (settings.geezNumerals ? `መዝሙር ${currentPsalm.geezNumber}` : `መዝሙር ${currentPsalm.chapter}`);

  const versesCount = (isEnglishText ? currentPsalm.versesEn : currentPsalm.versesAm)?.length || currentPsalm.totalVerses;
  const currentLayout = KEYBOARD_LAYOUT_INFO[settings.keyboardLayout] || KEYBOARD_LAYOUT_INFO.powergeez;

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 my-3 transition-opacity duration-300 ${isTyping ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-sm text-xs text-[var(--sub-color)]">
        
        {/* Left side: Test Modes (Chapter / Verse / Timed) */}
        <div className="flex items-center gap-1 bg-[var(--sub-alt-color)]/50 p-1 rounded-xl">
          <button
            onClick={() => updateSettings({ mode: 'chapter' })}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${settings.mode === 'chapter' ? 'bg-[var(--surface-color)] text-[var(--main-color)] shadow-sm' : 'hover:text-[var(--text-color)]'}`}
            title={t.modeFullChapter}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.modeFullChapter}</span>
          </button>

          <button
            onClick={() => updateSettings({ mode: 'verse' })}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${settings.mode === 'verse' ? 'bg-[var(--surface-color)] text-[var(--main-color)] shadow-sm' : 'hover:text-[var(--text-color)]'}`}
            title={t.modeVerseByVerse}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>{t.modeVerseByVerse}</span>
          </button>

          <button
            onClick={() => updateSettings({ mode: 'timed' })}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${settings.mode === 'timed' ? 'bg-[var(--surface-color)] text-[var(--main-color)] shadow-sm' : 'hover:text-[var(--text-color)]'}`}
            title={t.modeTimed}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.modeTimed}</span>
          </button>

          {/* Timed options if mode is timed */}
          {settings.mode === 'timed' && (
            <div className="flex items-center gap-1 ml-1 pl-1 border-l border-[var(--border-color)]">
              {[30, 60, 120].map(sec => (
                <button
                  key={sec}
                  onClick={() => updateSettings({ timedDuration: sec })}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${settings.timedDuration === sec ? 'text-[var(--main-color)] font-bold' : 'hover:text-[var(--text-color)]'}`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Current Chapter Badge */}
        <button
          onClick={openChapterDrawer}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--sub-alt-color)] hover:bg-[var(--main-color)]/10 text-[var(--text-color)] border border-[var(--border-color)] hover:border-[var(--main-color)] transition-all group"
          title={t.drawerSubtitle}
        >
          <span className="font-semibold text-[var(--main-color)]">
            {chapterDisplay}
          </span>
          <span className="text-[var(--sub-color)] font-mono text-[11px]">
            ({versesCount} {t.versesCountSuffix})
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--sub-color)] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Right side: Scripture Language, Keyboard Mapping, Punctuation, Numerals */}
        <div className="flex items-center gap-1.5">
          {/* Psalm Text Language Toggle (Amharic vs English) */}
          <button
            onClick={() => updateSettings({ 
              textLanguage: isEnglishText ? 'am' : 'en' 
            })}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--sub-alt-color)] border border-[var(--border-color)] hover:border-[var(--main-color)] text-[11px] font-medium text-[var(--text-color)] transition-all flex items-center gap-1.5"
            title={isEnglishText ? 'Switch Psalm text to Amharic' : 'Switch Psalm text to English'}
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--main-color)]" />
            <span>{isEnglishText ? 'Text: English' : 'ጽሑፍ፡ አማርኛ'}</span>
          </button>

          {/* Active Keyboard Mapping Selector / Trigger */}
          {!isEnglishText && (
            <button
              onClick={openKeyboardMappingModal}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 text-[var(--main-color)] text-[11px] font-medium transition-all flex items-center gap-1.5"
              title={lang === 'am' ? 'የአማርኛ ኪቦርድ አቀማመጥ ለመምረጥ ይጫኑ' : 'Click to choose Amharic keyboard mapping'}
            >
              <KeyboardIcon className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? currentLayout.name.split(' ')[0] : currentLayout.nameEn.split(' ')[0]}</span>
            </button>
          )}

          {/* On-screen Virtual Keyboard toggle */}
          {!isEnglishText && (
            <button
              onClick={() => updateSettings({ showVirtualKeyboard: !settings.showVirtualKeyboard })}
              className={`p-1.5 rounded-lg border text-[11px] transition-colors ${settings.showVirtualKeyboard ? 'border-[var(--main-color)] text-[var(--main-color)] bg-[var(--sub-alt-color)]' : 'border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
              title={settings.showVirtualKeyboard ? 'Hide On-Screen Keyboard' : 'Show On-Screen Keyboard'}
            >
              <KeyboardIcon className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Punctuation toggle */}
          <button
            onClick={() => updateSettings({ includePunctuation: !settings.includePunctuation })}
            className={`p-1.5 rounded-lg border text-[11px] transition-colors ${settings.includePunctuation ? 'border-[var(--border-color)] text-[var(--main-color)] bg-[var(--sub-alt-color)]' : 'border-transparent text-[var(--sub-color)] line-through hover:text-[var(--text-color)]'}`}
            title={t.punctuationToggle}
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          {/* Geez numerals toggle (only for Amharic text) */}
          {!isEnglishText && (
            <button
              onClick={() => updateSettings({ geezNumerals: !settings.geezNumerals })}
              className={`p-1.5 rounded-lg border text-[11px] transition-colors ${settings.geezNumerals ? 'border-[var(--border-color)] text-[var(--main-color)] bg-[var(--sub-alt-color)]' : 'border-transparent text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
              title={t.numbersToggle}
            >
              <Hash className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
