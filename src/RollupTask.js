import fs from 'fs';
import gulp from 'gulp';
import {extend} from 'underscore';
import Elixir from 'laravel-elixir';

let buffer, inject, rollup, buble, vue, source, replace, commonjs, nodeResolve, multiEntry, cache;

class RollupTask extends Elixir.Task {

    /**
     * Create a new RollupTask instance.
     *
     * @param  {string}      name
     * @param  {GulpPaths}   paths
     * @param  {object|null} options
     */
    constructor(name, paths, options = {}) {
        super(name, null, paths);

        this.options = options;

        if (fs.existsSync('rollup.config.js')) {
            this.rollupConfig = require(process.cwd()+'/rollup.config.js');
        }
    }

    /**
     * Build up the Gulp task.
     */
    gulpTask() {
        return this.rollup()
            .on('error', this.onError())
            .pipe(source(this.output.name))
            .pipe(buffer())
            .pipe(this.minify())
            .on('error', this.onError())
            .pipe(this.initSourceMaps({ loadMaps: true }))
            .pipe(this.writeSourceMaps())
            .pipe(this.saveAs(gulp));
    }


    /**
     * Register file watchers.
     */
    registerWatchers() {
        this.watch(this.src.baseDir + '/**/*.+(js|vue|jsx)')
            .ignore(this.output.path);
    }


    /**
     * Lazy load the task dependencies.
     */
    loadDependencies() {
        buffer = require('vinyl-buffer');
        rollup = require('rollup-stream');
        vue = require('rollup-plugin-vue');
        buble = require('rollup-plugin-buble');
        source = require('vinyl-source-stream');
        replace = require('rollup-plugin-replace');
        commonjs = require('rollup-plugin-commonjs');
        nodeResolve = require('rollup-plugin-node-resolve');
        inject = require('rollup-plugin-inject');
        multiEntry = require('rollup-plugin-multi-entry');
    }


    /**
     * Run the files through Rollup.
     */
    rollup() {
        this.recordStep('Transforming ES2015 to ES5');
        this.recordStep('Bundling');

        var plugins = [
            inject({
                include: './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
                jQuery: 'jQuery'
            }),
            multiEntry(),
            nodeResolve({ browser: true, main: true, jsnext: true }),
            commonjs({
                include: [
                    'node_modules/**',
                    this.src.baseDir + '/**'
                ]
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(Elixir.inProduction)
            }),
            vue(),
            buble()
        ].concat(this.options.plugins || []);

        delete this.options.plugins

        return rollup(
            extend({
                entry: this.src.path,
                cache: cache,
                sourcemap: true,
                format: 'iife',
                name: 'LaravelElixirBundle',
                plugins: plugins
            }, this.rollupConfig, this.options)
        )
        .on('bundle', function (bundle) {
            cache = bundle;
        });
    }
}

export default RollupTask;
