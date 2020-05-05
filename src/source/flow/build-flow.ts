import projectBuild = require('../util/projectBuild')
import { BuildConfig } from '../types/Configuration';
import Log = require('../util/log');

async function excute(buildConfig: BuildConfig) {
    Log.log("开始进行项目构建，构建路径：" + buildConfig.path + " 执行的命令：" + buildConfig.cmd)
    const { err, stdout, } = await projectBuild.build(buildConfig);
    if (err) {
        throw err;
    }
    Log.log("构建结果：" + stdout);
    Log.log("构建结束");
}

export = {
    excute
}