export enum CoinRarity {
  Common = 'common',
  Rare = 'rare',
  Legendary = 'legendary',
}

export interface CoinTypeConfig {
  id: string;
  rarity: CoinRarity;
  weight: number;
  score: number;
}

export interface GameBalanceConfig {
  totalCoins: number;
  dropCooldown: number;
  comboExpireSec: number;
  clearDeskCooldown: number;
}

export const DEFAULT_COIN_TYPES: CoinTypeConfig[] = [
  { id: 'coin_smile', rarity: CoinRarity.Common, weight: 70, score: 10 },
  { id: 'coin_angry', rarity: CoinRarity.Rare, weight: 25, score: 30 },
  { id: 'coin_laugh', rarity: CoinRarity.Legendary, weight: 5, score: 100 },
];

export const DEFAULT_BALANCE: GameBalanceConfig = {
  totalCoins: 40,
  dropCooldown: 0.25,
  comboExpireSec: 2.5,
  clearDeskCooldown: 12,
};
