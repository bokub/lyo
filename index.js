#! /usr/bin/env node
'use strict';

const path = require('path');
const task = require('./lib/task');
const saveCode = require('./lib/file');
const parseOptions = require('./lib/options');
const display = require('./lib/display');

const pkg = require(path.join(process.cwd(), 'package.json'));

function lyo(flags) {
	const opts = parseOptions(flags, pkg);
	display.options(opts);

	task.runBrowserify(opts)
		.then(code => task.runBabel(code, opts))
		.then(code => task.runUglify(code))
		.then(code => saveCode(code, opts))
		.then(() => display.succeed(opts))
		.catch(err => {
			display.fail(err);
			process.exit(1);
		});
}

module.exports = lyo;
