const fontSize = 15
const fontFamily = "sans-serif"
const annotationHeight = 20
const endpointSpacing = 120
const endpointOffset = endpointSpacing / 2
const arrowSpacing = annotationHeight + 20
const arrowOffset = arrowSpacing / 2

export const layoutParameters = {
	fontSize,
	fontFamily,
	annotationHeight,	// height of annotation text
	endpointSpacing,	// horizontal spacing between endpoint lines
	endpointOffset,		// horizontal spacing before the first endpoint line
	arrowSpacing,		// vertical spacing between arrows
	arrowOffset			// vertical spacing before the first arrow
}