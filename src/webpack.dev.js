import express from 'express';
import webpack from 'webpack';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import chokidar from 'chokidar';
import WebpackNotifierPlugin from 'es-webpack-notifier';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import logger from './config/logger';
import webpackDevMiddleware from './config/middleware';
import options from './config/options';
import * as entry from './config/entry';
import { fsExistsSync } from './utils';

import baseConfig from './webpack.base';

if (!fsExistsSync('.webpack-watch.log')) {
  logger.error('请在项目根目录下添加.webpack-watch.log文件, 否则无法监听新增入口JS文件');
}
console.log('这里是dev');
const app = express();

const compiler = webpack(baseConfig);

compiler.apply(new WebpackNotifierPlugin());
// compiler.apply(new ProgressBarPlugin());

app.use(webpackDevMiddleware(compiler, options.output.publicPath));

// app.use(cors());

app.listen(options.__DEV_SERVER_PORT__, '0.0.0.0',(err) => {
  logger.info(`Express server listening on ${options.__DEV_SERVER_PORT__} in ${app.settings.env} node`);

  if (err) {
    logger.error(err);
  }
});

let watchDir = [
  `${options.globalDir}/app`,
  options.pluginsDir,
  options.themesDir,
  options.bundlesDir
]

let watcher = chokidar.watch(watchDir, {
  ignored: /[\/\\]\./,
  ignoreInitial: true
});

const isEntryFile = (path) => {
  return path.indexOf(`${options.entryFileName}.js`) !== -1 && path.indexOf('static-src') !== -1;
};

// 监听新增入口文件
watcher.on('add', (path) => {
  if(isEntryFile(path)) {
    if (fsExistsSync('.webpack-watch.log')) {
      logger.info(`入口JS文件${path}被新增`);
      fs.writeFileSync('.webpack-watch.log', `File ${path} has been added`, 'utf8');
    } else {
      logger.error("请在项目根目录下添加.webpack-watch.log文件, 否则无法监听新增入口JS文件");
    }
  }
});