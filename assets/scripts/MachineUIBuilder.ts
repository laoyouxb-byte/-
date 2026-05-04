import { _decorator, Color, Component, Graphics, Label, Node, Sprite, UITransform, Vec3 } from 'cc';
const { ccclass } = _decorator;

@ccclass('MachineUIBuilder')
export class MachineUIBuilder extends Component {
  build(root: Node): { board: Node; clickArea: Node; scoreArea: Node } {
    const board = new Node('MachineBoard');
    board.addComponent(UITransform).setContentSize(680, 1080);
    board.setParent(root);

    const bg = board.addComponent(Graphics);
    bg.roundRect(-330, -520, 660, 1040, 36);
    bg.fillColor = new Color(244, 238, 197, 255);
    bg.fill();

    const top = new Node('TopTitle');
    top.addComponent(UITransform).setContentSize(620, 180);
    top.setPosition(new Vec3(0, 420));
    top.setParent(board);
    const topBg = top.addComponent(Graphics);
    topBg.roundRect(-310, -90, 620, 180, 24);
    topBg.fillColor = new Color(116, 196, 71, 255);
    topBg.fill();

    const title = this.addLabel(top, '推个表情包', 72, new Color(255, 221, 58, 255), new Vec3(0, 24));
    title.isBold = true;
    this.addLabel(top, '清理台面上的所有东西', 42, new Color(40, 110, 30, 255), new Vec3(0, -42));

    const clickArea = new Node('ClickArea');
    clickArea.addComponent(UITransform).setContentSize(620, 120);
    clickArea.setPosition(new Vec3(0, 260));
    clickArea.setParent(board);
    const ca = clickArea.addComponent(Graphics);
    ca.roundRect(-310, -60, 620, 120, 20);
    ca.fillColor = new Color(255, 231, 78, 255);
    ca.fill();
    this.addLabel(clickArea, '点击这里投放表情币', 46, new Color(26, 106, 38, 255), new Vec3(0, 0));

    const scoreArea = new Node('ScoreArea');
    scoreArea.addComponent(UITransform).setContentSize(620, 90);
    scoreArea.setPosition(new Vec3(0, -480));
    scoreArea.setParent(board);
    const sa = scoreArea.addComponent(Graphics);
    sa.roundRect(-310, -45, 620, 90, 28);
    sa.fillColor = new Color(187, 223, 238, 255);
    sa.fill();

    return { board, clickArea, scoreArea };
  }

  private addLabel(parent: Node, text: string, size: number, color: Color, pos: Vec3): Label {
    const node = new Node(text);
    node.setParent(parent);
    node.setPosition(pos);
    const lab = node.addComponent(Label);
    lab.string = text;
    lab.fontSize = size;
    lab.lineHeight = size + 8;
    lab.color = color;
    return lab;
  }
}
