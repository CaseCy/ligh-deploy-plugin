// const config = require('../config')
const path = require('path')
const SSH = require('./util/ssh')
const configHandle = require('./util/confighandle')
const buildFlow = require('./flow/build-flow')
const compressFlow = require('./flow/compress-flow')
const moment = require('moment');
let ext = ".tar.gz"

let buildConfig = {
    cmd: 'npm run build',
    path: ""
}

let config = {
    active: 'dev',
    configuration: [{
        name: 'dev',
        ssh: {
            host: '120.77.81.112',
            port: 33,
            username: 'root',
            password: 'qwer!@34',
        },
        build: {
            cmd: 'npm run build'
        },
        autoBuild: true,
        autoCompress: true,
        autoBak: true,
        local: {
            projectRootPath: 'H:/web/ecma-test',
            buildOutDir: 'dist',
        },
        remote: {
            // deleteBeforeDeploy: false,
            bakPath: '~/bak',
            releasePath: '/netty-socket/web',
            // releaseDir: 'dist'
        }
    }]
}

async function run(baseUrl, baseConfig) {
    config = baseConfig;
    console.log(baseConfig)
    let sshServer
    try {
        //变量初始化
        const activeConfig = configHandle.chooseConfig(config);
        console.log("active:", activeConfig)
        const local = activeConfig.local
        const remote = activeConfig.remote;
        const build = activeConfig.build;
        local.projectRootPath = baseUrl;
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
        console.log("开始上传文件，本地地址：", outPutPath, "远程地址：~/" + remoteAddr)
        await sshServer.uploadFile(outPutPath, remoteAddr)
        //自动备份
        if (activeConfig.autoBak) {
            console.log("开始自动备份,备份目录", remote.bakPath)
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${reName(remote.bakPath,remoteAddr)}`).then(() => {
                console.log("备份成功")
            })
        }
        //部署
        if (activeConfig.autoCompress) {
            //压缩文件
            await sshServer.exeCommand(`tar -zxf ${remoteAddr} -C ${remote.releasePath}`).then(() => {
                console.log("部署成功")
            }).catch(e => {
                console.log("部署时出错", e)
            })
        } else {
            //文件夹
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${path.posix.join(remote.releasePath,remoteAddr)}`, ).then(() => {
                console.log("部署成功")
            }).catch(e => {
                console.log("部署时出错", e)
            })
        }
    } catch (e) {
        console.log("构建时异常：", e);
    } finally {
        sshServer.disConnect();
    }
}

function reName(remotePath, fileName) {
    fileName = fileName + moment().format('YYYY_MM_DD_HH_mm_ss');
    console.log(remotePath, fileName)
    return path.posix.join(remotePath, fileName);
}

module.exports = {
    run
};