import { _decorator, Component, Contact2DType, Collider2D, IPhysics2DContact, SpriteFrame, Sprite } from 'cc';
import { CoinRarity } from './GameConfig';
const { ccclass, property } = _decorator;

@ccclass('EmojiCoin')
export class EmojiCoin extends Component {
  @property({ type: Sprite })
  sprite: Sprite | null = null;

  id = '';
  rarity: CoinRarity = CoinRarity.Common;
  score = 10;
  private settled = false;

  init(id: string, rarity: CoinRarity, score: number, spriteFrame: SpriteFrame | null): void {
    this.id = id;
    this.rarity = rarity;
    this.score = score;
    if (this.sprite && spriteFrame) this.sprite.spriteFrame = spriteFrame;
  }

  onLoad(): void {
    const col = this.getComponent(Collider2D);
    if (!col) return;
    col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  onDestroy(): void {
    const col = this.getComponent(Collider2D);
    if (!col) return;
    col.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  private onBeginContact(self: Collider2D, other: Collider2D, _contact: IPhysics2DContact | null): void {
    if (this.settled) return;
    if (other?.tag === 999) {
      this.settled = true;
      this.node.emit('coin-drop-success', { score: this.score, rarity: this.rarity, id: this.id });
      this.node.destroy();
    }
  }
}
