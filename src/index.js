import { createElement, StatelessProps } from "tsx-create-element";
import { CreateDiagram as CreateSequenceDiagram } from "./SequenceDiagram/CreateDiagram"
import { CreatePlayground } from "./Playground/CreatePlayground"
import { parse } from "./SequenceDiagram/parse"

const incomingText = `
client -> server
server -> database [fetch data]
database (end) -> server
server -> logger (always)
server -> database [fetch data]
database (end) -> server
server -> logger
server -> client

`
console.log("---", parse(incomingText))

document.body.appendChild(<>
	<h1>Sequence diagram</h1>
	<CreateSequenceDiagram data={parse(incomingText)} />
</>)
