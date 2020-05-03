const vscode = require('vscode');
// const terminal = vscode.window.createTerminal({
//     name: "light-deploy"
// })
const channel = vscode.window.createOutputChannel("light-deploy");
channel.show()
function log(msg) {
    channel.appendLine(msg)
}

module.exports = {
    log
}