'use strict';

const chalk = require('chalk');
const getStream = require('get-stream');
const ora = require('ora');
const prettyMs = require('pretty-ms');

const browserify = require('browserify');
const babel = require('@babel/core');
const babelEnvPreset = require('@babel/preset-env');
const uglifyJS = require('uglify-js');

const durationSince = startTime => chalk.blue(prettyMs(new Date().getTime() - startTime));

const runTask = (name, task) => new Promise((resolve, reject) => {
	const startTime = new Date().getTime();
	const spinner = ora(name).start();
	const succeed = result => {
		spinner.succeed(`${name} ${durationSince(startTime)}`);
		resolve(result);
	};
	const fail = err => {
		spinner.fail();
		reject(err);
	};
	task(succeed, fail);
});

const runBrowserify = opts => runTask('Browserify', (resolve, reject) => {
	const bundle = browserify([opts.input], {
		standalone: opts.name
	}).bundle();

	getStream(bundle).then(result => {
		resolve(result);
	}).catch(err => {
		reject(err.message);
	});
});

const runBabel = (code, opts) => runTask('Babel', (resolve, reject) => {
	if (opts.babelConfig) {
		opts = {configFile: opts.babelConfig, compact: false, babelrc: false};
	} else {
		const configItem = babel.createConfigItem(babelEnvPreset);
		opts = {presets: [configItem], compact: false};
	}

	babel.transformAsync(code, opts).then(result => {
		resolve(result.code);
	}).catch(err => {
		reject(err);
	});
});

const runUglify = code => runTask('Uglify', (resolve, reject) => {
	const result = uglifyJS.minify(code, {});
	if (result.error) {
		reject(result.error);
		return;
	}
	resolve(result.code);
});

module.exports = {runBrowserify, runBabel, runUglify};
