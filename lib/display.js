#! /usr/bin/env node
'use strict';

const chalk = require('chalk');

function succeed() {
	console.info(chalk.green.underline('\nLyo finished successfully!'));
}

function options(opts) {
	console.info(chalk`{dim Input file   }{magenta ${opts.input}}
{dim Output file  }{magenta ${opts.output}}
{dim Exported as  }{magenta ${opts.name}}
`);
}

module.exports = {succeed, options};
