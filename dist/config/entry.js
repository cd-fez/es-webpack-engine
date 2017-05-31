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
*/var pluginEntry={};var pluginSrcEntry={};if(_options2.default.isOpenPluginModule){var pluginsName=[];if(_options2.default.openPluginsModule.length){pluginsName=_options2.default.openPluginsModule;}else{pluginsName=(0,_utils.searchDirs)(_options2.default.pluginsDir,'Resources/static-src');}pluginsName.forEach(function(plugin){var pluginDir=_options2.default.rootDir+'/'+plugin+'/Resources/static-src';var pluginName=plugin.split(_path2.default.sep).pop().toLowerCase();pluginEntry[pluginName]={};if((0,_utils.fsExistsSync)(pluginDir+'/js/'+_options2.default.entryMainName+'.js')){pluginEntry[pluginName][pluginName+'/js/'+_options2.default.entryMainName]=pluginDir+'/js/'+_options2.default.entryMainName+'.js';}Object.assign(pluginEntry[pluginName],(0,_utils.searchEntries)(_options2.default.entryFileName,pluginDir+'/js',pluginName+'/js/'));configAlias[pluginName]=pluginDir;pluginSrcEntry[pluginName]=pluginDir;pluginAssetsDirs.push(pluginDir);});}/*
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
*/var bundleEntry={};var bundleSrcEntry={};if(_options2.default.isOpenBundleModule){var bundlesName=[];if(_options2.default.openBundlesModule.length){bundlesName=_options2.default.openBundlesModule;}else{bundlesName=(0,_utils.searchDirs)(_options2.default.bundlesDir,'Resources/static-src');}bundlesName.forEach(function(bundle){var bundleDir=_options2.default.rootDir+'/'+bundle+'/Resources/static-src';var bundleName=bundle.split(_path2.default.sep).pop().toLowerCase();bundleEntry[bundleName]={};if((0,_utils.fsExistsSync)(bundleDir+'/js/'+_options2.default.entryMainName+'.js')){bundleEntry[bundleName][bundleName+'/js/'+_options2.default.entryMainName]=bundleDir+'/js/'+_options2.default.entryMainName+'.js';}Object.assign(bundleEntry[bundleName],(0,_utils.searchEntries)(_options2.default.entryFileName,bundleDir+'/js',bundleName+'/js/'));configAlias[bundleName]=bundleDir;bundleSrcEntry[bundleName]=bundleDir;bundleAssetsDirs.push(bundleDir);});}/*
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
*/var themeEntry={};var themeSrcEntry={};if(_options2.default.isOpenThemeModule){var themesName=[];if(_options2.default.openThemesModule.length){themesName=_options2.default.openThemesModule;}else{themesName=(0,_utils.searchDirs)(_options2.default.themesDir,'static-src');}themesName.forEach(function(theme){var themeDir=_options2.default.webDir+'/'+theme+'/static-src';var themeName=theme.split(_path2.default.sep).pop().replace('-','').toLowerCase()+'theme';themeEntry[themeName]={};if((0,_utils.fsExistsSync)(themeDir+'/js/'+_options2.default.entryMainName+'.js')){themeEntry[themeName][themeName+'/js/'+_options2.default.entryMainName]=themeDir+'/js/'+_options2.default.entryMainName+'.js';}Object.assign(themeEntry[themeName],(0,_utils.searchEntries)(_options2.default.entryFileName,themeDir+'/js',themeName+'/js/'));configAlias[themeName]=themeDir;themeSrcEntry[themeName]=themeDir;themeAssetsDirs.push(themeDir);});}var libEntry={};if(_options2.default.isOpenLibModule){var _loop=function _loop(key){libEntry['libs/'+key]=[];_options2.default.libs[key].forEach(function(le){libEntry['libs/'+key].push(le);});};for(var key in _options2.default.libs){_loop(key);}}var appEntry={};if(_options2.default.isOpenAppModule){var appDir=_options2.default.globalDir+'/app';appEntry['app']={};if((0,_utils.fsExistsSync)(appDir+'/js/'+_options2.default.entryMainName+'.js')){appEntry['app']['app/js/'+_options2.default.entryMainName]=appDir+'/js/'+_options2.default.entryMainName+'.js';}Object.assign(appEntry['app'],(0,_utils.searchEntries)(_options2.default.entryFileName,appDir+'/js','app/js/',['admin']));}var onlyCopys=[];if(_options2.default.onlyCopys&&_options2.default.onlyCopys.length){var copyitem={};_options2.default.onlyCopys.forEach(function(item){copyitem={from:_options2.default.nodeModulesDir+'/'+item.name,to:'libs/'+item.name,ignore:item.ignore,copyUnmodified:true,force:true};onlyCopys.push(copyitem);});}exports.pluginEntry=pluginEntry;exports.bundleEntry=bundleEntry;exports.libEntry=libEntry;exports.appEntry=appEntry;exports.pluginSrcEntry=pluginSrcEntry;exports.bundleSrcEntry=bundleSrcEntry;exports.themeEntry=themeEntry;exports.themeSrcEntry=themeSrcEntry;exports.onlyCopys=onlyCopys;exports.configAlias=configAlias;exports.bundleAssetsDirs=bundleAssetsDirs;exports.themeAssetsDirs=themeAssetsDirs;exports.pluginAssetsDirs=pluginAssetsDirs;