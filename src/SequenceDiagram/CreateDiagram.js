import { distinct } from '@aeinbu/groupby';
import { createElement, StatelessProps } from 'tsx-create-element';

export const CreateDiagram = ({ data }) => {
	// TODO: order endpoints in the specified order - not implemented yet
	const endpoints = data
		.flatMap(item => [item.from.name, item.to.name])
		.reduce(distinct(item => item.name), [])

	const arrows = data

	// Layout parameters
	const legendHeight = 30
	const annotationHeight = 20

	const endpointSpacing = 120
	const endpointOffset = endpointSpacing / 2
	const arrowSpacing = annotationHeight + 20
	const arrowOffset = arrowSpacing / 2
	const endpointHeight = arrows.length * arrowSpacing

	return <svg
		width={endpointSpacing * endpoints.length}
		height={arrowSpacing * arrows.length + legendHeight * 2}
		style="border: thin solid lightgrey;"
	>
		<defs>
			<marker id="arrow" markerWidth="30" markerHeight="20" refX="9" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
				<path d="M0,0 L0,6 L9,3 z" fill="black" />
			</marker>
		</defs>

		{endpoints.map((endpoint, ix) => <text
			x={ix * endpointSpacing + endpointOffset}
			y={legendHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{endpoint}</text>)}

		{endpoints.map((endpoint, ix) => <text
			x={ix * endpointSpacing + endpointOffset}
			y={arrowSpacing * arrows.length + legendHeight * 2 - legendHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{endpoint}</text>)}

		{endpoints.map((endpoint, ix) => <line
			x1={ix * endpointSpacing + endpointOffset} y1={legendHeight}
			x2={ix * endpointSpacing + endpointOffset} y2={legendHeight + endpointHeight}
			stroke="red" />)}

		{arrows.map((arrow, ix) => <line
			x1={endpoints.indexOf(arrow.from.name) * endpointSpacing + endpointOffset} y1={ix * arrowSpacing + arrowOffset + legendHeight}
			x2={endpoints.indexOf(arrow.to.name) * endpointSpacing + endpointOffset} y2={ix * arrowSpacing + arrowOffset + legendHeight}
			stroke="black" stroke-width="1" marker-end="url(#arrow)" />)}

		{arrows.map((arrow, ix) => arrow.annotation !== undefined && <text
			x={endpoints.indexOf(arrow.from.name) + endpoints.indexOf(arrow.to.name) / 2 * endpointSpacing + endpointSpacing}
			y={ix * arrowSpacing + arrowOffset + legendHeight - annotationHeight / 2}
			text-anchor="middle" dominant-baseline="middle">{arrow.annotation}</text>)}
	</svg>
}
