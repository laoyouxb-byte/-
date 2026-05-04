export interface PlayerProfile {
  uid: string;
  name: string;
  guest: boolean;
}

export interface CloudArchive {
  bestScore: number;
  totalScore: number;
  coinsSpent: number;
  updatedAt: number;
}

export interface ScoreSubmitPayload {
  uid: string;
  score: number;
  ts: number;
}

export interface RankEntry {
  uid: string;
  name: string;
  score: number;
}
