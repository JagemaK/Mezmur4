import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  Copy, 
  Check, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import PerformanceChart from './PerformanceChart';
import { TRANSLATIONS } from '../utils/translations';

export default function ResultsModal({
  results,
  timeline,
  onRestart,
  onNextChapter,
  onClose,
  language = 'en'
}) {
  const [copied, setCopied] = React.useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isEnglish = results?.textLanguage === 'en';

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#10b981', '#ef4444', '#f8fafc']
      });
    } catch {
      // Confetti error fallback
    }
  }, []);

  if (!results) return null;

  const { wpm, rawWpm, cpm, accuracy, consistency, time, keystrokes, psalm } = results;

  let grade = 'A';
  let gradeLabel = t.gradeGreat;
  if (wpm >= 70 && accuracy >= 95) {
    grade = 'S';
    gradeLabel = t.gradeMastery;
  } else if (wpm >= 50 && accuracy >= 90) {
    grade = 'A';
    gradeLabel = t.gradeGreat;
  } else if (wpm >= 30) {
    grade = 'B';
    gradeLabel = t.gradeGood;
  } else {
    grade = 'C';
    gradeLabel = t.gradePractice;
  }

  const psalmTitle = isEnglish ? (psalm.titleEn || `Psalm ${psalm.chapter}`) : (psalm.titleAm || psalm.title);
  const chapterName = isEnglish ? `Psalm ${psalm.chapter}` : `መዝሙር ${psalm.geezNumber || psalm.chapter}`;
  const dayName = isEnglish ? psalm.dayEn : psalm.dayAm;
  const passageText = (isEnglish ? psalm.versesEn : psalm.versesAm)?.join(' ') || '';

  const copyShareText = () => {
    const text = `DawitType | ዳዊት ታይፕ
📖 ${chapterName} (${psalmTitle})
⚡ WPM: ${wpm} | CPM: ${cpm}
🎯 Accuracy: ${accuracy}%
⏱ Time: ${time}s
🔥 Grade: ${grade} (${gradeLabel})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[var(--surface-color)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 md:p-8 my-8 relative">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[var(--border-color)] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--main-color)]/10 border border-[var(--main-color)]/30 flex items-center justify-center text-[var(--main-color)]">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--text-color)]">
                  {chapterName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-[var(--main-color)] border border-amber-500/30">
                  {grade}
                </span>
              </div>
              <p className="text-xs text-[var(--sub-color)]">{psalmTitle} • {gradeLabel}</p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--border-color)] text-xs text-[var(--sub-color)] font-medium flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--main-color)]" />
            <span>{dayName} ({psalm.dayRange})</span>
          </div>
        </div>

        {/* Hero Numbers & Interactive Chart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6 items-center">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-[var(--sub-color)] font-mono uppercase tracking-wider">
                WPM
              </div>
              <div className="text-5xl font-black text-[var(--main-color)] tracking-tight font-mono">
                {wpm}
              </div>
            </div>

            <div>
              <div className="text-xs text-[var(--sub-color)] font-mono uppercase tracking-wider">
                {t.accuracy}
              </div>
              <div className="text-4xl font-bold text-[var(--text-color)] tracking-tight font-mono">
                {accuracy}%
              </div>
            </div>
          </div>

          <div className="md:col-span-3 bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-2xl p-4">
            <PerformanceChart timeline={timeline} />
          </div>
        </div>

        {/* Secondary Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 font-mono text-center">
          <div className="p-3 rounded-xl bg-[var(--sub-alt-color)]/60 border border-[var(--border-color)]">
            <div className="text-[11px] text-[var(--sub-color)]">{t.rawWpm}</div>
            <div className="text-xl font-bold text-[var(--text-color)]">{rawWpm}</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--sub-alt-color)]/60 border border-[var(--border-color)]">
            <div className="text-[11px] text-[var(--sub-color)]">{t.cpm}</div>
            <div className="text-xl font-bold text-[var(--text-color)]">{cpm}</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--sub-alt-color)]/60 border border-[var(--border-color)]">
            <div className="text-[11px] text-[var(--sub-color)]">{t.consistency}</div>
            <div className="text-xl font-bold text-[var(--text-color)]">{consistency}%</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--sub-alt-color)]/60 border border-[var(--border-color)]">
            <div className="text-[11px] text-[var(--sub-color)]">{t.charBreakdown}</div>
            <div className="text-xs font-bold text-[var(--text-color)] mt-1">
              <span className="text-[var(--text-color)]">{keystrokes?.correct || 0}</span> / 
              <span className="text-[var(--error-color)]"> {keystrokes?.incorrect || 0}</span> / 
              <span className="text-red-400"> {keystrokes?.extra || 0}</span> / 
              <span className="text-slate-400"> {keystrokes?.missed || 0}</span>
            </div>
          </div>
        </div>

        {/* Scripture Reflection & Full Text Preview Box */}
        <div className="my-6 p-4 rounded-2xl bg-[var(--sub-alt-color)]/40 border border-[var(--border-color)] text-xs text-[var(--sub-color)] max-h-36 overflow-y-auto leading-relaxed">
          <div className="font-semibold text-[var(--text-color)] mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[var(--main-color)]" />
            <span>{t.scripturePassage}</span>
          </div>
          <p className="select-text text-justify leading-relaxed">
            {passageText}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <button
              onClick={copyShareText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--sub-alt-color)] hover:bg-[var(--border-color)] text-[var(--text-color)] border border-[var(--border-color)] text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copiedAlert : t.shareResults}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--sub-alt-color)] hover:bg-[var(--border-color)] text-[var(--text-color)] border border-[var(--border-color)] text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.restartBtn}</span>
            </button>

            <button
              onClick={onNextChapter}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--main-color)] hover:bg-[var(--main-alt-color)] text-black font-semibold text-xs transition-colors shadow-md shadow-amber-500/20"
            >
              <span>{t.nextChapterBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
