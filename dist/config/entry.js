import path from'path';import{searchEntries,searchDirs,fsExistsSync,isArray,isPlugin,isBundle}from'../utils';import options from'./options';// 设置别名
var configAlias={libs:options.globalDir+'/libs',common:options.globalDir+'/common',app:options.globalDir+'/app',nodeModulesDir:options.nodeModulesDir,// 即将废弃
node_modules:options.nodeModulesDir};console.log('wins configAlias entry');console.log(configAlias);/*
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
*/var commonEntry={};var commonSrcEntry={};if(options.isBuildAllModule||options.buildModule.length){var commonNames=[];if(options.buildModule.length){commonNames=options.buildModule;}else{commonNames=commonNames.concat(searchDirs(options.pluginsDir,'Resources/static-src'),searchDirs(options.bundlesDir,'Resources/static-src'),searchDirs(options.themesDir,'static-src'));}commonNames.forEach(function(item){var commonDir=void 0;var commonName=void 0;if(isPlugin(item)||isBundle(item)){commonDir=item+'/Resources/static-src';commonName=item.split(path.sep).pop().toLowerCase();}else{commonDir=item+'/static-src';commonName=item.split(path.sep).pop().replace('-','').toLowerCase()+'theme';}commonEntry[commonName]={};Object.assign(commonEntry[commonName],searchEntries({fileName:options.extryCssName,entryPath:commonDir+'/less',fileNamePrefix:commonName+'/css/',fileType:'less'}),searchEntries({fileName:options.entryMainName,entryPath:commonDir+'/js',fileNamePrefix:commonName+'/js/'}),searchEntries({fileName:options.entryFileName,entryPath:commonDir+'/js',fileNamePrefix:commonName+'/js/',isFuzzy:true}));configAlias[commonName]=commonDir;commonSrcEntry[commonName]=commonDir;});}var libEntry={};if(options.isBuildAllModule){var _loop=function _loop(key){libEntry['libs/'+key]=[];options.libs[key].forEach(function(le){libEntry['libs/'+key].push(le);});};for(var key in options.libs){_loop(key);}}var appEntry={};if(options.isBuildAllModule){var appDir=options.globalDir+'/app';appEntry['app']={};Object.assign(appEntry['app'],searchEntries({fileName:options.extryCssName,entryPath:appDir+'/less',fileNamePrefix:'app/css/',fileType:'less'}),searchEntries({fileName:options.entryMainName,entryPath:appDir+'/js',fileNamePrefix:'app/js/'}),searchEntries({fileName:options.entryFileName,entryPath:appDir+'/js',fileNamePrefix:'app/js/',isFuzzy:true}));}var onlyCopys=[];if(options.onlyCopys.length){var copyitem={};options.onlyCopys.forEach(function(item){copyitem={from:options.nodeModulesDir+'/'+item.name,to:'libs/'+item.name,ignore:item.ignore,copyUnmodified:true,force:true};onlyCopys.push(copyitem);});}export{libEntry,appEntry,commonEntry,commonSrcEntry,onlyCopys,configAlias};