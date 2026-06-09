const fs = require('fs');
const path = require('path');

const files = [
  'app/api/admin/brand-assignments/route.ts',
  'app/api/admin/company-brands/route.ts',
  'app/api/admin/power-moves/route.ts',
  'app/api/admin/users/route.ts',
  'app/api/admin/victory-targets/route.ts',
  'app/api/auth/activate/route.ts',
  'app/api/power-move-tracking/route.ts',
];

const pattern = `import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role credentials")
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}`;

const replacement = `import { getAdminClient } from "@/lib/supabase/admin"`;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace the entire getAdminClient implementation with the import
  content = content.replace(pattern, replacement);
  
  // Also handle the Next.js imports
  if (!content.includes('import { getAdminClient }')) {
    // If pattern didn't match, try a different approach
    const lines = content.split('\n');
    const newLines = [];
    let skipUntil = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (i <= skipUntil) continue;
      
      if (lines[i].includes('import { createClient }')) {
        newLines.push('import { getAdminClient } from "@/lib/supabase/admin"');
        skipUntil = i;
      } else if (lines[i].includes('const supabaseUrl = ') && skipUntil === -1) {
        // Skip until we find the closing brace of getAdminClient
        skipUntil = i;
        while (skipUntil < lines.length && !lines[skipUntil].includes('const supabaseUrl = ')) {
          skipUntil++;
        }
        while (skipUntil < lines.length && !lines[skipUntil].includes('function getAdminClient()')) {
          skipUntil++;
        }
        while (skipUntil < lines.length && !lines[skipUntil].includes('}')) {
          skipUntil++;
        }
        newLines.push('import { getAdminClient } from "@/lib/supabase/admin"');
      } else {
        newLines.push(lines[i]);
      }
    }
    content = newLines.join('\n');
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated: ${file}`);
});
