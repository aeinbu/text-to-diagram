import { createElement, StatelessProps } from "tsx-create-element";
import { CreateDiagram as CreateSequenceDiagram } from "./SequenceDiagram/CreateDiagram"
import { CreatePlayground } from "./Playground/CreatePlayground"
import sequenceDiagramData from "./SequenceDiagram/sample.json"

const incomingText = `
client (first) -> server [top]
server -> remote site [first request]
server -> logger (last) [third]
remote site -> server
server -> remote site [second request]
remote site -> server
server -> other remote site [fourth]
other remote site -> server
server -> client
server -> logger
dill -> dall [hallo]
client -> remote site
`

document.body.appendChild(<>
	<h1>Sequence diagram</h1>
	<CreateSequenceDiagram data={sequenceDiagramData} />
</>)
