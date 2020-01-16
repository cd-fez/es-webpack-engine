"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.eslintLoader=exports.importsLoader=exports.vueLoader=exports.lessLoader=exports.cssLoader=exports.jsLoader=exports.mediaLoader=exports.fontLoader=exports.imageLoader=void 0;var _miniCssExtractPlugin=_interopRequireDefault(require("mini-css-extract-plugin"));var _options=_interopRequireDefault(require("./options"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj};}var imageLoader=function imageLoader(path,imgName,limit){return{test:/\.(png|jpe?g|gif)$/,use:[{loader:"file-loader",options:{limit:limit,name:"".concat(path,"/").concat(imgName,"/[name].[ext]")}}]};};exports.imageLoader=imageLoader;var fontLoader=function fontLoader(path,fontName,limit){return{test:/\.(woff|woff2|eot|ttf|svg)(\?(.*))?$/,use:[{loader:"file-loader",options:{limit:limit,name:"".concat(path,"/").concat(fontName,"/[name].[ext]")}}]};};exports.fontLoader=fontLoader;var mediaLoader=function mediaLoader(path,name){return{test:/\.(swf|wav|mp3|mpeg|mp4|webm|ogv)(\?v=\d+\.\d+\.\d+)?$/,use:[{loader:"file-loader",options:{name:"".concat(path,"/").concat(name,"/[name].[ext]")}}]};};exports.mediaLoader=mediaLoader;var jsLoader=function jsLoader(options,exclude){return{test:/\.js[x]?$/,use:[{loader:'thread-loader',options:{workers:options.cupNumber}},{loader:'babel-loader'}],exclude:exclude};};exports.jsLoader=jsLoader;var cssLoader=function cssLoader(options){return{test:/\.css$/,use:[{loader:options.__DEV__||options.__DEBUG__?'vue-style-loader':_miniCssExtractPlugin["default"].loader,options:options},'css-loader']};};exports.cssLoader=cssLoader;var lessLoader=function lessLoader(options){return{test:/\.less$/,use:[{loader:options.__DEV__||options.__DEBUG__?'vue-style-loader':_miniCssExtractPlugin["default"].loader,options:options},'css-loader','less-loader']};};exports.lessLoader=lessLoader;var vueLoader=function vueLoader(options){return{test:/\.vue$/,loader:'vue-loader',options:options};};exports.vueLoader=vueLoader;var importsLoader=function importsLoader(regExp){return{test:new RegExp("(".concat(regExp.join('|'),")$")),loader:'imports-loader?define=>false&module=>false&exports=>false&this=>window'};};exports.importsLoader=importsLoader;var eslintLoader=function eslintLoader(){return{enforce:'pre',test:/\.(js|html)$/,loader:'eslint-loader',options:{fix:true}};};exports.eslintLoader=eslintLoader;