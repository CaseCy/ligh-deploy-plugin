"use strict";
const vscode = require("vscode");
// const terminal = vscode.window.createTerminal({
//     name: "light-deploy"
// })
const channel = vscode.window.createOutputChannel("light-deploy");
function log(msg) {
    channel.appendLine(msg);
    channel.show();
}
const Log = {
    log,
    channel
};
module.exports = Log;
//# sourceMappingURL=log.js.map