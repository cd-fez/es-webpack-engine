"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.eslintLoader=exports.importsLoader=exports.lessLoader=exports.cssLoader=exports.jsLoader=exports.mediaLoader=exports.fontLoader=exports.imageLoader=void 0;var _miniCssExtractPlugin=_interopRequireDefault(require("mini-css-extract-plugin"));var _os=_interopRequireDefault(require("os"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj};}// import ExtractTextPlugin from 'extract-text-webpack-plugin';
var imageLoader=function imageLoader(path,imgName,limit){return{test:/\.(png|jpe?g|gif)$/,use:[{loader:"file-loader",options:{limit:limit,name:"".concat(path,"/").concat(imgName,"/[name].[ext]")}}]};};exports.imageLoader=imageLoader;var fontLoader=function fontLoader(path,fontName,limit){return{test:/\.(woff|woff2|eot|ttf|svg)(\?(.*))?$/,use:[{loader:"file-loader",options:{limit:limit,name:"".concat(path,"/").concat(fontName,"/[name].[ext]")}}]};};exports.fontLoader=fontLoader;var mediaLoader=function mediaLoader(path,name){return{test:/\.(swf|wav|mp3|mpeg|mp4|webm|ogv)(\?v=\d+\.\d+\.\d+)?$/,use:[{loader:"file-loader",options:{name:"".concat(path,"/").concat(name,"/[name].[ext]")}}]};};exports.mediaLoader=mediaLoader;var jsLoader=function jsLoader(options,exclude){return{test:/\.js[x]?$/,use:[{loader:'thread-loader',options:{workers:_os["default"].cpus().length}},{loader:'babel-loader'}],// loader: `happypack/loader?id=${options.id}`,
exclude:exclude};};exports.jsLoader=jsLoader;var NODE_ENV=process.env.NODE_ENV!=='production';var testLoader=NODE_ENV?'style-loader':_miniCssExtractPlugin["default"].loader;var cssLoader=function cssLoader(options){return{test:/\.css$/,use:[{testLoader:testLoader,options:options},'css-loader']};};exports.cssLoader=cssLoader;var lessLoader=function lessLoader(options){return{test:/\.less$/,use:[{loader:testLoader,options:options},'css-loader','less-loader']};};exports.lessLoader=lessLoader;var importsLoader=function importsLoader(regExp){return{test:new RegExp("(".concat(regExp.join('|'),")$")),loader:'imports-loader?define=>false&module=>false&exports=>false&this=>window'};};// export const jsonLoader = () => {
//   return {
//     test: /\.json$/,
//     loader: 'json-loader'
//   }
// };
exports.importsLoader=importsLoader;var eslintLoader=function eslintLoader(){return{enforce:'pre',test:/\.(js|html)$/,loader:'eslint-loader',options:{fix:true}};};exports.eslintLoader=eslintLoader;