import SSH = require('node-ssh')
import fs = require('fs');
import Log = require('./log');

class SshServer {
    private sshConfig: SSH.ConfigGiven;
    private ssh: SSH;
    private connected: boolean;

    constructor(sshConfig: SSH.ConfigGiven) {
        this.sshConfig = sshConfig;
        this.ssh = new SSH()
        this.connected = false;
    }

    async connect() {
        await this.ssh.connect(this.sshConfig);
        this.connected = true;
    }

    exeCommand(command: string, path = '~') {
        Log.log("执行命令：" + command)
        return this.ssh.execCommand(command, {
            cwd: path
        });
    }

    disConnect(): void {
        this.ssh.dispose();
        this.connected = false;
    }

    isConnect(): boolean {
        return this.connected;
    }

    uploadFile(localPath: string, remotePath: string) {
        const stat = fs.lstatSync(localPath);
        if (stat.isDirectory()) {
            return this.ssh.putDirectory(localPath, remotePath);
        } else {
            return this.ssh.putFile(localPath, remotePath);
        }
    }

    connectCheck() {
        if (!this.isConnect()) {
            throw new Error("连接尚未建立");
        }
    }
}

export =  SshServer;