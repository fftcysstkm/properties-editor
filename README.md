# Unicode Properties Editor

VS Code extension to display, edit, and search Unicode escaped `.properties` files in your native language.

Unicodeエスケープされた `.properties` ファイルを母国語で表示・編集・検索できるVS Code拡張機能です。

## Features / 特徴

*   **Native Language Display**: Automatically decodes `\uXXXX` Unicode escapes and displays them in readable text.
    *   **母国語表示**: `\uXXXX` 形式のUnicodeエスケープを自動的にデコードして読みやすいテキストで表示します。
*   **Native Language Editing**: Edit in your native language and save; it automatically converts back to Unicode escape format.
    *   **母国語編集**: 母国語で入力・編集して保存すると、自動的にUnicodeエスケープ形式に変換して保存されます。
*   **Search**: Press `Ctrl+F` (Mac: `Cmd+F`) to search in your native language.
    *   **検索機能**: エディタ内で `Ctrl+F` (Mac: `Cmd+F`) を押すと、母国語で検索が可能です。

## Usage / 利用方法

1.  Open a `.properties` file.
    *   `.properties` ファイルを開きます。
2.  The custom editor automatically opens, showing the content in readable text.
    *   自動的に専用のエディタが表示され、内容を読みやすいテキストで確認できます。
3.  Edit as usual and save with `Ctrl+S` (Mac: `Cmd+S`).
    *   通常通り編集し、`Ctrl+S` (Mac: `Cmd+S`) で保存します。

## Installation / インストール方法

### Run in Development Environment (Debug) / 開発環境での実行 (デバッグ)

1.  Open this project in VS Code.
    *   このプロジェクトをVS Codeで開きます。
2.  Press `F5` to start debugging.
    *   `F5` キーを押してデバッグを開始します。
3.  A new window will open. Open a `.properties` file there to verify operation.
    *   新しいウィンドウが開くので、そこで `.properties` ファイルを開いて動作を確認します。

### Install from Package / パッケージからのインストール

1.  Create the `properties-editor-0.0.1.vsix` file (`npx vsce package`).
    *   `properties-editor-0.0.1.vsix` ファイルを作成します（`npx vsce package`）。
2.  Open the Extensions view in VS Code.
    *   VS Codeの拡張機能ビューを開きます。
3.  Select "Install from VSIX..." from the "..." menu at the top right, and select the created `.vsix` file.
    *   右上の「...」メニューから「VSIXからのインストール...」を選択し、作成した `.vsix` ファイルを選択します。
