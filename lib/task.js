#! /usr/bin/env node
'use strict';

const getStream = require('get-stream');
const ora = require('ora');

const browserify = require('browserify');
const babel = require('@babel/core');
const uglifyJS = require('uglify-js');

const runBrowserify = (file, opts) => new Promise((resolve, reject) => {
	const spinner = ora('Browserify').start();
	let bundle;
	try {
		bundle = browserify([file], {
			standalone: opts.name
		}).bundle();
	} catch (err) {
		spinner.fail();
		reject(err);
		return;
	}

	getStream(bundle).then(result => {
		spinner.succeed();
		resolve(result);
	}).catch(err => {
		spinner.fail();
		reject(err);
	});
});

const runBabel = (code, opts) => new Promise((resolve, reject) => {
	const spinner = ora('Babel').start();
	opts = {presets: ['@babel/env']};

	babel.transformAsync(code, opts).then(result => {
		spinner.succeed();
		resolve(result.code);
	}).catch(err => {
		spinner.fail();
		reject(err);
	});
});

const runUglify = code => new Promise((resolve, reject) => {
	const spinner = ora('Uglify').start();
	const result = uglifyJS.minify(code, {});
	if (result.error) {
		spinner.fail();
		reject(result.error);
		return;
	}

	spinner.succeed();
	resolve(result.code);
});

module.exports = {runBrowserify, runBabel, runUglify};
