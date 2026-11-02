import React, { useState, useEffect, useMemo } from 'react';
import {
  Keyboard as KeyboardIcon,
  ChevronDown,
  Sparkles,
  Eye,
  EyeOff,
  LayoutGrid,
  Delete
} from 'lucide-react';
import {
  KEYBOARD_LAYOUT_INFO,
  FIDEL_FAMILIES,
  SYMBOL_KEYS,
  EthiopicPhoneticEngine,
  getKeySequences,
  simulateKeys
} from '../utils/ethiopicTransliteration';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];
const VOWEL_KEYS = new Set(['a', 'e', 'i', 'o', 'u']);
const ORDER_LABELS = ['1ኛ', '2ኛ', '3ኛ', '4ኛ', '5ኛ', '6ኛ', '7ኛ', '8ኛ'];

// Keycap labels come straight from the engine so they always match what the key types
function buildKeycaps(layout) {
  const caps = {};
  for (const row of ROWS) {
    for (const k of row) {
      const base = simulateKeys(layout, k);
      const shift = simulateKeys(layout, k.toUpperCase());
      const engine = new EthiopicPhoneticEngine(layout);
      engine.processKey(k);
      const shiftEngine = new EthiopicPhoneticEngine(layout);
      shiftEngine.processKey(k.toUpperCase());
      caps[k] = {
        base: base !== k ? base : '',
        shift: shift !== k.toUpperCase() ? shift : '',
        family: engine.activeFamily,
        shiftFamily: shiftEngine.activeFamily,
      };
    }
  }
  return caps;
}

// One family's letters with their key sequences, skipping duplicate 8th orders
function familyCells(familyKey, sequences) {
  const letters = FIDEL_FAMILIES[familyKey] || [];
  return letters.map((fidel, idx) => {
    const duplicate = idx === 7 && letters.indexOf(fidel) !== 7;
    return { order: ORDER_LABELS[idx], fidel: duplicate ? '' : fidel, keys: duplicate ? '' : (sequences[fidel] || '') };
  });
}

function KeyChip({ k, done = false, isNext = false }) {
  const label = k === "'" ? "'" : k === ' ' ? 'Space' : k;
  const needsShift = /[A-Z]/.test(k) || ['?', '!', ':'].includes(k);
  return (
    <kbd
      className={`inline-flex items-center gap-1 min-w-[1.75rem] justify-center px-1.5 py-1 rounded-md border font-mono text-xs leading-none transition-colors ${
        done
          ? 'border-transparent text-[var(--sub-color)] line-through opacity-60'
          : isNext
            ? 'border-[var(--main-color)] bg-[var(--main-color)] text-[var(--bg-color)] font-bold shadow-[0_2px_0_var(--main-alt-color)]'
            : 'border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-color)] shadow-[0_2px_0_var(--border-color)]'
      }`}
      title={k === "'" ? 'Separator: stops the next key merging into the previous letter' : undefined}
    >
      {needsShift && /[A-Z]/.test(k) && <span className="text-[9px] opacity-70">⇧</span>}
      {label}
    </kbd>
  );
}

export default function VirtualKeyboard({
  activeLayout = 'powergeez',
  onSelectLayout,
  lastPressedKey,
  isShiftActive = false,
  language = 'en',
  keyHint = null,
  onKeyClick
}) {
  const [activeFamily, setActiveFamily] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const isAm = language === 'am';
  const isDirect = activeLayout === 'direct';

  const engineLayout = isDirect ? 'powergeez' : activeLayout;
  const keycaps = useMemo(() => buildKeycaps(engineLayout), [engineLayout]);
  const sequences = useMemo(() => getKeySequences(engineLayout), [engineLayout]);

  // Next physical key to press, from the live hint
  const nextKey = keyHint?.type === 'char' ? keyHint.keys[0] : keyHint?.type === 'space' ? ' ' : null;
  const nextKeyLower = nextKey && /[a-zA-Z]/.test(nextKey) ? nextKey.toLowerCase() : null;
  const nextNeedsShift = nextKey && /[A-Z]/.test(nextKey);

  // Vowel-order ribbon follows the letter being typed, else the last consonant pressed
  useEffect(() => {
    if (keyHint?.type === 'char') {
      const family = Object.keys(FIDEL_FAMILIES).find(f => FIDEL_FAMILIES[f].includes(keyHint.char));
      if (family) { setActiveFamily(family); return; }
    }
    if (!lastPressedKey) return;
    const cap = keycaps[lastPressedKey.toLowerCase()];
    if (!cap) return;
    const family = isShiftActive && cap.shiftFamily ? cap.shiftFamily : cap.family;
    if (family) setActiveFamily(family);
  }, [keyHint, lastPressedKey, isShiftActive, keycaps]);

  const ribbon = activeFamily ? familyCells(activeFamily, sequences) : null;

  // Chart rows: one per consonant family, ordered by the key that starts it
  const chartRows = useMemo(() => {
    return Object.keys(FIDEL_FAMILIES)
      .map(f => ({ family: f, cells: familyCells(f, sequences), root: sequences[FIDEL_FAMILIES[f][5]] || '' }))
      .filter(r => r.root)
      .sort((a, b) => a.root.toLowerCase().localeCompare(b.root.toLowerCase()) || a.root.localeCompare(b.root));
  }, [sequences]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-2 transition-all select-none">
      <div className="bg-[color-mix(in_srgb,var(--surface-color)_90%,transparent)] backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-3 shadow-lg">

        {/* Header: layout selector & toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-[var(--border-color)] text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[color-mix(in_srgb,var(--main-color)_10%,transparent)] text-[var(--main-color)] flex items-center justify-center">
              <KeyboardIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-[var(--text-color)] hidden sm:inline">
              {isAm ? 'የኪቦርድ አቀማመጥ:' : 'Amharic Keyboard:'}
            </span>
            <div className="relative">
              <select
                value={activeLayout}
                onChange={(e) => onSelectLayout(e.target.value)}
                aria-label={isAm ? 'የኪቦርድ አቀማመጥ' : 'Keyboard layout'}
                className="bg-[var(--sub-alt-color)] border border-[var(--border-color)] hover:border-[var(--main-color)] text-[var(--main-color)] font-medium rounded-xl px-2.5 py-1 text-xs outline-none cursor-pointer pr-6 appearance-none transition-colors"
              >
                {Object.values(KEYBOARD_LAYOUT_INFO).map((info) => (
                  <option key={info.id} value={info.id} className="bg-[var(--surface-color)] text-[var(--text-color)]">
                    {isAm ? info.name : info.nameEn}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--sub-color)] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-colors ${isShiftActive ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold border-[var(--main-color)]' : 'bg-[var(--sub-alt-color)] text-[var(--sub-color)] border-[var(--border-color)]'}`}>
              ⇧ Shift
            </span>
            {!isDirect && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowChart(v => !v)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition-colors ${showChart ? 'border-[var(--main-color)] text-[var(--main-color)] bg-[var(--sub-alt-color)]' : 'border-[var(--border-color)] text-[var(--sub-color)] hover:text-[var(--text-color)]'}`}
                aria-expanded={showChart}
                title={isAm ? 'ሙሉ የፊደል ሰንጠረዥ' : 'Full letter & symbol chart'}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{isAm ? 'ሰንጠረዥ' : 'All mappings'}</span>
              </button>
            )}
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors"
              title={isCollapsed ? 'Show Keyboard' : 'Hide Keyboard'}
              aria-label={isCollapsed ? 'Show Keyboard' : 'Hide Keyboard'}
            >
              {isCollapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isDirect && !isCollapsed && (
          <p className="mb-3 text-[11px] text-[var(--sub-color)] text-center">
            {isAm ? 'በቀጥታ ሁነታ የኮምፒውተርዎ የአማርኛ ኪቦርድ ይሠራል፤ ከታች ያሉት የፓወር ግዕዝ ቁልፎች ለማጣቀሻ ብቻ ናቸው።' : 'Direct mode uses your OS Amharic keyboard. The PowerGe\'ez keys below are for reference only.'}
          </p>
        )}

        {/* Next-key hint */}
        {!isCollapsed && !isDirect && keyHint && (
          <div className="mb-3 flex flex-wrap items-center gap-3 p-2 rounded-xl bg-[color-mix(in_srgb,var(--bg-color)_60%,transparent)] border border-[var(--border-color)]">
            {keyHint.type === 'char' && (
              <>
                <span className="w-10 h-10 rounded-lg bg-[var(--surface-color)] border border-[var(--main-color)] text-[var(--main-color)] flex items-center justify-center text-xl font-bold font-['Noto_Sans_Ethiopic',_sans-serif]">
                  {keyHint.char}
                </span>
                <span className="text-[11px] text-[var(--sub-color)]">{isAm ? 'ይጫኑ' : 'press'}</span>
                <div className="flex items-center gap-1">
                  {[...(keyHint.typed || '')].map((k, i) => <KeyChip key={`t${i}`} k={k} done />)}
                  {[...keyHint.keys].map((k, i) => <KeyChip key={`k${i}`} k={k} isNext={i === 0} />)}
                </div>
                {keyHint.keys.startsWith("'") && (
                  <span className="text-[10px] text-[var(--sub-color)]">
                    {isAm ? "' ፊደሎቹ እንዳይዋሐዱ ይለያል" : "' keeps it from merging with the previous letter"}
                  </span>
                )}
              </>
            )}
            {keyHint.type === 'space' && (
              <>
                <span className="text-[11px] text-[var(--sub-color)]">{isAm ? 'ቃሉ ተጠናቋል — ይጫኑ' : 'Word complete — press'}</span>
                <KeyChip k=" " isNext />
              </>
            )}
            {keyHint.type === 'backspace' && (
              <span className="flex items-center gap-2 text-[11px] text-[var(--error-color)]">
                <Delete className="w-4 h-4" />
                {isAm ? 'ስህተቱን ለማስተካከል Backspace ይጫኑ' : 'Press Backspace to fix the mistake'}
              </span>
            )}
          </div>
        )}

        {/* Vowel-order ribbon for the active consonant */}
        {!isCollapsed && ribbon && (
          <div className="mb-3 p-2 rounded-xl bg-[color-mix(in_srgb,var(--bg-color)_70%,transparent)] border border-[color-mix(in_srgb,var(--main-color)_30%,transparent)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[var(--main-color)] text-[11px] font-sans font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{isAm ? 'የፊደል ረድፎች' : 'Vowel orders'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
              {ribbon.filter(c => c.fidel).map((c) => (
                <div
                  key={c.order}
                  className={`flex flex-col items-center min-w-[2.25rem] px-1.5 py-0.5 rounded border ${keyHint?.char === c.fidel ? 'border-[var(--main-color)] bg-[color-mix(in_srgb,var(--main-color)_12%,transparent)]' : 'bg-[var(--surface-color)] border-[var(--border-color)]'}`}
                  title={c.order}
                >
                  <span className="text-sm font-bold text-[var(--text-color)] font-sans">{c.fidel}</span>
                  <span className="text-[9px] text-[var(--sub-color)]">{c.keys}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full mapping chart */}
        {!isCollapsed && showChart && !isDirect && (
          <div className="mb-3 rounded-xl border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--bg-color)_60%,transparent)] p-2">
            <div className="max-h-72 overflow-auto">
              <table className="w-full text-center border-separate border-spacing-1">
                <thead className="sticky top-0 bg-[var(--surface-color)] z-10">
                  <tr className="text-[10px] text-[var(--sub-color)] font-mono">
                    <th className="px-1 py-1 text-left">{isAm ? 'ቁልፍ' : 'Key'}</th>
                    {ORDER_LABELS.map(o => <th key={o} className="px-1 py-1 font-normal">{o}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {chartRows.map(row => (
                    <tr key={row.family}>
                      <td className="px-1 text-left"><KeyChip k={row.root} /></td>
                      {row.cells.map(c => (
                        <td key={c.order} className={`rounded-md px-1 py-0.5 ${c.fidel ? 'bg-[var(--surface-color)]' : ''} ${keyHint?.char && keyHint.char === c.fidel ? 'ring-1 ring-[var(--main-color)]' : ''}`}>
                          {c.fidel && (
                            <div className="flex flex-col items-center leading-tight">
                              <span className="text-base text-[var(--text-color)] font-['Noto_Sans_Ethiopic',_sans-serif]">{c.fidel}</span>
                              <span className="text-[9px] font-mono text-[var(--main-color)]">{c.keys}</span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[10px] text-[var(--sub-color)] text-center font-mono">
              {isAm
                ? "ሁለት ፊደሎች ሲዋሐዱ (ለምሳሌ c + hu → ቹ) መካከላቸው ' ያስገቡ፦ c'hu → ችሁ"
                : "If two letters merge (c + hu → ቹ), put ' between them: c'hu → ችሁ"}
            </p>
          </div>
        )}

        {/* Keycaps */}
        {!isCollapsed && (
          <div className="space-y-1.5 font-mono text-center">
            {ROWS.map((row, rIdx) => (
              <div key={rIdx} className={`flex justify-center gap-1 sm:gap-1.5 ${rIdx === 1 ? 'px-3' : rIdx === 2 ? 'px-6' : ''}`}>
                {rIdx === 2 && (
                  <div className={`hidden sm:flex w-14 h-12 rounded-xl border items-center justify-center text-[10px] transition-colors ${isShiftActive || nextNeedsShift ? 'border-[var(--main-color)] text-[var(--main-color)]' : 'border-[var(--border-color)] text-[var(--sub-color)]'} ${nextNeedsShift ? 'key-next' : ''}`}>
                    ⇧ Shift
                  </div>
                )}
                {row.map((k) => (
                  <Keycap
                    key={k}
                    k={k}
                    cap={keycaps[k]}
                    isPressed={lastPressedKey && lastPressedKey.toLowerCase() === k}
                    isNext={nextKeyLower === k}
                    isShiftActive={isShiftActive || nextNeedsShift}
                    onKeyClick={onKeyClick}
                  />
                ))}
              </div>
            ))}

            {/* Symbols & space */}
            <div className="flex flex-wrap justify-center items-center gap-1.5 pt-1.5">
              {SYMBOL_KEYS.map((sym) => {
                const active = keyHint?.type === 'char' && keyHint.char === sym.char;
                return (
                  <div
                    key={sym.char}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] transition-colors ${active ? 'border-[var(--main-color)] bg-[color-mix(in_srgb,var(--main-color)_12%,transparent)] key-next' : 'bg-[var(--sub-alt-color)] border-[var(--border-color)]'}`}
                    title={isAm ? sym.nameAm : sym.nameEn}
                  >
                    <span className="text-sm text-[var(--main-color)] font-sans">{sym.char}</span>
                    <span className="text-[var(--text-color)] font-bold">{sym.keys}</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border bg-[var(--sub-alt-color)] border-[var(--border-color)] text-[10px]" title={isAm ? 'መለያ' : 'Separator'}>
                <span className="text-[var(--sub-color)] font-sans">{isAm ? 'መለያ' : 'split'}</span>
                <span className="text-[var(--text-color)] font-bold">'</span>
              </div>
              <div className={`w-full sm:w-auto px-16 sm:px-24 py-1.5 rounded-xl border text-[10px] tracking-widest font-sans transition-colors ${nextKey === ' ' ? 'border-[var(--main-color)] text-[var(--main-color)] key-next' : 'bg-[var(--sub-alt-color)] border-[var(--border-color)] text-[var(--sub-color)]'}`}>
                SPACE
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Keycap({ k, cap, isPressed, isNext, isShiftActive, onKeyClick }) {
  const shown = isShiftActive && cap.shift ? cap.shift : cap.base;
  const isVowel = VOWEL_KEYS.has(k);

  return (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onKeyClick && onKeyClick(k)}
      className={`relative w-8 sm:w-11 h-12 rounded-xl flex flex-col items-center justify-between p-1 border transition-all duration-75 shadow-sm ${
        isPressed
          ? 'bg-[var(--main-color)] border-[var(--main-color)] text-[var(--bg-color)] scale-95'
          : isNext
            ? 'border-[var(--main-color)] bg-[color-mix(in_srgb,var(--main-color)_15%,var(--surface-color))] text-[var(--text-color)] key-next'
            : isVowel
              ? 'bg-[color-mix(in_srgb,var(--main-color)_8%,var(--surface-color))] border-[color-mix(in_srgb,var(--main-color)_25%,transparent)] text-[var(--text-color)]'
              : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--text-color)]'
      }`}
      title={`${k} → ${cap.base || '—'}${cap.shift ? `   ⇧${k.toUpperCase()} → ${cap.shift}` : ''}`}
    >
      {/* Shift letter (top-left) */}
      <span className={`text-[9px] self-start leading-none font-sans ${isShiftActive ? 'text-[var(--main-color)] font-bold' : 'opacity-60'}`}>
        {cap.shift}
      </span>

      {/* Main letter */}
      <span className={`text-sm sm:text-base font-bold font-['Noto_Sans_Ethiopic',_sans-serif] leading-tight ${isPressed ? 'text-[var(--bg-color)]' : 'text-[var(--main-color)]'}`}>
        {shown}
      </span>

      {/* Latin key (bottom-right) */}
      <span className={`text-[9px] self-end leading-none font-mono ${isPressed ? 'text-[var(--bg-color)]' : 'text-[var(--sub-color)]'}`}>
        {k.toUpperCase()}
      </span>
    </button>
  );
}
