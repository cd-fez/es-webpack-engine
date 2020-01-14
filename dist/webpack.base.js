"use strict";function _typeof(obj){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj;};}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};}return _typeof(obj);}Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _path=_interopRequireDefault(require("path"));var _webpack=_interopRequireDefault(require("webpack"));var _webpackMerge=_interopRequireDefault(require("webpack-merge"));var _webpackManifestPlugin=_interopRequireDefault(require("webpack-manifest-plugin"));var _copyWebpackPlugin=_interopRequireDefault(require("copy-webpack-plugin"));var _webpackBundleAnalyzer=require("webpack-bundle-analyzer");var _friendlyErrorsWebpackPlugin=_interopRequireDefault(require("friendly-errors-webpack-plugin"));var _miniCssExtractPlugin=_interopRequireDefault(require("mini-css-extract-plugin"));var _uglifyjsWebpackPlugin=_interopRequireDefault(require("uglifyjs-webpack-plugin"));var _plugin=_interopRequireDefault(require("vue-loader/lib/plugin"));var _options=_interopRequireDefault(require("./config/options"));var entry=_interopRequireWildcard(require("./config/entry"));var loaders=_interopRequireWildcard(require("./config/loader"));var _utils=require("./utils");function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function _getRequireWildcardCache(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||_typeof(obj)!=="object"&&typeof obj!=="function"){return{"default":obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj["default"]=obj;if(cache){cache.set(obj,newObj);}return newObj;}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj};}// import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
console.log('读取信息');console.log(_options["default"]);console.log('读取设置信息');console.log(_options["default"].cupNumber);// 基础配置
var config={watch:_options["default"].__DEV__,watchOptions:{ignored:/node_modules/},mode:process.env.NODE_ENV,output:Object.assign(_options["default"].output,{filename:'[name].js'}),externals:_options["default"].externals,resolve:{alias:entry.configAlias,extensions:['*','.js','.jsx']},optimization:{minimizer:[new _uglifyjsWebpackPlugin["default"]()],splitChunks:{chunks:'async',minSize:30000,maxSize:0,minChunks:1,maxAsyncRequests:4,maxInitialRequests:3,automaticNameDelimiter:'~',name:true,cacheGroups:{vendors:{test:/[\\/]node_modules[\\/]/,priority:-10},"default":{minChunks:2,priority:-20,reuseExistingChunk:true}}}},module:{noParse:[],rules:[loaders.jsLoader({cupNumber:_options["default"].cupNumber},[_options["default"].nodeModulesDir]),loaders.cssLoader({minimize:_options["default"].__DEV__||_options["default"].__DEBUG__?false:true,hmr:_options["default"].__DEV__}),loaders.lessLoader({minimize:_options["default"].__DEV__||_options["default"].__DEBUG__?false:true,hmr:_options["default"].__DEV__})// loaders.jsonLoader(),
]},plugins:[// new HappyPack({
//   id: 'babelJs',
//   threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
//   verbose: false,
//   loaders: ['babel-loader']
// }),
new _miniCssExtractPlugin["default"]({filename:"[name].css",chunkFilename:"[id].css"// allChunks: true
}),new _webpack["default"].DefinePlugin({// __webpack_public_path__: `window.__publicPath`,
'process.env':{'NODE_ENV':JSON.stringify(process.env.NODE_ENV||'development')}}),new _webpack["default"].ProvidePlugin(_options["default"].global),new _webpack["default"].ContextReplacementPlugin(/moment[\\\/]locale$/,/^\.\/(zh-cn|en-gb)+\.js$/),new _plugin["default"]()// new OptimizeModuleIdAndChunkIdPlugin(),
]};if(!_options["default"].isWatchAllModule){concat.plugins.push(new _webpack["default"].WatchIgnorePlugin(_options["default"].ignoredDirs));}for(var key in _options["default"].noParseDeps){var depPath=_path["default"].resolve(_options["default"].nodeModulesDir,_options["default"].noParseDeps[key]);config.resolve.alias[key]=depPath;config.module.noParse.push(depPath);config.module.rules.push(loaders.importsLoader(config.module.noParse));}if(_options["default"].__DEV__){config.plugins=config.plugins.concat(new _friendlyErrorsWebpackPlugin["default"]());_options["default"].isESlint?config.module.rules.push(loaders.eslintLoader()):'';}if(!_options["default"].__DEV__&&!_options["default"].__DEBUG__){// config.plugins = config.plugins.concat(new webpack.optimize.UglifyJsPlugin(uglifyJsConfig));
}else{config.devtool=_options["default"].__DEVTOOL__;}var minChunks=function minChunks(module,count){if(module.resource&&/^.*\.(css|less)$/.test(module.resource)){return false;}var pattern=new RegExp(_options["default"].regExp);return module.resource&&!pattern.test(module.resource)&&count>=_options["default"].minChunks;};// lib 配置
var libConfigs=[];if(_options["default"].isBuildAllModule){var libEntry=(0,_utils.filterObject)(entry.libEntry,_options["default"].baseName);var baseEntry=libEntry.filterObj;var newLibEntry=libEntry.newObj;var baseConfig={};var newConfig={};var _module={rules:[loaders.imageLoader('libs',_options["default"].imgName,_options["default"].imglimit),loaders.fontLoader('libs',_options["default"].fontName,_options["default"].fontlimit),loaders.mediaLoader('libs',_options["default"].mediaName)]};baseConfig=(0,_webpackMerge["default"])(config,{name:'base',entry:baseEntry,module:_module,plugins:[]});baseConfig.externals={};if(_options["default"].__ANALYZER__){baseConfig.plugins=baseConfig.plugins.concat(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3997}));};libConfigs.push(baseConfig);newConfig=(0,_webpackMerge["default"])(config,{name:'libs',entry:newLibEntry,module:_module,plugins:[new _copyWebpackPlugin["default"](entry.onlyCopys)]});if(_options["default"].__ANALYZER__){newConfig.plugins=newConfig.plugins.concat(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3998}));};libConfigs.push(newConfig);}// app 配置
var appConfig={};if(_options["default"].isBuildAllModule){appConfig=(0,_webpackMerge["default"])(config,{name:'app',entry:entry.appEntry['app'],module:{rules:[loaders.imageLoader('app',_options["default"].imgName,_options["default"].imglimit),loaders.fontLoader('app',_options["default"].fontName,_options["default"].imglimit),loaders.mediaLoader('app',_options["default"].mediaName)]},plugins:[// new webpack.optimize.CommonsChunkPlugin({
//   name: 'app',
//   filename: `app/js/${options.commonsChunkFileName}.js`,
//   chunks: Object.keys(entry.appEntry['app']),
//   minChunks,
// }),
new _webpackManifestPlugin["default"]({filename:"app/chunk-manifest.json"})// new ChunkManifestPlugin({
//   filename: `app/chunk-manifest.json`,
//   manifestVariable: "webpackManifest"
// }),
]});if(_options["default"].__ANALYZER__){appConfig.plugins=appConfig.plugins.concat(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3999}));};if((0,_utils.fsExistsSync)("".concat(_options["default"].globalDir,"/app/").concat(_options["default"].copyName))){appConfig.plugins=appConfig.plugins.concat(new _copyWebpackPlugin["default"]([{from:"".concat(_options["default"].globalDir,"/app/").concat(_options["default"].copyName),to:"app/".concat(_options["default"].copyName),toType:'dir'}]));}}// 通用配置 - 包括插件、bundle、主题、教学活动
var commonConfigs=[];if(_options["default"].isBuildAllModule||_options["default"].buildModule.length){var commonEntry=entry.commonEntry;var commonEntryKeys=Object.keys(commonEntry);var index=0;commonEntryKeys.forEach(function(key){var commonConfig={};if((0,_utils.isEmptyObject)(commonEntry[key])){return;};commonConfig=(0,_webpackMerge["default"])(config,{name:"".concat(key),entry:commonEntry[key],module:{rules:[loaders.imageLoader(key,_options["default"].imgName,_options["default"].imglimit),loaders.fontLoader(key,_options["default"].fontName,_options["default"].fontlimit),loaders.mediaLoader(key,_options["default"].mediaName)]},plugins:[]});var commonSrcEntry=entry.commonSrcEntry;if((0,_utils.fsExistsSync)("".concat(commonSrcEntry[key],"/").concat(_options["default"].copyName))){commonConfig.plugins=commonConfig.plugins.concat(new _copyWebpackPlugin["default"]([{from:"".concat(commonSrcEntry[key],"/").concat(_options["default"].copyName),to:"".concat(key,"/").concat(_options["default"].copyName),toType:'dir'}]));}if((0,_utils.fsExistsSync)("".concat(commonSrcEntry[key],"/").concat(_options["default"].isNeedCommonChunk))){// commonConfig.plugins = commonConfig.plugins.concat(new webpack.optimize.CommonsChunkPlugin({
//   name: key,
//   filename: `${key}/js/${options.commonsChunkFileName}.js`,
//   chunks: Object.keys(commonEntry[key]),
//   minChunks,
// }), new ChunkManifestPlugin({
//   filename: `${key}/chunk-manifest.json`,
//   manifestVariable: 'webpackManifest'
// }));
commonConfig.plugins=commonConfig.plugins.concat(new _webpackManifestPlugin["default"]({filename:"".concat(key,"/chunk-manifest.json")}));}if(_options["default"].__ANALYZER__){commonConfig.plugins=commonConfig.plugins.concat(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:"400".concat(index)}));};commonConfigs.push(commonConfig);index++;});}// 总配置
var configs=[];[libConfigs,appConfig,commonConfigs].forEach(function(item){if(item.constructor===Object&&!(0,_utils.isEmptyObject)(item)){configs.push(item);}else if(item.constructor===Array&&item.length){configs=configs.concat(item);}});var _default=configs;exports["default"]=_default;