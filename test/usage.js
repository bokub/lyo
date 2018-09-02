import test from 'ava';

const tempWrite = require('temp-write');
const usage = require('../lib/usage');

const {info} = console;

test.before(() => {
	console.info = () => {};
});
test.after(() => {
	console.info = info;
});

test('getUsage does not throw any error', t => {
	const file = tempWrite.sync(`module.exports = input => input + '!'`, 'test.js');
	t.notThrows(() => {
		usage.getUsage({input: file});
	});
});

test('getModuleSignature works for functions', t => {
	const fileA = tempWrite.sync(`module.exports = (a, b) => a + b;`, 'a.js');
	const fileB = tempWrite.sync(`module.exports = () => console.log('Hi');`, 'b.js');
	t.is(usage.getModuleSignature({input: fileA, name: 'concat'}), 'concat(foo, bar);');
	t.is(usage.getModuleSignature({input: fileB, name: 'sayHi'}), 'sayHi();');
});

test('getModuleSignature works for objects', t => {
	const code = `module.exports = { concat: (a, b) => a + b, sayHi: function() {console.log('Hi')} };`;
	const file = tempWrite.sync(code, 'test.js');
	t.is(usage.getModuleSignature({input: file, name: 'module'}), 'module.concat(foo, bar);\nmodule.sayHi();');
});

