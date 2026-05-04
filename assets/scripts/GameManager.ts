import { _decorator, Component, input, Input, EventTouch } from 'cc';
import { DEFAULT_BALANCE } from './GameConfig';
import { CoinSpawner } from './CoinSpawner';
import { Pusher } from './Pusher';
import { UIController } from './UIController';
import { ClearDeskSkill } from './ClearDeskSkill';
import { PersistenceService, PlayerSaveData } from './PersistenceService';
import { BackendService } from './BackendService';
import { AnalyticsService } from './AnalyticsService';
import { PlayerProfile } from './BackendTypes';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
  @property({ type: CoinSpawner }) spawner: CoinSpawner | null = null;
  @property({ type: Pusher }) pusher: Pusher | null = null;
  @property({ type: UIController }) ui: UIController | null = null;
  @property({ type: ClearDeskSkill }) clearSkill: ClearDeskSkill | null = null;

  private score = 0;
  private coinsLeft = DEFAULT_BALANCE.totalCoins;
  private combo = 0;
  private comboTimer = 0;
  private dropCD = 0;
  private clearCD = 0;
  private started = false;
  private saveData: PlayerSaveData = PersistenceService.defaultData();
  private profile: PlayerProfile | null = null;

  async start(): Promise<void> {
    this.profile = await BackendService.loginGuest();
    this.saveData = PersistenceService.load();
    const cloud = await BackendService.pullCloudArchive();
    if (cloud) {
      this.saveData.bestScore = Math.max(this.saveData.bestScore, cloud.bestScore);
      this.saveData.totalScore = Math.max(this.saveData.totalScore, cloud.totalScore);
      this.saveData.coinsSpent = Math.max(this.saveData.coinsSpent, cloud.coinsSpent);
    }
    await this.spawner?.preloadSprites();
    this.refreshUI();

    this.ui?.btnStart?.on(Input.EventType.TOUCH_END, this.startGame, this);
    this.ui?.btnDrop?.on(Input.EventType.TOUCH_END, this.onDropClick, this);
    this.ui?.btnClear?.on(Input.EventType.TOUCH_END, this.onClearDesk, this);
    input.on(Input.EventType.TOUCH_START, this.onTouchDropAnywhere, this);
    this.ui?.tip(`欢迎 ${this.profile?.name ?? '玩家'}｜历史最高 ${this.saveData.bestScore}`);
  }

  update(dt: number): void {
    if (!this.started) return;
    this.dropCD = Math.max(0, this.dropCD - dt);
    this.clearCD = Math.max(0, this.clearCD - dt);
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.ui?.setCombo(0, 1);
      }
    }
  }

  private startGame(): void {
    this.started = true;
    this.score = 0;
    this.coinsLeft = DEFAULT_BALANCE.totalCoins;
    this.combo = 0;
    this.comboTimer = 0;
    this.dropCD = 0;
    this.clearCD = 0;
    this.clearSkill?.clearAllCoins();
    this.pusher?.startPushLoop();
    AnalyticsService.track('round_start');
    this.ui?.tip('开局！点击屏幕投放表情币');
    this.refreshUI();
  }

  private onTouchDropAnywhere(_e: EventTouch): void {
    if (!this.started) return;
    this.tryDropOne();
  }

  private onDropClick(): void {
    this.tryDropOne();
  }

  private tryDropOne(): void {
    if (!this.started || this.coinsLeft <= 0 || this.dropCD > 0) return;
    const coin = this.spawner?.spawnOne();
    if (!coin) return;
    this.coinsLeft -= 1;
    this.saveData.coinsSpent += 1;
    AnalyticsService.track('coin_drop', { left: this.coinsLeft });
    this.dropCD = DEFAULT_BALANCE.dropCooldown;
    coin.node.on('coin-drop-success', this.onCoinDropSuccess, this);
    this.refreshUI();
  }

  private onCoinDropSuccess(payload: { score: number }): void {
    this.combo += 1;
    this.comboTimer = DEFAULT_BALANCE.comboExpireSec;
    const multi = Math.min(1 + this.combo * 0.1, 3);
    this.score += Math.floor(payload.score * multi);
    this.ui?.setScore(this.score);
    this.ui?.setCombo(this.combo, multi);
    if (this.coinsLeft <= 0) this.finishGame();
  }

  private async finishGame(): Promise<void> {
    this.started = false;
    this.pusher?.stopPushLoop();
    this.saveData.totalScore += this.score;
    this.saveData.bestScore = Math.max(this.saveData.bestScore, this.score);
    PersistenceService.save(this.saveData);
    await BackendService.pushCloudArchive({
      bestScore: this.saveData.bestScore,
      totalScore: this.saveData.totalScore,
      coinsSpent: this.saveData.coinsSpent,
      updatedAt: Date.now(),
    });
    if (this.profile) {
      await BackendService.submitScore({ uid: this.profile.uid, score: this.score, ts: Date.now() });
    }
    AnalyticsService.track('round_finish', { score: this.score, best: this.saveData.bestScore });
    this.ui?.tip(`结算完成！总分 ${this.score}｜最高 ${this.saveData.bestScore}`);
  }

  private onClearDesk(): void {
    if (!this.started) return;
    if (this.clearCD > 0) {
      this.ui?.tip(`清台冷却：${this.clearCD.toFixed(1)}s`);
      return;
    }
    const cleared = this.clearSkill?.clearAllCoins() ?? 0;
    this.clearCD = DEFAULT_BALANCE.clearDeskCooldown;
    this.ui?.tip(`清理了 ${cleared} 个表情币`);
  }

  private refreshUI(): void {
    this.ui?.setScore(this.score);
    this.ui?.setCoinLeft(this.coinsLeft);
    this.ui?.setCombo(this.combo, 1 + this.combo * 0.1);
  }
}
