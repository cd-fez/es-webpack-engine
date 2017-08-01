import { argv } from 'yargs';
import path from 'path';
import * as utils from '../utils';

const parameters = argv.parameters ? require(path.resolve(argv.parameters)) : {};

const specialArgv = {};

argv._.forEach((arg) => {
  if (arg.indexOf(':') > 0) {
    let argArr = arg.split(':');
    specialArgv[argArr[0]] = argArr[1];
  }
});

// 默认配置项
const defaultOptions = Object.assign({
  output: {
    path: 'web/static-dist/',
    publicPath: '/static-dist/',
  },

  libs: {},
  noParseDeps: [],
  onlyCopys: [],
  global: {},
  externals: {
    jquery: 'jQuery',
  },
  regExp: '', // 'react|webuploader'
  minChunks: 5,

  commonsChunkFileName: 'common',
  entryMainName: 'main',
  entryFileName: 'index',
  extryCssName: 'main',

  globalDir: 'app/Resources/static-src',
  nodeModulesDir: 'node_modules',
  pluginsDir: 'plugins',
  bundlesDir: 'src',
  themesDir: 'web/themes',
  webDir: 'web',

  fontlimit: 1024,
  imglimit: 1024,
  fontName: 'fonts',
  imgName: 'img',
  mediaName: 'media',
  copyName: 'img',

  isNeedCommonChunk: '.is-need-common-chunk',
  happypackTempDir: 'app/cache/dev/.happypack/',
  
}, parameters);

// 绝对路径
const rootDir = path.resolve('./');
const globalDir = path.resolve(rootDir, defaultOptions.globalDir);
const nodeModulesDir = path.resolve(rootDir, defaultOptions.nodeModulesDir);
const pluginsDir = path.resolve(rootDir, defaultOptions.pluginsDir);
const themesDir = path.resolve(rootDir,defaultOptions.themesDir);
const webDir =  path.resolve(rootDir,defaultOptions.webDir);
const bundlesDir = path.resolve(rootDir, defaultOptions.bundlesDir);

// 是否编译相应模块
const isBuildAllModule =  !!specialArgv.module ? false : true;
const buildModule = specialArgv.module ? specialArgv.module.split(',') : [];

const pluginModule = [];
const bundleModule = [];
const themeModule = [];

buildModule.forEach((item) => {
  if (item.indexOf('Plugin') !== -1) {
    pluginModule.push(path.resolve(pluginsDir, item));
  } else if (item.indexOf('Bundle') !== -1) {
    bundleModule.push(path.resolve(bundlesDir, item));
  } else {
    themeModule.push(path.resolve(themesDir, item));
  }
});

// 是否watch相应模块
const isWatchAllModule = !!specialArgv.watch ? false : true;
const watchModule = specialArgv.watch ? specialArgv.watch.split(',') : [];

let ignoredDirs = [];
const watchPluginDirs = [];
const watchBundleDirs = [];
const watchThemeDirs = [];
watchModule.forEach((item) => {
  if (item.indexOf('Plugin') !== -1) {
    watchPluginDirs.push(item);
  } else if (item.indexOf('Bundle') !== -1) {
    watchBundleDirs.push(item);
  } else {
    watchThemeDirs.push(item);
  }
});

ignoredDirs = ignoredDirs.concat(
  utils.ignoreDirs(pluginsDir, watchPluginDirs),
  utils.ignoreDirs(bundlesDir, watchBundleDirs),
  utils.ignoreDirs(themesDir, watchThemeDirs)
);

const options = Object.assign({}, defaultOptions, {
  output: {
    path: path.resolve(rootDir, defaultOptions.output.path),
    publicPath: defaultOptions.output.publicPath
  },

  // 开发模式
  __DEBUG__: specialArgv.sourcemap,
  __DEV__: process.env.NODE_ENV === 'development',

  // 高级模式
  __DEV_SERVER_PORT__: specialArgv.port || 3030,
  __ANALYZER__: specialArgv.analyzer,
  __DEVTOOL__: specialArgv.sourcemap ? 'source-map' : 'cheap-module-eval-source-map',
  __VERBOSE__: specialArgv.verbose,

  rootDir,
  globalDir,
  nodeModulesDir,
  pluginsDir,
  themesDir,
  bundlesDir,
  webDir,

  isBuildAllModule,
  pluginModule,
  bundleModule,
  themeModule,

  isWatchAllModule,
  ignoredDirs
  
});

export default options;
