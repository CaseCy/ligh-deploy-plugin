const {
    exec
} = require('child_process');

function build({
    cmd,
    path
}) {
    return new Promise((resolve) => {
        exec(cmd, {
            cwd: path,
        }, (err, stdout, stderr) => {
            resolve({
                err,
                stdout,
                stderr
            });
        });
    })
}

module.exports = {
    build
}