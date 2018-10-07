import test from 'ava';

const rimraf = require('rimraf');
const get = require('../lib/get');

rimraf.sync('./dist/get');

/* eslint-disable import/no-unresolved */

test('can download and compile "multiline"', async t => {
	await get('multiline', {output: 'dist/get'});
	const multiline = require('../dist/get/multiline.min.js');
	const result = multiline.stripIndent(() => {/*
Hello
world!
*/});
	t.true(result === 'Hello\nworld!' || result === 'Hello\r\nworld!');
});

test.serial('can target a specific version', async t => {
	await get('query-string@5.0.0', {output: 'dist/get/query-string-5.min.js'});
	let queryString = require('../dist/get/query-string-5.min.js');
	t.throws(() => {
		queryString.parseUrl('https://foo.bar?foo=bar');
	});

	await get('query-string', {output: 'dist/get/query-string-latest.min.js'});
	queryString = require('../dist/get/query-string-latest.min.js');
	t.deepEqual(queryString.parseUrl('https://foo.bar?foo=bar'), {url: 'https://foo.bar', query: {foo: 'bar'}});
});

test.serial('cannot install unknown modules"', async t => {
	try {
		await get('neiqsneialsothfkdsqiofqdsjklfdsqvfiouaramq', {output: 'dist/get'});
		t.fail();
	} catch (err) {
		t.pass();
	}
});
