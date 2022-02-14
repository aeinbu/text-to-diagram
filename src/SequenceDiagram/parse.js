const regex = /^(?<from>.*?)( ?\((?<fromStop>.*?)\))? ?-> ?(?<to>.*?)( ?\((?<toStop>.*?)\))?( ?\[(?<annotation>.*)\])?$/gm

export const parse = (incomingText) => Array.from(incomingText.matchAll(regex))
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


const defaultState = {
	startsActive: false,
	endsActive: false,
	isInvolved: false,
	isActive: false
}

// const defaultEndpoint = {
// 	name: undefined,
// 	canBeStart: false,
// 	mustBeStop: false,
// 	isAlwaysActive: false
// }

// const defaultArrow  = {
// 	from: defaultEndpoint,
// 	to: defaultEndpoint,
// 	annotation: undefined
// }

export const process = (arrows) => {
	const endpoints = []

	const intermediatEndpointStates = new Map()

	const index = 0
	do {
		const previous = arrows[index - 1] ?? defaultArrow
		const current = arrows[index]
		
		if(current.mustBeStop){
			current.displayState = {
				...defaultState,
				//TODO:...
			}
		}

	} while (index < arrows.length)

	// for(var index; index < arrows.length; index++) {
	// 	var previousState = index <
	// }

	// this is probably a for loop
	// 1
	// 2 .. end

	// this can be a while loop
	// end
	// end-1 .. condition
}