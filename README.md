# FieldMind — The AI Memory for Every Machine

> *"Every machine has a history. FieldMind remembers it."*

FieldMind is an enterprise-grade AI-powered industrial maintenance memory system built to solve a critical manufacturing challenge: **the loss of machine-specific operational experience when technicians change shifts or when past repair outcomes are buried in static work orders.**

By pairing a structured relational database (PostgreSQL/Prisma) with persistent memory retained in **Hindsight**, FieldMind empowers maintenance engineers and technicians with evidence-backed decision support grounded in real physical machine history.

---

## 🚀 Key Features

- **⚡ Hero Machine Narrative (`PUMP-042`):** Coherent historical narrative comparing an alignment fix attempt (which failed after 4 days) against a drive-end bearing replacement with **SKF-6314-2RS** (which resolved vibration for 146 days).
- **🧠 Hindsight Persistent Memory Integration:** Seamlessly interfaces with the Hindsight Memory API to retain technician observations and recall machine experiences.
- **👁️ Without Memory vs. With Memory Mode:** Side-by-side comparison mode contrasting generic LLM advice against FieldMind's evidence-backed reasoning.
- **🛡️ "Why FieldMind Knows This" Evidence Layer:** Transparent line-of-sight drawer displaying exact database records (incidents, dates, technicians, parts used, outcomes) and memory relevance scores.
- **🎮 Guided 10-Step Interactive Hero Demo:** Built-in interactive wizard for hackathon live demonstrations.
- **📊 Industrial Maintenance Analytics:** Interactive charts powered by Recharts (Intervention Effectiveness, Incidents by Machine, Top Replaced Spare Parts).
- **🔄 One-Click Demo Reset:** Instantly restore baseline demo data for `PUMP-042`.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons, Glassmorphism UI
- **Database & ORM:** Prisma ORM, PostgreSQL (SQLite for local zero-config demo execution)
- **AI & Memory:** Controlled Tool Orchestrator, Hindsight Memory SDK / REST API
- **Analytics:** Recharts

---

## 📋 Prerequisites & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/vinayvuyyuru7-prog/FieldMind.git
cd FieldMind
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` or update `.env`:
```env
DATABASE_URL="file:./dev.db"
HINDSIGHT_ENDPOINT="https://api.hindsight.ai"
HINDSIGHT_API_KEY="mock-hindsight-key-for-demo"
HINDSIGHT_BANK_ID="fieldmind-pumps"
```

### 3. Seed Database & Start Development Server
```bash
# Initialize SQLite database and seed 50 machines + PUMP-042 hero narrative
npm run db:seed

# Launch Next.js local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🕹️ Running the Hackathon Demo

1. Click **`RUN MEMORY DEMO`** in the header navigation bar.
2. Follow the guided 10-step wizard to walk through:
   - *Without Memory* baseline failure
   - Recording technician experience
   - Simulating a future incident 146 days later
   - *With FieldMind Memory* evidence-backed response
   - Transparent evidence chain verification

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/machines` | Search and filter machine registry |
| `GET` | `/api/machines/[id]` | Fetch detailed machine history & incidents |
| `POST` | `/api/incidents` | Report a new machine fault incident |
| `POST` | `/api/incidents/[id]/interventions` | Record maintenance action taken |
| `POST` | `/api/interventions/[id]/outcome` | Finalize intervention outcome & retain memory |
| `POST` | `/api/memory/retain` | Retain new machine experience in Hindsight |
| `POST` | `/api/memory/recall` | Retrieve persistent memories for machine query |
| `POST` | `/api/agent/query` | Execute evidence-backed AI agent reasoning |
| `POST` | `/api/demo/reset` | Reset demo baseline data for `PUMP-042` |

---

## 📜 License

MIT License — Created for the AI Agent & Persistent Memory Hackathon.