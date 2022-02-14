import { distinct } from '@aeinbu/groupby'
import { createElement, StatelessProps } from 'tsx-create-element'
import { layoutParameters } from './LayoutParameters'


export const CreateDiagram = ({ data }) => {
	const endpointNames = data
		.flatMap(item => [item.from.name, item.to.name])
		.reduce(distinct(item => item.name), [])

	const arrows = data

	const width = layoutParameters.endpointSpacing * endpointNames.length
	const height = layoutParameters.arrowSpacing * arrows.length + layoutParameters.fontSize * 2.5
	const viewbox = `0 ${-layoutParameters.fontSize * 2} ${width} ${height}`

	return <svg
		width={width}
		height={height}
		viewBox={viewbox}
		style="border: thin solid lightgrey;"
	>
		<defs>
			<marker id="arrow" markerWidth="20" markerHeight="20" viewBox="0 -10 20 20" orient="auto-start-reverse" markerUnits="strokeWidth">
				<path d="M0,0 l7,0 l-7,5 m7,-5 l-7,-5" stroke="red" fill="transparent" />
			</marker>
			<marker id="no-arrow" markerWidth="20" markerHeight="20" viewBox="0 -10 20 20" orient="auto-start-reverse" markerUnits="strokeWidth">
				<path d="M0,0 l7,0" stroke="red" fill="transparent" />
			</marker>
		</defs>

		{endpointNames.map((endpointName, index) =>
			<text
				x={layoutParameters.endpointOffset + index * layoutParameters.endpointSpacing}
				y={-layoutParameters.fontSize}
				font-family="sans-serif" font-size={layoutParameters.fontSize}
				text-anchor="middle" dominant-baseline="middle"
			>
				{endpointName}
			</text>
		)}

		{endpointNames.map((endpointName, index) =>
			<Endpoint index={index} endpointName={endpointName} arrows={arrows} layoutParameters={layoutParameters} />
		)}

		{arrows.map((arrow, index) =>
			<Arrow index={index} arrow={arrow} endpointNames={endpointNames} layoutParameters={layoutParameters} />
		)}
	</svg>
}


export const Endpoint = ({ endpointName, arrows, layoutParameters, index }) => {
	const { fontSize, endpointSpacing, arrowSpacing } = layoutParameters
	const lineHeight = arrows.length * arrowSpacing
	const height = lineHeight + fontSize * 2
	const width = endpointSpacing
	const viewbox = `${-width / 2} 0 ${width} ${height}`

	const linePartDisplayStates = calculateLinePartDisplayStates(arrows, endpointName)

	return endpointName === ""
		? <></>
		: <svg
			width={width} height={height}
			viewBox={viewbox}
			x={index * endpointSpacing} y={0}
		>
			<line
				x1={0} y1={0}
				x2={0} y2={lineHeight}
				stroke="gray" stroke-width="1" />

			{linePartDisplayStates.map((state, index) => state.isActive && <line
				x1={0} y1={arrowSpacing * index + (state.startsActive ? 0 : 22)} // 0 is top
				x2={0} y2={arrowSpacing * index + (state.endsActive ? 40 : 37)}  // 40 is bottom
				stroke="gray" stroke-width="6" />
			)}
		</svg>
}


const calculateLinePartDisplayStates = (arrows, endpointName) => {
	const displayStateFrom = (currentState, previousDisplayState = { endsActive: false }) => ({
		startsActive: previousDisplayState.endsActive,
		endsActive: (previousDisplayState.endsActive || currentState.canBeStart) && !currentState.mustBeStop,
		isInvolved: currentState.canBeStart,
		isActive: currentState.canBeStart || previousDisplayState.endsActive
	})

	const x = arrows
		.map(current => ({
			canBeStart: (current.from.name === endpointName && current.from.canBeStart) || (current.to.name === endpointName && current.to.canBeStart),
			mustBeStop: (current.from.name === endpointName && current.from.mustBeStop) || (current.to.name === endpointName && current.to.mustBeStop),
			isAlwaysActive: (current.from.name === endpointName && current.from.isAlwaysActive) || (current.to.name === endpointName && current.to.isAlwaysActive),
		}))

	if (x.find(item => item.isAlwaysActive)) {
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
		linePartDisplayStates[i] = displayStateFrom(x[i], linePartDisplayStates[i - 1])
	}

	// reverse run
	for (let i = x.length - 1; i >= 0; i--) {
		const nextState = linePartDisplayStates[i + 1] ?? { isActive: false }
		if (!nextState.isActive && !linePartDisplayStates[i].isInvolved) {
			linePartDisplayStates[i].isActive = false
		} else {
			linePartDisplayStates[i].endsActive = false
			break;
		}
	}

	return linePartDisplayStates;
}


//------

const pointsTo = {
	left: Symbol("Arrow points to the left"),
	right: Symbol("Arrow points to the right"),
}


export const Arrow = ({ arrow, endpointNames, layoutParameters, index }) => {
	const { annotationHeight, endpointSpacing, endpointOffset, arrowSpacing, arrowOffset } = layoutParameters
	const height = arrowSpacing
	const width = endpointSpacing * endpointNames.length
	const viewbox = `0 ${-(height + annotationHeight) / 2} ${width} ${arrowSpacing}`

	const fromIx = endpointNames.indexOf(arrow.from.name)
	const toIx = endpointNames.indexOf(arrow.to.name)
	const arrowPath = createArrowPath(fromIx, toIx)

	const startPointForBullet = `M${endpointNames.indexOf("") * 120 + 60},0`
	const direction = fromIx <= toIx ? pointsTo.right : pointsTo.left		// arrow point to left when fromIx == toIx (for the lineToSelf)

	return <svg
		width={width} height={arrowSpacing}
		x={0} y={index * arrowSpacing}
		viewBox={viewbox}
	>

		{(arrow.from.name === "" || arrow.to.name === "") && <path d={`${startPointForBullet} m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 z`} fill="black" />}

		<path d={arrowPath}
			stroke="blue" fill="transparent"
			marker-start={direction === pointsTo.left ? "url(#arrow)" : "url(#no-arrow"}
			marker-end={direction === pointsTo.right ? "url(#arrow)" : "url(#no-arrow"}
		/>

		{arrow.annotation !== undefined &&
			<text
				x={(endpointNames.indexOf(arrow.from.name) + endpointNames.indexOf(arrow.to.name)) / 2 * endpointSpacing + endpointSpacing / 2}
				y={-annotationHeight / 2}
				font-size={layoutParameters.fontSize} font-family={layoutParameters.fontFamily}
				text-anchor="middle" dominant-baseline="middle">{arrow.annotation}</text>}

	</svg>
}


const createSegments = (segmentCount, segmentPart, joinPart) => Array.from(Array(Math.abs(segmentCount))).map(() => segmentPart).join(joinPart)


const arrowParts = {
	segment: "h100",
	bridge: "c0,-14 20,-14 20,0",
	lineToSelf: "m0,-20 h40 c14,0 14,20 0,20 h-40"
}


const createArrowPath = (fromIx, toIx) => {
	const startPoint = `m${Math.min(fromIx, toIx) * 120 + 60 + 10},0`
	const pathParts = fromIx === toIx
		? [startPoint, arrowParts.lineToSelf]	// arrow pointing at self
		: [startPoint, arrowParts.startLine, createSegments(fromIx - toIx, arrowParts.segment, arrowParts.bridge)]

	return pathParts.join(" ")
}