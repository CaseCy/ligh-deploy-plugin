const fs = require('fs');
const archiver = require('archiver');
const path = require('path')

function exe(sourceDir, targetPath) {
    if (!fs.existsSync(sourceDir)) {
        throw new Error("不存在这个文件：" + sourceDir + " 请检查后重试")
    }
    let output = fs.createWriteStream(targetPath);
    // let archive = archiver('zip', {
    //     zlib: {
    //         level: 9
    //     }
    // });
    let archive = archiver('tar', {
        gzip: true,
        gzipOptions: {
            level: 5
        }
    });
    archive.pipe(output);
    archive.directory(sourceDir, path.basename(sourceDir));
    return archive.finalize();
}

module.exports = {
    exe
}