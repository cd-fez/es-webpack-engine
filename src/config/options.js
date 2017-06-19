import { argv } from 'yargs';
import path from 'path';

const parameters = argv.parameters ? require(path.resolve(argv.parameters)) : {};

const specialArgv = {};

argv._.forEach((arg) => {
  if (arg.indexOf(':') > 0) {
    let argArr = arg.split(':');
    specialArgv[argArr[0]] = argArr[1];
  }
});

// 配置项
const options = Object.assign({
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
  swfName: 'swf',
  copyName: 'img',

  isNeedCommonChunk: '.is-need-common-chunk',
  happypackTempDir: 'app/cache/dev/.happypack/',
  
  openModule: ['lib', 'app', 'plugin', 'theme', 'bundle'],
  pluginModule: [],
  bundleModule: [],
  themeModule: []

}, parameters);

// 绝对路径
const rootDir = path.resolve('./');
const globalDir = path.resolve(rootDir, options.globalDir);
const nodeModulesDir = path.resolve(rootDir, options.nodeModulesDir);
const pluginsDir = path.resolve(rootDir, options.pluginsDir);
const themesDir = path.resolve(rootDir,options.themesDir);
const webDir =  path.resolve(rootDir,options.webDir);
const bundlesDir = path.resolve(rootDir, options.bundlesDir);

// 是否开启相应模块
options.openModule = specialArgv.openModule ? specialArgv.openModule.split(',') : options.openModule;
options.openPluginsModule = specialArgv.pluginModule ? specialArgv.pluginModule.split(',') : options.pluginModule;
options.openBundlesModule = specialArgv.bundleModule ? specialArgv.bundleModule.split(',') : options.bundleModule;
options.openThemesModule = specialArgv.themeModule ? specialArgv.themeModule.split(',') : options.themeModule;

const isOpenModule = (module) => {
  return options.openModule.indexOf(module) !== -1;
}

const isOpenLibModule = isOpenModule('lib');
const isOpenAppModule = isOpenModule('app');
const isOpenPluginModule = isOpenModule('plugin');
const isOpenThemeModule = isOpenModule('theme');
const isOpenBundleModule = isOpenModule('bundle');

Object.assign(options, {
  output: {
    path: path.resolve(rootDir, options.output.path),
    publicPath: options.output.publicPath
  },

  // 开发模式
  __DEBUG__: !!specialArgv.debugMode,
  __DEV__: process.env.NODE_ENV === 'development',

  // 高级模式
  __DEV_SERVER_PORT__: specialArgv.port || 3030,
  __OPTIMIZE__: specialArgv.opt,
  __DEVTOOL__: specialArgv.devtool || 'cheap-module-eval-source-map',
  __FILE_INFO__: specialArgv.fileInfo,

  rootDir,
  globalDir,
  nodeModulesDir,
  pluginsDir,
  themesDir,
  bundlesDir,
  webDir,

  isOpenLibModule,
  isOpenAppModule,
  isOpenPluginModule,
  isOpenBundleModule,
  isOpenThemeModule,
});

export default options;
