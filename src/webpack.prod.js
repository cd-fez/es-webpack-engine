import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import WebpackNotifierPlugin from 'es-webpack-notifier';
import ErrorPlugin from "webpack-notifier";
import config from './webpack.base';

import logger from './config/logger';

logger.info('building for production...');

const compiler = webpack(config, (err, stats) => {
  if (err) throw err;
});

new ErrorPlugin().apply(compiler);

new ProgressBarPlugin().apply(compiler);
