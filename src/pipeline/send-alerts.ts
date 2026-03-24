import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { getLatestDigest } from "@/lib/data";
import { getCategoryLabel } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log("[Alerts] Supabase credentials not set, skipping alerts");
    return;
  }
  if (!resendApiKey) {
    console.log("[Alerts] RESEND_API_KEY not set, skipping alerts");
    return;
  }

  const digest = getLatestDigest();
  if (!digest) {
    console.log("[Alerts] No digest found, skipping alerts");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const resend = new Resend(resendApiKey);

  // Get premium users with alert categories set
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, email, alert_categories")
    .eq("is_premium", true)
    .not("alert_categories", "eq", "{}");

  if (error) {
    console.error("[Alerts] Failed to fetch users:", error);
    return;
  }

  if (!users || users.length === 0) {
    console.log("[Alerts] No premium users with alert preferences");
    return;
  }

  console.log(`[Alerts] Processing ${users.length} premium users`);

  for (const user of users) {
    const categories = user.alert_categories as string[];
    const matchingIdeas = digest.ideas.filter((idea) =>
      categories.includes(idea.category)
    );

    if (matchingIdeas.length === 0) continue;

    const categoryLabels = categories.map(getCategoryLabel).join(", ");
    const ideasHtml = matchingIdeas
      .map(
        (idea) => `
        <div style="margin-bottom: 20px; padding: 16px; border-left: 3px solid #2563EB; background: #fafafa; border-radius: 8px;">
          <h3 style="margin: 0 0 4px 0; color: #18181b;">#${idea.rank} ${idea.title_ko}</h3>
          <p style="margin: 0 0 8px 0; color: #71717a; font-size: 14px;">${idea.tagline_en}</p>
          <p style="margin: 0; color: #3f3f46; font-size: 14px;">${idea.summary_ko}</p>
          <a href="${SITE_URL}/idea/${idea.id}/" style="display: inline-block; margin-top: 8px; color: #2563EB; font-size: 14px; text-decoration: none;">자세히 보기 →</a>
        </div>`
      )
      .join("");

    try {
      await resend.emails.send({
        from: "IdeaOasis <alerts@ideaoasis.kr>",
        to: user.email,
        subject: `[IdeaOasis] ${digest.date} — ${matchingIdeas.length}개 ${categoryLabels} 아이디어`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, sans-serif;">
            <h2 style="color: #18181b;">오늘의 ${categoryLabels} 아이디어</h2>
            <p style="color: #71717a; font-size: 14px;">${digest.date} · ${matchingIdeas.length}개 매칭</p>
            ${ideasHtml}
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
            <p style="color: #a1a1aa; font-size: 12px;">
              <a href="${SITE_URL}/settings/" style="color: #a1a1aa;">알림 설정 변경</a> · IdeaOasis
            </p>
          </div>
        `,
      });
      console.log(`  Sent alert to ${user.email} (${matchingIdeas.length} ideas)`);
    } catch (err) {
      console.warn(`  Failed to send to ${user.email}:`, err);
    }
  }

  console.log("[Alerts] Done!");
}

main().catch((err) => {
  console.error("[Alerts] Failed:", err);
  process.exit(1);
});
