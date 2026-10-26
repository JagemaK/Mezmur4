import React from 'react';
import { X, BarChart2, Calendar, Trophy, Zap, Trash2 } from 'lucide-react';

export default function HistoryModal({
  isOpen,
  onClose,
  history,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--surface-color)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 md:p-8 my-6 relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--main-color)]/10 border border-[var(--main-color)]/30 flex items-center justify-center text-[var(--main-color)]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-color)]">
                የጽሕፈት ታሪክና ስታቲስቲክስ (History & Stats)
              </h2>
              <p className="text-xs text-[var(--sub-color)]">ያከናወኗቸው የቅርብ ጊዜ የጽሕፈት ሙከራዎች</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto my-4 divide-y divide-[var(--border-color)]/50">
          {!history || history.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--sub-color)]">
              ምንም የተመዘገበ ታሪክ የለም። የመጀመሪያዎን መዝሙር ይተይቡ!
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-[var(--text-color)] font-mono">
                    {item.chapter}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--text-color)]">
                      መዝሙር {item.chapter}
                    </div>
                    <div className="text-[10px] text-[var(--sub-color)] flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{item.time}s</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-right">
                  <div>
                    <div className="text-sm font-bold text-[var(--main-color)]">{item.wpm} WPM</div>
                    <div className="text-[10px] text-[var(--sub-color)]">{item.cpm} CPM</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[var(--text-color)]">{item.accuracy}%</div>
                    <div className="text-[10px] text-[var(--sub-color)]">Acc</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {history && history.length > 0 && (
          <div className="pt-3 border-t border-[var(--border-color)] flex justify-end">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ታሪክ አጽዳ</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
