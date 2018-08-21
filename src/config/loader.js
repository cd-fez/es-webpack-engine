import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AutoprefixerPlugin from 'autoprefixer';

export const imageLoader = (path, imgName, limit) => {
  return {
    test: /\.(png|jpe?g|gif)$/,
    use: [
      {
        loader: `file-loader`,
        options: {
          limit,
          name: `${path}/${imgName}/[name].[ext]`
        }
      }
    ]
  }
};

export const fontLoader = (path, fontName, limit) => {
  return {
    test: /\.(woff|woff2|eot|ttf|svg)(\?(.*))?$/,
    use: [
      {
        loader: `file-loader`,
        options: {
          limit,
          name: `${path}/${fontName}/[name].[ext]`
        }
      }
    ]
    
  }
};

export const mediaLoader = (path, name) => {
  return {
    test: /\.(swf|wav|mp3|mpeg|mp4|webm|ogv)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: `file-loader`,
        options: {
          name: `${path}/${name}/[name].[ext]`
        }
      }
    ]
  }
};

export const jsLoader = (options, exclude) => {
  return {
    test: /\.js[x]?$/,
    loader: `happypack/loader?id=${options.id}`,
    options,
    exclude,
  }
};

export const cssLoader = (options) => {
  return {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader?id=style',
      use: [{
        loader: 'css-loader?id=css',
        options
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => AutoprefixerPlugin({
            browsers: ['last 5 versions', '> 1%', 'not ie <= 8']
          })
        }
      }]
    })
  }
};

export const lessLoader = (options) => {
  return {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader?id=style',
      use: [{
        loader: 'css-loader?id=css',
        options
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => AutoprefixerPlugin({
            browsers: ['last 3 versions', '> 1%', 'not ie <= 8']
          })
        }
      },
      {
        loader: 'less-loader?id=less'
      }]
    })
  }
};

export const importsLoader = (regExp) => {
  return {
    test: new RegExp(`(${regExp.join('|')})$`),
    loader: 'imports-loader?define=>false&module=>false&exports=>false&this=>window',
  }
};

export const eslintLoader = () => {
  return {
    enforce: 'pre',
    test:/\.(js|html)$/,
    loader: 'eslint-loader',
    options: {
      fix: true,
    }
  };
};
