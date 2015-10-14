var gulp = require("gulp"),
	del = require("del"),
	inject = require("gulp-inject"),
	typescript = require("gulp-typescript"),
	ngAnnotate = require("gulp-ng-annotate"),
	runSequence = require("run-sequence"),
	series = require('stream-series');

var cfg = {
	distDir: "dist",
	distLib: "dist/lib",
	src: {
		users: ["src/modules/users/module.ts", "src/modules/users/**/*.ts"]
	},
	distFiles: [
		"dist/lib/angular/angular.js",
		"dist/lib/angular-animate/angular-animate.js",
		"dist/lib/angular-aria/angular-aria.js",
		"dist/lib/angular-material/angular-material.js",
		"dist/lib/angular-material/angular-material.css",
		"dist/assets/app.css",
		"dist/modules/Users/Users.js",
		"dist/modules/Users/*.js"]

};

gulp.task("build:dev", function (callback) {
	return runSequence(
		"default:clean",
		"default:copy",
		"build:typescript",
		"build:index",
		callback);
});

gulp.task("build:index", function () {
	var target = gulp.src('src/index.html');
	var sources = gulp.src(cfg.distFiles, { read: false });

	return target.pipe(inject(sources, {
		transform: function (filePath) {
			var start = "/dist/".length;
			arguments[0] = filePath.substring(start, filePath.length);
			return inject.transform.apply(inject.transform, arguments);
		}
	})).pipe(gulp.dest("dist"));
});

gulp.task("build:typescript", function () {
	return gulp.src(["src/**/*.ts", "typings/**/*.d.ts"])
		.pipe(typescript({}))
		.pipe(ngAnnotate())
		.pipe(gulp.dest(cfg.distDir));
})

gulp.task("default:copy", function (callback) {
	return runSequence(
		"default:copy:lib",
		"default:copy:assets",
		"default:copy:views",
		callback);
});

gulp.task("default:copy:views", function () {

	// gulp.src(["src/app/**/*.html", ])
	// 	.pipe(gulp.dest(cfg.dist + "/app"));

	return gulp.src("src/modules/**/*.html")
		.pipe(gulp.dest(cfg.distDir + "/modules"));
});

gulp.task("default:copy:assets", function () {
	return gulp.src(["src/assets/**/*"])
		.pipe(gulp.dest(cfg.distDir + "/assets"));
});

gulp.task("default:copy:lib", function () {
	return gulp.src(["src/lib/**/*"])
		.pipe(gulp.dest(cfg.distLib));
});

/**
 * Löschen des Ausgabeverzeichnisses von allen Artefakten
 */
gulp.task("default:clean", function () {
	return del(cfg.distDir);
});