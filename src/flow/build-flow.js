const projectBuild = require('../util/projectBuild')
const LOG = require('../util/log')

function excute(buildConfig) {
    LOG.log("开始进行项目构建，构建路径：" + buildConfig.path + " 执行的命令：" + buildConfig.cmd)
    return projectBuild.build(buildConfig).then(({
        err,
        stdout,
    }) => {
        if (err) {
            LOG.error(err);
            return;
        }
        LOG.log("构建结果：" + stdout);
        LOG.log("构建结束")
    })
}

module.exports = {
    excute
}