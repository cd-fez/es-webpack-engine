'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.pluginAssetsDirs=exports.themeAssetsDirs=exports.bundleAssetsDirs=exports.configAlias=exports.onlyCopys=exports.themeSrcEntry=exports.themeEntry=exports.bundleSrcEntry=exports.pluginSrcEntry=exports.appEntry=exports.libEntry=exports.bundleEntry=exports.pluginEntry=undefined;var _path=require('path');var _path2=_interopRequireDefault(_path);var _utils=require('../utils');var _options=require('./options');var _options2=_interopRequireDefault(_options);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// 存放源文件路径
var pluginAssetsDirs=[];var themeAssetsDirs=[];var bundleAssetsDirs=[];// 设置别名
var configAlias={libs:_options2.default.globalDir+'/libs',common:_options2.default.globalDir+'/common',app:_options2.default.globalDir+'/app'};/*
  * 输出格式
  * let pluginEntry = {
  *   'crmplugin': {
  *     'crmplugin/js/main': '/plugins/CrmPlugin/Resources/static-src/js/main.js',
  *     'crmplugin/js/default/index': '/plugins/CrmPlugin/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  *   'viplugin': {
  *     'viplugin/js/main': '/plugins/VipPlugin/Resources/static-src/main.js',
  *     'viplugin/js/default/index': '/plugins/VipPlugin/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  * };
*/var pluginEntry={};var pluginSrcEntry={};if(_options2.default.isBuildAllModule||_options2.default.pluginModule.length){var pluginsName=[];if(_options2.default.pluginModule.length){pluginsName=_options2.default.pluginModule;}else{pluginsName=(0,_utils.searchDirs)(_options2.default.pluginsDir,'Resources/static-src');}pluginsName.forEach(function(plugin){var pluginDir=plugin+'/Resources/static-src';var pluginName=plugin.split(_path2.default.sep).pop().toLowerCase();pluginEntry[pluginName]={};Object.assign(pluginEntry[pluginName],(0,_utils.searchEntries)({fileName:_options2.default.extryCssName,entryPath:pluginDir+'/less',fileNamePrefix:pluginName+'/css/',fileType:'less'}),(0,_utils.searchEntries)({fileName:_options2.default.entryMainName,entryPath:pluginDir+'/js',fileNamePrefix:pluginName+'/js/'}),(0,_utils.searchEntries)({fileName:_options2.default.entryFileName,entryPath:pluginDir+'/js',fileNamePrefix:pluginName+'/js/',isFuzzy:true}));configAlias[pluginName]=pluginDir;pluginSrcEntry[pluginName]=pluginDir;pluginAssetsDirs.push(pluginDir);});}/*
  * 输出格式
  * let bundleEntry = {
  *   'custom': {
  *     'custom/js/main': '/src/Custom/Resources/static-src/js/main.js',
  *     'custom/js/default/index': '/src/Custom/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  *   'appbundle': {
  *     'appbundle/js/main': '/src/AppBundle/Resources/static-src/main.js',
  *     'appbundle/js/default/index': '/src/AppBundle/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  * };
*/var bundleEntry={};var bundleSrcEntry={};if(_options2.default.isBuildAllModule||_options2.default.bundleModule.length){var bundlesName=[];if(_options2.default.bundleModule.length){bundlesName=_options2.default.bundleModule;}else{bundlesName=(0,_utils.searchDirs)(_options2.default.bundlesDir,'Resources/static-src');}bundlesName.forEach(function(bundle){var bundleDir=bundle+'/Resources/static-src';var bundleName=bundle.split(_path2.default.sep).pop().toLowerCase();bundleEntry[bundleName]={};Object.assign(bundleEntry[bundleName],(0,_utils.searchEntries)({fileName:_options2.default.extryCssName,entryPath:bundleDir+'/less',fileNamePrefix:bundleName+'/css/',fileType:'less'}),(0,_utils.searchEntries)({fileName:_options2.default.entryMainName,entryPath:bundleDir+'/js',fileNamePrefix:bundleName+'/js/'}),(0,_utils.searchEntries)({fileName:_options2.default.entryFileName,entryPath:bundleDir+'/js',fileNamePrefix:bundleName+'/js/',isFuzzy:true}));configAlias[bundleName]=bundleDir;bundleSrcEntry[bundleName]=bundleDir;bundleAssetsDirs.push(bundleDir);});}/*
  * 输出格式
  * let themeEntry = {
  *   'defaulttheme': {
  *     'defaulttheme/js/default/index': '/web/themes/default/static-src/js/default/index.js',
  *     ...
  *   },
  *   'defaultbtheme': {
  *     'defaultbtheme/js/default/index': '/web/themes/default-b/static-src/js/default/index.js',
  *     ...
  *   },
  * };
*/var themeEntry={};var themeSrcEntry={};if(_options2.default.isBuildAllModule||_options2.default.themeModule.length){var themesName=[];if(_options2.default.themeModule.length){themesName=_options2.default.themeModule;}else{themesName=(0,_utils.searchDirs)(_options2.default.themesDir,'static-src');}themesName.forEach(function(theme){var themeDir=theme+'/static-src';var themeName=theme.split(_path2.default.sep).pop().replace('-','').toLowerCase()+'theme';themeEntry[themeName]={};Object.assign(themeEntry[themeName],(0,_utils.searchEntries)({fileName:_options2.default.extryCssName,entryPath:themeDir+'/less',fileNamePrefix:themeName+'/css/',fileType:'less'}),(0,_utils.searchEntries)({fileName:_options2.default.entryMainName,entryPath:themeDir+'/js',fileNamePrefix:themeName+'/js/'}),(0,_utils.searchEntries)({fileName:_options2.default.entryFileName,entryPath:themeDir+'/js',fileNamePrefix:themeName+'/js/',isFuzzy:true}));configAlias[themeName]=themeDir;themeSrcEntry[themeName]=themeDir;themeAssetsDirs.push(themeDir);});}var libEntry={};if(_options2.default.isBuildAllModule){var _loop=function _loop(key){libEntry['libs/'+key]=[];_options2.default.libs[key].forEach(function(le){libEntry['libs/'+key].push(le);});};for(var key in _options2.default.libs){_loop(key);}}var appEntry={};if(_options2.default.isBuildAllModule){var appDir=_options2.default.globalDir+'/app';appEntry['app']={};Object.assign(appEntry['app'],(0,_utils.searchEntries)({fileName:_options2.default.extryCssName,entryPath:appDir+'/less',fileNamePrefix:'app/css/',fileType:'less'}),(0,_utils.searchEntries)({fileName:_options2.default.entryMainName,entryPath:appDir+'/js',fileNamePrefix:'app/js/'}),(0,_utils.searchEntries)({fileName:_options2.default.entryFileName,entryPath:appDir+'/js',fileNamePrefix:'app/js/',isFuzzy:true}));}var onlyCopys=[];if(_options2.default.onlyCopys&&_options2.default.onlyCopys.length){var copyitem={};_options2.default.onlyCopys.forEach(function(item){copyitem={from:_options2.default.nodeModulesDir+'/'+item.name,to:'libs/'+item.name,ignore:item.ignore,copyUnmodified:true,force:true};onlyCopys.push(copyitem);});}exports.pluginEntry=pluginEntry;exports.bundleEntry=bundleEntry;exports.libEntry=libEntry;exports.appEntry=appEntry;exports.pluginSrcEntry=pluginSrcEntry;exports.bundleSrcEntry=bundleSrcEntry;exports.themeEntry=themeEntry;exports.themeSrcEntry=themeSrcEntry;exports.onlyCopys=onlyCopys;exports.configAlias=configAlias;exports.bundleAssetsDirs=bundleAssetsDirs;exports.themeAssetsDirs=themeAssetsDirs;exports.pluginAssetsDirs=pluginAssetsDirs;