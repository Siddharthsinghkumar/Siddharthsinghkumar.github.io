# Siddharth Singh - Resume References for Portfolio

## Contact Information
- **Phone**: +91-82679-45097
- **Email**: [siddharthsingh8418@gmail.com](mailto:siddharthsingh8418@gmail.com)
- **GitHub**: [Siddharthsinghkumar](https://github.com/Siddharthsinghkumar)
- **LinkedIn**: [siddharth-singh](https://www.linkedin.com/in/siddharth-singh)
- **Location**: Noida, Uttar Pradesh, India

## Professional Identities
Siddharth wears multiple hats across domains:
1. **Full-Stack Engineer**: Next.js, FastAPI, Supabase, building booking & management platforms zero-to-one.
2. **AI Backend Engineer**: Production LLM orchestration, agentic tool-calling runtimes, local inference (Ollama, llama.cpp), and RAG pipelines.
3. **Embedded & Systems Engineer**: C++, Arduino, ESP32, FPGA, Linux CLI, hardware debugging, and systems survival (TrueNAS, ZFS).

## Education
- **B.Tech in Electrical Engineering** (2020-2024) - Rajkiya Engineering College Bijnor (AKTU), Uttar Pradesh
- **GATE 2024 Qualified** - Electrical Engineering

## Professional Experience

### Lead Full-Stack Engineer @ Sindhey Pathology (Healthcare)
*Jan 2026 – Present | [sindheypathology.com](https://www.sindheypathology.com)*
- Shipped a zero-to-one healthcare booking platform in 6 months using Next.js 16, React 19, FastAPI, and Supabase.
- Built a 4-step booking wizard with Zustand state management and booking rules engine.
- Secured payments via Cashfree (UPI/card), implemented 3-tier role verification, HMAC OTPs, and WhatsApp/Email notifications.
- Built an admin dashboard for payment reconciliation and stale-booking cleanup; E2E testing with Playwright.

### AI Backend Developer @ LLM Travel Planner
*Jan 2026 – Present | [GitHub](https://github.com/Siddharthsinghkumar/ai-travel-planner-agent)*
- Built a deterministic agent memory layer and custom model router, handling API degradation with an async circuit breaker.
- Architected a distributed retrieval pipeline with real-time SSE streaming, falling back to local Ollama inference.
- Deployed on a k3s multi-node cluster with full Prometheus/Grafana observability stack.

### Lead Developer (Contract) @ Play-School Management Platform
*Q1 2026 | Remote*
- Built an 11-stage admissions pipeline (Kanban CRM) with Cashfree UPI payments and time-decay fee escalation via Vercel Cron.
- Developed a digital daily diary for parents with real-time notifications and Supabase Storage for photo uploads.

### Lead Developer @ Autonomous Firefighting Robot (Capstone)
*2023 – 2024 | [GitHub](https://github.com/Siddharthsinghkumar/firefighting-robot-public)*
- Designed FPGA + Arduino master-slave architecture for a real-time autonomous robot.
- Integrated CNN-based flame detection and multi-sensor fusion (IR, temp, smoke) with sub-100ms deterministic response time.
- Achieved autonomous navigation with a 6-wheel track drive, ultrasonic and UWB radar obstacle avoidance.

## Key Projects

- **Merlin CLI & Agent Bridge (2025-2026)**: A robust agent framework and tool-calling runtime that executes sandboxed local system commands based on autonomous LLM decisions. [GitHub](https://github.com/Siddharthsinghkumar/merlin-cli-bridge)
- **Smart Job Scanner v2 (2025-Present)**: An 11-stage OCR and semantic pipeline processing 15-20GB of PDFs daily to extract and route jobs. [GitHub](https://github.com/Siddharthsinghkumar/smart-job-scanner-v2)
- **HeartAIoT Monitor (2022-2023)**: ESP8266 + MAX30100 wearable health device with live Blynk IoT dashboard and Python ML anomaly detection. [GitHub](https://github.com/Siddharthsinghkumar/HeartAIoT-Monitor)
- **MTK Firmware Unlock Toolchain (2024-2025)**: Python toolchain to unlock MediaTek bootloaders, extract firmware, and apply root for security research. [GitHub](https://github.com/Siddharthsinghkumar/mtk-firmware-unlock-root)
- **TrueNAS ZFS Recovery Lab (2024-2025)**: Simulated RAID-Z disk failure and recovery in a mixed CMR/SMR environment via PXE boot. [GitHub](https://github.com/Siddharthsinghkumar/truenas-zfs-recovery-lab)

## Publications
- **Autonomous Firefighting Vehicle** (IJFMR 2024) - [Read Paper](https://www.ijfmr.com/research-paper.php?id=32630)

## Technical Skills
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI, Zustand, Framer Motion, Three.js, Playwright.
- **Backend / AI Backend**: Python, FastAPI, LangGraph, Node.js, Express, Supabase (Auth/RLS/RPC), LLM Tool Calling, RAG Pipelines, Pydantic.
- **Databases & Vector DBs**: PostgreSQL, MongoDB, Pinecone, ChromaDB, Redis, SQLite.
- **Systems & Ops**: Linux CLI, Docker, Kubernetes (k3s), AWS (EC2/RDS), GCP, Prometheus/Grafana, ZFS RAID-Z, CI/CD.
- **Embedded**: C++, Arduino, ESP32/ESP8266, FPGA (Xilinx), I2C/SPI/UART, BLE, Wi-Fi.

## Core Knowledge Bases & Enriched Datasets
The following JSON datasets are safely stored in `/home/sidd/project/` to serve as deep RAG context and stylistic references for downstream LLMs or automated Job Discovery Engines:

### The Core Knowledge Bases
- `/home/sidd/project/all_projects_dataset.json`: Contains every scanned project along with a large chunk of its codebase/documentation for deep RAG context.
- `/home/sidd/project/all_resumes_dataset.json`: Contains the raw text of every LaTeX and markdown resume for the LLM to pull stylistic phrasing from.

### The Pre-Mapped "Fast Retrieval" Datasets
Depending on the classified persona for a Job Description (JD), the engine can instantly load these perfectly filtered project sets (complete with `sid audit.md` tags):
- `/home/sidd/project/resume_1_matched_projects.json` — (AI & Backend)
- `/home/sidd/project/resume_2_matched_projects.json` — (Fullstack & Web)
- `/home/sidd/project/resume_3_matched_projects.json` — (Embedded & Hardware)
- `/home/sidd/project/resume_4_matched_projects.json` — (Computer Vision & ML)

### Contingency
- `/home/sidd/project/security_contingency_projects.json` — (Reverse Engineering / Firmware)

### Pipeline Usage
These datasets are perfectly staged for an autonomous engine to consume. The pipeline can classify a JD, instantly load the mapped projects, and cross-reference them with the deep context in `all_projects_dataset.json` to write highly technical, factual content dynamically.
