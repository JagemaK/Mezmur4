import React, { useState } from 'react';
import { X, HelpCircle, Keyboard, Sparkles } from 'lucide-react';
import { EthiopicPhoneticEngine, FIDEL_FAMILIES, getKeySequences } from '../utils/ethiopicTransliteration';

export default function PhoneticGuideModal({ isOpen, onClose, layout = 'powergeez' }) {
  const engineLayout = layout === 'direct' ? 'powergeez' : layout;
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const engine = React.useMemo(() => new EthiopicPhoneticEngine(engineLayout), [engineLayout]);

  if (!isOpen) return null;

  const handleTestKey = (e) => {
    if (e.key === 'Backspace') {
      engine.reset();
      setTestInput(prev => prev.slice(0, -1));
      setTestOutput(prev => prev.slice(0, -1));
      return;
    }
    if (e.key.length === 1) {
      const res = engine.processKey(e.key);
      setTestInput(prev => prev + e.key);
      if (res && res.output) {
        if (res.replaceLength > 0) {
          setTestOutput(prev => prev.slice(0, -res.replaceLength) + res.output);
        } else {
          setTestOutput(prev => prev + res.output);
        }
      }
    }
  };

  // Rows generated from the engine so the guide always matches real input
  const sequences = getKeySequences(engineLayout);
  const sampleLetters = Object.values(FIDEL_FAMILIES)
    .map(letters => ({
      key: sequences[letters[5]] || '',
      row: letters.map((fidel, idx) => {
        if (idx === 7 && letters.indexOf(fidel) !== 7) return '';
        return sequences[fidel] ? `${fidel} (${sequences[fidel]})` : '';
      }),
    }))
    .filter(item => item.key)
    .sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase()) || a.key.localeCompare(b.key));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[var(--surface-color)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 md:p-8 my-6 relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[color-mix(in_srgb,var(--main-color)_10%,transparent)] border border-[color-mix(in_srgb,var(--main-color)_30%,transparent)] flex items-center justify-center text-[var(--main-color)]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-color)]">
                የአማርኛ ፊደላት ድምፅ ግቤት መመሪያ (Phonetic Guide)
              </h2>
              <p className="text-xs text-[var(--sub-color)]">በተለመደው የእንግሊዝኛ ኪቦርድ አማርኛን በቀላሉ ለመተየብ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Interactive Sandbox Tester */}
        <div className="my-4 p-4 rounded-2xl bg-[color-mix(in_srgb,var(--bg-color)_60%,transparent)] border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--main-color)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>እዚህ ይሞክሩት (Live Test Box):</span>
            </span>
            <button
              onClick={() => { setTestInput(''); setTestOutput(''); engine.reset(); }}
              className="text-[11px] text-[var(--sub-color)] hover:text-[var(--text-color)]"
            >
              አጽዳ
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="በእንግሊዝኛ ይተይቡ (ምሳሌ፡ selam, egziabher, dawit)..."
              value={testInput}
              onKeyDown={handleTestKey}
              onChange={() => {}}
              className="w-full sm:w-1/2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-[var(--text-color)] outline-none focus:border-[var(--main-color)]"
            />
            <div className="w-full sm:w-1/2 p-2 bg-[var(--surface-color)] border border-[color-mix(in_srgb,var(--main-color)_30%,transparent)] rounded-xl text-base font-medium text-[var(--main-color)] min-h-[38px] flex items-center">
              {testOutput || <span className="text-xs text-[var(--sub-color)] font-normal">ውጤቱ እዚህ ይታያል...</span>}
            </div>
          </div>
        </div>

        {/* Quick Rules Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-4 text-[var(--sub-color)]">
          <div className="p-2.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--border-color)]">
            <div className="text-[var(--text-color)] font-bold">1ኛ (ግዕዝ): + e</div>
            <div className="text-[11px] text-[var(--main-color)]">s + e = ሰ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--border-color)]">
            <div className="text-[var(--text-color)] font-bold">4ኛ (ራብዕ): + a</div>
            <div className="text-[11px] text-[var(--main-color)]">s + a = ሳ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--border-color)]">
            <div className="text-[var(--text-color)] font-bold">6ኛ (ሳድስ): ቀጥታ</div>
            <div className="text-[11px] text-[var(--main-color)]">s = ስ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--border-color)]">
            <div className="text-[var(--text-color)] font-bold">ሥርዓተ-ነጥብ</div>
            <div className="text-[11px] text-[var(--main-color)]">:: = ። | :- = ፥ | ; = ፤ | , = ፣ | ' = split</div>
          </div>
        </div>

        {/* Fidel Mapping Table */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden text-xs">
            <div className="grid grid-cols-9 bg-[var(--sub-alt-color)] p-2 font-bold text-[var(--text-color)] border-b border-[var(--border-color)] text-center">
              <div>ፊደል</div>
              <div>ግዕዝ (e)</div>
              <div>ካዕብ (u)</div>
              <div>ሣልስ (i)</div>
              <div>ራብዕ (a)</div>
              <div>ኃምስ (E)</div>
              <div>ሳድስ (-)</div>
              <div>ሳብዕ (o)</div>
              <div>ሳምንት (W)</div>
            </div>

            <div className="divide-y divide-[color-mix(in_srgb,var(--border-color)_50%,transparent)]">
              {sampleLetters.map(item => (
                <div key={item.key} className="grid grid-cols-9 p-2 items-center text-center hover:bg-[color-mix(in_srgb,var(--sub-alt-color)_30%,transparent)]">
                  <div className="font-bold text-[var(--main-color)] font-mono">{item.key}</div>
                  {item.row.map((cell, idx) => (
                    <div key={idx} className="text-[var(--text-color)] font-medium text-[11px]">
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
