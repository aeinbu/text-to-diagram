const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'text-to-diagram',
		}),
	],
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/
			}, {
				test: /\.ts?$/,
				use: ['ts-loader'],
				exclude: /node_modules/,
			}, {
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	}, output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
};