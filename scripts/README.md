# Admin Scripts

Scripts to help manage partners when you can't access the admin portal.

## Approve Partner

### Using Node.js Script

```bash
node scripts/approve-partner.js <partner_id> <admin_token>
```

**Example:**
```bash
node scripts/approve-partner.js 6931d4fafcd8804e9bb8d9ed "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using Bash Script (curl)

```bash
./scripts/approve-partner.sh <partner_id> <admin_token>
```

**Example:**
```bash
./scripts/approve-partner.sh 6931d4fafcd8804e9bb8d9ed "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using curl directly

```bash
curl -X POST \
  "https://ovu-transport-staging.fly.dev/api/v1/admin/partners/<PARTNER_ID>/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" \
  -d '{
    "action": "approve",
    "rate_limit_per_minute": 100,
    "rate_limit_per_day": 10000,
    "notes": "Approved manually"
  }'
```

## Getting an Admin Token

You'll need to get an admin token from your backend team, or if you have admin credentials, you can login via the API:

```bash
curl -X POST \
  "https://ovu-transport-staging.fly.dev/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

This will return an `access_token` that you can use as the admin token.

## Finding Pending Partners

To see which partners need approval:

```bash
curl -X GET \
  "https://ovu-transport-staging.fly.dev/api/v1/admin/partners/pending" \
  -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>"
```


