'use strict';

const fs = require('fs');
const editJsonFile = require('edit-json-file');
const detectIndent = require('detect-indent');
const ora = require('ora');

function init(flags) {
	let pkg;
	try {
		pkg = fs.readFileSync('package.json', 'utf8');
	} catch (err) {
		ora().fail('Error reading package.json');
		throw new Error(err);
	}

	const indent = detectIndent(pkg).indent || '  ';
	const file = editJsonFile('package.json', {stringify_width: indent});	// eslint-disable-line camelcase
	const done = {script: false, dependency: false, config: false};

	if (Object.keys(file.get('')).length === 0) {
		ora().fail('Error reading package.json');
		throw new Error('Error reading package.json');
	}

	// Set prePublish script
	const prePub = file.get('scripts.prepublishOnly');
	if (!prePub) {
		file.set('scripts.prepublishOnly', 'lyo');
		done.script = 'Created';
	} else if (prePub.indexOf('lyo') === -1) {
		file.set('scripts.prepublishOnly', `lyo && ${prePub}`);
		done.script = 'Edited';
	}

	// Set dependencies
	if (!file.get('devDependencies.lyo') && !file.get('dependencies.lyo')) {
		file.set('devDependencies.lyo', 'latest');
		done.dependency = true;
	}

	// Set config
	const previousConf = JSON.stringify(file.get('lyo'));
	file.unset('lyo');
	for (const f in flags) {
		if (f.length > 1 && flags[f]) {
			file.set(`lyo.${f}`, flags[f]);
		}
	}
	if (JSON.stringify(file.get('lyo')) !== previousConf) {
		done.config = true;
	}

	const successMessages = {
		dependency: 'Added lyo to the dev dependencies',
		script: done.script + ' "prepublishOnly" script',
		config: 'Edited default lyo config'
	};

	let hasDifferences = false;
	for (const key in successMessages) {
		if (done[key]) {
			hasDifferences = true;
			ora().succeed(successMessages[key]);
		}
	}

	if (!hasDifferences) {
		ora().warn('Lyo is already configured, nothing has changed');
		return;
	}

	file.save();
}

module.exports = init;

