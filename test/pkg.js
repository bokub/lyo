import test from 'ava';

const importFresh = require('import-fresh');

test.serial('pkg returns the current package.json', t => {
	t.is(importFresh('../lib/pkg').name, 'lyo');
});

test.serial('pkg throws if package.json is not found', t => {
	process.chdir('test');
	try {
		importFresh('../lib/pkg');
		t.fail();
	} catch (e) {
		t.pass();
	}
	process.chdir('..');
});
