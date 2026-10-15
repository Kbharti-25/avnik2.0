# Anvik

> **PS 16 — UPI Fraud-Ring Graph Investigator**  
> *Code-e-Manipal Hackathon Project*

---

## 1. Project Identity and Objective

**Anvik** is an investigative decision-support system designed to detect and explore coordinated UPI fraud patterns across interconnected synthetic transaction entities (accounts, devices, merchants, and complaints).

Anvik constructs a graph of synthetic financial interactions to surface explainable, evidence-backed transaction clusters, timeline anomalies, and counterfactual insights for fraud analysts and investigators.

> [!IMPORTANT]
> **Investigative Decision Support Only**: Anvik is an analytical aid for investigators, not an automated system for declaring individuals guilty. Suspicious alerts and graph anomalies represent investigative leads, not legal proof of wrongdoing.

> [!NOTE]
> **Synthetic Data Policy**: Anvik exclusively operates on synthetic transaction datasets. It does not connect to real banking infrastructure, payment gateways, or live customer financial records.

---

## 2. Planned Features

- **Interactive Transaction Graphs**: Dynamic exploration of accounts, devices, merchants, and transactions using Cytoscape.js.
- **Evidence-Linked Alerts**: Transparent priority scoring that explains why a pattern was flagged with exact supporting evidence.
- **Transaction Timelines**: Visual chronological progression of transactions, identifying rapid dispersion or cycling.
- **Complaint Associations**: Linking formal complaints and dispute reports to transaction entities and clusters.
- **Explainable Detection Rules**: Deterministic rules identifying structuring, shared device misuse, mule routing, and circular funds.
- **Counterfactual Analysis**: Investigating hypothetical scenarios (e.g., removing a bridge node or modifying a link) to evaluate cluster fragility.
- **Case Management**: Workflow tools to track ongoing investigations, bookmark entities, and record analyst findings.

---

## 3. Planned Technology Stack

### Frontend (Owned by Members 1 & 2)
- **Framework & Language**: React 18 / TypeScript
- **Tooling & Build**: Vite
- **Styling & UI**: Tailwind CSS, shadcn/ui, Lucide React
- **Routing**: React Router
- **Graph Visualization**: Cytoscape.js
- **Testing**: Vitest, React Testing Library

### Backend (Owned by Bharath)
- **Language & Runtime**: Python 3.11+
- **API Framework**: FastAPI, Uvicorn, Pydantic
- **Database & ORM**: PostgreSQL, SQLAlchemy, Alembic
- **Graph Engine & Processing**: NetworkX, Pandas, NumPy
- **Testing & Verification**: pytest, HTTPX

*(Note: These technologies represent planned architectural choices. Application code has not yet been built in this initialization phase.)*

---

## 4. Current Development Status

**Status: Repository Initialization Phase.**

The project structure, development guidelines, ownership boundaries, and empty documentation scaffolds have been created. No frontend or backend application code is active in this phase.

---

## 5. Team Ownership & Responsibilities

The Anvik project is developed by a 6-member team with clear ownership boundaries:

### Member 1 — Frontend Development and UI/UX
- React and TypeScript application interface.
- Dashboard layout, navigation, and reusable UI components.
- Complaint intake forms and transaction tables.
- Responsive design, visual consistency, and UI state handling (loading/empty/error).
- Frontend integration with backend APIs.

### Member 2 — Graph Visualization and Investigation Interface
- Interactive graph visualization using Cytoscape.js.
- Graph modeling for accounts, devices, transactions, merchants, and complaints.
- Node/edge interactions, zooming, panning, selection, and filtering.
- Highlighting suspicious paths and related evidence trails.
- Usability, performance, and responsive graph rendering.

### Member 3 — Bharath: Backend, Database and Fraud Detection
- **Sole owner of the entire backend and detection engine.**
- PostgreSQL schema, persistence, and Alembic migrations.
- FastAPI endpoints and Pydantic request/response schemas.
- Data validation and synthetic dataset import services.
- Graph construction and analysis using NetworkX.
- Rule-based detection of suspicious transaction patterns.
- Evidence-linked alerts and explainable priority scoring.
- Transaction timelines, complaint associations, and investigation case APIs.
- Counterfactual analysis engine.
- Backend unit/integration tests and backend deployment.

### Member 4 — Data Engineering, Testing and QA
- Synthetic dataset generation (accounts, devices, merchants, transactions, complaints).
- Planting known suspicious patterns and legitimate lookalike control scenarios.
- Ground-truth labeling and expected outcome matrices.
- Verification of API contracts, data integrity, detection accuracy, and false positives.
- Coordination with Bharath on data schemas and evaluation metrics.

### Member 5 — Integration, Case Management and Deployment Coordination
- Cross-team repository integration and merge coordination.
- API contract alignment between frontend and backend.
- Case-management workflow integration with Member 1.
- Conflict resolution and end-to-end integration verification.
- Deployment configuration coordination.

### Member 6 — Demo, Presentation and Deployment Coordination
- Realistic synthetic demonstration scenarios and walkthrough scripts.
- Presentation slide deck, architecture diagrams, and visuals.
- Demonstration rehearsals and final verification.
- Coordination of deployment checks and submission deliverables.

---

## 6. Proposed Development Sequence

1. **Phase 1: Repository Initialization & Ownership (Current)** — Establish git hygiene, documentation scaffold, and project instructions.
2. **Phase 2: Data Engineering & API Contract Specification** — Define synthetic data formats, ground-truth patterns, and Pydantic/OpenAPI contracts.
3. **Phase 3: Backend Core & Detection Engine** — Database schema, NetworkX graph engine, and detection rule implementation (Bharath).
4. **Phase 4: Frontend Core & Graph Interface** — UI shell, tables, forms (Member 1), and Cytoscape.js visualization canvas (Member 2).
5. **Phase 5: Integration & Case Management** — Connecting frontend to backend APIs and validating end-to-end flows (Member 5 & Team).
6. **Phase 6: QA, Evaluation & Demonstration Prep** — Benchmark detection accuracy, conduct user walkthrough rehearsals, and deploy (Member 4, 6 & Team).
