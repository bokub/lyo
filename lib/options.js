'use strict';

const path = require('path').posix;
const camelCase = require('camelcase');

function parseOpts(flags, pkg) {
	// Use package.json config as default flags
	if (pkg.lyo && typeof pkg.lyo === 'object') {
		for (const f in pkg.lyo) {
			flags[f] = flags.hasOwnProperty(f) ? flags[f] : pkg.lyo[f];
		}
	}

	// Set input
	flags.input = flags.input || pkg.main || 'index.js';
	if (flags.remote && flags.inputDir) {
		flags.input = path.join(flags.inputDir, flags.input);
	}

	// Set output
	const pkgName = pkg.name ? pkg.name.split('/').slice(-1)[0] : '';
	const defaultName = pkg.name ? (pkgName + '.min.js') : path.basename(flags.input).replace(/.js$/, '.min.js');
	if (!flags.output) {
		flags.output = flags.remote ? defaultName : path.join('dist', defaultName);
	} else if (!path.extname(flags.output)) {
		flags.output = path.join(flags.output, defaultName);
	}

	// Set name
	flags.name = flags.name || camelCase(pkgName || '') ||
        (pkg.main ? camelCase(pkg.main.replace(/.js$/, '')) : '') || 'module';
	return flags;
}

module.exports = parseOpts;
