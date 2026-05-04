import { _decorator } from 'cc';
import { CloudArchive, PlayerProfile, RankEntry, ScoreSubmitPayload } from './BackendTypes';
const { ccclass } = _decorator;

const MOCK_PLAYER_KEY = 'emoji_player';
const MOCK_CLOUD_KEY = 'emoji_cloud_archive';
const MOCK_RANK_KEY = 'emoji_rank';

@ccclass('BackendService')
export class BackendService {
  static async loginGuest(): Promise<PlayerProfile> {
    const raw = localStorage.getItem(MOCK_PLAYER_KEY);
    if (raw) return JSON.parse(raw) as PlayerProfile;
    const profile: PlayerProfile = { uid: `guest_${Date.now()}`, name: '游客玩家', guest: true };
    localStorage.setItem(MOCK_PLAYER_KEY, JSON.stringify(profile));
    return profile;
  }

  static async pullCloudArchive(): Promise<CloudArchive | null> {
    const raw = localStorage.getItem(MOCK_CLOUD_KEY);
    return raw ? (JSON.parse(raw) as CloudArchive) : null;
  }

  static async pushCloudArchive(archive: CloudArchive): Promise<void> {
    localStorage.setItem(MOCK_CLOUD_KEY, JSON.stringify(archive));
  }

  static async submitScore(payload: ScoreSubmitPayload): Promise<void> {
    const raw = localStorage.getItem(MOCK_RANK_KEY);
    const list: RankEntry[] = raw ? (JSON.parse(raw) as RankEntry[]) : [];
    list.push({ uid: payload.uid, name: payload.uid, score: payload.score });
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem(MOCK_RANK_KEY, JSON.stringify(list.slice(0, 50)));
  }

  static async getTopRanks(limit = 20): Promise<RankEntry[]> {
    const raw = localStorage.getItem(MOCK_RANK_KEY);
    const list: RankEntry[] = raw ? (JSON.parse(raw) as RankEntry[]) : [];
    return list.slice(0, limit);
  }
}
