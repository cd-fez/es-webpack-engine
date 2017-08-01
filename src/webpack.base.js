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

// 通用配置
const config = {
  output: Object.assign(options.output, {
    filename: '[name].js',
  }),
  externals: options.externals,
  resolve: {
    alias: Object.assign(entry.configAlias, {
      'nodeModulesDir': options.nodeModulesDir,
    }),
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
if (options.isBuildAllModule && !isEmptyObject(entry.appEntry['app'])) {
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

// plugin 配置
let pluginConfigs = [];
if (options.isBuildAllModule || options.pluginModule.length) {
  const pluginEntryKeys = Object.keys(entry.pluginEntry);
  let index = 0;

  pluginEntryKeys.forEach((key) => {
    let pluginConfig = {};
    if (isEmptyObject(entry.pluginEntry[key])) return;
    
    pluginConfig = merge(config, {
      name: `${key}`,
      entry: entry.pluginEntry[key],
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

    if (options.__OPTIMIZE__) {
      pluginConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerPort: `400${index}`
      }))
    };

    if (fsExistsSync(`${entry.pluginSrcEntry[key]}/${options.isNeedCommonChunk}`)) {
      pluginConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: key,
        filename: `${key}/js/${options.commonsChunkFileName}.js`,
        chunks: Object.keys(entry.pluginEntry[key]),
        minChunks,
      }))
    }

    if (fsExistsSync(`${entry.pluginSrcEntry[key]}/${options.copyName}`)) {
      pluginConfig.plugins.push(new CopyWebpackPlugin([{
        from: `${entry.pluginSrcEntry[key]}/${options.copyName}`,
        to: `${key}/${options.copyName}`,
        toType: 'dir'
      }]))
    }

    pluginConfigs.push(pluginConfig);
    index ++;
  })
}

// bundle 配置
let bundleConfigs = [];
if (options.isBuildAllModule || options.bundleModule.length) {
  const bundleEntryKeys = Object.keys(entry.bundleEntry);
  let index = 0;

  bundleEntryKeys.forEach((key) => {
    let bundleConfig = {};
    if (isEmptyObject(entry.bundleEntry[key])) return;

    bundleConfig = merge(config, {
      name: `${key}`,
      entry: entry.bundleEntry[key],
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

    if (options.__OPTIMIZE__) {
      bundleConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerPort: `410${index}`
      }))
    };

    if (fsExistsSync(`${entry.bundleSrcEntry[key]}/${options.isNeedCommonChunk}`)) {
      bundleConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: key,
        filename: `${key}/js/${options.commonsChunkFileName}.js`,
        chunks: Object.keys(entry.bundleEntry[key]),
        minChunks,
      }))
    }

    if (fsExistsSync(`${entry.bundleSrcEntry[key]}/${options.copyName}`)) {
      bundleConfig.plugins.push(new CopyWebpackPlugin([{
        from: `${entry.bundleSrcEntry[key]}/${options.copyName}`,
        to: `${key}/${options.copyName}`,
        toType: 'dir'
      }]))
    }

    bundleConfigs.push(bundleConfig);
    index ++;
  })
}

// theme 配置
let themeConfigs = [];
if (options.isBuildAllModule || options.themeModule.length) {
  const themeEntryKeys = Object.keys(entry.themeEntry);

  themeEntryKeys.forEach((key) => {
    let themeConfig = {};
    if (isEmptyObject(entry.themeEntry[key])) return;
    
    themeConfig = merge(config, {
      name: `${key}`,
      entry: entry.themeEntry[key],
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

    if (fsExistsSync(`${entry.themeSrcEntry[key]}/${options.copyName}`)) {
      themeConfig.plugins.push(new CopyWebpackPlugin([{
        from: `${entry.themeSrcEntry[key]}/${options.copyName}`,
        to: `${key}/${options.copyName}`,
        toType: 'dir'
      }]))
    } 

    themeConfigs.push(themeConfig);
  })
}

// 总配置
let configs = [];

[libConfigs, appConfig, pluginConfigs, bundleConfigs, themeConfigs].forEach((item) => {
  if (item.constructor === Object && !isEmptyObject(item)) {
    configs.push(item);

  } else if ( item.constructor === Array && item.length) {
    configs = configs.concat(item);
  }
});

export default configs;
