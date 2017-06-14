# es-webpack-engine

基于webpack的多入口构建方案

因业务的特殊性，目前只支持与[biz-symfony-starter](https://github.com/codeages/biz-symfony-starter)一同使用

### 配置 

**配置文件 webpack.config.js**

```javascript
module.exports = {
    output: {
        path: 'web/static-dist/',       // 用于生产环境下的输出目录
        publicPath: '/static-dist/',    // 用于开发环境下的输出目录
    },
    libs: { // 共用的依赖
        "vendor": ['libs/vendor.js'], //可以是一个js文件,
        "html5shiv": ['html5shiv'],
        "fix-ie": ['console-polyfill', 'respond-js'], //也可以是一个npm依赖包
        "jquery-insertAtCaret": ['libs/js/jquery-insertAtCaret.js'],
    },
    noParseDeps: [ //不需要解析的依赖，加快编译速度
        'jquery/dist/jquery.js',
        'bootstrap/dist/js/bootstrap.js',
    },
    onlyCopys: [ //纯拷贝文件到输出的libs目录下
    {
      name: 'es-ckeditor',
      ignore: [
        '**/samples/**',
        '**/lang/!(zh-cn.js)',
        '**/kityformula/libs/**',
      ]
    }]
};

```

**package.json**

对无关配置进行了省略

```json
{
    "devDependencies": {
        "es-webpack-engine": "~3.1.1",
    },
    "scripts": {
        "start": "npm run dev",
        "dev": "cross-env NODE_ENV=development nodemon --max_old_space_size=4096 node_modules/es-webpack-engine/dist/webpack.dev.js --parameters webpack.config.js",
        "compile": "node --max_old_space_size=4096 node_modules/es-webpack-engine/dist/webpack.prod.js --parameters webpack.config.js",
        "compile:debug": "npm run compile -- --debugMode=true",
    }
}

```
**nodemon.json**

触发重启node服务

```json
{
    "watch": [
        "webpack.config.js",
        "nodemon.json"
    ]
}
```

### 使用

**基础命令**

```bash
npm run dev //开发环境
npm run compile // 生产环境
npm run compile:debug // 生产环境debug模式
```

**开启调试模式**

场景：有bug需要定位处理时

```
npm run dev devtool:source-map
```

**修改服务端口**

场景：当本地有多个项目需要同时开发时

```
npm run dev port:3000
```

同时，Nginx配置修改：

```
set $webpack_server http://127.0.0.1:3030  

替换为： 

set $webpack_server http://127.0.0.1:3000
```

**只启动对某个模块的监听**

模块分为：lib,app,plugin,theme,bundle

场景：如果是一个定制项目，只改动`src/Custom`目录下的js文件

```
npm run dev openModule:bundle bundleModule:src/Custom
```

同时，Nginx配置修改：

```
location ~ ^/static-dist {
    proxy_pass $webpack_server;
}

修改为：

location ~ ^/static-dist/custom {
    proxy_pass $webpack_server;
}
```

同样，在打包发布的时候，也可以只打包某个模块

```
npm run compile openModule:bundle bundleModule:src/Custom
```

**查看打包文件详情**

场景：想了解都编译了哪些文件

```
npm run dev fileInfo:true
```

**开启依赖分析工具**

场景：打包后文件过大，需要查看都包含了哪些依赖时

```
npm run dev opt:true
```

