// Comprehensive Ethiopian Ge'ez / Amharic Keyboard Mappings & Transliteration Engine
// Supports PowerGe'ez, Keyman / SIL Unicode, and Ethiopian National Standard ES 784

export const KEYBOARD_LAYOUT_INFO = {
  powergeez: {
    id: 'powergeez',
    name: 'ፓወር ግዕዝ (PowerGe\'ez)',
    nameEn: 'PowerGe\'ez Phonetic',
    description: 'በኢትዮጵያ ውስጥ በስፋት የሚታወቀው የShift እና የድምፅ ውህድ (h=ሀ, H=ሐ, s=ሰ, S=ሠ, a=አ, A=ዐ, T=ጠ, C=ጨ)',
    descriptionEn: 'Shift & Phonetic standard widely used in Ethiopia (h=ሀ, H=ሐ, s=ሰ, S=ሠ, a=አ, A=ዐ, T=ጠ, C=ጨ)',
  },
  keyman: {
    id: 'keyman',
    name: 'ኪይማን / ዩኒኮድ (Keyman / SIL)',
    nameEn: 'Keyman / SIL Unicode',
    description: 'ዓለም አቀፉ የቋንቋዎች የዩኒኮድ ስታንዳርድ (sh=ሸ, ch=ቸ, ny/gn=ኘ, ts=ጸ, tz=ፀ, hh=ሐ, sz=ሠ, zh=ዥ)',
    descriptionEn: 'International Unicode SIL standard (sh=ሸ, ch=ቸ, ny/gn=ኘ, ts=ጸ, tz=ፀ, hh=ሐ, sz=ሠ, zh=ዥ)',
  },
  standard: {
    id: 'standard',
    name: 'የኢትዮጵያ ስታንዳርድ (ES 784:2001)',
    nameEn: 'Ethiopian Standard (ES 784)',
    description: 'የኢትዮጵያ ደረጃዎች ኤጀንሲ ያፀደቀው የብሔራዊ ኪቦርድ ስልት',
    descriptionEn: 'National Ethiopian Standard Layout approved by QSAE',
  },
  direct: {
    id: 'direct',
    name: 'የኮምፒውተር ቀጥታ (Direct OS IME)',
    nameEn: 'Direct Native Keyboard',
    description: 'በኮምፒውተርዎ ላይ የተጫነውን የአማርኛ ኪቦርድ (Windows/Mac IME) በቀጥታ ለመጠቀም',
    descriptionEn: 'Pass-through for users with an Amharic keyboard already installed on their OS',
  }
};

// Full Fidel Matrix (Orders 1 to 8: ግዕዝ, ካዕብ, ሣልስ, ራብዕ, ኃምስ, ሳድስ, ሳብዕ, ሳምንት/ዋ)
export const FIDEL_FAMILIES = {
  // ሀ family
  'ha': ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ', 'ኋ'],
  // ለ family
  'la': ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ', 'ሏ'],
  // ሐ family
  'hha': ['ሐ', 'ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ', 'ሗ'],
  // መ family
  'ma': ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ', 'ሟ'],
  // ሠ family
  'sza': ['ሠ', 'ሡ', 'ሢ', 'ሣ', 'ሤ', 'ሥ', 'ሦ', 'ሧ'],
  // ረ family
  'ra': ['ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ', 'ሯ'],
  // ሰ family
  'sa': ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ', 'ሷ'],
  // ሸ family
  'sha': ['ሸ', 'ሹ', 'ሺ', 'ሻ', 'ሼ', 'ሽ', 'ሾ', 'ሿ'],
  // ቀ family
  'qa': ['ቀ', 'ቁ', 'ቂ', 'ቃ', 'ቄ', 'ቅ', 'ቆ', 'ቋ'],
  // በ family
  'ba': ['በ', 'ቡ', 'ቢ', 'ባ', 'ቤ', 'ብ', 'ቦ', 'ቧ'],
  // ቨ family
  'va': ['ቨ', 'ቩ', 'ቪ', 'ቫ', 'ቬ', 'ቭ', 'ቮ', 'ቯ'],
  // ተ family
  'ta': ['ተ', 'ቱ', 'ቲ', 'ታ', 'ቴ', 'ት', 'ቶ', 'ቷ'],
  // ቸ family
  'cha': ['ቸ', 'ቹ', 'ቺ', 'ቻ', 'ቼ', 'ች', 'ቾ', 'ቿ'],
  // ኀ family
  'xa': ['ኀ', 'ኁ', 'ኂ', 'ኃ', 'ኄ', 'ኅ', 'ኆ', 'ኋ'],
  // ነ family
  'na': ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ', 'ኗ'],
  // ኘ family
  'nya': ['ኘ', 'ኙ', 'ኚ', 'ኛ', 'ኜ', 'ኝ', 'ኞ', 'ኟ'],
  // አ family
  'a': ['አ', 'ኡ', 'ኢ', 'ኣ', 'ኤ', 'እ', 'ኦ', 'ኧ'],
  // ከ family
  'ka': ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ', 'ኳ'],
  // ኸ family
  'kha': ['ኸ', 'ኹ', 'ኺ', 'ኻ', 'ኼ', 'ኽ', 'ኾ', 'ዃ'],
  // ወ family
  'wa': ['ወ', 'ዉ', 'ዊ', 'ዋ', 'ዌ', 'ው', 'ዎ', 'ኧ'],
  // ዐ family
  'Aa': ['ዐ', 'ዑ', 'ዒ', 'ዓ', 'ዔ', 'ዕ', 'ዖ', 'ዐ'],
  // ዘ family
  'za': ['ዘ', 'ዙ', 'ዚ', 'ዛ', 'ዜ', 'ዝ', 'ዞ', 'ዟ'],
  // ዠ family
  'zha': ['ዠ', 'ዡ', 'ዢ', 'ዣ', 'ዤ', 'ዥ', 'ዦ', 'ዧ'],
  // የ family
  'ya': ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ', 'የ'],
  // ደ family
  'da': ['ደ', 'ዱ', 'ዲ', 'ዳ', 'ዴ', 'ድ', 'ዶ', 'ዷ'],
  // ጀ family
  'ja': ['ጀ', 'ጁ', 'ጂ', 'ጃ', 'ጄ', 'ጅ', 'ጆ', 'ጇ'],
  // ገ family
  'ga': ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ', 'ጓ'],
  // ጠ family
  'Ta': ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ', 'ጧ'],
  // ጨ family
  'Ca': ['ጨ', 'ጩ', 'ጪ', 'ጫ', 'ጬ', 'ጭ', 'ጮ', 'ቿ'],
  // ጰ family
  'Pa': ['ጰ', 'ጱ', 'ጲ', 'ጳ', 'ጴ', 'ጵ', 'ጶ', 'ጷ'],
  // ጸ family
  'tsa': ['ጸ', 'ጹ', 'ጺ', 'ጻ', 'ጼ', 'ጽ', 'ጾ', 'ጿ'],
  // ፀ family
  'tza': ['ፀ', 'ፁ', 'ፂ', 'ፃ', 'ፄ', 'ፅ', 'ፆ', 'ጿ'],
  // ፈ family
  'fa': ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ', 'ፏ'],
  // ፐ family
  'pa': ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ', 'ፗ']
};

export const FIDEL_MAP = FIDEL_FAMILIES;

// Labialised forms reached with consonant + W + vowel (qWe = ቈ, qWu = ቍ ...)
const LABIAL_FORMS = {
  qa: { e: 'ቈ', i: 'ቊ', a: 'ቋ', E: 'ቌ', u: 'ቍ' },
  ka: { e: 'ኰ', i: 'ኲ', a: 'ኳ', E: 'ኴ', u: 'ኵ' },
  ga: { e: 'ጐ', i: 'ጒ', a: 'ጓ', E: 'ጔ', u: 'ጕ' },
  xa: { e: 'ኈ', i: 'ኊ', a: 'ኋ', E: 'ኌ', u: 'ኍ' },
};

// PowerGe'ez Consonant Table
const POWERGEEZ_CONSONANTS = {
  'h': 'ha',
  'H': 'hha',
  'x': 'xa',
  'X': 'xa',
  'l': 'la',
  'm': 'ma',
  's': 'sa',
  'S': 'sza',
  'r': 'ra',
  'q': 'qa',
  'b': 'ba',
  'v': 'va',
  't': 'ta',
  'T': 'Ta',
  'c': 'cha',
  'C': 'Ca',
  'n': 'na',
  'N': 'nya',
  'a': 'a',
  'A': 'Aa',
  'k': 'ka',
  'K': 'kha',
  'w': 'wa',
  'z': 'za',
  'Z': 'zha',
  'y': 'ya',
  'd': 'da',
  'j': 'ja',
  'g': 'ga',
  'p': 'pa',
  'P': 'Pa',
  'f': 'fa',
};

// Keyman / SIL Consonant Table
const KEYMAN_CONSONANTS = {
  'h': 'ha',
  'hh': 'hha',
  'x': 'xa',
  'l': 'la',
  'm': 'ma',
  's': 'sa',
  'sz': 'sza',
  'sh': 'sha',
  'r': 'ra',
  'q': 'qa',
  'b': 'ba',
  'v': 'va',
  't': 'ta',
  'T': 'Ta',
  'c': 'cha',
  'ch': 'cha',
  'C': 'Ca',
  'n': 'na',
  'ny': 'nya',
  'gn': 'nya',
  'a': 'a',
  'A': 'Aa',
  'k': 'ka',
  'kh': 'kha',
  'w': 'wa',
  'z': 'za',
  'zh': 'zha',
  'y': 'ya',
  'd': 'da',
  'j': 'ja',
  'g': 'ga',
  'p': 'pa',
  'P': 'Pa',
  'ts': 'tsa',
  'tz': 'tza',
  'f': 'fa',
};

// Visual Keycap Definitions for QWERTY On-Screen Keyboard
export const KEYBOARD_KEYCAPS = {
  powergeez: {
    'q': { base: 'ቀ', shift: 'ቅ', family: 'qa' },
    'w': { base: 'ወ', shift: 'ው', family: 'wa' },
    'e': { base: 'ኧ', shift: 'እ', isVowel: true, vowel: 'e' },
    'r': { base: 'ረ', shift: 'ር', family: 'ra' },
    't': { base: 'ተ', shift: 'ጠ', family: 'ta', shiftFamily: 'Ta' },
    'y': { base: 'የ', shift: 'ይ', family: 'ya' },
    'u': { base: 'ኡ', shift: 'ዑ', isVowel: true, vowel: 'u' },
    'i': { base: 'ኢ', shift: 'ዒ', isVowel: true, vowel: 'i' },
    'o': { base: 'ኦ', shift: 'ዖ', isVowel: true, vowel: 'o' },
    'p': { base: 'ፐ', shift: 'ጰ', family: 'pa', shiftFamily: 'Pa' },
    'a': { base: 'አ', shift: 'ዐ', family: 'a', shiftFamily: 'Aa' },
    's': { base: 'ሰ', shift: 'ሠ', family: 'sa', shiftFamily: 'sza' },
    'd': { base: 'ደ', shift: 'ድ', family: 'da' },
    'f': { base: 'ፈ', shift: 'ፍ', family: 'fa' },
    'g': { base: 'ገ', shift: 'ግ', family: 'ga' },
    'h': { base: 'ሀ', shift: 'ሐ', family: 'ha', shiftFamily: 'hha' },
    'j': { base: 'ጀ', shift: 'ጅ', family: 'ja' },
    'k': { base: 'ከ', shift: 'ኸ', family: 'ka', shiftFamily: 'kha' },
    'l': { base: 'ለ', shift: 'ል', family: 'la' },
    'z': { base: 'ዘ', shift: 'ዠ', family: 'za', shiftFamily: 'zha' },
    'x': { base: 'ኀ', shift: 'ኅ', family: 'xa' },
    'c': { base: 'ቸ', shift: 'ጨ', family: 'cha', shiftFamily: 'Ca' },
    'v': { base: 'ቨ', shift: 'ቭ', family: 'va' },
    'b': { base: 'በ', shift: 'ብ', family: 'ba' },
    'n': { base: 'ነ', shift: 'ኘ', family: 'na', shiftFamily: 'nya' },
    'm': { base: 'መ', shift: 'ም', family: 'ma' },
  },
  keyman: {
    'q': { base: 'ቀ', shift: 'ቅ', family: 'qa' },
    'w': { base: 'ወ', shift: 'ው', family: 'wa' },
    'e': { base: 'ኧ', shift: 'እ', isVowel: true, vowel: 'e' },
    'r': { base: 'ረ', shift: 'ር', family: 'ra' },
    't': { base: 'ተ', shift: 'ጠ', family: 'ta', shiftFamily: 'Ta' },
    'y': { base: 'የ', shift: 'ይ', family: 'ya' },
    'u': { base: 'ኡ', shift: 'ዑ', isVowel: true, vowel: 'u' },
    'i': { base: 'ኢ', shift: 'ዒ', isVowel: true, vowel: 'i' },
    'o': { base: 'ኦ', shift: 'ዖ', isVowel: true, vowel: 'o' },
    'p': { base: 'ፐ', shift: 'ጰ', family: 'pa', shiftFamily: 'Pa' },
    'a': { base: 'አ', shift: 'ዐ', family: 'a', shiftFamily: 'Aa' },
    's': { base: 'ሰ', shift: 'ሽ', family: 'sa', shiftFamily: 'sha' },
    'd': { base: 'ደ', shift: 'ድ', family: 'da' },
    'f': { base: 'ፈ', shift: 'ፍ', family: 'fa' },
    'g': { base: 'ገ', shift: 'ግ', family: 'ga' },
    'h': { base: 'ሀ', shift: 'ሐ', family: 'ha', shiftFamily: 'hha' },
    'j': { base: 'ጀ', shift: 'ጅ', family: 'ja' },
    'k': { base: 'ከ', shift: 'ኸ', family: 'ka', shiftFamily: 'kha' },
    'l': { base: 'ለ', shift: 'ል', family: 'la' },
    'z': { base: 'ዘ', shift: 'ዥ', family: 'za', shiftFamily: 'zha' },
    'x': { base: 'ኀ', shift: 'ኅ', family: 'xa' },
    'c': { base: 'ቸ', shift: 'ጨ', family: 'cha', shiftFamily: 'Ca' },
    'v': { base: 'ቨ', shift: 'ቭ', family: 'va' },
    'b': { base: 'በ', shift: 'ብ', family: 'ba' },
    'n': { base: 'ነ', shift: 'ኘ', family: 'na', shiftFamily: 'nya' },
    'm': { base: 'መ', shift: 'ም', family: 'ma' },
  }
};

/**
 * Multi-Layout Ethiopic Phonetic Engine
 */
export class EthiopicPhoneticEngine {
  constructor(layout = 'powergeez') {
    this.layout = layout;
    this.buffer = '';
    this.activeFamily = null;
  }

  clone() {
    const copy = new EthiopicPhoneticEngine(this.layout);
    copy.buffer = this.buffer;
    copy.activeFamily = this.activeFamily;
    copy.pendingWa = this.pendingWa;
    return copy;
  }

  hasPending() {
    return Boolean(this.buffer || this.pendingWa);
  }

  setLayout(layout) {
    this.layout = layout;
    this.reset();
  }

  reset() {
    this.buffer = '';
    this.activeFamily = null;
    this.pendingWa = null;
  }

  processKey(key) {
    if (this.layout === 'direct') {
      return { output: key, replaceLength: 0 };
    }

    if (key === ' ' || key === 'Enter') {
      this.reset();
      return { output: key, replaceLength: 0 };
    }

    // Apostrophe separates letters that would otherwise merge
    // (c'hu = ችሁ rather than ቹ); it produces no text itself.
    if (key === "'") {
      this.reset();
      return { output: '', replaceLength: 0 };
    }

    // Ethiopic punctuation: works after any letter, not only at a word start.
    //   :  ፡   ::  ።   :-  ፥   ;  ፤   ,  ፣
    if (key === ':') {
      if (this.buffer === ':') {
        this.reset();
        return { output: '።', replaceLength: 1 };
      }
      this.reset();
      this.buffer = ':';
      return { output: '፡', replaceLength: 0 };
    }
    if (key === '-' && this.buffer === ':') {
      this.reset();
      return { output: '፥', replaceLength: 1 };
    }
    if (key === ';') { this.reset(); return { output: '፤', replaceLength: 0 }; }
    if (key === ',') { this.reset(); return { output: '፣', replaceLength: 0 }; }

    // Labialised 8th order is consonant + "Wa" (e.g. qWa = ቋ); "W" already
    // produced the letter, so a trailing "a" just confirms it and q/k/g/x
    // take their other labialised vowels (qWe = ቈ, qWu = ቍ).
    if (this.pendingWa) {
      const { letter, family } = this.pendingWa;
      this.reset();
      const labial = LABIAL_FORMS[family]?.[key];
      if (labial) return { output: labial, replaceLength: 1 };
      if (key === 'a') return { output: letter, replaceLength: 1 };
    }

    if (this.layout === 'powergeez') {
      return this.processPowerGeez(key);
    } else {
      return this.processKeyman(key);
    }
  }

  processPowerGeez(key) {
    // Check two-letter specials like 'ts', 'tz', 'sh', 'ch'
    const testBuf = this.buffer + key;

    if (testBuf === 'ts') {
      this.buffer = 'ts';
      this.activeFamily = 'tsa';
      return { output: FIDEL_FAMILIES['tsa'][5], replaceLength: 1 };
    }
    if (testBuf === 'tz') {
      this.buffer = 'tz';
      this.activeFamily = 'tza';
      return { output: FIDEL_FAMILIES['tza'][5], replaceLength: 1 };
    }
    if (testBuf === 'sh') {
      this.buffer = 'sh';
      this.activeFamily = 'sha';
      return { output: FIDEL_FAMILIES['sha'][5], replaceLength: 1 };
    }
    if (testBuf === 'ch') {
      this.buffer = 'ch';
      this.activeFamily = 'cha';
      return { output: FIDEL_FAMILIES['cha'][5], replaceLength: 1 };
    }

    // Check if buffer has a consonant family and current key is a vowel
    if (this.activeFamily) {
      const resolved = this.resolveVowel(this.activeFamily, key);
      if (resolved) {
        const family = this.activeFamily;
        this.reset();
        if (key === 'W') this.pendingWa = { letter: resolved, family };
        return { output: resolved, replaceLength: 1 };
      }
    }

    // New consonant key
    const familyKey = POWERGEEZ_CONSONANTS[key];
    if (familyKey) {
      this.buffer = key;
      this.activeFamily = familyKey;
      // Output 6th order consonant (ሳድስ) immediately
      return { output: FIDEL_FAMILIES[familyKey][5], replaceLength: 0 };
    }

    // Standalone vowel pressed without preceding consonant
    if (key === 'e') { this.reset(); return { output: 'እ', replaceLength: 0 }; }
    if (key === 'u') { this.reset(); return { output: 'ኡ', replaceLength: 0 }; }
    if (key === 'i') { this.reset(); return { output: 'ኢ', replaceLength: 0 }; }
    if (key === 'a') { this.reset(); return { output: 'ኣ', replaceLength: 0 }; }
    if (key === 'E') { this.reset(); return { output: 'ኤ', replaceLength: 0 }; }
    if (key === 'o') { this.reset(); return { output: 'ኦ', replaceLength: 0 }; }

    this.reset();
    return { output: key, replaceLength: 0 };
  }

  processKeyman(key) {
    const testBuf = this.buffer + key;

    // Check multi-letter consonants in Keyman
    const multiKeys = ['sh', 'ch', 'ny', 'gn', 'hh', 'sz', 'zh', 'ts', 'tz', 'kh'];
    for (const prefix of multiKeys) {
      if (testBuf === prefix) {
        this.buffer = prefix;
        this.activeFamily = KEYMAN_CONSONANTS[prefix];
        return { output: FIDEL_FAMILIES[this.activeFamily][5], replaceLength: 1 };
      }
    }

    // If active consonant family exists, resolve vowel
    if (this.activeFamily) {
      const resolved = this.resolveVowel(this.activeFamily, key);
      if (resolved) {
        const family = this.activeFamily;
        this.reset();
        if (key === 'W') this.pendingWa = { letter: resolved, family };
        return { output: resolved, replaceLength: 1 };
      }
    }

    // Single consonant key
    const familyKey = KEYMAN_CONSONANTS[key];
    if (familyKey) {
      this.buffer = key;
      this.activeFamily = familyKey;
      return { output: FIDEL_FAMILIES[familyKey][5], replaceLength: 0 };
    }

    this.reset();
    return { output: key, replaceLength: 0 };
  }

  resolveVowel(familyKey, vowelKey) {
    const family = FIDEL_FAMILIES[familyKey];
    if (!family) return null;

    if (vowelKey === 'e') return family[0]; // 1st order (ግዕዝ)
    if (vowelKey === 'u') return family[1]; // 2nd order (ካዕብ)
    if (vowelKey === 'i') return family[2]; // 3rd order (ሣልስ)
    if (vowelKey === 'a') return family[3]; // 4th order (ራብዕ)
    if (vowelKey === 'E' || vowelKey === 'e') return family[4]; // 5th order (ኃምስ)
    if (vowelKey === 'o') return family[6]; // 7th order (ሳብዕ)
    if (vowelKey === 'W' && family[7] && family[7] !== family[0]) return family[7]; // 8th order (ዋ)

    return null;
  }
}

// Run a key sequence through a fresh engine and return the text it produces.
export function simulateKeys(layout, keys) {
  const engine = new EthiopicPhoneticEngine(layout);
  let out = '';
  for (const key of keys) {
    const res = engine.processKey(key);
    out = out.slice(0, out.length - res.replaceLength) + res.output;
  }
  return out;
}

const SEQUENCE_ALPHABET = 'aeiouEbcdfghjklmnpqrstvwxyzABCDFGHIJKLMNOPQRSTUVWXYZ:-;,?!0123456789';
const sequenceCache = {};

/**
 * Reverse map { character: shortest key sequence } for a layout, derived by
 * driving the real engine so hints can never drift from actual behaviour.
 */
export function getKeySequences(layout = 'powergeez') {
  if (layout === 'direct') return {};
  if (sequenceCache[layout]) return sequenceCache[layout];

  const map = {};
  let frontier = [''];
  for (let len = 1; len <= 4; len++) {
    const next = [];
    for (const prefix of frontier) {
      for (const key of SEQUENCE_ALPHABET) {
        const seq = prefix + key;
        const out = simulateKeys(layout, seq);
        if (out.length !== 1) continue;
        if (!(out in map)) map[out] = seq;
        next.push(seq);
      }
    }
    frontier = next;
  }
  sequenceCache[layout] = map;
  return map;
}

function applyKeys(engine, text, keys) {
  let out = text;
  for (const key of keys) {
    const res = engine.processKey(key);
    out = out.slice(0, out.length - res.replaceLength) + res.output;
  }
  return out;
}

/**
 * What to press next to keep typing `targetWord`, given the engine's live
 * state and what is already in the input. Returns one of:
 *   { type: 'char', char, keys, typed }  keys still to press (typed = already pressed)
 *   { type: 'space' } | { type: 'backspace' } | null
 */
export function getNextKeyHint(engine, layout, input, targetWord) {
  if (!targetWord || layout === 'direct') return null;
  const map = getKeySequences(layout);
  const last = input.length - 1;

  // Mid-composition: last letter is a prefix of the wanted one (s → ስ, want ሳ)
  if (last >= 0 && engine.hasPending() && input[last] !== targetWord[last]
      && input.slice(0, last) === targetWord.slice(0, last)) {
    const want = targetWord.slice(0, last + 1);
    let frontier = [''];
    for (let depth = 1; depth <= 2; depth++) {
      const next = [];
      for (const prefix of frontier) {
        for (const key of SEQUENCE_ALPHABET) {
          const cont = prefix + key;
          if (applyKeys(engine.clone(), input, cont) === want) {
            const full = map[targetWord[last]] || cont;
            const typed = full.endsWith(cont) ? full.slice(0, full.length - cont.length) : '';
            return { type: 'char', char: targetWord[last], keys: cont, typed, composing: true };
          }
          next.push(cont);
        }
      }
      frontier = next;
    }
  }

  if (input !== targetWord.slice(0, input.length)) return { type: 'backspace' };
  if (input.length >= targetWord.length) return { type: 'space' };

  const char = targetWord[input.length];
  let keys = map[char] || char;
  if (applyKeys(engine.clone(), input, keys) !== input + char) keys = "'" + keys;
  return { type: 'char', char, keys, typed: '' };
}

// Punctuation & symbols shown in the keyboard legend
export const SYMBOL_KEYS = [
  { char: '፡', keys: ':', nameEn: 'word space', nameAm: 'ሁለት ነጥብ' },
  { char: '።', keys: '::', nameEn: 'full stop', nameAm: 'አራት ነጥብ' },
  { char: '፥', keys: ':-', nameEn: 'colon', nameAm: 'ነጠላ ሰረዝ' },
  { char: '፤', keys: ';', nameEn: 'semicolon', nameAm: 'ድርብ ሰረዝ' },
  { char: '፣', keys: ',', nameEn: 'comma', nameAm: 'ነጠላ ሰረዝ' },
  { char: '?', keys: '?', nameEn: 'question', nameAm: 'ጥያቄ' },
  { char: '!', keys: '!', nameEn: 'exclamation', nameAm: 'ቃለ አጋኖ' },
];
