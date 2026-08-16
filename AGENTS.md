# AGENTS.md

## Cursor Cloud specific instructions

This monorepo (**OrquestIA-MX**) is mostly Markdown/prompt content for Cursor AI agents. The only fully runnable in-repo application is **Centro de Trazabilidad**.

### Centro de Trazabilidad (runnable app)

Node.js/Express + static frontend traceability visualizer. Lives in `Centro-Trazabilidad/`.

- Run (dev): `npm run demo --prefix Centro-Trazabilidad` seeds demo data (`herramientas/sembrar-demo.js`) and starts the server. Use `npm run inicio --prefix Centro-Trazabilidad` to start the server without re-seeding.
- Serves on port `4177` (override with the `PUERTO` env var). Open `http://localhost:4177`.
- Standard scripts are in `Centro-Trazabilidad/package.json` (`inicio`, `demo`, `sembrar`, `registrar`). There are no lint or automated test scripts for this app.
- Data lives in `Centro-Trazabilidad/datos/{proyecto}/eventos.jsonl`. The server watches these files with `chokidar` and pushes changes over SSE (`GET /api/stream`).
- Register an event from the terminal: `node herramientas/registrar-evento.js --archivo plantillas/evento-traza.ejemplo.json` (add `--via api` to POST to a running server).

Gotcha: running `npm run demo` (or `npm run sembrar`) rewrites `Centro-Trazabilidad/datos/laborregamarket/eventos.jsonl` (committed demo data). Do NOT commit those regenerated/seed changes — restore with `git checkout -- Centro-Trazabilidad/datos/laborregamarket/eventos.jsonl` if needed.

### LaBorregaMarket QA suite (NOT runnable end-to-end here)

`QA Automation Engineer/Agente Tester/outputs/laborregamarket/tests/` contains a Playwright suite for a reference project. The application under test (**LaBorregaMarket**, a Next.js app) is an EXTERNAL repository that is not present in this monorepo, and it also requires PostgreSQL. These tests cannot run end-to-end from this repo alone; they need the external app running on `http://localhost:3000` plus a seeded database. Treat this suite as out of scope for in-repo dev unless the external app is provided.

### Agent roles

The top-level folders (`Administrador de producto`, `Agente backend`, etc.) are Cursor skill/prompt definitions, not runnable services. They have no build/run step.
