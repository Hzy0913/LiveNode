<img src="http://img.binlive.cn/upload/1509251478128" alt="binlive livenode node service"/>


## 简介

LiveNode是一个基于Node.js轻巧的web服务，帮助前端开发者解决本地跨域，代码刷新，以及SPA(单页应用)前后端服务分离，并且可以用于生产环境项目部署。



## 安装
全局安装livenode脚手架工具
```
npm install livenode-cli -g
```


## 初始化
创建项目
```
livenode init
```
根据提示输入项目文件名称(不输入则生成默认名称)
```
project name:
```
输入要创建的项目模版(不输入内容即生成多页项目模板，输入 spa 则生成单页面应用项目模版)
```
project templat:
```
cd进入生成的项目目录后，安装项目所需依赖
```
npm install
```
## 项目说明
`src` 目录为项目容器目录，html、css、js等代码放入该目录即可。(注意!不可修改src目录名称)

`config.js` 为服务配置文件

|参数   |值   |描述   |
| ------------ | ------------ | ------------ |
| port  | 必填(number)  | 服务端口  |
| reload  |(boolean)   | 在开发环境下是否自动刷新代码  |
| spaHistory  |(boolean)   | 项目是否为spa(单页面应用)的history模式  |
|  notFound | (string)  | 多页服务中404页面位置，如'/404.html'  |
|  proxyTable |  (array)  | 代理接口转发服务  |


### FAQ
 - 当spaHistory设为true时，此时不应设置notFound参数(设置为''字符串即可)，同理假如设置notFound参数后，spaHistory模式即失效。
 - reload为开发环境下的代码修改自动刷新浏览器，上线执行npm build启动服务时默认会关闭该功能。
 - proxyTable为服务转发设置，可以处理本地开发接口跨域调试，也可在线上生产环境中处理前后端分离，转发代理后端接口服务。

### proxyTable
配置接口转发代理
```js
const proxyTable = [
  {
    host: 'http://www.binlive.cn',
    api: '/api/testApi'
  }, {
    host: 'http://www.example.cn',
    api: '/example'
  }
];
```
`host` 为接口域名地址，`api` 为接口地址，可以配置多个接口转发。
如需代理restfull API，例如接口为http://www.binlive.cn/api/testApi 和 http://www.binlive.cn/api/testApi2 等接口，只需设置api为
```js
{
    host: 'http://www.binlive.cn',
    api: '/api'
 }
```

## 服务命令
```
npm start
```
启动开发环境下的node.js服务
```
npm restart
```
重启node.js服务，在开发环境下修改`config.js`配置文件后需要执行该命令重启服务
```
npm build
```
启动生产环境下的node.js服务，在生产环境下修改配置文件不需要再执行npm restart命令重启，npm build会默认监听配置文件修改并自动重启服务。
```
npm stop
```
停止node.js服务
```
npm run list
```
查看node.js服务的状态
