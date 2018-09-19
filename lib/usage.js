'use strict';

const path = require('path');

const chalk = require('chalk');
const indentString = require('indent-string');
const display = require('./display');
const parseOptions = require('./options');

function getUsage(flags) {
	const pkg = require('./pkg');
	const opts = parseOptions(flags, pkg);
	display.options(opts);
	const signature = getModuleSignature(opts);

	printUsage(pkg, opts, signature);
}

function printUsage(pkg, opts, signature) {
	const localPath = opts.output.replace(/\\/g, '/');
	const distPath = `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version.split('.')[0]}/${localPath}`;

	console.info(chalk`
Edit and include the following snippet in your {magenta README.md}

{gray <!-- local usage -->}
{yellow <script} src="{green ${localPath}}">{yellow </script>}
{gray <!-- CDN usage -->}
{yellow <script} src="{green ${distPath}}">{yellow </script>}
` + (signature ? chalk`
{yellow <script>}
{blue ${indentString(signature, 2)}}
{yellow </script>}
` : ''));
}

function getModuleSignature(opts) {
	let module;
	try {
		module = require(path.resolve(opts.input));
	} catch (err) {
		if (err.code === 'MODULE_NOT_FOUND') {
			display.fail(err.message);
			throw err;
		}
		return '';
	}

	if (typeof module === 'function') {
		return getFunctionSignature(module, opts.name);
	}

	if (typeof module === 'object') {
		const res = [];
		for (const prop in module) {
			if (module.hasOwnProperty(prop) && typeof module[prop] === 'function') {
				res.push(`${opts.name}.${getFunctionSignature(module[prop], prop)}`);
			}
		}
		return res.join('\n');
	}
	return '';
}

function getFunctionSignature(fn, name) {
	const placeHolders = ['foo', 'bar', 'baz', 'qux'];
	if (fn.length > placeHolders.length) {
		return `${name}(args...);`;
	}
	return `${name}(${placeHolders.slice(0, fn.length).join(', ')});`;
}

module.exports = {getUsage, getModuleSignature};
