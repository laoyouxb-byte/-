import { _decorator, Component, input, Input, EventTouch } from 'cc';
import { DEFAULT_BALANCE } from './GameConfig';
import { CoinSpawner } from './CoinSpawner';
import { Pusher } from './Pusher';
import { UIController } from './UIController';
import { ClearDeskSkill } from './ClearDeskSkill';
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

  async start(): Promise<void> {
    await this.spawner?.preloadSprites();
    this.refreshUI();

    this.ui?.btnStart?.on(Input.EventType.TOUCH_END, this.startGame, this);
    this.ui?.btnDrop?.on(Input.EventType.TOUCH_END, this.onDropClick, this);
    this.ui?.btnClear?.on(Input.EventType.TOUCH_END, this.onClearDesk, this);

    input.on(Input.EventType.TOUCH_START, this.onTouchDropAnywhere, this);
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
    this.pusher?.startPushLoop();
    this.ui?.tip('开局！点击“点击这里”或屏幕进行投币');
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
    if (!this.started) return;
    if (this.coinsLeft <= 0) {
      this.ui?.tip('没有表情币了，等待结算！');
      return;
    }
    if (this.dropCD > 0) return;

    const coin = this.spawner?.spawnOne();
    if (!coin) return;

    this.coinsLeft -= 1;
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

    if (this.coinsLeft <= 0) {
      this.ui?.tip(`结算中... 当前得分 ${this.score}`);
    }
  }

  private onClearDesk(): void {
    if (!this.started) return;
    if (this.clearCD > 0) {
      this.ui?.tip(`清台冷却中：${this.clearCD.toFixed(1)}s`);
      return;
    }

    const cleared = this.clearSkill?.clearAllCoins() ?? 0;
    this.clearCD = DEFAULT_BALANCE.clearDeskCooldown;
    this.ui?.tip(`清理了 ${cleared} 个台面表情币！`);
  }

  private refreshUI(): void {
    this.ui?.setScore(this.score);
    this.ui?.setCoinLeft(this.coinsLeft);
    this.ui?.setCombo(this.combo, 1 + this.combo * 0.1);
  }
}
