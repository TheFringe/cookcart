# Graph Report - 10.05_recipes  (2026-05-14)

## Corpus Check
- 1 files · ~224 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 8 nodes · 7 edges · 3 communities (0 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `Common commands` - 2 edges
2. `Podman` - 2 edges
3. `Stack` - 1 edges
4. `code:bash (# Install dependencies)` - 1 edges
5. `Nx project layout` - 1 edges
6. `code:bash (podman-compose up -d      # start backing services)` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (3 total, 3 thin omitted)

## Knowledge Gaps
- **4 isolated node(s):** `Stack`, `code:bash (# Install dependencies)`, `Nx project layout`, `code:bash (podman-compose up -d      # start backing services)`
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Common commands` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **Why does `Podman` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **What connects `Stack`, `code:bash (# Install dependencies)`, `Nx project layout` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._