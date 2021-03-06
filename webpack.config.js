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
	resolve: {
		extensions: ['.js', '.vue', '.json', '.scss', '.css'],
		modules: [path.resolve(APP_ROOT, 'src'), 'node_modules'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@components': path.resolve('./src/pages/components'),
		  }
	},
	module: {
		rules: [
			{
				test: /.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.(woff|svg|eot|ttf)\??.*$/,
				loader: 'url-loader'
			},
			{
				test: /\.sass$/,
				loaders: ['style', 'css', 'sass']
			  }

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