import { _decorator, Component, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pusher')
export class Pusher extends Component {
  @property
  moveDistance = 56;

  @property
  moveDuration = 0.9;

  @property
  pauseDuration = 0.2;

  private startPos = new Vec3();
  private running = false;

  onLoad(): void {
    this.startPos = this.node.position.clone();
  }

  startPushLoop(): void {
    if (this.running) return;
    this.running = true;
    this.playLoop();
  }

  stopPushLoop(): void {
    this.running = false;
    tween(this.node).stop();
    this.node.setPosition(this.startPos);
  }

  private playLoop(): void {
    if (!this.running) return;
    const forward = this.startPos.clone();
    forward.y += this.moveDistance;

    tween(this.node)
      .to(this.moveDuration, { position: forward })
      .delay(this.pauseDuration)
      .to(this.moveDuration, { position: this.startPos })
      .delay(this.pauseDuration)
      .call(() => this.playLoop())
      .start();
  }
}
