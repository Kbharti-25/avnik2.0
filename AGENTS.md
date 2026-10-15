# AGENTS.md — Project-Wide Agent & Contributor Rules

These rules govern all AI coding assistants and contributors working on the **Anvik** repository.

---

## 1. Context & Review Before Action
1. Read `README.md` and `AGENTS.md` thoroughly before planning or executing any changes.
2. Inspect existing code, repository layout, and Git status before modifying or creating files.
3. Preserve existing work. Do not delete or overwrite work from other team members without explicit authorization.

## 2. Team Ownership & Boundaries
4. **Respect the 6-member ownership structure**:
   - **Member 1**: Frontend Development and UI/UX.
   - **Member 2**: Graph Visualization and Investigation Interface (Cytoscape.js).
   - **Member 3 (Bharath)**: **Sole owner of the entire backend and detection engine** (Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, NetworkX, detection rules, alert scoring, counterfactual analysis).
   - **Member 4**: Synthetic Data Engineering, Testing and QA.
   - **Member 5**: Integration, Case Management and Deployment Coordination.
   - **Member 6**: Demo, Presentation and Deployment Coordination.
5. **Strict Backend Ownership**: Bharath owns all backend implementation. Never assign backend tasks to another member, and never generate backend code unless requested specifically by Bharath for his backend tasks.
6. **Strict Frontend Ownership**: Members 1 and 2 own frontend implementation. Frontend mocks should be used until Bharath's backend APIs are ready.
7. Coordinate shared interfaces, schemas, and API contracts across members before introducing breaking changes.

## 3. Scope & Phase Discipline
8. **Phase 1 Discipline**: Do not generate frontend or backend application code during repository initialization.
9. **Documentation Scaffold**: Keep all `docs/*.md` files empty (zero bytes) until the team explicitly begins the documentation phase.
10. Do not introduce major architectural shifts, unvetted frameworks, or unnecessary dependencies without clear justification and team alignment.

## 4. Security & Data Integrity
11. **Synthetic Data Only**: Use synthetic data exclusively for testing, development, and demonstrations.
12. **Zero Credentials**: Never commit secrets, API keys, passwords, live financial identifiers, or personal data.
13. Keep suspicious-pattern alerts explainable, transparent, and evidence-linked.
14. Anvik is an investigative decision-support system: do not treat shared device identifiers, IP links, or complaint records as conclusive proof of fraud or guilt.

## 5. Development Quality & Verification
15. Make small, atomic, easily reviewable changes.
16. Run relevant unit and integration tests prior to reporting implementation completion.
17. Never fabricate or hallucinate test outcomes, build statuses, deployment states, or Git push results.
18. Record meaningful AI-assisted development activities in `docs/AI_ACTIVITY_LOG.md` once the team begins maintaining it. (Leave it zero-byte until then).
