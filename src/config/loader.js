import ExtractTextPlugin from 'es-extract-text-webpack-plugin';

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

export const mediaLoader = (path, name) => {
  return {
    test: /\.(swf|wav|mp3|mpeg|mp4|webm|ogv)(\?v=\d+\.\d+\.\d+)?$/,
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
    query: {
      id,
      cacheDirectory: true
    },
    exclude,
  }
};

export const cssLoader = () => {
  return {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style', 'css')
  }
};

export const lessLoader = () => {
  return {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style', 'css!less'),
  }
};

export const importsLoader = (regExp) => {
  return {
    test: new RegExp(`(${regExp.join('|')})$`),
    loader: 'imports-loader?define=>false&module=>false&exports=>false&this=>window',
  }
};

export const jsonLoader = () => {
  return {
    test: /\.json$/,
    loader: 'json-loader'
  }
}