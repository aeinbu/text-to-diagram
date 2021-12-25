import { distinct } from '@aeinbu/groupby';
import { createElement, StatelessProps } from 'tsx-create-element';

export const CreateDiagram = ({ data }) => {
	// TODO: order endpoints in the specified order - not implemented yet
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
		{endpointNames.map((endpoint, ix) => <Endpoint key={ix} name={endpoint} arrowCount={arrows.length} index={ix} layoutParameters={layoutParameters} />)}
		{arrows.map((arrow, ix) => <Arrow key={ix} arrow={arrow} endpoints={endpointNames} layoutParameters={layoutParameters} index={ix} />)}
	</svg>
}


export const Endpoint = ({ name, arrowCount, layoutParameters, index }) => {
	const { legendHeight, endpointSpacing, arrowSpacing } = layoutParameters

	const lineHeight = arrowCount * arrowSpacing
	const height = lineHeight + legendHeight * 2
	const width = endpointSpacing
	const viewbox = `${-width / 2} 0 ${width} ${height}`

	return <svg
		width={width} height={height}
		viewBox={viewbox}
		x={index * endpointSpacing} y={0}
	>
		<text
			x={0}
			y={legendHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{name}</text>

		<text
			x={0}
			y={lineHeight + legendHeight + legendHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{name}</text>

		<line
			x1={0} y1={legendHeight}
			x2={0} y2={legendHeight + lineHeight}
			stroke="purple" />
	</svg>
}


export const Arrow = ({ arrow, endpoints, layoutParameters, index }) => {
	const { legendHeight, annotationHeight, endpointSpacing, endpointOffset, arrowSpacing, arrowOffset } = layoutParameters
	const height = arrowSpacing
	const width = endpointSpacing * endpoints.length
	const viewbox = `0 ${-(height + annotationHeight) / 2} ${width} ${arrowSpacing}`

	const startLine = "h10 "
	const endLine = "h10 "
	const segment = "h100 "
	const bridge = "c0,-14 20,-14 20,0 "
	const rightArrow = "h10 l-14,-10 m14,10 l-14,10 m0,0"
	const leftArrow = "l14,10 m0,-20 l-14,10 h10 m0,0"
	const loopback = startLine + "h40 v20 h-40 " + leftArrow
	
	const fromIx = endpoints.indexOf(arrow.from.name)
	const toIx = endpoints.indexOf(arrow.to.name)
	const segmentCount = fromIx - toIx
	const intermediateSegments = [...Array(Math.abs(segmentCount))].map(() => segment).join(bridge)

	const startPoint = `M${fromIx <= toIx ? fromIx*120+60 : toIx*120+60},0 `
	const arrowPath = segmentCount < 0
		? [startPoint, startLine, intermediateSegments, rightArrow]
		: segmentCount > 0
			? [startPoint, leftArrow, intermediateSegments, endLine]
			: [startPoint, loopback]

	return <svg
		width={width} height={arrowSpacing}
		viewBox={viewbox}
		x={0} y={index * arrowSpacing + legendHeight}
	>

		<path d={arrowPath.join(" ")} stroke="blue" fill="transparent" />

		{arrow.annotation !== undefined && <text
			x={(endpoints.indexOf(arrow.from.name) + endpoints.indexOf(arrow.to.name)) / 2 * endpointSpacing + endpointSpacing / 2}
			y={-annotationHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{arrow.annotation}</text>}

	</svg>
}
