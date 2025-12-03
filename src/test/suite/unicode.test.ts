import * as assert from 'assert';
import { decode, encode } from '../../UnicodeUtils';

suite('UnicodeUtils Test Suite', () => {
    test('decode', () => {
        assert.strictEqual(decode('message=\\u3053\\u3093\\u306b\\u3061\\u306f'), 'message=こんにちは');
        assert.strictEqual(decode('test=\\u0041'), 'test=A');
        assert.strictEqual(decode('mixed=abc\\u3042def'), 'mixed=abcあdef');
        assert.strictEqual(decode('escaped=\\\\u3053'), 'escaped=こ');
        assert.strictEqual(decode('double_escaped=\\\\\u3053'), 'double_escaped=\\こ');
    });

    test('encode', () => {
        assert.strictEqual(encode('message=こんにちは'), 'message=\\u3053\\u3093\\u306b\\u3061\\u306f');
        assert.strictEqual(encode('test=A'), 'test=A');
        assert.strictEqual(encode('mixed=abcあdef'), 'mixed=abc\\u3042def');
    });
});
