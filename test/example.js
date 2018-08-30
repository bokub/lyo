const unique = require('uniq');

// Import the result of Lyo, then call check()

window.check = () => {
	const data = [1, 2, 2, 3, 4, 5, 5, 5, 6];
	console.log(`Everything is good, the result is ${unique(data)}.`);
};

