# Changesets

这个目录由 [changesets](https://github.com/changesets/changesets) 管理。每次提交会引入用户可感知变化的 PR 时，应在 PR 中运行：

```bash
pnpm changeset
```

按提示选择变更级别（patch / minor / major）并填写变更说明。生成的 `.md` 文件会与代码一起合并到 master。

之后 GitHub Actions 会自动开启一个 "Version Packages" PR，汇总所有未发布的 changeset，并自动 bump `package.json` 的版本号、生成 `CHANGELOG.md` 的新段落。

合并 "Version Packages" PR 后：

```bash
# 本地 publish（当前策略为手动发布）
pnpm build
pnpm publish --access public
git push --follow-tags
```

完整流程见 [CONTRIBUTING.md](../CONTRIBUTING.md)。
