import test from 'ava';

const display = require('../lib/display');

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

test.serial('display options works well', t => {
	display.options({input: 'in', output: 'ou', name: 'na'});
	t.is(logged, 'Input file   in\nOutput file  ou\nExported as  na\n');
});

test.serial('succeed works well', t => {
	display.succeed();
	t.is(logged, '\nLyo finished successfully!');
});

test.serial('fail works well', t => {
	display.fail('Hello world');
	t.is(errored, '\nLyo encountered an error\nHello world\n');
});
