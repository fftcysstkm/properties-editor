# Unicode Properties Editor

VS Code extension to display, edit, and search Unicode escaped `.properties` files in your native language.

## Features

*   **Native Language Display**: Automatically decodes `\uXXXX` Unicode escapes and displays them in readable text.
*   **Native Language Editing**: Edit in your native language and save; it automatically converts back to Unicode escape format.
*   **Search**: Press `Ctrl+F` (Mac: `Cmd+F`) to search in your native language.

## Usage

This extension is set as an **optional** editor to avoid conflicts with the standard Diff view.

1.  Right-click a `.properties` file in the Explorer.
2.  Select **"Open With..."**.
3.  Choose **"Unicode Properties Editor"**.

### Setting as Default

If you want to use this editor by default (note: this may affect Diff views):

1.  Right-click a `.properties` file.
2.  Select **"Open With..."**.
3.  Select **"Configure default editor for..."**.
4.  Choose **"Unicode Properties Editor"**.

---

# Unicode Properties Editor (日本語)

Unicodeエスケープされた `.properties` ファイルを母国語で表示・編集・検索できるVS Code拡張機能です。

## 特徴

*   **母国語表示**: `\uXXXX` 形式のUnicodeエスケープを自動的にデコードして読みやすいテキストで表示します。
*   **母国語編集**: 母国語で入力・編集して保存すると、自動的にUnicodeエスケープ形式に変換して保存されます。
*   **検索機能**: エディタ内で `Ctrl+F` (Mac: `Cmd+F`) を押すと、母国語で検索が可能です。

## 利用方法

標準の差分表示（Diff）との競合を避けるため、この拡張機能は**オプション**のエディタとして設定されています。

1.  エクスプローラーで `.properties` ファイルを右クリックします。
2.  **「次で開く... (Open With...)」**を選択します。
3.  **「Unicode Properties Editor」**を選択します。

### デフォルトに設定する方法

常にこのエディタで開きたい場合（注: 差分表示に影響する可能性があります）:

1.  `.properties` ファイルを右クリックします。
2.  **「次で開く... (Open With...)」**を選択します。
3.  **「...の既定のエディターを構成 (Configure default editor for...)」**を選択します。
4.  **「Unicode Properties Editor」**を選択します。
