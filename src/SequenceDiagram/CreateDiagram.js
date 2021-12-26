import { distinct } from '@aeinbu/groupby';
import { createElement, StatelessProps } from 'tsx-create-element';

export const CreateDiagram = ({ data }) => {
	const endpointNames = data
		.flatMap(item => [item.from.name, item.to.name])
		.reduce(distinct(item => item.name), [])

	const arrows = data

	const legendHeight = 30
	const annotationHeight = 20
	const endpointSpacing = 120
	const endpointOffset = endpointSpacing / 2
	const arrowSpacing = annotationHeight + 20
	const arrowOffset = arrowSpacing / 2
	const layoutParameters = {
		legendHeight,
		annotationHeight,
		endpointSpacing,
		endpointOffset,
		arrowSpacing,
		arrowOffset
	}

	return <svg
		width={endpointSpacing * endpointNames.length}
		height={arrowSpacing * arrows.length + legendHeight * 2}
		style="border: thin solid lightgrey;"
	>
		{endpointNames.map((endpointName, ix) => <Endpoint endpointName={endpointName} arrows={arrows} index={ix} layoutParameters={layoutParameters} />)}
		{arrows.map((arrow, ix) => <Arrow arrow={arrow} endpoints={endpointNames} layoutParameters={layoutParameters} index={ix} />)}
	</svg>
}


export const Endpoint = ({ endpointName, arrows, layoutParameters, index }) => {
	const { legendHeight, endpointSpacing, arrowSpacing } = layoutParameters
	const arrowCount = arrows.length

	const lineHeight = arrowCount * arrowSpacing
	const height = lineHeight + legendHeight * 2
	const width = endpointSpacing
	const viewbox = `${-width / 2} 0 ${width} ${height}`

	const linePartDisplayStates = calculateLinePartDisplayStates(arrows, endpointName)

	return <svg
		width={width} height={height}
		viewBox={viewbox}
		x={index * endpointSpacing} y={0}
	>
		<text
			x={0}
			y={legendHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{endpointName}</text>

		<text
			x={0}
			y={lineHeight + legendHeight + legendHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{endpointName}</text>

		<line
			x1={0} y1={legendHeight}
			x2={0} y2={legendHeight + lineHeight}
			stroke="gray" stroke-width="1" />

		{linePartDisplayStates.map((state, ix) => state.isActive && <line
			x1={0} y1={arrowSpacing * ix + legendHeight + (state.startsActive ? 0: 22)} // 0 is top
			x2={0} y2={arrowSpacing * ix + legendHeight + (state.endsActive ? 40:  37)}  // 40 is bottom
			stroke="gray" stroke-width="6" />
		)}
	</svg>
}


const createDisplayState = (currentState, previousDisplayState = {endsActive: false}) => ({
		startsActive: previousDisplayState.endsActive,
		endsActive: (previousDisplayState.endsActive || currentState.canBeStart) && !currentState.mustBeStop,
		isInvolved: currentState.canBeStart,
		isActive: currentState.canBeStart || previousDisplayState.endsActive
	})


const calculateLinePartDisplayStates = (arrows, endpointName) => {
	const x = arrows
		.map(current => ({
			canBeStart: (current.from.name === endpointName && current.from.canBeStart) || (current.to.name === endpointName && current.to.canBeStart),
			mustBeStop: (current.from.name === endpointName && current.from.mustBeStop) || (current.to.name === endpointName && current.to.mustBeStop),
			isAlwaysActive: (current.from.name === endpointName && current.from.isAlwaysActive) || (current.to.name === endpointName && current.to.isAlwaysActive),
		}))

	if(x.find(item => item.isAlwaysActive)){
		return [...Array(arrows.length)].map(() => ({
			startsActive: true,
			endsActive: true,
			isInvolved: true,
			isActive: true
		}))
	}

	const linePartDisplayStates = Array(arrows.length)

	// forward run
	for (let i = 0; i < x.length; i++) {
		linePartDisplayStates[i] = createDisplayState(x[i], linePartDisplayStates[i - 1])
	}

	// reverse run
	for (let i = x.length - 1; i >= 0; i--) {
		const nextState = linePartDisplayStates[i + 1] ?? {isActive: false}
		if (!nextState.isActive && !linePartDisplayStates[i].isInvolved) {
			linePartDisplayStates[i].isActive = false
		} else {
			linePartDisplayStates[i].endsActive = false
			break;
		}
	}

	return linePartDisplayStates;
}


export const Arrow = ({ arrow, endpoints: endpointNamess, layoutParameters, index }) => {
	const { legendHeight, annotationHeight, endpointSpacing, endpointOffset, arrowSpacing, arrowOffset } = layoutParameters
	const height = arrowSpacing
	const width = endpointSpacing * endpointNamess.length
	const viewbox = `0 ${-(height + annotationHeight) / 2} ${width} ${arrowSpacing}`

	const arrowPath = createArowPath(endpointNamess.indexOf(arrow.from.name), endpointNamess.indexOf(arrow.to.name))

	return <svg
		width={width} height={arrowSpacing}
		viewBox={viewbox}
		x={0} y={index * arrowSpacing + legendHeight}
	>
		<path d={arrowPath} stroke="blue" fill="transparent" />

		{arrow.annotation !== undefined && <text
			x={(endpointNamess.indexOf(arrow.from.name) + endpointNamess.indexOf(arrow.to.name)) / 2 * endpointSpacing + endpointSpacing / 2}
			y={-annotationHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{arrow.annotation}</text>}

	</svg>
}


const createArowPath = (fromIx, toIx) => {
	const startLine = "m3,0 h7"
	const endLine = "h7 m3,0"
	const segment = "h100"
	const bridge = "c0,-14 20,-14 20,0"
	const rightArrow = "h7 l-14,-10 m14,10 l-14,10 m3,0"
	const leftArrow = "m3,0 l14,10 m0,-20 l-14,10 h7 m0,0"
	const loopback = startLine + " h40 v20 h-40 " + leftArrow

	const segmentCount = fromIx - toIx
	const intermediateSegments = [...Array(Math.abs(segmentCount))].map(() => segment).join(bridge)

	const startPoint = `M${fromIx <= toIx ? fromIx * 120 + 60 : toIx * 120 + 60},0 `
	const pathParts = segmentCount < 0
		? [startPoint, startLine, intermediateSegments, rightArrow]
		: segmentCount > 0
			? [startPoint, leftArrow, intermediateSegments, endLine]
			: [startPoint, loopback]

	return pathParts.join(" ")
}