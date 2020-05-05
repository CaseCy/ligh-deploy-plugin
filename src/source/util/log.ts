import * as vscode from 'vscode';
// const terminal = vscode.window.createTerminal({
//     name: "light-deploy"
// })
const channel = vscode.window.createOutputChannel("light-deploy");
function log(msg: string) {
    channel.appendLine(msg)
    channel.show()
}
const Log = {
    log,
    channel
}
export = Log