const path = require('path');
const  HtmlWebpackPlugin = require('html-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: 'build.[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module:{
        rules:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(s[ca]ss)|(css)$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [{
                  /* inline if smaller than 10 KB, otherwise load as a file */
                  loader: 'url-loader',
                  options: {
                    limit: 10000
                  }
                }]
              },
              { 
                test: /\.(eot|svg|ttf|woff2?|otf)$/,
                use: 'file-loader'
              }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin(
            {
                template: path.join(__dirname,'/src/index.html')
            }
        ),
        new RemovePlugin({
            before: {
                root: ".",
                allowRootAndOutside: true,
                test: [
                    {
                        folder: './dist',
                        method: () => true,
                        recursive: true
                    },
                    {
                        folder: './../testcases/static',
                        method: (absPath) => new RegExp(/(.*)\.js/).test(absPath)
                    },
                    {
                        folder: './../testcases/templates',
                        method: (absPath) => new RegExp(/index\.html/).test(absPath),
                        recursive: true
                    }
                ]
            }
        }),
        new FileManagerPlugin({
            onEnd: {
                copy:[
                    { source: './dist/*.js', destination: './../testcases/static' },
                    { source: './dist/index.html', destination: './../testcases/templates/index.html' }
                ]
            }
        })
    ],
    externals: {
        config: JSON.stringify({
            apiUrl: 'http://localhost:5000/api/v1',
            authUrl: 'http://localhost:5000/api/v1/auth'
        })
    }
}