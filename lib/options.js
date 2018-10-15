'use strict';

const fs = require('fs');
const path = require('path').posix;
const camelCase = require('camelcase');

const pkgName = pkg => pkg.name ? pkg.name.split('/').slice(-1)[0] : '';

function parseOpts(flags, pkg) {
	// Use package.json config as default flags
	if (pkg.lyo && typeof pkg.lyo === 'object') {
		for (const f in pkg.lyo) {
			flags[f] = flags.hasOwnProperty(f) ? flags[f] : pkg.lyo[f];
		}
	}

	// Check if .babelrc exists
	const babelrcPath = flags.inputDir ? path.join(flags.inputDir, '.babelrc') : path.resolve('.babelrc');
	if (fs.existsSync(babelrcPath)) {
		flags.babelConfig = babelrcPath;
	}

	// Set input
	flags.input = input(flags, pkg);

	// Set output
	flags.output = output(flags, pkg);

	// Set name
	flags.name = flags.name || camelCase(pkgName(pkg) || '') ||
        (pkg.main ? camelCase(pkg.main.replace(/.js$/, '')) : '') || 'module';
	return flags;
}

function output(flags, pkg) {
	const defaultName = pkg.name ? (pkgName(pkg) + '.min.js') : path.basename(flags.input).replace(/.js$/, '.min.js');
	if (!flags.output) {
		return flags.remote ? defaultName : path.join('dist', defaultName);
	}
	if (!path.extname(flags.output)) {
		return path.join(flags.output, defaultName);
	}
	return flags.output;
}

function input(flags, pkg) {
	const i = flags.input || pkg.main || 'index.js';
	if (flags.remote && flags.inputDir) {
		return path.join(flags.inputDir, i);
	}
	return i;
}

module.exports = parseOpts;
