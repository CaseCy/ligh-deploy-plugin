// const config = require('../config')
const path = require('path')
const SSH = require('./util/ssh')
const configHandle = require('./util/confighandle')
const buildFlow = require('./flow/build-flow')
const compressFlow = require('./flow/compress-flow')
const moment = require('moment');
const LOG = require('./util/log')
let ext = ".tar.gz"

let buildConfig = {
    cmd: 'npm run build',
    path: ""
}

async function run(baseUrl, config) {
    let sshServer
    LOG.channel.clear();
    try {
        //变量初始化
        const activeConfig = configHandle.chooseConfig(config);
        const local = activeConfig.local
        const remote = activeConfig.remote;
        const build = activeConfig.build;
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
            const compressPath = path.join(buildConfig.path, activeConfig.local.buildOutDir);
            outPutPath = compressPath + ext;
            await compressFlow.excute(compressPath, outPutPath);
        }

        //连接服务器
        sshServer = new SSH({
            ...activeConfig.ssh
        })
        await sshServer.connect();
        //文件上传
        const remoteAddr = path.basename(outPutPath);
        LOG.log("开始上传文件，本地地址：" + outPutPath + " 远程地址：~/" + remoteAddr)
        await sshServer.uploadFile(outPutPath, remoteAddr)
        //自动备份
        if (activeConfig.autoBak) {
            LOG.log("开始自动备份,备份目录" + remote.bakPath)
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${reName(remote.bakPath,remoteAddr)}`).then(() => {
                LOG.log("备份成功")
            })
        }
        //部署
        if (activeConfig.autoCompress) {
            //压缩文件
            await sshServer.exeCommand(`tar -zxf ${remoteAddr} -C ${remote.releasePath}`).then(() => {
                LOG.log("部署成功")
            })
        } else {
            //文件夹
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${path.posix.join(remote.releasePath,remoteAddr)}`, ).then(() => {
                LOG.log("部署成功")
            })
        }
    } catch (e) {
        console.log("构建时异常：", e)
        LOG.log("构建时异常：" + e);
    } finally {
        if (sshServer) {
            sshServer.disConnect();
        }
    }
}

function reName(remotePath, fileName) {
    fileName = fileName + moment().format('YYYY_MM_DD_HH_mm_ss');
    return path.posix.join(remotePath, fileName);
}

module.exports = {
    run
};