'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const filesize = require('filesize');
const indentString = require('indent-string');
const mkdirp = require('mkdirp');
const ora = require('ora');

const saveCode = (code, opts) => new Promise((resolve, reject) => {
	const spinner = ora('Saving result').start();
	const outPath = path.dirname(opts.output);
	if (opts.banner) {
		code = `/*!\n${indentString(opts.banner, 1, ' * ')}\n */\n${code}`;
	}

	try {
		mkdirp.sync(outPath);
	} catch (err) {
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
		const stats = fs.statSync(opts.output);
		spinner.succeed(`Saved ${chalk.blue(filesize(stats.size))}`);
		resolve();
	});
});

module.exports = saveCode;
