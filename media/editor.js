// @ts-check

(function () {
    // @ts-ignore
    const vscode = acquireVsCodeApi();
    /** @type {HTMLTextAreaElement} */
    // @ts-ignore
    const editor = document.getElementById('editor');
    /** @type {HTMLDivElement | null} */
    const searchContainer = document.querySelector('.search-container');
    /** @type {HTMLInputElement | null} */
    const searchInput = document.querySelector('#search-input');
    /** @type {HTMLSpanElement | null} */
    const searchCount = document.querySelector('#search-count');
    /** @type {HTMLButtonElement | null} */
    /** @type {HTMLButtonElement | null} */
    const searchClose = document.querySelector('#search-close');
    /** @type {HTMLButtonElement | null} */
    const searchPrev = document.querySelector('#search-prev');
    /** @type {HTMLButtonElement | null} */
    const searchNext = document.querySelector('#search-next');

    /** @type {HTMLDivElement | null} */
    const backdrop = document.querySelector('#backdrop');
    /** @type {HTMLButtonElement | null} */
    const toggleButton = document.querySelector('#toggle-mode');

    let isInternalChange = false;
    let isRawMode = false;

    // --- Ported from UnicodeUtils.ts ---
    /** @param {string} text */
    function decode(text) {
        // Match \uXXXX or \\uXXXX.
        // (?:\\)? matches an optional literal backslash.
        // \\u matches a literal \u.
        return text.replace(/(?:\\)?\\u([0-9a-fA-F]{4})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        });
    }

    /** @param {string} text */
    function encode(text) {
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            // Encode non-ASCII characters (code > 127)
            if (code > 127) {
                return '\\u' + code.toString(16).padStart(4, '0');
            }
            return char;
        }).join('');
    }
    // -----------------------------------

    function updateToggleButton() {
        if (toggleButton) {
            toggleButton.textContent = isRawMode ? 'Switch to Decoded' : 'Switch to Raw';
        }
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            isRawMode = !isRawMode;
            isInternalChange = true;
            if (isRawMode) {
                // Switch to Raw: Encode the current content (which is decoded)
                // Wait, if we edited in decoded mode, we have "こんにちは".
                // We want to see "\u3053...".
                editor.value = encode(editor.value);
            } else {
                // Switch to Decoded: Decode the current content (which is raw)
                editor.value = decode(editor.value);
            }
            updateBackdrop();
            updateToggleButton();
            isInternalChange = false;

            // Notify extension of mode change (optional, but good for persistence if we wanted)
            // For now, we just want to make sure subsequent saves use the correct format.
            // We trigger a change event to ensure extension knows the current state?
            // Actually, we only send isRaw on 'change'.
        });
    }

    // Handle messages from the extension
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'update':
                let text = message.text;
                // Extension sends Decoded text by default (from decode(document.getText()))
                // If we are in Raw mode, we must re-encode it to display it as Raw.
                if (isRawMode) {
                    text = encode(text);
                }

                if (editor.value !== text && editor.value.replace(/\r\n/g, '\n') !== text.replace(/\r\n/g, '\n')) {
                    isInternalChange = true;
                    editor.value = text;
                    updateBackdrop(); // Sync backdrop
                    isInternalChange = false;
                }
                break;
        }
    });

    // Handle editor changes
    editor.addEventListener('input', () => {
        updateBackdrop(); // Sync backdrop
        if (!isInternalChange) {
            vscode.postMessage({
                type: 'change',
                text: editor.value,
                isRaw: isRawMode
            });
        }
    });

    // Sync scroll
    editor.addEventListener('scroll', () => {
        if (backdrop) {
            backdrop.scrollTop = editor.scrollTop;
            backdrop.scrollLeft = editor.scrollLeft;
        }
    });

    // Search functionality
    /** @type {number[]} */
    let searchMatches = [];
    let currentMatchIndex = -1;

    /** @param {string} unsafe */
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function updateBackdrop() {
        if (!backdrop) return;
        if (!searchInput) return;

        const text = editor.value;
        const query = searchInput.value;

        if (!query) {
            backdrop.innerHTML = escapeHtml(text);
            return;
        }

        // Simple highlighting regex
        // Note: This is a basic implementation. For large files or complex regex, this needs optimization.
        // We need to be careful with escaping.

        let html = '';
        let lastIndex = 0;

        // Re-calculate matches for highlighting
        // We use the same logic as performSearch but we need to build HTML

        if (searchMatches.length === 0) {
            backdrop.innerHTML = escapeHtml(text);
            return;
        }

        searchMatches.forEach((index, i) => {
            // Append text before match
            html += escapeHtml(text.substring(lastIndex, index));

            // Append match
            const matchText = text.substr(index, query.length);
            const className = i === currentMatchIndex ? 'current' : '';
            html += `<mark class="${className}">${escapeHtml(matchText)}</mark>`;

            lastIndex = index + query.length;
        });

        // Append remaining text
        html += escapeHtml(text.substring(lastIndex));

        // Handle trailing newline for correct scrolling/sizing
        if (text.endsWith('\n')) {
            html += '<br>';
        }

        backdrop.innerHTML = html;
    }

    function performSearch() {
        if (!searchInput || !searchCount) return;

        const query = searchInput.value;
        if (!query) {
            searchMatches = [];
            currentMatchIndex = -1;
            searchCount.textContent = '';
            updateBackdrop();
            return;
        }

        const text = editor.value;
        searchMatches = [];
        let index = text.indexOf(query);
        while (index !== -1) {
            searchMatches.push(index);
            index = text.indexOf(query, index + 1);
        }

        if (searchMatches.length > 0) {
            if (currentMatchIndex === -1 || currentMatchIndex >= searchMatches.length) {
                currentMatchIndex = 0;
            }
        } else {
            currentMatchIndex = -1;
            searchCount.textContent = '0/0';
        }

        updateBackdrop();

        if (searchMatches.length > 0) {
            searchCount.textContent = `${currentMatchIndex + 1}/${searchMatches.length}`;
            scrollToMatch(searchMatches[currentMatchIndex]);
        }
    }

    /** @param {number} index */
    function scrollToMatch(index) {
        // Calculate line number
        const textBefore = editor.value.substr(0, index);
        const lines = textBefore.split('\n');
        const lineNumber = lines.length - 1;

        // Calculate scroll position (approximate line height)
        // We can try to get the actual line height from computed style
        const style = window.getComputedStyle(editor);
        const lineHeight = parseInt(style.lineHeight);

        if (!isNaN(lineHeight)) {
            // Scroll so the line is in the middle if possible
            const editorHeight = editor.clientHeight;
            editor.scrollTop = (lineNumber * lineHeight) - (editorHeight / 2);
        } else {
            // Fallback if line-height is 'normal' or invalid
            // 'normal' is usually around 1.2 * fontSize
            const fontSize = parseInt(style.fontSize);
            const estimatedLineHeight = fontSize * 1.2;
            const editorHeight = editor.clientHeight;
            editor.scrollTop = (lineNumber * estimatedLineHeight) - (editorHeight / 2);
        }
    }

    /** @param {boolean} keepFocus */
    function nextMatch(keepFocus = false) {
        if (!searchCount || !searchInput) return;

        if (searchMatches.length > 0) {
            currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
            updateBackdrop(); // Update current match highlight
            searchCount.textContent = `${currentMatchIndex + 1}/${searchMatches.length}`;
            scrollToMatch(searchMatches[currentMatchIndex]);
            if (keepFocus) {
                searchInput.focus();
            }
        }
    }

    /** @param {boolean} keepFocus */
    function prevMatch(keepFocus = false) {
        if (!searchCount || !searchInput) return;

        if (searchMatches.length > 0) {
            currentMatchIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
            updateBackdrop(); // Update current match highlight
            searchCount.textContent = `${currentMatchIndex + 1}/${searchMatches.length}`;
            scrollToMatch(searchMatches[currentMatchIndex]);
            if (keepFocus) {
                searchInput.focus();
            }
        }
    }

    window.addEventListener('keydown', e => {
        if (!searchContainer || !searchInput) return;

        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchContainer.style.display = 'flex';
            searchInput.focus();
            searchInput.select();
            performSearch(); // In case there is already text
        }
        if (e.key === 'Escape') {
            if (searchContainer.style.display !== 'none') {
                searchContainer.style.display = 'none';
                // Clear highlights when closing
                searchMatches = [];
                currentMatchIndex = -1;
                updateBackdrop();
                editor.focus();
            }
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentMatchIndex = 0;
            performSearch();
        });

        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission or other default actions
                if (e.shiftKey) {
                    prevMatch(true);
                } else {
                    nextMatch(true);
                }
            }
        });
    }

    if (searchClose && searchContainer) {
        searchClose.addEventListener('click', () => {
            searchContainer.style.display = 'none';
            // Clear highlights when closing
            searchMatches = [];
            currentMatchIndex = -1;
            updateBackdrop();
            editor.focus();
        });
    }

    if (searchPrev) {
        searchPrev.addEventListener('click', () => {
            prevMatch(true);
        });
    }

    if (searchNext) {
        searchNext.addEventListener('click', () => {
            nextMatch(true);
        });
    }

}());
