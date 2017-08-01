# es-webpack-engine

基于webpack的多入口构建方案

因业务的特殊性，目前只支持与[biz-symfony-starter](https://github.com/codeages/biz-symfony-starter)一同使用

## 配置

**配置文件 webpack.config.js**

```javascript
module.exports = {
    output: {
        path: 'web/static-dist/',       // 用于生产环境下的输出目录
        publicPath: '/static-dist/',    // 用于开发环境下的输出目录
    },
    libs: { // 共用的依赖
        'base': ['libs/base.js'], //可以是一个js文件,
        'html5shiv': ['html5shiv'],
        'fix-ie': ['console-polyfill', 'respond-js'], //也可以是一个npm依赖包
        'jquery-insertAtCaret': ['libs/js/jquery-insertAtCaret.js'],
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
        "es-webpack-engine": "~3.4.0",
    },
    "scripts": {
        "dev": "cross-env NODE_ENV=development nodemon --max_old_space_size=4096 node_modules/es-webpack-engine/dist/webpack.dev.js --parameters webpack.config.js",
        "dev:debug": "npm run dev sourcemap:true",
        "dev:custom": "npm run dev watch:CustomBundle",
        "compile": "node --max_old_space_size=4096 node_modules/es-webpack-engine/dist/webpack.prod.js --parameters webpack.config.js",
        "compile:debug": "npm run compile sourcemap:true",
        "compile:custom": "npm run compile module:CustomBundle",
    }
}

```
**nodemon.json**

触发重启node服务

```json
{
    "watch": [
        "webpack.config.js",
        ".webpack-watch.log"
    ]
}

```

注意：需手动在项目根目录下，添加`.webpack-watch.log`文件

## 实时编译

实体编译，用于开发模式下，在对前端模块代码修改后，能实时编译生效。

**启动实时编译服务：**

```bash
npm run dev
```

启动服务后，默认会在本地启动[3030端口](http://127.0.0.1:3030)的前端模块实时编译服务。

**可用参数：**

* `port:PORT_NUMBER`：指定服务端口。例如：
  ```bash
  npm run dev port:3000
  ```
* `sourcemap:true`：生成 Source map；
* `verbose:true`： 显示编译详情，开启此选项后，控制台会输出每个文件被编译的详情；
* `analyzer:true`：开启依赖分析工具，打包后文件过大，需要查看都包含了哪些依赖时使用。
* `watch:PATH`：指定监听实时编译的资源，以加快实时编译的速度。支持指定Bundle、插件、主题的前端资源，例如：
  ```bash
  npm run dev watch:CustomBundle # 只监听定制开发的前端资源
  npm run dev watch:ExamplePlugin # 只监听 Example 插件的前端资源
  npm run dev watch:example # 只监听 Example 主题的前端资源
  npm run dev watch:CustomBundle,ExamplePlugin # 也可同时监听多个的前端资源
  ```

## 编译实体文件

**编译实体文体：**

```bash
npm run compile
```

**可用参数：**

* `sourcemap:true`：生成 Source map；
* `module:PATH`: 指定只编译的前端资源，以加快编译速度。支持指定Bundle、插件、主题的前端资源，例如：
  ```bash
  npm run compile module:CustomBundle # 只编译打包定制开发的前端资源
  npm run compile module:ExamplePlugin # 只编译打包 Example 插件的前端资源
  npm run compile module:example # 只编译打包 Example 主题的前端资源
  npm run compile module:CustomBundle,ExamplePlugin # 也可同时编译打包多个前端资源
  ```

## 常见错误

### 模块不存在

错误提示：

```
ERROR in multi ....
    Module not found: Error: Cannot resolve 'file' or 'directory' 
```

解决办法：

```bash
rm -rf node_modules
yarn
```

### app crashed

错误提示：

```
[nodemon] app crashed - waiting for file changes before starting...
```

解决办法：

在控制台（终端）里输入`rs`,然后回车。

### 内存泄漏

错误提示：

```
<--- Last few GCs --->

      14 ms: Mark-sweep 2.2 (37.1) -> 2.1 (38.1) MB, 2.8 / 0 ms [allocation failure] [GC in old space requested].
      15 ms: Mark-sweep 2.1 (38.1) -> 2.1 (39.1) MB, 1.2 / 0 ms [allocation failure] [GC in old space requested].
      16 ms: Mark-sweep 2.1 (39.1) -> 2.1 (39.1) MB, 0.9 / 0 ms [last resort gc].
      17 ms: Mark-sweep 2.1 (39.1) -> 2.1 (39.1) MB, 1.0 / 0 ms [last resort gc].
...

FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - process out of memory
```

解决办法：

重新执行命令：`npm run dev`或`npm run compile`。

### 端口被占用

```
events.js:154
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3030
    at Object.exports._errnoException (util.js:893:11)
    at exports._exceptionWithHostPort (util.js:916:20)
    at Server.__dirname.Server.Server._listen2 (net.js:1246:14)
    ....
```

解决方法：该错误表明你已经开启了一个端口号为3030的服务，需要先把那个服务关掉。

```bash
lsof -i:3030
kill -9 xxxxx(PID编号)
```

### 系统默认最大文件打开数过少

报错信息：

```
watch ...  ENOSPC
```
解决方法： 在控制台输入

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

