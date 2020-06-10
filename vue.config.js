/************************************************************************
                              vue-cli 自定义配置
*************************************************************************/

module.exports = {
  //放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
  assetsDir: './public',

  //指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
  indexPath: 'index.html',

  pages: {
    // pages 里配置的路径和文件名在你的文档目录必须存在 否则启动服务会报错
    index: {
      // 除了 entry 之外都是可选的，page 的入口,每个“page”应该有一个对应的 JavaScript 入口文件
      entry: `example/main.js`,
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时,在 template 中使用：<title><%= htmlWebpackPlugin.options.title %></title>
      title: '测试',
      // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      //根据环境引入不同(开发版/生成版)版本vue(cdn)
    },
  },

  // 是否在保存的时候检查
  lintOnSave: false,

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,

  publicPath: './',
  runtimeCompiler: undefined,
  parallel: undefined,
};
