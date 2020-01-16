import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';

// import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';


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
  optimization: {
    minimizer: [new UglifyJsPlugin()],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 4,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    noParse: [],
    rules: [
      loaders.vueLoader({
        hotReload: options.__DEV__ || options.__DEBUG__ ? true : false // 编译时关闭热重载
      }),
      loaders.jsLoader({
        cupNumber: options.cupNumber
      }, [
        options.nodeModulesDir
      ]),
      loaders.cssLoader({
        minimize: options.__DEV__ || options.__DEBUG__ ? false : true,
        hmr: options.__DEV__,
      }),
      loaders.lessLoader({
        minimize: options.__DEV__ || options.__DEBUG__ ? false : true,
        hmr: options.__DEV__,
      })
    ]
  },
  plugins: [
    // new HappyPack({
    //   id: 'babelJs',
    //   threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
    //   verbose: false,
    //   loaders: ['babel-loader']
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
      // allChunks: true
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
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
    // new OptimizeModuleIdAndChunkIdPlugin(),
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
  // config.plugins = config.plugins.concat(new webpack.optimize.UglifyJsPlugin(uglifyJsConfig));
} else {
  config.devtool = options.__DEVTOOL__;
}

// const minChunks = (module, count) => {
//   if(module.resource && (/^.*\.(css|less)$/).test(module.resource)) {
//     return false;
//   }
//   let pattern = new RegExp(options.regExp);
//   return module.resource && !pattern.test(module.resource) && count >= options.minChunks;
// }

// lib 配置
let libConfigs = [];
if (options.isBuildAllModule) {
  let libEntry = filterObject(entry.libEntry, options.baseName);
  let baseEntry = libEntry.filterObj;
  let newLibEntry = libEntry.newObj;

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
    plugins: []
  });
  baseConfig.externals = {};
  if (options.__ANALYZER__) {
    baseConfig.plugins = baseConfig.plugins.concat(new BundleAnalyzerPlugin({
      analyzerPort: 3997
    }));
  };
  libConfigs.push(baseConfig);

  newConfig = merge(config, {
    name: 'libs',
    entry: newLibEntry,
    module,
    plugins: [
      new CopyWebpackPlugin(entry.onlyCopys)
    ]
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
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'app',
      //   filename: `app/js/${options.commonsChunkFileName}.js`,
      //   chunks: Object.keys(entry.appEntry['app']),
      //   minChunks,
      // }),
      new ManifestPlugin({
        filename: `app/chunk-manifest.json`,
      }),
      // new ChunkManifestPlugin({
      //   filename: `app/chunk-manifest.json`,
      //   manifestVariable: "webpackManifest"
      // }),
    ]
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
      plugins: []
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
      // commonConfig.plugins = commonConfig.plugins.concat(new webpack.optimize.CommonsChunkPlugin({
      //   name: key,
      //   filename: `${key}/js/${options.commonsChunkFileName}.js`,
      //   chunks: Object.keys(commonEntry[key]),
      //   minChunks,
      // }), new ChunkManifestPlugin({
      //   filename: `${key}/chunk-manifest.json`,
      //   manifestVariable: 'webpackManifest'
      // }));

      commonConfig.plugins = commonConfig.plugins.concat(
        new ManifestPlugin({
          filename: `${key}/chunk-manifest.json`,
        })
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
