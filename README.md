## Light-deploy
一个轻量的持续集成插件

## 目前支持的功能
- 自动构建
- 自动压缩（压缩方式tar.gz）
- 自动上传服务器备份
- 自动发布

## 操作步骤
1. 配置setting.json
2. 在左侧资源管理器选择开始的路径，右键选择`执行发布（light-deploy）`

## 配置说明
安装之后需要在setting.json里配置，也可以点击文件->首选项->设置->扩展->Light-deploy进行配置
目前支持的配置如下
```json
"light-deploy.config": {
      //开启的配置（和name对应）
      "active": "dev",
      "configuration": [
         {
             //配置名称
            "name": "dev",
            //服务器连接配置（使用node-ssh），可以使用公私钥，详细配置可以参看node-ssh的配置
            "ssh": {
               "host": "172.16.5.33",
               "port": 22,
               "username": "root",
               "password": "root",
            },
            //是否自动构建
            "autoBuild": true,
            //构建配置
            "build":{
                //执行的命令,默认是npm run build
                "cmd":"npm run build",
                //默认是构建路径，如配置，优于构建路径
                "path":""
            },
            //是否自动压缩
            "autoCompress": true,
            //是否自动备份
            "autoBak": true,
            // 本地配置
            "local": {
                //构建输出的文件夹，相对于构建路径
               "buildOutDir": "dist",
               //构建路径，可不填，默认是右键选择的地址，如果填了，优于右键选择地址
               "projectRootPath":"",
            },
            //远程配置
            "remote": {
                //备份路径
               "bakPath": "~/bak",
               //发布路径
               "releasePath": "/netty-socket/web",
            }
         }
      ],
   },
```
关于配置的几项说明
- 构建路径：构建开始的路径，右键点击`执行发布（light-deploy）`时的路径，也可以在build选项中加入配置projectRootPath，此配置优于右键选择配置
- 文件上传位置：目前默认是linux登录用户的个人文件夹，即`~`

## 即将实现
- 支持配置日期格式化
- 支持配置自动删除本地/远程构建文件
- 支持全局配置
- 支持配置压缩方式

## license
[MIT](https://opensource.org/licenses/MIT)