
import { decode } from './src/UnicodeUtils';

console.log('--- Reproduction Test ---');

// Case 1: Standard single backslash
const input1 = 'message=\\u3053\\u3093\\u306b\\u3061\\u306f';
// In JS string literal, this is "message=\u3053..." (literal backslash)
console.log(`Input 1: ${input1}`);
console.log(`Output 1: ${decode(input1)}`);

// Case 2: Double backslash
const input2 = 'message=\\\\u3053\\\\u3093\\\\u306b\\\\u3061\\\\u306f';
// In JS string literal, this is "message=\\u3053..." (two literal backslashes)
console.log(`Input 2: ${input2}`);
console.log(`Output 2: ${decode(input2)}`);

// Case 3: Mixed
const input3 = 'path=C:\\\\Users\\\\Name';
console.log(`Input 3: ${input3}`);
console.log(`Output 3: ${decode(input3)}`);
