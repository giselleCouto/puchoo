# Puchoo AI

Integrated HR and people-management platform for Brazilian public-sector contexts, with modules for attendance, occupational health, payroll, banking integration, eSocial and LGPD compliance.

Puchoo AI is a product-oriented repository that demonstrates full-stack architecture, workflow automation and compliance-aware system design for institutional operations.

## Why This Project Matters

Public-sector HR operations combine sensitive personal data, regulatory compliance, payroll events, attendance records and auditability requirements. This project shows how those workflows can be organized into a modular digital platform.

## Core Modules

- Attendance and time tracking with facial recognition and geolocation.
- Occupational health and safety workflows.
- Employee portal for payslips, benefits and vacation records.
- Banking integration for Pix, TED and CNAB payment batches.
- eSocial event management.
- LGPD consent management and audit trail.

## Technical Stack

- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Express
- tRPC
- Drizzle ORM
- MySQL/TiDB
- PDF generation
- Recharts

## Repository Structure

```text
client/       Frontend application
server/       Backend and API layer
shared/       Shared schemas and types
drizzle/      Database schema and migrations
src/          Supporting application code
```

## Running Locally

```bash
pnpm install
pnpm db:push
pnpm dev
```

Environment setup is documented in `.env.example`.

## Portfolio Angle

This repository is relevant for:

- full-stack product architecture
- public-sector systems
- workflow automation
- LGPD-aware product design
- operational dashboards
- secure handling of sensitive institutional data

## Author

Developed by [Giselle Couto Falcao, PhD](https://coutofalcao.com/giselle), researcher and consultant in applied AI, mathematical modeling, machine learning and decision systems.

