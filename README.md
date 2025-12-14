# Multi-Tenant RBAC Application

This repository contains a full-stack application demonstrating Multi-Tenancy and Role-Based Access Control (RBAC) implemented across a decoupled client (React) and a Node.js/Express API gateway (using the Firebase Admin SDK).

---
## Deployed Link : https://multitenantroleassignment.web.app/
---

## 🚀 How to Run the App Locally
This project requires two separate terminals: one for the backend API and one for the frontend.

### 1. Backend API (Node.js/Express)
   The server enforces all security rules and runs on port 8080.

#### 1- Setup: 

Place your Firebase Admin SDK key in server/serviceAccountKey.json.


#### 2- Run: 

   ### `cd backend`
   ### `npm install`
   ### `node src/index.js`


### 2. Frontend Client (React/Vite)
The client provides the UI and runs on port 5173 (or similar).

####  1- Setup:
### `cd frontend`
### `npm install`

####  2- Run:
   ### `npm run dev`

Open your browser to `http://localhost:5173` to begin testing.

---

##  🏛️ Architecture and Data Model

The system separates concerns across three layers.

### Firestore Collections

| Collection | Purpose | Key Field(s)                         | Notes |
| :--- | :--- |:-------------------------------------| :--- |
| **`tenants`** | Stores friendly names and metadata. | `tenantId`, `name`                   | Used to enrich the user session (e.g., fetching "Alpha Solutions" from "tenantA"). |
| **`orders`** | Core business data. | `tenantId`, `customerName`, `status` | **Every order** must be tagged with its owner's `tenantId` for filtering. |


---

## 🔐 Security Implementation Details

Security is the central feature of this assignment. All logic resides in the **Node.js/Express API**.

### 1. Multi-Tenancy (Data Isolation)

The system ensures users can *never* access data outside their assigned tenant:

* **API Filter:** Every database query in `/server/src/routes/orderRoutes.js` includes a `where('tenantId', '==', req.session.tenantId)` clause.
* **Preventing Tampering:** If a user tries to access a specific order ID (`/orders/:id`), the backend service (`orderService.js`) performs an explicit check: **Does this order's `tenantId` match the user's `req.session.tenantId`?** If not, access is denied (`403 Forbidden`).

### 2. Role-Based Permissions (RBAC)

RBAC logic lives in `/server/src/middleware/rbac.js`. Permissions are checked *before* the route handler executes.

| Role | Access | Specific Restrictions |
| :--- | :--- | :--- |
| **`admin`** | Full **Read/Write/Delete** | Unrestricted access to their tenant's data. |
| **`staff`** | **Read** + Restricted **Write** | **Deletion is denied.** Status updates are limited to only changing an order from `pending` to `in_progress`. |

---

## 💡 Limitations & Future Work

* **Real Authentication**
* **More beautiful design**
* **users Collection**
