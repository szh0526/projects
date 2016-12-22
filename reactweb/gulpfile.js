let gulp = require('gulp');
let less = require('gulp-less');
let babel = require('gulp-babel');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let changed = require('gulp-changed');
let newer = require('gulp-newer');
let cleanCSS = require('gulp-clean-css');
let del = require('del');

const paths = {
    styles: {
        src: 'app/css/**/*.less',
        dest: 'build/css/'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/css/'
    }
};

/**
 * 并非所有的任务都是基于流，例如删除文件
 * 一个 gulpfile 只是一个 Node 程序，在 gulpfile 中可以使用任何 npm 中的模块或者其他 Node.js 程序
 */
function clean() {
    // del 也可以和 `gulp.src` 一样可以基于模式匹配的文件路径定义方式 
    return del(['assets']);
}

/*
 * 通过 Javascript 函数的方式定义任务
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        // 传递一些配置选项到 stream 中
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

/**
 * 编译 coffee 文件，然后压缩代码，然后合并到 all.min.js
 * 并生成 coffee 源码的 sourcemap
 * 流的入口 gulp.src
 * 流的出口 gulp.dest
 */
function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function images() {
    var dest = 'build/img';
    return gulp.src(paths.images)
        .pipe(newer(dest)) // 找出新增加的图像
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(dest));
}

/**
 * 监控文件，当文件改变过后做对应的任务
 * @param globs [String | Array] 需要监控的文件 globs 
 * @param opts [Object] https://github.com/paulmillr/chokidar 的配置参数，
 * @return {[type]} [description]
 */
function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}

/*
 * 使用 CommonJS `exports` 模块的方式定义任务
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

/*
 * 确定任务是以并行还是串行的方式定义任务
 * gulp.parallel: 并行执行 任务执行完成可以添加回调函数
 * gulp.series: 串行执行
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * 除了 export 的方式，也可以使用 gulp.task 的方式定义任务
 */
gulp.task('build', build);

/*
 * 定义默认任务，默认任务可以直接通过 gulp 的方式调用
 */
gulp.task('default', build);

/**
 * 复制最新的HTML文件到dist目录中
 * @return {[type]} [description]
 */
function html() {
    return gulp.src(src.html)
        .pipe(gulp.dest(dist.html))
}


/**
 * production 任务中添加了压缩和打包优化组件，且没有 sourcemap
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function webpackProduction(done) {
    var config = Object.create(webpackConfig);
    //扩展webpack插件
    config.plugins = config.plugins.concat(
        // 备案
        new webpack.BannerPlugin('(招聘前端) => {QQ：340636803}'),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": "production"
            }
        }),
        new webpack.optimize.DedupePlugin(),
        //去除console,debugger
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        })
    );

    webpack(config, function(err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:production]", stats.toString({
            colors: true
        }));
        done();
    });
}


/**
 * webpack开发环境配置
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
var devConfig, devCompiler;

devConfig = Object.create(webpackConfig);
devConfig.devtool = "sourcemap";
devConfig.debug = true;
devCompiler = webpack(devConfig);

/**
 * 根据webpack配置运行开发配置并打印日志
 */
function webpackDevelopment(done) {
    devCompiler.run(function(err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack:build-dev", err);
            return;
        }
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        done();
    });
}

/**
 * 启动 webpack 开发环境服务 
 */
function webpackDevelopmentServer(done) {
    new WebpackDevServer(devCompiler, {
        contentBase: dist.root,
        lazy: false,
        hot: true
    }).listen(server.port, 'localhost', function(err) {
        if (err) throw new gutil.PluginError('webpack-dev-server', err)
        gutil.log('[webpack-dev-server]', 'http://localhost:/' + server.port)
        reload();
        done();
    });
}

/**
 * [connectServer description]
 * @return {[type]} [description]
 */
function connectServer(done) {
    connect.server({
        root: dist.root,
        port: server.port,
        livereload: true,
        middleware: function(connect, opt) {
            return [rest.rester({
                context: "/"
            })]
        }
    });
    mocks(rest);
    done();
}

/**
 *  文件监听
 * @return {[type]} [description]
 */
function watch() {
    gulp.watch(src.html, html);
    gulp.watch("src/**/*.js", webpackDevelopment);
    gulp.watch("src/**/*.less", style);
    gulp.watch("dist/**/*").on('change', function(file) {
        gulp.src('dist/')
            .pipe(connect.reload());
    });
}

/**
 * default task
 */
gulp.task("default", gulp.series(
    clean,
    gulp.parallel(copyAssets, copyVendor, html, style, webpackDevelopment),
    connectServer,
    watch
));

/** 
 * production build task
 */
gulp.task("build", gulp.series(
    clean,
    gulp.parallel(copyAssets, copyVendor, html, style, webpackProduction),
    cleanBin,
    copyDist,
    function(done) {
        console.log('build success');
        done();
    }
));

/**
 * [reload description]
 * @return {[type]} [description]
 */
function reload() {
    connect.reload();
}