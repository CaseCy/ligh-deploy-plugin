import fs = require('fs');
import archiver = require('archiver');
import path = require('path')

function exe(sourceDir: string, targetPath: string) {
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

export = {
    exe
}