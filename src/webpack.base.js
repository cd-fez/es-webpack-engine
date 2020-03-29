import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import ErrorPlugin from "webpack-notifier";

import WebpackAssetsManifest from 'webpack-assets-manifest';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';

import options  from './config/options';
import * as entry  from './config/entry';
import * as loaders from './config/loader';

import {
  fsExistsSync,
  isEmptyObject,
  filterObject
} from './utils';

// 基础配置

const config = {
  watch: options.__DEV__,
  watchOptions: {
    ignored: /node_modules/
  },
  mode: process.env.NODE_ENV,
  output: Object.assign(options.output, {
    filename: '[name].js',
  }),
  externals: options.externals,
  resolve: {
    alias: entry.configAlias,
    extensions: ['*', '.js', '.jsx', '.vue'],
  },
  module: {
    noParse: [],
    rules: [
      loaders.vueLoader({
        hotReload: options.__DEV__ || options.__DEBUG__ ? true : false // 编译时关闭热重载
      }),
      loaders.jsLoader({
        cpuNumber: options.cpuNumber
      }, [
        options.nodeModulesDir
      ]),
      loaders.cssLoader({
        minimize: options.__DEV__ || options.__DEBUG__ ? false : true,
        hmr: options.__DEV__,
        reloadAll: true,
      }),
      loaders.lessLoader({
        minimize: options.__DEV__ || options.__DEBUG__ ? false : true,
        hmr: options.__DEV__,
        reloadAll: true,
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new webpack.DefinePlugin({
      // __webpack_public_path__: `window.__publicPath`,
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new webpack.ProvidePlugin(options.global),
    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(zh-cn|en-gb)+\.js$/
    ),
    new VueLoaderPlugin(),
    new ErrorPlugin(),
  ]
};

if (!options.isWatchAllModule) {
  concat.plugins.push(new webpack.WatchIgnorePlugin(options.ignoredDirs))
}

for (let key in options.noParseDeps) {
  const depPath = path.resolve(options.nodeModulesDir, options.noParseDeps[key]);
  config.resolve.alias[key] = depPath;
  config.module.noParse.push(depPath);
  config.module.rules.push(loaders.importsLoader(config.module.noParse))
}

if (options.__DEV__) {
  config.plugins = config.plugins.concat(new FriendlyErrorsPlugin());
  options.isESlint ? config.module.rules.push(loaders.eslintLoader()) : '';
}

if (!options.__DEV__ && !options.__DEBUG__) {
  config.plugins = config.plugins.concat(new OptimizeCssAssetsPlugin());
} else {
  config.devtool = options.__DEVTOOL__;
}

// lib 配置
let libConfigs = [];
if (options.isBuildAllModule) {
  let libEntry = filterObject(entry.libEntry, options.baseName);
  let baseEntry = libEntry.filterObj;
  let newLibEntry = libEntry.newObj;


  // base
  let baseConfig = {};
  let newConfig = {};

  let module = {
    rules: [
      loaders.imageLoader('libs', options.imgName, options.imglimit),
      loaders.fontLoader('libs', options.fontName, options.fontlimit),
      loaders.mediaLoader('libs', options.mediaName),
    ]
  }

  baseConfig = merge(config, {
    name: 'base',
    entry: baseEntry,
    module,
    plugins: [],
    optimization: {
      minimizer: [new UglifyJsPlugin()]
    }
  });
  baseConfig.externals = {};
  if (options.__ANALYZER__) {
    baseConfig.plugins = baseConfig.plugins.concat(new BundleAnalyzerPlugin({
      analyzerPort: 3997
    }));
  };
  libConfigs.push(baseConfig);

  // lib
  newConfig = merge(config, {
    name: 'libs',
    entry: newLibEntry,
    module,
    plugins: [
      new CopyWebpackPlugin(entry.onlyCopys)
    ],
    optimization: {
      minimizer: [new UglifyJsPlugin()]
    }
  });
  if (options.__ANALYZER__) {
    newConfig.plugins = newConfig.plugins.concat(new BundleAnalyzerPlugin({
      analyzerPort: 3998
    }));
  };
  libConfigs.push(newConfig);
}

// app 配置
let appConfig = {};
if (options.isBuildAllModule) {
  appConfig = merge(config, {
    name: 'app',
    entry: entry.appEntry['app'],
    module: {
      rules: [
        loaders.imageLoader('app', options.imgName, options.imglimit),
        loaders.fontLoader('app', options.fontName, options.imglimit),
        loaders.mediaLoader('app', options.mediaName),
      ]
    },
    plugins: [
      new WebpackAssetsManifest({
        output: 'app/chunk-manifest.json',
      }),
    ],
    optimization: {
      minimizer: [new UglifyJsPlugin()],
      splitChunks: {
        // chunks: 'initial',
        // minSize: 30000,
        // maxSize: 0,
        // minChunks: 1,
        // maxAsyncRequests: 4,
        // maxInitialRequests: 3,
        // automaticNameDelimiter: '~',
        // name: true,
        // 默认抽离样式文件 3次引用在抽离
        cacheGroups: {
          common: {
            name: `app/js/${options.commonsChunkFileName}`,
            chunks: "initial",  //入口处开始提取代码
            minSize: 300000,      //代码最小多大，进行抽离
            minChunks: 6,
          }
        }
      }
    },
  });

  if (options.__ANALYZER__) {
    appConfig.plugins = appConfig.plugins.concat(new BundleAnalyzerPlugin({
      analyzerPort: 3999
    }))
  };

  if (fsExistsSync(`${options.globalDir}/app/${options.copyName}`)) {
    appConfig.plugins = appConfig.plugins.concat(new CopyWebpackPlugin([{
      from: `${options.globalDir}/app/${options.copyName}`,
      to: `app/${options.copyName}`,
      toType: 'dir'
    }]))
  }
}

// 通用配置 - 包括插件、bundle、主题、教学活动
let commonConfigs = [];
if (options.isBuildAllModule || options.buildModule.length) {
  const commonEntry = entry.commonEntry;

  const commonEntryKeys = Object.keys(commonEntry);

  let index = 0;

  commonEntryKeys.forEach((key) => {
    let commonConfig = {};

    if (isEmptyObject(commonEntry[key])) {
      return;
    };
    const otherBundleChunks = key == 'reservationplugin' ? 10: 5;
    commonConfig = merge(config, {
      name: `${key}`,
      entry: commonEntry[key],
      module: {
        rules: [
          loaders.imageLoader(key, options.imgName, options.imglimit),
          loaders.fontLoader(key, options.fontName, options.fontlimit),
          loaders.mediaLoader(key, options.mediaName),
        ]
      },
      plugins: [],
      optimization: {
        minimizer: [new UglifyJsPlugin()],
        splitChunks: {
          cacheGroups: {
            common: {
              name: `${key}/js/${options.commonsChunkFileName}`,
              chunks: 'initial',  //入口处开始提取代码
              minChunks: otherBundleChunks,
            }
          }
        }
      },
    })

    let commonSrcEntry = entry.commonSrcEntry;

    if (fsExistsSync(`${commonSrcEntry[key]}/${options.copyName}`)) {
      commonConfig.plugins = commonConfig.plugins.concat(new CopyWebpackPlugin([{
        from: `${commonSrcEntry[key]}/${options.copyName}`,
        to: `${key}/${options.copyName}`,
        toType: 'dir'
      }]))
    }

    if (fsExistsSync(`${commonSrcEntry[key]}/${options.isNeedCommonChunk}`)) {
      commonConfig.plugins = commonConfig.plugins.concat(
        new WebpackAssetsManifest({
          output: `${key}/chunk-manifest.json`
        }),
      );
    }

    if (options.__ANALYZER__) {
      commonConfig.plugins = commonConfig.plugins.concat(new BundleAnalyzerPlugin({
        analyzerPort: `400${index}`
      }));
    };

    commonConfigs.push(commonConfig);

    index ++;
  })
}

// 总配置
let configs = [];
[libConfigs, appConfig, commonConfigs].forEach((item) => {
  if (item.constructor === Object && !isEmptyObject(item)) {
    configs.push(item);

  } else if ( item.constructor === Array && item.length) {
    configs = configs.concat(item);
  }
});

export default configs;
