import test from 'ava';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const saveCode = require('../lib/save');

rimraf.sync('./dist/saved');

test('code is saved at the good location', async t => {
	const fileName = path.join(__dirname, '../dist/saved/code-A.min.js');
	const expected = 'Hello\nworld!';
	await saveCode(expected, {output: fileName});
	const actual = fs.readFileSync(fileName, 'utf8');
	t.is(actual, expected);
});

test('banner option works well', async t => {
	const fileName = path.join(__dirname, '../dist/saved/code-B.min.js');
	const code = 'Hello world!';
	const banner = 'Have fun\nWith Lyo';
	const expected = '/*!\n * Have fun\n * With Lyo\n */\n' + code;
	await saveCode(code, {output: fileName, banner});
	const actual = fs.readFileSync(fileName, 'utf8');
	t.is(actual, expected);
});

test('some directories cannot be created', async t => {
	const fileName = path.join(__dirname, '../dist/saved-' + '\0'.repeat(280), 'code-C.min.js');
	try {
		await saveCode('Test', {output: fileName});
		t.fail();
	} catch (e) {
		t.pass();
	}
});

test('some files cannot be created', async t => {
	const fileName = path.join(__dirname, '../dist/saved/') + '..';
	try {
		await saveCode('Test', {output: fileName});
		t.fail();
	} catch (e) {
		t.pass();
	}
});
