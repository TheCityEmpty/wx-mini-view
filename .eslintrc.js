module.exports = {
  root: true, //此项是用来告诉eslint找当前配置文件不能往父级查找
  extends: ['plugin:vue/essential', '@vue/standard', 'plugin:vue/base'],
  //此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
  //此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: { 
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 8
  },
  // 下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'no-tabs': 'off',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    // allow debugger during development
    'no-debugger': 'error',
    'vue/no-parsing-error': [1, { 'x-invalid-end-tag': false }]
  },
  // 全局的设置， 这里代表 这些字母的 不进行校验， 案例: 在uni-app中写小程序，比如微信小程序， 自带全局变量 wx ,eslint 
  // 会校验他是个未定义的变量
  globals: {
    'uni': true,
    'wx': true
  }
}