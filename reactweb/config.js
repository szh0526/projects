/**
    全局动态配置路径
 */
const ENV_BOOLEAN = (process.env.NODE_ENV == 'production') ? true : false;
let path = require('path'),
    buildPath = ENV_BOOLEAN ? 'bin' : 'dist',
    rootPath = path.resolve(__dirname),
    dllPath = path.join(rootPath, '/' + buildPath + '/js/common/dll'),
    contentPath = path.resolve(rootPath, buildPath);

module.exports = {
    //是否生产环境
    isProduction: ENV_BOOLEAN,
    //文件输出名称
    fileName: ENV_BOOLEAN ? '[name].min.js' : '[name].js',
    //express 默认3000端口
    apiHost: "http://localhost:3000",
    //mock服务 端口9999
    mockHost: "http://localhost:9999",
    //CDN地址 此路径后面的/必须加 否则devserver启动异常
    publicPath: "http://localhost:8089/",
    //项目根路径
    rootPath: rootPath,
    //源文件路径
    appPath: path.resolve(rootPath, 'src'),
    //静态服务器源路径
    contentPath: contentPath,
    //构建路径
    buildPath: buildPath,
    //dll构建路径
    dllPath: dllPath,
    //dll映射路径
    mainfestPath: path.join(dllPath + '/vendor-manifest.json'),
    //雪碧图
    sprites: {
        src: {
            //图片源路径
            cwd: path.resolve(rootPath, 'src/images/'),
            glob: '*.png'
        },
        target: {
            //图片生成路径
            image: path.resolve(rootPath, buildPath + '/images/sprite.png'),
            //样式生成路径
            css: path.resolve(rootPath, buildPath + '/css/sprite.css')
        },
        apiOptions: {
            //sprite.css中url
            cssImageRef: '../images/sprite.png'
        },
        spritesmithOptions: {
            //top-down 雪碧图生成竖排
            /*algorithm: 'top-down'*/
        }
    }
};