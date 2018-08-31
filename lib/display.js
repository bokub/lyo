#! /usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');

const pkg = require(path.join(process.cwd(), 'package.json'));

function succeed(opts) {
	console.info(chalk.green.underline('\nLyo finished successfully!'));
	if (opts.usage) {
		usage(opts);
	}
}

function options(opts) {
	console.info(chalk`
{dim Input file   }{magenta ${opts.input}}
{dim Output file  }{magenta ${opts.output}}
{dim Exported as  }{magenta ${opts.name}}
`);
}

function usage(opts) {
	const localPath = opts.output.replace(/\\/g, '/');
	const distPath = `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/${localPath}`;

	console.info(chalk`
Edit and include the following in your {magenta README.md}

{gray <!-- local usage -->}
{yellow <script} src="{green ${localPath}}">{yellow </script>}
{gray <!-- CDN usage -->}
{yellow <script} src="{green ${distPath}}">{yellow </script>}

{yellow <script>}
  {blue ${opts.name}}()
{yellow </script>}
`);
}

module.exports = {succeed, options, usage};
