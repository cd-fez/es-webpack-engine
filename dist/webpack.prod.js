"use strict";var _webpack=_interopRequireDefault(require("webpack"));var _progressBarWebpackPlugin=_interopRequireDefault(require("progress-bar-webpack-plugin"));var _esWebpackNotifier=_interopRequireDefault(require("es-webpack-notifier"));var _webpackNotifier=_interopRequireDefault(require("webpack-notifier"));var _webpack2=_interopRequireDefault(require("./webpack.base"));var _logger=_interopRequireDefault(require("./config/logger"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj};}_logger["default"].info('building for production...');var compiler=(0,_webpack["default"])(_webpack2["default"],function(err,stats){if(err)throw err;});new _webpackNotifier["default"]().apply(compiler);new _progressBarWebpackPlugin["default"]().apply(compiler);