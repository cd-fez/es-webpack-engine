import path from 'path';
import glob from 'glob';
import webpack from 'webpack';
import HappyPack from 'happypack';
import merge from 'webpack-merge';
import os from 'os';
import fs from 'fs'; // 测试config配置
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import PurifyCSSPlugin from 'purifycss-webpack';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';
import RemoveWebpackJsPlugin from 'jay-remove-webpack-plugin';
import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import options  from './config/options';
import * as entry  from './config/entry';
import * as loaders from './config/loader';




import {
  fsExistsSync,
  isEmptyObject,
  filterObject,
  isArray,
  isPlugin,
  isBundle
} from './utils';

const otherViewNames = entry.commonNames.map(function(item) {
  if (isPlugin(item) || isBundle(item)) {
    return path.join(`${item}/Resources/views`, '/**/*.twig');
  } else {
    return path.join(`${item}/views`, '/**/*.twig');
  }
})

console.log(options.globalViewDir);
const otherViewLess = entry.commonNames.map(function(item) {
  if (isPlugin(item) || isBundle(item)) {
    return path.join(`${item}/Resources/static-src/less/`);
  } else {
    return path.join(`${item}/static-src/less/`);
  }
})

console.log('less的路径');
const appViewLess = path.join(`${options.globalDir}/app/less/`);
console.log(appViewLess);
const allLess = appViewLess.concat(otherViewLess);

let otherViews = [];
otherViewNames.forEach((item) => {
  otherViews = otherViews.concat(glob.sync(item));
})

const appViews = glob.sync(path.join(options.globalViewDir, '/**/*.twig'));
// const allViews = appViews.concat(otherViews);
// console.log(appViews);

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
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new HappyPack({
      id: 'babelJs',
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
      verbose: false,
      loaders: ['babel-loader?presets[]=env']
    }),
    // 打包样式也采用happypack
    new HappyPack({
      id: 'css',
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
      loaders: [{
        loader: 'css-loader',
      }]
    }),

    new HappyPack({
      id: 'less',
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
      loaders: [{
        loader: 'less-loader',
      }]
    }),

    new HappyPack({
      id: 'style',
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
      loaders: [{
        loader: 'style-loader',
      }]
    }),

    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('[name].css').replace('js', 'css');
      },
      allChunks: true
    }),

    new PurifyCSSPlugin({
      paths: appViews,
    }),
    // 压缩css
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new RemoveWebpackJsPlugin({
      filterPath: /.*\/css\/.*\.js?$/ig
    }),
    // new StyleLintPlugin({
    //   context: appViewLess,
    //   files: '**/*.(less|css|sass)',
    // }),

    new webpack.ProvidePlugin(options.global),
    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(zh-cn|en-gb)+\.js$/
    ),
  ],
};




// 兼容webpack 4 对于options.ignoredDirs做的类型校验
if(isArray(options.ignoredDirs) && options.ignoredDirs.length > 0) {
  config.plugins.push(new webpack.WatchIgnorePlugin(options.ignoredDirs));
}
console.log('基础配置完成');
// 如果你确定一个模块中，没有其它新的依赖，就可以配置这项， Webpack 将不再扫描这个文件中的依赖，这对于比较大型类库，将能促进性能表现
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
  // 压缩代码
  config.plugins.push(new ParallelUglifyPlugin({
    cacheDir: path.join(process.cwd(), 'webpack-cache'),
    uglifyJS: {
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }
  }));
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
      // 在webpack中拷贝文件和文件夹
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
        // 设置最小引用次数
        minChunks: options.minChunks,
        // 缓存组
        cacheGroups: {
          commons: {
            name: 'app-commons',
            // 最后输出 app/js/common.js
            filename: `app/js/${options.commonsChunkFileName}.js`,
            chunks: 'all',
          },
          default: {
            minChunks: options.minChunks,
          }
        }
      },
      runtimeChunk: true,
      // minimizer: [
      //   new ParallelUglifyPlugin({
      //     cacheDir: path.join(process.cwd(), 'webpack-cache'),
      //     uglifyJS: {
      //       output: {
      //         comments: false
      //       },
      //       compress: {
      //         warnings: false
      //       }
      //     }
      //   }),
        // new OptimizeCssAssetsPlugin({
        //   cssProcessor: require('cssnano'),
        //   cssProcessorOptions: { discardComments: { removeAll: true } },
        //   canPrint: true
        // }),
      // ]
    },
    plugins: [
      new ChunkManifestPlugin({
        filename: `app/chunk-manifest.json`,
        manifestVariable: "webpackManifest"
      }),
    ]
  });
  // 分析文件
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

    if (fsExistsSync(`${commonSrcEntry[key]}/${options.copyName}`)) { // 图片直接进行copy
      commonConfig.plugins = commonConfig.plugins.concat(new CopyWebpackPlugin([{
        from: `${commonSrcEntry[key]}/${options.copyName}`,
        to: `${key}/${options.copyName}`,
        toType: 'dir'
      }]))
    }

    if (fsExistsSync(`${commonSrcEntry[key]}/${options.isNeedCommonChunk}`)) {
      commonConfig.optimization = {
        // 针对各个插件，主题的配置
        splitChunks: {
          cacheGroups: {
            commons: {
              name: `commons`,
              filename: `${key}/js/${options.commonsChunkFileName}.js`,
              chunks: 'all',
              minChunks: options.minChunks,
            }
          }
        },
        runtimeChunk: true,
        // minimizer: [
        //   new ParallelUglifyPlugin({
        //     cacheDir: path.join(process.cwd(), 'webpack-cache'),
        //     uglifyJS: {
        //       output: {
        //         comments: false
        //       },
        //       compress: {
        //         warnings: false
        //       }
        //     }
        //   }),
          // new OptimizeCssAssetsPlugin({
          //   cssProcessor: require('cssnano'),
          //   cssProcessorOptions: { discardComments: { removeAll: true } },
          //   canPrint: true
          // }),
        // ]
      };
      // 该插件可以显示出编译之前的文件和编译之后的文件的映射 
      commonConfig.plugins = commonConfig.plugins.concat(
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