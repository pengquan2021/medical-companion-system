// eslint.config.js - 完整配置
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Vue 相关规则
      'vue/multi-word-component-names': 'off', // 允许单文件组件名
      'vue/no-unused-vars': 'error',
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],

      // JavaScript 规则
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'arrow-parens': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      // Prettier 相关
      'prettier/prettier': [
        'error',
        {
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
          bracketSpacing: true,
          arrowParens: 'always',
          endOfLine: 'lf',
        },
      ],
    },
  },
  {
    // 针对 Vue 文件的特殊配置
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    // 忽略文件
    ignores: [
      'node_modules/',
      'dist/',
      '*.min.js',
      '*.log',
      '.DS_Store',
      '.env',
      '.env.local',
      '.env.*.local',
      'coverage/',
      '.nyc_output',
      'public/',
      'index.html',
      'vite.config.js',
      // 配置文件（本项目为 type=module，配置常用 .cjs；不参与业务代码 lint）
      '**/*.cjs',
    ],
  },
];
