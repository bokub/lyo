'use strict';

const path = require('path');
const tempDir = require('temp-dir');
const npmi = require('npmi');
const parse = require('parse-package-name');
const pify = require('pify');
const display = require('./display');
const lyo = require('..');

const install = pify(npmi);

async function get(module, flags) {
	const {name, version} = parse(module);
	const installOpts = {
		name,
		version,
		path: path.join(tempDir, 'Lyo')
	};

	try {
		await install(installOpts);
	} catch (err) {
		display.fail(err);
		throw err;
	}

	flags.remote = name;
	flags.inputDir = path.join(tempDir, 'Lyo', 'node_modules', name);
	const pkg = require(path.join(flags.inputDir, 'package.json'));

	return lyo(flags, pkg);
}

module.exports = get;
