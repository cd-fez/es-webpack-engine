"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.configAlias=exports.onlyCopys=exports.commonSrcEntry=exports.commonEntry=exports.appEntry=exports.libEntry=void 0;var _path=_interopRequireDefault(require("path"));var _utils=require("../utils");var _options=_interopRequireDefault(require("./options"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj};}// 设置别名
var configAlias={libs:"".concat(_options["default"].globalDir,"/libs"),common:"".concat(_options["default"].globalDir,"/common"),app:"".concat(_options["default"].globalDir,"/app"),nodeModulesDir:_options["default"].nodeModulesDir,// 即将废弃
node_modules:_options["default"].nodeModulesDir};/*
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
*/exports.configAlias=configAlias;var commonEntry={};exports.commonEntry=commonEntry;var commonSrcEntry={};exports.commonSrcEntry=commonSrcEntry;if(_options["default"].isBuildAllModule||_options["default"].buildModule.length){var commonNames=[];if(_options["default"].buildModule.length){commonNames=_options["default"].buildModule;}else{commonNames=commonNames.concat((0,_utils.searchDirs)(_options["default"].pluginsDir,'Resources/static-src'),(0,_utils.searchDirs)(_options["default"].bundlesDir,'Resources/static-src'),(0,_utils.searchDirs)(_options["default"].themesDir,'static-src'),(0,_utils.searchDirs)(_options["default"].activitiesDir,'static-src'));}commonNames.forEach(function(item){var commonDir;var commonName;if((0,_utils.isPlugin)(item)||(0,_utils.isBundle)(item)){commonDir="".concat(item,"/Resources/static-src");commonName=item.split(_path["default"].sep).pop().toLowerCase();}else if((0,_utils.isTheme)(item)){commonDir="".concat(item,"/static-src");commonName=item.split(_path["default"].sep).pop().replace('-','').toLowerCase()+'theme';}else if((0,_utils.isActivity)(item)){commonDir="".concat(item,"/static-src");commonName=item.split(_path["default"].sep).pop().replace('-','').toLowerCase()+'activity';}commonEntry[commonName]={};Object.assign(commonEntry[commonName],(0,_utils.searchEntries)({fileName:_options["default"].extryCssName,entryPath:"".concat(commonDir,"/less"),fileNamePrefix:"".concat(commonName,"/css/"),fileType:'less'}),(0,_utils.searchEntries)({fileName:_options["default"].entryMainName,entryPath:"".concat(commonDir,"/js"),fileNamePrefix:"".concat(commonName,"/js/")}),(0,_utils.searchEntries)({fileName:_options["default"].entryFileName,entryPath:"".concat(commonDir,"/js"),fileNamePrefix:"".concat(commonName,"/js/"),isFuzzy:true}));configAlias[commonName]=commonDir;commonSrcEntry[commonName]=commonDir;});}var libEntry={};exports.libEntry=libEntry;if(_options["default"].isBuildAllModule){var _loop=function _loop(key){libEntry["libs/".concat(key)]=[];_options["default"].libs[key].forEach(function(le){libEntry["libs/".concat(key)].push(le);});};for(var key in _options["default"].libs){_loop(key);}}var appEntry={};exports.appEntry=appEntry;if(_options["default"].isBuildAllModule){var appDir="".concat(_options["default"].globalDir,"/app");appEntry['app']={};Object.assign(appEntry['app'],(0,_utils.searchEntries)({fileName:_options["default"].extryCssName,entryPath:"".concat(appDir,"/less"),fileNamePrefix:"app/css/",fileType:'less'}),(0,_utils.searchEntries)({fileName:_options["default"].entryMainName,entryPath:"".concat(appDir,"/js"),fileNamePrefix:"app/js/"}),(0,_utils.searchEntries)({fileName:_options["default"].entryFileName,entryPath:"".concat(appDir,"/js"),fileNamePrefix:"app/js/",isFuzzy:true}));}var onlyCopys=[];exports.onlyCopys=onlyCopys;if(_options["default"].onlyCopys.length){var copyitem={};_options["default"].onlyCopys.forEach(function(item){copyitem={from:"".concat(_options["default"].nodeModulesDir,"/").concat(item.name),to:"libs/".concat(item.name),ignore:item.ignore,copyUnmodified:true,force:true};onlyCopys.push(copyitem);});}