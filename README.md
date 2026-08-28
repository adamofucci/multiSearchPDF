# DocSweep — Multi-PDF Search & Document Audit Web App

> **Search words, phrases, and missing clauses across dozens or hundreds of PDF files simultaneously. 100% private, browser-based, no account required.**

---

## 🌟 Overview & Key Features

- **⚡ Instant In-Memory Search**: Search hundreds of PDFs in parallel using Web Workers and PDF.js directly in the browser.
- **🛡️ 100% Client-Side Privacy**: PDF documents and extracted text never leave your computer or touch backend servers.
- **📊 Document Audit Matrix (Killer Feature)**: Define multiple compliance criteria (e.g. `GDPR`, `Right of Withdrawal`, `Termination`, `Auto-renewal`) and generate an instant compliance grid showing which files pass (✓) or need manual review (✗).
- **📦 In-Browser ZIP Unpacker**: Drop a `.zip` archive containing PDFs or an entire folder directly into the app.
- **💾 Comprehensive Exports**:
  - Export single search results to CSV and JSON.
  - Export full Audit Compliance Matrix to CSV.
  - Download only matching PDFs as a `.zip` directly created in the browser.
  - Download all "Needs Review" / non-compliant PDFs as a `.zip` for legal audits.
- **💳 Fair One-Time Pricing**: Up to 10 PDFs free; one-time unlock passes (€2.99 / €4.99 / €9.99) with Stripe integration. No forced monthly subscriptions.
- **🚀 SEO-Ready**: High-intent landing pages (`/search-multiple-pdfs`, `/pdf-document-audit`, `/find-text-in-multiple-pdfs`, etc.) with dynamic metadata.

---

## 🏗️ Architecture

```
                       ┌─────────────────────────────────────┐
                       │           USER BROWSER              │
                       │                                     │
                       │  • PDF.js in Web Worker             │
                       │  • Text Extraction & Local Index    │
                       │  • Full-Text & Boolean Search       │
                       │  • Document Audit Compliance Engine │
                       │  • JSZip Exporter (.zip, .csv)      │
                       └──────────────────┬──────────────────┘
                                          │
                               (Payment Token Verification)
                                          │
                                          ▼
                       ┌─────────────────────────────────────┐
                       │       FASTAPI BACKEND (Python)      │
                       │                                     │
                       │  • GET /health                      │
                       │  • POST /api/payment/verify-session │
                       │  • POST /api/payment/validate-token │
                       │  • Serves static SPA build in prod  │
                       └─────────────────────────────────────┘
```

---

## 🚀 Running with Docker (Ubuntu / Linux)

### 1. Build and Run Container
```bash
# Clone or copy repo
cd multiSearchPDF

# Run with docker compose
docker compose up --build -d
```

### 2. Access the Application
Open your browser and navigate to:
```
http://localhost:8000
```

### 3. Check Container Health
```bash
curl http://localhost:8000/health
```

---

## 🛠️ Local Development Setup (Without Docker)

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python main.py
# Running on http://localhost:8000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## ☁️ Deployment on Render

This project is pre-configured for **Render** via `render.yaml` and multi-stage `Dockerfile`.

### Method A: Deploy via GitHub (Recommended)
1. Push this repository to your GitHub account (`git push origin main`).
2. Go to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** → **Blueprint** and connect your GitHub repository.
4. Render will automatically detect `render.yaml` and set up the Web Service.

### Method B: Manual Docker Web Service
1. Click **New +** → **Web Service** on Render.
2. Select your repository.
3. Choose **Docker** as the Environment.
4. Set Health Check Path: `/health`.
5. Set Environment Variables in Render Dashboard:
   - `ENVIRONMENT=production`
   - `JWT_SECRET=your-secure-random-32-char-string`
   - `STRIPE_SECRET_KEY=sk_live_...` (optional, for live payments)

---

## 💳 Stripe Configuration & Environment Variables

Copy `.env.example` to `.env`:

```ini
PORT=8000
ENVIRONMENT=production
FREE_PDF_LIMIT=10
JWT_SECRET=generate-a-secure-random-string

# Stripe Backend Secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend Payment Links
VITE_STRIPE_PAYMENT_LINK_299=https://buy.stripe.com/...
VITE_STRIPE_PAYMENT_LINK_499=https://buy.stripe.com/...
VITE_STRIPE_PAYMENT_LINK_999=https://buy.stripe.com/...
```

> **Note**: If Stripe is not yet configured, DocSweep includes a built-in instant demo pass feature so you can test all premium capabilities locally without a live Stripe key.

---

## 🔍 SEO Landing Pages Built-In

The app contains built-in routes for search engine indexing:
- `/` — Homepage & instant search
- `/audit` — Document Audit compliance matrix
- `/search-multiple-pdfs` — Batch PDF search
- `/find-text-in-multiple-pdfs` — Text search across folders
- `/pdf-document-audit` — Contract clause audit
- `/find-word-in-multiple-pdfs` — Single word locator across files
- `/cerca-in-piu-pdf` — Italian high-intent landing page

---

## 🔒 Privacy & Compliance

- **No DB**: No accounts, passwords, or persistent document storage.
- **Memory Destruction**: All PDF buffers and extracted text are cleared upon tab close or page refresh.
- **Analytics**: Privacy-safe event tracking (no document content, queries, or filenames are ever recorded).
