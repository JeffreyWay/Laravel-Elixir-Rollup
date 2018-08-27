'use strict';

var _laravelElixir = require('laravel-elixir');

var _laravelElixir2 = _interopRequireDefault(_laravelElixir);

var _RollupTask = require('./RollupTask');

var _RollupTask2 = _interopRequireDefault(_RollupTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 |----------------------------------------------------------------
 | Rollup Bundling
 |----------------------------------------------------------------
 |
 | Rollup is a next-generation module bundler. Author your app
 | or library using ES2015 modules, then efficiently bundle
 | them up into a single file to use within any browser.
 |
 */

_laravelElixir2.default.extend('rollup', function (scripts, output, baseDir, options) {
    new _RollupTask2.default('rollup', getPaths(scripts, baseDir, output), options);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  baseDir
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
function getPaths(src, baseDir, output) {
    return new _laravelElixir2.default.GulpPaths().src(src, baseDir || _laravelElixir2.default.config.get('assets.js.folder')).output(output || _laravelElixir2.default.config.get('public.js.outputFolder'), 'all.js');
}