const path = require('path')

module.exports =
    process.env.NODE_ENV === 'production'
        ? {
              publicPath: '/dist/',
              configureWebpack: {
                  optimization: {
                      splitChunks: false
                  },
                  entry: './src/components/clamp',
                  // 输出
                  output: {
                      // path.resolve() 方法将路径或路径片段的序列解析为绝对路径。
                      // __dirname 当前模块的目录名
                      path: path.resolve(__dirname, 'dist'),
                      // 决定了每个输出 bundle 的名称
                      filename: 'index.min.js',
                      publicPath: '/dist/',
                      // libraryTarget: 'umd' - 将你的 library 暴露为所有的模块定义下都可运行的方式。它将在 CommonJS, AMD 环境下运行，或将模块导出到 global 下的变量
                      // 省略 library 会导致将入口起点返回的所有属性，直接赋值给 root 对象
                      libraryTarget: 'umd'
                  }
              },
              css: {
                  extract: false
              }
          }
        : {}
