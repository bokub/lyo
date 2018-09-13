#! /usr/bin/env node
'use strict';

const chalk = require('chalk');

function succeed() {
	console.info(chalk.green.underline('\nLyo finished successfully!\n'));
}

function fail(err) {
	console.error(chalk.red('\nLyo encountered an error\n'));
	console.error(err + '\n');
}

function options(opts) {
	const inputAlias = opts.remote ? opts.input.replace(/^.+node_modules[\\/](.+)$/, 'npm:$1') : opts.input;
	console.info(chalk`{dim Input file   }{magenta ${inputAlias}}
{dim Output file  }{magenta ${opts.output}}
{dim Exported as  }{magenta ${opts.name}}
`);
}

module.exports = {succeed, fail, options};
