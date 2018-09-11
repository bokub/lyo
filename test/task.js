import test from 'ava';

const path = require('path');
const tempWrite = require('temp-write');
const task = require('../lib/task');

const resolve = dir => path.join(__dirname, '../node_modules/', dir).replace(new RegExp('\\' + path.sep, 'g'), '/');

const goodFile = tempWrite.sync(`
const unique = require('${resolve('uniq')}');
const flatten = require('${resolve('flatten')}');
module.exports = input => unique(flatten(input))`, 'imports.js');

const shittyFile = tempWrite.sync(`
module.exports = input => {
    unique(flatten(input))
 // Missing closing bracket`, 'shitty.js');

test('browserify can transform code', async t => {
	t.plan(3);
	const code = await task.runBrowserify({input: goodFile});

	t.true(code.length > 100);
	t.true(code.indexOf('unique_eq(list)') > -1); // Contains a part of uniq
	t.true(code.indexOf('_flatten(list, 1)') > -1); // Contains a part of flatten
});

test('browserify can reject promise', async t => {
	t.plan(1);

	try {
		await task.runBrowserify({input: shittyFile});
	} catch (err) {
		t.truthy(err);
	}
});

test('browserify handles unknown input', async t => {
	t.plan(1);

	try {
		await task.runBrowserify({input: 'unknown.js'});
	} catch (err) {
		t.truthy(err);
	}
});

test('babel can transform code', async t => {
	t.plan(1);
	const input = '[1, 2, 3].map((n) => n + 1);';
	const expected = `"use strict";

[1, 2, 3].map(function (n) {
  return n + 1;
});`;

	const code = await task.runBabel(input, {});
	t.is(code, expected);
});

test('babel can reject promise', async t => {
	t.plan(1);
	const code = '[1, 2, 3].map((n) => n ';

	try {
		await task.runBabel(code, {});
	} catch (err) {
		t.truthy(err);
	}
});

test('uglify can transform code', async t => {
	t.plan(1);
	const expected = 'function greet(){console.log("hello world")}';
	const input = `
function greet() {
    var hello = 'hello';
    var world = 'world';
    console.log(hello + ' ' + world);
}
    `;

	const code = await task.runUglify(input, {});
	t.is(code, expected);
});

test('uglify can reject promise', async t => {
	t.plan(1);
	const code = ' function greet() { ';
	try {
		await task.runUglify(code, {});
	} catch (err) {
		t.truthy(err);
	}
});
