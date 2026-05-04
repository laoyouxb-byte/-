import { _decorator, Component, Node, Vec3, UITransform, RigidBody2D, ERigidBody2DType, BoxCollider2D, CircleCollider2D, PhysicsSystem2D, Label, Color, input, Input } from 'cc';
import { CoinSpawner } from './CoinSpawner';
import { ClearDeskSkill } from './ClearDeskSkill';
import { GameManager } from './GameManager';
import { Pusher } from './Pusher';
import { UIController } from './UIController';
import { EmojiCoin } from './EmojiCoin';
import { MachineUIBuilder } from './MachineUIBuilder';
const { ccclass } = _decorator;

@ccclass('GameBootstrap')
export class GameBootstrap extends Component {
  start(): void {
    PhysicsSystem2D.instance.enable = true;
    PhysicsSystem2D.instance.gravity.set(0, -1200);

    const uiBuilder = this.node.addComponent(MachineUIBuilder);
    const { board, clickArea, scoreArea } = uiBuilder.build(this.node);

    const gameRoot = new Node('GameRoot');
    gameRoot.setParent(this.node);

    const coinContainer = new Node('CoinContainer');
    coinContainer.setParent(gameRoot);

    const spawnPoint = new Node('SpawnPoint');
    spawnPoint.setParent(gameRoot);
    spawnPoint.setPosition(new Vec3(0, 260));

    const dropLine = this.createStaticBox(gameRoot, 'DropLine', new Vec3(0, -420), new Vec3(620, 20), 999, true);
    this.createStaticBox(gameRoot, 'DeskArea', new Vec3(0, -160), new Vec3(620, 520), 1);
    this.createStaticBox(gameRoot, 'LeftWall', new Vec3(-320, -80), new Vec3(20, 760), 2);
    this.createStaticBox(gameRoot, 'RightWall', new Vec3(320, -80), new Vec3(20, 760), 2);

    const pusherNode = this.createKinematicPusher(gameRoot);

    const coinPrefabNode = new Node('CoinPrefabTemplate');
    coinPrefabNode.addComponent(UITransform).setContentSize(46, 46);
    coinPrefabNode.addComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
    coinPrefabNode.addComponent(CircleCollider2D).radius = 23;
    coinPrefabNode.addComponent(EmojiCoin);

    const gm = this.node.addComponent(GameManager);
    const sp = this.node.addComponent(CoinSpawner);
    const pusher = pusherNode.addComponent(Pusher);
    const clear = this.node.addComponent(ClearDeskSkill);
    const ui = this.node.addComponent(UIController);

    sp.spawnPoint = spawnPoint;
    sp.coinContainer = coinContainer;
    // 运行态使用模板节点；编辑器内可改为设置 coinPrefab。
    sp.coinPrefab = null;
    sp.coinTemplate = coinPrefabNode;

    clear.coinContainer = coinContainer;

    ui.scoreLabel = this.makeBottomLabel(scoreArea, 'ScoreLabel', new Vec3(-220, 0), '得分：0');
    ui.coinLeftLabel = this.makeBottomLabel(scoreArea, 'CoinLeftLabel', new Vec3(0, 0), '剩余：0');
    ui.comboLabel = this.makeBottomLabel(scoreArea, 'ComboLabel', new Vec3(220, 0), '连击：-');

    const tipsNode = new Node('TipsLabel');
    tipsNode.setParent(board);
    tipsNode.setPosition(new Vec3(0, -300));
    ui.tipsLabel = tipsNode.addComponent(Label);
    ui.tipsLabel.fontSize = 34;
    ui.tipsLabel.color = new Color(60, 120, 50, 255);

    ui.btnStart = clickArea;
    ui.btnDrop = clickArea;
    ui.btnClear = dropLine;

    gm.spawner = sp;
    gm.pusher = pusher;
    gm.clearSkill = clear;
    gm.ui = ui;

    input.on(Input.EventType.TOUCH_START, () => ui.tip('已点击：投币触发'), this);
  }

  private createStaticBox(parent: Node, name: string, pos: Vec3, size: Vec3, tag: number, sensor = false): Node {
    const n = new Node(name);
    n.setParent(parent);
    n.setPosition(pos);
    n.addComponent(UITransform).setContentSize(size.x, size.y);
    const rb = n.addComponent(RigidBody2D);
    rb.type = ERigidBody2DType.Static;
    const col = n.addComponent(BoxCollider2D);
    col.size.set(size.x, size.y);
    col.tag = tag;
    col.sensor = sensor;
    return n;
  }

  private createKinematicPusher(parent: Node): Node {
    const n = new Node('Pusher');
    n.setParent(parent);
    n.setPosition(new Vec3(0, -40));
    n.addComponent(UITransform).setContentSize(600, 36);
    const rb = n.addComponent(RigidBody2D);
    rb.type = ERigidBody2DType.Kinematic;
    const col = n.addComponent(BoxCollider2D);
    col.size.set(600, 36);
    return n;
  }

  private makeBottomLabel(parent: Node, name: string, pos: Vec3, text: string): Label {
    const n = new Node(name);
    n.setParent(parent);
    n.setPosition(pos);
    const l = n.addComponent(Label);
    l.string = text;
    l.fontSize = 28;
    l.color = new Color(50, 80, 60, 255);
    return l;
  }
}
