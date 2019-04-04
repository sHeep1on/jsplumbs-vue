

# YYCP Admin
[![](https://img.shields.io/travis/iview/iview-admin.svg?style=flat-square)](https://travis-ci.org/iview/iview-admin)
[![vue](https://img.shields.io/badge/vue-2.5.13-brightgreen.svg?style=flat-square)](https://github.com/vuejs/vue)
[![iview ui](https://img.shields.io/badge/iview-2.8.0-brightgreen.svg?style=flat-square)](https://github.com/iview/iview)


## 特性

-   基于vue，iview，vuex，[Mock](https://github.com/nuysoft/Mock) 企业级后台管理系统最佳实践。
-   基于iview UI 设计语言，提供后台管理系统常见使用场景。
-   使用vue-hot-reload-api本地调试和构建，其中Mock功能实现脱离后端独立开发。
-   响应式设计。

## 知识基础

-   ES6（重要）
    -   [30分钟掌握ES6/ES2015核心内容](https://segmentfault.com/a/1190000004365693)
    -   [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/intro)
## 环境搭建

### NodeJS环境搭建

-   [下载网址](https://nodejs.org/en/download/)
    根据格子环境下载安装对应版本

#### npm换源
```
npm config set registry http://192.168.3.189/nexus/content/groups/public-npm/

npm login
jiangy/chinaoly
```

### git环境搭建

-   [git bash下载网址](https://git-scm.com/downloads)

### 项目部署

-   [YYCP-admin 项目GIT地址](git@192.168.1.244:jiangy/YYCP-admin.git)


git bash 中输入 （注：git bash 不是 cmd）

```bash
ssh-keygen -t rsa -C "your.email@example.com" -b 4096
```

一直回车 cmd中执行

```bash
type %userprofile%\.ssh\id_rsa.pub | clip
```

（此时公钥已复制到剪贴板）
[gitlib-角色设置-sshkey](http://10.8.132.164:8081/profile/keys)中配置sshkey
![公钥粘贴位置](assets/公钥设置.png)

克隆项目文件:

```bash
git clone git@192.168.1.244:jiangy/YYCP-admin.git
```

导出并切换到dev分支

```bash
git checkout -b dev origin/dev
```

进入目录安装依赖:

```bash
#开始前请确保没有安装roadhog、webpack到NPM全局目录
npm i 或者 yarn install
```

开发：

```bash
npm run build:dll #第一次npm run dev时需运行此命令，使开发时编译更快
npm run dev
打开 http://localhost:8000
```

## 工具安装

工具使用IDEA[下载网址](https://www.jetbrains.com/idea/download/)，下载Ultimate版，注册自己想办法

-   项目打开

-   nodejs插件安装  菜单[file-Settings]
    ![插件安装](assets/插件安装.gif)

-   快捷工具 -- [View -> ToolButtons]打开

## 规范

### 目录结构
```shell
.
├── /dist/  项目输出目录
├── build  项目构建配置
└── src   项目源码目录
      ├── components   UI组件及UI相关方法
    ├── images  图片文件
    ├── libs  工具方法
    ├── router  路由配置
    ├── store  状态管理
    ├── styles  样式文件
    ├── template  模板文件
    ├── vendors  公共库文件
    └── views   页面
        ├── home  首页
        │   ├── components  首页组件
        ├── login  登录页面
```

### 命名及存储说明

-   components：**组件（方法）为单位** 以文件夹保存，文件夹名组件首字母大写（如`DataTable`），方法首字母小写（如`layer`）,文件夹内主文件与文件夹同名，多文件以`index.js`导出对象（如`./src/components/Layout`）。
-   routes：**页面为单位** 以文件夹保存，文件夹名首字母小写（特殊除外，如`UIElement`）,文件夹内主文件以`index.js`导出，多文件时可建立`components`文件夹，如果有子路由，依次按照路由层次建立文件夹(如`./src/routes/sysmanager/security/department/`）。
-   models:**页面为单位** 以文件保存，单一模块只绑定一个数据模型，模型名称为小写字母，如果有子模型，依次按照模型层次建立文件夹(如：`./src/routes/sysmanager/security/department/`)
-   service:**页面为单位** 以文件保存,依次按照路由层次建立文件夹(如`./src/service/sysmanager/security/department`）
-   mock:**接口模型为单位** 以文件保存，同一接口类型，放到同一文件下，mock按需求参照接口模型建造，mock前缀统一使用`/utils/config{MOCK_PFX}`,切换接口时统一在`/utils/config`中修改。
-   样式定义： `less`文件公共变量定义在`/themes/vars`下，公共样式定义定义在`/themes/default`，公共样式从优先级`/themes/index` > `/themes/default` > `/themes/vars` > `antd/lib/style/themes/default`


## Links

- [iView](https://github.com/iview/iview)
- [Vue](https://github.com/vuejs/vue)
- [Webpack](https://github.com/webpack/webpack)

