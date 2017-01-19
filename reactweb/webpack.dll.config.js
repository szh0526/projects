/**
 * dll动态链接库
 * DLLPlugin 通过前置依赖包的构建，来提高真正的 build 和 rebuild 的构建效率。 可以解决重复打包的问题
 * 将一些模块预编译，类似windows里的dll，可以在项目中直接使用，无需再构建。
 * 注意要在output中指定 library ，并在DllPlugin中指定与其一致的 name ，
 * 在有多个入口时可以使用 [name] 和 [hash] 来区分，因为这个参数是要赋值到global上的，所以这里使用 [hash] 不容易出现变量名冲突的情况。
 * react 和 react-dom 打包成为 dll bundle。
 * 命令行: npm run builddll
 * 坑: webpackJsonp is not defined？ 是没有引入CommonsChunkPlugin生成的公共文件
 * 此配置：实现react 和 react-dom 放入全局变量(window.React window.ReactDOM) 生成vendor.dll.js文件
 */
const path = require('path');
const webpack = require('webpack');
const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.join(ROOT_PATH, process.env.NODE_ENV === 'production' ? '/bin/src/common/dll' : '/dist/src/common/dll');

module.exports = {
  entry: {
    vendor: ['react','react-dom','jquery']
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].dll.js',
    /**
     * output.library
     * 将会定义为 window.${output.library}
     * 在这次的例子中，将会定义为`window.vendor_library`
     */
    library: '[name]_library'
  },
  plugins: [
    /**
    * path 是 manifest.json 文件的输出路径，这个文件会用于后续的业务代码打包；
    * name 是 dll 暴露的对象名，要跟 output.library 保持一致；
    * context 是解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致。
    */
    new webpack.DllPlugin({
      /**
       * path
       * 定义 manifest 文件的输出路径
       * 该文件用于后续的业务代码打包
       * [name]的部分由entry的名字替换
       */
      path: path.join(BUILD_PATH, '[name]-manifest.json'),
      /**
       * name
       * 是 dll 暴露的对象名
       * 要跟 output.library 保持一致。
       */
      name: '[name]_library',
      /**
       * context
       * 是解析包路径的上下文，这个要跟接下来配置的
       * 要跟配置的 webpack.config.js中 webpack.DllReferencePlugin 路径保持一致
       */
      context: ROOT_PATH
    })
  ]
};