import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { EthiopicPhoneticEngine } from '../utils/ethiopicTransliteration';
import { TRANSLATIONS } from '../utils/translations';

export default function TypingArea({
  currentPsalm,
  settings,
  onComplete,
  isTyping,
  setIsTyping,
  onNextPsalm,
  onPrevPsalm,
  onKeyActivity
}) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const wordRefs = useRef([]);
  const caretRef = useRef(null);

  const lang = settings.language || 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isEnglishText = settings.textLanguage === 'en';

  // Verse by verse mode tracking
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);

  // Active verses source based on textLanguage setting
  const activeVerses = useMemo(() => {
    if (isEnglishText) {
      return currentPsalm.versesEn && currentPsalm.versesEn.length > 0 
        ? currentPsalm.versesEn 
        : currentPsalm.verses;
    }
    return currentPsalm.versesAm && currentPsalm.versesAm.length > 0 
      ? currentPsalm.versesAm 
      : currentPsalm.verses;
  }, [currentPsalm, isEnglishText]);

  // Target text formatted according to settings
  const targetText = useMemo(() => {
    let raw = '';
    if (settings.mode === 'verse') {
      raw = activeVerses[activeVerseIndex] || activeVerses[0] || '';
    } else {
      raw = activeVerses.join(' ');
    }

    // Source text sometimes has a stray space before punctuation ("LORD ;")
    raw = raw.replace(/\s+([,.;:!?።፤፥፣፧])/g, '$1');

    if (!settings.includePunctuation) {
      if (isEnglishText) {
        raw = raw.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').replace(/\s+/g, ' ').trim();
      } else {
        raw = raw.replace(/[።፤፥፣፧፡]/g, '').replace(/\s+/g, ' ').trim();
      }
    }
    return raw;
  }, [activeVerses, activeVerseIndex, settings.mode, settings.includePunctuation, isEnglishText]);

  // Words array
  const words = useMemo(() => {
    return targetText.split(' ').filter(Boolean);
  }, [targetText]);

  // Typing state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedWords, setTypedWords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timerRemaining, setTimerRemaining] = useState(settings.timedDuration);

  // Metrics
  const [keystrokes, setKeystrokes] = useState({ correct: 0, incorrect: 0, extra: 0, missed: 0 });
  const [timeline, setTimeline] = useState([]);
  const errorsThisSecond = useRef(0);
  const [isFocused, setIsFocused] = useState(true);

  // Phonetic engine instance with configured layout
  const phoneticEngine = useMemo(() => {
    return new EthiopicPhoneticEngine(settings.keyboardLayout || 'powergeez');
  }, [settings.keyboardLayout]);

  // Update layout when changed
  useEffect(() => {
    phoneticEngine.setLayout(settings.keyboardLayout || 'powergeez');
  }, [settings.keyboardLayout, phoneticEngine]);

  // Reset test
  const resetTest = useCallback(() => {
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedWords([]);
    setStartTime(null);
    setIsTyping(false);
    setTimerRemaining(settings.timedDuration);
    setKeystrokes({ correct: 0, incorrect: 0, extra: 0, missed: 0 });
    setTimeline([]);
    errorsThisSecond.current = 0;
    phoneticEngine.reset();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [settings.timedDuration, setIsTyping, phoneticEngine]);

  // Reset on chapter, mode, language, or layout change
  useEffect(() => {
    setActiveVerseIndex(0);
    resetTest();
  }, [currentPsalm.id, settings.mode, settings.includePunctuation, settings.textLanguage, settings.keyboardLayout]);

  // Handle focus
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Timer interval for stats timeline and timed mode
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const elapsedSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));

      if (settings.mode === 'timed') {
        const remaining = settings.timedDuration - elapsedSec;
        setTimerRemaining(Math.max(0, remaining));
        if (remaining <= 0) {
          clearInterval(interval);
          finishTestRef.current();
          return;
        }
      }

      const totalChars = keystrokes.correct + keystrokes.incorrect + keystrokes.extra;
      const wpm = Math.round((keystrokes.correct / 5) / (elapsedSec / 60)) || 0;
      const rawWpm = Math.round((totalChars / 5) / (elapsedSec / 60)) || 0;

      setTimeline(prev => [
        ...prev,
        {
          second: elapsedSec,
          wpm,
          rawWpm,
          errors: errorsThisSecond.current
        }
      ]);
      errorsThisSecond.current = 0;
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, keystrokes, settings.mode, settings.timedDuration]);

  // Update Caret Position
  useEffect(() => {
    if (!caretRef.current) return;

    const currentWordEl = wordRefs.current[currentWordIndex];
    if (!currentWordEl) return;

    const letters = currentWordEl.querySelectorAll('.letter');
    const inputLen = currentInput.length;

    let targetLeft = 0;
    let targetTop = 0;
    let targetHeight = 28;

    if (letters.length > 0) {
      if (inputLen < letters.length) {
        const letterEl = letters[inputLen];
        targetLeft = letterEl.offsetLeft;
        targetTop = letterEl.offsetTop;
        targetHeight = letterEl.offsetHeight;
      } else {
        const lastLetter = letters[letters.length - 1];
        targetLeft = lastLetter.offsetLeft + lastLetter.offsetWidth;
        targetTop = lastLetter.offsetTop;
        targetHeight = lastLetter.offsetHeight;
      }
    } else {
      targetLeft = currentWordEl.offsetLeft;
      targetTop = currentWordEl.offsetTop;
    }

    caretRef.current.style.left = `${targetLeft}px`;
    caretRef.current.style.top = `${targetTop}px`;
    caretRef.current.style.height = `${targetHeight}px`;

    if (containerRef.current) {
      const containerTop = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      if (targetTop < containerTop + 20) {
        containerRef.current.scrollTo({ top: Math.max(0, targetTop - 20), behavior: 'smooth' });
      } else if (targetTop > containerTop + containerHeight - 60) {
        containerRef.current.scrollTo({ top: targetTop - containerHeight / 2, behavior: 'smooth' });
      }
    }
  }, [currentWordIndex, currentInput]);

  // Finish test
  const finishTest = useCallback(() => {
    const elapsedSec = Math.max(1, Math.round((Date.now() - (startTime || Date.now())) / 1000));
    const totalTyped = keystrokes.correct + keystrokes.incorrect + keystrokes.extra;
    const finalWpm = Math.round((keystrokes.correct / 5) / (elapsedSec / 60)) || 0;
    const finalRawWpm = Math.round((totalTyped / 5) / (elapsedSec / 60)) || 0;
    const finalCpm = Math.round((keystrokes.correct) / (elapsedSec / 60)) || 0;
    const accuracy = totalTyped > 0 ? Math.round((keystrokes.correct / totalTyped) * 100) : 100;

    let consistency = 85;
    if (timeline.length > 2) {
      const wpms = timeline.map(t => t.wpm);
      const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      const cv = mean > 0 ? (stdDev / mean) : 0;
      consistency = Math.max(40, Math.min(100, Math.round(100 - cv * 100)));
    }

    soundEngine.playVictory();

    onComplete({
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      cpm: finalCpm,
      accuracy,
      consistency,
      time: elapsedSec,
      keystrokes,
      psalm: currentPsalm,
      activeVerseIndex: settings.mode === 'verse' ? activeVerseIndex : null,
      textLanguage: settings.textLanguage
    }, timeline);
  }, [startTime, keystrokes, timeline, currentPsalm, settings.mode, settings.textLanguage, activeVerseIndex, onComplete]);

  const finishTestRef = useRef(finishTest);
  useEffect(() => {
    finishTestRef.current = finishTest;
  }, [finishTest]);

  // Handle Key Up for Shift tracking
  const handleKeyUp = (e) => {
    if (e.key === 'Shift') {
      onKeyActivity && onKeyActivity(null, false);
    }
  };

  // Handle Input Keydown
  const handleKeyDown = (e) => {
    if (e.key === 'Unidentified' || e.key === 'Process') return;

    // Notify virtual keyboard of key activity
    onKeyActivity && onKeyActivity(e.key, e.shiftKey);

    // Quick Restart: Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
      return;
    }

    // Escape: pause or blur
    if (e.key === 'Escape') {
      setIsTyping(false);
      return;
    }

    // Start timer on first active keypress
    if (!startTime && e.key.length === 1) {
      setStartTime(Date.now());
      setIsTyping(true);
    }

    // Space: Advance to next word
    if (e.key === ' ') {
      e.preventDefault();
      if (!currentInput && currentWordIndex === 0) return;

      const currentTargetWord = words[currentWordIndex] || '';

      let wordCorrect = 0;
      let wordIncorrect = 0;
      for (let i = 0; i < currentTargetWord.length; i++) {
        if (i < currentInput.length) {
          if (currentInput[i] === currentTargetWord[i]) {
            wordCorrect++;
          } else {
            wordIncorrect++;
          }
        } else {
          wordIncorrect++;
        }
      }
      const extraChars = Math.max(0, currentInput.length - currentTargetWord.length);

      setKeystrokes(prev => ({
        correct: prev.correct + (currentInput === currentTargetWord ? 1 : 0),
        incorrect: prev.incorrect,
        extra: prev.extra + extraChars,
        missed: prev.missed + Math.max(0, currentTargetWord.length - currentInput.length)
      }));

      if (currentInput === currentTargetWord) {
        soundEngine.playKey();
      } else {
        soundEngine.playError();
        errorsThisSecond.current++;
      }

      const nextTyped = [...typedWords];
      nextTyped[currentWordIndex] = currentInput;
      setTypedWords(nextTyped);

      if (currentWordIndex + 1 >= words.length) {
        if (settings.mode === 'verse' && activeVerseIndex + 1 < activeVerses.length) {
          setActiveVerseIndex(prev => prev + 1);
          setCurrentWordIndex(0);
          setCurrentInput('');
          setTypedWords([]);
          phoneticEngine.reset();
        } else {
          finishTest();
        }
        return;
      }

      setCurrentWordIndex(prev => prev + 1);
      setCurrentInput('');
      phoneticEngine.reset();
      return;
    }

    // Backspace: Erase character
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentInput.length > 0) {
        setCurrentInput(prev => prev.slice(0, -1));
        soundEngine.playKey();
      } else if (currentWordIndex > 0) {
        const prevWord = typedWords[currentWordIndex - 1];
        if (prevWord !== undefined) {
          setCurrentWordIndex(prev => prev - 1);
          setCurrentInput(prevWord);
          const nextTyped = [...typedWords];
          nextTyped.pop();
          setTypedWords(nextTyped);
          soundEngine.playKey();
        }
      }
      return;
    }

    if (e.key.length > 1 && e.key !== 'Enter') {
      return;
    }

    // Character Typing Handling
    e.preventDefault();

    let typedChar = e.key;

    // Check Phonetic Input Mode (when typing Amharic and layout is not 'direct')
    if (!isEnglishText && settings.keyboardLayout !== 'direct') {
      const res = phoneticEngine.processKey(e.key);
      if (res && res.output) {
        let nextInput = currentInput;
        if (res.replaceLength > 0) {
          nextInput = nextInput.slice(0, -res.replaceLength) + res.output;
        } else {
          nextInput += res.output;
        }
        setCurrentInput(nextInput);
        soundEngine.playKey();

        const targetWord = words[currentWordIndex] || '';
        const charIdx = nextInput.length - 1;
        if (charIdx < targetWord.length && nextInput[charIdx] === targetWord[charIdx]) {
          setKeystrokes(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
          setKeystrokes(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
          errorsThisSecond.current++;
        }
        return;
      }
    }

    // Direct / English Mode
    const targetWord = words[currentWordIndex] || '';
    const charIdx = currentInput.length;
    const isCorrect = charIdx < targetWord.length && typedChar === targetWord[charIdx];

    if (isCorrect) {
      soundEngine.playKey();
      setKeystrokes(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      soundEngine.playError();
      errorsThisSecond.current++;
      setKeystrokes(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    setCurrentInput(prev => prev + typedChar);
  };

  // Finish automatically once the final word is typed correctly
  useEffect(() => {
    if (!startTime || settings.mode === 'timed') return;
    const isLastWord = currentWordIndex === words.length - 1;
    if (!isLastWord || currentInput !== words[currentWordIndex]) return;
    if (settings.mode === 'verse' && activeVerseIndex + 1 < activeVerses.length) {
      setKeystrokes(prev => ({ ...prev, correct: prev.correct + 1 }));
      setActiveVerseIndex(prev => prev + 1);
      setCurrentWordIndex(0);
      setCurrentInput('');
      setTypedWords([]);
      phoneticEngine.reset();
      return;
    }
    finishTest();
  }, [currentInput]);

  // Mobile soft keyboards (Android) report keydown as "Unidentified"; read the
  // inserted text from the input event instead and replay it as key presses.
  const handleInput = (e) => {
    const data = e.nativeEvent.data;
    e.target.value = '';
    if (!data) return;
    for (const ch of data) {
      handleKeyDown({ key: ch, shiftKey: false, preventDefault: () => {} });
    }
  };

  // Live HUD calculations
  const elapsedSec = startTime ? Math.max(1, Math.round((Date.now() - startTime) / 1000)) : 0;
  const liveWpm = startTime ? Math.round((keystrokes.correct / 5) / (elapsedSec / 60)) || 0 : 0;
  const liveAccuracy = (keystrokes.correct + keystrokes.incorrect) > 0
    ? Math.round((keystrokes.correct / (keystrokes.correct + keystrokes.incorrect)) * 100)
    : 100;

  const progressPct = settings.mode === 'timed'
    ? Math.round(((settings.timedDuration - timerRemaining) / settings.timedDuration) * 100)
    : words.length > 0 ? Math.round((currentWordIndex / words.length) * 100) : 0;

  const fontClass = isEnglishText
    ? 'font-sans'
    : (settings.fontFamily === 'serif' 
        ? 'font-["Noto_Serif_Ethiopic",_serif]' 
        : 'font-["Noto_Sans_Ethiopic",_sans-serif]');

  return (
    <div 
      className="w-full max-w-4xl mx-auto px-4 flex flex-col justify-center min-h-[380px] cursor-text select-none"
      onClick={focusInput}
    >
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute w-px h-px pointer-events-none"
        style={{ left: 0, top: 0 }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label={t.words}
        tabIndex={0}
      />

      {/* Live Minimalist HUD above text */}
      <div className={`flex items-center justify-between text-sm font-mono mb-4 transition-opacity duration-300 ${isTyping ? 'opacity-30 hover:opacity-100' : 'opacity-80'}`}>
        <div className="flex items-center gap-6">
          {settings.mode === 'timed' ? (
            <div className="text-xl font-bold text-[var(--main-color)]">
              {timerRemaining}s
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[var(--sub-color)]">
              <span>{t.words}:</span>
              <span className="text-[var(--text-color)] font-medium">
                {currentWordIndex} / {words.length}
              </span>
            </div>
          )}

          {settings.mode === 'verse' && (
            <div className="flex items-center gap-2 text-xs text-[var(--main-color)] bg-[var(--surface-color)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
              <span>{t.verse} {activeVerseIndex + 1} / {activeVerses.length}</span>
            </div>
          )}
        </div>

        {/* Live WPM & Accuracy */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--sub-color)] text-xs">{t.wpm}</span>
            <span className="text-lg font-bold text-[var(--main-color)]">{liveWpm}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--sub-color)] text-xs">{t.accuracy}</span>
            <span className="text-lg font-bold text-[var(--text-color)]">{liveAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Progress rail */}
      <div className="h-[3px] w-full rounded-full bg-[var(--sub-alt-color)] overflow-hidden mb-5" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full bg-[var(--main-color)] transition-[width] duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Typing Container */}
      <div className="relative">
      {!isFocused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl backdrop-blur-[3px] animate-in fade-in" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-color) 45%, transparent)' }}>
          <span className="flex items-center gap-2 text-sm font-mono text-[var(--text-color)] bg-[var(--surface-color)] border border-[var(--border-color)] px-4 py-2 rounded-xl shadow-lg">
            <MousePointerClick className="w-4 h-4 text-[var(--main-color)]" />
            {t.focusHint || 'Click or tap here to focus'}
          </span>
        </div>
      )}
      <div 
        ref={containerRef}
        className={`typing-text relative max-h-[13.5rem] overflow-y-auto overflow-x-hidden leading-relaxed tracking-wide text-left ${settings.fontSize} ${fontClass} outline-none focus:outline-none`}
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          ref={caretRef}
          className={`absolute w-0.5 bg-[var(--caret-color)] rounded-full z-10 ${settings.caretStyle === 'smooth' ? 'caret-smooth caret-pulse' : settings.caretStyle === 'block' ? 'w-3 opacity-40 bg-[var(--caret-color)]' : 'caret-pulse'}`}
          style={{
            display: settings.caretStyle === 'off' ? 'none' : 'block',
            transition: 'left 0.08s cubic-bezier(0.2, 0, 0, 1), top 0.08s cubic-bezier(0.2, 0, 0, 1)'
          }}
        />

        <div className="flex flex-wrap gap-x-3.5 gap-y-3">
          {words.map((targetWord, wIdx) => {
            const isCurrent = wIdx === currentWordIndex;
            const isPassed = wIdx < currentWordIndex;
            const typedWord = isPassed ? (typedWords[wIdx] || '') : (isCurrent ? currentInput : '');

            return (
              <span
                key={wIdx}
                ref={el => wordRefs.current[wIdx] = el}
                className={`inline-flex relative ${isPassed && typedWord !== targetWord ? 'word-error' : ''}`}
              >
                {targetWord.split('').map((char, cIdx) => {
                  let letterState = 'untyped';
                  if (cIdx < typedWord.length) {
                    letterState = typedWord[cIdx] === char ? 'correct' : 'incorrect';
                  }

                  return (
                    <span
                      key={cIdx}
                      className={`letter letter-${letterState}`}
                    >
                      {char}
                    </span>
                  );
                })}

                {typedWord.length > targetWord.length && (
                  <span className="letter letter-extra">
                    {typedWord.slice(targetWord.length)}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
      </div>

      {/* Bottom Bar: Quick actions & navigation */}
      <div className="flex items-center justify-between mt-6 pt-3 border-t border-[color-mix(in_srgb,var(--border-color)_40%,transparent)] text-xs text-[var(--sub-color)] font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={resetTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-color)] hover:bg-[var(--sub-alt-color)] text-[var(--text-color)] border border-[var(--border-color)] transition-colors group"
            title={`${t.restartHint} (Tab)`}
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform" />
            <span>{t.restartHint}</span>
            <kbd className="hidden sm:inline text-[10px] bg-[var(--sub-alt-color)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">Tab</kbd>
          </button>

          {settings.mode === 'verse' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (activeVerseIndex > 0) setActiveVerseIndex(prev => prev - 1);
                }}
                disabled={activeVerseIndex === 0}
                className="p-1.5 rounded bg-[var(--surface-color)] border border-[var(--border-color)] disabled:opacity-30 hover:text-[var(--text-color)]"
                title={t.prevPsalm}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (activeVerseIndex + 1 < activeVerses.length) setActiveVerseIndex(prev => prev + 1);
                }}
                disabled={activeVerseIndex + 1 >= activeVerses.length}
                className="p-1.5 rounded bg-[var(--surface-color)] border border-[var(--border-color)] disabled:opacity-30 hover:text-[var(--text-color)]"
                title={t.nextPsalm}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Previous / Next Chapter quick buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevPsalm}
            className="flex items-center gap-1 hover:text-[var(--text-color)] transition-colors"
            title={t.prevPsalm}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.prevPsalm}</span>
          </button>
          <span className="text-[var(--border-color)]">|</span>
          <button
            onClick={onNextPsalm}
            className="flex items-center gap-1 hover:text-[var(--text-color)] transition-colors"
            title={t.nextPsalm}
          >
            <span className="hidden sm:inline">{t.nextPsalm}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
