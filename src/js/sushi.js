// Sushi Item Definitions for "すしころ回転祭" (Sushi Express)

export const SUSHI_ITEMS = [
  {
    id: 0,
    name: 'Tamago',
    nameJa: 'たまご',
    radius: 17,
    score: 2,
    color: '#FFD166',
    gradientColor: '#FFE599',
    accentColor: '#E9C46A',
    type: 'tamago',
  },
  {
    id: 1,
    name: 'Kanpyo Roll',
    nameJa: 'かんぴょう巻き',
    radius: 25,
    score: 4,
    color: '#264653',
    gradientColor: '#2A9D8F',
    accentColor: '#1D3557',
    type: 'kanpyo',
  },
  {
    id: 2,
    name: 'Inari',
    nameJa: 'いなり寿司',
    radius: 33,
    score: 8,
    color: '#C17817',
    gradientColor: '#E09F3E',
    accentColor: '#8C5A2B',
    type: 'inari',
  },
  {
    id: 3,
    name: 'Ebi',
    nameJa: 'えび',
    radius: 41,
    score: 16,
    color: '#FF70A6',
    gradientColor: '#FF9770',
    accentColor: '#E76F51',
    type: 'ebi',
  },
  {
    id: 4,
    name: 'Ika',
    nameJa: 'いか',
    radius: 49,
    score: 32,
    color: '#F8F9FA',
    gradientColor: '#FFFFFF',
    accentColor: '#CED4DA',
    type: 'ika',
  },
  {
    id: 5,
    name: 'Salmon',
    nameJa: 'サーモン',
    radius: 59,
    score: 64,
    color: '#FF7F50',
    gradientColor: '#FFA07A',
    accentColor: '#E05638',
    type: 'salmon',
  },
  {
    id: 6,
    name: 'Maguro',
    nameJa: 'まぐろ',
    radius: 69,
    score: 128,
    color: '#D90429',
    gradientColor: '#EF233C',
    accentColor: '#9B001C',
    type: 'maguro',
  },
  {
    id: 7,
    name: 'Ikura',
    nameJa: 'いくら軍艦',
    radius: 81,
    score: 256,
    color: '#FF4500',
    gradientColor: '#FF6347',
    accentColor: '#CC3700',
    type: 'ikura',
  },
  {
    id: 8,
    name: 'Uni',
    nameJa: 'うに軍艦',
    radius: 95,
    score: 512,
    color: '#E09F3E',
    gradientColor: '#F4A261',
    accentColor: '#9E6410',
    type: 'uni',
  },
  {
    id: 9,
    name: 'Otoro',
    nameJa: '大トロ',
    radius: 111,
    score: 1024,
    color: '#FF85A1',
    gradientColor: '#FFB3C6',
    accentColor: '#C9184A',
    type: 'otoro',
  },
  {
    id: 10,
    name: 'Chirashi Bowl',
    nameJa: '特上ちらし寿司',
    radius: 130,
    score: 2048,
    color: '#D4AF37',
    gradientColor: '#F3E5AB',
    accentColor: '#AA7C11',
    type: 'chirashi',
  },
];

// Spawning rules: Only sushi of tier 0 to 4 can be spawned at top
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
