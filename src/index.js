import Elixir from 'laravel-elixir';
import RollupTask from './RollupTask';

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

Elixir.extend('rollup', function(scripts, output, baseDir, options) {
    new RollupTask(
        'rollup', getPaths(scripts, baseDir, output), options
    );
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
    return new Elixir.GulpPaths()
        .src(src, baseDir || Elixir.config.get('assets.js.folder'))
        .output(output || Elixir.config.get('public.js.outputFolder'), 'all.js');
}
