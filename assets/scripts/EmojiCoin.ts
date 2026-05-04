import { _decorator, Color, Component, Contact2DType, Collider2D, Graphics, IPhysics2DContact, SpriteFrame, Sprite } from 'cc';
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
    if (this.sprite && spriteFrame) {
      this.sprite.spriteFrame = spriteFrame;
    } else {
      this.drawFallbackEmoji();
    }
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

  private drawFallbackEmoji(): void {
    const g = this.getComponent(Graphics) ?? this.addComponent(Graphics);
    g.clear();
    const c = this.rarity === CoinRarity.Legendary ? new Color(255, 210, 60) : this.rarity === CoinRarity.Rare ? new Color(255, 170, 70) : new Color(255, 230, 90);
    g.fillColor = c;
    g.circle(0, 0, 20);
    g.fill();
    g.fillColor = new Color(40, 40, 40);
    g.circle(-7, 5, 2.5);
    g.circle(7, 5, 2.5);
    g.fill();
    g.moveTo(-8, -5);
    g.quadraticCurveTo(0, -12, 8, -5);
    g.stroke();
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
