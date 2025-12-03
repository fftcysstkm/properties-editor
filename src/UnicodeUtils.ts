/**
 * Decodes Unicode escape sequences in a string.
 * e.g., "\u3053\u3093\u306b\u3061\u306f" -> "こんにちは"
 */
export function decode(text: string): string {
    // Match \uXXXX or \\uXXXX.
    // (?:\\)? matches an optional literal backslash.
    // \\u matches a literal \u.
    return text.replace(/(?:\\)?\\u([0-9a-fA-F]{4})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
    });
}

/**
 * Encodes non-ASCII characters to Unicode escape sequences.
 * e.g., "こんにちは" -> "\u3053\u3093\u306b\u3061\u306f"
 */
export function encode(text: string): string {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        // Encode non-ASCII characters (code > 127)
        if (code > 127) {
            return '\\u' + code.toString(16).padStart(4, '0');
        }
        return char;
    }).join('');
}
