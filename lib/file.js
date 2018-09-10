#! /usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const indentString = require('indent-string');
const mkdirp = require('mkdirp');
const ora = require('ora');

const saveCode = (code, opts) => new Promise((resolve, reject) => {
	const spinner = ora('Saving result').start();
	const outPath = path.dirname(opts.output);
	if (opts.banner) {
		code = `/*!\n${indentString(opts.banner, 1, ' * ')}\n */\n${code}`;
	}

	mkdirp(outPath, err => {
		if (err) {
			spinner.fail(`Cannot create folder ${outPath}`);
			reject(err);
			return;
		}
		fs.writeFile(opts.output, code, err => {
			if (err) {
				spinner.fail(`Cannot write result in ${opts.output}`);
				reject(err);
				return;
			}
			spinner.succeed(`Saved`);
			resolve();
		});
	});
});

module.exports = saveCode;
