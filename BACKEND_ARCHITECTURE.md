# Veritas Backend Architecture & Technology Stack

## Overview
Backend features categorized by optimal technology choice: **Next.js Server Actions** or **FastAPI**.
Each feature belongs to ONE technology stack. Database: **Supabase (PostgreSQL)** for all features.

**Stack Decision**: Removed Spring Boot for operational simplicity. All Spring Boot responsibilities redistributed to Next.js + Supabase (infrastructure) and FastAPI (processing/AI).

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│              Next.js + Supabase (Full Stack)             │
│  - User Auth & Session Management                        │
│  - User Profile Management                               │
│  - Role-Based Access Control (RLS)                       │
│  - Simple Report Submission                              │
│  - Audit Logging (PostgreSQL triggers)                   │
│  - Dashboard Stats & Monitoring                          │
│  - Notification Management (Realtime)                    │
│  - System Health Dashboards                              │
│  - Webhook Endpoints (Edge Functions)                    │
│  - Email Triggers & Alerts (Functions)                   │
└──────────────────┬───────────────────────────────────────┘
                   │
          Supabase Database
          (PostgreSQL + RLS)
                   │
      ┌────────────┴────────────┐
      │                         │
┌─────▼──────────────────┐  ┌──▼─────────────────────┐
│   FastAPI (Python)     │  │   Message Queue        │
│   - AI Verification    │  │   (Redis/RabbitMQ)     │
│   - Misinformation     │  │   - Background Jobs    │
│   - Source Credibility │  │   - Job Scheduling     │
│   - Feed Processing    │  │   - Alert Delivery     │
│   - Trend Analysis     │  │   - Report Generation  │
│   - Evidence Gathering │  │                        │
│   - Semantic Search    │  │                        │
│   - Content Moderation │  │                        │
│   - Explainability     │  │                        │
│   - Multilingual       │  │                        │
│   - Data APIs          │  │                        │
│   - Query Engine       │  └────────────────────────┘
└────────────────────────┘
```

## 1. Next.js Server Actions ✅
*Best for: Simple CRUD operations, real-time updates, tight frontend integration, rapid prototyping*

### Features

#### 1.1 User Authentication & Session Management
- **Status**: Core Infrastructure
- **Features**:
  - User registration and login (using Supabase Auth)
  - Session token validation
  - Password reset workflow
  - Email verification
  - OAuth integration (Google, GitHub)
  - Session refresh and cleanup
- **Why Next.js**:
  - Native integration with Supabase Auth
  - Server-side session validation
  - Automatic CORS handling
  - Type-safe with full TypeScript support
- **Database**: Supabase Auth tables

#### 1.2 User Profile Management
- **Status**: Dashboard Feature
- **Features**:
  - Retrieve user profile data
  - Update user preferences
  - Profile picture upload/management
  - Dark mode / theme preferences
  - Privacy settings configuration
- **Why Next.js**:
  - Direct Supabase integration
  - File upload handling via Supabase Storage
  - Real-time updates to user preferences
  - Minimal latency for dashboard updates
- **Database**: Supabase `users` and `user_preferences` tables

#### 1.3 Simple Report Submission
- **Status**: Public Feature
- **Features**:
  - Store user reports in queue
  - Basic validation
  - Generate report reference ID
  - Store report metadata
- **Why Next.js**:
  - Direct database writes via Supabase RLS
  - Email sending via Supabase functions or Resend
  - Simple transactional requirements
  - Real-time notifications to admin dashboard
- **Database**: Supabase `reports` table

#### 1.4 Basic System Dashboard Stats
- **Status**: Admin Dashboard
- **Features**:
  - Display real-time user count
  - Display total verifications (from cache)
  - Show system uptime indicator
  - Display alert counts
  - Real-time status updates
- **Why Next.js**:
  - Supabase Realtime subscriptions for live updates
  - Cached pre-computed values from database views
  - Minimal computational overhead
  - Direct RLS integration for security
- **Database**: Supabase materialized views, cache tables

#### 1.5 User Notification Management
- **Status**: Real-time Feature
- **Features**:
  - Fetch user notification history
  - Mark notifications as read
  - Delete notifications
  - Get unread count
  - Subscribe to new notifications in real-time
- **Why Next.js**:
  - Supabase Realtime subscriptions for live sync
  - RLS for user-specific data isolation
  - Simple update operations
  - Direct client-database connection
- **Database**: Supabase `notifications` table

#### 1.6 Role-Based Access Control (RBAC) via Supabase RLS
- **Status**: Core Infrastructure
- **Features**:
  - Role hierarchy (Admin > Moderator > User > Guest)
  - Permission matrix enforcement via RLS policies
  - Dynamic role assignment/revocation
  - Row-level security for data access
  - Audit trail via PostgreSQL triggers
  - Rate limiting configuration per role
  - Multi-level authorization checks
- **Why Next.js + Supabase**:
  - Supabase RLS policies for database-level security
  - PostgreSQL triggers for automatic audit logging
  - Server Actions for permission validation
  - No additional application server needed
  - Type-safe permission checks in TypeScript
  - Highly performant (database-level enforcement)
- **Database**: Supabase `roles`, `permissions`, `user_roles`, `audit_logs` tables

#### 1.7 Batch Report Generation & Export via Edge Functions
- **Status**: Admin Feature
- **Features**:
  - Generate daily/weekly/monthly reports
  - Bulk data export (CSV, JSON, PDF)
  - Export verifications history
  - Export misinformation statistics
  - Scheduled task management
  - Email report delivery
- **Why Next.js + Supabase**:
  - Supabase Edge Functions for scheduled tasks
  - PostgreSQL for complex aggregations
  - Next.js API routes for report generation
  - Cron triggers via pg_cron extension
  - Direct database access (no extra layer)
  - Sendgrid/Resend for email delivery
- **Database**: Supabase `reports`, `report_templates`, `scheduled_tasks` tables

#### 1.8 System Health & Webhook Endpoints
- **Status**: Operations & Integration
- **Features**:
  - Health check endpoints
  - Service status monitoring
  - Webhook endpoint management
  - Incoming webhook parsing and routing
  - Signature verification
  - Error handling and logging
- **Why Next.js + Supabase**:
  - Next.js API routes for health checks
  - Supabase functions for webhook processing
  - PostgreSQL triggers for monitoring
  - Edge Functions for signature validation
  - Built-in webhook logging
- **Database**: Supabase `health_checks`, `webhook_events`, `webhook_config` tables

#### 1.9 Multi-Channel Alert Orchestration
- **Status**: Core Infrastructure
- **Features**:
  - Alert routing based on simple rules
  - Multi-channel delivery (email, SMS, push, in-app)
  - Notification scheduling
  - Simple delivery tracking
  - User subscription management
- **Why Next.js + Supabase**:
  - Supabase Edge Functions for alert triggers
  - Realtime for in-app notifications
  - Simple email/SMS via third-party APIs
  - PostgreSQL for rule storage
  - Webhook forwarding for push notifications
- **Database**: Supabase `alert_rules`, `delivery_logs`, `alert_subscriptions` tables

---

## 2. FastAPI 🚀
*Best for: AI/ML integration, high-performance APIs, real-time processing, complex business logic*

### Features

#### 2.1 AI-Powered Claim Verification
- **Status**: Core Feature
- **Features**:
  - NLP-based claim analysis
  - Fact-checking against knowledge base
  - Confidence scoring with calibration
  - Evidence extraction from text
  - Multiple verification algorithms
  - Verification result caching
- **Why FastAPI**:
  - Excellent Python ecosystem (transformers, spaCy, nltk)
  - Async/await for concurrent processing
  - Easy ML model integration
  - High performance with uvicorn
  - Simple deployment with Docker
- **Database**: Supabase `claims`, `claim_verifications` tables
- **External**: Hugging Face models, custom ML models

#### 2.2 Misinformation Detection & Pattern Matching
- **Status**: Core Feature
- **Features**:
  - Misinformation pattern matching
  - False claim detection algorithms
  - Rumor identification
  - Anomaly detection in information flows
  - Pattern matching across sources
  - Detection signal scoring
- **Why FastAPI**:
  - Python ML libraries (scikit-learn, pytorch)
  - Real-time model inference
  - Efficient async processing
  - Easy model retraining pipeline
  - Logging and monitoring integration
- **Database**: Supabase `misinformation_flags`, `detection_patterns` tables
- **External**: Custom ML models, fact-checking APIs

#### 2.3 Source Credibility & Reliability Scoring
- **Status**: Core Feature
- **Features**:
  - Source credibility scoring algorithm
  - Historical accuracy tracking
  - Bias detection in sources
  - Authority assessment
  - Consistency analysis over time
  - Network trust propagation
- **Why FastAPI**:
  - Graph algorithms (networkx) for trust networks
  - Time-series analysis for consistency
  - Statistical computations (numpy, scipy)
  - Real-time scoring with caching
  - Batch processing for historical data
- **Database**: Supabase `sources`, `source_credibility_scores`, `source_history` tables

#### 2.4 Real-Time Feed Processing & Normalization
- **Status**: Data Pipeline
- **Features**:
  - Stream data ingestion from multiple sources
  - Real-time parsing and normalization
  - Deduplication of similar content
  - Streaming transformations
  - Real-time aggregation
  - Live feed monitoring
- **Why FastAPI**:
  - Async streaming with streaming_body
  - WebSocket support for real-time updates
  - High throughput processing
  - Efficient memory usage
  - Easy integration with message queues (Kafka, RabbitMQ)
- **Database**: Supabase `raw_feeds`, `processed_feeds` tables
- **External**: Message queues, streaming services

#### 2.5 Trend Analysis & Pattern Recognition
- **Status**: Advanced Analytics
- **Features**:
  - Trend detection algorithms
  - Clustering similar misinformation
  - Timeline analysis of claims
  - Geographic trend mapping
  - Viral spread prediction
  - Emerging topic detection
- **Why FastAPI**:
  - Time-series analysis (pandas, statsmodels)
  - Clustering algorithms (scikit-learn)
  - Graph analysis (networkx)
  - Real-time trend computation
  - Easy model updates and retraining
- **Database**: Supabase `trends`, `pattern_clusters`, `topic_modeling` tables

#### 2.6 Automated Evidence Gathering & Attribution
- **Status**: Verification Feature
- **Features**:
  - Automated evidence collection
  - Source attribution and citation tracking
  - Related claim linking
  - Context extraction from evidence
  - Evidence quality scoring
  - Evidence relevance ranking
- **Why FastAPI**:
  - Web scraping and API aggregation
  - Text extraction and NLP
  - Efficient async HTTP requests
  - Easy crawler integration
  - Parallel evidence collection
- **Database**: Supabase `evidence`, `evidence_sources`, `citations` tables
- **External**: Web scraping services, news APIs

#### 2.7 Semantic Search & Information Retrieval
- **Status**: Public Feature
- **Features**:
  - Full-text search across claims
  - Semantic search using embeddings
  - Search result ranking and relevance
  - Search suggestions/autocomplete
  - Query expansion and reformulation
  - Faceted search support
- **Why FastAPI**:
  - Vector embeddings (sentence-transformers)
  - Similarity search algorithms
  - Efficient async queries
  - Custom ranking algorithms
  - Vector database integration (Pinecone, Weaviate)
- **Database**: Supabase with pgvector extension

#### 2.8 Automated Content Moderation & Classification
- **Status**: Advanced Feature
- **Features**:
  - Content classification (categories)
  - Offensive content detection
  - Hate speech detection
  - Toxicity scoring
  - Age-appropriate content filtering
  - Policy violation flagging
- **Why FastAPI**:
  - Transformer models for text classification
  - Real-time inference
  - Async processing for high throughput
  - Easy model updates
  - Confidence scoring
- **Database**: Supabase `moderation_flags`, `content_violations` tables
- **External**: HuggingFace models, moderation APIs

#### 2.9 Explainability & Reasoning Engine
- **Status**: Advanced Feature
- **Features**:
  - Generate explanations for verification results
  - Show AI reasoning and decision factors
  - Feature importance scores
  - Decision justification
  - Confidence calibration transparency
  - Error analysis reporting
- **Why FastAPI**:
  - Explainability libraries (SHAP, LIME)
  - Visualization libraries (plotly)
  - Real-time explanation generation
  - Model-agnostic explanations
  - Integration with verification models
- **Database**: Supabase `explanations`, `reasoning_logs` tables

#### 2.10 Multilingual & Language Processing
- **Status**: Advanced Feature
- **Features**:
  - Multi-language claim analysis
  - Automatic language detection
  - Cross-language translation
  - Language-specific verification rules
  - Multilingual source analysis
  - Language bias detection
- **Why FastAPI**:
  - Translation APIs (Google, DeepL)
  - Language detection (langdetect, TextBlob)
  - Multilingual transformers
  - Efficient batch translation
  - Language-specific model swapping
- **Database**: Supabase with `language` field on text tables

#### 2.11 Advanced Data Aggregation & Analytics APIs
- **Status**: Admin/Public Feature
- **Features**:
  - Complex data aggregation queries
  - Filtered data exports (CSV, JSON)
  - Custom visualization data preparation
  - Report data aggregation
  - Time-series data APIs
  - Statistical summary endpoints
- **Why FastAPI**:
  - Efficient data serialization
  - Async streaming for large datasets
  - Custom formatting and transformation
  - Real-time data aggregation
  - Pagination and filtering
- **Database**: Supabase with custom aggregations

#### 2.12 Advanced Dynamic Query Engine
- **Status**: Search & Analytics
- **Features**:
  - Complex multi-field filtering
  - Date range and temporal queries
  - Nested query support
  - Query optimization and caching
  - Saved query templates
  - Full-text and semantic filtering combined
- **Why FastAPI**:
  - Dynamic query generation
  - Query optimization strategies
  - Efficient parameter handling
  - Async database queries
  - Custom aggregation pipelines
- **Database**: Supabase with optimized indexes

#### 2.13 Background Job Processing & Task Queue
- **Status**: Core Infrastructure
- **Features**:
  - Asynchronous task processing
  - Delayed job execution with scheduling
  - Priority queue management
  - Dead letter queue for failed jobs
  - Job status tracking and history
  - Distributed job processing across workers
  - Idempotent job execution
  - Monitoring and observability
- **Why FastAPI**:
  - Celery for distributed task queues
  - APScheduler for job scheduling
  - Redis/RabbitMQ for queue management
  - Retry mechanisms with backoff
  - Job result persistence
  - Easy horizontal scaling
- **Database**: Supabase `job_queue`, `job_history`, `job_results` tables
- **External**: Redis/RabbitMQ

#### 2.14 Multi-Source API Integration & Orchestration
- **Status**: Data Pipeline
- **Features**:
  - Connect to multiple external information APIs
  - Unified data format transformation
  - API connection pooling and management
  - Handle rate limiting per API
  - Retry logic with exponential backoff
  - Connection failover strategies
  - Data normalization pipeline
  - Source configuration management
- **Why FastAPI**:
  - httpx with connection pooling
  - Resilience libraries for circuit breakers
  - Centralized configuration management
  - Built-in retry and timeout handling
  - Async concurrent requests
  - Easy to test and monitor
- **Database**: Supabase `external_sources`, `source_config`, `api_credentials` tables
  - Track complete verification history with changes
  - Maintain immutable audit trail
  - Generate GDPR compliance reports
  - Generate CCPA compliance reports
  - User data access logs
  - System event tracking
  - Audit trail queries and filtering
  - Data retention policy enforcement
- **Why Spring Boot**:
  - Spring Data for complex audit queries
  - AOP for automatic action logging
  - Transaction management for consistency
  - Event sourcing capability
  - Report generation and filtering
  - Partition strategies for large datasets
- **Database**: Supabase `audit_logs` (potentially partitioned), `compliance_events` tables

#### 2.5 Complex Multi-Channel Alert System
- **Status**: Core Infrastructure
- **Features**:
  - Alert routing based on complex rules
  - Multi-channel delivery (email, SMS, push, in-app, webhook)
  - Notification scheduling and throttling
  - Delivery tracking and retry queue
  - User subscription management per channel
  - Escalation policies for critical alerts
  - Alert deduplication logic
  - Delivery failure handling
- **Why Spring Boot**:
  - Spring Cloud Stream for event processing
  - Message brokers (RabbitMQ, Kafka) integration
  - Complex rule engine for routing
  - Guaranteed delivery patterns
  - Rate limiting and throttling
  - Distributed notification processing
- **Database**: Supabase `notifications_config`, `alert_rules`, `delivery_queue`, `delivery_logs` tables

#### 2.6 System Health Monitoring & Auto-Remediation
- **Status**: Operations Infrastructure
- **Features**:
  - Health check endpoints for all services
  - Real-time performance metric collection
  - Automated alerting on degradation
  - Service restart triggers
  - Load balancing decision support
  - Resource utilization tracking
  - Dependency health checks
  - SLA monitoring
- **Why Spring Boot**:
  - Spring Boot Actuator for health checks
  - Micrometer for metrics collection
  - Spring Cloud for service coordination
  - Built-in circuit breaker patterns
  - Service discovery integration
  - Automatic remediation hooks
- **Database**: Supabase `system_metrics`, `health_checks`, `service_status` tables

#### 2.7 Background Job Processing & Task Queue
- **Status**: Core Infrastructure
- **Features**:
  - Asynchronous task processing
  - Delayed job execution with scheduling
  - Priority queue management
---

## Summary Table

| Feature | Technology | Reasoning |
|---------|-----------|-----------|
| **User Authentication** | Next.js | Native Supabase integration |
| **User Profile Management** | Next.js | Simple CRUD, real-time sync |
| **Report Submission** | Next.js | Direct DB writes, email triggers |
| **Dashboard Stats** | Next.js | Real-time subscriptions, cached data |
| **Notification Management** | Next.js | Real-time subscriptions, RLS |
| **RBAC & Permissions** | Next.js | Supabase RLS policies |
| **Batch Reports** | Next.js | Edge Functions, pg_cron |
| **Webhooks & Health** | Next.js | Edge Functions, API routes |
| **Alert Orchestration** | Next.js | Edge Functions, Realtime |
| **AI Claim Verification** | FastAPI | NLP, ML models, Python |
| **Misinformation Detection** | FastAPI | ML algorithms, pattern matching |
| **Source Credibility** | FastAPI | Graph algorithms, statistics |
| **Feed Processing** | FastAPI | Streaming, async, WebSocket |
| **Trend Analysis** | FastAPI | Time-series, clustering |
| **Evidence Gathering** | FastAPI | Web scraping, NLP |
| **Semantic Search** | FastAPI | Embeddings, vector search |
| **Content Moderation** | FastAPI | Transformers, classification |
| **Explainability** | FastAPI | SHAP, LIME, reasoning |
| **Multilingual** | FastAPI | Translation, detection |
| **Data APIs** | FastAPI | Streaming, aggregation |
| **Query Engine** | FastAPI | Dynamic queries, optimization |
| **Background Jobs** | FastAPI | Celery, scheduling |
| **API Orchestration** | FastAPI | httpx, pooling, retries |

---

## Feature Count Summary

- **Next.js + Supabase**: 9 features
- **FastAPI**: 14 features  
- **Total**: 23 unique, non-overlapping features

---

## Technology Stack Summary

### Next.js + Supabase
**Best for**: User-facing features, real-time updates, authentication, authorization, simple CRUD

**Key Capabilities**:
- Row-Level Security (RLS) for fine-grained access control
- PostgreSQL triggers for audit logging
- Edge Functions for serverless processing
- Realtime subscriptions for live updates
- Built-in authentication
- File storage

**Tech Stack**:
```
- Frontend: Next.js 14+ (App Router)
- Backend: Supabase Edge Functions
- Database: PostgreSQL (Supabase)
- Auth: Supabase Auth
- Real-time: Supabase Realtime (WebSocket)
- File Storage: Supabase Storage
- Email: Resend/Sendgrid
- Monitoring: Supabase Dashboard + Custom Dashboards
```

### FastAPI
**Best for**: AI/ML processing, complex business logic, data pipelines, background jobs

**Key Capabilities**:
- Async/await for high-performance APIs
- Easy ML/AI integration (Python ecosystem)
- Background job processing with Celery
- Real-time WebSocket connections
- Advanced data aggregation and querying
- Vector embeddings and similarity search

**Tech Stack**:
```
- Framework: FastAPI
- Server: Uvicorn
- Async Tasks: Celery
- Job Queue: Redis or RabbitMQ
- ML Libraries: transformers, scikit-learn, pytorch, spaCy
- Data Processing: pandas, numpy, scipy
- Vector Search: pgvector, Pinecone, or Weaviate
- Explainability: SHAP, LIME
- Translation: Google Translate API, DeepL
- Deployment: Docker + Kubernetes (optional)
```

---

## Data Flow Architecture

```
┌─────────────────────────────┐
│   User → Next.js Frontend   │
└──────────────┬──────────────┘
               │
        ┌──────▼──────┐
        │ Next.js     │
        │ Server      │
        │ Actions     │
        └──────┬──────┘
               │
     ┌─────────┴──────────┐
     │                    │
┌────▼────────┐  ┌────────▼─────┐
│  Supabase   │  │  FastAPI     │
│  Database   │  │  Services    │
│  + RLS      │  │              │
│  + Auth     │  │  - AI/ML     │
│  + Realtime │  │  - Processing
│  + Storage  │  │  - Background
└────────────┘  └──────────────┘
```

---

## Database Schema Overview (Supabase)

### Core Authentication & Authorization
- `users` - User accounts
- `user_preferences` - User settings
- `roles` - Role definitions
- `permissions` - Permission definitions  
- `user_roles` - User to role mapping
- `audit_logs` - Admin action logs (triggers)

### Notifications & Alerts
- `notifications` - User notifications
- `alert_rules` - Alert routing rules
- `alert_subscriptions` - User subscriptions
- `delivery_logs` - Alert delivery tracking
- `webhook_events` - Incoming webhooks
- `webhook_config` - Webhook endpoints

### Verification & Claims
- `claims` - Submitted claims
- `claim_verifications` - Verification results
- `evidence` - Supporting/refuting evidence
- `evidence_sources` - Evidence attribution

### Sources & Credibility
- `sources` - Information sources
- `source_credibility_scores` - Credibility ratings
- `source_history` - Historical source data

### Misinformation & Detection
- `misinformation_flags` - Flagged misinformation
- `detection_patterns` - Detected patterns
- `pattern_clusters` - Grouped claims

### Analytics & Trends
- `trends` - Identified trends
- `topic_modeling` - Topic analysis
- `explanations` - AI explanation records
- `reasoning_logs` - Decision reasoning

### Operations & Configuration
- `reports` - Generated reports
- `report_templates` - Report templates
- `scheduled_tasks` - Scheduled jobs
- `health_checks` - System health
- `external_sources` - External API sources
- `source_config` - Source configuration
- `api_credentials` - API authentication
- `job_queue` - Background jobs (via FastAPI/Celery)
- `job_history` - Job execution history
- `moderation_flags` - Content moderation flags
- `content_violations` - Policy violations

---

## Deployment Strategy

### Phase 1: Foundation (Weeks 1-2)
1. Set up Supabase project with authentication
2. Deploy Next.js frontend with basic pages
3. Implement user auth and profile management
4. Set up audit logging with PostgreSQL triggers

### Phase 2: FastAPI Backend (Weeks 2-4)
1. Deploy FastAPI service with basic endpoints
2. Implement AI claim verification
3. Set up PostgreSQL connection pooling
4. Configure Redis/RabbitMQ for job queues

### Phase 3: Integration (Weeks 4-6)
1. Connect Next.js to FastAPI APIs
2. Implement real-time feed processing
3. Set up background jobs (Celery)
4. Implement semantic search

### Phase 4: Advanced Features (Weeks 6-8)
1. Deploy misinformation detection
2. Implement trend analysis
3. Set up content moderation
4. Implement explainability engine

### Phase 5: Production Hardening (Weeks 8+)
1. Performance optimization
2. Security audits
3. Monitoring and alerting
4. Scaling strategies (load balancing, caching)

---

## Infrastructure Requirements

### Compute
- **Next.js**: Vercel (managed) or self-hosted (~$15-50/month)
- **FastAPI**: 2-4 CPU cores, 4-8GB RAM (~$30-100/month)
- **Redis/RabbitMQ**: 1-2 CPU cores, 2-4GB RAM (~$20-50/month)

### Database
- **Supabase**: PostgreSQL 15+ (~$25-100/month depending on usage)

### Optional Services
- **Vector Database**: Pinecone (~$20-100/month) or self-hosted Weaviate
- **Message Queue**: AWS SQS/SNS or self-hosted (~$10-50/month)
- **Monitoring**: Datadog/New Relic (~$50-200/month)

### Total Estimated Cost: $100-500/month (depending on scale)

---

## Why This Stack Works

✅ **Operational Simplicity**
- Only 2 technology stacks to manage
- Simpler CI/CD pipeline
- Easier debugging and monitoring

✅ **Cost Effective**
- No expensive JVM infrastructure (Spring Boot)
- Leverages Supabase managed services
- FastAPI has low resource overhead

✅ **Scalability**
- Next.js scales automatically (Vercel)
- FastAPI scales horizontally easily
- Supabase handles database scaling

✅ **Developer Experience**
- JavaScript on frontend and backend (some overlap)
- Python on backend (excellent ML/AI support)
- Full TypeScript type safety available

✅ **Time to Market**
- Rapid development with Supabase
- FastAPI rapid prototyping
- Lower infrastructure setup time
  - Toxicity scoring
  - Age-appropriate content filtering
  - Policy violation flagging
- **Why FastAPI**:
  - Transformer models for text classification
  - Real-time inference
  - Async processing for high throughput
  - Easy model updates
  - Confidence scoring
- **Database**: Supabase `moderation_flags`, `content_violations` tables
- **External**: HuggingFace models, moderation APIs

#### 3.9 Explainability & Reasoning Engine
- **Status**: Advanced Feature
- **Features**:
  - Generate explanations for verification results
  - Show AI reasoning and decision factors
  - Feature importance scores
  - Decision justification
  - Confidence calibration transparency
  - Error analysis reporting
- **Why FastAPI**:
  - Explainability libraries (SHAP, LIME)
  - Visualization libraries (plotly)
  - Real-time explanation generation
  - Model-agnostic explanations
  - Integration with verification models
- **Database**: Supabase `explanations`, `reasoning_logs` tables

#### 3.10 Multilingual & Language Processing
- **Status**: Advanced Feature
- **Features**:
  - Multi-language claim analysis
  - Automatic language detection
  - Cross-language translation
  - Language-specific verification rules
  - Multilingual source analysis
  - Language bias detection
- **Why FastAPI**:
  - Translation APIs (Google, DeepL)
  - Language detection (langdetect, TextBlob)
  - Multilingual transformers
  - Efficient batch translation
  - Language-specific model swapping
- **Database**: Supabase with `language` field on text tables

#### 3.11 Advanced Data Aggregation & Analytics APIs
- **Status**: Admin/Public Feature
- **Features**:
  - Complex data aggregation queries
  - Filtered data exports (CSV, JSON)
  - Custom visualization data preparation
  - Report data aggregation
  - Time-series data APIs
  - Statistical summary endpoints
- **Why FastAPI**:
  - Efficient data serialization
  - Async streaming for large datasets
  - Custom formatting and transformation
  - Real-time data aggregation
  - Pagination and filtering
- **Database**: Supabase with custom aggregations

#### 3.12 Advanced Dynamic Query Engine
- **Status**: Search & Analytics
- **Features**:
  - Complex multi-field filtering
  - Date range and temporal queries
  - Nested query support
  - Query optimization and caching
  - Saved query templates
  - Full-text and semantic filtering combined
- **Why FastAPI**:
  - Dynamic query generation
  - Query optimization strategies
  - Efficient parameter handling
  - Async database queries
  - Custom aggregation pipelines
---

## External Services & API Integrations

### Authentication & Identity
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Supabase Auth** | User authentication & session management | Next.js Server Actions | Next.js | Included in Supabase |
| **Google OAuth** | Social login (Google accounts) | Next.js Auth middleware | Next.js | Free |
| **GitHub OAuth** | Social login (GitHub accounts) | Next.js Auth middleware | Next.js | Free |

### Email & Communication
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Resend** | Transactional emails (reports, alerts) | Next.js Edge Functions, Supabase functions | Next.js | $20/month (100k emails) |
| **Sendgrid** | Alternative email service | Supabase Edge Functions | Next.js | Free tier or $19.95/month |
| **Twilio** | SMS alerts & notifications | FastAPI background jobs | FastAPI | Pay-as-you-go (~$0.01/SMS) |

### AI & Language Processing
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Hugging Face** | Pre-trained NLP models (claim verification, misinformation detection) | FastAPI ML models | FastAPI | Free (self-hosted) or $9/month (API) |
| **OpenAI GPT** | Optional: Advanced claim analysis & explanation generation | FastAPI async endpoints | FastAPI | Pay-as-you-go ($0.002-0.06/1K tokens) |
| **Google Translate API** | Multi-language translation | FastAPI language processing | FastAPI | Pay-as-you-go (~$15 per million characters) |
| **DeepL API** | Alternative translation (higher quality) | FastAPI language processing | FastAPI | Free tier or €25/month |
| **spaCy** | NLP library (text processing) | FastAPI local models | FastAPI | Free (open source) |

### Content Moderation & Detection
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Perspective API (Google)** | Toxicity & offensive content detection | FastAPI content moderation | FastAPI | Free tier available |
| **Amazon Rekognition** | Image moderation (if needed) | FastAPI content moderation | FastAPI | Pay-as-you-go (~$0.10-0.30/image) |

### Fact-Checking & Verification
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Claim Check API** | Third-party fact-checking integration | FastAPI evidence gathering | FastAPI | API-dependent |
| **NewsAPI** | News article retrieval & search | FastAPI feed processing | FastAPI | $20-200/month |
| **MediaStack** | News aggregation & monitoring | FastAPI feed processing | FastAPI | $14.99-99.99/month |

### Data & Analytics
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Supabase pgvector** | Vector similarity search for embeddings | Next.js/FastAPI queries | Both | Included in Supabase |
| **Pinecone** | Alternative vector database for semantic search | FastAPI semantic search | FastAPI | Free tier or $0.24/1K vectors/month |
| **Weaviate** | Self-hosted vector database | FastAPI semantic search | FastAPI | Self-hosted (free) |

### Data Processing & Background Jobs
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Redis** | Message queue & caching | FastAPI + Celery | FastAPI | Self-hosted or $5-500+/month (cloud) |
| **RabbitMQ** | Alternative message broker | FastAPI + Celery | FastAPI | Self-hosted (free) or cloud hosted |

### Monitoring & Observability
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Sentry** | Error tracking & monitoring | Next.js & FastAPI | Both | Free tier or $29/month |
| **Prometheus** | Metrics collection | FastAPI Exporter | FastAPI | Self-hosted (free) |
| **Grafana** | Metrics visualization & dashboards | FastAPI/Supabase metrics | FastAPI | Self-hosted (free) or $9-299/month |
| **LogRocket** | Frontend session replay & logging | Next.js | Next.js | $99+/month |

### Storage & File Management
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Supabase Storage** | User uploads, report files, evidence docs | Next.js file uploads | Next.js | Included in Supabase |
| **AWS S3** | Alternative large-scale storage | FastAPI file handling | FastAPI | Pay-as-you-go (~$0.023/GB) |

### Search & Information Retrieval
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Elasticsearch** | Full-text search backend | FastAPI search engine | FastAPI | Self-hosted or $95-4995/month (cloud) |
| **Algolia** | Managed search service | FastAPI search queries | FastAPI | $0-495/month |

### Web Scraping & Data Collection
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Apify** | Web scraping & automation | FastAPI data collection | FastAPI | Free tier or $49+/month |
| **Bright Data** | Proxy & scraping services | FastAPI feed processing | FastAPI | Custom pricing |
| **ScrapingBee** | Headless browser scraping | FastAPI evidence gathering | FastAPI | $29-499/month |

### Infrastructure & Deployment
| Service | Purpose | Integration Point | Stack | Cost |
|---------|---------|-------------------|-------|------|
| **Vercel** | Next.js hosting & deployment | Next.js frontend | Next.js | Free tier or $20+/month |
| **DigitalOcean App Platform** | FastAPI hosting | FastAPI backend | FastAPI | $5-500+/month |
| **AWS/GCP/Azure** | Alternative cloud hosting | Entire stack | Both | Variable |
| **Docker Hub** | Container registry | CI/CD pipeline | Both | Free tier or $5+/month |

---

## Integration Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    Veritas Application                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐        ┌──────────────────────┐   │
│  │   Next.js Frontend      │        │  FastAPI Backend     │   │
│  │  (Vercel/Self-hosted)   │        │  (DigitalOcean/AWS)  │   │
│  └────────────┬────────────┘        └──────────┬───────────┘   │
│               │                                 │                │
└───────────────┼─────────────────────────────────┼────────────────┘
                │                                 │
        ┌───────┴─────────┬───────────┬──────────┴──────────┐
        │                 │           │                     │
   ┌────▼────┐      ┌─────▼────┐  ┌──▼──────┐      ┌───────▼────┐
   │Supabase │      │Resend/   │  │Redis/   │      │HuggingFace │
   │(DB+Auth)│      │Sendgrid  │  │RabbitMQ │      │(ML Models) │
   └─────────┘      │(Email)   │  │(Queue)  │      └────────────┘
                    └──────────┘  └─────────┘
                         │
        ┌────────────────┼────────────────────┬─────────┐
        │                │                    │         │
   ┌────▼────┐    ┌──────▼─────┐     ┌──────▼──┐  ┌────▼────┐
   │Google   │    │NewsAPI/    │     │Sentry   │  │Pinecone/│
   │OAuth    │    │MediaStack  │     │Prometheus
   │         │    │(News Feed) │     │Grafana  │  │(Vector) │
   └─────────┘    └────────────┘     └─────────┘  └─────────┘
                         │
        ┌────────────────┴──────────────┐
        │                               │
   ┌────▼────────┐           ┌────────▼─────┐
   │Perspective  │           │Translate API │
   │(Moderation) │           │(Google/DeepL)│
   └─────────────┘           └───────────────┘
```

---

## Service Integration by Feature

### Next.js + Supabase Features

#### 1.1 User Authentication
- **Supabase Auth** - Built-in provider
- **Google OAuth** - Social login
- **GitHub OAuth** - Social login

#### 1.2 User Profile Management
- **Supabase Storage** - Profile pictures & files

#### 1.3 Report Submission
- **Resend** or **Sendgrid** - Confirmation emails
- **Supabase Storage** - Store report attachments

#### 1.4 Dashboard Stats
- **Supabase** - Real-time subscriptions
- **Prometheus/Grafana** - Optional metrics display

#### 1.5 Notification Management
- **Supabase Realtime** - Built-in
- **Twilio** - Optional SMS notifications

#### 1.6 RBAC via RLS
- **Supabase** - Built-in RLS policies

#### 1.7 Batch Reports
- **Resend/Sendgrid** - Email delivery
- **Supabase Storage** - Store generated reports

#### 1.8 Webhooks & Health
- **Sentry** - Error tracking
- **Prometheus** - Health metrics

#### 1.9 Alert Orchestration
- **Resend/Sendgrid** - Email alerts
- **Twilio** - SMS alerts
- **Supabase Realtime** - In-app alerts

---

### FastAPI Features

#### 2.1 AI Claim Verification
- **Hugging Face** - Pre-trained NLP models
- **OpenAI GPT** - Optional advanced analysis

#### 2.2 Misinformation Detection
- **Hugging Face** - Classification models
- **Custom models** - Self-trained

#### 2.3 Source Credibility
- **Hugging Face** - NLP analysis
- **Custom ML** - Graph algorithms

#### 2.4 Feed Processing
- **NewsAPI** or **MediaStack** - News sources
- **Apify/ScrapingBee** - Web scraping
- **Redis/RabbitMQ** - Stream processing

#### 2.5 Trend Analysis
- **Custom algorithms** - In-house processing
- **Elasticsearch** - Optional full-text search

#### 2.6 Evidence Gathering
- **NewsAPI** - News articles
- **ScrapingBee** - Web scraping
- **Bright Data** - Proxy services

#### 2.7 Semantic Search
- **Pinecone** or **Weaviate** - Vector search
- **Hugging Face** - Embeddings

#### 2.8 Content Moderation
- **Perspective API** - Toxicity detection
- **Amazon Rekognition** - Image moderation (optional)

#### 2.9 Explainability
- **SHAP/LIME** - Local libraries
- **Custom logic** - In-house

#### 2.10 Multilingual
- **Google Translate API** - Translation
- **DeepL** - Alternative translation
- **Hugging Face** - Multilingual models

#### 2.11 Data APIs
- **Custom aggregation** - PostgreSQL queries

#### 2.12 Query Engine
- **PostgreSQL** - Full-text search
- **Elasticsearch** - Alternative search

#### 2.13 Background Jobs
- **Redis** or **RabbitMQ** - Message broker
- **Celery** - Task queue

#### 2.14 API Orchestration
- **httpx** - HTTP client library
- **Custom retry logic** - In-house

---

## Cost Summary

### Minimum Setup (MVP)
- **Supabase**: $25/month (basic tier)
- **Vercel**: Free tier (Next.js)
- **FastAPI hosting**: $5-30/month (DigitalOcean)
- **Resend**: Free tier (100 emails/day)
- **Hugging Face**: Free (local models)
- **Redis**: Free (local)
- **Total**: ~$30-55/month

### Production Setup
- **Supabase**: $100-500/month (prod tier)
- **Vercel**: $20-50/month (pro)
- **FastAPI hosting**: $50-200/month (scaled)
- **Redis/RabbitMQ**: $20-100/month
- **Resend**: $20/month (5k emails)
- **Hugging Face API**: $10-100/month
- **Sentry**: $29/month
- **Optional: Pinecone/Weaviate**: $20-100/month
- **Total**: ~$269-1,080/month

### Full Enterprise Setup
- **Supabase**: $500-2000+/month (enterprise)
- **AWS/GCP hosting**: $200-1000+/month
- **Advanced services**: $500-2000+/month
- **Total**: $1000-5000+/month

---

## Service Selection Criteria

### When to Add Services
1. **Performance bottleneck** - Add caching/CDN
2. **Scale requirement** - Add distributed queue
3. **Feature missing** - Add specialized service
4. **Cost saving** - Use free tiers before paid

### When to Build In-House
1. **Core business logic** - Build custom
2. **Competitive advantage** - Build proprietary
3. **Simple requirement** - Build vs integrate
4. **Privacy/security** - Keep data internal

### When to Defer
1. **Nice-to-have features** - Phase 2+
2. **Premium services** - After MVP validation
3. **Complex integrations** - After core stable
4. **Bleeding-edge tech** - After maturity

### 1. Repository Setup
```bash
# Frontend (Next.js)
git clone <repo>
cd Veritas
npm install

# Backend (FastAPI)
git clone <repo>-backend
cd veritas-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Supabase Setup
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Create initial tables (see schema overview above)
-- Set up RLS policies
-- Configure triggers for audit logging
```

### 3. Environment Variables

**Next.js** (.env.local):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx
FASTAPI_URL=http://localhost:8000
```

**FastAPI** (.env):
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://...
```

### 4. Local Development

**Terminal 1 - Supabase**:
```bash
npx supabase start
```

**Terminal 2 - FastAPI**:
```bash
cd veritas-backend
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Next.js**:
```bash
npm run dev
```

---

## Testing Strategy

### Unit Tests
- **Next.js**: Jest + React Testing Library
- **FastAPI**: pytest

### Integration Tests
- Test Next.js → Supabase connections
- Test FastAPI → Supabase connections
- Test Next.js → FastAPI API calls

### E2E Tests
- Playwright for full user flows

### Load Tests
- k6 for performance testing

---

## Monitoring & Observability

### Application Monitoring
- **Next.js**: Sentry for error tracking
- **FastAPI**: Prometheus + Grafana for metrics

### Database Monitoring
- Supabase built-in monitoring dashboard
- PostgreSQL query analysis

### Infrastructure Monitoring
- Uptime monitoring for all services
- Alert thresholds for performance metrics

---

## Security Considerations

✅ **Authentication**
- Supabase Auth (passwordless, OAuth)
- JWT token validation

✅ **Authorization**
- Row-Level Security (RLS) policies in PostgreSQL
- Next.js middleware for route protection
- FastAPI dependency injection for permissions

✅ **Data Protection**
- Encryption at rest (Supabase default)
- Encryption in transit (TLS/SSL)
- GDPR compliance via audit logs

✅ **API Security**
- Rate limiting on all endpoints
- CORS configuration
- Webhook signature verification

✅ **Code Security**
- Regular dependency updates
- Security linting (ESLint, bandit)
- Code review process

---

## Migration Path from Current State

1. **Remove existing API routes** ✅ (Already done)
2. **Set up Supabase project** (In progress)
3. **Migrate auth to Supabase Auth** (Week 1)
4. **Implement Next.js features** (Week 1-2)
5. **Deploy FastAPI skeleton** (Week 2)
6. **Implement AI/ML features** (Week 3-4)
7. **Integration testing** (Week 4-5)
8. **Production deployment** (Week 5+)

---

## Resources & Documentation

- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com
- **Supabase**: https://supabase.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs
- **Celery**: https://docs.celeryproject.io
- **FastAPI + ML**: https://huggingface.co/docs

---

## Final Summary

This **two-stack architecture** provides:
- ✅ Operational simplicity (fewer moving parts)
- ✅ Cost efficiency (no Spring Boot overhead)
- ✅ Scalability (both stacks scale horizontally)
- ✅ Developer productivity (rapid development)
- ✅ Strong fundamentals (established frameworks)
- ✅ Future-proof (can add Spring Boot layer later if needed)

**Recommended: Start with this stack. Scale with microservices if needed after reaching 10M+ users or complex distributed requirements.**
- `explanations` - AI explanation records
- `reasoning_logs` - Decision reasoning logs- `job_history` - Job execution history
- `system_metrics` - System performance
- `health_checks` - Health check results

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                Frontend (Next.js)                    │
│         (Server Components + Server Actions)        │
└────────────┬─────────────────────────┬──────────────┘
             │                         │
      ┌──────▼───────┐        ┌────────▼───────┐
      │ Next.js Server│        │  Supabase      │
      │    Actions   │        │   (Database)   │
      └──────┬───────┘        └────────────────┘
             │
      ┌──────▼──────────────────┐
      │    API Gateway Layer    │
      └──────┬────────┬─────────┘
             │        │
      ┌──────▼──┐  ┌──▼────────┐
      │Spring Boot   FastAPI    │
      │Microservices Services  │
      └────────────┬──────────┘
             │
      ┌──────▼──────────────────┐
      │   Supabase PostgreSQL   │
      │    (Primary Database)   │
      └───────────────────────────┘
```

---

## Next Steps

1. **Phase 1 (Weeks 1-2)**: Implement Next.js Server Actions for core CRUD
2. **Phase 2 (Weeks 2-4)**: Deploy Spring Boot for complex features
3. **Phase 3 (Weeks 4-6)**: Deploy FastAPI for AI/ML features
4. **Phase 4 (Weeks 6-8)**: Integration testing and optimization
5. **Phase 5 (Week 8+)**: Monitoring, scaling, and performance tuning
