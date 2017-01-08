const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');

const ENV = require('./env');
const readFileSync = require("fs").readFileSync;

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'www'),
    onsencss: path.join(__dirname, 'node_modules/onsenui')
};

process.env.BABEL_ENV = ENV;

const common = {
    entry: [PATHS.src, PATHS.onsencss, 'whatwg-fetch'],
    output: {
        path: PATHS.build,
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                //include: PATHS.src,
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {test: /\.(ttf|eot|svg|jpg|jpeg|gif|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"},
            {
                test: /\.jsx?$/,
                loader: 'babel?cacheDirectory',
                include: PATHS.src,
            },
            {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'}
        ],
    },
    plugins: [
        new CopyWebpackPlugin([{from: PATHS.src + '/index.html'}], {            copyUnmodified: true}),
        new WebpackAutoInject({injectByTag: false, injectAsComment: false}), //Just use auto increment
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(JSON.parse(readFileSync(path.normalize('package.json'), 'utf8')).version)
        })
    ]
};

if (ENV === 'development') {
    module.exports = merge(common, {
        devServer: {
            contentBase: PATHS.build,

            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            // Parse host and port from env so this is easy to customize.
            host: process.env.HOST,
            port: process.env.PORT,
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ],
    });
} else {
    // config can be added here for minifying / etc
    module.exports = merge(common, {});
}
