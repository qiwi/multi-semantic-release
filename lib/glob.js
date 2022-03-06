import { globbySync } from "globby";

export default (...args) => {
	const [pattern, ...options] = args;

	return globbySync(pattern, ...options);
};
