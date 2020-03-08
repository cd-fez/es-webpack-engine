"use strict";function _typeof(obj){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj;};}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};}return _typeof(obj);}Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _path=_interopRequireDefault(require("path"));var _webpack=_interopRequireDefault(require("webpack"));var _webpackMerge=_interopRequireDefault(require("webpack-merge"));var _webpackAssetsManifest=_interopRequireDefault(require("webpack-assets-manifest"));var _copyWebpackPlugin=_interopRequireDefault(require("copy-webpack-plugin"));var _webpackBundleAnalyzer=require("webpack-bundle-analyzer");var _friendlyErrorsWebpackPlugin=_interopRequireDefault(require("friendly-errors-webpack-plugin"));var _optimizeCssAssetsWebpackPlugin=_interopRequireDefault(require("optimize-css-assets-webpack-plugin"));var _miniCssExtractPlugin=_interopRequireDefault(require("mini-css-extract-plugin"));var _uglifyjsWebpackPlugin=_interopRequireDefault(require("uglifyjs-webpack-plugin"));var _plugin=_interopRequireDefault(require("vue-loader/lib/plugin"));var _options=_interopRequireDefault(require("./config/options"));var entry=_interopRequireWildcard(require("./config/entry"));var loaders=_interopRequireWildcard(require("./config/loader"));var _utils=require("./utils");function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function _getRequireWildcardCache(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||_typeof(obj)!=="object"&&typeof obj!=="function"){return{"default":obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj["default"]=obj;if(cache){cache.set(obj,newObj);}return newObj;}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj};}// 基础配置
var config={watch:_options["default"].__DEV__,watchOptions:{ignored:/node_modules/},mode:process.env.NODE_ENV,output:Object.assign(_options["default"].output,{filename:'[name].js'}),externals:_options["default"].externals,resolve:{alias:entry.configAlias,extensions:['*','.js','.jsx','.vue']},module:{noParse:[],rules:[loaders.vueLoader({hotReload:_options["default"].__DEV__||_options["default"].__DEBUG__?true:false// 编译时关闭热重载
}),loaders.jsLoader({cpuNumber:_options["default"].cpuNumber},[_options["default"].nodeModulesDir]),loaders.cssLoader({minimize:_options["default"].__DEV__||_options["default"].__DEBUG__?false:true,hmr:_options["default"].__DEV__,reloadAll:true}),loaders.lessLoader({minimize:_options["default"].__DEV__||_options["default"].__DEBUG__?false:true,hmr:_options["default"].__DEV__,reloadAll:true})]},plugins:[new _miniCssExtractPlugin["default"]({filename:"[name].css",chunkFilename:"[id].css"}),new _webpack["default"].DefinePlugin({// __webpack_public_path__: `window.__publicPath`,
'process.env':{'NODE_ENV':JSON.stringify(process.env.NODE_ENV||'development')}}),new _webpack["default"].ProvidePlugin(_options["default"].global),new _webpack["default"].ContextReplacementPlugin(/moment[\\\/]locale$/,/^\.\/(zh-cn|en-gb)+\.js$/),new _plugin["default"]()]};if(!_options["default"].isWatchAllModule){concat.plugins.push(new _webpack["default"].WatchIgnorePlugin(_options["default"].ignoredDirs));}for(var key in _options["default"].noParseDeps){var depPath=_path["default"].resolve(_options["default"].nodeModulesDir,_options["default"].noParseDeps[key]);config.resolve.alias[key]=depPath;config.module.noParse.push(depPath);config.module.rules.push(loaders.importsLoader(config.module.noParse));}if(_options["default"].__DEV__){config.plugins=config.plugins.concat(new _friendlyErrorsWebpackPlugin["default"]());_options["default"].isESlint?config.module.rules.push(loaders.eslintLoader()):'';}if(!_options["default"].__DEV__&&!_options["default"].__DEBUG__){config.plugins=config.plugins.concat(new _optimizeCssAssetsWebpackPlugin["default"]());}else{config.devtool=_options["default"].__DEVTOOL__;}// lib 配置
var libConfigs=[];if(_options["default"].isBuildAllModule){var libEntry=(0,_utils.filterObject)(entry.libEntry,_options["default"].baseName);var baseEntry=libEntry.filterObj;var newLibEntry=libEntry.newObj;// base
var baseConfig={};var newConfig={};var _module={rules:[loaders.imageLoader('libs',_options["default"].imgName,_options["default"].imglimit),loaders.fontLoader('libs',_options["default"].fontName,_options["default"].fontlimit),loaders.mediaLoader('libs',_options["default"].mediaName)]};baseConfig=(0,_webpackMerge["default"])(config,{name:'base',entry:baseEntry,module:_module,plugins:[],optimization:{minimizer:[new _uglifyjsWebpackPlugin["default"]()]}});baseConfig.externals={};if(_options["default"].__ANALYZER__){baseConfig.plugins=baseConfig.plugins.concat(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3997}));};libConfigs.push(baseConfig);// lib
newConfig=(0,_webpackMerge["default"])(config,{name:'libs',entry:newLibEntry,module:_module,plugins:[new _copyWebpackPlugin["default"](entry.onlyCopys)],optimization:{minimizer:[new _uglifyjsWebpackPlugin["default"]()]}});if(_options["default"].__ANALYZER__){newConfig.plugins=newConfig.plugins.concat(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3998}));};libConfigs.push(newConfig);}// app 配置
var appConfig={};if(_options["default"].isBuildAllModule){appConfig=(0,_webpackMerge["default"])(config,{name:'app',entry:entry.appEntry['app'],module:{rules:[loaders.imageLoader('app',_options["default"].imgName,_options["default"].imglimit),loaders.fontLoader('app',_options["default"].fontName,_options["default"].imglimit),loaders.mediaLoader('app',_options["default"].mediaName)]},plugins:[new _webpackAssetsManifest["default"]({output:'app/chunk-manifest.json'})],optimization:{minimizer:[new _uglifyjsWebpackPlugin["default"]()],splitChunks:{// chunks: 'initial',
// minSize: 30000,
// maxSize: 0,
// minChunks: 1,
// maxAsyncRequests: 4,
// maxInitialRequests: 3,
// automaticNameDelimiter: '~',
// name: true,
// 默认抽离样式文件 3次引用在抽离
cacheGroups:{common:{name:"app/js/".concat(_options["default"].commonsChunkFileName),chunks:"initial",//入口处开始提取代码
minSize:300000,//代码最小多大，进行抽离
minChunks:6}}}}});if(_options["default"].__ANALYZER__){appConfig.plugins=appConfig.plugins.concat(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3999}));};if((0,_utils.fsExistsSync)("".concat(_options["default"].globalDir,"/app/").concat(_options["default"].copyName))){appConfig.plugins=appConfig.plugins.concat(new _copyWebpackPlugin["default"]([{from:"".concat(_options["default"].globalDir,"/app/").concat(_options["default"].copyName),to:"app/".concat(_options["default"].copyName),toType:'dir'}]));}}// 通用配置 - 包括插件、bundle、主题、教学活动
var commonConfigs=[];if(_options["default"].isBuildAllModule||_options["default"].buildModule.length){var commonEntry=entry.commonEntry;var commonEntryKeys=Object.keys(commonEntry);var index=0;commonEntryKeys.forEach(function(key){var commonConfig={};if((0,_utils.isEmptyObject)(commonEntry[key])){return;};var otherBundleChunks=key=='reservationplugin'?10:5;commonConfig=(0,_webpackMerge["default"])(config,{name:"".concat(key),entry:commonEntry[key],module:{rules:[loaders.imageLoader(key,_options["default"].imgName,_options["default"].imglimit),loaders.fontLoader(key,_options["default"].fontName,_options["default"].fontlimit),loaders.mediaLoader(key,_options["default"].mediaName)]},plugins:[],optimization:{minimizer:[new _uglifyjsWebpackPlugin["default"]()],splitChunks:{cacheGroups:{common:{name:"".concat(key,"/js/").concat(_options["default"].commonsChunkFileName),chunks:'initial',//入口处开始提取代码
minChunks:otherBundleChunks}}}}});var commonSrcEntry=entry.commonSrcEntry;if((0,_utils.fsExistsSync)("".concat(commonSrcEntry[key],"/").concat(_options["default"].copyName))){commonConfig.plugins=commonConfig.plugins.concat(new _copyWebpackPlugin["default"]([{from:"".concat(commonSrcEntry[key],"/").concat(_options["default"].copyName),to:"".concat(key,"/").concat(_options["default"].copyName),toType:'dir'}]));}if((0,_utils.fsExistsSync)("".concat(commonSrcEntry[key],"/").concat(_options["default"].isNeedCommonChunk))){commonConfig.plugins=commonConfig.plugins.concat(new _webpackAssetsManifest["default"]({output:"".concat(key,"/chunk-manifest.json")}));}if(_options["default"].__ANALYZER__){commonConfig.plugins=commonConfig.plugins.concat(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:"400".concat(index)}));};commonConfigs.push(commonConfig);index++;});}// 总配置
var configs=[];[libConfigs,appConfig,commonConfigs].forEach(function(item){if(item.constructor===Object&&!(0,_utils.isEmptyObject)(item)){configs.push(item);}else if(item.constructor===Array&&item.length){configs=configs.concat(item);}});var _default=configs;exports["default"]=_default;