// .stylelintrc.cjs
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
  plugins: [],
  rules: {
    // 自定义规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['font-icon'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global'],
      },
    ],
    // 允许空的 style 标签（Vue 项目中很常见）
    'no-empty-source': null,
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.md'],
};
