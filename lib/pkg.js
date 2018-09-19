'use strict';

const path = require('path');
const display = require('./display');

const cwd = process.cwd();

try {
	module.exports = require(path.join(cwd, 'package.json'));
} catch (e) {
	display.fail(`Cannot find a valid package.json in ${cwd}`);
	throw (e);
}
