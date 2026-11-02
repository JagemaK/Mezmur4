import React, { useState } from 'react';
import { X, HelpCircle, Keyboard, Sparkles } from 'lucide-react';
import { EthiopicPhoneticEngine, FIDEL_MAP } from '../utils/ethiopicTransliteration';

export default function PhoneticGuideModal({ isOpen, onClose }) {
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const engine = React.useMemo(() => new EthiopicPhoneticEngine(), []);

  if (!isOpen) return null;

  const handleTestKey = (e) => {
    if (e.key === 'Backspace') {
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

  const sampleLetters = [
    { key: 'h', name: 'ሀ', row: ['ሀ (he)', 'ሁ (hu)', 'ሂ (hi)', 'ሃ (ha)', 'ሄ (hie)', 'ህ (h)', 'ሆ (ho)', 'ኋ (hwa)'] },
    { key: 'l', name: 'ለ', row: ['ለ (le)', 'ሉ (lu)', 'ሊ (li)', 'ላ (la)', 'ሌ (lie)', 'ል (l)', 'ሎ (lo)', 'ሏ (lwa)'] },
    { key: 'm', name: 'መ', row: ['መ (me)', 'ሙ (mu)', 'ሚ (mi)', 'ማ (ma)', 'ሜ (mie)', 'ም (m)', 'ሞ (mo)', 'ሟ (mwa)'] },
    { key: 's', name: 'ሰ', row: ['ሰ (se)', 'ሱ (su)', 'ሲ (si)', 'ሳ (sa)', 'ሴ (sie)', 'ስ (s)', 'ሶ (so)', 'ሷ (swa)'] },
    { key: 'sh', name: 'ሸ', row: ['ሸ (she)', 'ሹ (shu)', 'ሺ (shi)', 'ሻ (sha)', 'ሼ (shie)', 'ሽ (sh)', 'ሾ (sho)', 'ሿ (shwa)'] },
    { key: 'b', name: 'በ', row: ['በ (be)', 'ቡ (bu)', 'ቢ (bi)', 'ባ (ba)', 'ቤ (bie)', 'ብ (b)', 'ቦ (bo)', 'ቧ (bwa)'] },
    { key: 't', name: 'ተ', row: ['ተ (te)', 'ቱ (tu)', 'ቲ (ti)', 'ታ (ta)', 'ቴ (tie)', 'ት (t)', 'ቶ (to)', 'ቷ (twa)'] },
    { key: 'ch', name: 'ቸ', row: ['ቸ (che)', 'ቹ (chu)', 'ቺ (chi)', 'ቻ (cha)', 'ቼ (chie)', 'ች (ch)', 'ቾ (cho)', 'ቿ (chwa)'] },
    { key: 'n', name: 'ነ', row: ['ነ (ne)', 'ኑ (nu)', 'ኒ (ni)', 'ና (na)', 'ኔ (nie)', 'ን (n)', 'ኖ (no)', 'ኗ (nwa)'] },
    { key: 'ny', name: 'ኘ', row: ['ኘ (nye)', 'ኙ (nyu)', 'ኚ (nyi)', 'ኛ (nya)', 'ኜ (nyie)', 'ኝ (ny)', 'ኞ (nyo)', 'ኟ (nywa)'] },
    { key: 'a', name: 'አ', row: ['አ (a/e)', 'ኡ (u)', 'ኢ (i)', 'ኣ (aa)', 'ኤ (ie)', 'እ (e/i)', 'ኦ (o)', 'ኧ (ea)'] },
    { key: 'k', name: 'ከ', row: ['ከ (ke)', 'ኩ (ku)', 'ኪ (ki)', 'ካ (ka)', 'ኬ (kie)', 'ክ (k)', 'ኮ (ko)', 'ኳ (kwa)'] },
    { key: 'w', name: 'ወ', row: ['ወ (we)', 'ዉ (wu)', 'ዊ (wi)', 'ዋ (wa)', 'ዌ (wie)', 'ው (w)', 'ዎ (wo)', ''] },
    { key: 'z', name: 'ዘ', row: ['ዘ (ze)', 'ዙ (zu)', 'ዚ (zi)', 'ዛ (za)', 'ዜ (zie)', 'ዝ (z)', 'ዞ (zo)', 'ዟ (zwa)'] },
    { key: 'd', name: 'ደ', row: ['ደ (de)', 'ዱ (du)', 'ዲ (di)', 'ዳ (da)', 'ዴ (die)', 'ድ (d)', 'ዶ (do)', 'ዷ (dwa)'] },
    { key: 'g', name: 'ገ', row: ['ገ (ge)', 'ጉ (gu)', 'ጊ (gi)', 'ጋ (ga)', 'ጌ (gie)', 'ግ (g)', 'ጎ (go)', 'ጓ (gwa)'] },
    { key: 'T', name: 'ጠ', row: ['ጠ (Te)', 'ጡ (Tu)', 'ጢ (Ti)', 'ጣ (Ta)', 'ጤ (Tie)', 'ጥ (T)', 'ጦ (To)', 'ጧ (Twa)'] },
    { key: 'ts', name: 'ጸ', row: ['ጸ (tse)', 'ጹ (tsu)', 'ጺ (tsi)', 'ጻ (tsa)', 'ጼ (tsie)', 'ጽ (ts)', 'ጾ (tso)', 'ጿ (tswa)'] },
    { key: 'f', name: 'ፈ', row: ['ፈ (fe)', 'ፉ (fu)', 'ፊ (fi)', 'ፋ (fa)', 'ፌ (fie)', 'ፍ (f)', 'ፎ (fo)', 'ፏ (fwa)'] },
  ];

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
            <div className="w-full sm:w-1/2 p-2 bg-[var(--surface-color)] border border-amber-500/30 rounded-xl text-base font-medium text-[var(--main-color)] min-h-[38px] flex items-center">
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
            <div className="text-[11px] text-[var(--main-color)]">:: = ። | , = ፣ | ; = ፤</div>
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
              <div>ኃምስ (ie)</div>
              <div>ሳድስ (-)</div>
              <div>ሳብዕ (o)</div>
              <div>ሳምንት (wa)</div>
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
