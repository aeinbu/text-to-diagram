const regex = /^(?<from>.*?)( \((?<fromOrder>.*?)\))? -> (?<to>.*?)( \((?<toOrder>.*?)\))?( \[(?<annotation>.*)\])?$/gm

export const parse = (incomingText) => [...incomingText.matchAll(regex)]
	.map(x => x.groups)
	.map(x => ({
		from: {
			name: x.from,
			order: x.fromOrder
		},
		to: {
			name: x.to,
			order: x.toOrder
		},
		annotation: x.annotation
	}));
