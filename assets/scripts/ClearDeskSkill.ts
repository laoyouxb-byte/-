import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ClearDeskSkill')
export class ClearDeskSkill extends Component {
  @property({ type: Node })
  coinContainer: Node | null = null;

  clearAllCoins(): number {
    if (!this.coinContainer) return 0;
    const count = this.coinContainer.children.length;
    this.coinContainer.removeAllChildren();
    return count;
  }
}
