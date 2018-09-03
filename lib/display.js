#! /usr/bin/env node
'use strict';

const chalk = require('chalk');

function succeed() {
	console.info(chalk.green.underline('\nLyo finished successfully!'));
}

function fail(err) {
	console.error(chalk.red('\nLyo encountered an error\n'));
	console.error(err);
}

function options(opts) {
	console.info(chalk`{dim Input file   }{magenta ${opts.input}}
{dim Output file  }{magenta ${opts.output}}
{dim Exported as  }{magenta ${opts.name}}
`);
}

module.exports = {succeed, fail, options};
