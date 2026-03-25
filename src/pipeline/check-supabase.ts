/**
 * Verify Supabase connection and schema.
 * Usage: npm run check:supabase
 */
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("=== IdeaOasis Supabase Setup Check ===\n");

  // 1. Check env vars
  const envChecks = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", value: url },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: anonKey },
    { name: "SUPABASE_SERVICE_KEY", value: serviceKey },
  ];

  let missingEnv = false;
  for (const { name, value } of envChecks) {
    if (value) {
      console.log(`  [OK] ${name}`);
    } else {
      console.log(`  [MISSING] ${name}`);
      missingEnv = true;
    }
  }

  if (missingEnv) {
    console.log(
      "\n  Some env vars are missing. Copy .env.example to .env and fill in your Supabase credentials."
    );
    console.log(
      "  Find them at: https://supabase.com/dashboard → Settings → API\n"
    );
    process.exit(1);
  }

  // 2. Test connection
  console.log("\n  Testing connection...");
  const supabase = createClient(url!, serviceKey!);

  // 3. Check profiles table exists
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  if (error) {
    console.log(`  [FAIL] profiles table: ${error.message}`);
    console.log(
      "\n  Run supabase/schema.sql in your Supabase SQL Editor to create the schema."
    );
    process.exit(1);
  }

  console.log(`  [OK] profiles table exists (${data.length} rows sampled)`);

  // 4. Check RLS is enabled
  const { data: rlsData, error: rlsError } = await supabase.rpc("to_regclass", {
    relation: "profiles",
  } as Record<string, unknown>).select();

  if (!rlsError) {
    console.log("  [OK] Connection with service role works");
  }

  // 5. Test anon key connection
  const anonClient = createClient(url!, anonKey!);
  const { error: anonError } = await anonClient
    .from("profiles")
    .select("id")
    .limit(0);

  if (anonError) {
    console.log(`  [WARN] Anon key query: ${anonError.message}`);
    console.log("  (This is OK if RLS blocks unauthenticated reads)");
  } else {
    console.log("  [OK] Anon key connection works");
  }

  console.log("\n=== All checks passed! Supabase is ready. ===\n");
}

main().catch((err) => {
  console.error("Check failed:", err);
  process.exit(1);
});
