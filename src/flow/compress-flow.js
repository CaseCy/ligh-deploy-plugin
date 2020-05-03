const compress = require('../util/compress')

function excute(compressPath, outPutPath) {
    console.log("开始执行文件压缩")
    return compress.exe(compressPath, outPutPath).then(() => {
        console.log("压缩成功,文件路径", outPutPath);
    }).catch((e) => {
        console.log("压缩失败", e)
    });
}

module.exports = {
    excute
}