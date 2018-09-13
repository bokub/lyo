import test from 'ava';

const rimraf = require('rimraf');
const get = require('../lib/get');

rimraf.sync('./dist/get');

/* eslint-disable import/no-unresolved */

test('lyo can download and compile "multiline"', async t => {
	await get('multiline', {output: 'dist/get'});
	const multiline = require('../dist/get/multiline.min.js');
	const result = multiline.stripIndent(() => {/*
Hello
world!
*/});
	const expected = 'Hello\nworld!';
	t.is(result, expected);
});

test('lyo cannot download unknown modules"', async t => {
	try {
		await get('neiqsneialsothfkdsqiofqdsjklfdsqvfiouaramq', {output: 'dist/get'});
		t.fail();
	} catch (err) {
		t.pass();
	}
});
