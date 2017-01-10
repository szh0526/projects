/**
 * DLLPlugin 通过前置依赖包的构建，来提高真正的 build 和 rebuild 的构建效率。
 * 将一些模块预编译，类似windows里的dll，可以在项目中直接使用，无需再构建。
 * 注意要在output中指定 library ，并在DllPlugin中指定与其一致的 name ，
 * 在有多个入口时可以使用 [name] 和 [hash] 来区分，因为这个参数是要赋值到global上的，所以这里使用 [hash] 不容易出现变量名冲突的情况。
 * react 和 react-dom 打包成为 dll bundle。
 * 命令行: npm run builddll
 * 坑: webpackJsonp is not defined？ 是没有引入CommonsChunkPlugin生成了公共文件
 * 此配置：实现react 和 react-dom 放入全局变量(window.React window.ReactDOM) 生成vendor.dll.js文件
 */
const path = require('path');
const webpack = require('webpack');
const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
  entry: {
    vendor: ['react', 'react-dom']
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
    new webpack.DllPlugin({
      /**
       * path
       * 定义 manifest 文件生成的位置
       * [name]的部分由entry的名字替换
       */
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library 一样即可。
       */
      name: '[name]_library'
    })
  ]
};