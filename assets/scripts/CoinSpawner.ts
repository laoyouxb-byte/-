import { _decorator, Component, instantiate, Node, Prefab, resources, SpriteFrame, Vec3 } from 'cc';
import { CoinTypeConfig, DEFAULT_COIN_TYPES } from './GameConfig';
import { EmojiCoin } from './EmojiCoin';
const { ccclass, property } = _decorator;

@ccclass('CoinSpawner')
export class CoinSpawner extends Component {
  @property({ type: Prefab })
  coinPrefab: Prefab | null = null;

  @property({ type: Node })
  coinTemplate: Node | null = null;

  @property({ type: Node })
  spawnPoint: Node | null = null;

  @property({ type: Node })
  coinContainer: Node | null = null;

  coinTypes: CoinTypeConfig[] = DEFAULT_COIN_TYPES;
  private spriteMap = new Map<string, SpriteFrame>();

  async preloadSprites(): Promise<void> {
    const loads = this.coinTypes.map(
      (c) =>
        new Promise<void>((resolve) => {
          resources.load(`emojis/${c.id}/spriteFrame`, SpriteFrame, (err, sf) => {
            if (!err && sf) this.spriteMap.set(c.id, sf);
            resolve();
          });
        })
    );
    await Promise.all(loads);
  }

  spawnOne(): EmojiCoin | null {
    if (!this.spawnPoint || !this.coinContainer) return null;
    const cfg = this.randomCoinType();
    const node = this.coinPrefab ? instantiate(this.coinPrefab) : this.coinTemplate?.clone();
    if (!node) return null;
    node.setParent(this.coinContainer);
    node.worldPosition = new Vec3(this.spawnPoint.worldPosition.x, this.spawnPoint.worldPosition.y, 0);

    const comp = node.getComponent(EmojiCoin);
    if (!comp) return null;
    comp.init(cfg.id, cfg.rarity, cfg.score, this.spriteMap.get(cfg.id) ?? null);
    return comp;
  }

  private randomCoinType(): CoinTypeConfig {
    const total = this.coinTypes.reduce((s, it) => s + it.weight, 0);
    let rand = Math.random() * total;
    for (const c of this.coinTypes) {
      rand -= c.weight;
      if (rand <= 0) return c;
    }
    return this.coinTypes[0];
  }
}
