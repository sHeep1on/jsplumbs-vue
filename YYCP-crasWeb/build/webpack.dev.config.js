const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const package = require('../package.json');

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'chinaoly v' + package.version,
            filename: '../index.html',
            inject: false,
        })
    ],
    devServer: {
        port:8082,
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: { colors: true },
        proxy: {
            //统一登录
            '/api/v1': {
                target: 'http://192.168.0.71:7081',
                //路径重写
                pathRewrite: { '^/api/v1': '/' },
                changeOrigin: true
            },
            //关系后台
            '/api/v2': {
                target: 'http://192.168.0.71:7100',
                //路径重写
                pathRewrite: { '^/api/v2': '/' },
                changeOrigin: true
            },
            '/api/v3': {
                target: 'http://192.168.0.71:7080',
                //路径重写
                pathRewrite: { '^/api/v3': '/' },
                changeOrigin: true
            },
            '/api/v4': {
                target: 'http://192.168.43.45:7100',
                //路径重写
                pathRewrite: { '^/api/v4': '/' },
                changeOrigin: true
            },
            '/api/urlImage': {
                target:  'http://192.168.0.71:7100/uploads',
                pathRewrite: { '^/api/urlImage': '/' },
                changeOrigin: true
            },
            '/api/urlImage/pict': {
                target:  'http://192.168.0.71:8087/pict',
                pathRewrite: { '^/api/urlImage/pict': '/' },
                changeOrigin: true
            },
            '/uploads': {
                target:  'http://192.168.0.71:7100/uploads',
                pathRewrite: { '^/uploads': '/' },
                changeOrigin: true
            },
            '/api/calc':{
                target:'http://192.168.52.170:8882',
                pathRewrite: { '^/api/calc': '/' },
                changeOrigin: true
            }
        }
    }

});
