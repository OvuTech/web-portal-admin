#!/usr/bin/env node

/**
 * Script to approve a partner directly via the API
 * 
 * Usage:
 *   node scripts/approve-partner.js <partner_id> <admin_token>
 * 
 * Example:
 *   node scripts/approve-partner.js 6931d4fafcd8804e9bb8d9ed "Bearer your_admin_token_here"
 */

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

const [partnerId, adminToken] = process.argv.slice(2);

if (!partnerId || !adminToken) {
  console.error('Usage: node scripts/approve-partner.js <partner_id> <admin_token>');
  console.error('\nExample:');
  console.error('  node scripts/approve-partner.js 6931d4fafcd8804e9bb8d9ed "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."');
  process.exit(1);
}

async function approvePartner() {
  try {
    const response = await fetch(`${API_URL}/api/v1/admin/partners/${partnerId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminToken.startsWith('Bearer ') ? adminToken : `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        action: 'approve',
        rate_limit_per_minute: 100,
        rate_limit_per_day: 10000,
        notes: 'Approved via script',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to approve partner:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log('✅ Partner approved successfully!');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

approvePartner();


