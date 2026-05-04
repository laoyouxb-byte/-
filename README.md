# 推个表情包（Cocos Creator 3.x）— 真正开箱即玩

## 一句话
在 `Canvas` 上挂 `GameBootstrap.ts`，直接运行就能玩（即使没配任何外部图片，仍会用程序绘制表情币）。

## 1 分钟启动
1. Cocos Creator 3.x 新建 2D 项目。
2. 拷贝本仓库 `assets/` 到你的项目。
3. 打开 `Main.scene`，选中 `Canvas`，挂 `assets/scripts/GameBootstrap.ts`。
4. 点击预览/运行。

## 你关心的“完整度”
- 已包含：
  - 自动创建机台 UI、物理边界、推板、投币点、掉落线
  - 开局/投币/计分/连击/清台/结算
  - 资源存在时加载图片，资源缺失时自动绘制表情币（不会黑屏/报空）
- 你可选：
  - 使用仓库里的 SVG 源图（`assets/resources/ui`、`assets/resources/emojis`）
  - 或替换成自己的 PNG 资源

## 脚本入口
- `GameBootstrap.ts`：总入口，一键搭建整机台
- `MachineUIBuilder.ts`：构建“推个表情包”风格 UI
- `GameManager.ts`：完整玩法流程
- `CoinSpawner.ts`：投币与随机权重
- `EmojiCoin.ts`：币碰撞领奖线+资源缺失回退绘制

## 资源文件
- `assets/resources/ui/machine_layout.svg`
- `assets/resources/emojis/coin_smile.svg`
- `assets/resources/emojis/coin_angry.svg`
- `assets/resources/emojis/coin_laugh.svg`


## 是否可直接上架运营？
- 结论：当前是“高完成度可玩Demo”，不是最终可上架运营版本。
- 运营差距与里程碑见：`assets/scripts/ProductionReadiness.md`
- 本次新增了本地持久化存档能力（历史最高分、总分、投币数）。

## 已开始“上架化”第一阶段（本地Mock后端）
- 游客登录：`BackendService.loginGuest()`
- 云存档同步：`pullCloudArchive/pushCloudArchive`
- 排行榜提交流程：`submitScore/getTopRanks`
- 埋点事件：`AnalyticsService.track()`（可替换正式SDK）
