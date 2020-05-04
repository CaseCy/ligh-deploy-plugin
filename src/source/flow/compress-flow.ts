import compress = require('../util/compress')
import Log = require('../util/log');

async function excute(compressPath: string, outPutPath: string) {
    Log.log("开始执行文件压缩")
    try {
        await compress.exe(compressPath, outPutPath);
        Log.log("压缩成功,文件路径" + outPutPath);
    } catch (e) {
        Log.log("压缩失败" + e);
    }
}

export =  {
    excute
}