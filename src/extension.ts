import * as vscode from 'vscode';
import { PropertiesCustomEditorProvider } from './PropertiesCustomEditorProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "properties-editor" is now active!');

    context.subscriptions.push(PropertiesCustomEditorProvider.register(context));
}

export function deactivate() { }
