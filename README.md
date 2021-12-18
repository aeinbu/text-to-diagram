# Text-to-diagrams

Lighweight diagram viewer for a textual diagram modeling language.

## Sequence diagrams

```
client -> server
server -> remote site [first request]
remote site -> server
server -> remote site [second request]
remote site -> server
server -> other remote site
other remote site -> server
server -> client
client -> remote site
```

## Database diagrams

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
