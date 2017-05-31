import express from 'express';
import webpack from 'webpack';
import path from 'path';
import serveIndex from 'serve-index';
import { argv } from 'yargs';
import cors from 'cors';
import fs from 'fs';
import chokidar from 'chokidar';
import WebpackNotifierPlugin from 'es-webpack-notifier';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import logger from './config/logger';
import webpackDevMiddleware from './config/middleware';
import options from './config/options';
import * as entry from './config/entry';

import baseConfig from './webpack.base';

const app = express();

const compiler = webpack(baseConfig);

compiler.apply(new WebpackNotifierPlugin());
compiler.apply(new ProgressBarPlugin());

app.use(webpackDevMiddleware(compiler, options.output.publicPath));
app.use(options.output.publicPath, serveIndex(options.output.path, {'icons': true}));

app.use(cors());

app.listen(options.__DEV_SERVER_PORT__, '0.0.0.0',(err) => {
  logger.info(`Express server listening on ${options.__DEV_SERVER_PORT__} in ${app.settings.env} node`);

  if (err) {
    logger.error(err);
  }
});

let watchDir = [];

if(options.isOpenAppModule) {
  watchDir.push(`${options.globalDir}/app`);
}
if(options.isOpenPluginModule) {
  watchDir = watchDir.concat(entry.pluginAssetsDirs);
}
if(options.isOpenBundleModule) {
  watchDir = watchDir.concat(entry.bundleAssetsDirs);
}
if(options.isOpenThemeModule) {
  watchDir = watchDir.concat(entry.themeAssetsDirs);
}

let watcher = chokidar.watch(watchDir, {
  ignored: /[\/\\]\./,
  ignoreInitial: true
});

const isEntryFile = (path) => { 
  return path.indexOf('index.js') !== -1;
};

// 监听新增入口文件
watcher.on('add', (path) => {
  if(isEntryFile(path)) {
    logger.info(`File ${path} has been added`);

    fs.readFile('nodemon.json', "utf8", (err, data) => {
      if (err) {
        logger.warn("请在根目录下添加nodemon.json文件");
      } else if (data) {
        fs.writeFile('nodemon.json', data);
      }
    })
  }
});
