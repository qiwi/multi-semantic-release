const globby = require("globby");

module.exports = (...args) => {
	const [pattern, ...options] = args;

	return pattern.reduce(function (acc, p) {
		acc = acc.concat(globby.sync(p, ...options));
		return acc;
	}, []);
};
