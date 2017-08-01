import path from 'path';
import webpack from 'webpack';
import HappyPack from 'happypack';
import merge from 'webpack-merge';

import ExtractTextPlugin from 'es-extract-text-webpack-plugin';
import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
import OptimizeModuleIdAndChunkIdPlugin from 'optimize-moduleid-and-chunkid-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import es3ifyPlugin from 'es3ify-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import WatchIgnorePlugin from 'watch-ignore-webpack-plugin';

import options  from './config/options';
import * as entry  from './config/entry';
import * as loaders from './config/loader';
import uglifyJsConfig from './config/uglify';

import { 
  fsExistsSync, 
  isEmptyObject, 
  filterObject
} from './utils';

// 基础配置
const config = {
  output: Object.assign(options.output, {
    filename: '[name].js',
  }),
  externals: options.externals,
  resolve: {
    alias: entry.configAlias,
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    noParse: [],
    loaders: [
      loaders.jsLoader('babelJs', [
        options.nodeModulesDir
      ]),
      loaders.cssLoader(), 
      loaders.lessLoader(),
      loaders.jsonLoader(),
      loaders.importsLoader(options.noParseDeps)
    ]
  },
  plugins: [
    new HappyPack({
      id: 'babelJs',
      threadPool: HappyPack.ThreadPool({ size: 6 }),
      verbose: false,
      loaders: ['babel-loader'],
      tempDir: options.happypackTempDir,
    }),
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    }),
    new es3ifyPlugin(),
    new webpack.ProvidePlugin(options.global),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      __DEBUG__: options.__DEBUG__,
      __DEV__: options.__DEV__,
    }),
    new OptimizeModuleIdAndChunkIdPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new WatchIgnorePlugin(options.ignoredDirs)
  ]
};

options.noParseDeps.forEach(dep => {
  const depPath = path.resolve(options.nodeModulesDir, dep);
  config.resolve.alias[dep.split(path.sep)[0].replace('.', '-')] = depPath;
  config.module.noParse.push(depPath);
});

if (options.__DEV__) {
  config.plugins.push(new FriendlyErrorsPlugin());
}

if (!options.__DEV__ && !options.__DEBUG__) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyJsConfig));
} else {
  config.devtool = options.__DEVTOOL__;
}

const minChunks = (module, count) => {
  // let pattern = new RegExp(options.regExp);
  // return module.resource && !pattern.test(module.resource) && count >= options.minChunks;
  return count >= options.minChunks;
}

// lib 配置
let libConfigs = [];
if (options.isBuildAllModule) {
  let libEntry = filterObject(entry.libEntry, 'base');
  let vendorEntry = libEntry.filterObj;
  let newLibEntry = libEntry.newObj;

  let vendorConfig = {};
  let newConfig = {};

  let module = {
    loaders: [
      loaders.imageLoader('libs', options.imgName, options.imglimit),
      loaders.fontLoader('libs', options.fontName, options.fontlimit),
      loaders.mediaLoader('libs', options.mediaName),
    ]
  }

  vendorConfig = merge(config, {
    name: 'vendor',
    entry: vendorEntry,
    module,
    plugins: []
  });
  vendorConfig.externals = {};
  if (options.__OPTIMIZE__) {
    vendorConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerPort: 3997
    }));
  };
  libConfigs.push(vendorConfig);

  newConfig = merge(config, {
    name: 'libs',
    entry: newLibEntry,
    module,
    plugins: [
      new CopyWebpackPlugin(entry.onlyCopys)
    ]
  });
  if (options.__OPTIMIZE__) {
    newConfig.plugins.push(new BundleAnalyzerPlugin({
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
      loaders: [
        loaders.imageLoader('app', options.imgName, options.imglimit),
        loaders.fontLoader('app', options.fontName, options.imglimit),
        loaders.mediaLoader('app', options.mediaName),
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'app',
        filename: `app/js/${options.commonsChunkFileName}.js`,
        chunks: Object.keys(entry.appEntry['app']),
        minChunks,
      }),
      new ChunkManifestPlugin({
        filename: `app/chunk-manifest.json`,
        manifestVariable: "webpackManifest"
      }),
    ]
  });

  if (options.__OPTIMIZE__) {
    appConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerPort: 3999
    }))
  };

  if (fsExistsSync(`${options.globalDir}/app/${options.copyName}`)) {
    appConfig.plugins.push(new CopyWebpackPlugin([{
      from: `${options.globalDir}/app/${options.copyName}`,
      to: `app/${options.copyName}`,
      toType: 'dir'
    }]))
  }
}

// 通用配置 - 包括插件、bundle、主题
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
        loaders: [
          loaders.imageLoader(key, options.imgName, options.imglimit),
          loaders.fontLoader(key, options.fontName, options.fontlimit),
          loaders.mediaLoader(key, options.mediaName),
        ]
      },
      plugins: [
        new ChunkManifestPlugin({
          filename: `${key}/chunk-manifest.json`,
          manifestVariable: "webpackManifest"
        })
      ]
    })

    let commonSrcEntry = entry.commonSrcEntry;

    if (fsExistsSync(`${commonSrcEntry[key]}/${options.copyName}`)) {
      commonConfig.plugins.push(new CopyWebpackPlugin([{
        from: `${commonSrcEntry[key]}/${options.copyName}`,
        to: `${key}/${options.copyName}`,
        toType: 'dir'
      }]))
    }

    if (fsExistsSync(`${commonSrcEntry[key]}/${options.isNeedCommonChunk}`)) {
      commonConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: key,
        filename: `${key}/js/${options.commonsChunkFileName}.js`,
        chunks: Object.keys(commonEntry[key]),
        minChunks,
      }))
    }

    
    if (options.__OPTIMIZE__) {
      commonConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerPort: `400${index}`
      }))
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
