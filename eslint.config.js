import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  {
    languageOptions: {
      globals: {
        'IdLike': 'readonly',
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    ignores: [
      'logs',
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'pnpm-debug.log*',
      'lerna-debug.log*',
      'node_modules/',
      'dist/',
      'dist.zip',
      'dist-ssr/',
      'stats.html',
      '*.local',
      '.vscode/',
      '.idea/',
      '.DS_Store',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          'allowShortCircuit': true,
          'allowTernary': true,
          'allowTaggedTemplates': true
        }
      ],
      // 'no-unused-vars': [2, { 'vars': 'all', 'args': 'none' }], // 禁止未使用过的变量
      'no-unused-vars': 'off', // 忽略未使用的变量或导入检查
      '@typescript-eslint/no-unused-vars': 'off', // 如果使用 TypeScript

      'vue/max-attributes-per-line': [2, {
        'singleline': 4,
        'multiline': 1
      }], // 强制每行最多允许多少个属性

      'vue/singleline-html-element-content-newline': 'off', // 关闭在单行元素的内容前后强制换行的规则
      'vue/multiline-html-element-content-newline': 'off', // 关闭在多行元素的内容前后强制换行的规则
      '@typescript-eslint/no-explicit-any': 0, // 是否关闭any类型的警告

      'vue/no-v-html': 'off', // 允许使用 v-html 指令，尽量避免因 XSS 攻击引发的安全风险

      'vue/multi-word-component-names': ['error', {
        'ignores': [
          'index', 'Avatar', 'Breadcrumb', 'Fullscreen', 'Language', 'Layout', 'Login', 'Maximize', 'Message', 'Navbar', '403', '404', '500'
        ]
      }], // 强制组件名称使用多个单词，部分组件名称例外

      'vue/no-reserved-component-names': ['error', {
        'disallowVueBuiltInComponents': false,
        'disallowVue3BuiltInComponents': false
      }], // 禁止在组件定义中使用保留名称

      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        'registeredComponentsOnly': true,
        'ignores': []
      }], // template 中的组件使用 大驼峰 命名

      'vue/html-indent': ['error', 2, {
        'attribute': 1,
        'baseIndent': 1,
        'closeBracket': 0,
        'alignAttributesVertically': true,
        'ignores': []
      }], // 控制 .vue 文件中的 <template> 缩进

      'vue/script-indent': ['error', 2, {
        'baseIndent': 0,
        'switchCase': 1,
        'ignores': []
      }], // 控制 .vue 文件中的 <script> 缩进

      // General JS rules
      'no-var': 'error', // 强制使用 let 或 const 代替 var
      'accessor-pairs': 2, // 强制 getter/setter 成对出现
      'arrow-spacing': [2, { 'before': true, 'after': true }], // 箭头函数前后需要空格
      'block-spacing': [2, 'always'], // 强制代码块前后加空格
      'brace-style': [2, '1tbs', { 'allowSingleLine': true }], // 代码块的大括号风格
      'camelcase': [0, { 'properties': 'always' }], // 对象属性名称是否强制驼峰命名法
      'comma-dangle': [2, 'never'], // 禁止使用拖尾逗号
      'comma-spacing': [2, { 'before': false, 'after': true }], // 逗号前后的空格
      'comma-style': [2, 'last'], // 逗号的样式在行末
      'constructor-super': 2, // 在构造函数中强制调用 super()
      'curly': [2, 'multi-line'], // 强制所有控制语句使用一致的大括号风格
      'dot-location': [2, 'property'], // 强制点号与属性在同一行
      'eol-last': 2, // 文件末尾强制添加空行
      'eqeqeq': ['error', 'always', { 'null': 'ignore' }], // 强制使用 === 和 !==
      'generator-star-spacing': [2, { 'before': true, 'after': true }], // generator 函数中的星号前后空格
      'handle-callback-err': [2, '^(err|error)$'], // 强制在回调函数中处理错误
      'jsx-quotes': [2, 'prefer-single'], // 强制在 JSX 属性中使用单引号
      'key-spacing': [2, { 'beforeColon': false, 'afterColon': true }], // 对象字面量的冒号前后空格
      'keyword-spacing': [2, { 'before': true, 'after': true }], // 关键字前后空格
      'new-cap': [2, { 'newIsCap': true, 'capIsNew': false }], // 构造函数首字母大写
      'new-parens': 2, // 调用构造函数时强制加小括号
      'no-array-constructor': 2, // 禁止使用 Array 构造函数
      'no-caller': 2, // 禁用 arguments.caller 或 arguments.callee
      'no-console': 'off', // 允许使用 console
      'no-class-assign': 2, // 禁止修改类声明的变量
      'no-cond-assign': 2, // 禁止条件表达式中出现赋值操作符
      'no-const-assign': 2, // 禁止修改 const 声明的变量
      'no-control-regex': 0, // 允许在正则表达式中使用控制字符
      'no-delete-var': 2, // 禁止删除变量
      'no-dupe-args': 2, // 禁止在 function 定义中出现重复的参数
      'no-dupe-class-members': 2, // 禁止类成员中出现重复的名称
      'no-dupe-keys': 2, // 禁止对象字面量中出现重复的键
      'no-duplicate-case': 2, // 禁止 switch 语句中的重复 case
      'no-empty-character-class': 2, // 禁止在正则表达式中使用空字符集
      'no-empty-pattern': 2, // 禁止使用空解构模式
      'no-eval': 2, // 禁止使用 eval()
      'no-ex-assign': 2, // 禁止在 catch 子句中重新分配异常变量
      'no-extend-native': 2, // 禁止扩展原生对象
      'no-extra-bind': 2, // 禁止不必要的 .bind() 调用
      'no-extra-boolean-cast': 2, // 禁止不必要的布尔转换
      'no-extra-parens': [2, 'functions'], // 仅在函数表达式周围禁止不必要的括号
      'no-fallthrough': 2, // 禁止 case 语句落空
      'no-floating-decimal': 2, // 禁止省略浮点数中的 0
      'no-func-assign': 2, // 禁止对 function 声明重新赋值
      'no-implied-eval': 2, // 禁止使用类似 eval() 的方法
      'no-inner-declarations': [2, 'functions'], // 禁止在嵌套的语句块中声明函数
      'no-invalid-regexp': 2, // 禁止在 RegExp 构造函数中使用无效的正则表达式
      'no-irregular-whitespace': 2, // 禁止不规则的空白
      'no-iterator': 2, // 禁止使用 __iterator__ 属性
      'no-label-var': 2, // 禁止标签与变量同名
      'no-labels': [2, { 'allowLoop': false, 'allowSwitch': false }], // 禁用标签语句
      'no-lone-blocks': 2, // 禁止不必要的嵌套块
      'no-mixed-spaces-and-tabs': 2, // 禁止空格和 tab 混合缩进
      'no-multi-spaces': 2, // 禁止使用多个空格
      'no-multi-str': 2, // 禁止多行字符串
      'no-multiple-empty-lines': [2, { 'max': 1 }], // 禁止多个空行
      'no-native-reassign': 2, // 禁止对原生对象或只读的全局对象重新赋值
      'no-negated-in-lhs': 2, // 禁止在 in 表达式中出现否定的左操作数
      'no-new-object': 2, // 禁止使用 Object 构造函数
      'no-new-require': 2, // 禁止调用 require 时使用 new 操作符
      'no-new-symbol': 2, // 禁止使用 Symbol 构造函数
      'no-new-wrappers': 2, // 禁止使用 String、Number 和 Boolean 的构造函数
      'no-obj-calls': 2, // 禁止将全局对象当作函数调用
      'no-octal': 2, // 禁止使用八进制字面量
      'no-octal-escape': 2, // 禁止在字符串中使用八进制转义序列
      'no-path-concat': 2, // 禁止对 __dirname 和 __filename 进行字符串拼接
      'no-proto': 2, // 禁止使用 __proto__ 属性
      'no-redeclare': 2, // 禁止多次声明同一变量
      'no-regex-spaces': 2, // 禁止在正则表达式中出现连续空格
      'no-return-assign': [2, 'except-parens'], // 禁止在 return 语句中赋值
      'no-self-assign': 2, // 禁止自我赋值
      'no-self-compare': 2, // 禁止自身比较
      'no-sequences': 2, // 禁止使用逗号操作符
      'no-shadow-restricted-names': 2, // 禁止将标识符定义为关键字或保留字
      'no-spaced-func': 2, // 禁止在函数标识符和其调用之间有空格
      'no-sparse-arrays': 2, // 禁止使用稀疏数组
      'no-this-before-super': 2, // 禁止在构造函数中在调用 super() 之前使用 this 或 super
      'no-throw-literal': 2, // 禁止抛出字面量作为异常
      'no-trailing-spaces': 2, // 禁止行尾空格
      'no-undef': 0, // 禁止未声明的变量
      'no-undef-init': 2, // 禁止将 undefined 赋值给变量
      'no-unexpected-multiline': 2, // 禁止使用令人困惑的多行表达式
      'no-unmodified-loop-condition': 2, // 禁止未被修改的循环条件
      'no-unneeded-ternary': [2, { 'defaultAssignment': false }], // 禁止不必要的三元操作符
      'no-unreachable': 2, // 禁止在 return、throw、continue 和 break 语句之后出现代码
      'no-unsafe-finally': 2, // 禁止在 finally 语句块中出现控制流语句
      'no-useless-call': 2, // 禁止不必要的 .call() 和 .apply()
      'no-useless-computed-key': 2, // 禁止在对象中使用不必要的计算属性
      'no-useless-constructor': 2, // 禁止不必要的构造函数
      'no-useless-escape': 0, // 允许在字符串和正则表达式中使用不必要的转义字符
      'no-whitespace-before-property': 2, // 禁止属性前有空格
      'no-with': 2, // 禁用 with 语句
      'one-var': [2, { 'initialized': 'never' }], // 强制每个变量独立声明
      'operator-linebreak': [2, 'after', { 'overrides': { '?': 'before', ':': 'before' }}], // 强制操作符使用一致的换行方式
      'padded-blocks': [2, 'never'], // 禁止块内填充空行
      'quotes': [2, 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }], // 强制使用单引号
      'semi': [2, 'always'], // 强制不使用分号
      'semi-spacing': [2, { 'before': false, 'after': true }], // 分号前后需要空格
      'space-before-blocks': [2, 'always'], // 强制在块之前加空格
      'space-before-function-paren': [2, 'never'], // 强制在函数括号前加空格
      'space-in-parens': [2, 'never'], // 强制在圆括号内不加空格
      'space-infix-ops': 2, // 强制在中缀操作符两侧加空格
      'space-unary-ops': [2, { 'words': true, 'nonwords': false }], // 强制在一元操作符前后加空格
      'spaced-comment': [2, 'always', { 'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','] }], // 强制注释前后加空格
      'template-curly-spacing': [2, 'never'], // 强制模板字符串的大括号内不加空格
      'use-isnan': 2, // 强制使用 isNaN() 检查 NaN
      'valid-typeof': 2, // 强制 typeof 表达式与有效字符串比较
      'wrap-iife': [2, 'any'], // 强制 IIFE 使用括号包裹
      'yield-star-spacing': [2, 'both'], // 强制在 yield* 表达式前后加空格
      'yoda': [2, 'never'], // 禁止 Yoda 条件
      'prefer-const': 2, // 强制使用 const 声明不会被修改的变量
      // 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // 禁用 debugger（生产环境）
      'object-curly-spacing': [2, 'always', { objectsInObjects: false }], // 强制在对象字面量的大括号内使用一致的空格
      'array-bracket-spacing': [2, 'never'] // 强制在数组括号内不加空格
    }
  }
];
