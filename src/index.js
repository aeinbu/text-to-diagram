import { createElement, StatelessProps } from "tsx-create-element";
import { CreateDiagram as CreateSequenceDiagram } from "./SequenceDiagram/CreateDiagram"
import { CreatePlayground } from "./Playground/CreatePlayground"
import {parse} from "./SequenceDiagram/parse"

const incomingText = `
client (first) -> server
server -> remote site [first request]
server -> logger (last)
remote site -> server
server -> remote site [second request]
remote site -> server
server -> other remote site [third request]
other remote site -> server
server -> client
server -> logger
client -> remote site
`

document.body.appendChild(<>
	<h1>Sequence diagram</h1>
	<CreateSequenceDiagram data={parse(incomingText)} />
</>)
