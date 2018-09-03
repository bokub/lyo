import test from 'ava';

const tempWrite = require('temp-write');
const usage = require('../lib/usage');

const {info, error} = console;
let logged = '';
let errored = '';

// eslint-disable-next-line no-control-regex
const clean = text => text.replace(/[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

test.beforeEach(() => {
	console.info = log => {
		logged += clean(log);
	};
	console.error = log => {
		errored += clean(log);
	};
});
test.afterEach(() => {
	logged = '';
	errored = '';
	console.info = info;
	console.error = error;
});

test.serial('getUsage works well', t => {
	const file = tempWrite.sync(`module.exports = input => input + '!'`, 'test.js');
	usage.getUsage({input: file});
	t.true(logged.indexOf(`<script>\n  lyo(foo);\n</script>`) !== -1);
});

test.serial('getUsage throws on unknown input', t => {
	t.throws(() => usage.getUsage({input: 'unknown.js'}));
	t.true(errored.indexOf(`Lyo encountered an error`) !== -1);
});

test.serial('getUsage handles weird exports', t => {
	const file = tempWrite.sync(`module.exports = "Exported"`, 'array.js');
	usage.getUsage({input: file});
	t.false(logged.indexOf(`<script>\n`) !== -1);
});

test.serial('getModuleSignature works for functions', t => {
	const fileA = tempWrite.sync(`module.exports = (a, b) => a + b;`, 'a.js');
	const fileB = tempWrite.sync(`module.exports = () => document.body.innerText = 'Hi';`, 'b.js');
	const fileC = tempWrite.sync(`module.exports = (a, b, c, d, e) => a;`, 'c.js');
	t.is(usage.getModuleSignature({input: fileA, name: 'concat'}), 'concat(foo, bar);');
	t.is(usage.getModuleSignature({input: fileB, name: 'sayHi'}), 'sayHi();');
	t.is(usage.getModuleSignature({input: fileC, name: 'lotsOfArgs'}), 'lotsOfArgs(args...);');
});

test.serial('getModuleSignature works for objects', t => {
	const code = `module.exports = { concat: (a, b) => a + b, sayHi: function() {document.body.innerText = 'Hi'} };`;
	const file = tempWrite.sync(code, 'test.js');
	t.is(usage.getModuleSignature({input: file, name: 'module'}), 'module.concat(foo, bar);\nmodule.sayHi();');
});

test.serial('getModuleSignature handles not-exported stuff', t => {
	const code = `console.info('Hello');`;
	const file = tempWrite.sync(code, 'test.js');
	t.is(usage.getModuleSignature({input: file, name: 'module'}), '');
});

test.serial('getModuleSignature handles shitty code', t => {
	const code = `function() { const a =`;
	const file = tempWrite.sync(code, 'test.js');
	t.is(usage.getModuleSignature({input: file, name: 'module'}), '');
});

