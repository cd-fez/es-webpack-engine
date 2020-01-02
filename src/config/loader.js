// import ExtractTextPlugin from 'extract-text-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import os from "os";

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
    use: [
      {
        loader: 'thread-loader',
        options: {
          workers: os.cpus().length
        }
      },
      {
        loader: 'babel-loader',
      }
    ],
    // loader: `happypack/loader?id=${options.id}`,
    exclude,
  }
};

const NODE_ENV = process.env.NODE_ENV !== 'production';

const testLoader = NODE_ENV ? 'style-loader': MiniCssExtractPlugin.loader;
export const cssLoader = (options) => {
  return {
    test: /\.css$/,
    use: [
      {
        testLoader,
        options
      },
       'css-loader',
    ],
  }
};

export const lessLoader = (options) => {
  return {
    test: /\.less$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options,
      },
      'css-loader',
      'less-loader',
    ]
  }
};

export const importsLoader = (regExp) => {
  return {
    test: new RegExp(`(${regExp.join('|')})$`),
    loader: 'imports-loader?define=>false&module=>false&exports=>false&this=>window',
  }
};

// export const jsonLoader = () => {
//   return {
//     test: /\.json$/,
//     loader: 'json-loader'
//   }
// };

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
