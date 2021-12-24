import { distinct } from '@aeinbu/groupby';

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

	return `<svg
		width="${endpointSpacing * endpointNames.length}"
		height="${arrowSpacing * arrows.length + legendHeight * 2}"
		style="border: thin solid lightgrey;"
	>
		${Defs()}
		${endpointNames.map((endpoint, ix) => Endpoint({name: endpoint, arrowCount: arrows.length, index: ix, layoutParameters})).join('\n')}
		${arrows.map((arrow, ix) => Arrow({arrow, endpoints: endpointNames, layoutParameters, index: ix})).join('\n')}
	</svg>`
}


export const Defs = () => {
	return `<defs>
		<marker id="arrow" markerWidth="30" markerHeight="20" refX="9" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
			<path d="M0,0 L0,6 L9,3 z" fill="black" />
		</marker>
	</defs>`
}


export const Endpoint = ({ name, arrowCount, layoutParameters, index }) => {
	const { legendHeight, endpointSpacing, arrowSpacing } = layoutParameters

	const lineHeight = arrowCount * arrowSpacing
	const height = lineHeight + legendHeight * 2
	const width = endpointSpacing
	const viewbox = `${-width / 2} 0 ${width} ${height}`

	return `<svg
		width="${width}" height="${height}"
		viewBox="${viewbox}"
		x="${index * endpointSpacing}" y="${0}"
	>
		<text
			x="${0}"
			y="${legendHeight / 2}"
			text-anchor="middle" dominant-baseline="middle">${name}</text>

		<text
			x="${0}"
			y="${lineHeight + legendHeight + legendHeight / 2}"
			text-anchor="middle" dominant-baseline="middle">${name}</text>

		<line
			x1="${0}" y1="${legendHeight}"
			x2="${0}" y2="${legendHeight + lineHeight}"
			stroke="purple" />
	</svg>`
}


export const Arrow = ({ arrow, endpoints, layoutParameters, index }) => {
	const { legendHeight, annotationHeight, endpointSpacing, endpointOffset, arrowSpacing, arrowOffset } = layoutParameters
	const height = arrowSpacing
	const width = endpointSpacing * endpoints.length
	const viewbox = `0 ${-(height+annotationHeight)/2} ${width} ${arrowSpacing}`

	return `<svg
		width="${width}" height="${arrowSpacing}"
		viewBox="${viewbox}"
		x="${0}" y="${index * arrowSpacing + legendHeight}"
	>
		<line
			x1="${endpoints.indexOf(arrow.from.name) * endpointSpacing + endpointOffset}" y1="${0}"
			x2="${endpoints.indexOf(arrow.to.name) * endpointSpacing + endpointOffset}" y2="${0}"
			stroke="black" stroke-width="1" marker-end="url(#arrow)" />

		${arrow.annotation !== undefined && `<text
			x="${(endpoints.indexOf(arrow.from.name) + endpoints.indexOf(arrow.to.name)) / 2 * endpointSpacing + endpointSpacing / 2}"
			y="${-annotationHeight / 2}"
			text-anchor="middle" dominant-baseline="middle">${arrow.annotation}</text>`}

	</svg>`
}
