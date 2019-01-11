import webpack from 'es-webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import config from './webpack.base';

import logger from './config/logger';

logger.info('building for production...');

const compiler = webpack(config, (err, stats) => {
  if (err) throw err;
});

compiler.apply(new ProgressBarPlugin());
