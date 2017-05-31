import webpackDevMiddleware from 'webpack-dev-middleware';
import options from './options';

export default (compiler, publicPath) => {
  const webpackDevMiddlewareOptions = {
    publicPath,
    quiet: false,
    noInfo: false,
    progress: true,
    stats: {
      colors: true,
      hash: false,
      chunks: false,
      chunkModules: false,
      children: options.__FILE_INFO__ || false,
      errorDetails: true
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    lazy: false,
  };

  return webpackDevMiddleware(compiler, webpackDevMiddlewareOptions);
}
