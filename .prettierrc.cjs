// .prettierrc.cjs
module.exports = {
  // 单行最大长度
  printWidth: 100,

  // 缩进空格数
  tabWidth: 2,

  // 使用空格缩进
  useTabs: false,

  // 语句末尾添加分号
  semi: true,

  // 使用单引号
  singleQuote: true,

  // 对象属性引号使用: as-needed | consistent | preserve
  quoteProps: 'as-needed',

  // JSX中使用单引号
  jsxSingleQuote: true,

  // 尾随逗号: none | es5 | all
  trailingComma: 'es5',

  // 对象花括号内的空格
  bracketSpacing: true,

  // 将多行 HTML (HTML、JSX、Vue、Angular) 元素的 > 放在最后一行的末尾
  bracketSameLine: false,

  // 箭头函数参数括号: always | avoid
  arrowParens: 'always',

  // 换行符: auto | lf | crlf | cr
  endOfLine: 'lf',

  // HTML空白敏感度: css | strict | ignore
  htmlWhitespaceSensitivity: 'css',

  // Vue文件 script 和 style 标签缩进
  vueIndentScriptAndStyle: false,

  // 格式化嵌入的内容
  embeddedLanguageFormatting: 'auto',
};
