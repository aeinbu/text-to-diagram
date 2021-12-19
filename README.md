# Text-to-diagrams

Lighweight diagram viewer for a textual diagram modeling language.
- since diagram sources are stored as text, they are git friendly

## Sequence diagrams
Suggested format:
```
client (first) -> server
server -> remote site [first request]
server -> logger (last)
remote site -> server
server -> remote site [second request]
remote site -> server
server -> other remote site
other remote site -> server
server -> client
server -> logger
client -> remote site
```

## Relational diagrams (Database)
Suggested format:
```
Table: users
Column: id
Column: name
Column: email
Column: password
Relation: many user to one departments

Table: departments
Column: id
Column: name
Column: description
Relation: one department to many users
```
