import ExtractTextPlugin from 'extract-text-webpack-plugin';

export const imageLoader = (path, imgName, limit) => {
  return {
    test: /\.(png|jpe?g|gif)$/,
    loader: 'url-loader',
    query: {
      limit,
      name: `${path}/${imgName}/[name].[ext]`
    }
  }
};

export const fontLoader = (path, fontName, limit) => {
  return {
    test: /\.(woff|woff2|eot|ttf|svg)(\?(.*))?$/,
    loader: 'url-loader',
    query: {
      limit,
      name: `${path}/${fontName}/[name].[ext]`
    }
  }
};

export const swfLoader = (path, name) => {
  return {
    test: /\.swf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file-loader',
    query: {
      name: `${path}/${name}/[name].[ext]`
    }
  }
};

export const jsLoader = (id, exclude) => {
  return {
    test: /\.js[x]?$/,
    loader: 'happypack/loader',
    options: {
      id,
      cacheDirectory: true
    },
    exclude,
  }
};

export const cssLoader = () => {
  return {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [{
        loader: 'css-loader',
        options: {
          minimize: process.env.NODE_ENV === 'production'
        }
      }]
    })
  }
};

export const lessLoader = () => {
  return {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [{
        loader: 'css-loader',
        options: {
          minimize: process.env.NODE_ENV === 'production'
        }
      }, {
        loader: 'less-loader',
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