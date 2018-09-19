#!/usr/bin/env node
'use strict';

const meow = require('meow');
const lyo = require('..');
const init = require('../lib/init');
const usage = require('../lib/usage');
const get = require('../lib/get');

const cli = meow(`
    Usage
      $ lyo [options]               Run Lyo
      $ lyo init [options]          Add Lyo to your project
      $ lyo usage [options]         Show how to use the output file
      $ lyo get <module> [options]  Run Lyo on a module from npm

    Options
      --input   -i  Entry file
      --output  -o  Output file / folder
      --name    -n  Module name in browser
      --banner  -b  Add a banner to the top of the bundle

    Examples
      $ lyo
      $ lyo -i main.js
      $ lyo -n runFunction
      $ lyo get query-string
      $ lyo -o dist/bundle.min.js
      $ lyo -b 'Lyo\\nLicensed under MIT'
`, {
	flags: {
		input: {type: 'string', alias: 'i'},
		output: {type: 'string', alias: 'o'},
		name: {type: 'string', alias: 'n'},
		banner: {type: 'string', alias: 'b'}
	},
	description: 'Lyo'
});

switch (cli.input[0]) {
	case 'init':
		try {
			init(cli.flags);
		} catch (err) {
			process.exit(1);
		}
		break;
	case 'usage':
		try {
			usage.getUsage(cli.flags);
		} catch (err) {
			process.exit(1);
		}
		break;
	case 'get':
		if (!cli.input[1]) {
			cli.showHelp(2);
		}
		get(cli.input[1], cli.flags).catch(() => process.exit(1));
		break;
	case undefined:
		lyo(cli.flags).catch(() => process.exit(1));
		break;
	default:
		cli.showHelp(2);
}

