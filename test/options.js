import test from 'ava';

const parseOptions = require('../lib/options');

test('output option works', t => {
	const pkg = {};
	t.is(parseOptions({}, pkg).output, 'dist/index.min.js');

	pkg.main = 'stuff.js';
	t.is(parseOptions({}, pkg).output, 'dist/stuff.min.js');

	pkg.name = 'my-module';
	t.is(parseOptions({}, pkg).output, 'dist/my-module.min.js');

	const flags = {output: 'bundle/my-bundle.js'};
	t.is(parseOptions(flags, pkg).output, 'bundle/my-bundle.js');

	flags.output = 'bundle/stuff';
	t.is(parseOptions(flags, pkg).output, 'bundle/stuff/my-module.min.js');
});

test('name option works', t => {
	const pkg = {};
	t.is(parseOptions({}, pkg).name, 'module');

	pkg.main = 'my-main.js';
	t.is(parseOptions({}, pkg).name, 'myMain');

	pkg.name = 'my-module';
	t.is(parseOptions({}, pkg).name, 'myModule');

	const flags = {name: 'super-function'};
	t.is(parseOptions(flags, pkg).name, 'super-function');
});

test('priority is respected', t => {
	const pkg = {main: 'main.js'};
	t.is(parseOptions({}, pkg).input, 'main.js');

	pkg.lyo = {input: 'mainAlt.js'};
	t.is(parseOptions({}, pkg).input, 'mainAlt.js');

	const flags = {input: 'mainAltAlt.js'};
	t.is(parseOptions(flags, pkg).input, 'mainAltAlt.js');
});

test('default options are correct', t => {
	const pkg = {name: 'my-module', main: 'main.js'};
	t.deepEqual(parseOptions({}, pkg), {
		input: 'main.js',
		name: 'myModule',
		output: 'dist/my-module.min.js'
	});
});
