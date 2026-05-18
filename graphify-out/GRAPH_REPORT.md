# Graph Report - 10.05_recipes  (2026-05-18)

## Corpus Check
- 28 files · ~4,970 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 56 nodes · 39 edges · 20 communities (18 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c43d44d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `Docker dev` - 4 edges
2. `Kom igång` - 4 edges
3. `Context Navigation (Graphify)` - 4 edges
4. `Tjänster` - 3 edges
5. `shared-ui` - 3 edges
6. `Anslutningssträng för backend` - 2 edges
7. `Stoppa` - 2 edges
8. `Common commands` - 2 edges
9. `Podman` - 2 edges
10. `sharedUi()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (20 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.2
Nodes (8): code:bash (# Install dependencies), code:bash (podman-compose up -d      # start backing services), Common commands, Knowledge base, Nx project layout, Podman, Project Overview, Stack

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (3): { baseElement }, { getAllByText }, root

### Community 2 - "Community 2"
Cohesion: 0.25
Nodes (7): code:bash (cp docker-dev/.env.template docker-dev/.env), code:bash (podman-compose -f docker-dev/docker-compose.yml up -d), code:bash (yarn nx serve @recipes/recipes-frontend), code:bash (podman-compose -f docker-dev/docker-compose.yml down), Docker dev, Kom igång, Stoppa

### Community 3 - "Community 3"
Cohesion: 0.5
Nodes (4): Anslut pgAdmin till databasen, Anslutningssträng för backend, code:block4 (postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5), Tjänster

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (4): 3-Layer Query Rule, Context Navigation (Graphify), Do NOT, When to rebuild the graph

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (3): Building, Running unit tests, shared-ui

## Knowledge Gaps
- **21 isolated node(s):** `code:bash (cp docker-dev/.env.template docker-dev/.env)`, `code:bash (podman-compose -f docker-dev/docker-compose.yml up -d)`, `code:bash (yarn nx serve @recipes/recipes-frontend)`, `Anslut pgAdmin till databasen`, `code:block4 (postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5)` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Docker dev` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Context Navigation (Graphify)` connect `Community 4` to `Community 0`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `code:bash (cp docker-dev/.env.template docker-dev/.env)`, `code:bash (podman-compose -f docker-dev/docker-compose.yml up -d)`, `code:bash (yarn nx serve @recipes/recipes-frontend)` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._