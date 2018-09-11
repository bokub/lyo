#! /usr/bin/env node
'use strict';

const path = require('path');
const task = require('./lib/task');
const saveCode = require('./lib/file');
const parseOptions = require('./lib/options');
const display = require('./lib/display');

const pkg = require(path.join(process.cwd(), 'package.json'));

async function lyo(flags) {
	const opts = parseOptions(flags, pkg);
	display.options(opts);

	let code;
	try {
		code = await task.runBrowserify(opts);
		code = await task.runBabel(code, opts);
		code = await task.runUglify(code);
		await saveCode(code, opts);
		display.succeed(opts);
	} catch (err) {
		display.fail(err);
		throw (err);
	}
}

module.exports = lyo;
