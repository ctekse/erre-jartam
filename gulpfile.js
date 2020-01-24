"use strict";
const { src, watch, series, dest } = require('gulp');
let typescript = require("gulp-typescript");
let tslint = require("gulp-tslint");
let rimraf = require("rimraf");
var sourcemaps = require('gulp-sourcemaps');

const TS_SRC_GLOB = "./src/**/*.ts";

const tsProject = typescript.createProject("tsconfig.json");

// ###### CLEAN ######

// Removes the ./build directory with all its content.
function cleanBuild(cb){
    rimraf("./build", cb);
} 

// ###### LINTING ######

// Checks all *.ts-files if they are conform to the rules specified in tslint.json.
function tsLint(){
    return src(TS_SRC_GLOB)
        .pipe(tslint({ formatter: "verbose" }))
        .pipe(tslint.report({
            // set this to true, if you want the build process to fail on tslint errors.
            emitError: false
        }));
}

// ###### COMPILE ######

// Compiles all *.ts-files to *.js-files.
function compileTypeScript () {
    return src(TS_SRC_GLOB, { base: "." })
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(dest("."));
}

// ###### WATCH ######

// Runs the build task and starts the server every time changes are detected.
function watchFiles(cb){
    watch('src/*', series(cleanBuild, tsLint, compileTypeScript));
    cb();
}

exports.tsLint = tsLint;
exports.compileTypeScript = compileTypeScript;
exports.watchFiles = watchFiles;
exports.build = series(cleanBuild, /*tsLint,*/ compileTypeScript);
exports.default = series(cleanBuild, /*tsLint,*/ compileTypeScript);