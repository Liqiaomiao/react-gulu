const base = require('./webpack.config');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = Object.assign({},base,{
    mode: 'production',
    entry: './example.tsx',
    plugins: [
        new HtmlWebpackPlugin({
            template: 'example.html',
            filename: 'index.html'
        })
    ],
    output: {
        path: path.resolve(__dirname,'doc')
    },
});
