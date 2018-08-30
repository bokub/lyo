#! /usr/bin/env node
'use strict';

const fs = require('fs');
const editJsonFile = require('edit-json-file');
const detectIndent = require('detect-indent');

function init(flags) {
	const pkg = fs.readFileSync('package.json', 'utf8');
	const indent = detectIndent(pkg).indent || '  ';
	const file = editJsonFile('package.json', {stringify_width: indent});	// eslint-disable-line camelcase

	if (Object.keys(file.get('')).length === 0) {
		throw new Error('error reading package.json');
	}

	// Set prePublish script
	const prePub = file.get('scripts.prepublishOnly');
	if (!prePub) {
		file.set('scripts.prepublishOnly', 'lyo');
	} else if (prePub.indexOf('lyo') === -1) {
		file.set('scripts.prepublishOnly', `lyo && ${prePub}`);
	}

	// Set dependencies
	if (!file.get('devDependencies.lyo') && !file.get('dependencies.lyo')) {
		file.set('devDependencies.lyo', 'latest');
	}

	// Set config
	file.unset('lyo');
	for (const f in flags) {
		if (f.length > 1 && flags[f]) {
			file.set(`lyo.${f}`, flags[f]);
		}
	}

	file.save();
}

module.exports = init;

