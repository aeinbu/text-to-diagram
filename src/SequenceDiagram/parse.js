const regex = /^(?<from>.*?)( \((?<fromStop>.*?)\))? -> (?<to>.*?)( \((?<toStop>.*?)\))?( \[(?<annotation>.*)\])?$/gm

export const parse = (incomingText) => [...incomingText.matchAll(regex)]
	.map(x => x.groups)
	.map(x => ({
		from: {
			name: x.from,
			canBeStart: true,
			mustBeStop: x.fromStop === "end",
			isAlwaysActive: x.fromStop === "always"
		},
		to: {
			name: x.to,
			canBeStart: true,
			mustBeStop: x.toStop === "end",
			isAlwaysActive: x.toStop === "always"
		},
		annotation: x.annotation
	}));
