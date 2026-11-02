import React, { useState, useEffect } from 'react';
import { 
  Keyboard as KeyboardIcon, 
  ChevronDown, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Layers 
} from 'lucide-react';
import { 
  KEYBOARD_LAYOUT_INFO, 
  KEYBOARD_KEYCAPS, 
  FIDEL_FAMILIES 
} from '../utils/ethiopicTransliteration';

export default function VirtualKeyboard({
  activeLayout = 'powergeez',
  onSelectLayout,
  lastPressedKey,
  isShiftActive = false,
  language = 'en',
  onKeyClick
}) {
  const [activeFamily, setActiveFamily] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Keycap mappings for the chosen layout
  const keycaps = KEYBOARD_KEYCAPS[activeLayout] || KEYBOARD_KEYCAPS.powergeez;

  // QWERTY Rows definition
  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  // Track active consonant family when key is pressed
  useEffect(() => {
    if (!lastPressedKey) return;
    const lower = lastPressedKey.toLowerCase();
    const cap = keycaps[lower];
    if (cap && cap.family) {
      const familyKey = isShiftActive && cap.shiftFamily ? cap.shiftFamily : cap.family;
      setActiveFamily(familyKey);
    }
  }, [lastPressedKey, isShiftActive, keycaps]);

  const activeFamilyLetters = activeFamily ? FIDEL_FAMILIES[activeFamily] : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-2 transition-all select-none">
      <div className="bg-[color-mix(in_srgb,var(--surface-color)_90%,transparent)] backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-3 shadow-lg">
        
        {/* Keyboard Header: Layout Selector & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-[var(--border-color)] text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[color-mix(in_srgb,var(--main-color)_10%,transparent)] text-[var(--main-color)] flex items-center justify-center">
              <KeyboardIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-[var(--text-color)]">
              {language === 'am' ? 'የኪቦርድ አቀማመጥ (Layout):' : 'Amharic Keyboard Mapping:'}
            </span>

            {/* Layout Dropdown Selector */}
            <div className="relative">
              <select
                value={activeLayout}
                onChange={(e) => onSelectLayout(e.target.value)}
                className="bg-[var(--sub-alt-color)] border border-[var(--border-color)] hover:border-[var(--main-color)] text-[var(--main-color)] font-medium rounded-xl px-2.5 py-1 text-xs outline-none cursor-pointer pr-6 appearance-none transition-colors"
              >
                {Object.values(KEYBOARD_LAYOUT_INFO).map((info) => (
                  <option key={info.id} value={info.id} className="bg-[var(--surface-color)] text-[var(--text-color)]">
                    {language === 'am' ? info.name : info.nameEn}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--sub-color)] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Shift Indicator */}
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-colors ${isShiftActive ? 'bg-amber-500 text-black font-bold border-amber-500' : 'bg-[var(--sub-alt-color)] text-[var(--sub-color)] border-[var(--border-color)]'}`}>
              Shift {isShiftActive ? 'ON' : 'OFF'}
            </span>

            {/* Collapse/Expand Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors"
              title={isCollapsed ? 'Show Keyboard' : 'Hide Keyboard'}
            >
              {isCollapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Fidel Order Matrix Ribbon (when a consonant is active) */}
        {!isCollapsed && activeFamilyLetters && (
          <div className="mb-3 p-2 rounded-xl bg-[color-mix(in_srgb,var(--bg-color)_70%,transparent)] border border-amber-500/30 flex items-center justify-between text-xs font-mono animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-[var(--main-color)] text-[11px] font-sans font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'am' ? 'የፊደል ረድፎች (Orders):' : 'Vowel Orders:'}</span>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto">
              {[
                { order: '1ኛ', key: '+ e', fidel: activeFamilyLetters[0] },
                { order: '2ኛ', key: '+ u', fidel: activeFamilyLetters[1] },
                { order: '3ኛ', key: '+ i', fidel: activeFamilyLetters[2] },
                { order: '4ኛ', key: '+ a', fidel: activeFamilyLetters[3] },
                { order: '5ኛ', key: '+ E', fidel: activeFamilyLetters[4] },
                { order: '6ኛ', key: 'alone', fidel: activeFamilyLetters[5] },
                { order: '7ኛ', key: '+ o', fidel: activeFamilyLetters[6] },
                { order: '8ኛ', key: '+ wa', fidel: activeFamilyLetters[7] || activeFamilyLetters[3] },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center px-1.5 py-0.5 rounded bg-[var(--surface-color)] border border-[var(--border-color)]">
                  <span className="text-sm font-bold text-[var(--text-color)]">{item.fidel}</span>
                  <span className="text-[9px] text-[var(--sub-color)]">{item.key}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Keyboard Keycaps Grid */}
        {!isCollapsed && (
          <div className="space-y-1.5 font-mono text-center">
            
            {/* Row 1: Q W E R T Y U I O P */}
            <div className="flex justify-center gap-1 sm:gap-1.5">
              {row1.map((k) => renderKeycap(k, keycaps[k], lastPressedKey, isShiftActive, onKeyClick))}
            </div>

            {/* Row 2: A S D F G H J K L */}
            <div className="flex justify-center gap-1 sm:gap-1.5 px-3">
              {row2.map((k) => renderKeycap(k, keycaps[k], lastPressedKey, isShiftActive, onKeyClick))}
            </div>

            {/* Row 3: Z X C V B N M */}
            <div className="flex justify-center gap-1 sm:gap-1.5 px-6">
              {row3.map((k) => renderKeycap(k, keycaps[k], lastPressedKey, isShiftActive, onKeyClick))}
            </div>

            {/* Space bar and punctuation row */}
            <div className="flex justify-center items-center gap-2 pt-1 text-xs">
              <div className="px-3 py-1 rounded-lg bg-[var(--sub-alt-color)] border border-[var(--border-color)] text-[var(--sub-color)] text-[10px]">
                <kbd className="text-[var(--text-color)] font-bold">::</kbd> = ።
              </div>
              <div className="px-3 py-1 rounded-lg bg-[var(--sub-alt-color)] border border-[var(--border-color)] text-[var(--sub-color)] text-[10px]">
                <kbd className="text-[var(--text-color)] font-bold">,</kbd> = ፣
              </div>
              <div className="px-16 sm:px-24 py-1.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--border-color)] text-[var(--sub-color)] text-[10px] tracking-widest font-sans">
                SPACE
              </div>
              <div className="px-3 py-1 rounded-lg bg-[var(--sub-alt-color)] border border-[var(--border-color)] text-[var(--sub-color)] text-[10px]">
                <kbd className="text-[var(--text-color)] font-bold">;</kbd> = ፤
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// Render individual keycap
function renderKeycap(k, cap, lastPressedKey, isShiftActive, onKeyClick) {
  if (!cap) {
    return (
      <div key={k} className="w-8 sm:w-11 h-12 rounded-xl bg-[color-mix(in_srgb,var(--sub-alt-color)_40%,transparent)] border border-[color-mix(in_srgb,var(--border-color)_60%,transparent)] flex items-center justify-center text-xs text-[var(--sub-color)]">
        {k.toUpperCase()}
      </div>
    );
  }

  const isPressed = lastPressedKey && lastPressedKey.toLowerCase() === k;
  const displayFidel = isShiftActive && cap.shift ? cap.shift : cap.base;

  return (
    <button
      key={k}
      type="button"
      onClick={() => onKeyClick && onKeyClick(k)}
      className={`relative w-8 sm:w-11 h-12 rounded-xl flex flex-col items-center justify-between p-1 border transition-all duration-75 cursor-pointer shadow-sm ${
        isPressed 
          ? 'bg-[var(--main-color)] border-[var(--main-color)] text-black scale-95 shadow-md shadow-amber-500/20' 
          : cap.isVowel
            ? 'bg-amber-500/10 border-amber-500/25 hover:border-amber-500/50 text-[var(--text-color)]'
            : 'bg-[var(--surface-color)] border-[var(--border-color)] hover:border-[var(--main-color)] text-[var(--text-color)]'
      }`}
    >
      {/* Shift Fidel (top-left) */}
      <span className={`text-[9px] self-start leading-none opacity-60 font-sans ${isShiftActive ? 'text-[var(--main-color)] font-bold opacity-100' : ''}`}>
        {cap.shift || ''}
      </span>

      {/* Main Fidel Character (center) */}
      <span className={`text-sm sm:text-base font-bold font-["Noto_Sans_Ethiopic",_sans-serif] leading-tight ${isPressed ? 'text-black' : 'text-[var(--main-color)]'}`}>
        {displayFidel}
      </span>

      {/* Physical Latin Letter (bottom-right) */}
      <span className={`text-[9px] self-end leading-none font-mono ${isPressed ? 'text-black' : 'text-[var(--sub-color)]'}`}>
        {k.toUpperCase()}
      </span>
    </button>
  );
}
