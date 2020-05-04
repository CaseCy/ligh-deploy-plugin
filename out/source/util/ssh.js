"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SSH = require("node-ssh");
const fs = require("fs");
const Log = require("./log");
class SshServer {
    constructor(sshConfig) {
        this.sshConfig = sshConfig;
        this.ssh = new SSH();
        this.connected = false;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ssh.connect(this.sshConfig);
            this.connected = true;
        });
    }
    exeCommand(command, path = '~') {
        Log.log("执行命令：" + command);
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
        }
        else {
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
//# sourceMappingURL=ssh.js.map