import { createElement, StatelessProps } from "tsx-create-element";
import { CreateDiagram as CreateSequenceDiagram } from "./SequenceDiagram/CreateDiagram"
import sequenceDiagramData from "./SequenceDiagram/sample.json"


// TODO: Load and parse data at runtime
document.body.appendChild(<>
	<h1>Sequence diagram</h1>
	<CreateSequenceDiagram data={sequenceDiagramData} />
</>)