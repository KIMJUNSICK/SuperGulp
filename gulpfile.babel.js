import gulp from "gulp";
import gPug from "gulp-pug";
import image from "gulp-image";
import del from "del";
import ws from "gulp-webserver";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import babel from "babelify";
import bro from "gulp-bro";
import ghPages from "gulp-gh-pages";

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
  },
  js: {
    src: "src/js/main.js",
    dest: "build/js",
    wath: "src/**/*.js"
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

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babel.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }]
        ]
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const clean = () => del(["build/", ".publish"]);

const webServer = () => gulp.src("build").pipe(ws({ livereload: true }));

const gh = () => gulp.src("build/**/*").pipe(ghPages());

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.styles.watch, styles);
  gulp.watch(routes.js.wath, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const live = gulp.parallel([webServer, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gh, clean]);
