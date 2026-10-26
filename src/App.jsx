import React, { useState, useEffect, useMemo, useCallback } from 'react';
import psalmsData from './data/psalms.json';
import { 
  loadSettings, 
  saveSettings, 
  loadProgress, 
  saveCompletedChapter, 
  loadHistory 
} from './utils/storage';
import { applyTheme } from './utils/themes';
import { soundEngine } from './utils/soundEngine';
import { TRANSLATIONS } from './utils/translations';

import Header from './components/Header';
import ControlBar from './components/ControlBar';
import TypingArea from './components/TypingArea';
import VirtualKeyboard from './components/VirtualKeyboard';
import ResultsModal from './components/ResultsModal';
import ChapterDrawer from './components/ChapterDrawer';
import ProgressMapModal from './components/ProgressMapModal';
import HistoryModal from './components/HistoryModal';
import SettingsModal from './components/SettingsModal';
import PhoneticGuideModal from './components/PhoneticGuideModal';
import KeyboardMappingModal from './components/KeyboardMappingModal';

export default function App() {
  const [psalms] = useState(psalmsData);
  const [currentPsalmIndex, setCurrentPsalmIndex] = useState(0);

  // Settings & Storage State
  const [settings, setSettings] = useState(loadSettings);
  const [progress, setProgress] = useState(loadProgress);
  const [history, setHistory] = useState(loadHistory);

  // Modals state
  const [activeView, setActiveView] = useState('typing');
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [isProgressMapOpen, setIsProgressMapOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPhoneticGuideOpen, setIsPhoneticGuideOpen] = useState(false);
  const [isKeyboardMappingModalOpen, setIsKeyboardMappingModalOpen] = useState(false);
  
  // Real-time key tracking for on-screen virtual keyboard
  const [lastPressedKey, setLastPressedKey] = useState(null);
  const [isShiftActive, setIsShiftActive] = useState(false);

  // Results
  const [testResults, setTestResults] = useState(null);
  const [testTimeline, setTestTimeline] = useState([]);

  // Distraction-free focus mode
  const [isTyping, setIsTyping] = useState(false);

  const lang = settings.language || 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Apply theme & sound settings on mount and updates
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    soundEngine.setSoundType(settings.soundType);
    soundEngine.setVolume(settings.soundVolume);
  }, [settings.soundType, settings.soundVolume]);

  const updateSettings = useCallback((newPartial) => {
    setSettings(prev => {
      const updated = { ...prev, ...newPartial };
      saveSettings(updated);
      return updated;
    });
  }, []);

  // Today's Ethiopian Orthodox Liturgical Day calculation
  const todayLiturgicalDay = useMemo(() => {
    const dayOfWeek = new Date().getDay();
    const map = {
      1: { nameAm: 'ሰኞ', nameEn: 'Monday', range: '1 - 30', startIndex: 0 },
      2: { nameAm: 'ማክሰኞ', nameEn: 'Tuesday', range: '31 - 60', startIndex: 30 },
      3: { nameAm: 'ረቡዕ', nameEn: 'Wednesday', range: '61 - 80', startIndex: 60 },
      4: { nameAm: 'ሐሙስ', nameEn: 'Thursday', range: '81 - 110', startIndex: 80 },
      5: { nameAm: 'ዓርብ', nameEn: 'Friday', range: '111 - 130', startIndex: 110 },
      6: { nameAm: 'ቅዳሜ', nameEn: 'Saturday', range: '131 - 151', startIndex: 130 },
      0: { nameAm: 'እሑድ', nameEn: 'Sunday', range: 'መዝሙረ ነቢያት', startIndex: 0 }
    };
    return map[dayOfWeek] || map[1];
  }, []);

  // Current Psalm
  const currentPsalm = psalms[currentPsalmIndex] || psalms[0];

  // Psalm Navigation
  const handleNextPsalm = () => {
    setCurrentPsalmIndex(prev => (prev + 1) % psalms.length);
    setTestResults(null);
  };

  const handlePrevPsalm = () => {
    setCurrentPsalmIndex(prev => (prev - 1 + psalms.length) % psalms.length);
    setTestResults(null);
  };

  const handleSelectPsalm = (selected) => {
    const idx = psalms.findIndex(p => p.id === selected.id);
    if (idx !== -1) {
      setCurrentPsalmIndex(idx);
      setTestResults(null);
    }
  };

  // Test Complete Handler
  const handleTestComplete = (results, timeline) => {
    const updatedProgress = saveCompletedChapter(currentPsalm.id, results);
    if (updatedProgress) {
      setProgress(updatedProgress);
    }
    setHistory(loadHistory());
    setTestResults(results);
    setTestTimeline(timeline);
    setIsTyping(false);
  };

  const handleKeyActivity = (key, isShift) => {
    setLastPressedKey(key);
    setIsShiftActive(isShift);
  };

  const completedCount = Object.keys(progress.completedChapters || {}).length;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500/25 selection:text-amber-300">
      
      {/* Top Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        settings={settings}
        updateSettings={updateSettings}
        openChapterDrawer={() => setIsChapterDrawerOpen(true)}
        openProgressMap={() => setIsProgressMapOpen(true)}
        openHistoryModal={() => setIsHistoryModalOpen(true)}
        openSettingsModal={() => setIsSettingsModalOpen(true)}
        openPhoneticGuide={() => setIsPhoneticGuideOpen(true)}
        openKeyboardMappingModal={() => setIsKeyboardMappingModalOpen(true)}
        todayLiturgicalDay={todayLiturgicalDay}
        completedCount={completedCount}
        streak={progress.streak || 1}
        isTyping={isTyping}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-2">
        {/* Monkeytype Pill Bar Controls */}
        <ControlBar
          currentPsalm={currentPsalm}
          settings={settings}
          updateSettings={updateSettings}
          openChapterDrawer={() => setIsChapterDrawerOpen(true)}
          openKeyboardMappingModal={() => setIsKeyboardMappingModalOpen(true)}
          isTyping={isTyping}
        />

        {/* Central Typing Stage */}
        <TypingArea
          currentPsalm={currentPsalm}
          settings={settings}
          onComplete={handleTestComplete}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          onNextPsalm={handleNextPsalm}
          onPrevPsalm={handlePrevPsalm}
          onKeyActivity={handleKeyActivity}
        />

        {/* Interactive On-Screen Virtual Keyboard (when Amharic text mode is active) */}
        {settings.textLanguage === 'am' && settings.showVirtualKeyboard && (
          <div className={`transition-opacity duration-300 ${isTyping ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
            <VirtualKeyboard
              activeLayout={settings.keyboardLayout || 'powergeez'}
              onSelectLayout={(layoutId) => updateSettings({ keyboardLayout: layoutId })}
              lastPressedKey={lastPressedKey}
              isShiftActive={isShiftActive}
              language={settings.language}
            />
          </div>
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className={`w-full max-w-4xl mx-auto px-4 py-4 text-center text-xs text-[var(--sub-color)] flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[var(--border-color)]/30 font-mono transition-opacity duration-300 ${isTyping ? 'opacity-0' : 'opacity-70'}`}>
        <div className="flex items-center gap-3">
          <span>{t.tabHint}</span>
          <span>•</span>
          <span className="text-[var(--main-color)]">
            {settings.textLanguage === 'en' 
              ? 'English Psalms Mode' 
              : `Amharic: ${settings.keyboardLayout || 'powergeez'}`}
          </span>
        </div>
        <div>
          <span>{t.footerNote}</span>
        </div>
      </footer>

      {/* Results Modal */}
      {testResults && (
        <ResultsModal
          results={testResults}
          timeline={testTimeline}
          language={settings.language}
          onRestart={() => setTestResults(null)}
          onNextChapter={() => {
            handleNextPsalm();
          }}
          onClose={() => setTestResults(null)}
        />
      )}

      {/* Chapter Selection Drawer */}
      <ChapterDrawer
        isOpen={isChapterDrawerOpen}
        onClose={() => setIsChapterDrawerOpen(false)}
        psalms={psalms}
        currentPsalmId={currentPsalm.id}
        onSelectPsalm={handleSelectPsalm}
        progress={progress}
        todayDayIndex={new Date().getDay()}
        language={settings.language}
        textLanguage={settings.textLanguage}
      />

      {/* 151 Psalms Visual Journey Map */}
      <ProgressMapModal
        isOpen={isProgressMapOpen}
        onClose={() => setIsProgressMapOpen(false)}
        psalms={psalms}
        progress={progress}
        onSelectPsalm={handleSelectPsalm}
        language={settings.language}
      />

      {/* History & Statistics Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onClearHistory={() => {
          localStorage.removeItem('dawittype_history');
          setHistory([]);
        }}
      />

      {/* Keyboard Mapping Modal */}
      <KeyboardMappingModal
        isOpen={isKeyboardMappingModalOpen}
        onClose={() => setIsKeyboardMappingModalOpen(false)}
        activeLayout={settings.keyboardLayout || 'powergeez'}
        onSelectLayout={(layoutId) => updateSettings({ keyboardLayout: layoutId })}
        language={settings.language}
      />

      {/* Phonetic Amharic Typing Cheat Sheet */}
      <PhoneticGuideModal
        isOpen={isPhoneticGuideOpen}
        onClose={() => setIsPhoneticGuideOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
        onResetAllData={() => {
          localStorage.clear();
          setSettings(loadSettings());
          setProgress(loadProgress());
          setHistory([]);
        }}
      />

    </div>
  );
}
