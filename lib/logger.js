import dbg from "debug";
import singnale from "signale";

const { Signale } = singnale;
const severityOrder = ["error", "warn", "info", "debug", "trace"];
const assertLevel = (level, limit) => severityOrder.indexOf(level) <= severityOrder.indexOf(limit);
const aliases = {
	failure: "error",
	log: "info",
	success: "info",
	complete: "info",
};

export const logger = {
	prefix: "msr:",
	config: {
		_level: "info",
		_stderr: process.stderr,
		_stdout: process.stdout,
		_signale: {},
		set level(l) {
			if (assertLevel(l, "debug")) {
				dbg.enable("msr:");
			}
			if (assertLevel(l, "trace")) {
				dbg.enable("semantic-release:");
			}
			this._level = l;
		},
		get level() {
			return this._level;
		},
		set stdio([stderr, stdout]) {
			this._stdout = stdout;
			this._stderr = stderr;
			this._signale = new Signale({
				config: { displayTimestamp: true, displayLabel: false },
				// scope: "multirelease",
				stream: stdout,
				types: {
					error: { color: "red", label: "", stream: [stderr] },
					log: { color: "magenta", label: "", stream: [stdout], badge: "•" },
					success: { color: "green", label: "", stream: [stdout] },
					complete: { color: "green", label: "", stream: [stdout], badge: "🎉" },
				},
			});
		},
		get stdio() {
			return [this._stderr, this._stdout];
		},
	},
	withScope(prefix) {
		return {
			...this,
			prefix,
			debug: dbg(prefix || this.prefix),
		};
	},
	...[...severityOrder, ...Object.keys(aliases)].reduce((m, l) => {
		m[l] = function (...args) {
			if (assertLevel(aliases[l] || l, this.config.level)) {
				(this.config._signale[l] || console[l] || (() => {}))(this.prefix, ...args);
			}
		};
		return m;
	}, {}),
	debug: dbg("msr:"),
};
