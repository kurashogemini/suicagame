// Sumikkogurashi Character Definitions for "すみっコゲーム"

export const SUMIKKO_ITEMS = [
  {
    id: 0,
    name: 'Tapioca',
    nameJa: 'たぴおか',
    radius: 17,
    score: 2,
    color: '#FFC8DD',
    gradientColor: '#FFE5EC',
    accentColor: '#FF85A1',
    type: 'tapioca',
  },
  {
    id: 1,
    name: 'Hokori',
    nameJa: 'ほこり',
    radius: 25,
    score: 4,
    color: '#B8C0FF',
    gradientColor: '#E7C6FF',
    accentColor: '#8E9AAF',
    type: 'hokori',
  },
  {
    id: 2,
    name: 'Ebifurai',
    nameJa: 'えびふらいのしっぽ',
    radius: 33,
    score: 8,
    color: '#F4A261',
    gradientColor: '#E9C46A',
    accentColor: '#E76F51',
    type: 'ebifurai',
  },
  {
    id: 3,
    name: 'Ajifurai',
    nameJa: 'あじふらいのしっぽ',
    radius: 41,
    score: 16,
    color: '#A8DADC',
    gradientColor: '#F1FAEE',
    accentColor: '#457B9D',
    type: 'ajifurai',
  },
  {
    id: 4,
    name: 'Zassou',
    nameJa: 'ざっそう',
    radius: 49,
    score: 32,
    color: '#70E000',
    gradientColor: '#9EF01A',
    accentColor: '#38B000',
    type: 'zassou',
  },
  {
    id: 5,
    name: 'Nisetsumuri',
    nameJa: 'にせつむり',
    radius: 59,
    score: 64,
    color: '#B7E4C7',
    gradientColor: '#D8F3DC',
    accentColor: '#74C69D',
    type: 'nisetsumuri',
  },
  {
    id: 6,
    name: 'Neko',
    nameJa: 'ねこ',
    radius: 69,
    score: 128,
    color: '#FFE599',
    gradientColor: '#FFF2CC',
    accentColor: '#E6B800',
    type: 'neko',
  },
  {
    id: 7,
    name: 'Penguin?',
    nameJa: 'ぺんぎん？',
    radius: 81,
    score: 256,
    color: '#90BE6D',
    gradientColor: '#C5E1A5',
    accentColor: '#43AA8B',
    type: 'penguin',
  },
  {
    id: 8,
    name: 'Tonkatsu',
    nameJa: 'とんかつ',
    radius: 95,
    score: 512,
    color: '#C17817',
    gradientColor: '#E09F3E',
    accentColor: '#8C5A2B',
    type: 'tonkatsu',
  },
  {
    id: 9,
    name: 'Shirokuma',
    nameJa: 'しろくま',
    radius: 111,
    score: 1024,
    color: '#F8F9FA',
    gradientColor: '#FFFFFF',
    accentColor: '#DEE2E6',
    type: 'shirokuma',
  },
  {
    id: 10,
    name: 'Tokage',
    nameJa: 'とかげ',
    radius: 130,
    score: 2048,
    color: '#90E0EF',
    gradientColor: '#CAF0F8',
    accentColor: '#00B4D8',
    type: 'tokage',
  },
];

// Spawning rules: Only items of tier 0 to 4 can be spawned at top
export const SPAWNABLE_TIERS = [0, 1, 2, 3, 4];

export function getRandomSpawnTier() {
  const weights = [0.40, 0.30, 0.15, 0.10, 0.05];
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      return i;
    }
  }
  return 0;
}
