export interface EconomyConfig {
  reviveCost: number;
  clearDeskBaseCooldown: number;
  dropCoinCap: number;
}

export interface Mission {
  id: string;
  desc: string;
  target: number;
  reward: number;
}

export const DEFAULT_ECONOMY: EconomyConfig = {
  reviveCost: 200,
  clearDeskBaseCooldown: 12,
  dropCoinCap: 50,
};

export const DAILY_MISSIONS: Mission[] = [
  { id: 'drop_30', desc: '投放30个表情币', target: 30, reward: 120 },
  { id: 'score_2000', desc: '单局得分达到2000', target: 2000, reward: 160 },
  { id: 'clear_3', desc: '使用3次清台技能', target: 3, reward: 100 },
];
