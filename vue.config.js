// const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const envDistUrl = [
  'dist',
  process.env.NODE_ENV === 'production' ? '/build' : '/dev',
  '/' + process.env.UNI_PLATFORM
].join('')
console.log(envDistUrl)
module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        // （微信小程序端） 处理uni-app 打包时 未将 sitemap.json 文件一起打进去的情况
        {
          from: path.join(__dirname, 'sitemap.json'),
          to: path.join(__dirname, envDistUrl)
        },
        {
          from: path.join(__dirname, 'src/components/images'),
          to: path.join(__dirname, envDistUrl + '/images')
        }
      ])
    ]
  },
  chainWebpack: config => {
    // 启用了压缩时（添加命令  --minimize）会生效 建议在发布时采用
    config.optimization.minimizer('terser').tap(args => {
      const compress = args[0].terserOptions.compress
      // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
      compress.drop_console = true
      compress.pure_funcs = [
        '__f__' // App 平台 vue 移除日志代码
        // 'console.debug' // 可移除指定的 console 方法
      ]
      return args
    })

    // 删除CSS 压缩插件 （Uni-app 在生成打包时会启用此插件，导致css 样式和开发环境不一致，建议删除）
    config.plugins.delete('optimize-css')

    // 设置别名
    config.resolve.alias.set('@_com', resolve('src/components'))
  }
}
