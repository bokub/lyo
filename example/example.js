const unique = require('uniq');
const flatten = require('flatten');

module.exports = input => {
	const flattened = flatten(input);
	return unique(flattened);
};
