# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**Recipes** is a full-stack recipes and shopping list management app.
The project is Swedish-oriented (UI text, comments, and documentation are in Swedish).
The project is used to learn react and the purpose of the documentation should consider that.
Use well known best practices when building components in the react frontend and use well established patterns in the backend.

## Stack

Nx monorepo with:
- **Frontend**: React — `apps/recipes-frontend/` (`@recipes/recipes-frontend`)
- **Backend**: Node.js / Express — `apps/backend/` (`@recipes/backend`)
- **Shared UI**: component library — `libs/shared-ui/` (`@recipes/shared-ui`)
- **Containers**: Podman (replaces Docker for local dev and CI)

## Common commands

```bash
# Install dependencies
yarn install

# Serve frontend / backend in dev mode
yarn nx serve @recipes/recipes-frontend
yarn nx serve @recipes/backend

# Build
yarn nx build @recipes/recipes-frontend
yarn nx build @recipes/backend

# Run all tests
yarn nx run-many --target=test --all

# Run tests for a single project
yarn nx test @recipes/recipes-frontend
yarn nx test @recipes/backend
yarn nx test @recipes/shared-ui

# Run a single test file
yarn nx test @recipes/recipes-frontend --testFile=path/to/file.spec.ts

# Lint a project
yarn nx lint @recipes/recipes-frontend

# See the project dependency graph
yarn nx graph
```

## Nx project layout

Projects are declared in `project.json` files (or `package.json` with `nx` field) within each app/lib directory. Use `yarn nx show projects` to list all projects. Affected commands (`yarn nx affected:test`, `yarn nx affected:build`) scope work to changes since the base branch.

## Podman

Podman is used in place of Docker. Use `podman` (or `podman-compose`) instead of `docker`/`docker-compose` for starting services locally. Compose files are typically `podman-compose.yml` or `docker-compose.yml` (compatible with Podman).

```bash
podman-compose up -d      # start backing services
podman-compose down       # stop and remove containers
podman ps                 # list running containers
```

## Context Navigation (Graphify)

### 3-Layer Query Rule
1. **First:** query `graphify-out/graph.json` or `graphify-out/wiki/index.md`
   to understand code structure and connections
2. **Second:** query the Obsidian vault for decisions, progress, and project context
3. **Third:** only read raw code files when editing
   or when the first two layers don't have the answer

### When to rebuild the graph
- After structural changes (new modules, major refactors)
- Command: `graphify . --update` (only processes modified files)
- The graph is persistent — NO need to rebuild every session

### Do NOT
- Don't manually modify files inside `graphify-out/`
- Don't re-read the entire codebase if the graph already has the information

## Knowledge base
Vault path: ~/Library/Mobile Documents/iCloud~md~obsidian/Documents/claud-memory
Project folder in vault: Recipes/
Session logs path: Recipes/logs/

Use /save to persist session decisions to the vault. **Session logs must be saved to `Recipes/logs/` — not the vault root `logs/`.**
Use /resume to restore context from the `Recipes/logs/` at session start.
Use /graphify to generate a code graph for this project.
