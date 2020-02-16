import { argv } from 'yargs';
import path from 'path';
import { searchIgnoreDirs, isPlugin, isBundle } from '../utils';

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
  noParseDeps: {},
  onlyCopys: [],
  global: {},
  externals: {
    jquery: 'jQuery',
  },
  regExp: 'react|webuploader|postal|lodash',
  minChunks: 5,

  commonsChunkFileName: 'common',
  entryMainName: 'main',
  entryFileName: 'index',
  extryCssName: 'main',
  baseName: 'libs/base',

  globalDir: 'app/Resources/static-src',
  nodeModulesDir: 'node_modules',
  pluginsDir: 'plugins',
  bundlesDir: 'src',
  activitiesDir: 'activities',
  themesDir: 'web/themes',

  fontlimit: 1024,
  imglimit: 1024,
  fontName: 'fonts',
  imgName: 'img',
  mediaName: 'media',
  copyName: 'img',
  isESlint: true,
  cpuNumber: 2,
  isNeedCommonChunk: '.is-need-common-chunk'
  
}, parameters);

// 绝对路径
const rootDir = path.resolve('./');
const globalDir = path.resolve(rootDir, defaultOptions.globalDir);
const nodeModulesDir = path.resolve(rootDir, defaultOptions.nodeModulesDir);
const pluginsDir = path.resolve(rootDir, defaultOptions.pluginsDir);
const themesDir = path.resolve(rootDir,defaultOptions.themesDir);
const bundlesDir = path.resolve(rootDir, defaultOptions.bundlesDir);
const activitiesDir = path.resolve(rootDir, defaultOptions.activitiesDir);

// 是否编译相应模块
const isBuildAllModule =  !!specialArgv.module ? false : true;
const argvModule = specialArgv.module ? specialArgv.module.split(',') : [];
const buildModule = [];

argvModule.forEach((item) => {
  if (isPlugin(item)) {
    buildModule.push(path.resolve(pluginsDir, item));
  } else if (isBundle(item)) {
    buildModule.push(path.resolve(bundlesDir, item));
  } else {
    buildModule.push(path.resolve(themesDir, item));
  }
});

// 是否watch相应模块
const isWatchAllModule = !!specialArgv.watch ? false : true;
const watchModule = specialArgv.watch ? specialArgv.watch.split(',') : [];

let ignoredDirs = [];

if (!isWatchAllModule) {
  ignoredDirs = ignoredDirs.concat(
    [globalDir],
    searchIgnoreDirs(pluginsDir, watchModule),
    searchIgnoreDirs(bundlesDir, watchModule),
    searchIgnoreDirs(themesDir, watchModule)
  );
}

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
  __VERBOSE__: specialArgv.verbose || false,

  rootDir,
  globalDir,
  nodeModulesDir,
  pluginsDir,
  themesDir,
  bundlesDir,
  activitiesDir,

  isBuildAllModule,
  buildModule,

  isWatchAllModule,
  ignoredDirs
});

export default options;
