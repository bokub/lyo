import test from 'ava';

const path = require('path');
const rimraf = require('rimraf');
const lyo = require('.');

rimraf.sync('./dist');

const opts = name => {
	return {input: path.join('./node_modules', name), output: path.join('./dist', name + '.min.js')};
};

test('Lyo works on query-string', async t => {
	await lyo(opts('query-string'));
	const queryString = require('./dist/query-string.min.js');

	t.deepEqual(queryString.parse('#token=bada55cafe'), {token: 'bada55cafe'});
	t.is(queryString.stringify({foo: 'unicorn', ilike: 'pizza'}), 'foo=unicorn&ilike=pizza');
});

test('Lyo works on multiline', async t => {
	await lyo(opts('multiline'));
	const multiline = require('./dist/multiline.min.js');
	const result = multiline.stripIndent(() => {/*
Hello
world!
*/});
	const expected = 'Hello\nworld!';
	t.is(result, expected);
});
