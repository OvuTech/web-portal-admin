# OVU Admin Portal

Internal admin portal for OVU staff to manage users, partners, bookings, transactions, and analytics.

## Features

- **Dashboard**: Overview of platform statistics and quick actions
- **Partners Management**: Approve, suspend, and activate partner accounts
- **Users Management**: View and manage all user accounts
- **Bookings Management**: Monitor all bookings across the platform
- **Transactions Management**: Track all payment transactions
- **Analytics**: View platform analytics and insights

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI
- Recharts
- Axios
- React Query

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local
API_URL=https://ovu-transport-staging.fly.dev
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

The admin portal uses the following API endpoints:

- `/api/v1/auth/login` - Admin login
- `/api/v1/auth/me` - Get current admin
- `/api/v1/admin/partners/pending` - List pending partners
- `/api/v1/admin/partners/{id}/approve` - Approve partner
- `/api/v1/admin/partners/{id}/suspend` - Suspend partner
- `/api/v1/admin/partners/{id}/activate` - Activate partner
- `/api/v1/bookings` - Get all bookings
- `/api/v1/payments` - Get all transactions

## Project Structure

```
ovu-admin-portal/
├── app/
│   ├── api/              # API proxy routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/
│   └── layouts/          # Dashboard layout
├── contexts/             # React contexts
├── lib/
│   └── api/             # API service functions
└── providers/            # React providers
```

## Environment Variables

- `API_URL` - Backend API URL (default: https://ovu-transport-staging.fly.dev)
