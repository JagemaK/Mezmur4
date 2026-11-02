import React from 'react';
import { X, Trophy, Flame } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function ProgressMapModal({
  isOpen,
  onClose,
  psalms,
  progress,
  onSelectPsalm,
  language = 'en'
}) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isEnglish = language === 'en';

  const completedMap = progress?.completedChapters || {};
  const completedCount = Object.keys(completedMap).length;
  const percentage = Math.round((completedCount / 151) * 100);

  const completedStats = Object.values(completedMap);
  const avgWpm = completedStats.length > 0 
    ? Math.round(completedStats.reduce((a, b) => a + (b.bestWpm || 0), 0) / completedStats.length)
    : 0;

  const dayGroups = [
    { name: t.days[1].name, range: '1-30', count: psalms.filter(p => p.dayIndex === 1 && completedMap[p.id]).length, total: 30 },
    { name: t.days[2].name, range: '31-60', count: psalms.filter(p => p.dayIndex === 2 && completedMap[p.id]).length, total: 30 },
    { name: t.days[3].name, range: '61-80', count: psalms.filter(p => p.dayIndex === 3 && completedMap[p.id]).length, total: 20 },
    { name: t.days[4].name, range: '81-110', count: psalms.filter(p => p.dayIndex === 4 && completedMap[p.id]).length, total: 30 },
    { name: t.days[5].name, range: '111-130', count: psalms.filter(p => p.dayIndex === 5 && completedMap[p.id]).length, total: 20 },
    { name: t.days[6].name, range: '131-151', count: psalms.filter(p => p.dayIndex === 6 && completedMap[p.id]).length, total: 21 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[var(--surface-color)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 md:p-8 my-6 relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[color-mix(in_srgb,var(--main-color)_10%,transparent)] border border-[color-mix(in_srgb,var(--main-color)_30%,transparent)] flex items-center justify-center text-[var(--main-color)]">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-color)]">
                {t.journeyTitle}
              </h2>
              <p className="text-xs text-[var(--sub-color)]">{t.journeySubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Overview */}
        <div className="my-5 p-5 rounded-2xl bg-[color-mix(in_srgb,var(--bg-color)_60%,transparent)] border border-[var(--border-color)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[var(--sub-color)] font-mono">{t.completedChapters}</div>
              <div className="text-3xl font-black text-[var(--main-color)] font-mono">
                {completedCount} <span className="text-base font-normal text-[var(--sub-color)]">/ 151 ({percentage}%)</span>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-center">
              <div>
                <div className="text-xs text-[var(--sub-color)]">{t.avgWpm}</div>
                <div className="text-2xl font-bold text-[var(--text-color)]">{avgWpm}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--sub-color)]">{t.streakLabel}</div>
                <div className="text-2xl font-bold text-amber-500 flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 fill-current" />
                  <span>{progress?.streak || 1}d</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[var(--sub-alt-color)] rounded-full overflow-hidden p-0.5 border border-[var(--border-color)]">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Liturgical Days Pills Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 text-xs font-mono">
            {dayGroups.map(d => (
              <div key={d.name} className="p-2 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] text-center">
                <div className="text-[11px] font-semibold text-[var(--text-color)]">{d.name}</div>
                <div className="text-[10px] text-[var(--sub-color)]">{d.range}</div>
                <div className="text-xs font-bold text-[var(--main-color)] mt-1">{d.count} / {d.total}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 151 Interactive Cells Matrix */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
            {psalms.map((p) => {
              const record = completedMap[p.id];
              const isDone = !!record;
              const title = isEnglish ? (p.titleEn || `Psalm ${p.chapter}`) : (p.titleAm || p.title);

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPsalm(p);
                    onClose();
                  }}
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center relative transition-all group ${isDone ? 'bg-amber-500/15 border border-amber-500/40 text-[var(--main-color)] hover:bg-amber-500/25' : 'bg-[color-mix(in_srgb,var(--sub-alt-color)_40%,transparent)] border border-[color-mix(in_srgb,var(--border-color)_60%,transparent)] text-[var(--sub-color)] hover:border-[var(--main-color)] hover:text-[var(--text-color)]'}`}
                  title={`${title} (${p.chapter}) ${isDone ? `• ${record.bestWpm} WPM` : ''}`}
                >
                  <span className="text-[11px] font-bold font-mono">{p.chapter}</span>
                  <span className="text-[9px] font-mono opacity-70">{p.geezNumber}</span>
                  {isDone && (
                    <span className="text-[8px] font-mono text-emerald-400 font-semibold mt-0.5">
                      {record.bestWpm}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
