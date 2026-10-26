import React, { useState, useMemo } from 'react';
import { Search, X, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function ChapterDrawer({
  isOpen,
  onClose,
  psalms,
  currentPsalmId,
  onSelectPsalm,
  progress,
  todayDayIndex,
  language = 'en',
  textLanguage = 'en'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isEnglish = language === 'en';

  const daysList = [
    { id: 'all', name: t.allDays },
    { id: 1, name: `${t.days[1].name} (${t.days[1].range})` },
    { id: 2, name: `${t.days[2].name} (${t.days[2].range})` },
    { id: 3, name: `${t.days[3].name} (${t.days[3].range})` },
    { id: 4, name: `${t.days[4].name} (${t.days[4].range})` },
    { id: 5, name: `${t.days[5].name} (${t.days[5].range})` },
    { id: 6, name: `${t.days[6].name} (${t.days[6].range})` },
  ];

  // Filtered list
  const filteredPsalms = useMemo(() => {
    return psalms.filter(p => {
      if (selectedDayFilter !== 'all' && p.dayIndex !== Number(selectedDayFilter)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesChapter = p.chapter.toString().includes(q);
        const matchesGeez = (p.geezNumber || '').includes(q);
        const matchesTitleAm = (p.titleAm || p.title || '').toLowerCase().includes(q);
        const matchesTitleEn = (p.titleEn || '').toLowerCase().includes(q);
        const matchesThemeAm = (p.themeAm || '').toLowerCase().includes(q);
        const matchesThemeEn = (p.themeEn || '').toLowerCase().includes(q);

        return matchesChapter || matchesGeez || matchesTitleAm || matchesTitleEn || matchesThemeAm || matchesThemeEn;
      }
      return true;
    });
  }, [psalms, selectedDayFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[var(--surface-color)] border-l border-[var(--border-color)] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--main-color)]/10 border border-[var(--main-color)]/30 flex items-center justify-center text-[var(--main-color)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-color)]">
                {t.drawerTitle}
              </h2>
              <p className="text-xs text-[var(--sub-color)]">{t.drawerSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Liturgical Filter */}
        <div className="p-4 border-b border-[var(--border-color)] space-y-3 bg-[var(--bg-color)]/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sub-color)]" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--text-color)] placeholder:text-[var(--sub-color)] outline-none focus:border-[var(--main-color)] transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--sub-color)] hover:text-[var(--text-color)]"
              >
                {t.clearBtn}
              </button>
            )}
          </div>

          {/* Liturgical Day Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {daysList.map(day => {
              const isToday = day.id === todayDayIndex;
              const isSelected = selectedDayFilter === day.id;

              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayFilter(day.id)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-[11px] font-medium transition-all ${isSelected ? 'bg-[var(--main-color)] text-black font-semibold' : 'bg-[var(--surface-color)] text-[var(--sub-color)] border border-[var(--border-color)] hover:text-[var(--text-color)]'}`}
                >
                  {isToday && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>}
                  {day.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[var(--border-color)]/40 space-y-1">
          {filteredPsalms.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--sub-color)]">
              {t.noResultsFound}
            </div>
          ) : (
            filteredPsalms.map((psalm) => {
              const isCurrent = psalm.id === currentPsalmId;
              const record = progress?.completedChapters?.[psalm.id];
              const title = isEnglish ? (psalm.titleEn || `Psalm ${psalm.chapter}`) : (psalm.titleAm || psalm.title);
              const versesCount = (isEnglish ? psalm.versesEn : psalm.versesAm)?.length || psalm.totalVerses;
              const wordsCount = isEnglish ? (psalm.totalWordsEn || psalm.totalWords) : psalm.totalWordsAm;
              const dayLabel = isEnglish ? psalm.dayEn : psalm.dayAm;

              return (
                <button
                  key={psalm.id}
                  onClick={() => {
                    onSelectPsalm(psalm);
                    onClose();
                  }}
                  className={`w-full py-3 px-3 rounded-xl flex items-center justify-between text-left transition-all ${isCurrent ? 'bg-[var(--main-color)]/10 border border-[var(--main-color)]/40' : 'hover:bg-[var(--sub-alt-color)]/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-mono ${isCurrent ? 'bg-[var(--main-color)] text-black font-bold' : 'bg-[var(--sub-alt-color)] text-[var(--text-color)] border border-[var(--border-color)]'}`}>
                      <span className="text-xs font-bold leading-tight">
                        {isEnglish ? psalm.chapter : psalm.geezNumber}
                      </span>
                      <span className="text-[10px] text-[var(--sub-color)] leading-tight">
                        {isEnglish ? psalm.geezNumber : psalm.chapter}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--text-color)]">
                          {title}
                        </span>
                        {psalm.popular && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 text-[var(--main-color)] border border-amber-500/30">
                            {t.popularTag}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--sub-color)] flex items-center gap-2 mt-0.5">
                        <span>{versesCount} {t.versesCountSuffix}</span>
                        <span>•</span>
                        <span>{wordsCount} {t.wordsCountSuffix}</span>
                        <span>•</span>
                        <span className="text-amber-500/80">{dayLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {record ? (
                      <div className="text-right font-mono text-[11px]">
                        <div className="flex items-center gap-1 text-emerald-400 font-semibold justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{record.bestWpm} WPM</span>
                        </div>
                        <div className="text-[10px] text-[var(--sub-color)]">
                          {record.bestAccuracy}% Acc
                        </div>
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[var(--sub-color)] opacity-60" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
