const vscode = require('vscode');
// const terminal = vscode.window.createTerminal({
//     name: "light-deploy"
// })
const channel = vscode.window.createOutputChannel("light-deploy");
function log(msg) {
    channel.appendLine(msg)
    channel.show()
}

module.exports = {
    log,
    channel
}