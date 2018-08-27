'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _underscore = require('underscore');

var _laravelElixir = require('laravel-elixir');

var _laravelElixir2 = _interopRequireDefault(_laravelElixir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buffer = void 0,
    inject = void 0,
    _rollup = void 0,
    buble = void 0,
    vue = void 0,
    source = void 0,
    replace = void 0,
    commonjs = void 0,
    nodeResolve = void 0,
    multiEntry = void 0,
    cache = void 0;

var RollupTask = function (_Elixir$Task) {
    _inherits(RollupTask, _Elixir$Task);

    /**
     * Create a new RollupTask instance.
     *
     * @param  {string}      name
     * @param  {GulpPaths}   paths
     * @param  {object|null} options
     */
    function RollupTask(name, paths) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, RollupTask);

        var _this = _possibleConstructorReturn(this, (RollupTask.__proto__ || Object.getPrototypeOf(RollupTask)).call(this, name, null, paths));

        options.defaultPluginOptions = options.defaultPluginOptions || {};
        _this.options = options;

        if (_fs2.default.existsSync('rollup.config.js')) {
            _this.rollupConfig = require(process.cwd() + '/rollup.config.js');
        }
        return _this;
    }

    /**
     * Build up the Gulp task.
     */


    _createClass(RollupTask, [{
        key: 'gulpTask',
        value: function gulpTask() {
            return this.rollup().on('error', this.onError()).pipe(source(this.output.name)).pipe(buffer()).pipe(this.minify()).on('error', this.onError()).pipe(this.initSourceMaps({ loadMaps: true })).pipe(this.writeSourceMaps()).pipe(this.saveAs(_gulp2.default));
        }

        /**
         * Register file watchers.
         */

    }, {
        key: 'registerWatchers',
        value: function registerWatchers() {
            this.watch(this.src.baseDir + '/**/*.+(js|vue|jsx)').ignore(this.output.path);
        }

        /**
         * Lazy load the task dependencies.
         */

    }, {
        key: 'loadDependencies',
        value: function loadDependencies() {
            buffer = require('vinyl-buffer');
            _rollup = require('rollup-stream');
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

    }, {
        key: 'rollup',
        value: function rollup() {
            var _this2 = this;

            this.recordStep('Transforming ES2015 to ES5');
            this.recordStep('Bundling');

            var loadPlugin = function loadPlugin(plugin, options) {
                var realOptions = (0, _underscore.extend)(options || {}, _this2.options.defaultPluginOptions[plugin.name] || {});
                if ((0, _underscore.isEmpty)(realOptions)) {
                    realOptions = undefined;
                }

                return plugin(realOptions);
            };

            var plugins = [loadPlugin(inject, {
                include: './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
                jQuery: 'jQuery'
            }), loadPlugin(multiEntry), loadPlugin(nodeResolve, { browser: true, main: true, jsnext: true }), loadPlugin(commonjs, {
                include: ['node_modules/**', this.src.baseDir + '/**']
            }), loadPlugin(replace, {
                'process.env.NODE_ENV': JSON.stringify(_laravelElixir2.default.inProduction)
            }), loadPlugin(vue), loadPlugin(buble)].concat(this.options.plugins || []);

            delete this.options.defaultPluginOptions;
            delete this.options.plugins;

            return _rollup((0, _underscore.extend)({
                entry: this.src.path,
                cache: cache,
                sourcemap: true,
                format: 'iife',
                name: 'LaravelElixirBundle',
                plugins: plugins
            }, this.rollupConfig, this.options)).on('bundle', function (bundle) {
                cache = bundle;
            });
        }
    }]);

    return RollupTask;
}(_laravelElixir2.default.Task);

exports.default = RollupTask;