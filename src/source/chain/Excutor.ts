import { Context } from './Context';
import projectBuild = require('../util/projectBuild');
import path = require('path')
import compress = require('../util/compress');
import moment = require('moment');
import * as fs from 'fs';
import { Excutor } from '../types';
import Log = require('../util/log');

let ext = ".tar.gz"

let buildConfig = {
    cmd: 'npm run build',
    path: ""
}

export class BuildExcutor implements Excutor {
    async handle(context: Context) {
        const { local, build } = context.activeConfig;
        buildConfig.path = local.projectRootPath;
        local.buildCmdExePath ? buildConfig.path = local.buildCmdExePath : "";
        build ? Object.assign(buildConfig, build) : context.activeConfig.build = buildConfig;
        Log.log("开始进行项目构建，构建路径：" + buildConfig.path + " 执行的命令：" + buildConfig.cmd)
        const { err, stdout, } = await projectBuild.build(buildConfig);
        if (err) {
            throw err;
        }
        Log.log("构建结果：" + stdout);
        Log.log("构建结束");
    }
}

export class SSHConnectExcutor implements Excutor {
    async handle(context: Context) {
        await context.sshServer.connect();
    }
}

export class CompressExcutor implements Excutor {
    async handle(context: Context) {
        const { local, build } = context.activeConfig;
        const compressPath = path.join(build.path, local.buildOutDir);
        context.outPutPath = compressPath + ext;
        const outPutPath = context.outPutPath;
        if (!fs.existsSync(compressPath)) {
            throw new Error("待压缩文件不存在：" + compressPath)
        }
        Log.log("开始执行文件压缩 " + compressPath)
        try {
            await compress.exe(compressPath, outPutPath);
            Log.log("压缩成功,文件路径" + outPutPath);
        }
        catch (e) {
            Log.log("压缩失败" + e);
        }
    }
}

export class FileUploadExcutor implements Excutor {
    async handle(context: Context) {
        const { sshServer, outPutPath } = context;
        const remoteAddr = path.basename(outPutPath);
        context.remoteAddr = remoteAddr;
        if (!fs.existsSync(outPutPath)) {
            throw new Error("文件不存在：" + outPutPath)
        }
        Log.log("开始上传文件，本地地址：" + outPutPath + " 远程地址：~/" + remoteAddr)
        await sshServer.uploadFile(outPutPath, remoteAddr)
    }
}

export class BakExcutor implements Excutor {
    async handle(context: Context) {
        const { sshServer, remoteAddr } = context;
        const { remote } = context.activeConfig;
        Log.log("开始自动备份,备份目录" + remote.bakPath)
        await sshServer.exeCommand(`cp -r ${remoteAddr} ${this.reName(remote.bakPath, remoteAddr)}`).then(() => {
            Log.log("备份成功")
        })
    }

    private reName(remotePath: string, fileName: string) {
        fileName = fileName + moment().format('YYYY_MM_DD_HH_mm_ss');
        return path.posix.join(remotePath, fileName);
    }
}

export class PublishExcutor implements Excutor {
    async handle(context: Context) {
        const { autoCompress, remote } = context.activeConfig;
        const { remoteAddr, sshServer } = context;
        //部署
        if (autoCompress) {
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
    }
}