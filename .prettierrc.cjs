// Prettier 配置文件
module.exports = {
  // 使用单引号而不是双引号
  singleQuote: true,
  // 行尾不使用分号
  semi: true,
  // 使用2个空格缩进
  tabWidth: 2,
  // 使用空格而不是制表符
  useTabs: false,
  // 行宽限制
  printWidth: 80,
  // 尾随逗号：在ES5中有效的地方保留
  trailingComma: 'es5',
  // 在对象字面量中的括号间打印空格
  bracketSpacing: true,
  // 将多行JSX元素的>放在最后一行的末尾，而不是单独放在下一行
  bracketSameLine: false,
  // 箭头函数参数周围包含括号
  arrowParens: 'avoid',
  // 换行符使用lf
  endOfLine: 'lf',
  // Vue文件中的脚本和样式标签缩进
  vueIndentScriptAndStyle: false,
};
