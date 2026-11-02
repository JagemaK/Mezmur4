import React, { useState } from 'react';
import { X, Keyboard, CheckCircle2, Sparkles, Layers, Sliders } from 'lucide-react';
import { 
  KEYBOARD_LAYOUT_INFO, 
  EthiopicPhoneticEngine,
  KEYBOARD_KEYCAPS 
} from '../utils/ethiopicTransliteration';

export default function KeyboardMappingModal({
  isOpen,
  onClose,
  activeLayout,
  onSelectLayout,
  language = 'en'
}) {
  const [selectedLayout, setSelectedLayout] = useState(activeLayout);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');

  const testEngine = React.useMemo(() => new EthiopicPhoneticEngine(selectedLayout), [selectedLayout]);

  if (!isOpen) return null;

  const isEnglish = language === 'en';

  const handleTestKey = (e) => {
    if (e.key === 'Backspace') {
      setTestInput(prev => prev.slice(0, -1));
      setTestOutput(prev => prev.slice(0, -1));
      return;
    }
    if (e.key.length === 1) {
      const res = testEngine.processKey(e.key);
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

  const applyMapping = (layoutId) => {
    setSelectedLayout(layoutId);
    onSelectLayout(layoutId);
  };

  // Sample comparison rows
  const comparisonRows = [
    { sound: 'ሀ / ሐ / ኀ', powergeez: 'h = ሀ, Shift+H = ሐ, x = ኀ', keyman: 'h = ሀ, hh = ሐ, x = ኀ' },
    { sound: 'ሰ / ሠ / ሸ', powergeez: 's = ሰ, Shift+S = ሠ, sh = ሸ', keyman: 's = ሰ, sz = ሠ, sh = ሸ' },
    { sound: 'አ / ዐ', powergeez: 'a = አ, Shift+A = ዐ', keyman: 'a = አ, Shift+A = ዐ' },
    { sound: 'ተ / ጠ', powergeez: 't = ተ, Shift+T = ጠ', keyman: 't = ተ, Shift+T = ጠ' },
    { sound: 'ቸ / ጨ', powergeez: 'c = ቸ, Shift+C = ጨ', keyman: 'ch = ቸ, Shift+C = ጨ' },
    { sound: 'ነ / ኘ', powergeez: 'n = ነ, Shift+N = ኘ', keyman: 'n = ነ, ny/gn = ኘ' },
    { sound: 'ከ / ኸ', powergeez: 'k = ከ, Shift+K = ኸ', keyman: 'k = ከ, kh = ኸ' },
    { sound: 'ዘ / ዠ', powergeez: 'z = ዘ, Shift+Z = ዠ', keyman: 'z = ዘ, zh = ዠ' },
    { sound: 'ጸ / ፀ', powergeez: 'ts = ጸ, tz = ፀ', keyman: 'ts = ጸ, tz = ፀ' },
    { sound: 'ፐ / ጰ', powergeez: 'p = ፐ, Shift+P = ጰ', keyman: 'p = ፐ, Shift+P = ጰ' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[var(--surface-color)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 md:p-8 my-6 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[color-mix(in_srgb,var(--main-color)_10%,transparent)] border border-[color-mix(in_srgb,var(--main-color)_30%,transparent)] flex items-center justify-center text-[var(--main-color)]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-color)]">
                {isEnglish ? 'Choose Amharic Keyboard Mapping' : 'የአማርኛ ኪቦርድ አቀማመጥ ይምረጡ'}
              </h2>
              <p className="text-xs text-[var(--sub-color)]">
                {isEnglish ? 'Select the transliteration layout that matches how you type' : 'የሚፈልጉትን የፊደላት ግቤት ስልት ይምረጡ'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout Cards Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {Object.values(KEYBOARD_LAYOUT_INFO).map((info) => {
            const isSelected = selectedLayout === info.id;
            const isCurrentGlobal = activeLayout === info.id;

            return (
              <button
                key={info.id}
                type="button"
                onClick={() => applyMapping(info.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                  isSelected 
                    ? 'bg-[color-mix(in_srgb,var(--main-color)_10%,transparent)] border-[var(--main-color)] shadow-md shadow-amber-500/10' 
                    : 'bg-[color-mix(in_srgb,var(--bg-color)_50%,transparent)] border-[var(--border-color)] hover:border-[color-mix(in_srgb,var(--main-color)_50%,transparent)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text-color)]">
                      {isEnglish ? info.nameEn : info.name}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--main-color)]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isEnglish ? 'Active' : 'የነቃ'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--sub-color)] leading-relaxed">
                    {isEnglish ? info.descriptionEn : info.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[color-mix(in_srgb,var(--border-color)_40%,transparent)] text-[10px] text-[var(--sub-color)] font-mono">
                  <span>{info.id === 'powergeez' ? 'Shift Key + Phonetic' : info.id === 'keyman' ? 'Multi-letter Combinations' : 'Standard'}</span>
                  <span className={`px-2 py-0.5 rounded ${isSelected ? 'bg-[var(--main-color)] text-black font-bold' : 'bg-[var(--sub-alt-color)] text-[var(--text-color)]'}`}>
                    {isSelected ? (isEnglish ? 'Selected' : 'ተመርጧል') : (isEnglish ? 'Select' : 'ይምረጡ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Test Sandbox */}
        <div className="p-4 rounded-2xl bg-[color-mix(in_srgb,var(--bg-color)_60%,transparent)] border border-[var(--border-color)] mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--main-color)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEnglish ? `Test Selected Mapping (${KEYBOARD_LAYOUT_INFO[selectedLayout]?.nameEn}):` : `የተመረጠውን ኪቦርድ እዚህ ይሞክሩት:`}</span>
            </span>
            <button
              onClick={() => { setTestInput(''); setTestOutput(''); testEngine.reset(); }}
              className="text-[11px] text-[var(--sub-color)] hover:text-[var(--text-color)]"
            >
              {isEnglish ? 'Clear' : 'አጽዳ'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder={isEnglish ? 'Type in Latin (e.g. selam, dawit, Tawahedo)...' : 'በእንግሊዝኛ ይተይቡ...'}
              value={testInput}
              onKeyDown={handleTestKey}
              onChange={() => {}}
              className="w-full sm:w-1/2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-[var(--text-color)] outline-none focus:border-[var(--main-color)]"
            />
            <div className="w-full sm:w-1/2 p-2 bg-[var(--surface-color)] border border-amber-500/30 rounded-xl text-base font-medium text-[var(--main-color)] min-h-[38px] flex items-center">
              {testOutput || <span className="text-xs text-[var(--sub-color)] font-normal">{isEnglish ? 'Transliterated Fidel appears here...' : 'ውጤቱ እዚህ ይታያል...'}</span>}
            </div>
          </div>
        </div>

        {/* Key Comparison Table */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-[var(--sub-alt-color)] p-2 font-bold text-[var(--text-color)] border-b border-[var(--border-color)]">
              <div>{isEnglish ? 'Sound / Fidel' : 'ድምፅ / ፊደል'}</div>
              <div>ፓወር ግዕዝ (PowerGe'ez)</div>
              <div>ኪይማን (Keyman / SIL)</div>
            </div>

            <div className="divide-y divide-[color-mix(in_srgb,var(--border-color)_50%,transparent)]">
              {comparisonRows.map((r, idx) => (
                <div key={idx} className="grid grid-cols-3 p-2 items-center hover:bg-[color-mix(in_srgb,var(--sub-alt-color)_30%,transparent)]">
                  <div className="font-bold text-[var(--main-color)]">{r.sound}</div>
                  <div className="text-[var(--text-color)] font-mono text-[11px]">{r.powergeez}</div>
                  <div className="text-[var(--text-color)] font-mono text-[11px]">{r.keyman}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={() => {
              onSelectLayout(selectedLayout);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[var(--main-color)] hover:bg-[var(--main-alt-color)] text-black font-semibold text-xs transition-colors shadow-md shadow-amber-500/20"
          >
            {isEnglish ? 'Done & Close' : 'ተከናውኗል (ዝጋ)'}
          </button>
        </div>

      </div>
    </div>
  );
}
