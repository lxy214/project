let path = require('path');
let webpack = require('webpack');
let { VueLoaderPlugin } = require('vue-loader') 
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/main.js', //关于path模块可以看看阮一峰的教程  http://javascript.ruanyifeng.com/nodejs/path.html#toc0
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	mode: 'development', // development 打包开发环境  production 正式环境
	module: {
		rules: [
			{
				test: /.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /.css$/,
				use: [
				  'css-loader',
				  'style-loader',
				  {
					loader: 'postcss-loader',
					options: {
					  sourceMap: true //启用源映射支持，postcss-loader将使用其他加载器给出的先前源映射并相应地更新它
					}
				  }
				]
			  },

		]
	},
	devServer: {
		publicPath: '/dist',
		open: false,
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin()
	  ]
}