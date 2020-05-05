"use strict";
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
function exe(sourceDir, targetPath) {
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
};
//# sourceMappingURL=compress.js.map