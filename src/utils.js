import glob from 'glob';
import fs from 'fs';
import path from 'path';

const searchEntries = (options) => {

  let files = {};

  // 如果目录以'/'结尾，则去掉
  options.entryPath = options.entryPath.replace(/\/$/, '');

  /**
   * fileNamePrefix 表示输出文件的前缀
   * 如输出'app/js/default/index.js',则前缀为'app/js/default/'
   */
  let pattern = '';

  if (options.fileType == 'less') {
    pattern = `${options.entryPath}/${options.fileName}*.less`;
  } else if (options.isFuzzy) {
    pattern = `${options.entryPath}/**/${options.fileName}.{js,jsx}`
  } else {
    pattern = `${options.entryPath}/${options.fileName}.{js,jsx}`
  }

  glob.sync(pattern).forEach((file) => {
    const entryName = options.fileNamePrefix + file.replace(options.entryPath + '/', '').replace(file.substring(file.lastIndexOf('.')), '');
    files[entryName] = file;
  });

  return files;
}

// 判断文件或文件夹是否存在
const fsExistsSync = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);

  } catch(e) {
    return false;
  }

  return true;
}

const searchDirs = (searchDir, isExistDir) => {
  let dirsArr = [];

  if (!fsExistsSync(searchDir)) {
    return [];
  }

  let dirs = fs.readdirSync(searchDir);

  dirs = dirs.filter((dir) => {
    return dir !== '.DS_Store' && dir !== '.gitkeep' && fsExistsSync(`${searchDir}/${dir}/${isExistDir}`);
  })

  dirsArr = dirs.map((dir) => {
    return `${searchDir}/${dir}`;
  })
  
  return dirsArr;
}

// 需要忽略的目录
const searchIgnoreDirs = (searchDir, watchDirs) => {
  let dirsArr = [];

  if (!fsExistsSync(searchDir)) {
    return [];
  };

  let dirs = fs.readdirSync(searchDir);

  dirs = dirs.filter((dir) => {
    return dir !== '.DS_Store' && dir !== '.gitkeep' && watchDirs.indexOf(dir) === -1;
  })

  dirsArr = dirs.map((dir) => {
    return `${searchDir}/${dir}`;
  })

  return dirsArr;
};


const isArray = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

const isEmptyObject = (obj) => {
  for (let item in obj) {
    return false;
  }

  return true;
}

const firstUpperCase = (str) => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

const filterObject = (obj, filterName) => {
  let newObj = {};
  let filterObj = {};

  let filterArr = filterName.split(',');
  
  for (let item in obj) {
    if (filterArr.indexOf(item) === -1) {
      newObj[item] = obj[item];
    } else {
      filterObj[item] = obj[item];
    }
  }

  return {
    newObj,
    filterObj,
  }
}

const isPlugin = (path) => {
  return path.indexOf('Plugin') !== -1;
};

const isBundle = (path) => {
  return path.indexOf('Bundle') !== -1;
};

const isTheme = (path) => {
  const finalPath = path.split(sep).join('/');
  return finalPath.indexOf('web/themes') !== -1;
}

const isActivity = (path) => {
  return path.indexOf('activities') !== -1;
}

export { 
  searchEntries,
  searchDirs,
  searchIgnoreDirs, 
  fsExistsSync,
  isArray, 
  isEmptyObject, 
  firstUpperCase,
  filterObject,
  isPlugin,
  isBundle,
  isTheme,
  isActivity
};