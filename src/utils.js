import glob from 'glob';
import fs from 'fs';
import path from 'path';

const searchEntries = (entryFileName, entryPath, filenamePrefix = '', ignores) => {

  let files = {};

  // 如果目录以'/'结尾，则去掉
  entryPath = entryPath.replace(/\/$/, '');

  /**
   * 排除目录
   * input: ['one','two','three']
   * output: one|two|three
   */
  let ignore = '', i = 0, connector = '';
  ignores && ignores.forEach((item) => {
    i > 0 ? connector = '|' : connector = '';
    ignore += connector + item;
    i++;
  })
    
  /**
   * filenamePrefix 表示输出文件的前缀
   * 如输出'app/js/default/index.js',则前缀为'app/js/default/'
   */
  glob.sync(entryPath + `/!(${ignore})/**/${entryFileName}.{js,jsx}`).forEach((file) => {
    const entryName = filenamePrefix + file.replace(entryPath + '/', '').replace(file.substring(file.lastIndexOf('.')), '');
    files[entryName] = file;
  });

  return files;
}

// 判断文件或文件夹是否存在
const fsExistsSync = (path) => {
  try {
    fs.accessSync(path,fs.F_OK);

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
  let rootdir = searchDir.substring(searchDir.lastIndexOf('/') + 1);

  dirs = dirs.filter((dir) => {
    return dir !== '.DS_Store' && dir !== '.gitkeep' && fsExistsSync(`${searchDir}/${dir}/${isExistDir}`);
  })

  dirsArr = dirs.map((dir) => {
    return `${rootdir}/${dir}`;
  })
  
  return dirsArr;
}


const isArray = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]'; 
}

const isEmptyObject = (obj) => {
  for(let item in obj) return false;

  return true;
}

const firstUpperCase = (str) => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

const filterObject = (obj, filterName) => {
  let newObj = {};
  let filterObj = {};
  
  for (let item in obj) {
    if (item.indexOf(filterName) === -1) {
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

export { 
  searchEntries, 
  searchDirs, 
  fsExistsSync, 
  isArray, 
  isEmptyObject, 
  firstUpperCase,
  filterObject
};