// commitlint.config.cjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 提交类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式
        'refactor', // 重构
        'test', // 测试
        'chore', // 构建/工具
        'revert', // 回退
        'perf', // 性能优化
        'ci', // CI/CD
      ],
    ],
    // 提交类型不能为空
    'type-empty': [2, 'never'],
    // 提交范围不能为空
    'scope-empty': [0, 'never'],
    // 提交主题不能为空
    'subject-empty': [2, 'never'],
    // 提交主题长度限制
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    // 消息头最大长度
    'header-max-length': [2, 'always', 100],
    // 消息体前空行
    'body-leading-blank': [2, 'always'],
    // 消息尾前空行
    'footer-leading-blank': [2, 'always'],
  },
};
