# Mini Lead Distribution System

A full-stack lead distribution platform that intelligently assigns incoming leads to providers using mandatory allocation rules, round-robin balancing, quota enforcement, concurrency-safe operations, webhook idempotency, and real-time dashboard updates.

## Live Demo

Frontend:

```txt
https://mini-lead-distribution-system-liard-eta.vercel.app
```

Backend:

```txt
https://mini-lead-system-api.onrender.com
```

## GitHub Repository

```txt
https://github.com/YogeshKumar-0/mini-lead-distribution-system
```

---

# Tech Stack

## Frontend

* Next.js 16
* TypeScript
* Axios
* Socket.IO Client
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# Features

* Smart lead allocation
* Mandatory provider assignment
* Round-robin provider balancing
* Monthly quota enforcement
* Duplicate lead prevention
* Concurrency-safe allocation logic
* Webhook idempotency
* Real-time dashboard updates using Socket.IO
* Provider allocation tracking
* Dashboard analytics

---

# System Architecture

```txt
Frontend (Vercel)
        |
        v
Backend API (Render)
        |
        v
MongoDB Atlas
```

Realtime communication:

```txt
Frontend <---- Socket.IO ----> Backend
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/YogeshKumar-0/mini-lead-distribution-system.git
```

```bash
cd mini-lead-distribution-system
```

---

# Backend Setup

## 2. Navigate to Server

```bash
cd server
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Create Environment Variables

Create a `.env` file inside `server/`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
```

## 5. Start Backend

```bash
npm start
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Frontend Setup

## 6. Navigate to Client

```bash
cd ../client
```

## 7. Install Dependencies

```bash
npm install
```

## 8. Create Environment Variables

Create `.env.local` inside `client/`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 9. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

---

# API Endpoints

## Create Lead

```http
POST /api/leads/create
```

Sample Request:

```json
{
  "name": "Yogesh",
  "phone": "9999999999",
  "city": "Ranchi",
  "serviceType": "Service 1",
  "description": "Need shifting service"
}
```

---

## Dashboard Data

```http
GET /api/dashboard
```

---

## Reset Monthly Quotas

```http
POST /api/webhooks/reset-quota
```

Sample Request:

```json
{
  "eventId": "event_001"
}
```

---

# Database Design

## Collections

### Lead

Stores all incoming leads.

Fields:

* name
* phone
* city
* serviceType
* description
* timestamps

### Provider

Stores provider information.

Fields:

* name
* services
* monthlyQuota
* usedQuota

### Assignment

Stores provider-lead mappings.

Fields:

* leadId
* providerId
* timestamps

### AllocationState

Maintains round-robin indexes.

Fields:

* serviceType
* currentIndex

### WebhookLog

Tracks processed webhook events.

Fields:

* eventId
* processedAt

---

# Allocation Algorithm

The allocation engine follows a hybrid strategy:

## Step 1 — Mandatory Provider Assignment

Each service has fixed mandatory providers.

Example:

```txt
Service 1 -> Provider 1
Service 2 -> Provider 5
Service 3 -> Provider 1 + Provider 4
```

Mandatory providers are always assigned first if quota is available.

---

## Step 2 — Round Robin Allocation

After mandatory allocation, remaining slots are assigned using round-robin balancing.

Example:

```txt
Service 1 Pool:
Provider 2
Provider 3
Provider 4
```

The system rotates allocations evenly using `AllocationState.currentIndex`.

This ensures:

* Fair distribution
* Balanced provider load
* Predictable assignment order

---

## Step 3 — Quota Enforcement

Each provider has:

```txt
monthlyQuota
usedQuota
```

Providers exceeding quota are skipped automatically.

This prevents over-allocation.

---

# How Concurrency Was Handled

Concurrency safety was implemented using atomic MongoDB operations.

## Problem

Simultaneous lead submissions could cause:

* Duplicate provider assignment
* Incorrect quota counts
* Race conditions
* Over-allocation

---

## Solution

The system uses:

```js
findOneAndUpdate()
```

with:

```js
$inc
$expr
```

Example:

```js
await Provider.findOneAndUpdate(
  {
    _id: provider._id,
    $expr: {
      $lt: ["$usedQuota", "$monthlyQuota"]
    }
  },
  {
    $inc: {
      usedQuota: 1
    }
  },
  {
    new: true
  }
)
```

This guarantees:

* Atomic quota updates
* No double allocation
* No quota overflow
* Safe concurrent requests

Round-robin state updates are also atomic.

---

# How Webhook Idempotency Is Ensured

Webhook idempotency prevents duplicate processing of the same event.

## Problem

External systems may retry webhook delivery multiple times.

Without idempotency:

* Quotas could reset multiple times
* Data corruption could occur

---

## Solution

Every webhook contains:

```txt
eventId
```

Before processing:

1. The system checks `WebhookLog`
2. If `eventId` already exists:

   * webhook is ignored
3. Otherwise:

   * webhook is processed
   * eventId is stored

Example flow:

```txt
Incoming Webhook
      |
Check eventId
      |
Already Processed?
   /       \
 YES       NO
  |         |
Ignore   Process + Store
```

This guarantees:

* Safe retries
* No duplicate quota resets
* Consistent state management

---

# Real-Time Dashboard

Socket.IO powers real-time updates.

Whenever:

* a lead is created
* quotas change
* assignments occur

The backend emits events instantly.

Frontend dashboard updates automatically without refresh.

---

# Deployment

## Frontend Deployment

Hosted on Vercel.

Environment Variable:

```env
NEXT_PUBLIC_API_URL=https://mini-lead-system-api.onrender.com
```

---

## Backend Deployment

Hosted on Render.

Environment Variables:

```env
MONGO_URI=your_mongodb_uri
CLIENT_URL=your_frontend_url
```

---

# Evaluation Criteria Coverage

## Correct Provider Allocation

Implemented using:

* Mandatory providers
* Round robin balancing
* Quota validation

## Data Consistency Under Concurrency

Implemented using:

* Atomic MongoDB operations
* Safe quota increments
* Atomic allocation state updates

## Webhook Safety & Idempotency

Implemented using:

* Unique event tracking
* WebhookLog collection
* Duplicate event prevention

## Real-Time Dashboard

Implemented using:

* Socket.IO
* Live dashboard synchronization

## Database Design Quality

Implemented using:

* Normalized collections
* Separation of concerns
* Allocation state tracking
* Assignment tracking

## Code Clarity

Implemented using:

* Modular architecture
* MVC structure
* Service layer separation
* Reusable controllers/routes

---

# Future Improvements

* Authentication & authorization
* Admin dashboard
* Provider analytics charts
* Lead status workflow
* Retry queues using BullMQ
* Docker support
* CI/CD pipelines
* Pagination & filtering
* Rate limiting
* Audit logs
* Notifications

---

# Author

Yogesh Kumar Mallik
