// Local Storage Manager for DawitType

const STORAGE_KEYS = {
  SETTINGS: 'dawittype_settings',
  PROGRESS: 'dawittype_progress',
  HISTORY: 'dawittype_history',
};

export const DEFAULT_SETTINGS = {
  theme: 'tewahedo',
  language: 'en',           // 'am' (Amharic) or 'en' (English)
  textLanguage: 'en',       // 'am' (Amharic Psalms) or 'en' (English Psalms)
  keyboardLayout: 'powergeez', // 'powergeez', 'keyman', 'standard', 'direct'
  showVirtualKeyboard: true,// Show on-screen keyboard
  soundType: 'begena',      // 'begena', 'thock', 'cherry_blue', 'typewriter', 'off'
  soundVolume: 0.5,
  caretStyle: 'smooth',     // 'smooth', 'block', 'underline', 'off'
  fontSize: 'text-2xl',     // 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'
  fontFamily: 'ethiopic',   // 'ethiopic' (Noto Sans), 'serif' (Noto Serif), 'nyala'
  inputMode: 'phonetic',    // 'direct' (native keyboard), 'phonetic' (QWERTY -> Amharic)
  includePunctuation: true, // Keep marks (። ፤ ፣ or . , ;)
  geezNumerals: true,       // ፩ ፪ ፫ vs 1 2 3
  mode: 'chapter',          // 'chapter' (full psalm), 'verse' (one verse at a time), 'timed'
  timedDuration: 60,        // 30, 60, 120 seconds
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return { completedChapters: {}, streak: 1, lastPlayedDate: null };
    return JSON.parse(raw);
  } catch {
    return { completedChapters: {}, streak: 1, lastPlayedDate: null };
  }
}

export function saveCompletedChapter(chapterNum, stats) {
  try {
    const progress = loadProgress();
    const existing = progress.completedChapters[chapterNum];
    
    // Save or update best stats
    progress.completedChapters[chapterNum] = {
      completedAt: new Date().toISOString(),
      bestWpm: existing ? Math.max(existing.bestWpm, stats.wpm) : stats.wpm,
      bestAccuracy: existing ? Math.max(existing.bestAccuracy, stats.accuracy) : stats.accuracy,
      timesCompleted: (existing?.timesCompleted || 0) + 1,
    };

    // Calculate daily streak
    const today = new Date().toDateString();
    if (progress.lastPlayedDate) {
      const last = new Date(progress.lastPlayedDate);
      const diffDays = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        progress.streak += 1;
      } else if (diffDays > 1) {
        progress.streak = 1;
      }
    }
    progress.lastPlayedDate = today;

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));

    // Also append to history
    saveHistoryEntry({
      chapter: chapterNum,
      date: new Date().toISOString(),
      ...stats
    });

    return progress;
  } catch (err) {
    console.error('Failed to save progress:', err);
    return null;
  }
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveHistoryEntry(entry) {
  try {
    const history = loadHistory();
    history.unshift(entry);
    if (history.length > 50) history.pop(); // Keep last 50 runs
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save history entry:', err);
  }
}
