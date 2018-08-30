#!/usr/bin/env node
'use strict';
const meow = require('meow');
const lyo = require('..');
const init = require('../lib/init');

const cli = meow(`
    Usage
      $ lyo [options]       Run Lyo
      $ lyo init [options]  Add Lyo to your project
 
    Options
      --input    -i  Entry file
      --output   -o  Output file / folder
 	  --name     -n  Function name in browser
 	  --usage    -u  Show how to use the output file 

    Examples
      $ lyo
      $ lyo --usage
      $ lyo -i main.js
      $ lyo -n checkThings
      $ lyo -o dist/bundle.min.js
`, {
	flags: {
		input: {type: 'string', alias: 'i'},
		output: {type: 'string', alias: 'o'},
		name: {type: 'string', alias: 'n'},
		usage: {type: 'boolean', alias: 'u'}
	},
	description: 'Lyo'
});

switch (cli.input[0]) {
	case 'init':
		init(cli.flags);
		break;
	case undefined:
		lyo(cli.flags);
		break;
	default:
		cli.showHelp(2);
}

