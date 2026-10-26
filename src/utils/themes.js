export const THEMES = {
  tewahedo: {
    id: 'tewahedo',
    name: 'ወርቀ ተዋሕዶ (Tewahedo Gold)',
    description: 'የጥንታዊት ኦርቶዶክስ ተዋሕዶ ወርቃማ እና ጥቁር ግርማ',
    colors: {
      bg: '#121214',
      surface: '#1c1c20',
      subAlt: '#27272e',
      sub: '#78716c',
      text: '#fafaf9',
      main: '#f59e0b',       // Warm Amber Gold
      mainAlt: '#d97706',
      caret: '#f59e0b',
      error: '#ef4444',
      errorExtra: '#991b1b',
      border: '#38363c',
    }
  },
  birana: {
    id: 'birana',
    name: 'ብራና (Birana Parchment)',
    description: 'የጥንት የብራና መጻሕፍትና ቀለም ወግ',
    isLight: true,
    colors: {
      bg: '#f8f4eb',
      surface: '#eee7d7',
      subAlt: '#e2d8c3',
      sub: '#8a7d6b',
      text: '#221c17',       // Dark iron-gall ink
      main: '#9a3412',       // Traditional Red Rubric Ink
      mainAlt: '#b45309',
      caret: '#9a3412',
      error: '#dc2626',
      errorExtra: '#ef4444',
      border: '#d6c8b0',
    }
  },
  lalibela: {
    id: 'lalibela',
    name: 'ላሊበላ (Lalibela Rock)',
    description: 'የአለቱ ውቅርና የማዕድን ቀለማት ድባብ',
    colors: {
      bg: '#1c1917',
      surface: '#292524',
      subAlt: '#44403c',
      sub: '#78716c',
      text: '#f5f5f4',
      main: '#eab308',       // Ochre Gold
      mainAlt: '#ca8a04',
      caret: '#eab308',
      error: '#f87171',
      errorExtra: '#b91c1c',
      border: '#57534e',
    }
  },
  carbon: {
    id: 'carbon',
    name: 'ካርቦን (Monkeytype Carbon)',
    description: 'የታዋቂው Monkeytype ጥቁርና ቢጫ ዝነኛ መልክ',
    colors: {
      bg: '#2e3034',
      surface: '#36393e',
      subAlt: '#44474d',
      sub: '#646669',
      text: '#d1d0c5',
      main: '#e2b714',
      mainAlt: '#c9a10e',
      caret: '#e2b714',
      error: '#ca4754',
      errorExtra: '#7e2a33',
      border: '#4e5157',
    }
  },
  axum: {
    id: 'axum',
    name: 'አክሱም (Midnight Axum)',
    description: 'የጥንታዊቷ አክሱም የሌሊት ሰማይና የሐውልት ጥላ',
    colors: {
      bg: '#090d16',
      surface: '#111827',
      subAlt: '#1f2937',
      sub: '#6b7280',
      text: '#f3f4f6',
      main: '#06b6d4',       // Starlight Cyan
      mainAlt: '#0891b2',
      caret: '#38bdf8',
      error: '#f43f5e',
      errorExtra: '#9f1239',
      border: '#374151',
    }
  },
  garima: {
    id: 'garima',
    name: 'አባ ገርማ (Garima Gospels)',
    description: 'የዓለማችን ጥንታዊ ወንጌል የተጠበቀበት የደብር ጥልቀት',
    colors: {
      bg: '#0c1713',
      surface: '#142720',
      subAlt: '#1b382d',
      sub: '#5f7d71',
      text: '#e6f0ec',
      main: '#10b981',       // Monastery Emerald
      mainAlt: '#059669',
      caret: '#34d399',
      error: '#ef4444',
      errorExtra: '#991b1b',
      border: '#274b3d',
    }
  },
  serika_dark: {
    id: 'serika_dark',
    name: 'ሴሪካ (Serika Dark)',
    description: 'ሙቅ ግራጫና ወርቃማ ንፅፅር',
    colors: {
      bg: '#1e1f22',
      surface: '#2b2d31',
      subAlt: '#383a40',
      sub: '#747780',
      text: '#e3e5e8',
      main: '#facc15',
      mainAlt: '#eab308',
      caret: '#facc15',
      error: '#da3333',
      errorExtra: '#792424',
      border: '#404249',
    }
  }
};

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.tewahedo;
  const root = document.documentElement;
  
  if (theme.isLight) {
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
  }

  root.style.setProperty('--bg-color', theme.colors.bg);
  root.style.setProperty('--surface-color', theme.colors.surface);
  root.style.setProperty('--sub-alt-color', theme.colors.subAlt);
  root.style.setProperty('--sub-color', theme.colors.sub);
  root.style.setProperty('--text-color', theme.colors.text);
  root.style.setProperty('--main-color', theme.colors.main);
  root.style.setProperty('--main-alt-color', theme.colors.mainAlt);
  root.style.setProperty('--caret-color', theme.colors.caret);
  root.style.setProperty('--error-color', theme.colors.error);
  root.style.setProperty('--error-extra-color', theme.colors.errorExtra);
  root.style.setProperty('--border-color', theme.colors.border);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', theme.colors.bg);
}
