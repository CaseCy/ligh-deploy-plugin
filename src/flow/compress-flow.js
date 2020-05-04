const compress = require('../util/compress')
const LOG = require('../util/log')

function excute(compressPath, outPutPath) {
    LOG.log("开始执行文件压缩")
    return compress.exe(compressPath, outPutPath).then(() => {
        LOG.log("压缩成功,文件路径" + outPutPath);
    }).catch((e) => {
        LOG.log("压缩失败")
    });
}

module.exports = {
    excute
}