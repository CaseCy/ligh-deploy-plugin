// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const main = require('./src/main');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "light-deploy" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('light-deploy.deploy', async function (url) {
		// The code you place here will be executed every time your command is executed
		// console.log("url:", url.fsPath);
		url = (await checkUrl(url));
		if(!url){
			vscode.window.showWarningMessage("构建路径不能为空")
			return;
		}
		let config = vscode.workspace.getConfiguration("light-deploy");
		main.run(url.fsPath, config.config);
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from light-deploy!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

async function checkUrl(url) {
	if (!url || !url.fsPath) {
		let pick = vscode.window.showWorkspaceFolderPick({
			ignoreFocusOut: true,
			placeHolder: "请选择要构建的目录"
		});
		let pickValue = (await pick);
		if (pickValue) {
			url = pickValue.uri;
		}
	}
	return url;
}

module.exports = {
	activate,
	deactivate
}