"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import config = require('./config')
const path = require("path");
const SSH = require("./util/ssh");
const configHandle = require("./util/confighandle");
const buildFlow = require("./flow/build-flow");
const compressFlow = require("./flow/compress-flow");
const moment = require("moment");
const Log = require("./util/log");
let ext = ".tar.gz";
let buildConfig = {
    cmd: 'npm run build',
    path: ""
};
function run(baseUrl, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let sshServer;
        try {
            //变量初始化
            const activeConfig = configHandle.chooseConfig(config);
            const { local, remote, build, ssh } = activeConfig;
            local.projectRootPath ? "" : local.projectRootPath = baseUrl;
            //打包文件所在目录
            let outPutPath = path.join(local.projectRootPath, local.buildOutDir);
            buildConfig.path = local.projectRootPath;
            //项目编译，打包
            if (activeConfig.autoBuild) {
                local.buildCmdExePath ? buildConfig.path = local.buildCmdExePath : "";
                build ? Object.assign(buildConfig, build) : "";
                yield buildFlow.excute(buildConfig);
            }
            //文件压缩
            if (activeConfig.autoCompress) {
                const compressPath = path.join(buildConfig.path, local.buildOutDir);
                outPutPath = compressPath + ext;
                yield compressFlow.excute(compressPath, outPutPath);
            }
            //连接服务器
            sshServer = new SSH(Object.assign({}, ssh));
            yield sshServer.connect();
            //文件上传
            const remoteAddr = path.basename(outPutPath);
            Log.log("开始上传文件，本地地址：" + outPutPath + " 远程地址：~/" + remoteAddr);
            yield sshServer.uploadFile(outPutPath, remoteAddr);
            //自动备份
            if (activeConfig.autoBak) {
                Log.log("开始自动备份,备份目录" + remote.bakPath);
                yield sshServer.exeCommand(`cp -r ${remoteAddr} ${reName(remote.bakPath, remoteAddr)}`).then(() => {
                    Log.log("备份成功");
                });
            }
            //部署
            if (activeConfig.autoCompress) {
                //压缩文件
                yield sshServer.exeCommand(`tar -zxf ${remoteAddr} -C ${remote.releasePath}`).then(() => {
                    Log.log("部署成功");
                });
            }
            else {
                //文件夹
                yield sshServer.exeCommand(`cp -r ${remoteAddr} ${path.posix.join(remote.releasePath, remoteAddr)}`).then(() => {
                    Log.log("部署成功");
                });
            }
        }
        catch (e) {
            console.log("构建时异常：", e);
            Log.log("构建时异常：" + e);
        }
        finally {
            sshServer.disConnect();
        }
    });
}
exports.run = run;
function reName(remotePath, fileName) {
    fileName = fileName + moment().format('YYYY_MM_DD_HH_mm_ss');
    return path.posix.join(remotePath, fileName);
}
//# sourceMappingURL=main.js.map