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

## Note / 注意事項

If you have other extensions associated with `.properties` files, this extension might not open by default. In that case, right-click the file, select "Open With...", and choose "Unicode Properties Editor".

`.properties` ファイルに関連付けられた他の拡張機能がある場合、この拡張機能がデフォルトで開かないことがあります。その場合は、ファイルを右クリックして「次で開く... (Open With...)」を選択し、「Unicode Properties Editor」を選んでください。
