const glob = require("glob");

module.exports = (...args) => {
	const [pattern, ...options] = args;

	return pattern.reduce(function (acc, p) {
		acc = acc.concat(glob.sync(p, ...options));
		return acc;
	}, []);
};
