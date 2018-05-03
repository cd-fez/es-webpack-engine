import path from 'path';
import webpack from 'webpack';
import HappyPack from 'happypack';
import merge from 'webpack-merge';
import os from 'os';
import fs from 'fs'; // 测试config配置

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
import OptimizeModuleIdAndChunkIdPlugin from 'optimize-moduleid-and-chunkid-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import options  from './config/options';
import * as entry  from './config/entry';
import * as loaders from './config/loader';
import uglifyJsConfig from './config/uglify';

import { 
  fsExistsSync, 
  isEmptyObject, 
  filterObject,
  isArray,
} from './utils';

console.log('修改了', options.ignoredDirs);
// 基础配置
const config = {
  mode: options.__DEV__ ? 'development' : 'production',
  output: Object.assign(options.output, {
    filename: '[name].js',
  }),
  externals: options.externals,
  resolve: {
    alias: entry.configAlias,
    extensions: ['*', '.js', '.jsx'],
  },
  module: {
    noParse: [],
    rules: [
      loaders.jsLoader({
        id: 'babelJs',
      }, [
        options.nodeModulesDir
      ]),
      loaders.cssLoader({
        minimize: options.__DEV__ || options.__DEBUG__ ? false : true
      }), 
      loaders.lessLoader({
        minimize: options.__DEV__ || options.__DEBUG__ ? false : true
      }),
      loaders.jsonLoader(),
    ]
  },
  plugins: [
    new HappyPack({
      id: 'babelJs',
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
      verbose: false,
      loaders: ['babel-loader?presets[]=env']
    }),
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('[name].css').replace('js', 'css');
      },
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new webpack.ProvidePlugin(options.global),
    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(zh-cn|en-gb)+\.js$/
    ),
    // new OptimizeModuleIdAndChunkIdPlugin(),
  ]
};
// 兼容webpack 4 对于options.ignoredDirs做的类型校验
if(isArray(options.ignoredDirs) && options.ignoredDirs.length > 0) {
  config.plugins.push(new webpack.WatchIgnorePlugin(options.ignoredDirs));
}
console.log('基础配置完成');
for (let key in options.noParseDeps) {
  const depPath = path.resolve(options.nodeModulesDir, options.noParseDeps[key]);
  config.resolve.alias[key] = depPath;
  config.module.noParse.push(depPath);
  config.module.rules.push(loaders.importsLoader(config.module.noParse))
}

if (options.__DEV__) {
  config.plugins = config.plugins.concat(new FriendlyErrorsPlugin());
  // options.isESlint ? config.module.rules.push(loaders.eslintLoader()) : '';
}

if (!options.__DEV__ && !options.__DEBUG__) {
  config.plugins = config.plugins.concat(new webpack.optimize.UglifyJsPlugin(uglifyJsConfig));
} else {
  config.devtool = options.__DEVTOOL__;
}

const minChunks = (module, count) => {
  if(module.resource && (/^.*\.(css|less)$/).test(module.resource)) {
    return false;
  }
  let pattern = new RegExp(options.regExp);
  return module.resource && !pattern.test(module.resource) && count >= options.minChunks;
}
console.log('不解析模块配置完成', process.env.NODE_ENV);
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
console.log('lib配置完成');
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
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'app-commons',
            filename: `app/js/${options.commonsChunkFileName}.js`,
            chunks: 'all',
            minChunks: options.minChunks,
          }
        }
      }
    },
    plugins: [
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'app',
      //   filename: `app/js/${options.commonsChunkFileName}.js`,
      //   chunks: Object.keys(entry.appEntry['app']),
      //   minChunks,
      // }),
      new ChunkManifestPlugin({
        filename: `app/chunk-manifest.json`,
        manifestVariable: "webpackManifest"
      }),
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
console.log('app配置完成');
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
      commonConfig.optimization = {
        splitChunks: {
          cacheGroups: {
            commons: {
              name: `commons`,
              filename: `${key}/js/${options.commonsChunkFileName}.js`,
              chunks: 'all',
              minChunks: options.minChunks,
            }
          }
        }
      };
      commonConfig.plugins = commonConfig.plugins.concat(
        // new webpack.optimize.CommonsChunkPlugin({
        //   name: key,
        //   filename: `${key}/js/${options.commonsChunkFileName}.js`,
        //   chunks: Object.keys(commonEntry[key]),
        //   minChunks,
        // }), 
        new ChunkManifestPlugin({
        filename: `${key}/chunk-manifest.json`,
        manifestVariable: 'webpackManifest'
      }));
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
console.log('通用配置完成');
// 总配置
let configs = [];
[libConfigs, appConfig, commonConfigs].forEach((item) => {
  if (item.constructor === Object && !isEmptyObject(item)) {
    configs.push(item);

  } else if ( item.constructor === Array && item.length) {
    configs = configs.concat(item);
  }
});
console.log('这里是base配置');

export default configs;