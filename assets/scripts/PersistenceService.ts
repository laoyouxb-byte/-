import { _decorator } from 'cc';
const { ccclass } = _decorator;

export interface PlayerSaveData {
  version: number;
  bestScore: number;
  totalScore: number;
  coinsSpent: number;
  clearSkillLevel: number;
  pusherLevel: number;
}

const KEY = 'emoji_pusher_save_v1';

@ccclass('PersistenceService')
export class PersistenceService {
  static load(): PlayerSaveData {
    const raw = localStorage.getItem(KEY);
    if (!raw) return this.defaultData();
    try {
      const parsed = JSON.parse(raw) as PlayerSaveData;
      return { ...this.defaultData(), ...parsed };
    } catch {
      return this.defaultData();
    }
  }

  static save(data: PlayerSaveData): void {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  static defaultData(): PlayerSaveData {
    return { version: 1, bestScore: 0, totalScore: 0, coinsSpent: 0, clearSkillLevel: 1, pusherLevel: 1 };
  }
}
