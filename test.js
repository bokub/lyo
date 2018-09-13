import test from 'ava';

const path = require('path');
const rimraf = require('rimraf');
const lyo = require('.');

rimraf.sync('./dist/modules');

const opts = name => {
	return {
		input: path.join('./node_modules', name),
		output: path.join('./dist/modules', name + '.min.js'),
		banner: 'Built with Lyo\nFor testing purposes'
	};
};

/* eslint-disable import/no-unresolved */

test('Lyo works on "query-string"', async t => {
	await lyo(opts('query-string'));
	const queryString = require('./dist/modules/query-string.min.js');

	t.deepEqual(queryString.parse('#token=bada55cafe'), {token: 'bada55cafe'});
	t.is(queryString.stringify({foo: 'unicorn', ilike: 'pizza'}), 'foo=unicorn&ilike=pizza');
});

test('Lyo doesn\'t work on "babel"', async t => {
	try {
		await lyo(opts('@babel/core'));
		t.fail();
	} catch (e) {
		t.pass();
	}
});
