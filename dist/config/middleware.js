"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _webpackDevMiddleware=_interopRequireDefault(require("webpack-dev-middleware"));var _options=_interopRequireDefault(require("./options"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj};}var _default=function _default(compiler,publicPath){var webpackDevMiddlewareOptions={publicPath:publicPath,quiet:false,noInfo:false,progress:true,stats:{colors:true,hash:false,chunks:false,chunkModules:false,children:_options["default"].__VERBOSE__,errorDetails:true},watchOptions:{aggregateTimeout:300,poll:true},lazy:false};return(0,_webpackDevMiddleware["default"])(compiler,webpackDevMiddlewareOptions);};exports["default"]=_default;