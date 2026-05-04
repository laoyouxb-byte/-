# 推个表情包（Cocos Creator 3.x）

一个完整的推币机小游戏方案：
- 主题：表情包推币机
- 玩法：点击投放不同表情币，推板往返推动币堆，掉落到奖励区得分
- 技术：TypeScript + Cocos Creator 3.x + 2D 物理

## 核心功能
- 表情币权重随机生成（普通/稀有/传说）
- 推板周期运动（可配置速度、间隔、位移）
- 投币冷却、自动补币、底部掉落计分
- 连击与倍率加成
- 清台道具（对应图片上的“清理台面”概念）
- UI：开始按钮、分数、剩余币数、连击、清理按钮

## 目录
- `assets/scripts/GameConfig.ts`：配置项与类型
- `assets/scripts/EmojiCoin.ts`：单个表情币逻辑
- `assets/scripts/Pusher.ts`：推板逻辑
- `assets/scripts/CoinSpawner.ts`：投币与随机权重
- `assets/scripts/GameManager.ts`：主流程、计分、UI联动
- `assets/scripts/UIController.ts`：UI绑定与动画文本
- `assets/scripts/ClearDeskSkill.ts`：清台技能

## 场景搭建（Scene）
1. 新建 `Main.scene`
2. 创建节点：
   - `Canvas`
   - `GameRoot`
     - `DeskArea`（带 `RigidBody2D(Static)` + `BoxCollider2D`，作为台面）
     - `LeftWall` / `RightWall` / `BackWall`（静态碰撞墙）
     - `DropLine`（触发区，底部领奖线）
     - `Pusher`（带 `Pusher.ts`，再挂 `RigidBody2D(Kinematic)` + `BoxCollider2D`）
     - `SpawnPoint`（投币位置）
     - `CoinContainer`（动态币父节点）
   - `UIRoot`
     - `BtnStart`、`BtnDrop`、`BtnClear`
     - `ScoreLabel`、`CoinLeftLabel`、`ComboLabel`、`TipsLabel`
3. 创建 `CoinPrefab`：
   - 节点挂 `Sprite + RigidBody2D(Dynamic) + CircleCollider2D + EmojiCoin.ts`
4. 把脚本拖到节点并在 Inspector 完成引用。

## 运行参数建议
- 物理：`gravity = (0, -1200)`
- 帧率：60
- 币半径：18~24
- 推板位移：40~65 像素
- 单局投币数：40

## 表情包资源建议
- 三档资源：`coin_smile.png` `coin_angry.png` `coin_laugh.png`
- 推荐 128x128 透明 PNG
- 可额外加描边和高光，强化“贴纸风”

## 可拓展
- 卡池系统（概率UP）
- 成就系统
- 皮肤机台
- 排行榜（本地/在线）
