'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.configAlias=exports.onlyCopys=exports.commonSrcEntry=exports.commonEntry=exports.commonNames=exports.appEntry=exports.libEntry=undefined;var _path=require('path');var _path2=_interopRequireDefault(_path);var _utils=require('../utils');var _options=require('./options');var _options2=_interopRequireDefault(_options);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// 设置别名
var configAlias={libs:_options2.default.globalDir+'/libs',common:_options2.default.globalDir+'/common',app:_options2.default.globalDir+'/app',nodeModulesDir:_options2.default.nodeModulesDir,// 即将废弃
node_modules:_options2.default.nodeModulesDir};/*
  * 输出格式
  * let commonEntry = {
  *   'crmplugin': {
  *     'crmplugin/js/index': '/plugins/CrmPlugin/Resources/static-src/js/index.js',
  *     'crmplugin/js/default/index': '/plugins/CrmPlugin/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  *   'custombundle': {
  *     'custombundle/js/index': '/src/CustomBundle/Resources/static-src/js/index.js',
  *     'custombundle/js/default/index': '/src/CustomBundle/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  *   'defaulttheme': {
  *     'defaulttheme/js/default/index': '/web/themes/default/static-src/js/default/index.js',
  *     ...
  *   },
  *   'defaultbtheme': {
  *     'defaultbtheme/js/default/index': '/web/themes/default-b/static-src/js/default/index.js',
  *     ...
  *   },
  * };
*/var commonEntry={};var commonSrcEntry={};var commonNames=[];if(_options2.default.isBuildAllModule||_options2.default.buildModule.length){if(_options2.default.buildModule.length){exports.commonNames=commonNames=_options2.default.buildModule;}else{exports.commonNames=commonNames=commonNames.concat((0,_utils.searchDirs)(_options2.default.pluginsDir,'Resources/static-src'),(0,_utils.searchDirs)(_options2.default.bundlesDir,'Resources/static-src'),(0,_utils.searchDirs)(_options2.default.themesDir,'static-src'));}commonNames.forEach(function(item){var commonDir=void 0;var commonName=void 0;if((0,_utils.isPlugin)(item)||(0,_utils.isBundle)(item)){commonDir=item+'/Resources/static-src';commonName=item.split(_path2.default.sep).pop().toLowerCase();}else{commonDir=item+'/static-src';commonName=item.split(_path2.default.sep).pop().replace('-','').toLowerCase()+'theme';}commonEntry[commonName]={};Object.assign(commonEntry[commonName],(0,_utils.searchEntries)({fileName:_options2.default.extryCssName,entryPath:commonDir+'/less',fileNamePrefix:commonName+'/css/',fileType:'less'}),(0,_utils.searchEntries)({fileName:_options2.default.entryMainName,entryPath:commonDir+'/js',fileNamePrefix:commonName+'/js/'}),(0,_utils.searchEntries)({fileName:_options2.default.entryFileName,entryPath:commonDir+'/js',fileNamePrefix:commonName+'/js/',isFuzzy:true}));configAlias[commonName]=commonDir;commonSrcEntry[commonName]=commonDir;});}var libEntry={};if(_options2.default.isBuildAllModule){var _loop=function _loop(key){libEntry['libs/'+key]=[];_options2.default.libs[key].forEach(function(le){libEntry['libs/'+key].push(le);});};for(var key in _options2.default.libs){_loop(key);}}var appEntry={};if(_options2.default.isBuildAllModule){var appDir=_options2.default.globalDir+'/app';appEntry['app']={};Object.assign(appEntry['app'],(0,_utils.searchEntries)({fileName:_options2.default.extryCssName,entryPath:appDir+'/less',fileNamePrefix:'app/css/',fileType:'less'}),(0,_utils.searchEntries)({fileName:_options2.default.entryMainName,entryPath:appDir+'/js',fileNamePrefix:'app/js/'}),(0,_utils.searchEntries)({fileName:_options2.default.entryFileName,entryPath:appDir+'/js',fileNamePrefix:'app/js/',isFuzzy:true}));}console.log(commonEntry+'commonEntry');var onlyCopys=[];if(_options2.default.onlyCopys.length){var copyitem={};_options2.default.onlyCopys.forEach(function(item){copyitem={from:_options2.default.nodeModulesDir+'/'+item.name,to:'libs/'+item.name,ignore:item.ignore,copyUnmodified:true,force:true};onlyCopys.push(copyitem);});}exports.libEntry=libEntry;exports.appEntry=appEntry;exports.commonNames=commonNames;exports.commonEntry=commonEntry;exports.commonSrcEntry=commonSrcEntry;exports.onlyCopys=onlyCopys;exports.configAlias=configAlias;