import gulp from "gulp";
import gPug from "gulp-pug";
import image from "gulp-image";
import del from "del";
import ws from "gulp-webserver";

const routes = {
  pug: {
    src: "src/*.pug",
    dest: "build",
    watch: "src/**/*.pug"
  },
  img: {
    src: "src/img/*",
    dest: "build/img"
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

const clean = () => del(["build/"]);

const webServer = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);

const live = gulp.parallel([webServer, watch]);

export const dev = gulp.series([prepare, assets, live]);
