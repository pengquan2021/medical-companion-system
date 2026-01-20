# 工程化配置说明

## 开发规范

### 提交信息规范

格式: `<type>(<scope>): <subject>`

示例:

- feat(user): 添加用户登录功能
- fix(auth): 修复认证过期问题
- docs(readme): 更新使用说明

### 代码规范

1. Vue组件使用大驼峰命名: `UserProfile.vue`
2. JavaScript使用小驼峰: `getUserInfo`
3. CSS类名使用kebab-case: `.user-profile`

工作流程
当你执行 git commit 时：
Husky 触发 pre-commit 钩子
lint-staged 筛选出本次修改的文件
对于 .vue 文件：
运行 eslint --fix（修复 JS 部分）
运行 stylelint --fix（修复 CSS 部分）
运行 prettier --write（格式化整个文件）
对于 .css/.scss 文件：
运行 stylelint --fix
如果修复后仍有错误，提交会被阻止
commit-msg 钩子检查提交信息格式
注意事项
stylelint-config-recommended-vue@^1.6.1 可能与 stylelint v17 不完全兼容，如果遇到问题，可以尝试更新到最新版本或移除它（如果不需要 Vue 特定规则）
如果将来需要使用 SCSS，需要安装兼容 stylelint v17 的 stylelint-config-standard-scss 版本
