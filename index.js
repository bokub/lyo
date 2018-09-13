#! /usr/bin/env node
'use strict';

const path = require('path');
const task = require('./lib/task');
const saveCode = require('./lib/save');
const parseOptions = require('./lib/options');
const display = require('./lib/display');

async function lyo(flags, pkg) {
	const opts = parseOptions(flags, pkg || require(path.join(process.cwd(), 'package.json')));
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
