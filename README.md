# Text-to-diagram

Lighweight diagram viewer for a textual diagram modeling language.
- since diagram sources are stored as text, they are git friendly

## Sequence diagrams
Suggested format:
```
 -> server [request]
server -> database [fetch data]
database (end) -> server
server -> logger (always)
server -> database [fetch data]
database (end) -> server
server -> logger
server ->  [response]
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
