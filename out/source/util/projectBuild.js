"use strict";
const child_process_1 = require("child_process");
function build({ cmd, path }) {
    return new Promise((resolve) => {
        child_process_1.exec(cmd, {
            cwd: path,
        }, (err, stdout, stderr) => {
            resolve({
                err,
                stdout,
                stderr
            });
        });
    });
}
module.exports = {
    build
};
//# sourceMappingURL=projectBuild.js.map