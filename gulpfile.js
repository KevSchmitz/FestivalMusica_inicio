// Son las funciones dde GULP
const {src, dest, watch, parallel} = require('gulp'); 

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer =  require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

// IMÁGENES
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// JAVASCRIPT
const terser = require('gulp-terser-js');

function css(done) {
    src('src/scss/**/*.scss') // Identificar  el archivo .SCSS a compilar
        .pipe(sourcemaps.init() )
        .pipe( plumber() ) // A pesar de que aparezca un error sigue ejecutando tareas
        .pipe( sass() ) // Compilar el archivo.
        .pipe( postcss ([ autoprefixer(), cssnano() ]) )
        .pipe(sourcemaps.write('.') )
        .pipe( dest('build/css') ) // Almacenar el archivo en el disco duro

    done();
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{jpg,png}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{jpg,png}') // Identificar el archivo
        .pipe(webp(opciones))
        .pipe(dest('build/img'))

    done();
}

function versionAvif(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{jpg,png}') // Identificar el archivo
        .pipe(avif(opciones))
        .pipe(dest('build/img'))

    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css); // qué archivo le voy a dar watch y que función estará asociada
    watch('src/js/**/*.js', javascript); // qué archivo le voy a dar watch y que función estará asociada
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
