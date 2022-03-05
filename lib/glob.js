import globby from "globby";

export default (...args) => {
	const [pattern, ...options] = args;

	return globby.sync(pattern, ...options);
};
