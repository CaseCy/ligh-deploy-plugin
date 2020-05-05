// import config = require('./config')
import path = require('path')
import SSH = require('./util/ssh')
import configHandle = require('./util/confighandle')
import buildFlow = require('./flow/build-flow')
import compressFlow = require('./flow/compress-flow')
import moment = require('moment');
import { Configuration } from './types/Configuration'
import Log = require('./util/log')
let ext = ".tar.gz"

let buildConfig = {
    cmd: 'npm run build',
    path: ""
}

export async function run(baseUrl: string, config: Configuration) {
    let sshServer: SSH;
    try {
        //变量初始化
        const activeConfig = configHandle.chooseConfig(config);
        const { local, remote, build, ssh } = activeConfig
        local.projectRootPath ? "" : local.projectRootPath = baseUrl;
        //打包文件所在目录
        let outPutPath = path.join(local.projectRootPath, local.buildOutDir);
        buildConfig.path = local.projectRootPath;
        //项目编译，打包
        if (activeConfig.autoBuild) {
            local.buildCmdExePath ? buildConfig.path = local.buildCmdExePath : "";
            build ? Object.assign(buildConfig, build) : "";
            await buildFlow.excute(buildConfig)
        }

        //文件压缩
        if (activeConfig.autoCompress) {
            const compressPath = path.join(buildConfig.path, local.buildOutDir);
            outPutPath = compressPath + ext;
            await compressFlow.excute(compressPath, outPutPath);
        }

        //连接服务器
        sshServer = new SSH({
            ...ssh
        })
        await sshServer.connect();
        //文件上传
        const remoteAddr = path.basename(outPutPath);
        Log.log("开始上传文件，本地地址：" + outPutPath + " 远程地址：~/" + remoteAddr)
        await sshServer.uploadFile(outPutPath, remoteAddr)
        //自动备份
        if (activeConfig.autoBak) {
            Log.log("开始自动备份,备份目录" + remote.bakPath)
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${reName(remote.bakPath, remoteAddr)}`).then(() => {
                Log.log("备份成功")
            })
        }
        //部署
        if (activeConfig.autoCompress) {
            //压缩文件
            await sshServer.exeCommand(`tar -zxf ${remoteAddr} -C ${remote.releasePath}`).then(() => {
                Log.log("部署成功")
            })
        } else {
            //文件夹
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${path.posix.join(remote.releasePath, remoteAddr)}`).then(() => {
                Log.log("部署成功")
            })
        }
    } catch (e) {
        console.log("构建时异常：", e)
        Log.log("构建时异常：" + e);
    } finally {
        sshServer.disConnect()
    }
}

function reName(remotePath: string, fileName: string) {
    fileName = fileName + moment().format('YYYY_MM_DD_HH_mm_ss');
    return path.posix.join(remotePath, fileName);
}