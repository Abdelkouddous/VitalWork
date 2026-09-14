# VitalWork 🏥

### Enterprise Healthcare Recruitment Platform (MERN Stack Community MVP)

VitalWork is a mission-critical, HIPAA/GDPR-aligned recruitment engine designed exclusively for clinical environments (hospitals, clinics, medical centers, and specialized care facilities). By replacing generic, high-noise job boards with specialized, role-based workflows and clinical taxonomies, VitalWork facilitates high-fidelity matches between clinics and healthcare professionals.

---

## 1. Executive Summary & System Context

VitalWork operates as a centralized hub bridging the gap between three key actors in the medical ecosystem: **Healthcare Professionals** (Doctors, Nurses, Therapists, Allied Health, Pharmacists), **Clinics** (represented by Clinic Administrators / Hiring Managers), and platform **Admins** who oversee system consistency, credentials, and access.

The platform is architected around a secure, role-restricted RESTful API, persistent WebSocket channels for real-time messaging, and secure external storage for credentials and CV validation.

The system context diagram below illustrates the external boundaries and structural interfaces of the VitalWork platform.

### System Context Diagram

```mermaid
flowchart LR
    ClinicAdmin["Clinic Admin / Hiring Manager\n(Browser / Client)"]
    Professional["Healthcare Professional\n(Browser / Client)"]
    SysAdmin["System Admin\n(Browser / Client)"]
  
    subgraph VitalWorkSystem["VitalWork Core Application"]
        API["Express.js HTTP Web Server\n(Routing & Controller Layers)"]
        WS["Socket.io Server\n(Stateful WS Gateway)"]
    end
  
    Database[(MongoDB Database\nCluster)]
    CloudinaryStorage["Cloudinary CDN\n(Document/CV Storage)"]
  
    ClinicAdmin -->|HTTPS / API Requests| API
    ClinicAdmin -.->|WebSocket / Duplex State| WS
    Professional -->|HTTPS / API Requests| API
    Professional -.->|WebSocket / Duplex State| WS
    SysAdmin -->|HTTPS / Admin API Requests| API
  
    API -->|Mongoose ODM| Database
    API -.->|Secure Upload SDK| CloudinaryStorage
```

### Data Flow Diagram (DFD) Level 0

The high-level data interfaces and boundary transformations are illustrated in the diagram below:

![Data Flow Diagram Level 0](docs/diagrams/DFDs/DFD_lvl0.png)

---

## 2. Multi-Tiered System Architecture

VitalWork utilizes a **3-Tier MVC Architecture** decoupled across presentation, application, and data layers to isolate concerns, maintain performance under concurrent usage, and secure healthcare datasets.

```mermaid
flowchart TD
    subgraph Tier1["Tier 1: Presentation Layer (React Client)"]
        SPA["React SPA (Vite Runtime)"]
        State["React Query / Local State"]
        UI["Material-UI (MUI) & Tailwind CSS"]
        WSClient["Socket.io-client Gateway"]
    end

    subgraph Tier2["Tier 2: Application Layer (Express Server)"]
        direction TB
        Route["Express Routers\n(API Endpoints)"]
        AuthMW["Security Middleware\n(JWT Check & RBAC)"]
        ValMW["Validation Middleware\n(Express-Validator)"]
        Controllers["Controller Layer\n(Business Logic Execution)"]
        WSManager["Socket.io Event Dispatcher"]
    end

    subgraph Tier3["Tier 3: Data Tier (Persistence & Storage)"]
        Mongoose["Mongoose ODM Models"]
        MongoDB[(MongoDB Cluster)]
        Cloudinary["Cloudinary Cloud Object Storage"]
    end

    SPA -->|HTTPS REST Queries| Route
    WSClient -->|Persistent WSS Protocol| WSManager
    Route --> AuthMW --> ValMW --> Controllers
    Controllers --> Mongoose --> MongoDB
    Controllers -->|Signed Media Stream| Cloudinary
```

### Architectural Component Roles:

1. **Presentation Layer (React 18 / Vite)**: A single-page application (SPA) optimized for client-side performance. It leverages **React Query** for declarative, zero-boilerplate data fetching, caching, and state synchronization, alongside **Framer Motion** for micro-animations and **Material-UI** for layouts.
2. **Application Layer (Node.js / Express)**: Runs an event-driven, non-blocking I/O server. Routes are protected by a chain of middleware covering authentication, role-based authorization (RBAC) supporting Healthcare Professionals, Clinics, and Admins, and sanitization. Live messaging state transitions are managed in-process using **Socket.io**.
3. **Data Tier (MongoDB / Cloudinary)**: Utilizes MongoDB via Mongoose ODM for document persistence. External resources (such as medical licenses, CV uploads, and certificates) are written to Cloudinary's secure content delivery network.

---

## 3. High-Fidelity Data Flow (DFD Level 1)

At the functional level, VitalWork isolates Healthcare Professional ingestion, credential upload, job placement, and application reviews. The detailed data transformations, storage writes, and state updates are visualized in the DFD Level 1 diagram below.

### Detailed System Data Flow (DFD Level 1)

![Data Flow Diagram Level 1](docs/diagrams/DFDs/DFD_lvl1.png)

### Core Healthcare Professional Hiring Funnel

The diagram below details the operational stages and decision paths of a Healthcare Professional's application submission and review workflow:

![Healthcare Professional Application Flow](<docs/diagrams/Concepts/Job%20Application-2026-02-25-223846.png>)

---

## 4. Domain Model & Relational Schema Design

To ensure relational consistency inside a NoSQL document database, VitalWork models its schemas with explicit references (`Schema.Types.ObjectId`) and enforces strict field type safety. Below is the Entity-Relationship Diagram (ERD) defining the schema boundaries.

### Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string email
        string password
        string role
        date createdAt
    }
    CLINIC {
        ObjectId _id PK
        ObjectId user_id FK
        string clinicName
        string clinicLocation
        string description
        string website
    }
    HEALTHCARE_PROFESSIONAL {
        ObjectId _id PK
        ObjectId user_id FK
        string name
        string lastName
        string specialization
        string activeCvUrl
        array certifications
    }
    ADMIN {
        ObjectId _id PK
        ObjectId user_id FK
        string adminLevel
        date assignedAt
    }
    JOB {
        ObjectId _id PK
        ObjectId clinic_id FK
        string position
        string clinicName
        string jobLocation
        string jobType
        string jobStatus
        string specialization
        string jobDescription
        date createdAt
    }
    APPLICATION {
        ObjectId _id PK
        ObjectId job_id FK
        ObjectId healthcareProfessional_id FK
        string status
        int compatibilityScore
        date submittedAt
    }
    CV {
        ObjectId _id PK
        ObjectId healthcareProfessional_id FK
        string cvName
        string cvUrl
        string publicId
        date uploadedAt
    }
    CONVERSATION {
        ObjectId _id PK
        ObjectId clinic_id FK
        ObjectId healthcareProfessional_id FK
        ObjectId job_id FK
        date createdAt
    }
    MESSAGE {
        ObjectId _id PK
        ObjectId conversation_id FK
        ObjectId sender_id FK
        string content
        boolean isRead
        date createdAt
    }
    NOTIFICATION {
        ObjectId _id PK
        ObjectId recipient_id FK
        string type
        string message
        boolean isRead
        date createdAt
    }

    USER ||--|| CLINIC : "extends (Role: clinic)"
    USER ||--|| HEALTHCARE_PROFESSIONAL : "extends (Role: healthcare_professional)"
    USER ||--|| ADMIN : "extends (Role: admin)"
  
    CLINIC ||--o{ JOB : "publishes"
    HEALTHCARE_PROFESSIONAL ||--o{ APPLICATION : "submits"
    JOB ||--o{ APPLICATION : "receives"
    HEALTHCARE_PROFESSIONAL ||--o{ CV : "uploads"
    CLINIC ||--o{ CONVERSATION : "originates"
    HEALTHCARE_PROFESSIONAL ||--o{ CONVERSATION : "accepts"
    JOB ||--o{ CONVERSATION : "contextualizes"
    CONVERSATION ||--o{ MESSAGE : "contains"
    USER ||--o{ MESSAGE : "sends"
    USER ||--o{ NOTIFICATION : "receives"
```

---

## 5. Security & Authentication Architecture

VitalWork implements a **stateless, cookie-based token validation model** to secure interactions and prevent unauthorized access.

### JWT & Role-Based Access Control Flow

1. **Authentication Handshake**: Upon authentication, the backend generates a JSON Web Token (JWT) containing `{ userId, role }` signed with a server-side secret using HMAC SHA-256.
2. **Secure Transmission**: The JWT is appended to the response header as an **HTTP-Only, Secure, SameSite=Lax** cookie named `token`. This mitigates client-side Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) attack vectors.
3. **Authorization Evaluation**: Incoming requests flow through an authorization pipeline that verifies permissions against the RBAC matrix supporting Healthcare Professionals, Clinics, and Admins.

### Authentication and Request Processing Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Browser)
    participant API as Express API Server
    participant DB as MongoDB Cluster
  
    User->>API: POST /api/v1/auth/login [Email & Password]
    API->>DB: Query User document by Email
    DB-->>API: User Data (Hashed Password)
    API->>API: Verify Password via Bcrypt
  
    alt Credentials Invalid
        API-->>User: 401 Unauthorized [Generic Message]
    else Credentials Valid
        API->>API: Generate JWT (Payload: userId, role)
        API-->>User: 200 OK (HTTP-Only Cookie: token)
    end
  
    Note over User, API: Authenticated API Requests
  
    User->>API: GET /api/v1/jobs/my-postings (Cookie Included)
    API->>API: authenticateUser Middleware (Decrypt Cookie)
    API->>API: authorizePermissions('clinic') Middleware
  
    alt Permission Denied
        API-->>User: 403 Forbidden
    else Permission Approved
        API->>DB: Query Jobs where clinic_id = userId
        DB-->>API: Matching Job Documents
        API-->>User: 200 OK [JSON Payload]
    end
```

### RBAC Matrix

| Endpoint / Resource                                           | Guest User | Healthcare Professional Role |   Clinic Role   | Admin Role |
| :------------------------------------------------------------ | :--------: | :--------------------------: | :--------------: | :--------: |
| **GET `/api/v1/jobs` (Public Listings)**              |  ✅ Read  |           ✅ Read           |     ✅ Read     |  ✅ Read  |
| **POST `/api/v1/jobs` (Create Listing)**              | ❌ Denied |          ❌ Denied          |     ✅ Write     |  ✅ Write  |
| **POST `/api/v1/healthcare-professionals/apply/:id`** | ❌ Denied |           ✅ Write           |    ❌ Denied    | ❌ Denied |
| **GET `/api/v1/clinics/applications`**                | ❌ Denied |          ❌ Denied          |     ✅ Read     |  ✅ Read  |
| **POST `/api/v1/cv/upload`**                          | ❌ Denied |           ✅ Write           |    ❌ Denied    | ❌ Denied |
| **DELETE `/api/v1/jobs/:id`**                         | ❌ Denied |          ❌ Denied          | ✅ Write (Owner) |  ✅ Write  |

---

## 6. Enterprise Compliance Protocols (HIPAA, GDPR & NHS DSPT)

Operating in healthcare recruitment mandates strict adherence to data privacy regulations. The community MVP integrates architectural boundaries to meet these standards:

### 1. HIPAA Compliance (Health Insurance Portability and Accountability Act)

* **Access Control**: User identities are securely verified via token authentication. Access is strictly granted through the RBAC matrix to ensure Healthcare Professionals and Clinics can only view records for which they have authorization.
* **Data in Transit Security**: All network transport channels are encrypted using Transport Layer Security (TLS 1.2 / TLS 1.3). No plain-text endpoints are exposed.
* **Data at Rest Security**: Passwords are secure-hashed using **Bcrypt (10 salt rounds)**. Integration configurations use standard environment parameters, ensuring no database keys, secrets, or configuration values are hardcoded in the codebase.
* **Audit Logging**: The Express backend uses structured middleware (logging via `morgan` in development, integrated with system logs) to track user logins, profile creations, job postings, and CV access logs.

### 2. GDPR Compliance (General Data Protection Regulation)

* **The Right to Erasure (Article 17)**: Deleting a Healthcare Professional profile initiates a clean database cascade, removing related CV references and applications.
* **Purpose Limitation & Data Minimization (Article 5)**: Ingestion schemas only store fields directly necessary for credential verification and clinical screening.
* **Secure Document Lifecycles**: Uploaded CVs are handled via Multer and transmitted to Cloudinary. In production, these links use signed URLs with brief expiration limits to ensure documents cannot be accessed publicly.

### 3. NHS Data Security and Protection Toolkit (DSPT) Alignment

* **Credibility & Verification**: Healthcare Professional profiles capture critical verification parameters (medical license registration IDs, clinical specializations, certifications).
* **Zero-Trust Networking**: Public exposure is limited. Routes that return profiles and user listings are bound by roles, preventing public scraping of clinical talent datasets.

---

## 7. Project Structure & Dependency Graph

```
VitalWork/
├── apps/
│   ├── api-v1-community/       # Core MERN Backend Engine
│   │   ├── controllers/        # Request Handlers
│   │   ├── models/             # Mongoose Schemas (MongoDB)
│   │   ├── middleware/         # Auth, RBAC, and error pipelines
│   │   ├── routes/             # REST Endpoints mapping
│   │   ├── utils/              # Token signers, Cloudinary utilities
│   │   ├── server.js           # Server Initialization
│   │   └── seed.js             # Mock database seeder
│   └── client/                 # React + Vite Presentation SPA
│       ├── src/
│       │   ├── components/     # UI elements
│       │   ├── pages/          # Layouts & routing entrypoints
│       │   ├── utils/          # Axios wrappers
│       │   └── index.css       # Core Design Tokens
│       ├── package.json        # Frontend specific packages
│       └── vite.config.js      # Vite build configurations
├── docs/                       # System Architecture & Diagrams
├── tests/                      # Automated Test Suite (Integration & Unit)
├── package.json                # Project-wide script orchestrator
└── tailwind.config.js          # Core CSS variables configuration
```

---

## 8. Getting Started & Installation

### Prerequisites

* **Node.js**: `v18.0.0` or higher
* **MongoDB**: Local instance or MongoDB Atlas cluster connection string
* **Cloudinary Account**: For file uploads

### 1. Repository Setup & Dependency Installation

Clone the repository and install all root and package-level dependencies using the orchestrator scripts:

```bash
git clone https://github.com/Abdelkouddous/VitalWork.git
cd VitalWork
npm run setup-project
```

### 2. Local Configuration

Create a `.env` configuration file in the root workspace directory with the variables listed below:

```env
NODE_ENV=development
PORT=5100
MONGO_URL=mongodb+srv://your_username:your_password@cluster.mongodb.net/VitalWork
JWT_SECRET=your_high_entropy_signing_secret_here
JWT_EXPIRES_IN=1d

# Third-Party API Credentials (Cloudinary)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Database Seeding

To populate your local database with clinical taxonomies, mock candidates, and sample medical postings, run:

```bash
npm run seed:local
```

### 4. Running the Application locally

Start both the API server and React frontend in development mode simultaneously:

```bash
npm run dev
```

* **Backend Server**: Bootstrapped on `http://localhost:5100`
* **React Frontend (Vite)**: Hot-reloading server accessible at `http://localhost:5173`

---

---

## 9. Demonstration & Evaluation Sandbox

For rapid stakeholder evaluation, testing, and continuous auditing, VitalWork provides pre-configured role templates accessible via the landing page and authentication wizard with 1-click credential auto-fill:

| Role | Demo Account Email | Default Password | Capabilities & Access Bounds |
|---|---|---|---|
| **Platform Owner / CEO** | `abdelkouddoushamel@vitalwork.dz` *(alt: `admin@vitalwork.dz`)* | `password123` | Full access to CEO Command Centre, real-time analytics aggregation, financial MRR projections, system audit logs |
| **Clinic / Hospital Employer** | `clinic@vitalwork.dz` *(alt: `employer1@vitalwork.dz`)* | `password123` | Hospital overview dashboard, vacancy posting, applicant pipeline review, candidate CV inspection |
| **Healthcare Professional (Doctor)** | `doctor@vitalwork.dz` *(alt: `seeker1@vitalwork.dz`)* | `password123` | National 58-Wilayas job discovery, application tracking pipeline, verified clinical credentials manager |

---

## 10. Modern Healthcare UX Overhaul (Release v1.2.0)

The v1.2.0 release modernizes the application architecture and user experience across key touchpoints:

1. **Healthcare Domain Purification**:
   * Removed generic/software engineering references (e.g. legacy tech boilerplate) from all landing pages and marketing copy.
   * Completely realigned value propositions toward Algerian clinical ecosystems: university hospitals (CHU), polyclinics, diagnostic labs, and medical practitioners across all 58 Wilayas.

2. **Wizard Slider Pattern for Authentication**:
   * **Login Wizard**: Replaced static 1-page form with an interactive role-switcher slider (`Clinic`, `Doctor/Seeker`, `CEO Admin`) and a 2-step progressive disclosure flow (`Step 1: Identity/Email` → `Step 2: Security Credentials`). Features 1-click demo template fill.
   * **Registration Wizard Slider**: Replaced long monolithic forms with a guided 3-step wizard (`Step 1: Account Identity` → `Step 2: Clinical Specialty & Wilaya Jurisdiction` → `Step 3: Security & Review`) with step indicators, client-side validation barriers, and pre-fill presets.

3. **Persistent OTP Verification UX**:
   * Eliminated temporary, auto-dismissing toast snackbars for OTP verification that forced users to rush and transcribe codes manually.
   * Embedded an accessible, persistent verification label container directly above the OTP inputs with a 1-click `Auto-Fill Code` button for seamless testability.

4. **Executive Clinic & Professional Dashboards**:
   * **Clinic Executive Dashboard**: Elevated the primary `/dashboard` index route from an empty job form to a comprehensive clinic overview featuring 6 clinical KPIs (*Active Clinical Roles*, *Total Applicants*, *Scheduled Interviews*, *Time-to-Hire: 14d*, *Match Fidelity: 94.2%*, *Emergency Roster Coverage: 98.5%*), an interactive hiring funnel, and live candidate feed.
   * **Healthcare Professional Dashboard**: Integrated verified medical council licensing badges, application velocity metrics, and specialty compatibility indicators.

5. **Production Build & Route Hardening**:
   * Resolved Express root route conflict where a temporary maintenance stub blocked client SPA routing in production environments.
   * Configured standardized root `npm run build` and `npm start` commands for automated PaaS deployments (Render / AWS / Railway).

---

## 11. Automated Testing Matrix

VitalWork implements a comprehensive test suite to validate application layers and prevent regressions:

### Testing Structure

* **Unit & Integration Tests**: Executed via **Jest** and **Supertest** to validate routes, authentication middleware, password hashes, and schema writes.
* **End-to-End (E2E) Tests**: Implemented using **Playwright** to run UI tests against user registration, job searches, and candidate flows.

### Execution Scripts

Run integration, unit, and backend test suites:

```bash
npm run test
```

Generate test coverage reports:

```bash
npm run test:coverage
```

Launch the end-to-end (E2E) test runner (requires local MongoDB running):

```bash
npm run test:e2e
```

Launch the visual Playwright UI test runner:

```bash
npm run test:e2e:ui
```

---

## 12. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
