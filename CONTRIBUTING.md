# 贡献指南

感谢你愿意参与 `vue-drag-resize-rotate`！

## 环境

- Node.js 20+（推荐 24.x）
- pnpm 10+（仓库**只接受** pnpm，不要用 npm / yarn，lock 文件已被 ignore）

## 启动

```bash
git clone https://github.com/liaogn/vue-drag-resize-rotate.git
cd vue-drag-resize-rotate
pnpm install

pnpm dev          # 启动组件 playground (http://localhost:5173)
pnpm docs:dev     # 启动文档站
pnpm type-check   # TS 类型检查
pnpm lint         # ESLint
pnpm build        # 构建库产物到 dist/
```

## 项目结构

```
src/
├── index.ts                # 包入口（Vue plugin install）
├── vdr/
│   └── index.vue           # 组件 SFC（薄壳，调用 core）
├── core/                   # 框架无关逻辑（为未来 React 版做准备）
│   ├── geometry/           # 几何计算（maps / calc / size）
│   ├── dom/                # DOM 读取（element / rotate）
│   ├── controllers/        # 交互控制器（Drager / Rotator / Fliper）
│   ├── resize/             # 缩放计算主入口
│   ├── cursor/             # 触点 cursor 渲染
│   ├── style/vdr.css       # 样式（CSS 变量驱动）
│   └── types.ts            # 共享类型
└── playground/             # 本地调试用
docs/                       # VitePress 文档站
legacy/                     # Vue 2 版本（仅参照，不再维护）
```

## 提交流程

1. Fork + 新分支开发
2. **涉及包对外行为的改动**，请运行：
   ```bash
   pnpm changeset
   ```
   按提示选择 patch / minor / major 并写变更说明，把 `.changeset/*.md` 一起提交
3. 确保下列命令全部通过：
   ```bash
   pnpm type-check
   pnpm lint
   pnpm build
   ```
4. 开 PR 到 `master`

## 发版流程（维护者）

本仓库采用 `changesets` + **手动 publish** 策略。

1. 用户 PR 合并到 `master` 后，如果存在未发布的 changeset，GitHub Actions 会自动创建 `Version Packages` PR，汇总所有变更、bump 版本号、更新 CHANGELOG
2. 维护者 review 并合并该 PR
3. 本地执行：

```bash
git checkout master
git pull
pnpm install
pnpm build
pnpm publish --access public
git push --follow-tags
```

> 为什么不走 Actions 自动 publish？—— 32 star 阶段独自维护，NPM_TOKEN 本地持有更安全，避免误发版。

## 代码规范

- **TypeScript 优先**。新写逻辑请用 `.ts`
- `core/` 目录内部保持**框架无关**：不要 import vue、不要操作 Vue 实例
- 组件层（`vdr/index.vue`）只做 props ↔ core 的 bridge，不写几何计算
- 样式：新增可配置视觉量时先加 `--vdr-*` CSS 变量，再在规则中引用
- 文档：凡改 props / events 必同步更新 `docs/guide/props.md` 与 `docs/guide/events.md`；新增行为建议加 example

## 问题反馈

Bug / Feature 请走 [Issues](https://github.com/liaogn/vue-drag-resize-rotate/issues)。
