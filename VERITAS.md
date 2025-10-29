## Veritas

Lightweight, privacy‑aware truth discernment for information verification. Veritas aggregates signals from multiple sources, flags potential misinformation, and surfaces verified insights for journalists, researchers, and informed citizens.

### Description of the solution

Veritas is an agentic, truth‑seeking information lens - the eye that discerns the truth. It ingests multiple public data streams, applies credibility and provenance heuristics, highlights anomalies and potential misinformation, and presents users with concise, contextual truth assessments. The system centers on:
- Source monitoring and normalization
- Misinformation detection signals with transparent confidence cues
- Rapid verification workflows and provenance trails
- Trends, patterns, and credibility summaries
- Calibrated insights to minimize information noise

For the hackathon build, we focus on an end‑to‑end slice: live feed ingestion (mocked where needed), signal extraction, verification UI, and a dashboard that turns noisy information into verified truth.

### User Base

#### Admin Users
- **Fact-checkers and Journalists**: Professional fact-cheThe Veritas API: A developer-first APckers, investigative journalists, and newsroom editors who need comprehensive verification tools and source analysis capabilities
- **Content Moderators**: Platform moderators and community managers who require misinformation detection and content flagging tools
- **Researchers and Academics**: Academic researchers, policy analysts, and think tank professionals who need detailed verification workflows and source credibility assessment
- **Government and NGO Personnel**: Public information officers, policy makers, and NGO staff who require verified information for decision-making and public communication

#### General Users
- **Informed Citizens**: Individuals seeking to verify news, social media claims, and public statements before sharing or acting on information
- **Students and Educators**: Students conducting research, educators teaching media literacy, and academic institutions promoting critical thinking
- **Small Business Owners**: Entrepreneurs and business professionals who need to verify market information, competitor claims, and industry news
- **Social Media Users**: Active social media participants who want to verify viral content before engaging or sharing

### User Process Flows

#### Admin User Process Flow

```mermaid
flowchart TD
    A[Admin Login] --> B[Protected Route Check]
    B --> C{User Role = Admin?}
    C -->|No| D[Redirect to Login]
    C -->|Yes| E[Access Admin Dashboard]
    
    E --> F[Dashboard Overview]
    F --> G{Select Admin Module}
    
    G -->|Analytics| H[Analytics Dashboard]
    G -->|Monitoring| I[Monitoring Feeds]
    G -->|Verification| J[Source Verification]
    G -->|Alerts| K[Alerts Management]
    G -->|Sources| L[Sources Configuration]
    G -->|Users| M[User Management]
    G -->|Settings| N[System Settings]
    G -->|Trends| O[Trends Analysis]
    G -->|Misinformation| P[Misinformation Detection]
    G -->|System| Q[System Monitoring]
    
    H --> H1[View System Analytics]
    H --> H2[Generate Reports]
    H --> H3[Export Data]
    
    I --> I1[Monitor Real-time Feeds]
    I --> I2[Flag Suspicious Content]
    I --> I3[Track Information Patterns]
    
    J --> J1[Review Pending Claims]
    J --> J2[AI Confidence Assessment]
    J --> J3[Manual Verification Actions]
    J --> J4[Approve/Reject/Flag Claims]
    J --> J5[Update Claim Status]
    
    K --> K1[Configure Alert Systems]
    K --> K2[Emergency Alerts]
    K --> K3[Notification Rules]
    
    L --> L1[Manage Information Sources]
    L --> L2[Source Credibility Settings]
    L --> L3[API Configuration]
    
    M --> M1[View User Activity]
    M --> M2[Manage Permissions]
    M --> M3[User Reports]
    
    N --> N1[System Configuration]
    N --> N2[Security Settings]
    N --> N3[API Keys Management]
    
    O --> O1[Trend Analysis]
    O --> O2[Pattern Recognition]
    O --> O3[Predictive Insights]
    
    P --> P1[Misinformation Detection]
    P --> P2[Content Flagging]
    P --> P3[Automated Alerts]
    
    Q --> Q1[System Health Monitoring]
    Q --> Q2[Performance Metrics]
    Q --> Q3[Error Logging]
    
    J1 --> R[API: GET /api/admin/verification]
    J2 --> R
    J3 --> R
    J4 --> S[API: POST /api/admin/verification]
    J5 --> S
    
    R --> T[Update Verification Database]
    S --> T
    T --> U[Trigger Notifications]
    U --> V[Update Public Dashboard]
```

#### General User Process Flow

```mermaid
flowchart TD
    A[User Registration/Login] --> B[Authentication Check]
    B --> C{User Authenticated?}
    C -->|No| D[Redirect to Login]
    C -->|Yes| E[Access Main Dashboard]
    
    E --> F[Public Dashboard Overview]
    F --> G{User Intent}
    
    G -->|Verify Information| H[Verify Page]
    G -->|Report Misinformation| I[Report Page]
    G -->|View Trends| J[Updates Page]
    G -->|Get Help| K[Help Page]
    G -->|Contact Support| L[Contact Page]
    G -->|Settings| M[User Settings]
    
    H --> H1[Enter Claim/Information]
    H --> H2[Select Information Type]
    H --> H3[Add Context/Sources]
    H1 --> H4[Submit for Verification]
    H2 --> H4
    H3 --> H4
    H4 --> H5[AI Processing]
    H5 --> H6[Display Verification Results]
    H6 --> H7[Show Confidence Score]
    H7 --> H8[Provide Recommendations]
    
    I --> I1[Select Report Type]
    I --> I2[Enter Misinformation Details]
    I --> I3[Provide Evidence/URLs]
    I --> I4[Set Impact Level]
    I --> I5[Submit Report]
    I5 --> I6[Generate Reference ID]
    I6 --> I7[Send to Admin Queue]
    
    J --> J1[View Recent Updates]
    J --> J2[Access Public Analytics]
    J --> J3[Browse Trending Claims]
    J --> J4[Download Public Reports]
    
    K --> K1[Access Help Documentation]
    K --> K2[View FAQs]
    K --> K3[Contact Support]
    
    L --> L1[Fill Contact Form]
    L --> L2[Submit Inquiry]
    L --> L3[Receive Response]
    
    M --> M1[Update Profile Information]
    M --> M2[Configure Notifications]
    M --> M3[Set Privacy Preferences]
    M --> M4[Manage Account Settings]
    
    H8 --> N[User Takes Action]
    I7 --> O[Report Submitted Successfully]
    J4 --> P[User Gains Insights]
    K3 --> Q[Support Requested]
    L3 --> R[Inquiry Resolved]
    M4 --> S[Settings Updated]
    
    N --> T[Continue Using Platform]
    O --> T
    P --> T
    Q --> T
    R --> T
    S --> T
    T --> G
```

#### Information Verification Workflow

```mermaid
flowchart TD
    A[Information Input] --> B[Source Analysis]
    B --> C[Credibility Assessment]
    C --> D{AI Confidence Level}
    
    D -->|High Confidence >80%| E[Auto-Verification]
    D -->|Medium Confidence 40-80%| F[Manual Review Queue]
    D -->|Low Confidence <40%| G[Flag for Investigation]
    
    E --> H[Update Verified Database]
    F --> I[Admin Review Process]
    G --> J[Deep Investigation]
    
    I --> K{Admin Decision}
    K -->|Approve| H
    K -->|Reject| L[Mark as Misinformation]
    K -->|Flag| M[Flag for Further Review]
    K -->|Need More Info| J
    
    J --> N[Additional Source Analysis]
    N --> O[Expert Review]
    O --> P{Expert Decision}
    P -->|Verify| H
    P -->|Reject| L
    P -->|Inconclusive| Q[Mark as Unverified]
    
    H --> R[Notify Users]
    L --> R
    M --> S[Send to Admin Queue]
    Q --> R
    
    R --> T[Update Public Dashboard]
    S --> T
    T --> U[Generate Analytics]
    U --> V[Trigger Alerts if Needed]
    V --> W[Update Trending Claims]
```

#### System Architecture & Data Flow
![System Architecture](./public/architecture.jpeg)


### The Problem it solves

- **Information overload in the digital age**: Streams of posts, reports, and claims are fragmented, noisy, and contradictory; truth‑seekers struggle to discern what's actually factual.
- **Early misinformation detection**: False narratives spread rapidly; we provide signals and verification cues to identify truth from fiction.
- **Actionable truth assessment, not just data**: Summaries, credibility scores, and source verification help users move from raw information to verified facts.
- **Information verification visibility**: Centralized dashboards for fact‑checking, source analysis, and truth assessment reduce research time and verification complexity.
- **Privacy and transparency by design**: Minimizes collection, emphasizes transparency and control over verification processes.

### Challenges we ran into

- **Data quality and heterogeneity**: Inconsistent formats, sparse metadata, and variable reliability across information sources.
- **Real‑time performance at scale**: Balancing low latency with robust verification processing, especially during information spikes.
- **Truth assessment signals**: Designing heuristics and UI cues that help users discern truth without over‑promising absolute certainty.
- **Information fatigue**: Calibrating relevance and grouping claims to avoid noisy, duplicative assessments.
- **Source credibility UX**: Conveying reliability and provenance simply, without adding cognitive load.
- **Privacy and compliance**: Handling user data and public content responsibly across jurisdictions.
- **Evolving narratives**: Continuously adapting taxonomy, filters, and dashboards to emerging truth verification challenges.

### Relevant track(s)

Misinformation: Create an Agentic AI system that continuously scans multiple sources of information, detects emerging misinformation, verifies facts, and provides easy‑to‑understand, contextual updates to help users discern truth from fiction.

How our project fits this track:
- We continuously monitor diverse feeds and normalize content for truth analysis.
- We run misinformation detection heuristics and credibility assessment with transparent confidence levels.
- We provide verification workflows and provenance trails to validate information claims.
- We deliver concise, contextual truth assessments and credibility insights suitable for researchers, journalists, and informed citizens.

### Technologies used

- Next.js (App Router) and React
- TypeScript
- Tailwind CSS and `shadcn/ui` component primitives
- FastAPI (Python) for APIs and agentic verification services
- Supabase (Postgres, Auth, Storage, Realtime)
- Charting utilities for trends and analytics
- Lightweight state and hooks for realtime UI
- Node.js toolchain for frontend build/runtime; backend served via FastAPI
