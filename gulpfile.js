var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin =require('gulp-cssmin');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var disthpath = __dirname;//项目跟目录
var sasspath = disthpath+'/src/sass';//sass目录
var csspath = disthpath+'/src/css';

//gulp.task('concat', function() {                                //- 创建一个名为 concat 的 task
//    gulp.src(['./css/global.css'])    //- 需要处理的css文件，放到一个字符串数组里     //- 压缩处理成一行
//        .pipe(rev())                                            //- 文件名加MD5后缀
//        .pipe(gulp.dest('./css'))                               //- 输出文件本地
//        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
//        .pipe(gulp.dest('./rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内
//});
//
//gulp.task('rev', function() {
//    gulp.src(['./rev/*.json', './index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
//        .pipe(revCollector())                                   //- 执行文件内css名的替换
//        .pipe(gulp.dest(disthpath));                     //- 替换后的文件输出的目录
//});
//gulp.task('default', ['concat', 'rev']);

//md5-plus 更新版本添加md5后缀
// gulp.task('md5js', function (done) {
//     gulp.src(csspath+'/*.css')
//         .pipe(md5p(10, ['index.html','checkin.html']))
//         .pipe(gulp.dest(csspath))
//         .on('end', done);
// });

//编译sass文件
gulp.task('buildcss',function(){
    return gulp.src(sasspath+'/*.scss').
    pipe(sass()).
    pipe(gulp.dest(csspath))
})

//监听文件变化自动执行任务
// gulp.watch(sasspath+'/*.scss',['buildcss']);
gulp.watch(sasspath+'/agent.scss',['buildcss']);
