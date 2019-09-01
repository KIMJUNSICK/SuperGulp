import gulp from "gulp";
import gPug from "gulp-pug";
import image from "gulp-image";
import del from "del";
import ws from "gulp-webserver";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";

sass.compiler = require("node-sass");

const routes = {
  pug: {
    src: "src/*.pug",
    dest: "build",
    watch: "src/**/*.pug"
  },
  img: {
    src: "src/img/*",
    dest: "build/img"
  },
  styles: {
    src: "src/scss/styles.scss",
    dest: "build/css",
    watch: "src/scss/**/*.scss"
  }
};

const pug = () =>
  gulp
    .src(routes.pug.src)
    .pipe(gPug())
    .pipe(gulp.dest(routes.pug.dest));

const img = () =>
  gulp
    .src(routes.img.src)
    .pipe(image())
    .pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.styles.dest));

const clean = () => del(["build/"]);

const webServer = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.styles.watch, styles);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles]);

const live = gulp.parallel([webServer, watch]);

export const dev = gulp.series([prepare, assets, live]);
