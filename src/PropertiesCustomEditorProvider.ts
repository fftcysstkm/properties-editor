import * as vscode from 'vscode';
import { decode, encode } from './UnicodeUtils';

export class PropertiesCustomEditorProvider implements vscode.CustomTextEditorProvider {

    public static readonly viewType = 'properties-editor.editor';

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new PropertiesCustomEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(PropertiesCustomEditorProvider.viewType, provider);
        return providerRegistration;
    }

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    private readonly syncingUris = new Set<string>();

    /**
     * Called when our custom editor is opened.
     */
    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
        };

        function updateWebview() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: decode(document.getText())
            });
        }

        // Hook up event handlers so that we can synchronize the webview with the text document.
        //
        // The text document acts as our model, so we have to sync change in the document to our
        // webview and sync changes in the webview back to the document.
        // 
        // Remember that a single text document can also be shared between multiple custom
        // editors (this happens for example when you split a custom editor)

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                if (this.syncingUris.has(document.uri.toString())) {
                    return;
                }
                updateWebview();
            }
        });

        // Make sure we get rid of the listener when our editor is closed.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        // Receive message from the webview.
        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'change':
                    this.updateTextDocument(document, e.text, e.isRaw);
                    return;
                case 'ready':
                    updateWebview();
                    return;
            }
        });

        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
    }

    /**
     * Get the static html used for the editor webviews.
     */
    private getHtmlForWebview(webview: vscode.Webview): string {
        // Local path to script and css for the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'editor.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'editor.css'));

        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return /* html */`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <link href="${styleUri}" rel="stylesheet" />
                <title>Properties Editor</title>
            </head>
            <body>
                <div class="toolbar">
                    <button id="toggle-mode">Raw / Decoded</button>
                </div>
                <div class="search-container" id="search-container" style="display: none;">
                    <input type="text" id="search-input" placeholder="検索 (Enterで次へ)..." />
                    <div class="search-navigation">
                        <button id="search-prev" title="Previous Match">↑</button>
                        <button id="search-next" title="Next Match">↓</button>
                    </div>
                    <span id="search-count"></span>
                    <button id="search-close">×</button>
                </div>
                <div class="editor-container">
                    <div class="editor-wrapper">
                        <div class="backdrop" id="backdrop"></div>
                        <textarea id="editor" spellcheck="false"></textarea>
                    </div>
                </div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }

    /**
     * Write out the json to a given document.
     */
    private updateTextDocument(document: vscode.TextDocument, text: string, isRaw: boolean) {
        const edit = new vscode.WorkspaceEdit();

        // Just replace the entire document every time for this example.
        // A more complete implementation would compute minimal edits.
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            isRaw ? text : encode(text)
        );

        this.syncingUris.add(document.uri.toString());
        return vscode.workspace.applyEdit(edit).then(success => {
            this.syncingUris.delete(document.uri.toString());
            return success;
        });
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
