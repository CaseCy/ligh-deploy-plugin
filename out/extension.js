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
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const main = require("./source/main");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "light-deploy" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('light-deploy.deploy', function (url) {
        return __awaiter(this, void 0, void 0, function* () {
            // The code you place here will be executed every time your command is executed
            url = (yield checkUrl(url));
            if (!url) {
                vscode.window.showWarningMessage("构建路径不能为空");
                return;
            }
            let config = vscode.workspace.getConfiguration("light-deploy");
            main.run(url.fsPath, config.config);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function checkUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url || !url.fsPath) {
            let pick = vscode.window.showWorkspaceFolderPick({
                ignoreFocusOut: true,
                placeHolder: "请选择要构建的目录"
            });
            let pickValue = (yield pick);
            if (pickValue) {
                url = pickValue.uri;
            }
        }
        return url;
    });
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map