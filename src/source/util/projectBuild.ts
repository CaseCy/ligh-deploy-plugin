import { exec } from 'child_process';
import { BuildConfig } from '../types';

function build({
    cmd,
    path
}: BuildConfig): Promise<any> {
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

export = {
    build
}