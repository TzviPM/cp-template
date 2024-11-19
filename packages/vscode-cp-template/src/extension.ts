// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Command } from './commands/command.interface';
import { DuplicateFileController } from './controllers/duplicate-file.controller';
import { DuplicateFileCommand } from './commands/duplicate-file.command';

function handleError(err: Error) {
	if (err && err.message) {
			vscode.window.showErrorMessage(err.message);
	}
	return err;
}

function register(context: vscode.ExtensionContext, command: Command, commandName: string) {
	const proxy = (...args: never[]) => command.execute(...args).catch(handleError);
	const disposable = vscode.commands.registerCommand(`cp-template.${commandName}`, proxy);

	context.subscriptions.push(disposable);
}

export function activate(context: vscode.ExtensionContext) {
	const duplicateFileController = new DuplicateFileController(context);

	register(context, new DuplicateFileCommand(duplicateFileController), "duplicateFile");
}

// This method is called when your extension is deactivated
export function deactivate() {}
