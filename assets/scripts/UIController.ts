import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIController')
export class UIController extends Component {
  @property({ type: Label }) scoreLabel: Label | null = null;
  @property({ type: Label }) coinLeftLabel: Label | null = null;
  @property({ type: Label }) comboLabel: Label | null = null;
  @property({ type: Label }) tipsLabel: Label | null = null;

  @property({ type: Node }) btnStart: Node | null = null;
  @property({ type: Node }) btnDrop: Node | null = null;
  @property({ type: Node }) btnClear: Node | null = null;

  setScore(score: number): void {
    if (this.scoreLabel) this.scoreLabel.string = `得分：${score}`;
  }

  setCoinLeft(left: number): void {
    if (this.coinLeftLabel) this.coinLeftLabel.string = `剩余：${left}`;
  }

  setCombo(combo: number, multi: number): void {
    if (this.comboLabel) this.comboLabel.string = combo > 1 ? `连击 x${combo}（${multi.toFixed(1)}倍）` : '连击：-';
  }

  tip(msg: string): void {
    if (this.tipsLabel) this.tipsLabel.string = msg;
  }
}
