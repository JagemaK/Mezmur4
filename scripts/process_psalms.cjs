const fs = require('fs');
const path = require('path');

function toGeez(num) {
  if (num <= 0) return '';
  const digits = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
  const tens = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
  if (num === 100) return '፻';
  if (num < 10) return digits[num];
  if (num < 100) {
    const t = Math.floor(num / 10);
    const d = num % 10;
    return tens[t] + digits[d];
  }
  if (num <= 199) {
    const rem = num - 100;
    if (rem === 0) return '፻';
    const t = Math.floor(rem / 10);
    const d = num % 10;
    return '፻' + tens[t] + digits[d];
  }
  return num.toString();
}

function getLiturgicalDay(chapterNum) {
  if (chapterNum >= 1 && chapterNum <= 30) return { dayIndex: 1, nameAm: 'ሰኞ', nameEn: 'Monday', range: '1 - 30' };
  if (chapterNum >= 31 && chapterNum <= 60) return { dayIndex: 2, nameAm: 'ማክሰኞ', nameEn: 'Tuesday', range: '31 - 60' };
  if (chapterNum >= 61 && chapterNum <= 80) return { dayIndex: 3, nameAm: 'ረቡዕ', nameEn: 'Wednesday', range: '61 - 80' };
  if (chapterNum >= 81 && chapterNum <= 110) return { dayIndex: 4, nameAm: 'ሐሙስ', nameEn: 'Thursday', range: '81 - 110' };
  if (chapterNum >= 111 && chapterNum <= 130) return { dayIndex: 5, nameAm: 'ዓርብ', nameEn: 'Friday', range: '111 - 130' };
  if (chapterNum >= 131 && chapterNum <= 151) return { dayIndex: 6, nameAm: 'ቅዳሜ', nameEn: 'Saturday', range: '131 - 151' };
  return { dayIndex: 0, nameAm: 'እሑድ', nameEn: 'Sunday', range: 'መዝሙረ ነቢያት' };
}

// Well-known spiritual themes for popular Psalms in Ethiopian Orthodox tradition
const psalmThemes = {
  1: { themeAm: 'የጻድቅና የክፉ ሰው መንገድ', themeEn: 'The Way of the Righteous and the Ungodly', popular: true },
  23: { themeAm: 'እግዚአብሔር እረኛዬ ነው', themeEn: 'The Lord is My Shepherd', popular: true },
  27: { themeAm: 'እግዚአብሔር ብርሃኔና መድኃኒቴ ነው', themeEn: 'The Lord is My Light and My Salvation', popular: true },
  34: { themeAm: 'እግዚአብሔርን ሁልጊዜ እባርከዋለሁ', themeEn: 'I Will Bless the Lord at All Times', popular: true },
  51: { themeAm: 'የንስሐ ጸሎት (አቤቱ እንደ ቸርነትህ መጠን ማረኝ)', themeEn: 'Prayer of Repentance (Have Mercy Upon Me)', popular: true },
  63: { themeAm: 'አምላኬ ሆይ፥ ወደ አንተ እገሰግሳለሁ', themeEn: 'O God, You Are My God, Early Will I Seek You', popular: true },
  91: { themeAm: 'በልዑል መጠጊያ የሚኖር (የጸሎት ጋሻ)', themeEn: 'He Who Dwells in the Secret Place (Shield of Prayer)', popular: true },
  103: { themeAm: 'ነፍሴ ሆይ፥ እግዚአብሔርን ባርኪ', themeEn: 'Bless the Lord, O My Soul', popular: true },
  119: { themeAm: 'የሕጉ ፍቅርና ምሪት', themeEn: 'Delight in the Law of God', popular: true },
  121: { themeAm: 'ዓይኖቼን ወደ ተራሮች አነሣለሁ', themeEn: 'I Lift Up My Eyes to the Hills', popular: true },
  133: { themeAm: 'ወንድሞች በኅብረት ቢቀመጡ መልካም ነው', themeEn: 'How Good and Pleasant for Brethren to Dwell Together', popular: true },
  136: { themeAm: 'ምሕረቱ ለዘላለም ነውና', themeEn: 'His Mercy Endures Forever', popular: true },
  145: { themeAm: 'አምላኬ ንጉሤ ሆይ፥ ከፍ ከፍ አደርግሃለሁ', themeEn: 'I Will Extol You, My God, O King', popular: true },
  150: { themeAm: 'እግዚአብሔርን በመቅደሱ አመስግኑት (ታላቅ ምስጋና)', themeEn: 'Praise the Lord in His Sanctuary', popular: true },
  151: { themeAm: 'ከቍጥር የወጣ መዝሙር (ዳዊትና ጎልያድ)', themeEn: 'The Canonical Psalm of David against Goliath', popular: true },
};

const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, '../psalms_raw.json'), 'utf8'));

const processed = [];

rawData.chapters.forEach((item, index) => {
  const chapterNum = parseInt(item.chapter, 10);
  const verses = item.verses.map(v => v.trim()).filter(Boolean);
  const day = getLiturgicalDay(chapterNum);
  const info = psalmThemes[chapterNum] || {};

  processed.push({
    id: chapterNum,
    chapter: chapterNum,
    geezNumber: toGeez(chapterNum),
    title: item.title ? item.title.trim() : `መዝሙር ${chapterNum}`,
    themeAm: info.themeAm || `መዝሙረ ዳዊት ምዕራፍ ${chapterNum}`,
    themeEn: info.themeEn || `Psalm ${chapterNum}`,
    popular: !!info.popular,
    dayIndex: day.dayIndex,
    dayAm: day.nameAm,
    dayEn: day.nameEn,
    dayRange: day.range,
    verses: verses,
    totalVerses: verses.length,
    totalWords: verses.join(' ').split(/\s+/).filter(Boolean).length,
    totalCharacters: verses.join(' ').length,
  });
});

// Add Psalm 151
const p151Verses = [
  "ከወንድሞቼ ይልቅ እኔ ትንሽ ነበርሁ፥ በአባቴም ቤት ወጣት ነበርሁ፥ አባቴንም በጎች እጠብቅ ነበር።",
  "እጆቼ መሰንቆ ይመቱ ነበር፥ ጣቶቼም በገና ይደደርድሩ ነበር።",
  "ለጌታዬ ማን ነገረው? እርሱ እግዚአብሔር እርሱ ሰማኝ።",
  "እርሱ መልአኩን ሰደደ፥ ከእግዚአብሔርም በጎች ወሰደኝ፥ የቅዱስ ቅብአቱንም ቅባት ቀባኝ።",
  "ወንድሞቼ ግን ያማሩና ያደጉ ነበሩ፥ እግዚአብሔር ግን በእነርሱ ደስ አላለውም።",
  "ልዩ ወገንን ልገጥመው ወጣሁ፥ በረከሱ ጣዖቶቹም ረገመኝ።",
  "እኔ ግን ሦስት አብን ተቀብሎ ግንባሩን በወንጭፍ መታሁት፥ ያን ጊዜም በእግዚአብሔር ኃይል ወደቀ፤ የጎልያድንም ቸብቸቦ ቈረጠሁ፥ ከእስራኤል ልጆችም ስድብን አራቅሁ።"
];

const day151 = getLiturgicalDay(151);
processed.push({
  id: 151,
  chapter: 151,
  geezNumber: toGeez(151),
  title: 'ከቍጥር የወጣ መዝሙር ስለ ራሱ።',
  themeAm: 'ከቍጥር የወጣ መዝሙር (ዳዊትና ጎልያድ)',
  themeEn: 'Canonical Psalm of David against Goliath',
  popular: true,
  dayIndex: day151.dayIndex,
  dayAm: day151.dayAm,
  dayEn: day151.dayEn,
  dayRange: day151.range,
  verses: p151Verses,
  totalVerses: p151Verses.length,
  totalWords: p151Verses.join(' ').split(/\s+/).filter(Boolean).length,
  totalCharacters: p151Verses.join(' ').length,
});

// Ensure directory exists
const outDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outDir, 'psalms.json'),
  JSON.stringify(processed, null, 2)
);

console.log(`Successfully processed ${processed.length} Psalms! Written to src/data/psalms.json`);
