const node_ssh = require('node-ssh')
const fs = require('fs');

class SshServer {
    constructor(sshConfig) {
        this.sshConfig = sshConfig;
        this.ssh = new node_ssh()
        this.connected = false;
    }

    async connect() {
        await this.ssh.connect(this.sshConfig);
        this.connected = true;
    }

    exeCommand(command, path = '~') {
        console.log("执行命令：", command)
        return this.ssh.execCommand(command, {
            cwd: path
        });
    }

    disConnect() {
        this.ssh.dispose();
        this.connected = false;
    }

    isConnect() {
        return this.connected;
    }

    uploadFile(localPath, remotePath) {
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

module.exports = SshServer;