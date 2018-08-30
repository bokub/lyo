import test from 'ava';

const path = require('path');
const tempWrite = require('temp-write');
const task = require('../lib/task');

const goodFile = tempWrite.sync(`
const unique = require('${path.join(__dirname, '../node_modules/uniq')}');
const flatten = require('${path.join(__dirname, '../node_modules/flatten')}');
module.exports = input => unique(flatten(input))`, 'imports.js');

const shittyFile = tempWrite.sync(`
module.exports = input => {
    unique(flatten(input))
 // Missing closing bracket`, 'shitty.js');

test('browserify can transform code', t => {
	t.plan(3);
	return task.runBrowserify([goodFile], {}).then(code => {
		t.true(code.length > 100);
		t.true(code.indexOf('unique_eq(list)') > -1); // Contains a part of uniq
		t.true(code.indexOf('_flatten(list, 1)') > -1); // Contains a part of flatten
	}).catch(() => {
		t.fail();
	});
});

test('browserify can reject promise', t => {
	t.plan(1);

	return task.runBrowserify([shittyFile], {}).then(() => {
		t.fail();
	}).catch(err => {
		t.truthy(err);
	});
});

test('babel can transform code', t => {
	t.plan(1);
	const code = `[1, 2, 3].map((n) => n + 1);`;
	const expected = `"use strict";

[1, 2, 3].map(function (n) {
  return n + 1;
});`;

	return task.runBabel(code, {}).then(code => {
		t.is(code, expected);
	}).catch(() => {
		t.fail();
	});
});

test('babel can reject promise', t => {
	t.plan(1);
	const code = `[1, 2, 3].map((n) => n `;

	return task.runBabel(code, {}).then(() => {
		t.fail();
	}).catch(err => {
		t.truthy(err);
	});
});

test('uglify can transform code', t => {
	t.plan(1);
	const expected = `function greet(){console.log("hello world")}`;
	const code = `
function greet() {
    var hello = 'hello';
    var world = 'world';
    console.log(hello + ' ' + world);
}
    `;

	return task.runUglify(code, {}).then(code => {
		t.is(code, expected);
	}).catch(() => {
		t.fail();
	});
});

test('uglify can reject promise', t => {
	t.plan(1);
	const code = ` function greet() { `;
	return task.runUglify(code, {}).then(() => {
		t.fail();
	}).catch(err => {
		t.truthy(err);
	});
});
