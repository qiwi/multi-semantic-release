/**
 * Detect if there is a cyclic dependency tree between the packages
 * @param {Array<Package>} pkgs Array of package object
 * @returns {boolean} True if there are a cyclic dependency
 */
const isCyclicProject = (pkgs) => {
	return pkgs.some((pkg) =>
		pkg.localDeps.some((dep) => dep.localDeps.some((nestedDep) => nestedDep.name === pkg.name))
	);
};

module.exports = isCyclicProject;
