import { Configuration, DeployConfig } from "../types";
import SshServer = require("../util/ssh");

export class Context {
    readonly config: Configuration;
    readonly activeConfig: DeployConfig;
    readonly sshServer: SshServer;
    outPutPath: string;
    remoteAddr: string;
}