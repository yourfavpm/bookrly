const fs = require('fs');
const glob = require('glob'); // Not guaranteed to exist. I will just read the files directly since I know their paths.

const paths = [
  'supabase/functions/booking-refund/index.ts',
  'supabase/functions/stripe-subscription-webhook/index.ts',
  'supabase/functions/stripe-subscription-checkout/index.ts',
  'supabase/functions/booking-webhook/index.ts',
  'supabase/functions/connect-onboarding/index.ts',
  'supabase/functions/booking-checkout/index.ts'
];

paths.forEach(p => {
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/apiVersion:\s*"2025-04-30\.basil"/g, 'apiVersion: "2024-04-10"');
  fs.writeFileSync(p, content);
});
console.log('Fixed api versions.');
