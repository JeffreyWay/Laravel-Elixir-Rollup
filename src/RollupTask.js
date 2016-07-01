import gulp from 'gulp';
import Elixir from 'laravel-elixir';
import buffer from 'vinyl-buffer';
import rollup from 'rollup-stream';
import buble from 'rollup-plugin-buble';
import source from 'vinyl-source-stream';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

class RollupTask extends Elixir.Task {

    /**
     * Create a new RollupTask instance.
     *
     * @param  {string}      name
     * @param  {GulpPaths}   paths
     * @param  {object|null} options
     */
    constructor(name, paths, options) {
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
     * Run the files through Rollup.
     */
    rollup() {
        return rollup({
            entry: this.src.path,
            sourceMap: true,
            plugins: [
                nodeResolve({ browser: true }),
                commonjs({
                    include: 'node_modules/**'
                }),
                replace({
                    'process.env.NODE_ENV': JSON.stringify(Elixir.inProduction)
                }),
                buble()
            ]
        })
    }
}

export default RollupTask;
